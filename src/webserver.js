const express = require('express');
const fs = require('fs');
const https = require('https');
const selfsigned = require('selfsigned');
const { execSync } = require('child_process');
const path = require('path');
const app = express();

const port = 80;
const httpsPort = 443;
const sslDir = path.join(__basedir, 'data', 'ssl');
const privateKeyPath = path.join(sslDir, 'private.key');
const certificatePath = path.join(sslDir, 'certificate.crt');
const caBundlePath = path.join(sslDir, 'ca_bundle.crt');

// Redirect HomePage to Docs
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// Endpoints
app.use('/api', require(path.join(__basedir, 'src', 'api')));
// app.use('/docs', require(path.join(__basedir, 'src', 'docs')));


// Start HTTP Server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Function to generate self-signed certificates
const generateSelfSignedCerts = () => {
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, { days: 365 });

  fs.writeFileSync(privateKeyPath, pems.private);
  fs.writeFileSync(certificatePath, pems.cert);
  fs.writeFileSync(caBundlePath, pems.cert);
};

// Check if SSL certificates exist, if not generate them
if (!fs.existsSync(privateKeyPath) || !fs.existsSync(certificatePath) || !fs.existsSync(caBundlePath)) {
  try {
    // Generate SSL certificates using Let's Encrypt
    execSync('certbot certonly --standalone --preferred-challenges http -d yourdomain.com --non-interactive --agree-tos -m youremail@example.com');
    fs.copyFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem', privateKeyPath);
    fs.copyFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem', certificatePath);
    fs.copyFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', caBundlePath);
  } catch (error) {
    console.error('Error generating SSL certificates:', error);
    generateSelfSignedCerts();
  }
}

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const ca = fs.readFileSync(caBundlePath, 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: ca };

// Start HTTPS Server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(httpsPort, () => {
  console.log(`App listening securely at https://localhost:${httpsPort}`);
});