# CG-52 — Story-event illustration source audit (first pass)

Date: 2026-11-23. Response to MSG-116. No copyrighted Victoria 3 artwork is used.

## Scope and acceptance rule
The runtime selection file must contain only assets whose Commons file page explicitly resolves to Public Domain/CC0, or LoC records whose rights advisory passes the repository ingester. A pre-1930 date alone is not enough if the file page's rights status is disputed. Do not populate image.ref until the corresponding asset is ingested and the actual asset ID exists.

## Existing reviewed event-illustration selections
The current historical_data/assets/illustration_sources/commons_selection.json already has six illustration_event entries. These are the only candidates handed over from the repository's existing reviewed register in this pass:

| Existing subject | Commons file | Possible use | Caveat |
|---|---|---|---|
| dw_statuto_albertino | Carlo_Alberto_firma_lo_Statuto.jpg | constitutional settlement / parliamentary reform | Italian 1848 scene; not a British-colony event |
| dw_prussian_constitution | Barrikadenkampf_Alexanderplatz_1848.jpg | revolution / uprising | Berlin barricade; do not reuse for unrelated colonial events |
| dw_corn_laws | 1846_-_Anti-Corn_Law_League_Meeting.jpg | petition / trade-policy debate | Low-resolution; existing review says replace if better master found |
| dw_french_abolition | Brouillon_du_décret_d’abolition_de_l’esclavage_annoté_par_Victor_Schoelcher,_1848.jpg | abolition / emancipation law | French colonial decree, not a generic independence illustration |
| dw_belgium_recognition | Existing Rijksmuseum Commons file in the reviewed register | public unrest / revolution | Register records Rijksmuseum CC0; not the 1839 treaty signing |
| zollverein_accessions | Existing BnF Commons map in the reviewed register | customs union / trade treaty | Map, not a narrative event painting |

These records already exist in the runtime source register; do not duplicate them in a new story selection file.

## 32 generic events: visual assignment policy
The 32 event/journal IDs listed in MSG-116 need one distinct image each. Do not reuse one image for multiple unrelated events merely to satisfy coverage. Suggested research targets (not yet license-cleared):
- Armed Forces petitions: officers' council / military committee meeting, 19th-century engraving.
- Mass conscription: recruitment queue or conscription office, 19th-century engraving.
- Industrialists/free trade: Anti-Corn Law League meeting; existing dw_corn_laws is a possible thematic match only if Claude accepts a shared subject.
- Trade unions/free labour/general strike: workers' assembly or strike scene; investigate Robert Koehler's The Strike (1886) file page and rights template.
- Free press/public schools/university reform: printing press, schoolroom, university lecture hall, period-appropriate.
- Clergy/state religion/religious schools: public-domain church assembly or school scene; avoid a generic church exterior.
- Landowners/protectionism: agricultural estate or parliamentary debate about grain tariffs.
- Heroic Era / Springtime 1848: period-specific European labour/revolution art; do not reuse the same image for both.
- Cholera: contemporary public-health engraving; avoid modern medical photographs.
- Inventor / railway boom / exhibition: inventor workshop, locomotive, Crystal Palace 1851 interior/exterior.
- Corruption / anarchist attack / revolution: contemporary newspaper engraving or public-domain historical painting, exact subject/date verified.
- Bad harvest / emigration / gold rush: famine relief, emigrant ship, California/Australia mining scene.
- Suffragettes / votes for women: pre-1930 suffrage procession or meeting, rights page checked individually.
- War weariness / foreign advisers: public-domain wartime home-front scene or period military advisory photograph, not a modern reenactment.

## Integration handoff
- The agreed file-scope rule restricts ChatGPT writes to docs/research/**, review reports and new board entries. This pass therefore does not modify historical_data/assets/illustration_sources/story_selection.json or runtime event files.
- Claude should transfer only approved records to story_selection.json, run tools/media/loc_ingest.py, and attach image.ref = ill_evt_<event-id> only after ingest succeeds.
- Preserve exact file title, author, year, width, period, crop inset/focus and review note; the ingester's rights check is authoritative.
- Status: six existing event illustration records found; no new Commons/LoC file page was independently license-cleared in this pass. MSG-116 is partially researched, not complete; 32 new assignments remain open.

## Repository source
historical_data/assets/illustration_sources/commons_selection.json; source blob SHA at inspection: 0ba8235feafff6f456236b6e0a7c526d0a9bc9c6.
