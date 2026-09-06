/* ICU Book · Section VI 休克症候群 — 本頁的計算器、決策流程與章末測驗
 * 資料來源：Marino's The ICU Book, 5th ed., Ch 14–17（數字全部改寫自內文，非逐字搬移）。
 * 流程沿用臨床工具箱的 st + pick + render 模式（js/common.js 的 flowShow/flowSelect/flowClearSel/flowRec）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;

  /* ================================================================
     Ch14 計算器
     ================================================================ */
  /* 氧輸送與灌流指標（表 14.3 判讀器） */
  I.bindCalc('c14ox', function () {
    var hb = num('ox_hb'), sao2 = num('ox_sao2'), svo2 = num('ox_svo2');
    var ci = num('ox_ci');
    var bsaV = I.bsa(num('ox_h'), num('ox_w'));
    if (!isFinite(ci) && isFinite(num('ox_co')) && isFinite(bsaV)) ci = num('ox_co') / bsaV;
    var cao2 = (isFinite(hb) && isFinite(sao2)) ? 1.34 * hb * sao2 / 100 : NaN;   // mL O2/dL（略去溶解氧 0.003×PaO2）
    var cvo2 = (isFinite(hb) && isFinite(svo2)) ? 1.34 * hb * svo2 / 100 : NaN;
    var do2 = ci * cao2 * 10, vo2 = ci * (cao2 - cvo2) * 10, er = vo2 / do2;
    var gap = num('ox_gap'), lac = num('ox_lac');
    var h = '';
    h += row('Cardiac index', fmt(ci, 2), 'L/min/m²', !isFinite(ci) ? 'fl-na' : ci < 2.5 ? 'fl-hot' : 'fl-ok', !isFinite(ci) ? '' : ci < 2.5 ? '<2.5 灌流不足' : '≥2.5', isFinite(bsaV) && !isFinite(num('ox_ci')) ? 'BSA ' + fmt(bsaV, 2) + ' m²（Mosteller）' : '正常 2.4–4');
    h += row('DO₂ 氧輸送', fmt(do2, 0), 'mL/min/m²', !isFinite(do2) ? 'fl-na' : do2 < 300 ? 'fl-hot' : do2 < 520 ? 'fl-warn' : 'fl-ok', !isFinite(do2) ? '' : do2 < 300 ? '<300 閾值' : do2 < 520 ? '低於正常' : '正常', 'CaO₂ ' + fmt(cao2, 1) + ' mL/dL · 正常 520–600');
    h += row('VO₂ 氧攝取', fmt(vo2, 0), 'mL/min/m²', !isFinite(vo2) ? 'fl-na' : vo2 < 110 ? 'fl-hot' : 'fl-ok', !isFinite(vo2) ? '' : vo2 < 110 ? '<110 利用障礙' : '正常', '正常 110–160');
    h += row('O₂ 萃取率 VO₂/DO₂', fmt(er * 100, 0), '%', !isFinite(er) ? 'fl-na' : er >= 0.5 ? 'fl-hot' : er <= 0.2 ? 'fl-warn' : 'fl-ok', !isFinite(er) ? '' : er >= 0.5 ? '≥50% 有氧代謝受威脅' : er <= 0.2 ? '≤20% 萃取障礙？' : '正常 20–30%', '≈ SaO₂ − ScvO₂');
    h += row('ScvO₂', fmt(svo2, 0), '%', !isFinite(svo2) ? 'fl-na' : svo2 <= 50 ? 'fl-hot' : svo2 >= 80 ? 'fl-warn' : 'fl-ok', !isFinite(svo2) ? '' : svo2 <= 50 ? '≤50% 氧合受威脅' : svo2 >= 80 ? '≥80% 萃取障礙（敗血）' : '正常 65–75%');
    h += row('PCO₂ gap', fmt(gap, 0), 'mmHg', !isFinite(gap) ? 'fl-na' : gap > 6 ? 'fl-hot' : 'fl-ok', !isFinite(gap) ? '' : gap > 6 ? '>6 組織低灌流' : '<6 灌流足夠', '靜脈 − 動脈 PCO₂；正常 2–5。代謝性酸中毒會假性升高');
    h += row('乳酸', fmt(lac, 1), 'mmol/L', !isFinite(lac) ? 'fl-na' : lac > 2 ? 'fl-hot' : 'fl-ok', !isFinite(lac) ? '' : lac > 2 ? '>2 細胞氧利用不足' : '正常', '24 小時內未正常化＝預後差');
    h += '<div class="rx-flag">三種低流量休克（低血容、心因、阻塞）看 <b>CI、DO₂、VO₂</b>；敗血性休克的問題在線粒體而非 DO₂，<b>ScvO₂ 會假性偏高</b>，改看 PCO₂ gap 與乳酸。</div>';
    document.getElementById('c14ox_out').innerHTML = I.wrap(h);
  });

  /* 升壓劑劑量換算（表 14.4） */
  var VP = {
    ne:   { name: 'Norepinephrine', unit: 'min', lo: 5, hi: 40, note: '<10 μg/min 以 β 效應增加心輸出為主；>10 μg/min α 收縮主導；到 <b>30 μg/min</b> 再加量幾乎不再增加收縮反應，此時加第二種藥。SSC 2021：<b>≥0.25–0.5 μg/kg/min</b> 仍低血壓 → 加 vasopressin。' },
    epi:  { name: 'Epinephrine', unit: 'kg', lo: 0.1, hi: 0.5, note: '敗血性休克的二線藥，不打負荷劑量。會升高乳酸（有氧生成）、高血糖、內臟低灌流、心搏過速。' },
    dopa: { name: 'Dopamine', unit: 'kg', lo: 5, hi: 20, note: '≤3 μg/kg/min 腎／內臟血管擴張；3–10 β 增加心搏出；>10 α 收縮並增加後負荷。心律不整最多，已非首選。' },
    phe:  { name: 'Phenylephrine', unit: 'kg', lo: 0.5, hi: 6, note: '純 α；敗血性休克 0.5 → 6 μg/kg/min（超過無益）。麻醉低血壓另有 bolus 50–100 μg／輸注 10–35 → 200 μg/min 的用法。指引不建議用於休克。' },
    at2:  { name: 'Angiotensin II', unit: 'kg', lo: 0.02, hi: 0.08, note: '起始 20 ng/kg/min（0.02 μg/kg/min），每 10–15 分鐘調、3 小時內最高 80 ng/kg/min；之後維持 ≤40 ng/kg/min。血栓事件 13% vs 5%。台大藥品資料庫查無此藥。' }
  };
  I.bindCalc('c14vp', function () {
    var w = num('vp_w'), d = VP[val('vp_drug')], mode = val('vp_mode'), dose = num('vp_dose');
    var mg = num('vp_mg'), ml = num('vp_ml');
    var perMin = NaN, perKg = NaN;
    if (isFinite(dose)) {
      if (mode === 'min') { perMin = dose; perKg = isFinite(w) ? dose / w : NaN; }
      else { perKg = dose; perMin = isFinite(w) ? dose * w : NaN; }
    }
    var conc = (isFinite(mg) && isFinite(ml) && ml > 0) ? mg * 1000 / ml : NaN; // μg/mL
    var mlh = isFinite(conc) && conc > 0 ? perMin * 60 / conc : NaN;
    var ref = d.unit === 'min' ? perMin : perKg;
    var fc = !isFinite(ref) ? 'fl-na' : ref < d.lo ? 'fl-warn' : ref > d.hi ? 'fl-hot' : 'fl-ok';
    var ft = !isFinite(ref) ? '' : ref < d.lo ? '低於起始量' : ref > d.hi ? '超過書中上限' : '在書中範圍';
    var h = '';
    h += row(d.name + ' 劑量', fmt(perMin, perMin < 1 ? 2 : 1), 'μg/min', fc, ft, '書中範圍 ' + d.lo + '–' + d.hi + (d.unit === 'min' ? ' μg/min' : ' μg/kg/min'));
    h += row('依體重', fmt(perKg, perKg < 1 ? 3 : 2), 'μg/kg/min', 'fl-na', isFinite(w) ? w + ' kg' : '需要體重');
    h += row('輸注速率', fmt(mlh, 1), 'mL/h', 'fl-na', isFinite(conc) ? fmt(conc, 0) + ' μg/mL' : '填泡法');
    if (val('vp_drug') === 'ne' && isFinite(perKg)) {
      h += row('SSC 升階門檻', fmt(0.25 * w, 0) + '–' + fmt(0.5 * w, 0), 'μg/min', perKg >= 0.25 ? 'fl-hot' : 'fl-ok', perKg >= 0.5 ? '≥0.5：考慮第三線 epi' : perKg >= 0.25 ? '≥0.25：加 vasopressin' : '尚未到門檻', '= 0.25–0.5 μg/kg/min（本體重）');
    }
    h += '<div class="rx-flag">' + d.note + '</div>';
    document.getElementById('c14vp_out').innerHTML = I.wrap(h);
  });

  /* 血壓袖帶尺寸 */
  I.bindCalc('c14cuff', function () {
    var c = num('cuff_c');
    var h = '';
    h += row('氣囊長度下限', fmt(0.8 * c, 0), 'cm', 'fl-na', '≥80% 臂圍');
    h += row('氣囊寬度下限', fmt(0.4 * c, 0), 'cm', 'fl-na', '≥40% 臂圍');
    var cat = !isFinite(c) ? '—' : c < 22 ? '小於成人小號範圍：用兒童／小號袖帶' : c <= 26 ? '成人小號（書中：22–26 cm，氣囊 12 × 24 cm）' : c <= 34 ? '成人標準（書中：27–34 cm）' : c <= 44 ? '成人大號（35–44 cm；AHA 2005 表）' : c <= 52 ? '成人大腿袖帶（45–52 cm；AHA 2005 表）' : '超出常規袖帶，改動脈導管';
    h += row('建議袖帶', '', '', !isFinite(c) ? 'fl-na' : 'fl-ok', '', cat);
    h += '<div class="rx-flag">氣囊太小 → 血壓<b>假性偏高</b>；太大幾乎不影響。床邊快判：把袖帶翻面，氣囊該環繞上臂接近一半。ICU 有 2/3 的量測用錯尺寸、其中 62% 與動脈壓差 >10 mmHg。</div>';
    document.getElementById('c14cuff_out').innerHTML = I.wrap(h);
  });

  /* ================================================================
     Ch15 計算器
     ================================================================ */
  function bloodVol(sex, w) { return (sex === 'f' ? 60 : 66) * w; }
  function plasmaVol(sex, w) { return (sex === 'f' ? 36 : 40) * w; }
  I.bindCalc('c15bv', function () {
    var sex = val('bv_sex'), w = num('bv_w'), loss = num('bv_loss');
    var bv = bloodVol(sex, w), pv = plasmaVol(sex, w);
    var pct = loss / bv * 100, mlkg = loss / w;
    var cls = !isFinite(pct) ? null : pct < 15 ? 1 : pct <= 30 ? 2 : pct <= 40 ? 3 : 4;
    var desc = { 1: 'Class I：跨毛細血管回填即可補足，通常不需輸液', 2: 'Class II：代償期，血管收縮撐住血壓、尿量開始下降', 3: 'Class III：失代償＝出血性休克，仰臥低血壓、乳酸上升', 4: 'Class IV：重度、可能不可逆，多重器官衰竭' };
    var h = '';
    h += row('估計血容量', fmt(bv, 0), 'mL', 'fl-na', (sex === 'f' ? '60' : '66') + ' mL/kg', '以瘦體重計');
    h += row('估計血漿容積', fmt(pv, 0), 'mL', 'fl-na', (sex === 'f' ? '36' : '40') + ' mL/kg');
    h += row('失血占血容量', fmt(pct, 0), '%', !cls ? 'fl-na' : cls === 1 ? 'fl-ok' : cls === 2 ? 'fl-warn' : 'fl-hot', cls ? 'Class ' + ['', 'I', 'II', 'III', 'IV'][cls] : '', isFinite(mlkg) ? fmt(mlkg, 0) + ' mL/kg' : '');
    if (cls) h += '<div class="rx-flag"><b>' + desc[cls] + '</b>。分級門檻：I &lt;15%（&lt;10 mL/kg）、II 15–30%（10–20）、III 31–40%（21–30）、IV &gt;40%（&gt;30）。早期 Hb／Hct 不反映失血量。</div>';
    document.getElementById('c15bv_out').innerHTML = I.wrap(h);
  });

  I.bindCalc('c15cl2', function () {
    var sex = val('cl2_sex'), w = num('cl2_w'), pct = num('cl2_pct');
    var pv = plasmaVol(sex, w), deficit = pv * pct / 100;
    var h = '';
    h += row('血漿容積 PV', fmt(pv, 0), 'mL', 'fl-na', (sex === 'f' ? '36' : '40') + ' mL/kg');
    h += row('估計 PV 缺損', fmt(deficit, 0), 'mL', 'fl-na', fmt(pct, 0) + '%');
    h += row('晶體液復甦量', fmt(deficit * 3, 0), 'mL', 'fl-ok', '3 × 缺損', '只有 20–25% 留在血管內，×3 已屬保守');
    h += row('膠體液復甦量', fmt(deficit, 0), 'mL', 'fl-ok', '1 × 缺損');
    h += '<div class="rx-flag">適用<b>無休克的出血</b>（Class II：血壓／尿量下降但乳酸不高）。補足後 Hb 目標 7–8 g/dL、INR &gt;1.5 給 FFP、血小板 &lt;50,000/μL 輸血小板；若持續出血改走損傷控制復甦。</div>';
    document.getElementById('c15cl2_out').innerHTML = I.wrap(h);
  });

  I.bindCalc('c15mtp', function () {
    var u = num('mtp_rbc'), fib = num('mtp_fib'), inr = num('mtp_inr'), plt = num('mtp_plt'), ptt = num('mtp_ptt'), ica = num('mtp_ica');
    var h = '';
    h += row('FFP', fmt(u, 0), 'U', 'fl-na', '1 : 1', '每單位 PRBC 配一單位 FFP');
    h += row('血小板', isFinite(u) ? fmt(Math.floor(u / 5), 0) : '—', 'pack', 'fl-na', '每 5 U 一份', '一份 ≈ 5–6 位捐者的血小板');
    h += row('Fibrinogen', fmt(fib, 0), 'mg/dL', !isFinite(fib) ? 'fl-na' : fib < 100 ? 'fl-hot' : 'fl-ok', !isFinite(fib) ? '' : fib < 100 ? '<100 → cryo 2 U' : '終點 >100');
    h += row('INR', fmt(inr, 2), '', !isFinite(inr) ? 'fl-na' : inr >= 1.5 ? 'fl-hot' : 'fl-ok', !isFinite(inr) ? '' : inr >= 1.5 ? '≥1.5 → 血漿' : '終點 <1.5');
    h += row('aPTT 比值', fmt(ptt, 2), '× 正常', !isFinite(ptt) ? 'fl-na' : ptt >= 1.5 ? 'fl-hot' : 'fl-ok', !isFinite(ptt) ? '' : ptt >= 1.5 ? '≥1.5× → 血漿' : '終點 <1.5×');
    h += row('血小板計數', fmt(plt, 0), '×10³/μL', !isFinite(plt) ? 'fl-na' : plt < 100 ? 'fl-hot' : 'fl-ok', !isFinite(plt) ? '' : plt < 100 ? '<100k → 血小板' : '終點 ≥100k');
    h += row('離子鈣', fmt(ica, 2), 'mmol/L', !isFinite(ica) ? 'fl-na' : ica < 1.2 ? 'fl-hot' : ica > 1.3 ? 'fl-warn' : 'fl-ok', !isFinite(ica) ? '' : ica < 1.2 ? '<1.2 補鈣' : '目標 1.2–1.3');
    h += '<div class="rx-flag">同時：<b>Tranexamic acid 1 g IV bolus → 1 g / 8 h</b>（經驗性抗纖溶）、所有輸注加溫到 37 °C、晶體液限 1–2 L。這裡的終點是傳統凝血檢驗；TIC 用 TEG／ROTEM 更靈敏。</div>';
    document.getElementById('c15mtp_out').innerHTML = I.wrap(h);
  });

  I.bindCalc('c15teg', function () {
    var r = num('teg_r'), k = num('teg_k'), a = num('teg_a'), ma = num('teg_ma'), ly = num('teg_ly');
    var h = '';
    h += row('R 反應時間', fmt(r, 1), 'min', !isFinite(r) ? 'fl-na' : r > 9 ? 'fl-hot' : r < 5 ? 'fl-warn' : 'fl-ok', !isFinite(r) ? '' : r > 9 ? '>9 → 血漿／逆轉抗凝' : r < 5 ? '偏短' : '正常 5–10', '凝血因子；所有抗凝劑除 warfarin 都會延長');
    h += row('k 動力時間', fmt(k, 1), 'min', !isFinite(k) ? 'fl-na' : k > 3 ? 'fl-hot' : 'fl-ok', !isFinite(k) ? '' : k > 3 ? '延長 → 纖維蛋白原' : '正常 1–3', '凝塊起始到 20 mm');
    h += row('α 角', fmt(a, 0), '°', !isFinite(a) ? 'fl-na' : a < 53 ? 'fl-hot' : 'fl-ok', !isFinite(a) ? '' : a < 53 ? '<53 → cryo／纖維蛋白原' : '正常 53–72', '纖維蛋白聚合速度');
    h += row('MA 最大振幅', fmt(ma, 0), 'mm', !isFinite(ma) ? 'fl-na' : ma < 50 ? 'fl-hot' : 'fl-ok', !isFinite(ma) ? '' : ma < 50 ? '<50 → 血小板' : '正常 50–70', '凝塊強度＝血小板 × 纖維蛋白原');
    h += row('LY30', fmt(ly, 1), '%', !isFinite(ly) ? 'fl-na' : ly > 5.7 ? 'fl-hot' : 'fl-ok', !isFinite(ly) ? '' : ly > 5.7 ? '>5.7 纖溶亢進 → TXA' : '正常 2.3–5.7', 'MA 後 30 分鐘的溶解百分比');
    h += '<div class="rx-flag">「正常」欄是書中的正常範圍；表 15.5 明確給出的介入門檻只有 <b>R &gt;9 分鐘</b>，其餘各家算法的切點不同（例如 Gonzalez 2016 用 α &lt;65°、MA &lt;55 mm、LY30 ≥3%），這裡以正常範圍外當作提示，不是處方。</div>';
    document.getElementById('c15teg_out').innerHTML = I.wrap(h);
  });

  /* ================================================================
     Ch16 計算器
     ================================================================ */
  I.bindCalc('c16hd', function () {
    var map = num('hd_map'), cvp = num('hd_cvp'), pawp = num('hd_pawp');
    var ci = num('hd_ci'), bsaV = I.bsa(num('hd_h'), num('hd_w'));
    if (!isFinite(ci) && isFinite(num('hd_co')) && isFinite(bsaV)) ci = num('hd_co') / bsaV;
    var svri = (map - cvp) / ci;
    var gap = num('hd_gap'), uo = num('hd_uo'), lac = num('hd_lac'), svo2 = num('hd_svo2');
    var h = '';
    h += row('MAP', fmt(map, 0), 'mmHg', !isFinite(map) ? 'fl-na' : map < 65 ? 'fl-hot' : 'fl-ok', !isFinite(map) ? '' : map < 65 ? '<65' : '目標 ≥65');
    h += row('PAWP', fmt(pawp, 0), 'mmHg', !isFinite(pawp) ? 'fl-na' : pawp < 18 ? 'fl-warn' : pawp > 20 ? 'fl-hot' : 'fl-ok', !isFinite(pawp) ? '' : pawp < 18 ? '<18 → 輸液可能增加 CO' : pawp > 20 ? '>20 肺水腫風險' : '最佳 18–20', '30% 梗塞相關 CS 的充填壓並不高');
    h += row('Cardiac index', fmt(ci, 2), 'L/min/m²', !isFinite(ci) ? 'fl-na' : ci < 2.2 ? 'fl-hot' : ci < 2.5 ? 'fl-warn' : 'fl-ok', !isFinite(ci) ? '' : ci < 2.2 ? '<2.2 典型 CS' : ci < 2.5 ? '未達目標 2.5' : '目標 ≥2.5', isFinite(bsaV) && !isFinite(num('hd_ci')) ? 'BSA ' + fmt(bsaV, 2) : '');
    h += row('SVRI', fmt(svri, 1), 'Wood', !isFinite(svri) ? 'fl-na' : svri > 30 ? 'fl-warn' : svri < 25 ? 'fl-warn' : 'fl-ok', !isFinite(svri) ? '' : svri > 30 ? '>30 過度收縮' : svri < 25 ? '<25：併發炎？' : '目標 25–30', '(MAP − CVP) / CI · mmHg/L/min/m² · ×80 = ' + fmt(svri * 80, 0) + ' dyn·s·cm⁻⁵·m²');
    h += row('PCO₂ gap', fmt(gap, 0), 'mmHg', !isFinite(gap) ? 'fl-na' : gap > 6 ? 'fl-hot' : 'fl-ok', !isFinite(gap) ? '' : gap > 6 ? '>6 微循環不足' : '目標 <6', 'CS 的微循環障礙與 CO 無關，修正 CO 不保證灌流');
    h += row('尿量', fmt(uo, 2), 'mL/kg/h', !isFinite(uo) ? 'fl-na' : uo <= 0.5 ? 'fl-hot' : 'fl-ok', !isFinite(uo) ? '' : uo <= 0.5 ? '≤0.5 寡尿' : '目標 >0.5');
    h += row('SvO₂', fmt(svo2, 0), '%', !isFinite(svo2) ? 'fl-na' : svo2 < 65 ? 'fl-hot' : 'fl-ok', !isFinite(svo2) ? '' : svo2 < 65 ? '<65 供需失衡' : '正常 65–75');
    h += row('乳酸', fmt(lac, 1), 'mmol/L', !isFinite(lac) ? 'fl-na' : lac > 2 ? 'fl-hot' : 'fl-ok', !isFinite(lac) ? '' : lac > 2 ? '>2' : '目標 <2');
    h += '<div class="rx-flag">表 16.2 的目標：PAWP 18–20、CI ≥2.5、SVRI 25–30 Wood、MAP ≥65、PCO₂ gap &lt;6、尿量 &gt;0.5、乳酸正常。SVRI 不高的心因性休克要想<b>合併全身性發炎</b>（20–40%，死亡率更高）。</div>';
    document.getElementById('c16hd_out').innerHTML = I.wrap(h);
  });

  I.bindCalc('c16ino', function () {
    var w = num('ino_w'), crcl = num('ino_crcl');
    var h = '';
    h += row('Norepinephrine 起始', fmt(0.05 * w, 1), 'μg/min', 'fl-na', '0.05 μg/kg/min ≈ 5', '每 5 分鐘上調；研究常用 5–30 μg/min（0.05–0.5 μg/kg/min）');
    h += row('Dobutamine 起始', fmt(3 * w, 0) + '–' + fmt(5 * w, 0), 'μg/min', 'fl-na', '3–5 μg/kg/min', '每次加 3–5 μg/kg/min；心率通常 +5–15/min、可 >30');
    var m = !isFinite(crcl) ? { r: '0.375–0.75', t: '腎功能正常' } :
      crcl > 50 ? { r: '0.375–0.75', t: 'CrCl >50 不調' } :
      crcl > 40 ? { r: '0.43', t: 'CrCl 41–50' } : crcl > 30 ? { r: '0.38', t: 'CrCl 31–40' } : crcl > 20 ? { r: '0.33', t: 'CrCl 21–30' } :
      crcl > 10 ? { r: '0.28', t: 'CrCl 11–20' } : crcl > 5 ? { r: '0.23', t: 'CrCl 6–10' } : { r: '0.20', t: 'CrCl ≤5' };
    h += row('Milrinone 維持', m.r, 'μg/kg/min', !isFinite(crcl) ? 'fl-na' : crcl < 50 ? 'fl-warn' : 'fl-ok', m.t, '負荷 50 μg/kg／10 min（本體重 ' + fmt(50 * w, 0) + ' μg）；t½ 2.5 h，腎功能差時顯著延長；低血壓風險大');
    h += row('Levosimendan 負荷', fmt(12 * w, 0), 'μg / 10 min', 'fl-na', '12 μg/kg', '之後 0.1 μg/kg/min（1 小時後 0.05–0.2 調整）＝ ' + fmt(0.1 * w * 60, 0) + ' μg/h；t½ 80 h、輸注限 24 h；美國未核准、台大藥品資料庫查無');
    h += '<div class="rx-flag"><b>動態 LVOT 阻塞是所有強心劑的禁忌</b>。升壓劑與強心劑都在增加心臟工作量，藥物支持 1–2 小時沒有明確改善就該提早機械支持。</div>';
    document.getElementById('c16ino_out').innerHTML = I.wrap(h);
  });

  /* ================================================================
     Ch17 計算器
     ================================================================ */
  I.bindCalc('c17fl', function () {
    var sex = val('sf_sex'), hcm = num('sf_h'), w = num('sf_w');
    var ibwV = I.ibw(sex, hcm);
    var vol = 30 * ibwV, volAct = 30 * w;
    var h = '';
    h += row('理想體重 IBW', fmt(ibwV, 1), 'kg', 'fl-na', 'Devine', sex === 'f' ? '45.5 + 2.3 × (每吋超過 60 吋)' : '50 + 2.3 × (每吋超過 60 吋)');
    h += row('30 mL/kg IBW', fmt(vol, 0), 'mL', !isFinite(vol) ? 'fl-na' : vol > 2000 ? 'fl-warn' : 'fl-ok', !isFinite(vol) ? '' : vol > 2000 ? '>2 L：作者建議放慢' : '3 小時內', '每小時約 ' + fmt(vol / 3, 0) + ' mL');
    h += row('若以實際體重計', fmt(volAct, 0), 'mL', 'fl-na', isFinite(w) && isFinite(ibwV) && w > ibwV * 1.2 ? '會多給 ' + fmt(volAct - vol, 0) + ' mL' : '', 'SSC 指名用理想體重');
    h += '<div class="rx-flag">晶體液約 <b>75%</b> 跑到間質：2 L 只有約 500 mL 留在血漿（≈ 70 kg 男性血漿容積的 15%）。Marino 的補充：依休克類型與體型調整、1–2 小時內不超過 2 L、目標是回到基礎血壓；之後靠 fluid responsiveness 決定，液體累積本身增加死亡率。</div>';
    document.getElementById('c17fl_out').innerHTML = I.wrap(h);
  });

  I.bindCalc('c17vp', function () {
    var w = num('sv_w'), ne = num('sv_ne');
    var perKg = ne / w;
    var h = '';
    h += row('目前 NE', fmt(perKg, 3), 'μg/kg/min', !isFinite(perKg) ? 'fl-na' : perKg >= 0.5 ? 'fl-hot' : perKg >= 0.25 ? 'fl-warn' : 'fl-ok', !isFinite(perKg) ? '' : perKg >= 0.5 ? '≥0.5' : perKg >= 0.25 ? '≥0.25 門檻' : '<0.25', fmt(ne, 0) + ' μg/min ÷ ' + fmt(w, 0) + ' kg');
    h += row('加 vasopressin 門檻', fmt(0.25 * w, 0) + '–' + fmt(0.5 * w, 0), 'μg/min', 'fl-na', '0.25–0.5 μg/kg/min', 'vasopressin 0.03 U/min 固定、不滴定（書中寫 Units/hr，應為每分鐘）');
    h += row('Hydrocortisone 門檻', fmt(0.25 * w, 0), 'μg/min', !isFinite(perKg) ? 'fl-na' : perKg >= 0.25 ? 'fl-warn' : 'fl-na', !isFinite(perKg) ? '' : perKg >= 0.25 ? '已達：50 mg q6h' : '未達', 'NE 或 epi ≥0.25 μg/kg/min；多數研究約 7 天');
    h += '<div class="rx-flag">SSC 2021 的階梯：NE → 加 vasopressin → 加 epinephrine（第三線）。Marino 的保留：<b>加第二、第三種升壓劑沒有存活證據</b>；NE 有免疫抑制效應。以 70 kg 計，門檻就是 18–35 μg/min。</div>';
    document.getElementById('c17vp_out').innerHTML = I.wrap(h);
  });

  I.bindCalc('c17ana', function () {
    var w = num('an_w'), bb = document.getElementById('an_bb').checked, conc = num('an_conc'); // μg/mL
    var h = '';
    h += row('IM epinephrine', '0.3–0.5', 'mg', 'fl-ok', '1 mg/mL 溶液', '前外側大腿深部肌肉注射，每 5–15 分鐘可重複；皮下吸收慢');
    h += row('IV 輸注（休克）', '5–15', 'μg/min', 'fl-ok', isFinite(conc) ? fmt(5 * 60 / conc, 0) + '–' + fmt(15 * 60 / conc, 0) + ' mL/h' : '', '可先 10 μg IV bolus，重複到 MAP ≥65');
    h += row('晶體液', fmt(20 * w, 0) + '–' + fmt(30 * w, 0), 'mL', 'fl-na', '20–30 mL/kg', '或 500 mL 5% albumin，5–10 分鐘內；滲漏可失 35% 血管內容積，考慮加膠體');
    h += row('Glucagon', bb ? '1–5' : '—', bb ? 'mg IV / 5 min' : '', bb ? 'fl-warn' : 'fl-na', bb ? '之後 5–15 μg/min' : '無 β-blocker 不需', bb ? '會嘔吐：意識不清者側躺' : '近期用 β-blocker 者對 epinephrine 反應差時使用');
    h += '<div class="rx-flag">類固醇「在過敏反應的急性處置沒有角色」（2015 practice parameter）。二線只緩解症狀：diphenhydramine 25–50 mg ＋ H₂ 阻斷劑併用最佳、albuterol 霧化 2.5 mL 0.5%。難治性低血壓：非 β-blocker 者加 norepinephrine 或 phenylephrine（vasopressin 未評估）。</div>';
    document.getElementById('c17ana_out').innerHTML = I.wrap(h);
  });

  /* ================================================================
     決策流程
     ================================================================ */
  function selAll(viewSel) { document.querySelectorAll(viewSel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }

  /* --- Ch14 休克初步評估 --- */
  var ov = { evid: null, type: null, resp: null };
  window.ovPick = function (k, v, btn) {
    flowSelect(btn);
    if (k === 'evid') { ov.evid = v; ov.type = null; ov.resp = null; }
    else if (k === 'type') { ov.type = v; ov.resp = null; }
    else ov.resp = v;
    ovRender();
  };
  function ovRender() {
    var s2 = ov.evid && ov.evid !== 'none';
    flowShow('ov_c2', s2); flowShow('ov_s2', s2);
    var s3 = s2 && !!ov.type;
    flowShow('ov_c3', s3); flowShow('ov_s3', s3);
    if (!s2) flowClearSel('ov_s2'); if (!s3) flowClearSel('ov_s3');
    var cls = 'rec-idle', title = '請由第 1 步開始選擇', d = '', n = '';
    if (ov.evid === 'none') {
      cls = 'rec-blue'; title = '目前不符合休克判準——監測，不要急著拉血壓';
      d = '<li>沒有乳酸上升、尿量下降或意識改變，就沒有「細胞氧利用不足」的證據。</li><li>把 PCO₂ gap、乳酸、尿量納入追蹤；血壓正常不排除之後進入休克。</li>';
      n = 'Marino：休克是氧利用的異常，不是血壓的異常。';
    } else if (ov.evid === 'hypoonly') {
      cls = 'rec-blue'; title = '只有低血壓、沒有低灌流證據——先找非休克的原因';
      d = '<li>自主神經病變、腎上腺功能不足、鎮靜／降壓藥物，甚至 5% 健康成人都有低血壓而無器官損傷。</li><li>測乳酸、ScvO₂ 或 PCO₂ gap 再判；有共識建議不再以低血壓作為休克判準。</li><li>若之後出現低灌流證據，回到第 1 步重選。</li>';
      n = 'Cecconi 2014（ESICM 共識）；Vincent & De Backer 2013。';
    } else if (ov.evid === 'hypoperf' && !ov.type) {
      cls = 'rec-idle'; title = '有休克證據——第 2 步判定血行動力學型態';
    } else if (ov.type) {
      cls = 'rec-urgent';
      var common = '<li><b>動脈導管</b>直接測壓、追 <b>MAP ≥65</b>（不要追收縮壓，那是反射波）。</li><li>所有型別第一步都是<b>輸液</b>（含心因性——右心充填壓常不足）；1–2 小時內晶體液不超過 2 L，之後依 fluid responsiveness。</li>';
      if (ov.type === 'hypo') {
        title = '低血容性型態（低 CVP、低 CO、高 SVR）→ 幾乎都是出血';
        d = common + '<li>脫水很少造成休克（膠體滲透壓上升會把間質液拉回血管），輸液就好；<b>出血才是主角</b>，血容量掉 30% 就休克。</li><li>轉到<b>「出血性」分頁</b>：分級、損傷控制復甦、1:1:1、TEG。</li>';
      } else if (ov.type === 'pump') {
        title = '心因性／阻塞性型態（高 CVP、低 CO、高 SVR）→ 超音波分岔';
        d = common + '<li><b>阻塞性</b>（只占 2%）：大量肺栓塞、張力性氣胸、心包膜填塞——處理病因本身。</li><li><b>心因性</b>（16%）：ACS 近半、非缺血性心肌病變 28%、瓣膜／心律 17%；死亡率仍約 50%。轉到<b>「心因性」分頁</b>。</li>';
      } else if (ov.type === 'vaso') {
        title = '血管擴張性型態（高 CO、低 SVR）→ 敗血性休克最常見';
        d = common + '<li>敗血性休克是美國院內死亡首因、全球死因之一；其他：過敏性、脊髓性、腎上腺危象。</li><li>轉到<b>「發炎性」分頁</b>：30 mL/kg IBW、norepinephrine、1 小時內抗生素。</li><li>ScvO₂ 在敗血症會假性偏高，<b>改追 PCO₂ gap 與乳酸</b>。</li>';
      } else {
        title = '型態未明——先量再猜';
        d = common + '<li>床邊心臟超音波（充填、收縮、心包、右心）＋ CVP；需要時 PA 導管（它是監測工具，不是治療，「不改善存活」是對它的誤判）。</li><li>PCO₂ gap（靜脈 − 動脈 PCO₂）>6 mmHg 表示低灌流，每個休克病人都該測。</li>';
      }
      if (ov.resp === 'no') {
        d += '<li><b>血壓目標未達且有低灌流證據 → 開始升壓劑</b>：norepinephrine 5–10 μg/min 起；可先走上臂周邊靜脈（48 小時內安全）或 midline，沒有血管就 IO。</li><li>NE 到 30 μg/min 再加量收縮反應不再增加，此時加第二種藥（但多重升壓劑沒有存活證據）。</li><li>外滲：停、回抽、不沖洗、拔管，phentolamine 5–10 mg in 10 mL NS 局部注射（12 小時內）。</li>';
        n = '復甦目標（表 14.5）：MAP ≥65、CI ≥2.5、PCO₂ gap <6、尿量 >0.5 mL/kg/h、乳酸 <2 mmol/L。';
      } else if (ov.resp === 'ok') {
        d += '<li>血壓回到基礎、灌流改善：<b>不要再灌</b>，後續輸液依 fluid responsiveness。</li><li>乳酸 24 小時內要正常化，否則預後差。</li>';
        n = '共同目標：乳酸 <2 mmol/L。';
      }
    }
    flowRec('ov_rec', cls, title, d, n);
  }
  window.ovReset = function () { ov = { evid: null, type: null, resp: null }; selAll('#ov_flow'); ovRender(); };

  /* --- Ch15 出血復甦 --- */
  var hem = { shock: null, ctrl: null, massive: null, teg: null };
  window.hemPick = function (k, v, btn) {
    flowSelect(btn);
    if (k === 'shock') { hem.shock = v; hem.ctrl = hem.massive = hem.teg = null; }
    else hem[k] = v;
    hemRender();
  };
  function hemRender() {
    var on = hem.shock === 'yes';
    ['hem_c2', 'hem_s2', 'hem_c3', 'hem_s3', 'hem_c4', 'hem_s4'].forEach(function (id) { flowShow(id, on); });
    if (!on) { flowClearSel('hem_s2'); flowClearSel('hem_s3'); flowClearSel('hem_s4'); }
    var cls = 'rec-idle', title = '請由第 1 步開始選擇', d = '', n = '';
    if (hem.shock === 'no') {
      cls = 'rec-blue'; title = 'Class II 路徑：先用不含血的復甦液，補足後再看血品門檻';
      d = '<li>估算血漿容積（40 mL/kg 男／36 女）與 % 缺損，<b>晶體液 3 倍缺損、膠體液 1 倍</b>（本頁計算器）。</li><li>補足後：Hb 目標 7–8 g/dL 才給 PRBC；INR >1.5 給 FFP；血小板 <50,000/μL 輸血小板。</li><li>早期 Hb／Hct 反映的是輸了什麼、不是失了多少血——8–12 小時後才開始下降。</li><li>若持續出血或出現乳酸上升，回到第 1 步改走出血性休克路徑。</li>';
      n = '「無休克的出血」＝血壓或尿量下降但乳酸不高。';
    } else if (hem.shock === 'yes') {
      cls = 'rec-urgent'; title = '出血性休克：損傷控制復甦（止血 · 允許性低血壓 · 限晶體 · 全血等效補充）';
      d = '<li><b>短而粗</b>的周邊導管（16G 流量是 18G 兩倍；1.2 吋周邊導管約為 8 吋中央導管 5 倍；RIC 7–9 Fr 可到 1 L/min）；輸注加溫到 37 °C。</li>';
      if (hem.ctrl === 'no') d += '<li><b>允許性低血壓</b>：止血前 SBP 80–90 或 MAP 約 50 mmHg，減少輸血量與稀釋性凝血病變；但必須盯乳酸與尿量，確認低血壓沒有換來組織低灌流。</li>';
      else if (hem.ctrl === 'yes') d += '<li>出血已控制：血壓目標回到 MAP ≥65、乳酸 <2，允許性低血壓的理由已消失。</li>';
      if (hem.massive === 'yes') d += '<li><b>大量輸血</b>：1 PRBC : 1 FFP，每 5 單位加 1 份血小板；晶體液限 1–2 L；離子鈣 1.2–1.3 mmol/L；fibrinogen <100 mg/dL 給 cryo 2 U；<b>TXA 1 g bolus → 1 g / 8 h</b>。</li><li>全血／低效價 O 型血：軍方有存活效益、民間未重現，但與成分療法合併有效益。</li>';
      else if (hem.massive === 'no') d += '<li>非大量出血仍照 1:1 補血品、限晶體，避免稀釋性凝血病變。</li>';
      if (hem.teg === 'yes') d += '<li><b>TEG 導向</b>（改善存活、減少血品）：R 延長 → 血漿／逆轉抗凝；k／α 異常 → 纖維蛋白原；MA 低 → 血小板；LY30 高 → TXA。</li>';
      else if (hem.teg === 'no') d += '<li>傳統終點：fibrinogen >100 mg/dL、INR <1.5、aPTT <1.5×、血小板 ≥100,000/μL——但對創傷性凝血病變不夠靈敏。</li>';
      n = '復甦成功後 48–72 小時警覺復甦後多重器官衰竭（死亡率 50–60%）；>72 小時發病要想腸源性敗血症。EAST 2017 損傷控制復甦指引。';
    }
    flowRec('hem_rec', cls, title, d, n);
  }
  window.hemReset = function () { hem = { shock: null, ctrl: null, massive: null, teg: null }; selAll('#hem_flow'); hemRender(); };

  /* --- Ch16 心因性休克 --- */
  var cs = { etio: null, pawp: null, bp: null, ci: null, traj: null, resp: null };
  window.csPick = function (k, v, btn) {
    flowSelect(btn);
    if (k === 'etio') { cs = { etio: v, pawp: null, bp: null, ci: null, traj: null, resp: null }; }
    else if (k === 'traj') { cs.traj = v; cs.resp = null; }
    else cs[k] = v;
    csRender();
  };
  function csRender() {
    var lvot = cs.etio === 'lvot';
    var main = !!cs.etio && !lvot;
    ['cs_c2', 'cs_s2', 'cs_c3', 'cs_s3', 'cs_c4', 'cs_s4', 'cs_c5', 'cs_s5'].forEach(function (id) { flowShow(id, main); });
    var s6 = main && cs.traj === 'worse';
    flowShow('cs_c6', s6); flowShow('cs_s6', s6);
    if (!main) ['cs_s2', 'cs_s3', 'cs_s4', 'cs_s5', 'cs_s6'].forEach(flowClearSel);
    if (!s6) flowClearSel('cs_s6');
    var cls = 'rec-idle', title = '請由第 1 步開始選擇', d = '', n = '';
    if (lvot) {
      cls = 'rec-urgent'; title = '動態 LVOT 阻塞：處置方向和其他心因性休克相反';
      d = '<li>目標是<b>減慢心率、增加舒張期充填</b>：非血管擴張型 β-blocker（metoprolol、nadolol）＋輸液。</li><li>升壓要用<b>純 α 收縮劑 phenylephrine</b>（反射性心搏過緩反而有利），不是 norepinephrine。</li><li><b>所有強心劑禁忌</b>——增加收縮力會加重阻塞。</li><li>診斷靠 CW Doppler 心尖四腔切面算主動脈瓣下壓差。</li>';
      n = '台大藥品資料庫查無 phenylephrine 注射劑（只有眼藥水），院內要先想替代方案。';
    } else if (cs.etio) {
      cls = cs.traj === 'worse' ? 'rec-urgent' : 'rec-blue';
      title = cs.traj === 'worse' ? '藥物支持無效 → 不要延遲機械循環支持' : cs.traj === 'better' ? '藥物支持有效 → 維持並追微循環' : '心因性休克：買時間——先修病因、再談灌流';
      var e = { ami: '<li><b>急性心肌梗塞</b>（2/3 的 CS）：緊急再灌流是唯一降死亡率的處置；PA 導管在 CS 改善結果、AHA 2021 明確支持。機械併發症多在 <b>24 小時內</b>出現，不是晚期。</li>',
                mech: '<li><b>機械併發症</b>：乳突肌斷裂 7%、心室中隔破裂 4%、游離壁破裂 1%——外科修補或心包膜穿刺，藥物只是撐到手術。</li>',
                rv: '<li><b>右心衰竭為主</b>（<5%，死亡率較低）：CVP/PAWP 比值升高、RV 擴大、LVEF 正常；室中隔被推向左心會再減少 LV 充填，輸液要小心試。</li>',
                other: '<li>慢性心衰竭急性惡化（最多 30%）、Takotsubo、心肌炎、心臟術後（2–5%）、產週心肌病變（1/3,000–4,000，死亡率 7–20%）；阻塞性休克本質是心外因素的心因性休克，處理病因。</li>' };
      d = e[cs.etio] || '';
      if (cs.pawp === 'low') d += '<li>充填壓不高（30% 的梗塞相關 CS 如此）→ <b>先輸液</b>，目標 PAWP 18–20 mmHg（重症病人 COP 約 20–25，再高就肺水腫）。</li>';
      else if (cs.pawp === 'high') d += '<li>充填壓已高：不再輸液，考慮利尿／減後負荷的空間交給機械支持。</li>';
      if (cs.bp === 'low') d += '<li>低血壓 → <b>norepinephrine</b>：5 μg/min（0.05 μg/kg/min）起，每 5 分鐘調，常用 5–30 μg/min；比 epinephrine／dopamine 心律不整少、死亡少。</li>';
      else if (cs.bp === 'ok') d += '<li>血壓尚可但仍低灌流（約 5% 的 CS 無低血壓）：不需升壓劑，直接處理 CO。</li>';
      if (cs.ci === 'low') d += '<li>CI 低併低灌流 → <b>dobutamine</b> 3–5 μg/kg/min 起（心率 +5–15、MVO₂ 上升是代價）；milrinone 只適合<b>沒有低血壓</b>的病人且 CrCl <50 要減量；levosimendan 不增加心肌耗氧、對比 dobutamine 有死亡率效益，但台灣院內不一定有。</li>';
      else if (cs.ci === 'ok') d += '<li>CI 已達 ≥2.5：不加強心劑，追 PCO₂ gap 與乳酸看微循環。</li>';
      if (cs.traj === 'better') d += '<li>維持現有支持，追 PCO₂ gap <6、尿量 >0.5、乳酸正常化——微循環障礙與 CO 無關，修正 CO 不等於存活。</li>';
      if (cs.traj === 'worse') {
        d += '<li>藥物只會增加心臟工作量（後負荷、收縮力、心率），沒有快速改善就是<b>上機械支持的時機</b>；等到多重器官衰竭才上是「bridge to nowhere」。</li>';
        if (cs.resp === 'yes') d += '<li>併呼吸衰竭 → <b>VA-ECMO</b> 首選（雙心室＋氣體交換，5–6 L/min）；注意逆行主動脈血流增加 LV 後負荷 → 肺水腫，需 IABP／Impella 合併或 LV venting；出院存活約 42%。</li>';
        else if (cs.resp === 'no') d += '<li>依院內可得性選 <b>IABP</b>（最普及、不改善存活、禁忌 AR／主動脈剝離）或 <b>Impella</b>（2.5–5.5 L/min、存活與 IABP 相同、出血／肢體缺血／溶血 5–10% 較多、禁忌主動脈瓣疾病／人工瓣／LV 血栓）；無改善可轉 ECMO。</li><li>IABP 失去遠端脈搏但感覺運動正常不必拔；感覺運動喪失立即拔並考慮手術。</li>';
        d += '<li>所有機械支持都要完整抗凝。</li>';
      }
      n = '表 16.2 目標：PAWP 18–20、CI ≥2.5、SVRI 25–30 Wood、MAP ≥65、PCO₂ gap <6、尿量 >0.5 mL/kg/h。IABP-SHOCK II；Combes 2020（Lancet）；AHA 2017／2021。';
    }
    flowRec('cs_rec', cls, title, d, n);
  }
  window.csReset = function () { cs = { etio: null, pawp: null, bp: null, ci: null, traj: null, resp: null }; selAll('#cs_flow'); csRender(); };

  /* --- Ch17 發炎性休克 --- */
  var inf = { pheno: null, hypo: null, ne: null, org: null, shock: null, bb: null };
  window.infPick = function (k, v, btn) {
    flowSelect(btn);
    if (k === 'pheno') { inf = { pheno: v, hypo: null, ne: null, org: null, shock: null, bb: null }; }
    else if (k === 'hypo') { inf.hypo = v; inf.ne = null; }
    else if (k === 'shock') { inf.shock = v; inf.bb = null; }
    else inf[k] = v;
    infRender();
  };
  function infRender() {
    var sep = inf.pheno === 'sepsis', tss = inf.pheno === 'tss', ana = inf.pheno === 'ana';
    flowShow('inf_cS2', sep); flowShow('inf_sS2', sep);
    var s3 = sep && inf.hypo === 'yes';
    flowShow('inf_cS3', s3); flowShow('inf_sS3', s3);
    flowShow('inf_cT2', tss); flowShow('inf_sT2', tss);
    flowShow('inf_cA2', ana); flowShow('inf_sA2', ana);
    var a3 = ana && inf.shock === 'yes';
    flowShow('inf_cA3', a3); flowShow('inf_sA3', a3);
    if (!sep) { flowClearSel('inf_sS2'); flowClearSel('inf_sS3'); } if (!s3) flowClearSel('inf_sS3');
    if (!tss) flowClearSel('inf_sT2');
    if (!ana) { flowClearSel('inf_sA2'); flowClearSel('inf_sA3'); } if (!a3) flowClearSel('inf_sA3');
    var cls = 'rec-idle', title = '請由第 1 步開始選擇', d = '', n = '';
    if (sep) {
      cls = 'rec-urgent'; title = '敗血性休克：1 小時內抗生素、30 mL/kg、norepinephrine';
      d = '<li><b>1 小時內</b>開始抗微生物治療，先抽 ≥2 套血液培養（不同穿刺點、每套 ≥20 mL；2 套抓到 90%、3 套 98%）。經驗性廣效（如 piperacillin/tazobactam）；MRSA 風險加 vancomycin／daptomycin（鼻拭子陰性可停）；疑 MDRO 用兩種革蘭氏陰性覆蓋。</li><li>晶體液 <b>30 mL/kg 理想體重／3 小時</b>，之後只依 fluid responsiveness 追加；累積液體增加死亡率，初期後出入要平衡。</li>';
      if (inf.hypo === 'yes') d += '<li>輸液後仍低血壓 → <b>norepinephrine</b>，可先走肘窩以上周邊靜脈，儘早改中央。目標 MAP ≥65。</li>';
      else if (inf.hypo === 'no') d += '<li>輸液後血壓回來：不需升壓劑，繼續追乳酸正常化與 PCO₂ gap（ScvO₂ 在敗血症會假性偏高，不可靠）。</li>';
      if (inf.ne === 'lt') d += '<li>NE <0.25 μg/kg/min 就達標：維持、不加第二種藥。</li>';
      else if (inf.ne === 'ge') d += '<li>NE ≥0.25–0.5 μg/kg/min（70 kg：18–35 μg/min）仍低血壓 → 加 <b>vasopressin 0.03 U/min</b>（不滴定）；同時符合 <b>hydrocortisone 50 mg q6h</b> 的建議門檻（縱使只縮短休克 1.5 天、不改善存活）。</li>';
      else if (inf.ne === 'ref') d += '<li>NE＋vasopressin 仍難治 → <b>epinephrine</b> 第三線；Marino 提醒：多重升壓劑沒有存活證據，這時更該回頭找沒控制的感染源。</li>';
      n = 'SSC 2021。目標：PCO₂ gap <6、尿量 >0.5 mL/kg/h、乳酸 <2。Marino：敗血症的器官衰竭是線粒體問題，不要為了「組織氧合」濫給氧。';
    } else if (tss) {
      cls = 'rec-urgent'; title = '毒性休克症候群：抗生素加 clindamycin、找源頭、準備插管';
      d = '<li>血行動力學同敗血性休克，但內皮滲漏更兇，<b>積極輸液</b>再升壓；多數需插管。</li><li>經驗性：piperacillin/tazobactam 或 meropenem ＋ vancomycin ＋ <b>clindamycin</b>（所有 TSS 都加，抑制毒素生成）。</li>';
      if (inf.org === 'staph') d += '<li><b>葡萄球菌 TSS</b>：40% 與月經相關、35% 找不到感染源、血液培養只有 5% 陽性——診斷靠臨床。源頭控制：移除 tampon／IUD、引流膿瘡、鼻腔去定殖。死亡率月經型 <2%、非月經型 6%。</li>';
      else if (inf.org === 'strep') d += '<li><b>鏈球菌 TSS</b>：壞死性筋膜炎、肌炎、產褥感染；血液培養 60% 陽性；「<b>痛與理學檢查不成比例</b>」要想深部感染，MRI 或床邊超音波找隱匿筋膜炎。<b>清創是存活的關鍵</b>。死亡率 35%。</li>';
      else if (inf.org === 'unk') d += '<li>來源不明（葡萄球菌 35%、鏈球菌近半找不到源）：兩者都覆蓋，同時找月經／傷口／深部軟組織。</li>';
      n = '皮疹可以很淡、稍縱即逝——任何「快速 MOF 的敗血性休克」都要想 TSS，尤其與月經或妊娠有關時。2–3 週後脫屑。';
    } else if (ana) {
      cls = inf.shock === 'yes' ? 'rec-urgent' : 'rec-blue';
      title = inf.shock === 'yes' ? '過敏性休克：IV epinephrine ＋ 積極輸液（考慮膠體）' : '過敏反應：epinephrine 是唯一能終止反應的藥';
      d = '<li><b>Epinephrine 0.3–0.5 mg IM</b>（1 mg/mL 溶液）前外側大腿，每 5–15 分鐘可重複；皮下吸收慢不要用。</li>';
      if (inf.shock === 'yes') d += '<li>低血壓 → <b>IV epinephrine 5–15 μg/min</b>（可先 10 μg bolus，重複到 MAP ≥65）。</li><li><b>輸液</b> 1–2 L 晶體液（20–30 mL/kg）或 500 mL 5% albumin 在 5–10 分鐘內；滲漏可失 35% 血管內容積，之後多加膠體。</li>';
      else if (inf.shock === 'no') d += '<li>沒有低血壓：IM epinephrine 之後才給二線——H₁＋H₂ 阻斷劑併用（止癢、流鼻水）、albuterol 霧化（支氣管痙攣）；喉頭水腫可霧化 epinephrine（效果不明）。</li><li>觀察雙相反應（72 小時內可復發）。</li>';
      if (inf.bb === 'yes') d += '<li>近期用 β-blocker、對 epinephrine 反應差 → <b>glucagon 1–5 mg IV／5 分鐘</b>，接 5–15 μg/min；會嘔吐，意識不清者側躺。</li>';
      else if (inf.bb === 'no') d += '<li>難治性低血壓且無 β-blocker → 加 norepinephrine 或 phenylephrine（vasopressin 未評估）；此時預後差。</li>';
      d += '<li><b>類固醇在急性處置沒有角色</b>——不能終止、減緩或預防復發。</li><li>別漏掉 <b>Kounis 症候群</b>：過敏後 1 小時內的胸痛或 STEMI（冠脈痙攣 73%、斑塊破裂 22%、支架血栓 5%）。</li>';
      n = '過敏反應死亡率 0.25–0.33%，比想像少；Lieberman 2015／Shaker 2020 practice parameter。';
    }
    flowRec('inf_rec', cls, title, d, n);
  }
  window.infReset = function () { inf = { pheno: null, hypo: null, ne: null, org: null, shock: null, bb: null }; selAll('#inf_flow'); infRender(); };

  /* ================================================================
     章末測驗
     ================================================================ */
  I.renderQuiz('qz_ov', 'shock-ov', [
    { q: '依 Marino 引用的現行定義，「休克」的本質是什麼？', o: ['收縮壓 <90 mmHg', '細胞氧利用不足導致 ATP 生成缺陷', '心輸出量下降', '乳酸 >4 mmol/L'], a: 1, why: '休克是危及生命的循環障礙，特徵是細胞氧利用不足；低血壓只是常見表現，且血壓正常也可以是休克。' },
    { q: '把 MAP = CO × SVR + RAP 拆開，「低 SVR」對應哪一型休克？', o: ['低血容性', '心因性', '阻塞性', '血管擴張性（分布性）'], a: 3, why: '低 RAP＝低血容；低 CO＝心因性與阻塞性；低 SVR＝血管擴張性。前三型 SVR 反而代償性升高。' },
    { q: '為什麼休克監測要追 MAP 而不是收縮壓？', o: ['MAP 比較好量', '收縮壓往周邊會被反射波放大最多 20 mmHg，MAP 不變且是驅動血流的壓力', '收縮壓在低血壓時測不到', 'MAP 是指引規定'], a: 1, why: '收縮壓放大來自逆行反射波，它增加左心後負荷卻不推動血流；微循環是層流、沒有收縮舒張之分。' },
    { q: 'ScvO₂ 80% 出現在敗血性休克病人，最合理的解讀是？', o: ['氧輸送充足，可以減少支持', '組織氧萃取障礙，ScvO₂ 此時不可靠', '病人正在恢復', '需要輸血'], a: 1, why: '敗血症的線粒體用不掉氧，萃取率固定或 ≤20%，ScvO₂ 假性偏高；此時改看 PCO₂ gap 與乳酸。' },
    { q: 'Norepinephrine 加到多少時，再加量幾乎不再增加收縮反應、應考慮加第二種藥？', o: ['5 μg/min', '10 μg/min', '30 μg/min', '100 μg/min'], a: 2, why: '<10 μg/min 以 β 效應為主、>10 α 主導、30 μg/min 達平台；但多重升壓劑沒有存活證據。' },
    { q: '升壓劑外滲的正確處置是？', o: ['立刻沖洗導管再拔除', '停止輸注、回抽、不沖洗、拔管，12 小時內局部注射 phentolamine 5–10 mg', '熱敷等待吸收', '改用 dopamine'], a: 1, why: 'Phentolamine（長效 α 阻斷劑）5–10 mg 溶於 10 mL 生理食鹽水局部注射，皮膚蒼白應立刻消失；超過 12 小時無效。' },
    { q: '下列哪一項是 Marino 在本章「A Final Word」的立場？', o: ['低血壓是休克的原因，拉高血壓是治療核心', '低血壓可能是休克的結果（血管也是失能器官），修正血壓不等於修正休克', 'dopamine 應重回首選', '所有休克都應該用兩種升壓劑'], a: 1, why: '70 年來以升壓為主的治療沒有降低死亡率；就像透析不能修正休克造成的腎衰竭，升壓也不修正休克本身。這是作者觀點，非指引。' }
  ]);

  I.renderQuiz('qz_hem', 'shock-hem', [
    { q: '一位 60 kg 瘦體重的女性，估計血容量約？', o: ['3.0 L', '3.6 L', '4.0 L', '5.0 L'], a: 1, why: '女性 60 mL/kg × 60 kg ＝ 3.6 L；男性用 66 mL/kg（75 kg ≈ 5 L）。' },
    { q: '急性失血後前幾小時 Hb／Hct 沒有下降，代表？', o: ['失血量不多', '全血流失使血漿與紅血球等比例減少，H&H 早期不反映失血量', '病人有紅血球增多症', '檢驗錯誤'], a: 1, why: '跨毛細血管回填與 ADH／aldosterone 作用要 8–12 小時才讓 H&H 下降；早期的 H&H 反映的是輸了什麼液。' },
    { q: '快速輸液該選哪種導管？', o: ['多腔中央靜脈導管', '短而粗的周邊導管（或 7–9 Fr 快速輸液導管）', '長的 PICC', 'introducer 的側口'], a: 1, why: 'Hagen-Poiseuille：流量與 r⁴ 成正比、與長度成反比。1.2 吋周邊導管約為 8 吋中央導管 5 倍；introducer 側口只有本體 25% 流量。' },
    { q: '允許性低血壓的目標與前提是？', o: ['SBP 80–90 或 MAP 50，直到止血；並持續監測乳酸與尿量', 'MAP ≥65 一律達成', 'SBP <70 越低越好', '只適用鈍性創傷'], a: 0, why: '可減少輸血量與稀釋性凝血病變，死亡率證據不一致；最大風險是低血壓帶來的組織低灌流，所以乳酸與器官灌流指標不能停。' },
    { q: '創傷性凝血病變（TIC）的主要機轉是？', o: ['維生素 K 缺乏', '內皮損傷活化 protein C，抑制 V/VIII 並促進纖溶', '血小板過多', '低體溫本身'], a: 1, why: '入院時 40% 戰傷病人已有 TIC、死亡率 6 倍；酸中毒（pH <7.2）、低體溫、稀釋是傳統三因，但 TIC 獨立於它們存在。' },
    { q: '1:1:1 止血復甦中，每輸 5 單位 PRBC＋FFP 要加什麼？', o: ['1 單位 cryo', '1 份血小板（相當於 5–6 位捐者）', '1 g 鈣', '2 L 晶體液'], a: 1, why: '1 FFP 配 1 PRBC，每 5 單位加 1 份血小板；輔助：離子鈣 1.2–1.3 mmol/L、fibrinogen <100 給 cryo 2 U、TXA 1 g → 1 g/8 h。' },
    { q: 'TEG 的 R 時間延長最可能代表？', o: ['纖溶亢進', '血小板不足', '凝血因子缺乏或抗凝劑作用（warfarin 除外）', '纖維蛋白原充足'], a: 2, why: 'R 是凝塊起始時間（正常 5–10 分），所有抗凝劑除 warfarin 都會延長；warfarin 只能靠 INR 監測。' },
    { q: '復甦成功後 48–72 小時出現進行性多重器官衰竭，最早通常是哪個器官？', o: ['腎臟', '肝臟', '呼吸系統', '中樞神經'], a: 2, why: '復甦後損傷是源於內臟的再灌流損傷，先呼吸功能惡化，數天內腎、肝、心、CNS 跟進；死亡率 50–60%。>3 天發病要想腸源性感染。' }
  ]);

  I.renderQuiz('qz_cs', 'shock-cs', [
    { q: '急性心肌梗塞的機械併發症（乳突肌斷裂、VSD、游離壁破裂）通常何時出現？', o: ['24 小時內', '第 3–5 天', '第 2 週', '出院後'], a: 0, why: '書中強調這與傳統「晚期併發症」的印象相反：多在梗塞後 24 小時內出現。發生率分別約 7%、4%、1%。' },
    { q: '動態左心室流出道阻塞造成的休克，處置方向是？', o: ['dobutamine 增加收縮力', 'norepinephrine 加輸液', '非血管擴張 β-blocker 減慢心率、增加充填；升壓用 phenylephrine；強心劑禁忌', 'IABP'], a: 2, why: '與其他心因性休克完全相反。CW Doppler 心尖四腔切面測主動脈瓣下壓差確診。' },
    { q: '心因性休克最佳的左心室充填壓（PAWP）目標與理由？', o: ['<12 mmHg，避免肺水腫', '18–20 mmHg，重症病人膠體滲透壓約 20–25', '25–30 mmHg，最大化 CO', '不需監測'], a: 1, why: '目標是能增加 CO 又不致肺水腫的最高充填壓；正常 COP 約 28，但低白蛋白的重症病人約 20–25，因此 PAWP 18–20。' },
    { q: '為何 norepinephrine 是心因性休克的首選升壓劑？', o: ['純 α 效應最強', '比 epinephrine／dopamine 心搏過速與心律不整少、死亡較少，且輕度 β 效應保住 CO', '最便宜', '不需中央靜脈'], a: 1, why: '5 μg/min（0.05 μg/kg/min）起、每 5 分鐘調，研究常用 5–30 μg/min。' },
    { q: 'Milrinone 用在心因性休克的主要限制是？', o: ['心搏過速嚴重', '血管擴張造成低血壓；腎功能差時半衰期延長要減量', '會升高乳酸', '只能口服'], a: 1, why: '強心效果與 dobutamine 相當、心搏過速較少，但低血壓風險大，較適合沒有低血壓的失代償心衰竭；CrCl <50 依表調整。' },
    { q: 'IABP-SHOCK II 對 IABP 的結論是？', o: ['顯著降低 30 天死亡率', '不改善存活', '只在 STEMI 有效', '增加死亡率'], a: 1, why: 'IABP 不改善存活，其他 MCS 對比 IABP 也沒有顯示存活優勢；但它最普及、仍是暫時性選項。禁忌：主動脈瓣閉鎖不全、主動脈剝離。' },
    { q: '心因性休克合併呼吸衰竭時，首選的機械支持是？', o: ['IABP', 'Impella CP', 'VA-ECMO', 'RVAD'], a: 2, why: 'VA-ECMO 同時提供雙心室支持與氣體交換；代價是主動脈逆行血流增加 LV 後負荷（需 venting 或合併 IABP／Impella）與大量併發症（大出血 41%）。' },
    { q: '「bridge to nowhere」指的是？', o: ['ECMO 導管放錯位置', '多重器官衰竭發生後才啟動機械支持', '沒有心臟移植名單', 'IABP 放太久'], a: 1, why: '藥物支持增加心臟工作量，沒有快速改善就該提早機械支持；拖到 MOF 才上，裝置撐不出去路。' }
  ]);

  I.renderQuiz('qz_inf', 'shock-inf', [
    { q: 'Sepsis-3 對敗血性休克的定義是？', o: ['感染＋SIRS ≥2 項', '敗血症＋需要升壓劑＋乳酸 >2 mmol/L', '感染＋收縮壓 <90', '血液培養陽性＋發燒'], a: 1, why: '2016 年定義取代 1992 年的 SIRS 版本；SIRS 在重症病人不具特異性，<50% 有記錄感染。' },
    { q: 'Marino 為什麼說敗血症的乳酸上升不是缺氧？', o: ['乳酸機器不準', '骨骼肌 PO₂ 在重症敗血症反而升高，線粒體用不掉氧；乳酸是代謝壓力下的替代燃料', '因為病人都有肝衰竭', '因為 epinephrine'], a: 1, why: '意涵：補氧無益可能有害（氧化壓力）；ScvO₂ 假性偏高；但乳酸仍有預後意義，正常化仍是目標。' },
    { q: 'SSC 2021 建議在 norepinephrine 達到多少時加 vasopressin？', o: ['0.05 μg/kg/min', '0.1 μg/kg/min', '0.25–0.5 μg/kg/min（70 kg 約 18–35 μg/min）', '1 μg/kg/min'], a: 2, why: 'vasopressin 0.03 U/min 固定不滴定；仍難治再加 epinephrine。Marino：多重升壓劑無存活證據、NE 有免疫抑制效應。' },
    { q: '敗血性休克使用 hydrocortisone 的現行建議與證據是？', o: ['所有敗血症病人 200 mg/day', 'NE／epi ≥0.25 μg/kg/min 時 50 mg q6h；縮短休克約 1.5 天但不改善存活', '禁用', '單次 1 g'], a: 1, why: 'ADRENAL 等研究未顯示存活效益；建議來自一篇 meta-analysis 顯示休克緩解較快。作者對此持保留態度。' },
    { q: '血液培養要抽幾套、每套多少血量？', o: ['1 套 10 mL', '≥2 套、不同穿刺點、每套 ≥20 mL', '3 套都從導管抽', '5 套'], a: 1, why: '2 套約偵測 90% 血流感染、3 套近 98%；一套可由留置導管取得。抗生素要在 1 小時內、但在培養之後。' },
    { q: '毒性休克症候群為何一律加 clindamycin？', o: ['對 MRSA 最強', '抑制細菌毒素生成', '便宜', '腎功能不需調整'], a: 1, why: '經驗性用 piperacillin/tazobactam 或 meropenem ＋ vancomycin ＋ clindamycin；葡萄球菌 TSS 血液培養只有 5% 陽性，診斷靠臨床（月經、傷口、日曬樣紅疹→脫屑）。' },
    { q: '鏈球菌 TSS 的哪個線索最不能漏？', o: ['血液培養陰性', '疼痛與理學檢查不成比例，提示深部軟組織感染，需要清創', '皮疹一定很明顯', '只發生在女性'], a: 1, why: '壞死性筋膜炎、肌炎、產褥感染是主要來源；MRI 或床邊超音波找隱匿筋膜炎；死亡率 35%，清創是存活關鍵。' },
    { q: '過敏反應時，下列哪一項是「唯一能終止反應」的藥？', o: ['diphenhydramine', 'methylprednisolone', 'epinephrine 0.3–0.5 mg IM 前外側大腿', 'albuterol'], a: 2, why: '抗組織胺與支氣管擴張劑只緩解症狀、類固醇在急性處置「沒有角色」；用 β-blocker 者反應差時給 glucagon 1–5 mg IV。' },
    { q: '過敏性休克要積極輸液的理由是？', o: ['稀釋過敏原', '毛細血管滲漏可流失達 35% 的血管內容積，足以造成低血容性休克', '預防腎衰竭', '晶體液能終止反應'], a: 1, why: '1–2 L 晶體液（20–30 mL/kg）或 500 mL 5% albumin 在 5–10 分鐘內；之後考慮膠體，因為晶體液多半會漏到間質。' }
  ]);

  /* 初始化流程建議卡 */
  ovRender(); hemRender(); csRender(); infRender();
})();
