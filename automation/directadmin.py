import requests
import os
from dotenv import load_dotenv
import json
import base64
import urllib3

# Desactivar advertencias de SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class DirectAdminAPI:
    def __init__(self):
        load_dotenv()
        self.username = os.getenv('DIRECTADMIN_USER')
        self.password = os.getenv('DIRECTADMIN_PASSWORD')
        self.domain = os.getenv('DIRECTADMIN_DOMAIN')
        self.base_url = f'https://{self.domain}:2222'
        
        # Configurar sesión
        self.session = requests.Session()
        self.session.verify = False  # Ignorar verificación SSL
        
        # Configurar autenticación básica
        auth = base64.b64encode(f"{self.username}:{self.password}".encode()).decode()
        self.session.headers.update({
            'Authorization': f'Basic {auth}',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def test_connection(self):
        try:
            print("🔄 Probando conexión con DirectAdmin...")
            response = self.session.get(f'{self.base_url}/CMD_API_SHOW_DOMAINS')
            
            if response.status_code == 200:
                print("✅ Conexión exitosa con DirectAdmin")
                return True
            else:
                print(f"❌ Error al conectar con DirectAdmin: {response.status_code}")
                print(f"Respuesta: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error al conectar con DirectAdmin: {str(e)}")
            return False

    def create_email_account(self, email_user, domain, email_password):
        try:
            print(f"🔄 Creando cuenta de correo {email_user}@{domain}...")
            
            # Determinar cuota y límites basados en el tipo de cuenta
            corporate_accounts = ['info', 'press', 'marketing', 'sponsors', 'casting', 'partners']
            quota = '2048' if email_user in corporate_accounts else '500'  # 2GB para cuentas corporativas
            limit = '500' if email_user in corporate_accounts else '200'  # 500 emails para cuentas corporativas
            
            # Datos para crear la cuenta
            data = {
                'action': 'create',
                'domain': domain,
                'user': email_user,
                'email': f"{email_user}@{domain}",
                'passwd': email_password,
                'passwd2': email_password,
                'quota': quota,
                'limit': limit
            }
            
            # Crear la cuenta
            response = self.session.post(
                f'{self.base_url}/CMD_API_POP',
                data=data
            )
            
            if response.status_code == 200:
                if 'error=0' in response.text:
                    print(f"✅ Cuenta de correo {email_user}@{domain} creada exitosamente")
                    print(f"   Cuota: {quota}MB, Límite de envío: {limit} emails/hora")
                    return True
                else:
                    error_text = response.text.split('details=')[1].split('<br>')[0] if 'details=' in response.text else response.text
                    if "already exists" in error_text:
                        print(f"ℹ️ La cuenta de correo {email_user}@{domain} ya existe")
                        return True
                    print(f"❌ Error al crear la cuenta de correo: {error_text}")
                    return False
            else:
                print(f"❌ Error al crear la cuenta de correo: {response.status_code}")
                print(f"Respuesta: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error al crear la cuenta de correo: {str(e)}")
            return False

    def verify_email_account(self, email_user, domain):
        try:
            print(f"🔍 Verificando cuenta de correo {email_user}@{domain}...")
            
            # Obtener lista de cuentas
            response = self.session.get(
                f'{self.base_url}/CMD_API_POP',
                params={'domain': domain}
            )
            
            if response.status_code == 200:
                # Buscar la cuenta en la lista
                accounts = response.text.split('\n')
                for account in accounts:
                    if f'{email_user}@{domain}' in account:
                        print(f"✅ Cuenta de correo {email_user}@{domain} verificada")
                        return True
                
                print(f"❌ No se encontró la cuenta de correo {email_user}@{domain}")
                return False
            else:
                print(f"❌ Error al verificar la cuenta de correo: {response.status_code}")
                print(f"Respuesta: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error al verificar la cuenta de correo: {str(e)}")
            return False

    def delete_email_account(self, email_user, domain):
        try:
            print(f"🗑️ Eliminando cuenta de correo {email_user}@{domain}...")
            
            # Datos para eliminar la cuenta
            data = {
                'action': 'delete',
                'domain': domain,
                'user': email_user,
                'select0': f'{email_user}@{domain}'
            }
            
            # Eliminar la cuenta
            response = self.session.post(
                f'{self.base_url}/CMD_API_POP',
                data=data
            )
            
            if response.status_code == 200 and 'error=0' in response.text:
                print(f"✅ Cuenta de correo {email_user}@{domain} eliminada exitosamente")
                return True
            else:
                print(f"❌ Error al eliminar la cuenta de correo: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error al eliminar la cuenta de correo: {str(e)}")
            return False

    def list_email_accounts(self, domain=None):
        try:
            print("📋 Listando cuentas de correo...")
            
            # Parámetros para listar cuentas
            params = {'domain': domain} if domain else {}
            
            # Obtener lista de cuentas
            response = self.session.get(
                f'{self.base_url}/CMD_API_POP',
                params=params
            )
            
            if response.status_code == 200:
                accounts = []
                for line in response.text.split('\n'):
                    if '@' in line:
                        account = line.strip()
                        if domain is None or domain in account:
                            accounts.append(account)
                
                if accounts:
                    print("✅ Cuentas de correo encontradas:")
                    for account in accounts:
                        print(f"  - {account}")
                else:
                    print("ℹ️ No se encontraron cuentas de correo")
                    
                return accounts
            else:
                print(f"❌ Error al listar las cuentas de correo: {response.status_code}")
                print(f"Respuesta: {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Error al listar las cuentas de correo: {str(e)}")
            return []

    def close(self):
        if self.session:
            self.session.close()

# Example usage
if __name__ == "__main__":
    da = DirectAdminAPI()
    try:
        da.test_connection()
        da.create_email_account("ceo", "missstarinternational.com", "MissStarCEO2024!")
        if da.verify_email_account("ceo", "missstarinternational.com"):
            print("Email account created successfully!")
    finally:
        da.close() 