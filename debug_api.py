import requests
import json

# Test the simple price endpoint
simple_url = "https://api.coingecko.com/api/v3/simple/price"
simple_params = {
    'ids': 'bitcoin',
    'vs_currencies': 'usd',
    'include_market_cap': 'true',
    'include_24hr_vol': 'true',
    'include_24hr_change': 'true',
    'include_last_updated_at': 'true'
}

print("Testing simple price endpoint...")
try:
    response = requests.get(simple_url, params=simple_params)
    print("Status code:", response.status_code)
    if response.status_code == 200:
        data = response.json()
        print("Simple price data:")
        print(json.dumps(data, indent=2))
    else:
        print("Error: Received status code", response.status_code)
except Exception as e:
    print("Error:", str(e))

print("\n" + "="*50 + "\n")

# Test the coins endpoint
coins_url = "https://api.coingecko.com/api/v3/coins/bitcoin"
print("Testing coins endpoint...")
try:
    response = requests.get(coins_url)
    print("Status code:", response.status_code)
    if response.status_code == 200:
        data = response.json()
        print("Coins data (first 500 chars):")
        print(json.dumps(data, indent=2)[:500] + "...")
    else:
        print("Error: Received status code", response.status_code)
except Exception as e:
    print("Error:", str(e))