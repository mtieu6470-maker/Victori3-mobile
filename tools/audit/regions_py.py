"""Python twin of tools/audit/regions.ts classify() (same rules), for ETL/audit scripts."""
def classify(lat, lon):
    if (lon > 110 and lat < -9) or ((lon > 155 or lon < -140) and lat < 35): return 'oceania'
    if lon < -30:
        if lat < 12.5 and lon > -80: return 'south_america'
        if 7 <= lat < 23.6 and lon > -92: return 'central_america'
        return 'north_america'
    if -26 < lon < 52 and lat < 37.5 and not (lon > 34.5 and lat > 12.3): return 'north_africa' if lat >= 19 else 'subsaharan_africa'
    if lat > 35 and lon < 45 and not (lon > 37 and lat < 47): return 'europe'
    if lon < 60: return 'west_asia'
    if lon < 80 and lat >= 34.3: return 'central_asia'
    if lon < 92 and lat < 30.5: return 'south_asia'
    if lon < 80: return 'south_asia'
    if lat < 24 and lon >= 92: return 'southeast_asia'
    return 'east_asia'
