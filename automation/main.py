from directadmin import DirectAdminAPI
import json
import os
from dotenv import load_dotenv

def create_email_accounts():
    """Crear cuentas de correo electrónico"""
    try:
        print("🔄 Iniciando proceso de creación de cuentas de correo...")
        
        # Cargar cuentas desde el archivo JSON
        with open('email_accounts.json', 'r') as f:
            accounts = json.load(f)
        
        # Inicializar DirectAdmin API
        da = DirectAdminAPI()
        
        # Probar conexión
        if not da.test_connection():
            print("❌ No se pudo conectar con DirectAdmin")
            return False
        
        # Crear cuentas de correo
        success = True
        for account in accounts:
            # Crear cuenta
            if not da.create_email_account(
                account['emailUser'],
                account['domain'],
                account['password']
            ):
                success = False
                continue
            
            # Verificar creación
            if not da.verify_email_account(
                account['emailUser'],
                account['domain']
            ):
                success = False
                continue
        
        # Listar todas las cuentas creadas
        da.list_email_accounts()
        
        # Cerrar sesión
        da.close()
        
        return success
        
    except Exception as e:
        print(f"❌ Error al crear las cuentas de correo: {str(e)}")
        return False

if __name__ == "__main__":
    load_dotenv()
    if create_email_accounts():
        print("✅ Proceso completado exitosamente")
    else:
        print("❌ El proceso falló") 