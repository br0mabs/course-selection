from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests
import os
from scraper import scrape_url  # Import the scraper

# Explicitly set static and template folders
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS if needed for frontend

API_KEY = os.environ.get('API_KEY')
BASE_API_URL = 'https://openapi.data.uwaterloo.ca/v3/ClassSchedules'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/call-api', methods=['GET'])
def call_external_api():
    try:
        term = request.args.get('term', '1259')
        subject = request.args.get('subject', '')
        catalog_number = request.args.get('catalog_number', '')
        
        # Build the full URL
        api_url = f'{BASE_API_URL}/{term}'
        if subject:
            api_url += f'/{subject}'
        if catalog_number:
            api_url += f'/{catalog_number}'
        
        headers = {
            'accept': 'application/json',
            'x-api-key': API_KEY
        }
        
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        return jsonify({
            'success': True,
            'data': response.json()
        }), 200
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# NEW SCRAPING ENDPOINT
@app.route('/api/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
    
    url = data['url']
    
    # Validate URL format
    if not url.startswith(('http://', 'https://')):
        return jsonify({'error': 'Invalid URL format'}), 400
    
    result = scrape_url(url)
    
    if result['success']:
        return jsonify(result['data']), 200
    else:
        return jsonify({'error': result['error']}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
