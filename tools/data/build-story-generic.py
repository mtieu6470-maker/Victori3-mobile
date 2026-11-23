#!/usr/bin/env python3
"""EVT-01 starter pack: generic story events and journals for every country (original text; V3 is only the
mechanical reference). Writes historical_data/events/story/generic_politics.json. Re-run after editing."""
import json, os
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'historical_data', 'events', 'story', 'generic_politics.json')
S = '$self'
def mod(mid, vi, months, effects, decaying=False, en=None):
    m = {"type": "modifier", "entity": S, "id": mid, "name_vi": vi, "months": months, "effects": effects}
    if decaying: m["decaying"] = True
    if en: m["name_en"] = en
    return m
def igap(ig, d): return {"type": "ig_approval", "entity": S, "ig": ig, "delta": d}
def opt(oid, vi, effects, w=1, en=None, mods=None):
    o = {"id": oid, "label_vi": vi, "effects": effects, "ai_weight": w}
    if en: o["label_en"] = en
    if mods: o["ai_modifiers"] = mods
    return o
events, journals = [], []

# ---------------------------------------------------------------- interest-group petitions (V3-style)
PETITIONS = [
  # ig, group, law, title, text, ig label
  ("armed_forces", "army", "professional_army", "Quân đội kiến nghị chính phủ", "Các sĩ quan cấp cao gửi kiến nghị chính thức: họ muốn một quân đội chuyên nghiệp, được huấn luyện và trả lương đàng hoàng thay cho lối gọi lính cũ. Trong phòng họp, ai cũng hiểu họ sẽ không chấp nhận câu trả lời 'không'.", "Quân nhân"),
  ("armed_forces", "army", "mass_conscription", "Bộ Tổng tham mưu đòi nghĩa vụ quân sự toàn dân", "Tổng tham mưu trưởng trình bản ghi nhớ: các nước láng giềng đã có hàng triệu quân dự bị, còn ta thì không. Họ đòi luật nghĩa vụ quân sự toàn dân.", "Quân nhân"),
  ("industrialists", "trade", "free_trade", "Phòng thương mại kêu gọi tự do thương mại", "Các chủ xưởng và nhà buôn ký chung một lá thư: hàng rào thuế quan đang bóp nghẹt xuất khẩu. Họ muốn mở cửa thị trường.", "Nhà công nghiệp"),
  ("industrialists", "economy", "laissez_faire", "Giới chủ đòi nhà nước đứng ngoài thị trường", "Hiệp hội các nhà công nghiệp cho rằng quy định của nhà nước làm chậm mọi dự án. Họ đòi chính sách kinh tế tự do.", "Nhà công nghiệp"),
  ("trade_unions", "labor", "free_labor", "Công đoàn đòi xóa bỏ lao động cưỡng bức", "Những người thợ tập hợp trước trụ sở chính phủ, giương biểu ngữ đòi tự do lao động cho mọi người.", "Công đoàn"),
  ("trade_unions", "power", "universal_male_suffrage", "Công nhân đòi quyền bầu cử", "Hàng vạn chữ ký được gửi tới nghị viện: người lao động muốn có lá phiếu như những người có tài sản.", "Công đoàn"),
  ("intelligentsia", "press", "free_press", "Giới trí thức đòi tự do báo chí", "Các nhà văn, giáo sư và chủ báo cùng ký một bản tuyên ngôn: không thể có tiến bộ khi tư tưởng bị kiểm duyệt.", "Trí thức"),
  ("intelligentsia", "education", "public_schools", "Đề án trường công cho mọi trẻ em", "Một nhóm nhà giáo dục trình đề án mở trường công miễn phí ở mọi làng xã.", "Trí thức"),
  ("clergy", "church", "state_religion", "Giáo hội đòi khôi phục vị thế quốc giáo", "Các chức sắc tôn giáo kêu gọi chính phủ bảo vệ đức tin của tổ tiên bằng luật pháp.", "Giáo sĩ"),
  ("clergy", "education", "religious_schools", "Giáo hội xin quyền mở trường học", "Giáo hội đề nghị tự đứng ra dạy chữ và đạo đức cho trẻ em, với sự hỗ trợ của nhà nước.", "Giáo sĩ"),
  ("landowners", "trade", "protectionism", "Địa chủ đòi đánh thuế lúa mì ngoại", "Lúa mì giá rẻ từ nước ngoài tràn vào. Các đại điền chủ đòi dựng hàng rào thuế quan.", "Địa chủ"),
  ("rural_folk", "labor", "free_labor", "Nông dân đòi ruộng đất và tự do", "Đại diện các làng gửi kiến nghị: họ muốn được tự do rời làng, tự do làm thuê và có ruộng của riêng mình.", "Nông dân"),
  ("petty_bourgeoisie", "power", "census_suffrage", "Thị dân đòi quyền bầu cử theo tài sản", "Các chủ tiệm và thợ cả cho rằng người đóng thuế phải có tiếng nói. Họ đòi chế độ bầu cử theo tài sản.", "Tiểu tư sản"),
]
for ig, group, law, title, text, igvi in PETITIONS:
    eid = f"gen_petition_{ig}_{law}"
    jid = f"gen_expect_{ig}_{law}"
    events.append({
      "id": eid, "country": "$any", "mode": "both",
      "trigger": {"conditions": [{"type": "ig_clout_above", "entity": S, "ig": ig, "value": 0.08}, {"type": "law_not", "entity": S, "group": group, "value": law}, {"type": "not_flag", "flag": f"petition_{ig}"}], "mtth_months": 96},
      "chain": {"flag": f"petition_{ig}"},
      "title_vi": title, "title_en": f"{igvi} petition", "text_vi": text, "text_en": "An interest group petitions the government for a new law.",
      "options": [
        opt("promise", "Chúng ta sẽ xem xét.", [{"type": "start_journal", "entity": S, "id": jid}, mod(f"{eid}_hope", f"{igvi} chờ đợi", 12, {f"ig_{ig}": 2})], 3, "We will see what we can do."),
        opt("refuse", "Chính phủ không nhận lệnh từ ai.", [mod(f"{eid}_snub", f"{igvi} bị gạt bỏ", 36, {f"ig_{ig}": -3, "legitimacy": -2}, decaying=True)], 1, "The government takes orders from no one."),
        opt("buy_off", "Ban ơn để họ im lặng (tốn ngân khố).", [{"type": "treasury", "entity": S, "months_income": -1.5}, mod(f"{eid}_paid", f"{igvi} được ban ơn", 24, {f"ig_{ig}": 1})], 1, "Buy their silence."),
      ],
    })
    journals.append({
      "id": jid, "country": "$any", "mode": "both",
      "title_vi": f"{igvi} chờ luật {law.replace('_', ' ')}", "text_vi": f"{igvi} kỳ vọng chính phủ thông qua luật này trong 5 năm. Làm được, họ sẽ ủng hộ mạnh mẽ; thất hứa, họ sẽ quay lưng.",
      "complete": [{"type": "law", "entity": S, "group": group, "value": law}],
      "timeout_months": 60,
      "on_complete": [mod(f"{jid}_kept", f"Giữ lời với {igvi.lower()}", 60, {f"ig_{ig}": 3, "legitimacy": 3}, decaying=True)],
      "on_fail": [mod(f"{jid}_broken", f"Thất hứa với {igvi.lower()}", 60, {f"ig_{ig}": -4, "legitimacy": -3, "radicalism": 0.02}, decaying=True)],
    })

# ---------------------------------------------------------------- society, politics, economy
GEN = [
  dict(id="gen_heroic_era", y=(1880, 1960), conds=[{"type": "ig_clout_above", "entity": S, "ig": "trade_unions", "value": 0.08}],
       t="Kỷ nguyên Anh hùng của phong trào lao động", x="Công đoàn ngày càng có tiếng nói. Khắp các thành phố công nghiệp, những tổ chức của người thợ đứng lên đòi quyền lợi, hát vang những bài ca về lá cờ đỏ.",
       o=[opt("embrace", "Cách mạng xã hội muôn năm!", [mod("heroic_era", "Kỷ nguyên Anh hùng", 24, {"reform": 0.02, "ig_trade_unions": 2, "radicalism": 0.02}, True)], 1),
          opt("rights", "Tự do, bình đẳng và quyền của người lao động!", [mod("labor_rights", "Quyền lao động", 24, {"ig_trade_unions": 1, "reform": 0.01}, True)], 2),
          opt("order", "Không có gì để nói với kẻ thù của trật tự.", [mod("order_first", "Trật tự trên hết", 24, {"police": 0.05, "ig_trade_unions": -3, "ig_industrialists": 1})], 2)]),
  dict(id="gen_cholera", y=(1836, 1910), conds=[], mtth=120,
       t="Dịch tả bùng phát", x="Một trận dịch tả quét qua các khu phố chật chội. Bác sĩ khuyên làm hệ thống nước sạch; các quan chức lo ngân sách.",
       o=[opt("sanitation", "Xây hệ thống nước sạch và cống ngầm.", [{"type": "treasury", "entity": S, "months_income": -2}, mod("sanitation", "Cải cách vệ sinh", 120, {"birth": 0.001, "legitimacy": 2})], 2),
          opt("quarantine", "Cách ly các khu phố nhiễm bệnh.", [mod("quarantine", "Lệnh cách ly", 12, {"trade": -0.05, "legitimacy": -2})], 2),
          opt("pray", "Cầu nguyện và chờ dịch qua.", [mod("plague_years", "Những năm dịch bệnh", 24, {"birth": -0.002, "ig_clergy": 1, "legitimacy": -3}, True)], 1)]),
  dict(id="gen_inventor", y=(1836, 2026), conds=[], mtth=100,
       t="Một nhà phát minh xin tài trợ", x="Một kỹ sư trẻ mang tới bộ bản vẽ đầy tham vọng. Ông khẳng định cỗ máy của mình sẽ thay đổi cả ngành công nghiệp, chỉ cần nhà nước rót vốn.",
       o=[opt("fund", "Rót vốn cho ông ấy.", [{"type": "treasury", "entity": S, "months_income": -1}, mod("inventor", "Nhà phát minh được nhà nước bảo trợ", 60, {"innovation": 0.08, "ig_intelligentsia": 1}, True)], 2),
          opt("private", "Giới thiệu ông với các nhà tư bản.", [mod("venture", "Vốn tư nhân cho sáng chế", 36, {"innovation": 0.04, "ig_industrialists": 1})], 2),
          opt("dismiss", "Ảo tưởng. Mời ông ra.", [], 1)]),
  dict(id="gen_corruption_scandal", y=(1836, 2026), conds=[{"type": "legitimacy_below", "entity": S, "value": 60}], mtth=75,
       t="Bê bối tham nhũng", x="Báo chí đăng tin một bộ trưởng nhận hối lộ trong hợp đồng xây đường sắt. Dư luận sôi sục.",
       o=[opt("sack", "Cách chức và đưa ra xét xử.", [{"type": "legitimacy", "entity": S, "delta": 3}, mod("clean_hands", "Chiến dịch bàn tay sạch", 24, {"tax": 0.03, "ig_landowners": -1})], 2),
          opt("coverup", "Ỉm đi và kiện tờ báo.", [mod("coverup", "Che giấu bê bối", 36, {"legitimacy": -5, "radicalism": 0.02}, True)], 1),
          opt("scapegoat", "Đổ lỗi cho một quan chức cấp dưới.", [{"type": "legitimacy", "entity": S, "delta": -1}], 2)]),
  dict(id="gen_general_strike", y=(1870, 2026), conds=[{"type": "radicalism_above", "entity": S, "value": 0.2}], mtth=60,
       t="Tổng bãi công", x="Đường sắt dừng chạy, nhà máy im tiếng, bến cảng ùn ứ hàng. Ban lãnh đạo bãi công đòi tăng lương và rút ngắn giờ làm.",
       o=[opt("concede", "Nhượng bộ: tăng lương, rút giờ làm.", [mod("strike_won", "Thắng lợi của bãi công", 36, {"ig_trade_unions": 3, "ig_industrialists": -2, "radicalism": -0.03, "tax": -0.02})], 2),
          opt("troops", "Đưa quân đội vào phá bãi công.", [mod("strike_broken", "Bãi công bị đàn áp", 48, {"ig_trade_unions": -4, "ig_armed_forces": 1, "radicalism": 0.04, "legitimacy": -3}, True)], 1, mods=[{"if": {"type": "gov_power", "entity": S, "value": "autocracy"}, "factor": 3}]),
          opt("mediate", "Mời hai bên ra bàn đàm phán.", [mod("arbitration", "Trọng tài lao động", 24, {"ig_trade_unions": 1, "radicalism": -0.01, "reform": 0.005})], 2)]),
  dict(id="gen_bad_harvest", y=(1836, 1950), conds=[{"type": "food_shortage", "entity": S}], mtth=12,
       t="Mất mùa", x="Mưa trái mùa làm thối rữa cả vụ lúa. Giá bánh mì tăng gấp đôi; trong các khu nghèo đã có người chết đói.",
       o=[opt("relief", "Mở kho cứu đói.", [{"type": "treasury", "entity": S, "months_income": -1.5}, mod("famine_relief", "Cứu đói", 12, {"legitimacy": 3, "radicalism": -0.03})], 3),
          opt("import", "Bỏ thuế nhập khẩu lương thực.", [mod("grain_free", "Mở cửa nhập lương thực", 24, {"trade": 0.05, "tariff": -0.3, "ig_landowners": -2, "ig_rural_folk": 1})], 2),
          opt("nothing", "Thị trường sẽ tự điều chỉnh.", [mod("hunger", "Nạn đói", 24, {"radicalism": 0.05, "legitimacy": -4, "birth": -0.003}, True)], 1)]),
  dict(id="gen_suffragettes", y=(1890, 1960), conds=[{"type": "law", "entity": S, "group": "power", "value": "universal_male_suffrage"}], mtth=60,
       t="Phong trào đòi quyền bầu cử cho phụ nữ", x="Những người phụ nữ xích tay mình vào hàng rào nghị viện. Họ hỏi: vì sao một nửa dân tộc không có lá phiếu?",
       o=[opt("listen", "Đưa vấn đề ra nghị viện.", [{"type": "start_journal", "entity": S, "id": "gen_votes_for_women"}, mod("suffrage_debate", "Tranh luận về quyền bầu cử", 24, {"ig_intelligentsia": 2, "ig_clergy": -1})], 2),
          opt("arrest", "Bắt giữ những kẻ gây rối.", [mod("suffrage_arrests", "Bắt giữ người biểu tình", 36, {"radicalism": 0.02, "ig_intelligentsia": -2, "legitimacy": -2}, True)], 1)]),
  dict(id="gen_war_weariness", y=(1836, 2026), conds=[{"type": "at_war", "entity": S}, {"type": "war_exhaustion_above", "entity": S, "value": 40}], mtth=12,
       t="Dư luận chán chiến tranh", x="Danh sách tử sĩ dài thêm mỗi tuần. Trên phố, những người mẹ giương ảnh con mình; báo chí bắt đầu hỏi: chúng ta đánh vì cái gì?",
       o=[opt("propaganda", "Tăng cường tuyên truyền yêu nước.", [mod("war_propaganda", "Tuyên truyền thời chiến", 12, {"war_exhaustion": -1.0, "legitimacy": -1, "police": 0.03})], 2),
          opt("rationing", "Phân phối tem phiếu công bằng.", [{"type": "treasury", "entity": S, "months_income": -1}, mod("rationing", "Chế độ tem phiếu", 18, {"war_exhaustion": -0.6, "radicalism": -0.02})], 2),
          opt("censor", "Kiểm duyệt danh sách tử sĩ.", [mod("war_censorship", "Kiểm duyệt thời chiến", 18, {"war_exhaustion": -0.8, "ig_intelligentsia": -2, "legitimacy": -2})], 1)]),
  dict(id="gen_foreign_advisers", y=(1840, 1914), conds=[{"type": "law", "entity": S, "group": "army", "value": "feudal_levies"}], mtth=75,
       t="Cố vấn quân sự nước ngoài", x="Một cường quốc phương Tây đề nghị cử sĩ quan sang huấn luyện quân đội ta theo lối mới, với điều kiện ta mua súng của họ. Điều khoản có vẻ có lợi, nhưng ta có nên mắc nợ người ngoài?",
       o=[opt("welcome", "Hoan nghênh sự giúp đỡ.", [{"type": "treasury", "entity": S, "months_income": -1}, mod("foreign_drill", "Huấn luyện theo lối phương Tây", 60, {"army": 0.08, "ig_armed_forces": 1, "ig_landowners": -1})], 2),
          opt("decline", "Chúng ta không uống chén độc của họ.", [mod("self_reliance", "Tự lực", 24, {"legitimacy": 2, "ig_clergy": 1})], 1)]),
  dict(id="gen_railway_boom", y=(1840, 1900), conds=[], mtth=80,
       t="Cơn sốt đường sắt", x="Cổ phiếu đường sắt tăng vùn vụt. Ai cũng muốn đặt ray tới thị trấn của mình, kể cả những nơi chẳng có hàng hóa gì để chở.",
       o=[opt("subsidize", "Nhà nước bảo lãnh lãi suất.", [{"type": "treasury", "entity": S, "months_income": -1}, mod("rail_mania", "Cơn sốt đường sắt", 48, {"construction": 0.1, "trade": 0.03, "ig_industrialists": 2}, True)], 2),
          opt("regulate", "Đặt quy định chặt chẽ.", [mod("rail_regulation", "Quản lý đường sắt", 36, {"construction": 0.04, "tax": 0.02})], 2),
          opt("let_be", "Để thị trường tự lo.", [mod("rail_bubble", "Bong bóng đường sắt", 24, {"construction": 0.06, "legitimacy": -1}, True)], 1)]),
  dict(id="gen_emigration_wave", y=(1840, 1920), conds=[{"type": "radicalism_above", "entity": S, "value": 0.15}], mtth=75,
       t="Làn sóng di cư", x="Các bến cảng chật kín người mang theo hành lý ít ỏi, mong tới một miền đất mới. Làng mạc vắng dần.",
       o=[opt("let_go", "Để họ đi: bớt miệng ăn, bớt bất mãn.", [mod("emigration", "Làn sóng di cư", 36, {"radicalism": -0.03, "birth": -0.001})], 2),
          opt("restrict", "Hạn chế xuất cảnh.", [mod("exit_ban", "Cấm xuất cảnh", 36, {"radicalism": 0.02, "ig_landowners": 1, "legitimacy": -1})], 1)]),
  dict(id="gen_national_exhibition", y=(1851, 1939), conds=[], mtth=110,
       t="Triển lãm quốc gia", x="Một cung điện bằng kính và sắt sẽ trưng bày những thành tựu của đất nước trước bạn bè năm châu. Chi phí không hề nhỏ.",
       o=[opt("grand", "Làm thật hoành tráng.", [{"type": "treasury", "entity": S, "months_income": -1.5}, {"type": "prestige", "entity": S, "delta": 15}, mod("exhibition", "Dư âm triển lãm", 36, {"innovation": 0.05, "trade": 0.03}, True)], 2),
          opt("modest", "Làm vừa phải.", [{"type": "treasury", "entity": S, "months_income": -0.5}, {"type": "prestige", "entity": S, "delta": 5}], 2)]),
  dict(id="gen_anarchist_attack", y=(1880, 1925), conds=[{"type": "radicalism_above", "entity": S, "value": 0.2}], mtth=100,
       t="Vụ ám sát của phe vô chính phủ", x="Một quả bom phát nổ trên đại lộ, nhắm vào cỗ xe của một bộ trưởng. Phe vô chính phủ nhận trách nhiệm.",
       o=[opt("crackdown", "Lập lực lượng cảnh sát chính trị.", [mod("secret_police", "Cảnh sát chính trị", 60, {"police": 0.1, "ig_intelligentsia": -2, "legitimacy": -1})], 2),
          opt("reforms", "Cải cách để tước vũ khí lý lẽ của họ.", [mod("reform_answer", "Cải cách để trấn an", 36, {"reform": 0.02, "radicalism": -0.02})], 1)]),
  dict(id="gen_gold_rush", y=(1840, 1910), conds=[], mtth=150,
       t="Phát hiện mỏ vàng", x="Một người chăn cừu nhặt được hòn đá lấp lánh bên bờ suối. Chỉ vài tuần sau, hàng nghìn người đổ về.",
       o=[opt("state", "Nhà nước kiểm soát và đánh thuế mỏ.", [{"type": "treasury", "entity": S, "months_income": 2}, mod("gold_tax", "Thuế mỏ vàng", 36, {"legitimacy": -1, "tax": 0.03})], 2),
          opt("rush", "Mở cửa cho mọi người.", [mod("gold_rush", "Cơn sốt vàng", 48, {"attraction": 0.4, "trade": 0.04}, True)], 2)]),
  dict(id="gen_university_reform", y=(1836, 2026), conds=[{"type": "law", "entity": S, "group": "education", "value": "public_schools"}], mtth=100,
       t="Cải cách đại học", x="Các giáo sư đề xuất mô hình đại học nghiên cứu: phòng thí nghiệm, hội thảo khoa học và tự do học thuật.",
       o=[opt("fund", "Tài trợ mô hình mới.", [{"type": "treasury", "entity": S, "months_income": -1}, mod("research_university", "Đại học nghiên cứu", 120, {"innovation": 0.1, "literacy": 0.1, "ig_intelligentsia": 2})], 2),
          opt("control", "Đặt trường dưới sự giám sát của bộ.", [mod("state_university", "Đại học nhà nước", 60, {"innovation": 0.03, "police": 0.02, "ig_intelligentsia": -1})], 1)]),
]
for g in GEN:
    conds = [{"type": "year_between", "from": g["y"][0], "to": g["y"][1]}] + [dict(c) for c in g["conds"]]
    events.append({"id": g["id"], "country": "$any", "mode": "both", "trigger": {"conditions": conds, "mtth_months": g.get("mtth", 90)},
                   "title_vi": g["t"], "text_vi": g["x"], "options": g["o"]})
journals.append({"id": "gen_votes_for_women", "country": "$any", "mode": "both",
  "title_vi": "Quyền bầu cử cho phụ nữ", "text_vi": "Nghị viện tranh luận về quyền bầu cử của phụ nữ. Thông qua luật bầu cử phổ thông trong 10 năm để hoàn thành.",
  "complete": [{"type": "law", "entity": S, "group": "power", "value": "universal_suffrage"}], "timeout_months": 120,
  "on_complete": [mod("women_vote", "Phụ nữ đi bầu", 120, {"legitimacy": 4, "literacy": 0.05, "ig_intelligentsia": 2}, True)],
  "on_fail": [mod("women_denied", "Phụ nữ bị khước từ", 60, {"radicalism": 0.02, "ig_intelligentsia": -2}, True)]})

# ---------------------------------------------------------------- 1848: Springtime of the Peoples (journal + outcomes)
journals.append({"id": "gen_springtime_1848", "country": "$any", "mode": "both", "window": ["1847-06-01", "1852-12-31"],
  "trigger": {"conditions": [{"type": "year_between", "from": 1847, "to": 1849}, {"type": "radicalism_above", "entity": S, "value": 0.18}, {"type": "any", "of": [{"type": "law", "entity": S, "group": "power", "value": "autocracy"}, {"type": "law", "entity": S, "group": "power", "value": "oligarchy"}]}]},
  "title_vi": "Mùa xuân của các dân tộc", "text_vi": "Lời kêu gọi cách mạng tự do lan khắp châu lục. Hoặc nhượng bộ (bầu cử theo tài sản hoặc phổ thông) để thắng lợi cách mạng, hoặc giữ hòa bình và hạ nhiệt cực đoan để phe bảo thủ thắng.",
  "progress": {"start": 50, "max": 100, "label_vi": "Cách mạng (100) – Phản động (0)", "monthly": [
     {"if": {"type": "radicalism_above", "entity": S, "value": 0.25}, "add": 3},
     {"if": {"type": "law", "entity": S, "group": "press", "value": "censorship"}, "add": -2},
     {"if": {"type": "legitimacy_below", "entity": S, "value": 40}, "add": 2},
     {"add": -1}]},
  "complete": [{"type": "any", "of": [{"type": "law", "entity": S, "group": "power", "value": "census_suffrage"}, {"type": "law", "entity": S, "group": "power", "value": "universal_male_suffrage"}, {"type": "progress_at_least", "value": 100}]}],
  "fail": [{"type": "months_elapsed", "value": 36}],
  "on_complete": [{"type": "trigger_event", "entity": S, "id": "gen_revolution_victorious"}],
  "on_fail": [{"type": "trigger_event", "entity": S, "id": "gen_revolution_vanquished"}]})
events.append({"id": "gen_revolution_victorious", "country": "$any", "mode": "both", "trigger": {"conditions": [{"type": "journal_active", "id": "__never__"}]},
  "title_vi": "Cách mạng thắng lợi", "text_vi": "Những chiến lũy đã thắng. Một hiến pháp mới được ban hành, và những người từng bị cấm nói nay ngồi trong nghị viện.",
  "options": [opt("liberal", "Một kỷ nguyên tự do bắt đầu!", [{"type": "set_law", "entity": S, "group": "press", "value": "limited_press"}, mod("springtime_won", "Mùa xuân thắng lợi", 60, {"reform": 0.02, "legitimacy": 5, "ig_intelligentsia": 3, "ig_landowners": -2}, True)], 1)]})
events.append({"id": "gen_revolution_vanquished", "country": "$any", "mode": "both", "trigger": {"conditions": [{"type": "journal_active", "id": "__never__"}]},
  "title_vi": "Cách mạng bị dập tắt", "text_vi": "Quân đội đã quét sạch các chiến lũy. Những người cầm đầu bị lưu đày, còn trật tự cũ trở lại.",
  "options": [opt("reaction", "Trật tự đã được khôi phục.", [mod("reaction", "Thời kỳ phản động", 60, {"police": 0.08, "ig_landowners": 2, "ig_intelligentsia": -3, "radicalism": -0.03}, True)], 1)]})

json.dump({"schema": "story_events_v1", "country": "$any", "note": "EVT-01 starter pack (Claude). Original text; mechanics inspired by Victoria 3 events.", "events": events, "journals": journals},
          open(OUT, "w"), ensure_ascii=False, indent=1)
print(len(events), "events,", len(journals), "journals")
