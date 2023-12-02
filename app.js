const express = require('express');
const puppeteer = require('puppeteer-core');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/scrape/:artistId', async (req, res) => {
  try {
    const artistUrl = `https://open.spotify.com/artist/${req.params.artistId}`;
    const monthlyListeners = await scrapeMonthlyListeners(artistUrl, ${req.params.artistId});
    console.log('Monthly Listeners:', monthlyListeners);
    res.json({ monthlyListeners });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function scrapeMonthlyListeners(artistUrl artistID) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.goto(artistUrl);
    await page.waitForSelector('.artistID');

    const monthlyListeners = await page.$eval('.artistID', element => element.textContent.trim());

    await browser.close();
    return monthlyListeners;

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
