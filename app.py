from flask import Flask, render_template, jsonify, request
import requests
import os

# Explicitly set static and template folders
app = Flask(__name__, static_folder='static', template_folder='templates')

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
