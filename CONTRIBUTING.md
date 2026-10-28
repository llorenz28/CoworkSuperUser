# Contributing

Thank you for helping improve CoworkSuperUser.

## Before opening an issue

- Search existing issues.
- Remove tenant names, identities, query IDs, URLs, secrets, and export content.
- Reproduce the problem with fabricated data when possible.
- Include the Power BI Desktop version, report version, page name, source type
   (local folder or SharePoint), and exact error text.

Do not attach Consumption Dashboard exports, populated customer PBIX files, or
exported person-level data.

## Develop locally

1. Clone the repository on Windows.
2. Use generated synthetic data for report development and tests. Keep `.pbi`
   local state and all production data outside commits.
3. Treat the projects under `archive\src\` as historical references; they are not the
   source of the current `CoworkSuperUser.pbit` release.
4. Preserve the `cowork*` / `people*` input contract in `docs\SETUP.md` and verify both local-folder
   and SharePoint `DataFolder` behavior when source handling changes.
5. Validate every visible page, filter, navigation control, tooltip, and hidden
   state affected by the change.
6. Run:

   ```powershell
   .\archive\tools\validate.ps1
   ```

7. Rebuild affected public images, the interpretation guide, and walkthrough
   from fabricated data when the report changes. Do not reuse media that shows
   a previous page layout or metric contract.
8. Export a data-free PBIT only after confirming that `DataFolder` is unset and
   customer data, local paths, imported model cache, credentials, and
   machine-bound security state are absent.
9. Verify the synthetic PBIX contains only generated data and update artifact
   hashes and metadata in `archive\validation\release-manifest.json`.

## Pull requests

A pull request should:

- Explain the user problem and resulting behavior.
- Keep unrelated changes out of the diff.
- Update setup and interpretation guidance when calculations change.
- Use only deterministic fabricated data in tests, screenshots, decks, and videos.
- Preserve the report page navigation, Metric Glossary evidence classes, and
   privacy boundaries unless the pull request explicitly changes the contract.
- Keep dashboard-export access requirements and the exact CSV schemas current.
- Update `archive\CHANGELOG.md` and `archive\validation\release-manifest.json` for release changes.

By contributing, you agree to follow the [Microsoft Open Source Code of Conduct](CODE_OF_CONDUCT.md).
