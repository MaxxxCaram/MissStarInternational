import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
import time
import json

class VimexxAutomation:
    def __init__(self):
        load_dotenv()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.email = os.getenv('VIMEXX_EMAIL')
        self.password = os.getenv('VIMEXX_PASSWORD')

    def login(self):
        try:
            print("🔄 Accediendo a la página de inicio de sesión de Vimexx...")
            # Obtener el token CSRF
            login_page = self.session.get('https://my.vimexx.nl/login')
            soup = BeautifulSoup(login_page.text, 'html.parser')
            csrf_token = soup.find('meta', {'name': '_token'})['content']
            
            print("🔑 Iniciando sesión...")
            login_data = {
                '_token': csrf_token,
                'email': self.email,
                'password': self.password,
                'remember': '1'
            }
            
            response = self.session.post(
                'https://my.vimexx.nl/login',
                data=login_data,
                allow_redirects=True
            )
            
            if response.url == 'https://my.vimexx.nl/dashboard':
                print("✅ Inicio de sesión exitoso")
                return True
            else:
                print("❌ Error en el inicio de sesión")
                return False
            
        except Exception as e:
            print(f"❌ Error en el inicio de sesión: {str(e)}")
            return False

    def verify_hosting(self):
        try:
            print("🔍 Verificando estado del hosting...")
            response = self.session.get('https://my.vimexx.nl/api/userhosting/status')
            
            if response.status_code == 200:
                data = response.json()
                status = data.get('status', '').upper()
                is_ok = status == "OK" or "ACTIVE" in status
                print(f"📊 Estado del hosting: {status}")
                return is_ok
            else:
                print(f"❌ Error al obtener el estado del hosting: {response.status_code}")
                return False
            
        except Exception as e:
            print(f"❌ Error al verificar el estado del hosting: {str(e)}")
            return False

    def access_directadmin(self):
        try:
            print("🔄 Accediendo a DirectAdmin...")
            response = self.session.get('https://my.vimexx.nl/userhosting/directadmin/login')
            
            if response.status_code == 200:
                print("✅ Acceso a DirectAdmin exitoso")
                return True
            else:
                print(f"❌ Error al acceder a DirectAdmin: {response.status_code}")
                return False
            
        except Exception as e:
            print(f"❌ Error al acceder a DirectAdmin: {str(e)}")
            return False

    def close(self):
        if self.session:
            self.session.close()

# Example usage
if __name__ == "__main__":
    vx = VimexxAutomation()
    try:
        vx.login()
        if vx.verify_hosting():
            print("✅ All systems operational")
            vx.access_directadmin()
        else:
            print("❌ Hosting status check failed")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        vx.close() 