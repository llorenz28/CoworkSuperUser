param(
    [Parameter(Mandatory = $true)]
    [string]$PbipPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath,

    [Parameter(Mandatory = $true)]
    [string]$Description,

    [int]$TimeoutSeconds = 600
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $PbipPath)) {
    throw "PBIP not found: $PbipPath"
}

Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
Add-Type -AssemblyName System.Windows.Forms
Add-Type @'
using System;
using System.Runtime.InteropServices;
public class NativeMouse {
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll")] public static extern void mouse_event(uint flags, uint dx, uint dy, uint data, uint extraInfo);
    public const uint LeftDown = 0x0002;
    public const uint LeftUp = 0x0004;
}
'@

function Click-Element {
    param([Windows.Automation.AutomationElement]$Element)

    $point = $Element.GetClickablePoint()
    [NativeMouse]::SetCursorPos([int]$point.X, [int]$point.Y) | Out-Null
    [NativeMouse]::mouse_event([NativeMouse]::LeftDown, 0, 0, 0, 0)
    [NativeMouse]::mouse_event([NativeMouse]::LeftUp, 0, 0, 0, 0)
}

function Find-Element {
    param(
        [Windows.Automation.AutomationElement]$Root,
        [string]$Name,
        [string]$AutomationId = "",
        [string]$ControlType = ""
    )

    $conditions = New-Object System.Collections.Generic.List[Windows.Automation.Condition]
    if ($Name) {
        $conditions.Add(
            [Windows.Automation.PropertyCondition]::new(
                [Windows.Automation.AutomationElement]::NameProperty,
                $Name
            )
        )
    }
    if ($AutomationId) {
        $conditions.Add(
            [Windows.Automation.PropertyCondition]::new(
                [Windows.Automation.AutomationElement]::AutomationIdProperty,
                $AutomationId
            )
        )
    }
    if ($ControlType) {
        $type = [Windows.Automation.ControlType]::$ControlType
        $conditions.Add(
            [Windows.Automation.PropertyCondition]::new(
                [Windows.Automation.AutomationElement]::ControlTypeProperty,
                $type
            )
        )
    }

    $condition = if ($conditions.Count -eq 1) {
        $conditions[0]
    } else {
        [Windows.Automation.AndCondition]::new($conditions.ToArray())
    }

    return $Root.FindFirst([Windows.Automation.TreeScope]::Descendants, $condition)
}

Remove-Item $OutputPath -Force -ErrorAction SilentlyContinue
Start-Process $PbipPath

$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
$desktopPid = $null
do {
    Start-Sleep -Seconds 2
    $status = powerbi-desktop status | ConvertFrom-Json
    $instance = $status.instances |
        Where-Object currentFilePath -eq $PbipPath |
        Where-Object bridgeStatus -eq "connected" |
        Select-Object -Last 1
    if ($instance) {
        $desktopPid = [int]$instance.pid
        break
    }
} while ((Get-Date) -lt $deadline)

if (-not $desktopPid) {
    throw "Power BI Desktop did not load the PBIP within $TimeoutSeconds seconds."
}

$process = Get-Process -Id $desktopPid
$main = [Windows.Automation.AutomationElement]::FromHandle($process.MainWindowHandle)
[Microsoft.VisualBasic.Interaction]::AppActivate($desktopPid) | Out-Null
Start-Sleep -Milliseconds 500

$fileTab = $null
for ($attempt = 0; $attempt -lt 30 -and -not $fileTab; $attempt++) {
    $fileTab = Find-Element -Root $main -AutomationId "Ribbon-file"
    if (-not $fileTab) {
        Start-Sleep -Seconds 1
    }
}
if (-not $fileTab) {
    throw "File tab did not appear."
}
$fileTab.GetCurrentPattern([Windows.Automation.SelectionItemPattern]::Pattern).Select()
Start-Sleep -Seconds 3

$exportTab = $null
for ($attempt = 0; $attempt -lt 10 -and -not $exportTab; $attempt++) {
    $exportTab = Find-Element -Root $main -Name "Export" -ControlType "TabItem"
    if (-not $exportTab) {
        Start-Sleep -Seconds 1
    }
}
if (-not $exportTab) {
    throw "Export tab did not appear in the File backstage."
}
$exportTab.GetCurrentPattern([Windows.Automation.SelectionItemPattern]::Pattern).Select()
Start-Sleep -Seconds 2

$templateButton = $null
for ($attempt = 0; $attempt -lt 10 -and -not $templateButton; $attempt++) {
    $templateButton = Find-Element -Root $main -Name "Power BI template" -ControlType "Button"
    if (-not $templateButton) {
        Start-Sleep -Seconds 1
    }
}
if (-not $templateButton) {
    throw "Power BI template export button did not appear."
}
Click-Element $templateButton
Start-Sleep -Seconds 2

$automationRoot = [Windows.Automation.AutomationElement]::RootElement
$dialogCondition = [Windows.Automation.AndCondition]::new(
    [Windows.Automation.PropertyCondition]::new(
        [Windows.Automation.AutomationElement]::ProcessIdProperty,
        $desktopPid
    ),
    [Windows.Automation.PropertyCondition]::new(
        [Windows.Automation.AutomationElement]::AutomationIdProperty,
        "ExportTemplateDialog"
    )
)
$metadataDialog = $null
$dialogDeadline = (Get-Date).AddSeconds($TimeoutSeconds)
while (-not $metadataDialog -and (Get-Date) -lt $dialogDeadline) {
    $metadataDialog = $automationRoot.FindFirst(
        [Windows.Automation.TreeScope]::Descendants,
        $dialogCondition
    )
    if (-not $metadataDialog) {
        Start-Sleep -Seconds 1
    }
}
if (-not $metadataDialog) {
    throw "Export template metadata dialog did not appear."
}

$editCondition = [Windows.Automation.PropertyCondition]::new(
    [Windows.Automation.AutomationElement]::ControlTypeProperty,
    [Windows.Automation.ControlType]::Edit
)
$edits = $metadataDialog.FindAll(
    [Windows.Automation.TreeScope]::Descendants,
    $editCondition
)
$descriptionField = $edits.Item($edits.Count - 1)
$descriptionField.GetCurrentPattern(
    [Windows.Automation.ValuePattern]::Pattern
).SetValue($Description)

$okButton = Find-Element -Root $metadataDialog -Name "OK" -ControlType "Button"
$okButton.GetCurrentPattern([Windows.Automation.InvokePattern]::Pattern).Invoke()
Start-Sleep -Seconds 2

$saveAs = Find-Element -Root $main -Name "Save As" -ControlType "Window"
if (-not $saveAs) {
    throw "Save As dialog did not appear."
}

$controls = $saveAs.FindAll(
    [Windows.Automation.TreeScope]::Descendants,
    [Windows.Automation.Condition]::TrueCondition
)
$fileNameControl = $null
$saveButton = $null
for ($index = 0; $index -lt $controls.Count; $index++) {
    $control = $controls.Item($index)
    if (
        $control.Current.ClassName -eq "Edit" -and
        $control.Current.AutomationId -eq "1001"
    ) {
        $fileNameControl = $control
    }
    if (
        $control.Current.Name -eq "Save" -and
        $control.Current.AutomationId -eq "1"
    ) {
        $saveButton = $control
    }
}

if (-not $fileNameControl -or -not $saveButton) {
    throw "Could not identify the Save As file name and Save controls."
}

Click-Element $fileNameControl
[Windows.Forms.SendKeys]::SendWait("^a")
[Windows.Forms.SendKeys]::SendWait($OutputPath)
Click-Element $saveButton

$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
do {
    Start-Sleep -Seconds 2
} while (-not (Test-Path $OutputPath) -and (Get-Date) -lt $deadline)

if (-not (Test-Path $OutputPath)) {
    throw "PBIT export was not created within $TimeoutSeconds seconds."
}

Start-Sleep -Seconds 3
$hash = Get-FileHash $OutputPath -Algorithm SHA256
$result = [PSCustomObject]@{
    Path = $OutputPath
    Bytes = (Get-Item $OutputPath).Length
    SHA256 = $hash.Hash
    DesktopPid = $desktopPid
}

Stop-Process -Id $desktopPid -Force
$result
