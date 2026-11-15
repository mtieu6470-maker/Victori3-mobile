#!/usr/bin/env bash
# Downloads the Natural Earth layers used by tools/build-map.ts (public domain, https://www.naturalearthdata.com/).
# Files go to tools/etl/.cache (git-ignored). Re-running skips files that are already present.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p .cache && cd .cache
GH=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
CDN=https://naciscdn.org/naturalearth
get() { [ -s "$2" ] || curl -fsSL --retry 4 -o "$2" "$1"; }
get "$GH/ne_10m_admin_1_states_provinces.geojson" ne_10m_admin_1_states_provinces.geojson
get "$GH/ne_10m_lakes.geojson" ne_10m_lakes.geojson
get "$GH/ne_10m_rivers_lake_centerlines.geojson" ne_10m_rivers_lake_centerlines.geojson
get "$CDN/50m/raster/SR_50M.zip" SR_50M.zip
get "$CDN/50m/raster/OB_50M.zip" OB_50M.zip
[ -s SR_50M/SR_50M.tif ] || (mkdir -p SR_50M && cd SR_50M && unzip -oq ../SR_50M.zip)
[ -d OB_50M ] || (mkdir -p OB_50M && cd OB_50M && unzip -oq ../OB_50M.zip)
ls -la . SR_50M OB_50M
