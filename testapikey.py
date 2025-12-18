import os
import requests

API_KEY = os.environ.get('API_KEY')

if not API_KEY:
    print("API_KEY not found in environment variables")
else:
    print(f"API_KEY found: {API_KEY[:5]}...{API_KEY[-5:]}")  # Show partial key
    
    response = requests.get(
        'https://openapi.data.uwaterloo.ca/v3/ClassSchedules/1259/MATH/135',
        headers={
            'accept': 'application/json',
            'x-api-key': API_KEY
        }
    )
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✓ API key is VALID")
    elif response.status_code in [401, 403]:
        print("✗ API key is INVALID")
    else:
        print(f"Response: {response.text}")
