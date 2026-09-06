/* ICU Book · Section XVI 中毒與藥物過量 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 52–53（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch52 ================= */
  I.bindCalc('c52apap', function () {
    var hrs = num('ap_h'), lv = num('ap_l'), wt = num('ap_w'), risk = val('ap_r') === 'y', ast = val('ap_a') === 'y', er = val('ap_er') === 'y', enc = val('ap_e') === 'y';
    var inWin = !na(hrs) && hrs >= 4 && hrs <= 24;
    var tline = inWin ? 150 * Math.pow(5 / 150, (hrs - 4) / 20) : NaN, hline = inWin ? 300 * Math.pow(10 / 300, (hrs - 4) / 20) : NaN;
    var above = inWin && !na(lv) && lv >= tline, high = inWin && !na(lv) && lv >= hline;
    var treat = above || ast;
    var h = row('列線圖', na(hrs) ? '—' : !inWin ? '只適用 4–24 小時的可定時急性攝入' : '治療線 ' + fmt(tline, 0) + '、高風險線 ' + fmt(hline, 0) + ' μg/mL', '', !inWin ? 'fl-na' : high ? 'fl-hot' : above ? 'fl-warn' : 'fl-ok', na(lv) || !inWin ? '' : high ? '濃度 ' + fmt(lv, 0) + ' 在高風險線上：90% 會肝毒性、可能要延長 NAC' : above ? '濃度 ' + fmt(lv, 0) + ' 在治療線上：NAC' : '濃度 ' + fmt(lv, 0) + ' 在治療線下' + (er ? '——緩釋劑 4–12 小時未過線要 4–6 小時後重驗' : ''), '治療線 4 小時 150 → 24 小時 5；高風險線 300 → 10；反覆超量攝入濃度不預測風險');
    h += row('NAC', treat ? '給' : (na(lv) && !ast ? '—' : '目前不需要'), '', treat ? 'fl-hot' : 'fl-na', ast ? 'AST／ALT 升高：不管濃度都給' : (treat ? '' : ''), risk ? '有誘因（營養不良、酒精、慢性肝病、P450 誘導劑、鴉片）：>4 g/天就視為潛在毒性' : '毒性劑量約 7.5–15 g（毒物中心用 10 g）；FDA 安全上限 4 g、慢性用 3 g');
    if (treat) {
      h += row('IV 方案（20%）', na(wt) ? '150 mg/kg/1 h（200 mL D5W）→ 50 mg/kg/4 h（500 mL）→ 100 mg/kg/16 h（1,000 mL）' : fmt(wt * 150, 0) + ' mg/1 h → ' + fmt(wt * 50, 0) + ' mg/4 h → ' + fmt(wt * 100, 0) + ' mg/16 h（共 ' + fmt(wt * 300, 0) + ' mg／21 h）', '', 'fl-warn', '21 小時後看停藥條件：濃度 <10 μg/mL、AST／ALT 正常化…（表截斷）；未達就 ≥6.25 mg/kg/hr' + (na(wt) ? '' : '（' + fmt(wt * 6.25, 0) + ' mg/hr）') + ' 續 12–24 小時再評', '過敏反應（噁心嘔吐、皮疹、血管性水腫）第一小時最多、9–77%');
      h += row('口服替代', na(wt) ? '140 mg/kg → 70 mg/kg q4h × 72 h（共 1,330 mg/kg）' : fmt(wt * 140, 0) + ' mg → ' + fmt(wt * 70, 0) + ' mg q4h × 72 h', '', 'fl-na', '10% 稀釋成 5%；等效但硫味難喝、少用', '');
      if (!na(lv) && lv > 900 && enc) h += row('血液透析', '濃度 >900 ＋ 肝性腦病變：加做', '', 'fl-hot', 'NAC 也被透析掉：透析中 ≥12.5 mg/kg/hr' + (na(wt) ? '' : '（' + fmt(wt * 12.5, 0) + ' mg/hr）'), '口服方案不需調');
    }
    h += '<div class="rx-flag">機轉：10% 走 P450 產毒性代謝物，靠 glutathione 的 cysteine 清除；>4 g/天結合路徑飽和、glutathione 掉 70% 就傷肝。三期：24 小時內無症狀 → 24–72 小時轉胺酶升（可達 10,000）、黃疸 INR 腎 → 72–96 小時高峰、腦病變乳酸寡尿多器官衰竭。NAC 是 cysteine 替身（glutathione 本身進不了細胞）；死亡率 0.4%，惡化者考慮移植。作者結語：acetaminophen 是 ALF 首因、一半是無意過量——該列處方藥；我們用一個可能致命的藥取代了一個可能有毒的藥。</div><div class="note">原書表 52.1 的 NAC 停藥條件在第 2 條截斷。</div>';
    document.getElementById('c52apap_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c52bzd', function () {
    var unk = val('bz_u') === 'y', sz = val('bz_s') === 'y', dep = val('bz_d') === 'y', proc = val('bz_p') === 'y';
    var ci = unk || sz || dep;
    var h = row('Flumazenil', ci ? '不建議' : proc ? '適合：程序鎮靜後快速甦醒' : '可用但不流行', '', ci ? 'fl-hot' : 'fl-na', ci ? [unk ? '原因不明的昏迷' : '', sz ? '癲癇史' : '', dep ? '慢性 BZD 依賴' : ''].filter(Boolean).join('、') : '逆轉鎮靜可靠、逆轉呼吸抑制不一致', '副作用：輕微 28% vs 10%（躁動噁心嘔吐）、重大 2.4% vs 0.4%（上心室心律不整、癲癇）');
    if (!ci) h += row('劑量', '0.2 mg IV，每幾分鐘重複到累積 1.0 mg', '', 'fl-na', '1–2 分起效、6–10 分高峰、約 1 小時', '30–60 分可再鎮靜：可接輸注 0.3–0.4 mg/hr');
    h += '<div class="rx-flag">BZD 是藥物相關死亡第二名，但單用很少致命——幾乎都合併鴉片等呼吸抑制劑。純 BZD 過量深鎮靜、少昏迷；呼吸抑制 2–12%、心搏過緩 1–2%、低血壓 5–7%；也可躁動混亂幻覺、像酒精戒斷。沒有血中檢驗、尿篩會漏 lorazepam——靠病史。處置是支持（血壓、呼吸器）。</div>';
    document.getElementById('c52bzd_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c52bb', function () {
    var wt = num('bb_w'), ca = num('bb_ca'), resp = val('bb_r'), avb = val('bb_av') === 'y', ccb = val('bb_ccb') === 'y';
    var h = row('Glucagon 首劑', na(wt) ? '3 mg IV（0.05 mg/kg）' : '3 mg IV（0.05 mg/kg ＝ ' + fmt(wt * 0.05, 1) + ' mg）', '', 'fl-warn', '3 分內應見反應；90% 有效', '受體與 β 受體共用 adenyl cyclase → cAMP → 鈣內流，繞過 β 阻斷');
    h += row('無效', na(wt) ? '第二劑 5 mg（0.07 mg/kg）' : '第二劑 5 mg（0.07 mg/kg ＝ ' + fmt(wt * 0.07, 1) + ' mg）', '', resp === 'no' ? 'fl-hot' : 'fl-na', resp === 'no' ? '再無效：milrinone 等 PDE 抑制劑（血管擴張、留給頑固者）' : '', '');
    h += row('有效後', '輸注 5 mg/hr', '', resp === 'yes' ? 'fl-ok' : 'fl-na', '效果只 5 分鐘', '>5 mg/hr 噁心嘔吐頑固；輕度高血糖 → 胰島素 → 低血鉀；刺激兒茶酚胺升血壓');
    if (!na(ca)) h += row('游離鈣', fmt(ca, 2), 'mmol/L', ca < 1.15 ? 'fl-warn' : 'fl-ok', ca < 1.15 ? '偏低：矯正後 glucagon 的變時反應才好' : '正常', '');
    if (avb) h += row('AV 阻斷或神經症狀', 'Glucagon 無效', '', 'fl-hot', '膜穩定效應（非 β 阻斷）：AV 傳導延長到完全阻斷、嗜睡昏迷癲癇（propranolol 60%）', '脂溶性藥累積在中樞');
    if (ccb) h += row('鈣離子阻斷劑', 'Glucagon 也能拮抗但效果較差', '', 'fl-na', '', '');
    h += '<div class="rx-flag">典型：竇性心搏過緩（耐受良好）與低血壓（腎素阻斷的血管擴張、負性肌力）。</div>';
    document.getElementById('c52bb_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c52nal', function () {
    var pres = val('nx_p'), route = val('nx_r'), eff = num('nx_e');
    var h;
    if (route === 'in') h = row('鼻噴 Narcan', '2 mg 一鼻孔（4 mg 分 2＋2 更好）；3 分無反應另一鼻孔再一劑', '', 'fl-warn', '與 IV 等效、現場易用；0.4 mg 就有效過；反應約 3 分、20 分高峰、半衰期 1.5–2 小時', '意識與呼吸抑制都能逆轉');
    else if (pres === 'resp') h = row('IV：呼吸抑制', '2 mg IV push → 2–3 分無反應 4 mg → 可加到 15 mg', '', 'fl-hot', '15 mg 仍無反應：不是鴉片', '呼吸抑制比意識更難逆轉');
    else h = row('IV：只有意識低下', '0.4 mg IV → 2 分可重複；共 0.8 mg 應有效', '', 'fl-warn', '0.8 mg 無效就不是鴉片衍生物', 'IV 生體可用率與速度較好但臨床意義未證、多留給沒有鼻噴時');
    h += row('之後', na(eff) ? '有效後接輸注：每小時 2/3 有效劑量（稀釋 250–500 mL 食鹽水、6 小時）' : '輸注 ' + fmt(eff * 2 / 3, 2) + ' mg/hr（有效劑量 ' + fmt(eff, 1) + ' 的 2/3；6 小時 ' + fmt(eff * 4, 1) + ' mg 稀釋 250–500 mL）', '', 'fl-na', 'IV 逆轉只約 1 小時、鼻噴 1–2 小時後鴉片效果回來', '副作用：戒斷；高劑量偶見急性肺水腫（交感活化肺靜脈收縮）');
    h += '<div class="rx-flag">「木僵、針尖瞳孔、呼吸慢」的教科書三聯徵其實無法從臨床辨識鴉片過量——對 naloxone 的反應最可靠。Naloxone 是純拮抗劑、μ 受體最強（止痛、欣快、呼吸抑制）。多數是處方鴉片不是街頭毒品。</div>';
    document.getElementById('c52nal_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c52asa', function () {
    var lv = num('sa_l'), unit = val('sa_u'), wt = num('sa_w'), renal = val('sa_r') === 'y', lt = val('sa_lt') === 'y', ph = num('sa_ph');
    var mg = unit === 'mmol' ? lv / 0.0724 : lv;
    var cls = na(mg) ? '' : mg > 90 ? 'hd' : mg > 75 ? 'life' : mg > 40 ? 'tox' : mg > 30 ? 'high' : 'ther';
    var h = row('水楊酸濃度', na(mg) ? '—' : fmt(mg, 0) + ' mg/dL（' + fmt(mg * 0.0724, 1) + ' mmol/L）', '', na(mg) ? 'fl-na' : (cls === 'hd' || cls === 'life') ? 'fl-hot' : cls === 'tox' ? 'fl-warn' : 'fl-ok', na(mg) ? '治療 10–30、>40 毒性、>75 危及生命' : cls === 'hd' ? '>90：血液透析' : cls === 'life' ? '>75：危及生命' : cls === 'tox' ? '>40：毒性' : cls === 'high' ? '略高於治療範圍' : '治療範圍 10–30', '慢性中毒濃度常較低；致死攝入 10–30 g 或 150 mg/kg');
    var hd = cls === 'hd' || (mg > 80 && renal) || lt;
    h += row('血液透析', hd ? '指徵符合' : '目前不符', '', hd ? 'fl-hot' : 'fl-na', hd ? [cls === 'hd' ? '>90 mg/dL' : '', (mg > 80 && renal) ? '>80 ＋ 腎功能受損' : '', lt ? '危及生命（腦水腫、ARDS、多器官衰竭）' : ''].filter(Boolean).join('、') : '>90；>80 ＋ 腎功能受損；危及生命的表現', '最有效的清除法、常被低估使用');
    h += row('活性碳', na(wt) ? '1 g/kg（≤100 g）q4h' : fmt(Math.min(wt, 100), 0) + ' g q4h', '', 'fl-na', '不管攝入時間都給（胃排空慢、腸衣緩釋滯留）；2 小時內最有效', '到糞便出現活性碳或濃度開始降');
    h += row('尿液鹼化', '3 amps NaHCO₃（132 mEq）＋ 40 mEq KCl 入 1 L D5W；負荷 1–2 mEq/kg' + (na(wt) ? '' : '（' + fmt(wt, 0) + '–' + fmt(wt * 2, 0) + ' mEq）') + ' → 2–3 mL/kg/hr' + (na(wt) ? '' : '（' + fmt(wt * 2, 0) + '–' + fmt(wt * 3, 0) + ' mL/hr）'), '', 'fl-warn', '尿量 1–2 mL/kg/hr、尿 pH ≥7.5，到濃度回治療範圍', '碳酸氫鹽降血鉀、低血鉀讓遠端小管分泌 H⁺ 而鹼化不了——所以加鉀');
    if (!na(ph)) h += row('動脈 pH', fmt(ph, 2), '', ph < 7.35 ? 'fl-hot' : 'fl-na', ph < 7.35 ? '酸血症：預後差的徵象（晚期）' : '早期是呼吸性鹼中毒', '');
    h += '<div class="rx-flag">標誌：呼吸性鹼中毒（直接刺激腦幹、最早）＋高 AG 代謝性酸中毒（解偶聯 → 糖解 → 乳酸與酮酸；晚期）。解偶聯升代謝率：發燒、出汗、脫水。早期耳鳴眩暈噁心嘔吐過度換氣，重症躁動發燒昏迷腦水腫 ARDS 不穩；檢驗低碳酸、乳酸、橫紋肌溶解、高血鈉、AKI。是 OTC 止痛藥自殺死亡第二名。</div>';
    document.getElementById('c52asa_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch53 ================= */
  I.bindCalc('c53co', function () {
    var cohb = num('co_c'), smoker = val('co_s') === 'y', o2 = val('co_o'), lact = num('co_l'), unst = val('co_u') === 'y', sev = val('co_sev') === 'y';
    var thr = smoker ? 10 : 4;
    var half = o2 === 'room' ? 320 : 74;
    var t = na(cohb) ? NaN : Math.log(cohb / thr) / Math.log(2) * half;
    var h = row('COHb', na(cohb) ? '—' : fmt(cohb, 1) + '%', '', na(cohb) ? 'fl-na' : cohb > thr ? 'fl-hot' : 'fl-ok', na(cohb) ? '' : cohb > thr ? '升高（門檻非吸菸 3–4%、吸菸 10%）' : '未超過門檻', 'COHb 與嚴重度相關差（肌紅蛋白、細胞色素氧化酶、嗜中性球活化）；脈搏血氧看不出、要 8 波長 CO-oximeter');
    h += row('治療', '100% 氧：高流量加熱加濕鼻導管（到 40 L/min）最能保證', '', 'fl-warn', '半衰期室內空氣 320 分、100% 氧 74 分', na(t) || t <= 0 ? '' : '從 ' + fmt(cohb, 0) + '% 降到門檻約 ' + fmt(t, 0) + ' 分鐘' + (o2 === 'room' ? '（用 100% 氧只要 ' + fmt(Math.log(cohb / thr) / Math.log(2) * 74, 0) + ' 分）' : ''));
    h += row('高壓氧', '整體證據未優於常壓氧', '', 'fl-na', '可能減少遲發神經精神後遺症（1–4 週：認知退化、帕金森；與 COHb 相關性難建立）', '');
    if (sev) h += row('中重度', 'ECG ＋ 心肌標記', '', 'fl-warn', '心肌損傷近 40%、預後差', '');
    var cn = (!na(lact) && lact >= 10) || unst;
    h += row('氰化物', cn ? '火場吸入併乳酸 ≥10 或血行動力不穩：經驗性治療（hydroxocobalamin）' : '火場吸入：乳酸 ≥10 或不穩就經驗性治療', '', cn ? 'fl-hot' : 'fl-na', '房屋火災同時產生 HCN', '');
    h += '<div class="rx-flag">CO 與血紅素親和力 >200 倍、0.4 mmHg 就飽和；也抑制肌紅蛋白與細胞色素氧化酶 → 無氧代謝。表現不專一：額頭痛、頭暈、嗜睡噁心 → 失調躁動混亂 → 昏迷癲癇 ARDS 不穩乳酸；櫻桃紅皮膚罕見。觸媒轉化器讓汽車排放少 95%。</div>';
    document.getElementById('c53co_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c53cn', function () {
    var src = val('cn_s'), arrest = val('cn_a') === 'y', renal = val('cn_r') === 'y', iv = val('cn_iv') === 'y', lact = num('cn_l');
    var h = row('Hydroxocobalamin', arrest ? '10 g IV' : '5 g IV／15 分，危及生命再 5 g', '', 'fl-hot', '首選：與氰結合成 cyanocobalamin 排尿', '安全；血壓暫升、尿與體液紅色幾天；Cyanokit 只有 5 g 粉末、無稀釋液、無第二劑');
    h += row('Sodium thiosulfate', renal ? '腎衰竭不用' : '12.5 g IV（50 mL 無菌水）', '', renal ? 'fl-warn' : 'fl-na', '轉硫成 thiocyanate 由腎排；可與 hydroxocobalamin 合用', renal ? 'Thiocyanate 是神經毒、腎衰竭累積 → 急性精神病' : 'Cyanide Antidote Kit：2 瓶 thiosulfate ＋ 12 支 amyl nitrite');
    h += row('亞硝酸鹽', src === 'smoke' ? '禁忌（methemoglobin 加重組織缺氧）' : iv ? '不需要' : '沒有靜脈通路時吸入 amyl nitrite 暫用：15 秒吸 15 秒休、每 3 分換一支', '', src === 'smoke' ? 'fl-hot' : 'fl-na', '生成 methemoglobin 結合氰、再靠 thiosulfate 清', '');
    if (!na(lact)) h += row('乳酸', fmt(lact, 1), 'mmol/L', lact >= 10 ? 'fl-hot' : 'fl-na', lact >= 10 ? '≥10：氰化物的標誌' : '', '靜脈血「動脈化」（PO₂ 高）因組織不用氧');
    h += '<div class="rx-flag">來源：火場 HCN、口服氰化鉀鈉（胃酸轉 HCN）、nitroprusside 輸注（別忽略）。抑制細胞色素氧化酶（電子傳遞鏈末端）→ 粒線體停產 ATP → 乳酸酸中毒。早期躁動心搏快高血壓過度換氣 → 意識喪失心搏過緩低血壓停止；吸入後 <5 分可停止、口服可延幾小時。臨床診斷（全血氰化物來不及）；火場吸入與 CO 難分——不穩或乳酸 ≥10 就治。兩套 kit 都不齊全。</div><div class="note">原書表 53.1 在 thiosulfate 列截斷。</div>';
    document.getElementById('c53cn_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c53alc', function () {
    var ag = val('ta_a'), wt = num('ta_w'), lv = num('ta_l'), ph = num('ta_ph'), vis = val('ta_v') === 'y', organ = val('ta_o') === 'y', gly = num('ta_g'), doses = num('ta_d') || 0;
    var h = row('濃度', na(lv) ? '—' : fmt(lv, 0), 'mg/dL', na(lv) ? 'fl-na' : lv > 20 ? 'fl-hot' : 'fl-ok', na(lv) ? '>20 毒性；結果不即時、不用來決定開始治療' : lv > 20 ? '>20：毒性' : '<20：fomepizole 終點之一', ag === 'eg' ? '乙二醇：glycolic acid 更能預測嚴重度、>8 mmol/L 建議透析' : '甲醇：formic acid 是粒線體毒（視網膜、視神經、基底核 64% CT 低密度）');
    h += row('Fomepizole', na(wt) ? '15 mg/kg 負荷 → 10 mg/kg q12h × 4 → 之後 15 mg/kg q12h' : fmt(wt * 15, 0) + ' mg 負荷 → ' + fmt(wt * 10, 0) + ' mg q12h × 4 劑 → 之後 ' + fmt(wt * 15, 0) + ' mg q12h', '', 'fl-warn', '抑制 alcohol dehydrogenase；4 小時內開始最好', '終點：濃度 <20、pH 正常、（表截斷）；4 劑後濃度仍 >20 就升到 15 mg/kg；透析時要調整');
    var hd = (!na(ph) && ph < 7.1) || organ || (ag === 'meth' && vis) || (ag === 'eg' && !na(gly) && gly > 8);
    h += row('血液透析', hd ? '立即' : '目前不符', '', hd ? 'fl-hot' : 'fl-na', hd ? [(!na(ph) && ph < 7.1) ? 'pH <7.1' : '', organ ? '末端器官損傷（昏迷、癲癇、腎功能）' : '', (ag === 'meth' && vis) ? '視覺障礙' : '', (ag === 'eg' && gly > 8) ? 'glycolic acid >8' : ''].filter(Boolean).join('、') : '嚴重酸血症 pH <7.1、末端器官損傷' + (ag === 'meth' ? '、視覺障礙' : '、glycolic acid >8'), '清除母體與所有代謝物、可能多次');
    h += row('輔助', ag === 'eg' ? 'Thiamine 100 mg IV/天 ＋ pyridoxine 100 mg IV/天' : 'Folinic acid（leucovorin）1 mg/kg（≤50 mg）IV q4h' + (na(wt) ? '' : '：' + fmt(Math.min(wt, 50), 0) + ' mg') + '；沒有就 folic acid', '', 'fl-na', ag === 'eg' ? '把 glyoxylic acid 導向無毒代謝物' : '把 formic acid 轉成無毒代謝物', '');
    h += '<div class="rx-flag">乙二醇：防凍劑、甜味；80% 肝代謝經 alcohol dehydrogenase → 一連串強酸 → 草酸（每步 NAD→NADH 也推 pyruvate 變乳酸，乳酸升高會誤導）；草酸鈣結晶沉積小管（尿 50% 可見；針狀單水合物較專一——要特別要求找結晶）。早期像喝醉但沒酒味 → 昏迷癲癇腎衰竭（可晚到 24 小時）肺水腫崩潰；高 AG ＋ 高滲透壓間隙。甲醇：木精（蟲膠、去漆劑、雨刷水、固態燃料）→ formic acid；6 小時內像喝醉、6–24 小時視覺障礙（盲點、模糊、失明；視乳頭水腫）昏迷癲癇；無結晶尿。不明原因高 AG 代謝性酸中毒都要想。「毒性酒精」是誤稱——暗示乙醇無毒。</div><div class="note">原書表 53.2 的 fomepizole 終點在第三條截斷。</div>';
    document.getElementById('c53alc_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch52 過量 → 解藥 */
  var od = { sign: null };
  window.odPick = function (k, v, btn) { flowSelect(btn); od[k] = v; odRender(); };
  function odRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    var R = { opi: ['rec-urgent', '意識低下＋呼吸慢（但臨床辨識不可靠）：naloxone——鼻噴 2 mg（或 IV 0.4 → 0.8 意識；2 → 4 → 15 mg 呼吸抑制），有效後輸注 2/3 有效劑量/hr', '<li>15 mg 無反應就不是鴉片。</li>'], bzd: ['rec-elective', '深鎮靜、少昏迷、呼吸抑制少：支持為主；flumazenil 0.2 mg 到 1 mg 只給明確 BZD 且無癲癇史／依賴／不明昏迷者', '<li>BZD 死亡幾乎都合併鴉片。</li>'], bb: ['rec-urgent', '心搏過緩＋低血壓：glucagon 3 mg（0.05 mg/kg）→ 5 mg → 輸注 5 mg/hr；矯正游離鈣；頑固用 milrinone', '<li>AV 阻斷與神經症狀是膜穩定效應、glucagon 無效。</li>'], apap: ['rec-urgent', '24 小時內無症狀、之後轉胺酶飆升：列線圖（4 小時 150 → 24 小時 5）或 AST 升就 NAC 300 mg/kg／21 h', '<li>>900 μg/mL ＋ 腦病變加透析；惡化考慮移植。</li>'], asa: ['rec-urgent', '過度換氣、耳鳴、呼吸性鹼中毒＋高 AG 酸中毒：活性碳 1 g/kg q4h、尿鹼化（NaHCO₃ ＋ KCl、尿 pH ≥7.5）；>90 mg/dL 或 >80 ＋ 腎損或危及生命就透析', '<li>酸血症 pH 是晚期、預後差。</li>'] };
    if (od.sign && R[od.sign]) { cls = R[od.sign][0]; t = R[od.sign][1]; d = R[od.sign][2]; n = '美國過量死亡 2000 年 2 萬 → 2022 年 10.8 萬；acetaminophen 一半是無意過量。'; }
    flowRec('od_rec', cls, t, d, n);
  }
  window.odReset = function () { od = { sign: null }; selAll('#od_flow'); odRender(); };

  /* Ch53 不明高 AG 酸中毒／火場 */
  var ps = { ctx: null, gap: null, eye: null };
  window.psPick = function (k, v, btn) { flowSelect(btn); ps[k] = v; psRender(); };
  function psRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ps.ctx === 'smoke') { cls = 'rec-urgent'; t = '火場吸入：100% 氧（高流量鼻導管）＋ CO-oximeter 驗 COHb；不穩或乳酸 ≥10 → hydroxocobalamin 5 g（停止 10 g）；亞硝酸鹽禁忌'; d = '<li>脈搏血氧會把 COHb 讀成氧合血紅素——不可靠。</li><li>中重度做 ECG 與心肌標記（心肌損傷 40%）。</li>'; }
    else if (ps.ctx === 'acid') {
      if (ps.gap === 'high') {
        if (ps.eye === 'yes') { cls = 'rec-urgent'; t = '高 AG ＋ 高滲透壓間隙 ＋ 視覺障礙：甲醇——fomepizole 15 mg/kg、視覺障礙就透析、folinic acid 1 mg/kg q4h'; d = '<li>無結晶尿；基底核低密度 64%。</li>'; }
        else if (ps.eye === 'no') { cls = 'rec-urgent'; t = '高 AG ＋ 高滲透壓間隙、無視覺障礙：乙二醇——fomepizole、找針狀草酸鈣結晶、thiamine ＋ pyridoxine；pH <7.1、器官損傷或 glycolic acid >8 就透析'; d = '<li>乳酸也升、別被誤導成乳酸酸中毒；腎衰竭可晚到 24 小時。</li>'; }
        else { cls = 'rec-elective'; t = '高滲透壓間隙：有視覺障礙嗎？'; d = '<li>請回答第 3 步。</li>'; }
      } else if (ps.gap === 'normal') { cls = 'rec-elective'; t = '滲透壓間隙正常：想水楊酸（呼吸性鹼中毒＋高 AG）、氰化物（乳酸 >10、靜脈血動脈化）、乳酸與酮酸的其他原因'; d = '<li>第 31–32 章的 gap 分析。</li>'; }
      else { cls = 'rec-elective'; t = '不明高 AG 代謝性酸中毒：滲透壓間隙？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (ps.ctx) n = '甲醇與乙二醇：任何不明高 AG 酸中毒都要想；治療決定靠臨床、不等濃度。';
    flowRec('ps_rec', cls, t, d, n);
  }
  window.psReset = function () { ps = { ctx: null, gap: null, eye: null }; selAll('#ps_flow'); psRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_rx', 'tox-rx', [
    { q: 'Acetaminophen 何時該給 NAC？', o: ['只有濃度 >150', '4–24 小時濃度在治療線上（150 → 5 μg/mL），或轉胺酶升高（不管濃度）；緩釋劑 4–12 小時未過線要重驗', '只有攝入 >10 g', '只有黃疸'], a: 1, why: 'IV 150 mg/kg/1 h → 50/4 h → 100/16 h 共 300 mg/kg；未達停藥條件續 ≥6.25 mg/kg/hr；>900 ＋ 腦病變透析（NAC ≥12.5 mg/kg/hr）。誘因（酒精、營養不良、P450 誘導、鴉片）>4 g 就算毒性。' },
    { q: 'Flumazenil 什麼時候不要用？', o: ['從不禁忌', '原因不明的昏迷、癲癇史、慢性 BZD 依賴（重大副作用 2.4%：癲癇、心律不整）；主要用途是程序鎮靜後甦醒', '呼吸抑制時', '老人'], a: 1, why: '0.2 mg 到 1 mg；效果 1 小時、可再鎮靜（輸注 0.3–0.4 mg/hr）；逆轉呼吸抑制不一致。純 BZD 過量很少致命。' },
    { q: 'β 阻斷劑過量的解藥與限制？', o: ['Atropine', 'Glucagon 3 mg（0.05 mg/kg）→ 5 mg → 5 mg/hr（繞過 β 受體升 cAMP；90% 有效）；AV 阻斷與神經症狀是膜穩定效應、無效；頑固用 milrinone', 'Calcium', 'Epinephrine 就好'], a: 1, why: '變時反應要游離鈣正常；副作用噁心嘔吐（>5 mg/hr）、高血糖低血鉀、升血壓。Propranolol 過量癲癇 60%。' },
    { q: 'Naloxone 的劑量策略？', o: ['一律 0.4 mg', '鼻噴 2 mg（4 mg 分兩鼻孔）；IV 意識低下 0.4 → 0.8；呼吸抑制 2 → 4 → 15 mg（無反應非鴉片）；有效後輸注 2/3 有效劑量/hr', '一律 2 mg IV', '只用輸注'], a: 1, why: '臨床三聯徵不可靠、對 naloxone 的反應最可靠；IV 效果 1 小時、鼻噴 1–2 小時；副作用戒斷、偶見肺水腫。' },
    { q: '水楊酸中毒的酸鹼標誌？', o: ['單純代謝性酸中毒', '呼吸性鹼中毒（直接刺激腦幹、最早）＋高 AG 代謝性酸中毒（解偶聯 → 乳酸酮酸；晚期、酸血症預後差）', '呼吸性酸中毒', '代謝性鹼中毒'], a: 1, why: '治療 10–30、>40 毒性、>75 危及生命 mg/dL；活性碳 1 g/kg q4h 不管時間；尿鹼化 3 amps NaHCO₃ ＋ 40 KCl、尿 pH ≥7.5；透析 >90、>80 ＋ 腎損、危及生命。' },
    { q: '尿液鹼化為什麼要加鉀？', o: ['防心律不整', '碳酸氫鹽把鉀推進細胞、低血鉀讓遠端小管分泌 H⁺、尿就鹼化不了', '促進排泄', '不需要'], a: 1, why: '負荷 1–2 mEq/kg → 2–3 mL/kg/hr、尿量 1–2 mL/kg/hr。作者結語：acetaminophen 該列處方藥。' }
  ]);
  I.renderQuiz('qz_poison', 'tox-poison', [
    { q: '為什麼脈搏血氧偵測不到 CO 中毒？', o: ['CO 讓血氧計壞掉', '660 nm 的吸光 COHb 與氧合血紅素幾乎相同，被讀成 HbO₂——要 8 波長 CO-oximeter', '因為 COHb 是紅色', '因為血壓低'], a: 1, why: '門檻非吸菸 3–4%、吸菸 10%；COHb 與嚴重度相關差（肌紅蛋白、細胞色素氧化酶、嗜中性球）。' },
    { q: 'CO 中毒的治療？', o: ['高壓氧首選', '100% 氧（高流量加熱加濕鼻導管最能保證）：半衰期 320 → 74 分、1.5 小時內正常；高壓氧整體未優於常壓氧；中重度做 ECG 與心肌標記（40% 心肌損傷）', '輸血', '只觀察'], a: 1, why: '遲發神經精神後遺症 1–4 週；櫻桃紅皮膚罕見。' },
    { q: '火場吸入何時經驗性治療氰化物？', o: ['等全血氰化物', '血行動力不穩或乳酸 ≥10：hydroxocobalamin 5 g／15 分（停止 10 g、危及生命再 5 g）；可加 thiosulfate 12.5 g（腎衰竭不用）；亞硝酸鹽在火場禁忌', 'COHb >20%', '所有吸入者'], a: 1, why: '抑制細胞色素氧化酶 → 乳酸；吸入後 <5 分可停止。Cyanokit 無稀釋液無第二劑；amyl nitrite 只在無靜脈通路暫用。Nitroprusside 是醫源性來源。' },
    { q: '乙二醇中毒的線索？', o: ['酒味', '像喝醉但無酒味、高 AG ＋ 高滲透壓間隙、乳酸也升（誤導）、針狀草酸鈣單水合物結晶（50%、要特別要求找）、腎衰竭可晚到 24 小時', '視覺障礙', '低 AG'], a: 1, why: '甜味防凍劑；>20 mg/dL 毒性、glycolic acid >8 mmol/L 建議透析；輔助 thiamine ＋ pyridoxine 各 100 mg IV。' },
    { q: 'Fomepizole 的方案與透析指徵？', o: ['單次 15 mg/kg', '15 mg/kg 負荷 → 10 mg/kg q12h × 4 → 15 mg/kg q12h 到濃度 <20 且 pH 正常；4 小時內最好；透析：pH <7.1、末端器官損傷（昏迷癲癇腎）、甲醇的視覺障礙', '乙醇比較好', '不需透析'], a: 1, why: '透析時要調劑量；甲醇輔助 folinic acid 1 mg/kg（≤50）q4h。' },
    { q: '甲醇與乙二醇怎麼分？', o: ['分不出', '甲醇 6–24 小時視覺障礙（盲點、失明、視乳頭水腫）、基底核低密度、無結晶尿；乙二醇結晶尿、腎衰竭；兩者都高 AG ＋ 高滲透壓間隙、像喝醉無酒味', '甲醇有結晶尿', '乙二醇失明'], a: 1, why: '任何不明高 AG 酸中毒都要想；「毒性酒精」是誤稱（暗示乙醇無毒）。' }
  ]);
})();
