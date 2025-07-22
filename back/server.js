const express = require('express');
const cors = require('cors');
const https = require('https');
const url = require('url');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to make HTTPS requests
function makeHttpsRequest(requestUrl) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(requestUrl);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js WHOIS Client'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Helper function to format domain information
function formatDomainInfo(whoisData) {
  const registryData = whoisData.WhoisRecord?.registryData || whoisData.WhoisRecord;
  const nameServers = registryData?.nameServers?.hostNames || [];
  
  // Format hostnames - truncate if longer than 25 chars
  let hostnamesStr = nameServers.join(', ');
  if (hostnamesStr.length > 25) {
    hostnamesStr = hostnamesStr.substring(0, 22) + '...';
  }

  // Calculate estimated domain age
  let estimatedAge = 'Unknown';
  if (registryData?.createdDate) {
    const createdDate = new Date(registryData.createdDate);
    const now = new Date();
    const ageInDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
    const ageInYears = Math.floor(ageInDays / 365);
    estimatedAge = `${ageInYears} years, ${ageInDays % 365} days`;
  }

  return {
    domainName: registryData?.domainName || 'Unknown',
    registrar: registryData?.registrarName || 'Unknown',
    registrationDate: registryData?.createdDate || 'Unknown',
    expirationDate: registryData?.expiresDate || 'Unknown',
    estimatedDomainAge: estimatedAge,
    hostnames: hostnamesStr || 'None'
  };
}

// Helper function to format contact information
function formatContactInfo(whoisData) {
  const registryData = whoisData.WhoisRecord?.registryData || whoisData.WhoisRecord;
  const contacts = registryData?.contacts || {};
  
  return {
    registrantName: contacts.registrant?.name || 'Not Available',
    technicalContactName: contacts.technical?.name || 'Not Available',
    administrativeContactName: contacts.admin?.name || 'Not Available',
    contactEmail: contacts.registrant?.email || contacts.admin?.email || contacts.technical?.email || 'Not Available'
  };
}

// Main endpoint for WHOIS lookup
app.post('/api/whois', async (req, res) => {
  try {
    const { domain, type, apiKey } = req.body;

    // Validate input
    if (!domain || !type || !apiKey) {
      return res.status(400).json({
        error: 'Missing required parameters: domain, type, and apiKey'
      });
    }

    if (!['domain', 'contact'].includes(type)) {
      return res.status(400).json({
        error: 'Type must be either "domain" or "contact"'
      });
    }

    // Construct WHOIS API URL
    const whoisUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`;

    // Make request to WHOIS API
    const whoisData = await makeHttpsRequest(whoisUrl);

    // Check if the API returned an error
    if (whoisData.ErrorMessage) {
      return res.status(400).json({
        error: whoisData.ErrorMessage.msg || 'WHOIS API error'
      });
    }

    // Format response based on requested type
    let formattedData;
    if (type === 'domain') {
      formattedData = formatDomainInfo(whoisData);
    } else {
      formattedData = formatContactInfo(whoisData);
    }

    res.json({
      success: true,
      type: type,
      domain: domain,
      data: formattedData
    });

  } catch (error) {
    console.error('WHOIS lookup error:', error);
    res.status(500).json({
      error: 'Failed to lookup domain information: ' + error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`WHOIS Backend Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/whois - Domain WHOIS lookup');
  console.log('- GET /api/health - Health check');
});

module.exports = app;