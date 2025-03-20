# Script to create email accounts for countries in DirectAdmin
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

# List of countries to create email accounts
$countries = @(
    @{
        country = "thailand"
        password = "ThailandMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        country = "spain"
        password = "SpainMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        country = "peru"
        password = "PeruMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        country = "vietnam"
        password = "VietnamMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        country = "netherlands"
        password = "NetherlandsMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        country = "mexico"
        password = "MexicoMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    },
    @{
        country = "argentina"
        password = "ArgentinaMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
    }
)

# Create email accounts for each country
Write-Host "Starting email accounts creation..." -ForegroundColor Cyan
foreach ($country in $countries) {
    Write-Host "Creating account for $($country.country)..." -ForegroundColor Yellow
    New-EmailAccount -emailUser $country.country -domain "missstarinternational.com" -emailPassword $country.password
}
Write-Host "Process completed." -ForegroundColor Cyan

# Restore certificate validation
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = $null 