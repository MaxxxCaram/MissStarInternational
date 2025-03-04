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
foreach ($account in $emailAccounts) {
    Write-Host "Creating account: $($account.emailUser)@$($account.domain)..." -ForegroundColor Yellow
    New-EmailAccount -emailUser $account.emailUser -domain $account.domain -emailPassword $account.password
}
Write-Host "Process completed." -ForegroundColor Cyan

# Restore certificate validation
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = $null 