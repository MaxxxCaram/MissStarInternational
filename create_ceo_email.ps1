# Script to create CEO email account in DirectAdmin
# DirectAdmin Credentials
$directAdminUrl = "https://web0151.zxcs.nl:2222"
$username = "u127684p143111"
$password = '9h[Np*.K0_>`*=64}F'

# Function to create an email account
function New-EmailAccount {
    param (
        [string]$emailUser,
        [string]$domain,
        [System.Security.SecureString]$emailPassword,
        [int]$quota = 1024  # Quota in MB, default 1GB
    )

    # Convert SecureString to plain text for API call
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
    } finally {
        # Clean up the unmanaged memory
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    }
}

# Create CEO email account
Write-Host "Creating CEO email account..." -ForegroundColor Cyan
$ceoPassword = "CeoMSI2023!" | ConvertTo-SecureString -AsPlainText -Force
New-EmailAccount -emailUser "ceo" -domain "missstarinternational.com" -emailPassword $ceoPassword
Write-Host "Process completed." -ForegroundColor Cyan

# Restore certificate validation
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = $null 