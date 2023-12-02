const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cors = require('cors');  // Added for CORS support

const app = express();
const port = process.env.PORT || 3000;  // Use the provided port or default to 3000

// Enable CORS for all routes
app.use(cors());

// Define an API endpoint for scraping monthly listeners
app.get('/scrape/:artistId', async (req, res) => {
  try {
    const artistUrl = `https://open.spotify.com/artist/${req.params.artistId}`;

    // Scrape monthly listeners using Puppeteer
    const monthlyListeners = await scrapeMonthlyListeners(artistUrl);

    // Return the result as JSON
    res.json({ monthlyListeners });

  } catch (error) {
    console.error('Error:', error.message);

    // Return a more general error message in the response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to scrape monthly listeners from a Spotify artist page using Puppeteer
async function scrapeMonthlyListeners(artistUrl) {
  try {
    // Use the provided CHROMIUM_PATH environment variable or default to '/usr/bin/chromium-browser'
    const chromiumPath = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser';

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: chromiumPath,
    });

    const page = await browser.newPage();

    await page.goto(artistUrl);
    await page.waitForSelector('.Ydwa1P5GkCggtLlSvphs');

    const monthlyListeners = await page.$eval('.Ydwa1P5GkCggtLlSvphs', element => element.textContent.trim());

    await browser.close();
    return monthlyListeners;

  } catch (error) {
    console.error('Error:', error.message);

    // Log the detailed error for your reference
    throw error;
  }
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
