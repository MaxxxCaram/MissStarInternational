# Script to create email accounts in DirectAdmin
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

    # Convert SecureString to plain text for API
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($emailPassword)
    $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

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
                Write-Host "API Error for $emailUser@$domain : $($apiResponse.Content)" -ForegroundColor Red
                return $false
            }
            Write-Host "Email account $emailUser@$domain created successfully." -ForegroundColor Green
            # Log the successful creation
            Write-Host "Response details: $($apiResponse.Content)" -ForegroundColor Gray
            return $true
        } else {
            Write-Host "Error creating email account $emailUser@$domain. Status code: $($apiResponse.StatusCode)" -ForegroundColor Red
            Write-Host "Error details: $($apiResponse.Content)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Request error for $emailUser@$domain : $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Response status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
            Write-Host "Response status description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        }
        return $false
    } finally {
        # Clean up the BSTR
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    }
}

# List of email accounts to create
$emailAccounts = @(
    @{
        emailUser = "brasil"
        domain = "missstarinternational.com"
        password = "BrasilMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        emailUser = "usa"
        domain = "missstarinternational.com"
        password = "UsaMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        emailUser = "españa"
        domain = "missstarinternational.com"
        password = "EspañaMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        emailUser = "info"
        domain = "missstarinternational.com"
        password = "InfoMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        emailUser = "admin"
        domain = "missstarinternational.com"
        password = "AdminMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        emailUser = "media"
        domain = "missstarinternational.com"
        password = "MediaMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        emailUser = "support"
        domain = "missstarinternational.com"
        password = "SupportMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    }
)

# Create each email account
Write-Host "Starting email accounts creation..." -ForegroundColor Cyan
$successCount = 0
$failureCount = 0

foreach ($account in $emailAccounts) {
    Write-Host "Creating account: $($account.emailUser)@$($account.domain)..." -ForegroundColor Yellow
    $result = New-EmailAccount -emailUser $account.emailUser -domain $account.domain -emailPassword $account.password
    if ($result) {
        $successCount++
    } else {
        $failureCount++
    }
}

# Display summary
Write-Host "`nEmail Account Creation Summary:" -ForegroundColor Cyan
Write-Host "Successfully created: $successCount" -ForegroundColor Green
Write-Host "Failed to create: $failureCount" -ForegroundColor $(if ($failureCount -gt 0) { "Red" } else { "Green" })
Write-Host "Total attempted: $($emailAccounts.Count)" -ForegroundColor Cyan

# Restore certificate validation
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = $null 