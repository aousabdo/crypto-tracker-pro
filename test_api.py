import requests
import json

try:
    response = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    print("Status code:", response.status_code)
    if response.status_code == 200:
        data = response.json()
        print("API Response:")
        print(json.dumps(data, indent=2))
        print("\nUSD Price:", data['bitcoin']['usd'])
    else:
        print("Error: Received status code", response.status_code)
except Exception as e:
    print("Error:", str(e))