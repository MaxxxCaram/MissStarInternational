# Script para crear cuentas de correo en DirectAdmin
# Credenciales de DirectAdmin
$directAdminUrl = "https://web0151.zxcs.nl:2222"
$username = "u127684p143111"
$password = '9h[Np*.K0_>`*=64}F'

# Función para crear una cuenta de correo
function Create-EmailAccount {
    param (
        [string]$emailUser,
        [string]$domain,
        [string]$emailPassword,
        [int]$quota = 1024  # Cuota en MB, por defecto 1GB
    )

    # Codificar credenciales para autenticación básica
    $base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($username):$($password)"))
    $headers = @{
        Authorization = "Basic $base64AuthInfo"
    }

    # Construir la URL y los parámetros para la API de DirectAdmin
    $apiUrl = "$directAdminUrl/CMD_API_POP"
    $body = @{
        action = "create"
        domain = $domain
        user = $emailUser
        passwd = $emailPassword
        passwd2 = $emailPassword
        quota = $quota
    }

    try {
        # Ignorar errores de certificado SSL
        [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
        
        # Hacer la solicitud a la API
        $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -Headers $headers -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "Cuenta de correo $emailUser@$domain creada exitosamente." -ForegroundColor Green
            return $true
        } else {
            Write-Host "Error al crear la cuenta de correo: $($response.Content)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Error en la solicitud: $_" -ForegroundColor Red
        return $false
    }
}

# Lista de cuentas de correo a crear
$emailAccounts = @(
    @{
        emailUser = "brasil"
        domain = "missstarinternational.com"
        password = "BrasilMSI2023!"
    },
    @{
        emailUser = "usa"
        domain = "missstarinternational.com"
        password = "UsaMSI2023!"
    },
    @{
        emailUser = "españa"
        domain = "missstarinternational.com"
        password = "EspañaMSI2023!"
    },
    @{
        emailUser = "info"
        domain = "missstarinternational.com"
        password = "InfoMSI2023!"
    },
    @{
        emailUser = "admin"
        domain = "missstarinternational.com"
        password = "AdminMSI2023!"
    },
    @{
        emailUser = "media"
        domain = "missstarinternational.com"
        password = "MediaMSI2023!"
    },
    @{
        emailUser = "support"
        domain = "missstarinternational.com"
        password = "SupportMSI2023!"
    }
)

# Crear cada cuenta de correo
Write-Host "Iniciando creación de cuentas de correo..." -ForegroundColor Cyan
foreach ($account in $emailAccounts) {
    Write-Host "Creando cuenta: $($account.emailUser)@$($account.domain)..." -ForegroundColor Yellow
    Create-EmailAccount -emailUser $account.emailUser -domain $account.domain -emailPassword $account.password
}
Write-Host "Proceso completado." -ForegroundColor Cyan

# Restaurar la validación de certificados
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = $null 