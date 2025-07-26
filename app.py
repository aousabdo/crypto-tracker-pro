from flask import Flask, render_template, jsonify
import requests
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API endpoints
BINANCE_API_URL = "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"

def get_bitcoin_data():
    """Fetch comprehensive Bitcoin data from Binance API"""
    try:
        response = requests.get(BINANCE_API_URL, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Calculate price change percentage
        price_change_percent = float(data['priceChangePercent'])
        
        # Get current timestamp
        import time
        timestamp = int(time.time())
        
        result = {
            'price': round(float(data['lastPrice']), 2),
            'market_cap': float(data['lastPrice']) * 19500000,  # Approximate BTC supply
            'volume_24h': float(data['volume']) * float(data['lastPrice']),
            'change_24h': round(price_change_percent, 2),
            'last_updated': timestamp,
            'high_24h': float(data['highPrice']),
            'low_24h': float(data['lowPrice']),
            'ath': float(data['lastPrice']),  # Using current price as placeholder
            'ath_date': timestamp,
            'atl': float(data['lastPrice']),  # Using current price as placeholder
            'atl_date': timestamp
        }
        
        return result
    except requests.RequestException as e:
        logger.error(f"Error fetching Bitcoin data: {e}")
        return None
    except KeyError as e:
        logger.error(f"Error parsing API response: {e}")
        return None

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/bitcoin')
def bitcoin_data():
    """API endpoint to get comprehensive Bitcoin data"""
    data = get_bitcoin_data()
    if data is not None:
        return jsonify({'data': data, 'error': None})
    else:
        return jsonify({'data': None, 'error': 'Failed to fetch data. Please try again later.'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)