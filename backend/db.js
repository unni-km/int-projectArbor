// db.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import dotenv from 'dotenv';

dotenv.config();
const keyVaultName = 'ar-india-mgt-dev01';
const vaultUrl = `https://${keyVaultName}.vault.azure.net`;

const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUrl, credential);

const sslCertPath = process.env.SSL_CERT_PATH;
const serverCa = [fs.readFileSync(sslCertPath, 'utf8')];

let poolPromise;

async function createDbPool() {
  try {
    console.log('🔐 Fetching DB credentials from Azure Key Vault...');
    const dbHost = (await client.getSecret('DBHOST')).value;
    const dbUser = (await client.getSecret('DBUSER')).value;
    const dbPassword = (await client.getSecret('DBPASSWORD')).value;
    const dbName = (await client.getSecret('DBNAME')).value;

    console.log(`Connecting to DB: ${dbName}`);

poolPromise = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: 3306,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
    ca: serverCa
  },
  timezone: '+05:30', 
  dateStrings: true  
});


    // Test connection
    const connection = await poolPromise.getConnection();
    console.log('✅ Securely connected to MySQL via Azure Key Vault with SSL');
    connection.release();

  } catch (err) {
    console.error('❌ Failed to connect to MySQL using Azure Key Vault:', err);
    throw err;
  }
}

await createDbPool();

export default poolPromise;
