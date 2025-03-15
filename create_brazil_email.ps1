# Script to create Brazil email account in DirectAdmin
# DirectAdmin Credentials
$directAdminUrl = "https://web0151.zxcs.nl:2222"
$username = "u127684p143111"
$password = '9h[Np*.K0_>`*=64}F'

# Function to create an email account
function New-EmailAccount {
    param (
        [string]$emailUser,
        [string]$domain,
        [SecureString]$emailPassword,
        [int]$quota = 1024  # Quota in MB, default 1GB
    )

    # Convert SecureString to plain text using NetworkCredential
    $cred = New-Object System.Net.NetworkCredential("", $emailPassword)
    $plainPassword = $cred.Password

    # Encode credentials for basic authentication
    $base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($username):$($password)"))
    $headers = @{
        Authorization = "Basic $base64AuthInfo"
    }

    # Build URL and parameters for DirectAdmin API
    $apiUrl = "$directAdminUrl/CMD_API_POP"
    $body = @{
        action = "create"
        domain = $domain
        user = $emailUser
        passwd = $plainPassword
        passwd2 = $plainPassword
        quota = $quota
    }

    try {
        # Ignore SSL certificate errors
        [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
        
        # Make API request
        $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -Headers $headers -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "Email account $emailUser@$domain created successfully." -ForegroundColor Green
            return $true
        } else {
            Write-Host "Error creating email account: $($response.Content)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Request error: $_" -ForegroundColor Red
        return $false
    }
}

# Create Brazil email account
Write-Host "Creating Brazil email account..." -ForegroundColor Cyan
$brazilPassword = "BrasilMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
New-EmailAccount -emailUser "brasil" -domain "missstarinternational.com" -emailPassword $brazilPassword
Write-Host "Process completed." -ForegroundColor Cyan

# Restore certificate validation
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = $null 