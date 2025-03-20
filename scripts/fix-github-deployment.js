const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('🔄 FIXING GITHUB DEPLOYMENT WORKFLOW 🔄');
    console.log('======================================');
    
    // Create the .github/workflows directory if it doesn't exist
    const workflowsDir = path.join(__dirname, '../.github/workflows');
    
    if (!fs.existsSync(path.join(__dirname, '../.github'))) {
      fs.mkdirSync(path.join(__dirname, '../.github'));
      console.log('✅ Created .github directory');
    }
    
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir);
      console.log('✅ Created .github/workflows directory');
    }
    
    // Create a simple deploy workflow file
    const deployYaml = `name: Deploy Website

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci || npm install
        
      - name: Check for linting errors
        run: npm run lint || echo "No lint script found, skipping"
        continue-on-error: true
        
      - name: Build
        run: npm run build || echo "No build script needed"
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci || npm install
        
      - name: Install FTP client
        run: npm install basic-ftp
        
      - name: Deploy via FTP
        env:
          FTP_HOST: \${{ secrets.FTP_HOST || 'web0151.zxcs.nl' }}
          FTP_USERNAME: \${{ secrets.FTP_USERNAME || 'u127684p143111' }}
          FTP_PASSWORD: \${{ secrets.FTP_PASSWORD }}
          FTP_DESTINATION: '/domains/missstarinternational.com/public_html'
        run: |
          # Create deployment script
          cat > deploy.js << 'EOL'
          const ftp = require('basic-ftp');
          const fs = require('fs');
          const path = require('path');
          
          async function main() {
            const client = new ftp.Client();
            client.ftp.verbose = true;
            
            try {
              console.log('Connecting to FTP server...');
              await client.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USERNAME,
                password: process.env.FTP_PASSWORD,
                secure: false
              });
              
              console.log('Connected. Navigating to destination directory...');
              await client.ensureDir(process.env.FTP_DESTINATION);
              
              // Upload the index.html file
              if (fs.existsSync('index.html')) {
                console.log('Uploading index.html...');
                await client.uploadFrom('index.html', 'index.html');
              }
              
              // Upload assets directory if it exists
              if (fs.existsSync('assets')) {
                console.log('Uploading assets directory...');
                await client.uploadFromDir('assets', 'assets');
              }
              
              // Upload any other necessary files/directories
              // ...
              
              console.log('Deployment completed successfully!');
            } catch (err) {
              console.error('Error during deployment:', err);
              process.exit(1);
            } finally {
              client.close();
            }
          }
          
          main();
          EOL
          
          # Run the deployment script
          node deploy.js
`;
    
    // Write the workflow file
    fs.writeFileSync(path.join(workflowsDir, 'deploy.yml'), deployYaml);
    console.log('✅ Created .github/workflows/deploy.yml');
    
    // Create a basic package.json if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../package.json'))) {
      const packageJson = {
        "name": "missstarinternational",
        "version": "1.0.0",
        "description": "Miss Star International Website",
        "main": "index.js",
        "scripts": {
          "test": "echo \"No tests specified\"",
          "deploy": "node scripts/upload-logo-directly.js"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/MaxxxCaram/MissStarInternational.git"
        },
        "keywords": [
          "miss",
          "star",
          "international"
        ],
        "author": "MaxxxCaram",
        "license": "ISC",
        "dependencies": {
          "basic-ftp": "^5.0.3",
          "dotenv": "^16.3.1"
        }
      };
      
      fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(packageJson, null, 2));
      console.log('✅ Created package.json');
    } else {
      console.log('⚠️ package.json already exists, skipping creation');
    }
    
    // Create a sample .gitignore file if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../.gitignore'))) {
      const gitignore = `# Dependency directories
node_modules/
jspm_packages/

# dotenv environment variable files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# nyc test coverage
.nyc_output

# Temporary folders
tmp/
temp/
temp_*
`;
      
      fs.writeFileSync(path.join(__dirname, '../.gitignore'), gitignore);
      console.log('✅ Created .gitignore');
    } else {
      console.log('⚠️ .gitignore already exists, skipping creation');
    }
    
    // Create README.md with instructions if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../README.md'))) {
      const readme = `# Miss Star International Website

Official website for Miss Star International pageant.

## Development

This website is automatically deployed via GitHub Actions whenever changes are pushed to the main branch.

### Local Development

1. Clone the repository:
   \`\`\`
   git clone https://github.com/MaxxxCaram/MissStarInternational.git
   cd MissStarInternational
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Make your changes to the website files.

4. To manually deploy changes:
   \`\`\`
   npm run deploy
   \`\`\`

## Deployment

The website is automatically deployed to the production server when changes are pushed to the main branch.
For manual deployment, use \`npm run deploy\`.

## Structure

- \`index.html\`: Main entry point
- \`assets/\`: Contains images, CSS, and other static files
- \`scripts/\`: Utility scripts for deployment and maintenance
`;
      
      fs.writeFileSync(path.join(__dirname, '../README.md'), readme);
      console.log('✅ Created README.md');
    } else {
      console.log('⚠️ README.md already exists, skipping creation');
    }
    
    console.log('\n✅ GITHUB DEPLOYMENT SETUP COMPLETE');
    console.log('Now you need to:');
    console.log('1. Commit these changes to your repository');
    console.log('   git add .github/workflows/deploy.yml package.json .gitignore README.md');
    console.log('   git commit -m "Add GitHub Actions deployment workflow"');
    console.log('   git push origin main');
    console.log('2. Set up repository secrets in GitHub:');
    console.log('   - Go to your GitHub repository -> Settings -> Secrets -> Actions');
    console.log('   - Add a new repository secret named FTP_PASSWORD with your FTP password');
    console.log('3. The deployment will run automatically on the next push to main');
  } catch (err) {
    console.error('Error creating GitHub workflow:', err);
  }
}

main(); 