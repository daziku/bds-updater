# BDS Updater

Automatically downloads and installs the latest version of the Minecraft
Bedrock Dedicated Server (BDS).

---

## Disclaimer

This project is **not affiliated with, endorsed by, or supported by**
Mojang Studios or Microsoft.

All Minecraft-related trademarks, assets, and server binaries
are the property of their respective owners.
This tool only automates the download process from official sources.

---

## Requirements

- Node.js **v24 or later**
- Windows (for `.bat` usage) or any OS that supports Node.js

---

## Usage

### Windows

Double-click or run the following file:

```bat
update.bat
```

### Other Platforms (macOS / Linux)
Open a terminal and run:

```bash
node index.js "<bds_install_path>"
```
Example:

```bash
node index.js ./bedrock_server
```

---

## Command-Line Options

### `--no-backup`

Disables automatic backup creation before updating the server.

By default, this tool creates a backup of the existing BDS directory
before installing a new version.
If this option is specified, the backup step will be skipped.

**Usage:**

```bash
node index.js "<bds_install_path>" --no-backup
```

**Warning**:
When this option is used, the existing server files may be overwritten
without any recovery option.

---

## What This Tool Does

1. Fetches the latest official BDS download URL from Mojang

2. Downloads the server ZIP file

3. Creates a backup of the existing server directory

4. Extracts the new server files

5. Cleans up temporary files after completion

## Backup Behavior

Before installing a new version of the Bedrock Dedicated Server,
this tool automatically creates a backup of the existing server directory.

- The backup is created in the same parent directory
- The folder name will be: `<bds_install_path>_backup`
- If a previous backup already exists, it will be overwritten

This allows you to manually restore the previous server state
in case the update fails or causes unexpected issues.

---

## Legal Notice

This project does NOT distribute Minecraft Bedrock Dedicated Server binaries.

By using this tool, you agree to the Minecraft End User License Agreement
and Privacy Policy. The official terms can be found at:

- https://www.minecraft.net/eula
- https://www.microsoft.com/privacy/privacystatement

---

## License
This project is licensed under the MIT License.