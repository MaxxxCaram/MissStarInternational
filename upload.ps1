# Download and install WinSCP .NET assembly
$assemblyPath = "$env:TEMP\WinSCPnet.dll"
if (-not (Test-Path $assemblyPath)) {
    Invoke-WebRequest -Uri "https://downloads.sourceforge.net/project/winscp/WinSCP/5.21.5/WinSCP-5.21.5-Automation.zip" -OutFile "$env:TEMP\WinSCP.zip"
    Expand-Archive -Path "$env:TEMP\WinSCP.zip" -DestinationPath $env:TEMP
}

Add-Type -Path $assemblyPath

# FTP Settings
$ftpHost = "web0151.zxcs.nl"
$ftpUser = "u127684p143111"
$ftpPass = "C^F]TDaQ0h579taQ2oKI|(o"

# Local and remote paths
$localPath = "domains/missstarinternational.com/public_html"
$remotePath = "/domains/missstarinternational.com/public_html"

function Upload-File {
    param (
        [string]$localFile,
        [string]$remoteFile
    )
    
    Write-Host "Uploading $localFile to $remoteFile"
    $webclient = New-Object System.Net.WebClient
    $webclient.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    
    try {
        $uri = New-Object System.Uri("ftp://$ftpHost$remoteFile")
        $webclient.UploadFile($uri, $localFile)
        Write-Host "Successfully uploaded $localFile"
    }
    catch {
        Write-Host "Error uploading $localFile : $_"
    }
    finally {
        $webclient.Dispose()
    }
}

Write-Host "Starting upload process..."

# Upload main index.html
Upload-File "$localPath/index.html" "$remotePath/index.html"

# Upload flags
Get-ChildItem "$localPath/assets/images/flags" -Filter "*.svg" | ForEach-Object {
    Upload-File $_.FullName "$remotePath/assets/images/flags/$($_.Name)"
}

# Upload logo
Get-ChildItem "$localPath/assets/images/logo" -Filter "*.png" | ForEach-Object {
    Upload-File $_.FullName "$remotePath/assets/images/logo/$($_.Name)"
}

# Upload language files
foreach ($lang in @("en", "es", "pt", "vi", "th")) {
    if (Test-Path "$localPath/$lang/index.html") {
        Upload-File "$localPath/$lang/index.html" "$remotePath/$lang/index.html"
    }
}

Write-Host "Upload process completed." 