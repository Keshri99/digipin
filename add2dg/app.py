import os
from flask import Flask, request, jsonify

try:
    import googlemaps
except Exception:
    googlemaps = None

from digipin import get_digipin

app = Flask(__name__)

GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    app.logger.warning('GOOGLE_API_KEY not set; geocoding will fail until provided')


def geocode_address(address):
    if googlemaps is None:
        raise RuntimeError('googlemaps package not installed')
    if not GOOGLE_API_KEY:
        raise RuntimeError('GOOGLE_API_KEY not configured')

    client = googlemaps.Client(key=GOOGLE_API_KEY)
    results = client.geocode(address)
    if not results:
        return None
    loc = results[0]['geometry']['location']
    return loc['lat'], loc['lng']


@app.route('/add2dg', methods=['POST'])
def add2dg():
    data = request.get_json(force=True)
    if not data or 'address' not in data:
        return jsonify({'error': 'request JSON must include "address" field'}), 400

    address = data['address']
    try:
        latlng = geocode_address(address)
    except Exception as e:
        return jsonify({'error': 'geocoding failed', 'details': str(e)}), 500

    if latlng is None:
        return jsonify({'error': 'no geocoding result'}), 404

    lat, lng = latlng
    try:
        digipin = get_digipin(lat, lng)
    except Exception as e:
        return jsonify({'error': 'digipin generation failed', 'details': str(e)}), 500

    return jsonify({
        'input_address': address,
        'latitude': round(lat, 6),
        'longitude': round(lng, 6),
        'digipin': digipin
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
