# CG-31 — Công ty lịch sử và luật công ty/chống trust (1836–2026)

**Branch:** ccr-b27f3fb8-epfpd6  
**Status:** PHASE 1 / PARTIAL. Danh mục 60 ứng viên đã có; chỉ một tập hợp con có metric quy mô định lượng được xác minh ở vòng này. PENDING không được dùng để spawn, calibration hoặc đặt market share.

## 1. Kết hợp cơ chế Victoria 3 với lịch sử thực tế

Victoria 3 là tham chiếu gameplay cho company specialisation, profitability/prosperity, expansion, charter và regional headquarters; không phải nguồn xác minh lịch sử. Nên tách:
- LegalEntity: pháp nhân thực, jurisdiction, legal form, incorporation/charter date, dissolution.
- CorporateGroup: công ty mẹ/con, cross-holdings và quyền kiểm soát; các group như Mitsubishi/Mitsui/Sumitomo không phải một pháp nhân bất biến.
- Brand: tên thương mại có thể tồn tại khi pháp nhân thay đổi.
- CharterPrivilege: exclusive trade, concession, territorial administration, forced cultivation, public franchise; độc lập với corporate form.
- MarketPower: thị phần và concentration theo market-good; công ty lớn không mặc nhiên độc quyền.
- StateEnterprise: chủ sở hữu nhà nước khác với công ty tư nhân hoặc cơ quan nhà nước trực tiếp điều hành.

**Thiết kế dự án:** historical firms xuất hiện theo ngày và điều kiện vốn/công nghệ/lao động/demand; không bắt buộc thành công như lịch sử. Lợi nhuận = doanh thu sites trừ input, wages, tax, interest và operating costs; sau đó mới dividend/reinvestment. Charter không tự tạo GDP.

## 2. Scale metrics có thể kiểm tra

| Entity | Observation | Unit/definition | Source |
|---|---|---|---|
| Russian-American Company | capital 1,238,746; gross sales 20,024,698; cumulative net profit 7,685,000 (1799–1820) | rubles; pre-1836 | FRUS / NARA |
| Mitsubishi lineage | 3 ships in 1870; 61 ships and 73% of Japanese steamship tonnage by 1877 | ships / fleet share | official Mitsubishi history |
| Siemens & Halske | 10 staff in 1847; 6,500 in 1892 | employees | Siemens |
| Bayer | 3 staff in 1863; 300+ in 1881; c.10,000 in 1913; >80% sales export in 1913 | workforce / export share | Bayer |
| Deutsche Bank | c.50 staff 1870; 1,072 in 1894; 6,638 in 1913 | employees | Historical Association |
| Ford | 168,304 vehicles/6,867 workers in 1912–13; 248,307/14,366 in 1913–14 | annual/fiscal output and employees | University of Minnesota source |
| Ford (independent study) | 260,722 vehicles/13,000 workers in 1914 | vehicles/employees; distinct source series | Cambridge Journal of Economic History |
| U.S. Steel | $1.404bn authorised capitalisation; 65.7% US steel output; 50.1% rolled products in 1901 | capitalisation and production share | US Census |
| Standard Oil | 90–95% refining capacity in 1880; 64% in 1911; 75% kerosene sales 1911 | market share | FERC / antitrust history |
| Peugeot | 64 Type 3 cars in series production in 1891; Automobiles Peugeot distinct from 1896 | units | Peugeot official history |
| Tata Steel | first colliery 1910; furnace 1911; first ingot 1912 | milestones, not tonnage | Tata Steel |
| HBC | £300,000 settlement on 1870 transfer | one-off settlement, not turnover | Justice Canada |
| Royal Niger Company | up to £865,000 authorised transfer payment in 1899 | one-time liability settlement | Royal Niger Company Act |
| Congo Free State | customs ~1.5m francs before boom; ~4m in 1900s; exceptional state rubber/ivory sales ~8m francs in 1906/08 | state receipts, not company profit | academic study |

Different Ford series describe different periods/definitions and must not be averaged. U.S. Steel capitalisation is not asset value or revenue. Congo figures are state receipts, not concession-company financials. RAC metrics end 1820 and cannot calibrate 1836–67.

## 3. Danh mục 60 ứng viên

Đây là research queue, không phải spawn whitelist. PENDING thiếu scale metric đã kiểm chứng; chỉ dùng để định hướng nghiên cứu tiếp theo.

| # | Entity | Country | Historical HQ | Sector | Origin | Dissolution / continuity | Scale status |
|---:|---|---|---|---|---:|---|---|
| 1 | East India Company | UK | London | chartered trade/colonial administration | 1600 | powers ended 1858; company dissolved 1874 | PENDING |
| 2 | Hudson's Bay Company | UK/Canada | London then Canada | fur/territorial charter | 1670 | territorial transfer 1870; company continued | VERIFIED |
| 3 | Russian-American Company | Russian Empire | St Petersburg/Sitka | fur/colonial administration | 1799 | Alaska cession 1867 | VERIFIED_PRE1836 |
| 4 | Baring Brothers | UK | London | banking | 1762 | changed legal identity; collapse 1995 | PENDING |
| 5 | Lloyds banking predecessor | UK | Birmingham/London | banking | 1765 | multiple mergers | PENDING |
| 6 | Barclays predecessor | UK | London | banking | 1690 | partnership lineage | PENDING |
| 7 | Jardine Matheson | UK | Canton/Hong Kong | trade/agency | 1832 | continuing group lineage | PENDING |
| 8 | Great Western Railway | UK | London/Bristol | rail | 1833 | absorbed 1948 | PENDING |
| 9 | London & North Western Railway | UK | London | rail | 1846 | amalgamated 1923 | PENDING |
| 10 | Great Eastern Railway | UK | London | rail | 1862 | amalgamated 1923 | PENDING |
| 11 | Vickers | UK | Sheffield | steel/armaments | 1828 | limited company 1867; later merger lineage | PENDING |
| 12 | John Brown & Company | UK | Sheffield | steel/shipbuilding | 1844 | later merger lineage | PENDING |
| 13 | Armstrong Whitworth | UK | Newcastle | engineering/armaments | 1847 | amalgamated 1897 | PENDING |
| 14 | Shell Transport & Trading | UK | London | oil/shipping | 1897 | merged with Royal Dutch 1907 | PENDING |
| 15 | Anglo-Persian Oil Company | UK | London | oil | 1909 | later BP lineage; Iranian assets nationalised 1951 | PENDING |
| 16 | Courtaulds | UK | Coventry | textiles/artificial fibres | 1816 | later restructurings | PENDING |
| 17 | Imperial Chemical Industries | UK | London | chemicals | 1926 | acquired by AkzoNobel 2008 | PENDING |
| 18 | Unilever | UK/Netherlands | London/Rotterdam | consumer goods | 1929 | merger roots | PENDING |
| 19 | Standard Oil | US | Cleveland/New York | oil refining | 1870 | trust 1882; dissolution ordered 1911 | VERIFIED |
| 20 | Carnegie Steel | US | Pittsburgh | steel | 1892 | absorbed 1901 | PENDING |
| 21 | U.S. Steel | US | New York/Pittsburgh | steel | 1901 | continuing/reorganised | VERIFIED |
| 22 | Ford Motor Company | US | Detroit | automobiles | 1903 | continuing | VERIFIED |
| 23 | General Electric | US | Schenectady/New York | electrical | 1892 | successor business split/reorganisation 2024 | PENDING |
| 24 | AT&T | US | New York | telecommunications | 1885 | breakup 1984 | PENDING |
| 25 | DuPont | US | Wilmington | chemicals | 1802 | spin-offs/mergers | PENDING |
| 26 | Pullman Palace Car Company | US | Chicago | rail equipment | 1867 | merged/reorganised | PENDING |
| 27 | Pennsylvania Railroad | US | Philadelphia | rail | 1846 | merged 1968 | PENDING |
| 28 | Singer Manufacturing | US | New York | machinery | 1851 | reorganised/merged | PENDING |
| 29 | Western Union | US | Rochester/New York | telegraph | 1856 | reorganised | PENDING |
| 30 | International Harvester | US | Chicago | agricultural machinery | 1902 | Tenneco/CNH successor lineage | PENDING |
| 31 | Siemens & Halske | Prussia/Germany | Berlin | telegraph/electrical | 1847 | Siemens successor lineage | VERIFIED |
| 32 | Krupp | Prussia/Germany | Essen | steel/armaments | 1811 | AG 1903; merged ThyssenKrupp 1999 | PENDING |
| 33 | Bayer | Prussia/Germany | Barmen/Leverkusen | chemicals | 1863 | joint-stock 1881; continuing | VERIFIED |
| 34 | BASF | Germany | Ludwigshafen | chemicals | 1865 | continuing | PENDING |
| 35 | Deutsche Bank | Germany | Berlin | banking | 1870 | continuing with mergers | VERIFIED |
| 36 | AEG | Germany | Berlin | electrical machinery | 1883 | merged into Daimler-Benz 1996 | PENDING |
| 37 | Allianz | Germany | Berlin/Munich | insurance | 1890 | continuing | PENDING |
| 38 | Mannesmann | Germany | Remscheid | steel/tubes | 1890 | takeover 2000 | PENDING |
| 39 | Schneider & Cie / Schneider-Creusot | France | Le Creusot | steel/engineering | 1836 | successor legal identity varies | PENDING |
| 40 | Saint-Gobain | France | Paris | glass/materials | 1665 | state-founded; privatised 1986 | PENDING |
| 41 | Crédit Lyonnais | France | Lyon | banking | 1863 | nationalised 1945; privatised 1990s | PENDING |
| 42 | Société Générale | France | Paris | banking | 1864 | continuing | PENDING |
| 43 | Peugeot / Automobiles Peugeot | France | Valentigney/Sochaux | metalworking/automobiles | 1810 / 1896 | family manufacturing vs auto company | VERIFIED |
| 44 | Renault | France | Boulogne-Billancourt | automobiles | 1899 | nationalised 1945; privatisation from 1990s | PENDING |
| 45 | Mitsubishi / Tsukumo lineage | Japan | Osaka/Tokyo | shipping/mining/finance | 1870 | postwar zaibatsu dissolved | VERIFIED |
| 46 | Mitsui & Co predecessor | Japan | Tokyo | trade/finance | 1876 | zaibatsu dismantled after WWII | PENDING |
| 47 | Sumitomo mining entities | Japan | Osaka | copper/mining | 17th-century roots | corporate lineage, not single legal person | PENDING |
| 48 | Nippon Yusen (NYK) | Japan | Tokyo | shipping | 1885 | formed by merger | VERIFIED |
| 49 | Kawasaki Dockyard | Japan | Kobe | shipbuilding | 1896 | reorganised 1969 | PENDING |
| 50 | Tanaka Seisakusho / Toshiba predecessor | Japan | Tokyo | electrical machinery | 1875 | merged with Tokyo Denki 1939 | PENDING |
| 51 | Tata Sons | India | Bombay | trading/industrial holding | 1868 | group holding/multiple entities | PENDING |
| 52 | Tata Iron and Steel Company | India | Jamshedpur | steel | 1907 | TISCO/Tata Steel lineage | VERIFIED_MILESTONES |
| 53 | Bombay Dyeing | India | Bombay | textiles | 1879 | continuing lineage | PENDING |
| 54 | Andrew Yule & Co | India | Calcutta | trading/tea/engineering | 1863 | legal continuity needs checking | PENDING |
| 55 | Bengal Coal Company | India | Bengal | coal | 1843 | merger/continuity needs checking | PENDING |
| 56 | Nederlandsche Handel-Maatschappij | Netherlands | The Hague/Amsterdam | trade/shipping/finance | 1824 | merged into ABN lineage 1964 | VERIFIED_PARTIAL |
| 57 | Royal Dutch Petroleum | Netherlands | The Hague | oil | 1890 | merged with Shell 1907 | PENDING |
| 58 | Société Générale de Belgique | Belgium | Brussels | banking/investment | 1822 | reorganised/merged | PENDING |
| 59 | John Cockerill Company | Belgium | Seraing | iron/engineering | 1817 | restructured repeatedly | PENDING |
| 60 | China Merchants Steam Navigation Company | Qing China | Shanghai | shipping | 1872 | state-supervised merchant enterprise; repeated reorganisations | PENDING |

## 4. Luật công ty và antitrust

| Jurisdiction | Year | Instrument/event | Significance |
|---|---:|---|---|
| UK | 1844 | Joint Stock Companies Act | registration/incorporation framework widened beyond individual charter; early restrictions remained |
| UK | 1855 | Limited Liability Act | limited liability extended to qualifying registered joint-stock firms |
| UK | 1856 | Joint Stock Companies Act | revised registration/incorporation framework |
| UK | 1862 | Companies Act | consolidated incorporation, regulation and winding-up |
| British India | 1850 | Act XLIII, Registration of Registered Joint Stock Companies | register of companies with transferable shares; limited scope |
| British India | 1857 | Joint-Stock Companies Act XIX | registered with or without limited liability; banking/insurance restrictions |
| British India | 1860/1866/1882/1913 | Companies Acts | revisions/consolidation under colonial jurisdiction |
| Germany/Prussia | 1870 | Aktienrechtsnovelle / general incorporation | loosened concession system; shareholder powers; AG formation boom |
| Germany | 1884 | stock-company law revision | prospectus and investor/creditor safeguards after Gründerboom/crash |
| France | 1867 | Loi du 24 juillet 1867 | framework for commercial companies; exact treatment depends on legal form/article |
| Japan | 1890/1893 | first Commercial Code | German influence; first general company law framework; licence-based incorporation |
| Japan | 1899 | revised Commercial Code | normative registration approach; German influence |
| US | 1890 | Sherman Antitrust Act | federal restraint-of-trade/monopolisation law |
| US | 1911 | Standard Oil Co. v. United States | Supreme Court dissolution under Sherman Act; successor companies remain |
| US | 1914 | Clayton Act and FTC Act | strengthened enforcement and created federal competition authority |

Nationalisation/privatisation examples needing separate legal-source verification before code: UK coal/rail post-WWII; Renault nationalised 1945; French banking nationalisation expansion 1982; BT 1984, British Gas 1986, British Airways 1987, British Steel 1988 and rail privatisation in 1990s. Acquisition, nationalisation, state majority control, public corporation formation, divestment and flotation are different events.

## 5. Victoria 3 design translation and safeguards

1. Company birth is conditional; date alone must not guarantee a historical firm's success.
2. Company productivity emerges from owned sites, technology, supply chain, labour, finance and investment; rank alone never adds GDP.
3. Charter is time-bounded legal privilege; not a corporate form.
4. Market concentration is per good and market; distinguish cartel/trust/vertical integration/legal monopoly.
5. Profit and dividends must balance through a closed ledger; don't double-count.
6. Colonial extraction and monopoly externalities include producer price wedge, forced labour, food security, unrest, displacement, migration, mortality and state capacity.
7. Antitrust is a process: investigative capacity, legal standard, courts, capture, remedy, appeal and compliance.
8. Monthly aggregate ledger/cached indexes to protect mobile performance.

## 6. Sources

- Victoria 3 Companies and Prosperity / Charters of Commerce mechanics pointer (community summary only): https://github.com/yosbotnet/vic3/blob/main/notes/tutorials/14-companies-and-prosperity.md
- Siemens: https://www.siemens.com/en-us/company/history-heritage/history-timeline/
- Bayer: https://www.bayer.com/en/about-us/history/history-timeline
- Deutsche Bank staff: https://www.bankgeschichte.de/facts-figures/employee-figures/1870-1944 ; founding: https://www.bankgeschichte.de/faq/
- Ford production: https://ageconsearch.umn.edu/nanna/record/268374/files/twerp340.pdf ; Cambridge: https://www.cambridge.org/core/journals/journal-of-economic-history/article/model-t/A783993184F1741EDC6F6A76B9D6D98D
- US Census: https://www2.census.gov/library/publications/decennial/1900/volume-7/volume-7-p3.pdf
- Standard Oil: https://www.ferc.gov/sites/default/files/2020-06/Opinion_No_154_Williams_Pipeline.pdf ; alternative historical interpretation https://web.mit.edu/merolish/Public/books/libertarian/antitrust.pdf
- Mitsubishi: https://www.mitsubishi.com/en/profile/history/outline/
- Peugeot: https://www.peugeot.com.au/brand/about-us/peugeot-family-history.html
- NYK: https://www.nyk.com/english/profile/history/
- Tata Steel: https://www.tatasteel.com/heritage/heritage.html
- RAC: https://www.archives.gov/research/guide-fed-records/groups/261.html ; https://history.state.gov/historicaldocuments/frus1890/d293 ; https://www.loc.gov/collections/yudin-collection-of-russian-american-company-records/about-this-collection/
- RNC Act: https://www.legislation.gov.uk/ukpga/Vict/62-63/43/pdfs/ukpga_18990043_en.pdf
- HBC transfer: https://justice.canada.ca/eng/rp-pr/csj-sjc/constitution/lawreg-loireg/p1t33.html
- UK statutes: https://www.legislation.gov.uk/ukpga/Vict/7-8/110/contents ; https://www.legislation.gov.uk/ukpga/Vict/18-19/133/contents ; https://www.legislation.gov.uk/ukpga/Vict/25-26/89/contents
- UK/India company law: https://law1a.nus.edu.sg/ewbclb/pdf/wps/CLB-WPS-1501.pdf ; India Act 1857 https://www.indiacode.nic.in/repealedfileopen?rfilename=A1857-19.pdf ; 1850 background https://api.sci.gov.in/supremecourt/2020/212/212_2020_31_1503_27229_Judgement_26-Mar-2021.pdf
- German corporate law: https://www.cambridge.org/core/journals/business-history-review/article/creating-a-new-legal-form-the-gmbh/3E5A3EB209325E46709159E6A9CD8010 ; https://www.nber.org/system/files/chapters/c10271/c10271.pdf
- France 1867: https://www.legifrance.gouv.fr/loda/id/LEGISCTA000006084119
- Japan Commercial Code: https://ir.library.osaka-u.ac.jp/repo/ouka/all/11764/oulr041-023.pdf

**Acceptance:** PARTIAL. 60 candidates listed, but only a subset has verified scale metrics. PENDING firms must not be spawned in Historical Mode until annual report/census/registry evidence exists.

## 7. CG-31 scale-evidence expansion — 22 November 2026

The second research pass adds eight sourced entities to `CG31_COMPANIES_SCALE_EVIDENCE.csv`, bringing the evidence register to **20 distinct company/group entities** (Congo Free State remains a state-only comparator and is not counted). See the detailed observations, metric definitions, limitations and source bibliography in `docs/research/history/CG31_SCALE_EVIDENCE_EXPANSION_2026-11-22.md`.

New entities: Krupp; John Cockerill / S.A. John Cockerill; General Electric; AT&T / Bell System; Crédit Lyonnais; Shell Transport & Trading; Nippon Yusen Kaisha; Société Générale de Belgique.

**Boundary:** the 20-entity minimum assigned in MSG-055 is met. The broader MSG-049 requirement for sourced scale evidence across the full 60-candidate catalogue is **not** met. All remaining PENDING candidates stay excluded from Historical Mode seeding until legal identity, continuity, dated scale metrics and sources are verified. No company size, market share or profitability coefficient has been hardcoded into the game.

