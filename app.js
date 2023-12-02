const express = require('express');
const puppeteer = require('puppeteer-core');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/scrape/:artistId', async (req, res) => {
  try {
    const artistUrl = `https://open.spotify.com/artist/${req.params.artistId}`;
    const monthlyListeners = await scrapeMonthlyListeners(artistUrl);
    console.log('Monthly Listeners:', monthlyListeners);
    res.json({ monthlyListeners });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function scrapeMonthlyListeners(artistUrl) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: require('puppeteer-core').executablePath(),
    });

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
