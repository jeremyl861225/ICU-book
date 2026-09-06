/* ICU Book · Section XVII 附錄 — 換算器、參考值、章末測驗
 * 來源：Marino's The ICU Book 5e, Appendix 1–3（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function na(x) { return !isFinite(x); }

  /* ================= App 1 ================= */
  I.bindCalc('cA1conc', function () {
    var v = num('cv_v'), sol = val('cv_s'), unit = val('cv_u');
    var S = { na: [23, 1, 'Na⁺'], k: [39, 1, 'K⁺'], ca: [40, 2, 'Ca²⁺'], mg: [24, 2, 'Mg²⁺'], cl: [35.5, 1, 'Cl⁻'], glu: [180, 0, '葡萄糖'], bun: [28, 0, 'BUN（尿素氮）'], cr: [113, 0, '肌酸酐'], lac: [90, 1, '乳酸'] }[sol];
    var mw = S[0], vl = S[1], nm = S[2];
    var mmol = unit === 'mmol' ? v : unit === 'meq' ? v / (vl || 1) : v * 10 / mw;
    var mgdl = mmol * mw / 10, meq = vl ? mmol * vl : NaN;
    var h = row(nm + ' mmol/L', na(mmol) ? '—' : fmt(mmol, 2), '', 'fl-na', 'mg/dL × 10 ÷ 分子量', '分子量 ' + mw);
    h += row('mg/dL', na(mgdl) ? '—' : fmt(mgdl, 1), '', 'fl-na', 'mmol/L × 分子量 ÷ 10', '');
    if (vl) h += row('mEq/L', na(meq) ? '—' : fmt(meq, 2), '', 'fl-na', 'mmol × 價數', '價數 ' + vl);
    h += row('滲透壓貢獻', na(mmol) ? '—' : fmt(mmol, 1), 'mOsm/L', 'fl-na', '每 mmol 一個粒子（電解質完全解離時）', '滲透活性看粒子數不看大小：Na 140 mEq/L ≈ 140 mOsm，葡萄糖 90 mg/dL 只 5 mOsm');
    h += '<div class="rx-flag">mol ＝ 分子量的克數；Eq ＝ mol × 價數；1 kcal ＝ 4,184 J；1 inch ＝ 2.54 cm；1 lb ＝ 453.5 g、1 kg ＝ 2.2 lb；0°C ＝ 273 K。</div>';
    document.getElementById('cA1conc_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('cA1press', function () {
    var v = num('pr_v'), u = val('pr_u');
    var mmhg = u === 'mmhg' ? v : u === 'cmh2o' ? v / 1.36 : u === 'kpa' ? v * 7.5 : v * 51.7;
    var h = row('mmHg', fmt(mmhg, 1), '', 'fl-na', '', '');
    h += row('cm H₂O', fmt(mmhg * 1.36, 1), '', 'fl-na', '1 mmHg ＝ 1.36 cm H₂O', '呼吸器壓力常用 cm H₂O、血行動力用 mmHg');
    h += row('kPa', fmt(mmhg / 7.5, 2), '', 'fl-na', '1 kPa ＝ 7.5 mmHg', '');
    h += row('psi', fmt(mmhg / 51.7, 3), '', 'fl-na', '1 psi ＝ 51.7 mmHg', '');
    h += '<div class="rx-flag">腹內壓（膀胱壓）用 mmHg；有些文獻用 cm H₂O，換算差 1.36 倍——第 34 與 39 章的差異就在這裡。</div>';
    document.getElementById('cA1press_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('cA1temp', function () {
    var c = num('tp_c'), f = num('tp_f');
    var h = '';
    if (!na(c)) h += row('°C → °F', fmt(c * 9 / 5 + 32, 1), '°F', 'fl-na', '°F ＝ 9/5 °C ＋ 32', '');
    if (!na(f)) h += row('°F → °C', fmt((f - 32) * 5 / 9, 1), '°C', 'fl-na', '°C ＝ 5/9 (°F − 32)', '');
    if (!h) h = row('換算', '—', '', 'fl-na', '任填一格', '');
    h += '<div class="rx-flag">30＝86、31＝87.8、32＝89.6、33＝91.4、34＝93.2、35＝95、36＝96.8、37＝98.6、38＝100.4、39＝102.2、40＝104、41＝105.8。</div>';
    document.getElementById('cA1temp_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('cA1tube', function () {
    var fr = num('tb_f'), ga = val('tb_g');
    var G = { '26': [0.45, 0.018], '25': [0.5, 0.02], '24': [0.56, 0.022], '23': [0.61, 0.024], '22': [0.71, 0.028], '21': [0.81, 0.032], '20': [0.91, 0.036], '19': [1.02, 0.04], '18': [1.22, 0.048], '16': [1.62, 0.064], '14': [2.03, 0.08], '12': [2.64, 0.104] };
    var h = row('French → 外徑', na(fr) ? '—' : fmt(fr / 3, 2) + ' mm', '', 'fl-na', '外徑 mm × 3 ＝ French（經驗法則）', na(fr) ? '' : '管腔面積約 ' + fmt(Math.PI * Math.pow(fr / 3 / 2, 2), 2) + ' mm²（不含管壁）');
    if (ga && G[ga]) h += row(ga + ' G 針', G[ga][0] + ' mm（' + G[ga][1] + ' in）', '', 'fl-na', 'Gauge 越大越細', '各廠牌略有差異');
    h += '<div class="rx-flag">導管流量與半徑四次方成正比、與長度成反比：短粗周邊針比長中心導管快（第 1 章）。</div><div class="note">原書附錄 1 的 French 對照表抽出時只剩尾段（20–38 Fr）；16 G 外徑原文印 0.040 in，與 1.62 mm 不符，本頁用 0.064 in。</div>';
    document.getElementById('cA1tube_out').innerHTML = I.wrap(h);
  });

  /* ================= App 2 ================= */
  I.bindCalc('cA2body', function () {
    var wt = num('bd_w'), ht = num('bd_h'), sex = val('bd_s');
    var m = ht / 100, bmi = wt / (m * m), ibw = (sex === 'f' ? 45.5 : 50) + 0.91 * (ht - 152.4), bsa = Math.sqrt(wt * ht / 3600);
    var bv = wt * (sex === 'f' ? 60 : 66), rbc = wt * (sex === 'f' ? 24 : 26), pl = wt * (sex === 'f' ? 36 : 40);
    var h = row('BMI', na(bmi) ? '—' : fmt(bmi, 1), 'kg/m²', na(bmi) ? 'fl-na' : bmi < 18.5 ? 'fl-warn' : bmi < 25 ? 'fl-ok' : bmi < 30 ? 'fl-na' : 'fl-warn', na(bmi) ? '' : bmi < 18.5 ? '<18.5：過輕（再餵食高風險）' : bmi < 25 ? '18.5–24.9 正常' : bmi < 30 ? '25–29.9 過重' : '≥30 肥胖', '');
    h += row('理想體重', na(ibw) ? '—' : fmt(ibw, 0), 'kg', 'fl-na', (sex === 'f' ? '45.5' : '50') + ' ＋ 0.91 × (身高 − 152.4)', na(wt) || na(ibw) ? '' : '實際 ' + fmt(wt / ibw * 100, 0) + '% IBW' + (wt > 1.25 * ibw ? '：>125%，營養用調整體重 ' + fmt(ibw + 0.25 * (wt - ibw), 0) + ' kg' : ''));
    h += row('體表面積', na(bsa) ? '—' : fmt(bsa, 2), 'm²', 'fl-na', 'Mosteller √(kg × cm / 3600)', '心指數 ＝ 心輸出量 ÷ BSA');
    h += row('血液量', na(bv) ? '—' : fmt(bv, 0) + ' mL（紅血球 ' + fmt(rbc, 0) + '、血漿 ' + fmt(pl, 0) + '）', '', 'fl-na', (sex === 'f' ? '女 60／24／36' : '男 66／26／40') + ' mL/kg', 'AABB 技術手冊');
    h += '<div class="rx-flag">原書的理想體重表、BMI 表、尖峰呼氣流速表都是圖檔，未收錄；理想體重用 Devine 公式、BSA 用 Mosteller 代替。</div>';
    document.getElementById('cA2body_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('cA2rad', function () {
    var n = { cxr1: num('rd_a') || 0, cxr2: num('rd_b') || 0, abd: num('rd_c') || 0, hct: num('rd_d') || 0, cct: num('rd_e') || 0, act: num('rd_f') || 0, cta: num('rd_g') || 0, cor: num('rd_h') || 0 };
    var D = { cxr1: 0.02, cxr2: 0.1, abd: 0.7, hct: 2, cct: 7, act: 8, cta: 15, cor: 16 };
    var tot = 0; for (var k in n) tot += n[k] * D[k];
    var h = row('累積有效劑量', fmt(tot, 1), 'mSv', tot > 50 ? 'fl-hot' : tot > 20 ? 'fl-warn' : 'fl-ok', tot > 50 ? '超過年上限 50 mSv（EPA）' : '年上限 50 mSv', '平均值；各項有範圍（頭部 CT 0.9–4、胸部 CT 4–18、腹部 CT 3.5–25、胸部 CTA 13–40、冠狀動脈攝影 5–32）');
    h += row('胸部 X 光', '單張 0.02、兩張 0.1', 'mSv', 'fl-na', '腹部 X 光 0.7', '');
    h += row('CT', '頭 2、胸 7、腹 8、胸部 CTA 15', 'mSv', 'fl-na', '冠狀動脈攝影 16', '有效劑量＝全身各器官的總和');
    document.getElementById('cA2rad_out').innerHTML = I.wrap(h);
  });

  /* ================= App 3 ================= */
  I.bindCalc('cA3watt', function () {
    var wt = num('bf_w');
    var kcal = 25 * wt, hr = kcal / 24, watt = hr * 1.16;
    var h = row('每日靜息能量', na(kcal) ? '—' : fmt(kcal, 0), 'kcal', 'fl-na', '25 kcal/kg', '');
    h += row('功率', na(watt) ? '—' : fmt(watt, 0), 'W', 'fl-na', fmt(hr, 0) + ' kcal/hr × 1.16', '原書：80 kg → 83 kcal/hr ≈ 80 W 燈泡（83 × 1.16 其實是 97 W，原文疑義）');
    h += row('每日 ATP 週轉', na(wt) ? '約 80 kg' : '約等於體重（' + fmt(wt, 0) + ' kg）', '', 'fl-na', '2 × 10²⁶ 個分子/天 ≈ 80 kg', '每天循環一個自己的重量才活著');
    h += row('紅血球製造', '每秒 310 萬', '', 'fl-na', '5.4 兆/L × 5 L ＝ 27 兆；每天換 1% ＝ 2,700 億', '');
    h += '<div class="rx-flag">血管接起來 10 萬公里（地球 2.5 圈）；氣道 2,500 公里（倫敦到莫斯科）；基因組 2 公尺塞進 6 微米的核（曼哈頓長度的線塞進網球）；全身 DNA 接起來 100 億英里（太陽到冥王星近 3 倍）；DNA polymerase 每 100 億個核苷酸才錯一個；每分鐘掉 25,000 個皮膚細胞、30 天換一層皮；大腦皮質突觸 10¹⁵ 個、一秒數一個要 3,200 萬年；一次心跳有 6 個變數，人腦一次只能處理 4 個——每一次心跳都無法被完整理解。</div>';
    document.getElementById('cA3watt_out').innerHTML = I.wrap(h);
  });

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_app', 'appendix-app', [
    { q: '葡萄糖 90 mg/dL 貢獻多少滲透壓？', o: ['90 mOsm', '約 5 mOsm（90 × 10 ÷ 180）；Na 140 mEq/L 是 140 mOsm——滲透活性看粒子數不看大小', '18 mOsm', '0'], a: 1, why: 'mmol ＝ mg/dL × 10 ÷ 分子量；Eq ＝ mol × 價數。' },
    { q: 'mmHg 與 cm H₂O 怎麼換？', o: ['一樣', '1 mmHg ＝ 1.36 cm H₂O；腹內壓要用 mmHg（第 39 章寫 cm H₂O 是原文疑義）', '1 mmHg ＝ 0.5 cm H₂O', '1 mmHg ＝ 10 cm H₂O'], a: 1, why: '1 kPa ＝ 7.5 mmHg；1 psi ＝ 51.7 mmHg。' },
    { q: 'French 與外徑的關係？', o: ['French ＝ 外徑 mm', 'French ≈ 外徑 mm × 3；Gauge 越大越細（18 G 1.22 mm、14 G 2.03 mm）', 'French ＝ 內徑', '沒有關係'], a: 1, why: '流量與半徑四次方成正比、與長度成反比。' },
    { q: '成人血液量？', o: ['100 mL/kg', '男 66、女 60 mL/kg（紅血球 26／24、血漿 40／36）', '50 mL/kg', '80 mL/kg'], a: 1, why: 'BMI ≤18.5 是再餵食高風險；實際體重 >125% IBW 營養用調整體重。' },
    { q: '一次腹部 CT 的有效劑量？', o: ['0.1 mSv', '約 8 mSv（範圍 3.5–25）；胸部 CTA 15、冠狀動脈攝影 16；年上限 50 mSv', '50 mSv', '0.7 mSv'], a: 1, why: '胸部 X 光單張 0.02、頭部 CT 2、胸部 CT 7。' },
    { q: '維持人體生命的功率大約？', o: ['1,000 W', '約 80 W（25 kcal/kg → 80 kg 2,000 kcal/天 ＝ 83 kcal/hr × 1.16）——一顆燈泡', '10 W', '500 W'], a: 1, why: '每天 ATP 週轉約等於體重；每秒製造 310 萬顆紅血球；一次心跳 6 個變數超過人腦能處理的 4 個。' }
  ]);
})();
