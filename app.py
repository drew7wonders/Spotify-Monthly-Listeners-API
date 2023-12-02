from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from chromedriver_autoinstaller import install

app = Flask(__name__)

def scrape_spotify_artist(url):
    try:
        # Automatically install the latest version of chromedriver
        install()

        options = webdriver.ChromeOptions()
        options.add_argument('--headless')  # Run Chrome in headless mode (no GUI)

        # Use the installed chromedriver
        driver = webdriver.Chrome(options=options)

        driver.get(url)

        # Wait for the element to be present, adjust timeout as needed
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'RP2rRchy4i8TIp1CTmb7'))
        )

        result = element.text if element else "Span element not found on the page."

        driver.quit()
        return result

    except Exception as e:
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
    app.run(debug=True)
