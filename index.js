const functions = require('@google-cloud/functions-framework');
const puppeteer = require('puppeteer');
const axios = require('axios');

class CRMVScraper {
  constructor() {
    this.baseUrl = 'https://siscad.cfmv.gov.br';
  }

  async getRecaptchaToken() {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      await page.goto(`${this.baseUrl}/paginas/busca`);
      await new Promise(resolve => setTimeout(resolve, 3000));

      const token = await page.evaluate(() => {
        const tokenField = document.querySelector('input[name="g-recaptcha-response"]');
        return tokenField ? tokenField.value : null;
      });

      return token;
    } catch (error) {
      console.error('Error getting reCAPTCHA token:', error);
      return null;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async searchCRMV(crmvNumber, state) {
    try {
      const recaptchaToken = await this.getRecaptchaToken();
      
      if (!recaptchaToken) {
        return { error: 'Failed to get reCAPTCHA token', status: 403 };
      }

      const searchUrl = `${this.baseUrl}/pf/consultaInscricao/${crmvNumber}/3/2/${state}/${recaptchaToken}?=${Date.now()}`;
      
      const response = await axios.get(searchUrl);
      
      if (response.status === 403) {
        return { error: 'Access forbidden - reCAPTCHA validation failed' };
      }

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return { error: 'Access forbidden - reCAPTCHA validation failed' };
      }
      return { error: `Request failed: ${error.message}` };
    }
  }
}

functions.http('searchCRMV', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { crmvNumber, state } = req.query;

  if (!crmvNumber || !state) {
    res.status(400).json({ 
      error: 'Missing required parameters: crmvNumber and state' 
    });
    return;
  }

  const scraper = new CRMVScraper();
  const result = await scraper.searchCRMV(crmvNumber, state);

  if (result.status === 403) {
    res.status(403).json(result);
  } else if (result.error) {
    res.status(400).json(result);
  } else {
    res.status(200).json(result);
  }
});