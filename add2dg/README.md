# add2dg

Small Flask service that accepts an Indian address, uses Google Geocoding API
to fetch lat/lng, then computes the corresponding DigiPin.

Usage

1. Install dependencies:

```bash
python -m pip install -r requirements.txt
```

2. Set your Google API key in environment:

Windows (PowerShell):
```powershell
$env:GOOGLE_API_KEY = "YOUR_KEY"
python app.py
```

3. Example request:

```bash
curl -X POST http://127.0.0.1:5000/add2dg -H "Content-Type: application/json" -d '{"address":"Connaught Place, New Delhi, India"}'
```

Files

- `app.py`: Flask web service
- `digipin.py`: DigiPin encode/decode implementation
- `requirements.txt`: Python dependencies
