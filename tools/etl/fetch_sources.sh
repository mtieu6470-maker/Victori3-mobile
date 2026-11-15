#!/usr/bin/env bash
# Downloads the public research datasets used by the Historical Research Database.
# Outputs go to tools/etl/.cache (git-ignored). Re-run extract_*.py afterwards.
set -euo pipefail
C="$(dirname "$0")/.cache"; mkdir -p "$C"; cd "$C"
B=https://correlatesofwar.org/wp-content/uploads
for f in NMCv7.zip States2024.zip System2024.zip MajorPowers2024.zip version4.1_csv.zip \
         Inter-StateWarData_v4.0.csv Extra-StateWarData_v4.0.csv Intra-StateWarData_v4.1.csv terr-changes-v6.zip; do
  [ -f "$f" ] || curl -sSL --retry 3 -o "$f" "$B/$f"
done
[ -f md2010_horizontal.xlsx ] || curl -sSL --retry 3 -o md2010_horizontal.xlsx \
  https://www.rug.nl/ggdc/historicaldevelopment/maddison/data/md2010_horizontal.xlsx
for z in *.zip; do d="x_${z%.zip}"; [ -d "$d" ] || unzip -q -o "$z" -d "$d"; done
(cd x_NMCv7/NMCv7 && [ -d sup ] || unzip -q -o NMC-v7-supplemental.zip -d sup)
echo "datasets ready in $C"
