# Script to create CEO email account in DirectAdmin
# DirectAdmin Credentials
$directAdminUrl = "https://web0151.zxcs.nl:2222"
$username = "u127684p143111"
$password = 'C^F]TDaQ0h579taQ2oKI|(o'

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
        
        # Make API request and store response
        $apiResponse = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -Headers $headers -UseBasicParsing
        
        # Process the response
        if ($apiResponse.StatusCode -eq 200) {
            # Check if the response content indicates success
            if ($apiResponse.Content -match "error") {
                Write-Host "API Error: $($apiResponse.Content)" -ForegroundColor Red
                return $false
            }
            Write-Host "Email account $emailUser@$domain created successfully." -ForegroundColor Green
            # Log the successful creation
            Write-Host "Response details: $($apiResponse.Content)" -ForegroundColor Gray
            return $true
        } else {
            Write-Host "Error creating email account. Status code: $($apiResponse.StatusCode)" -ForegroundColor Red
            Write-Host "Error details: $($apiResponse.Content)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Request error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Response status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
            Write-Host "Response status description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        }
        return $false
    }
}

# Create CEO email account
Write-Host "Creating CEO email account..." -ForegroundColor Cyan
$ceoPassword = "MissStarCEO2024!" | ConvertTo-SecureString -AsPlainText -Force
$result = New-EmailAccount -emailUser "ceo" -domain "missstarinternational.com" -emailPassword $ceoPassword

if ($result) {
    Write-Host "CEO email account creation completed successfully." -ForegroundColor Green
} else {
    Write-Host "CEO email account creation failed." -ForegroundColor Red
}

# Restore certificate validation
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = $null 