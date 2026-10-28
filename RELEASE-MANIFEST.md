# Release manifest - 2026-10-28

All hashes use SHA-256. The Power BI files are byte-for-byte copies of the supplied replacement template and demonstration report. The guide, video, preview, and sample CSVs are byte-for-byte copies from [llorenz28/CoworkSuperUsage](https://github.com/llorenz28/CoworkSuperUsage/tree/58702fd48cbd0983b4bcb7390f1a4b8d45ebce11).

| File | Bytes | SHA-256 | Role | Verification |
|---|---:|---|---|---|
| `CoworkSuperUser.pbix` | 1,027,436 | `B066FCBF415ECF958C826440355C572F56A9213DFCFFE347D37B9D37609EF4B6` | Supplied demonstration report | Exact supplied-file match; Desktop and privacy revalidation pending |
| `CoworkSuperUser.pbit` | 567,676 | `E182A41DB590D6A2DF0D758647AA8515A97E15B51EA1618F18FDB6B8B91A7A83` | Supplied reusable template | Exact supplied-file match; repository PBIT checks passed; Desktop and full privacy revalidation pending |
| `CoworkSuperUser Interpretation Guide.pptx` | 3,580,368 | `93058C53F522EC2BB385EEAA4D948CEE32D7493AA8A13C15B5FD2A6A3C554E75` | Reference interpretation guide | Exact reference-file match |
| `media/CoworkSuperUser-Walkthrough.mp4` | 55,589,491 | `D7C61347C958AC5452FD27D3D6B87DFC80151F06E90F15F23D38F2CE34425AB7` | Reference walkthrough | Exact reference-file match |
| `assets/overview.png` | 452,926 | `439AB56385B805DC4ED1E2ED33495F837C17D856BFA7825830DA5BEB07C5476C` | Reference Overview preview | Exact reference-file match; not a new screenshot of the replacements |
| `sample-data/CoworkWeeklyMetrics.csv` | 1,102,445 | `1247CE8FB9A6AF5FCFE5558DD1ABFFDEE0BC2A4230AD460A55A8DA4059E5E185` | Synthetic usage facts | 14,599 rows; synthetic identifier formats and metadata joins verified |
| `sample-data/PeopleMetaData.csv` | 9,728 | `72EADEC122F9EFA02EB13C213EA42BDCA4900C3106CA183672636FEECB3B056A` | Synthetic metadata | 240 rows; unique keys and Boolean license flags verified |

The sample CSVs have the documented headers, 219 distinct synthetic active IDs, and no orphan metadata joins. These checks do not certify the contents, saved inputs, refresh behavior, or rendering of the supplied PBIT/PBIX. Earlier package-privacy and PBIR results do not apply to the replacements without revalidation.

The repository's `tools/validate.ps1` passed, including historical PBIP/glossary validation, current artifact hashes, and limited PBIT cache, saved-parameter, and private-path checks. It does not validate the current report's rendering or the supplied PBIX's privacy. Git attributes retain LF line endings for the sample CSVs so their recorded hashes remain stable across checkouts.

Machine-readable artifact hashes and validation scope are recorded in [validation/release-manifest.json](validation/release-manifest.json).
