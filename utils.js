import fs from "fs";
import fsExtra from "fs-extra";
import AdmZip from "adm-zip";

/**
 * Fetch the latest Bedrock Dedicated Server (Windows) download URL
 * from Mojang's official API.
 */
export async function getLatestBDSUrl() {
    const res = await fetch(
        "https://net-secondary.web.minecraft-services.net/api/v1.0/download/links"
    );

    if (!res.ok) {
        throw new Error(`API request failed: ${res.statusText}`);
    }

    const data = await res.json();

    // Find the Windows Bedrock Dedicated Server entry
    const winBDS = data.result.links.find(
        link => link.downloadType === "serverBedrockWindows"
    );

    if (!winBDS) {
        throw new Error("Windows BDS download link not found");
    }

    return winBDS.downloadUrl;
}

/**
 * Download a file from the given URL and save it to the specified path.
 */
export async function downloadFile(url, outputPath) {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Download failed: ${res.statusText}`);
    }

    // Convert response to a Buffer and write to disk
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
}

/**
 * Create a backup of the existing BDS directory.
 * The backup will be stored as "<serverPath>_backup".
 */
export async function backupServer(serverPath) {
    const backupPath = `${serverPath}_backup`;

    if (fsExtra.existsSync(serverPath)) {
        // Remove old backup if it exists, then copy current server files
        await fsExtra.remove(backupPath).catch(() => {});
        await fsExtra.copy(serverPath, backupPath);
    }
}

/**
 * Extract the downloaded ZIP file into the target directory.
 * Existing files will be overwritten.
 */
export async function extractZip(zipPath, targetPath) {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(targetPath, true);
}

/**
 * Remove a temporary file if it exists.
 */
export function removeFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
