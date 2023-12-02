from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from chromedriver_autoinstaller import install
import logging
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
logging.basicConfig(level=logging.INFO)

def scrape_spotify_artist(url):
    try:
        logging.info(f"Scraping Spotify artist from URL: {url}")

        # Automatically install the latest version of chromedriver
        install()

        options = webdriver.ChromeOptions()

        # Conditionally enable headless mode based on the HEADLESS environment variable
        if os.environ.get('HEADLESS', 'true').lower() == 'true':
            options.add_argument('--headless')

        # Use the installed chromedriver
        driver = webdriver.Chrome(options=options)

        driver.get(url)

        # Wait for the element to be present, adjust timeout as needed
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'RP2rRchy4i8TIp1CTmb7'))
        )

        result = element.text if element else "Span element not found on the page."

        driver.quit()
        logging.info("Scraping completed successfully")
        return result

    except Exception as e:
        logging.error(f"Error during scraping: {e}")
        return f"Error: {e}"

@app.route('/scrape', methods=['POST'])
def scrape_endpoint():
    data = request.get_json()
    if 'url' in data:
        url = data['url']
        result = scrape_spotify_artist(url)
        return jsonify({'result': result})
    else:
        return jsonify({'error': 'Please provide a Spotify artist URL in the request body.'})

if __name__ == '__main__':
    # Use the PORT environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)
