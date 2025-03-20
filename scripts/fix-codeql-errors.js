const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define rutas
const rootDir = path.resolve(__dirname, '..');
const githubDir = path.join(rootDir, '.github');
const workflowsDir = path.join(githubDir, 'workflows');
const codeqlDir = path.join(githubDir, 'codeql');

// Crear directorios si no existen
console.log('🚀 Configurando directorios para GitHub Actions y CodeQL...');
if (!fs.existsSync(githubDir)) {
  fs.mkdirSync(githubDir);
  console.log('✅ Directorio .github creado');
}

if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir);
  console.log('✅ Directorio .github/workflows creado');
}

if (!fs.existsSync(codeqlDir)) {
  fs.mkdirSync(codeqlDir);
  console.log('✅ Directorio .github/codeql creado');
}

// Crear archivo de configuración de CodeQL
console.log('\n📝 Creando archivo de configuración de CodeQL...');
const codeqlConfig = `name: "Miss Star International CodeQL Config"

paths:
  - './assets'
  - './js'
  - './scripts'
  - './*.js'
paths-ignore:
  - '**/node_modules/**'
  - '**/*.test.js'
  - '**/*.spec.js'
  - './assets/js/third-party/**'

queries:
  - uses: security-and-quality

disable-default-queries: false`;

fs.writeFileSync(path.join(codeqlDir, 'codeql-config.yml'), codeqlConfig);
console.log('✅ Archivo .github/codeql/codeql-config.yml creado');

// Crear archivo de workflow para CodeQL
console.log('\n📝 Creando archivo de workflow para CodeQL...');
const codeqlWorkflow = `name: "CodeQL Analysis"

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript' ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: \${{ matrix.language }}
        config-file: ./.github/codeql/codeql-config.yml

    # Este paso es crucial - define explícitamente el comando de construcción
    - name: Manual Build Command
      run: |
        # Instalamos las dependencias
        npm install
        # Ejecutar el script de build específico para CodeQL
        npm run codeql-build

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2`;

fs.writeFileSync(path.join(workflowsDir, 'codeql-analysis.yml'), codeqlWorkflow);
console.log('✅ Archivo .github/workflows/codeql-analysis.yml creado');

// Actualizar package.json para incluir scripts necesarios
console.log('\n📝 Actualizando package.json...');
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = require(packageJsonPath);

// Agregar scripts específicos para CodeQL si no existen
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

packageJson.scripts.build = packageJson.scripts.build || "echo 'No build step required for static site'";
packageJson.scripts.lint = packageJson.scripts.lint || "echo 'No linting configured'";
packageJson.scripts['codeql-build'] = "npm install";

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Archivo package.json actualizado');

// Verificar si Git está disponible
console.log('\n🔍 Verificando configuración de Git...');
try {
  execSync('git --version', { stdio: 'pipe' });
  
  // Hacer commit de los cambios
  console.log('📦 Preparando para commit de cambios...');
  try {
    // Añadir archivos
    execSync('git add .github/ package.json', { stdio: 'pipe' });
    
    // Hacer commit
    execSync('git commit -m "ci: Configurar CodeQL para análisis estático"', { stdio: 'pipe' });
    
    console.log('✅ Cambios commiteados localmente');
    console.log('ℹ️ Ejecuta "git push" para subir los cambios a GitHub');
  } catch (error) {
    console.log('⚠️ No se pudo hacer commit automáticamente, por favor hazlo manualmente');
  }
} catch (error) {
  console.log('⚠️ Git no está disponible. Por favor, haz commit de los cambios manualmente');
}

console.log('\n✅ CONFIGURACIÓN DE CODEQL COMPLETADA');
console.log('\nAhora puedes:');
console.log('1. Subir estos cambios a GitHub usando "git push"');
console.log('2. Ve a la pestaña "Actions" en GitHub para ver el análisis de CodeQL');
console.log('3. Si aún hay problemas, verifica las configuraciones en GitHub Settings > Security > Code security and analysis'); 