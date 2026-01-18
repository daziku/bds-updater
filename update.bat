@echo off
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

node bds_update.js "../bedrock_server"

pause
