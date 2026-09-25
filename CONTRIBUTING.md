# Contributing

Thank you for helping improve CoworkSuperUser.

## Before opening an issue

- Search existing issues.
- Remove tenant names, identities, query IDs, URLs, secrets, and export content.
- Reproduce the problem with fabricated data when possible.
- Include the Power BI Desktop version, template variant, report version, page name, and exact error text.

Do not attach production Viva Insights query results or exported person-level data.

## Develop locally

1. Clone the repository on Windows.
2. Choose one source project:
   - `src\direct-query\CoworkVivaV3.pbip`
   - `src\optimized-export\CoworkVivaV3.pbip`
3. Keep `.pbi` local state and all production data outside commits.
4. Update both report variants when report behavior changes.
5. Validate every visible page, bookmark action, filter drawer, navigation control, and hidden bookmark state.
6. Run:

   ```powershell
   .\tools\validate.ps1
   ```

7. Rebuild public assets when the report changes:

   ```powershell
   python .\tools\build_public_images.py --source C:\path\to\fabricated\screenshots
   npm install
   npm run build:storyboard
   .\media\build_walkthrough.ps1
   ```

8. Export data-free PBIT files only after confirming that customer data, query identifiers, local paths, cached models, and machine-bound security state are absent.

## Pull requests

A pull request should:

- Explain the user problem and resulting behavior.
- Keep unrelated changes out of the diff.
- Update both connection variants when shared behavior changes.
- Update setup and interpretation guidance when calculations change.
- Use only deterministic fabricated data in tests, screenshots, decks, and videos.
- Preserve the Start Here experience and privacy controls.
- Update `CHANGELOG.md` and `validation\release-manifest.json` for release changes.

By contributing, you agree to follow the [Microsoft Open Source Code of Conduct](CODE_OF_CONDUCT.md).
