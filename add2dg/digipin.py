"""DigiPin encoder/decoder (ported from digipin.js)

Functions:
 - get_digipin(lat, lon) -> 10-char digipin (with hyphens at 4 and 7)
 - get_latlng_from_digipin(pin) -> dict with latitude, longitude (center)
"""
DIGIPIN_GRID = [
    ['F', 'C', '9', '8'],
    ['J', '3', '2', '7'],
    ['K', '4', '5', '6'],
    ['L', 'M', 'P', 'T']
]

BOUNDS = {
    'minLat': 2.5,
    'maxLat': 38.5,
    'minLon': 63.5,
    'maxLon': 99.5
}


def _clamp(v, a, b):
    return max(a, min(b, v))


def get_digipin(lat, lon):
    if lat < BOUNDS['minLat'] or lat > BOUNDS['maxLat']:
        raise ValueError('Latitude out of range')
    if lon < BOUNDS['minLon'] or lon > BOUNDS['maxLon']:
        raise ValueError('Longitude out of range')

    minLat = BOUNDS['minLat']
    maxLat = BOUNDS['maxLat']
    minLon = BOUNDS['minLon']
    maxLon = BOUNDS['maxLon']

    digi = ''

    for level in range(1, 11):
        latDiv = (maxLat - minLat) / 4.0
        lonDiv = (maxLon - minLon) / 4.0

        row = 3 - int((lat - minLat) // latDiv)
        col = int((lon - minLon) // lonDiv)

        row = _clamp(row, 0, 3)
        col = _clamp(col, 0, 3)

        digi += DIGIPIN_GRID[row][col]

        if level == 3 or level == 6:
            digi += '-'

        # Update bounds (note: use previous latDiv/lonDiv)
        maxLat = minLat + latDiv * (4 - row)
        minLat = minLat + latDiv * (3 - row)

        minLon = minLon + lonDiv * col
        maxLon = minLon + lonDiv

    return digi


def get_latlng_from_digipin(digi_pin):
    pin = digi_pin.replace('-', '')
    if len(pin) != 10:
        raise ValueError('Invalid DIGIPIN')

    minLat = BOUNDS['minLat']
    maxLat = BOUNDS['maxLat']
    minLon = BOUNDS['minLon']
    maxLon = BOUNDS['maxLon']

    for ch in pin:
        ri = ci = -1
        found = False
        for r in range(4):
            for c in range(4):
                if DIGIPIN_GRID[r][c] == ch:
                    ri = r
                    ci = c
                    found = True
                    break
            if found:
                break
        if not found:
            raise ValueError('Invalid character in DIGIPIN')

        latDiv = (maxLat - minLat) / 4.0
        lonDiv = (maxLon - minLon) / 4.0

        lat1 = maxLat - latDiv * (ri + 1)
        lat2 = maxLat - latDiv * ri
        lon1 = minLon + lonDiv * ci
        lon2 = minLon + lonDiv * (ci + 1)

        minLat = lat1
        maxLat = lat2
        minLon = lon1
        maxLon = lon2

    centerLat = (minLat + maxLat) / 2.0
    centerLon = (minLon + maxLon) / 2.0

    return {'latitude': round(centerLat, 6), 'longitude': round(centerLon, 6)}


if __name__ == '__main__':
    # quick sanity check
    print(get_digipin(36.935837, -100.675846))
    print(get_latlng_from_digipin(get_digipin(28.6139, 77.2090)))
