import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

/**
 * Prompt user to agree to Minecraft EULA and Privacy Policy
 * Installation will abort unless the user explicitly agrees.
 */
function promptEulaAgreement() {
    const EULA_URL = "https://www.minecraft.net/en-us/eula";
    const PRIVACY_URL = "https://go.microsoft.com/fwlink/?LinkId=521839";

    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log("Before installing Bedrock Dedicated Server, you must agree to:");
        console.log(" - Minecraft End User License Agreement");
        console.log(" - Privacy Policy");
        console.log("");
        console.log("EULA: " + EULA_URL);
        console.log("Privacy Policy: " + PRIVACY_URL);
        console.log("");

        rl.question("Do you agree? (y/n): ", (answer) => {
            rl.close();

            const normalized = answer.trim().toLowerCase();
            if (normalized === "y" || normalized === "yes") {
                resolve();
            } else {
                reject(new Error("EULA agreement required to continue."));
            }
        });
    });
}

import {
    getLatestBDSUrl,
    downloadFile,
    backupServer,
    extractZip,
    removeFile
} from "./utils.js";

// Resolve __dirname for ES module environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command-line arguments
const args = process.argv.slice(2);
const installDir = args.find(arg => !arg.startsWith("--"));
const noBackup = args.includes("--no-backup");

if (!installDir) {
    console.error("Usage: node index.js <bds_install_path> [--no-backup]");
    process.exit(1);
}

// Normalize and resolve paths
const BDS_PATH = path.resolve(installDir);
const ZIP_PATH = path.join(__dirname, "bds_temp.zip");

/**
 * Main update workflow
 */
async function main() {
    console.log("BDS install path:", BDS_PATH);

    try {
        // Require EULA agreement before proceeding
        await promptEulaAgreement();

        // Create install directory if it does not exist
        if (!fs.existsSync(BDS_PATH)) {
            fs.mkdirSync(BDS_PATH, { recursive: true });
        }

        console.log("Checking latest Bedrock Dedicated Server version...");
        const url = await getLatestBDSUrl();

        console.log("Downloading Bedrock Dedicated Server...");
        await downloadFile(url, ZIP_PATH);

        if (!noBackup) {
            console.log("Creating backup of current server...");
            await backupServer(BDS_PATH);
        } else {
            console.log("Backup skipped (--no-backup)");
        }

        console.log("Extracting server files...");
        await extractZip(ZIP_PATH, BDS_PATH);

        console.log("Update completed successfully.");
    } catch (err) {
        console.error("Bedrock Dedicated Server update failed:", err.message);
        process.exitCode = 1;
    } finally {
        // Always attempt to clean up temporary files
        removeFile(ZIP_PATH);
    }
}

main();
