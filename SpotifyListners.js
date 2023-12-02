const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

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
    // Return an error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to scrape monthly listeners from a Spotify artist page using Puppeteer
async function scrapeMonthlyListeners(artistUrl) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(artistUrl);
    await page.waitForSelector('.Ydwa1P5GkCggtLlSvphs');

    const monthlyListeners = await page.$eval('.Ydwa1P5GkCggtLlSvphs', element => element.textContent.trim());

    await browser.close();
    return monthlyListeners;

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
