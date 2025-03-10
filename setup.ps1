# Install required modules
Write-Host "Installing required PowerShell modules..." -ForegroundColor Cyan
Install-Module -Name PSWebDriver -Force -Scope CurrentUser
Install-Module -Name Microsoft.PowerShell.SecretManagement -Force -Scope CurrentUser
Install-Module -Name Microsoft.PowerShell.SecretStore -Force -Scope CurrentUser

# Create automation directory if it doesn't exist
if (-not (Test-Path "automation")) {
    New-Item -ItemType Directory -Path "automation"
}

# Install Node.js packages
Write-Host "Installing Node.js packages..." -ForegroundColor Cyan
npm install puppeteer dotenv selenium-webdriver

# Install Python packages
Write-Host "Installing Python packages..." -ForegroundColor Cyan
pip install selenium python-dotenv requests beautifulsoup4

# Configure Secret Store
Write-Host "Configuring secure credential storage..." -ForegroundColor Cyan
Import-Module Microsoft.PowerShell.SecretManagement
Import-Module Microsoft.PowerShell.SecretStore

# Store credentials securely
Write-Host "Storing credentials..." -ForegroundColor Cyan
$securePassword = ConvertTo-SecureString 'C^F]TDaQ0h579taQ2oKI|(o' -AsPlainText -Force
Set-Secret -Name "DirectAdminPassword" -Secret $securePassword

# Import environment variables
Write-Host "Importing environment variables..." -ForegroundColor Cyan
$env:DIRECTADMIN_URL = "https://web0151.zxcs.nl:2222"
$env:DIRECTADMIN_USER = "u127684p143111"
$env:DIRECTADMIN_PASSWORD = 'C^F]TDaQ0h579taQ2oKI|(o'

# Test connections
Write-Host "Testing connections..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $env:DIRECTADMIN_URL -UseBasicParsing
    Write-Host "DirectAdmin connection successful!" -ForegroundColor Green
} catch {
    Write-Host "DirectAdmin connection failed: $_" -ForegroundColor Red
}

Write-Host "Setup completed!" -ForegroundColor Green 