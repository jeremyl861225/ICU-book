/* ICU Book · Section X 酸鹼失衡 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 31–33（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch31 ================= */
  I.bindCalc('c31abg', function () {
    var ph = num('ab_ph'), pco2 = num('ab_pco2'), hco3 = num('ab_hco3');
    var hplus = 24 * pco2 / hco3;
    var h = row('[H⁺]', na(hplus) ? '—' : fmt(hplus, 0), 'nEq/L', 'fl-na', '24 × PCO₂ / HCO₃', '正常 40（pH 7.40）；酸側每 0.1 pH 變 ~60、鹼側 ~24');
    var prim = '', sec = '', note = '';
    if (!na(ph) && !na(pco2)) {
      var phAb = ph < 7.36 || ph > 7.44, coAb = pco2 < 36 || pco2 > 44;
      if (phAb && coAb) {
        var same = (ph < 7.36 && pco2 < 36) || (ph > 7.44 && pco2 > 44);
        prim = same ? (ph < 7.36 ? '原發代謝性酸中毒' : '原發代謝性鹼中毒') : (pco2 > 44 ? '原發呼吸性酸中毒' : '原發呼吸性鹼中毒');
        if (!na(hco3)) {
          if (same && ph < 7.36) { var exp = 40 - 1.2 * (24 - hco3); sec = pco2 > exp + 2 ? '＋次發呼吸性酸中毒' : pco2 < exp - 2 ? '＋次發呼吸性鹼中毒' : '呼吸代償適當'; note = '預期 PaCO₂ ' + fmt(exp, 0) + '（40 − 1.2 × ΔHCO₃）'; }
          else if (same) { var exp2 = 40 + 0.7 * (hco3 - 24); sec = pco2 > exp2 + 2 ? '＋次發呼吸性酸中毒' : pco2 < exp2 - 2 ? '＋次發呼吸性鹼中毒' : '呼吸代償適當'; note = '預期 PaCO₂ ' + fmt(exp2, 0) + '（40 ＋ 0.7 × ΔHCO₃）'; }
          else if (pco2 > 44) { var a1 = 24 + 0.1 * (pco2 - 40), c1 = 24 + 0.4 * (pco2 - 40); sec = hco3 < a1 - 1 ? '＋次發代謝性酸中毒' : hco3 > c1 + 1 ? '＋次發代謝性鹼中毒' : hco3 <= a1 + 1 ? '急性（未代償）' : '部分至完全代償（慢性）'; note = '預期 HCO₃ 急性 ' + fmt(a1, 0) + '、慢性 ' + fmt(c1, 0); }
          else { var a2 = 24 - 0.2 * (40 - pco2), c2 = 24 - 0.4 * (40 - pco2); sec = hco3 > a2 + 1 ? '＋次發代謝性鹼中毒' : hco3 < c2 - 1 ? '＋次發代謝性酸中毒' : hco3 >= a2 - 1 ? '急性（未代償）' : '部分至完全代償（慢性）'; note = '預期 HCO₃ 急性 ' + fmt(a2, 0) + '、慢性 ' + fmt(c2, 0); }
        }
      } else if (coAb && !phAb) { prim = pco2 > 44 ? '混合：呼吸性酸中毒＋代謝性鹼中毒' : '混合：呼吸性鹼中毒＋代謝性酸中毒'; note = 'PaCO₂ 異常但 pH 正常——代償不會把 pH 拉回正常，所以是兩個原發'; }
      else if (phAb && !coAb) { prim = ph < 7.36 ? '代謝性酸中毒（PaCO₂ 尚在範圍內）' : '代謝性鹼中毒（PaCO₂ 尚在範圍內）'; if (!na(hco3)) { var e3 = ph < 7.36 ? 40 - 1.2 * (24 - hco3) : 40 + 0.7 * (hco3 - 24); note = '預期 PaCO₂ ' + fmt(e3, 0) + (pco2 > e3 + 2 ? '，實測偏高 → 次發呼吸性酸中毒' : pco2 < e3 - 2 ? '，實測偏低 → 次發呼吸性鹼中毒' : ''); } }
      else prim = '三者都在參考範圍';
    }
    h += row('第 I 階段', prim || '—', '', prim ? (prim.indexOf('酸') >= 0 ? 'fl-warn' : 'fl-na') : 'fl-na', 'pH 與 PaCO₂ 同向＝代謝、反向＝呼吸', '');
    h += row('第 II 階段', sec || '—', '', sec && sec.indexOf('次發') >= 0 ? 'fl-hot' : 'fl-na', note, '');
    h += '<div class="rx-flag">參考範圍 pH 7.36–7.44、PaCO₂ 36–44、HCO₃ 22–26。代償只限制、不矯正 pH；代謝性的呼吸代償 30–120 分鐘就到（酸中毒 ΔPaCO₂ ＝ 1.2 × ΔHCO₃、鹼中毒 0.7），呼吸性的腎代償要 2–3 天（急性 0.1／0.2、慢性 0.4 × ΔPaCO₂）。代謝性酸中毒接著算 gap。</div>';
    document.getElementById('c31abg_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c31ag', function () {
    var naV = num('ag_na'), cl = num('ag_cl'), hco3 = num('ag_hco3'), alb = num('ag_alb');
    var ag = naV - (cl + hco3), agc = na(alb) ? ag : ag + 2.5 * (4.5 - alb), dg = (agc - 12) / (24 - hco3);
    var high = agc > 12;
    var h = row('陰離子間隙', fmt(ag, 0), 'mEq/L', na(ag) ? 'fl-na' : ag > 12 ? 'fl-warn' : 'fl-ok', na(ag) ? '' : ag > 12 ? '>12 升高' : '正常 8–12', 'Na − (Cl ＋ HCO₃)');
    h += row('白蛋白校正', na(alb) ? '—' : fmt(agc, 0), 'mEq/L', na(alb) ? 'fl-na' : agc > 12 ? 'fl-hot' : 'fl-ok', na(alb) ? '選填白蛋白' : agc > 12 ? '校正後升高' : '校正後正常', 'AG ＋ 2.5 × (4.5 − 白蛋白)；ICU 90% 低白蛋白');
    h += row('Delta gap', na(dg) || !high ? '—' : fmt(dg, 2), '', na(dg) || !high ? 'fl-na' : dg < 0.8 ? 'fl-warn' : dg > 1.2 ? 'fl-warn' : 'fl-ok', na(dg) || !high ? (high ? '' : '只在高 AG 時計算') : dg < 0.8 ? '<1：合併正常 AG（高氯）酸中毒' : dg > 1.2 ? '>1：合併代謝性鹼中毒' : '≈1：單純高 AG 酸中毒', '(AG − 12) / (24 − HCO₃)');
    h += '<div class="rx-flag">高 AG：L-乳酸、D-乳酸（短腸症、要特別要求）、酮酸、乙二醇（草酸）、甲醇（甲酸）、水楊酸、5-oxoproline（長期 acetaminophen）、晚期腎衰竭。正常 AG（高氯）：食鹽水、腹瀉、早期腎功能不全、RTA、acetazolamide、輸尿管腸吻合。DKA 用食鹽水復甦時 HCO₃ 會因高氯酸中毒停在低點，delta gap 才看得出酮酸在退。</div>';
    document.getElementById('c31ag_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c31osm', function () {
    var naV = num('os_na'), glu = num('os_glu'), bun = num('os_bun'), meas = num('os_m');
    var calc = 2 * naV + glu / 18 + bun / 2.8, gap = meas - calc;
    var h = row('計算滲透壓', fmt(calc, 0), 'mOsm/kg', 'fl-na', '2 × Na ＋ 葡萄糖/18 ＋ BUN/2.8', '正常約 290');
    h += row('滲透壓間隙', na(gap) ? '—' : fmt(gap, 0), 'mOsm/kg', na(gap) ? 'fl-na' : gap >= 10 ? 'fl-hot' : 'fl-ok', na(gap) ? '填實測值' : gap >= 10 ? '≥10：有未測到的溶質' : '<10 正常', '');
    h += '<div class="rx-flag">高 AG 酸中毒但乳酸與酮體都解釋不了 → 滲透壓間隙升高提示隱藏的酸：D-乳酸、草酸、甲酸、水楊酸、pyroglutamic acid（甲醇與乙二醇本身也撐高間隙）。</div>';
    document.getElementById('c31osm_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch32 ================= */
  I.bindCalc('c32bic', function () {
    var wt = num('bc_w'), hco3 = num('bc_h'), ph = num('bc_ph'), unst = val('bc_u') === 'y', renal = val('bc_r') === 'y';
    var def = 0.6 * wt * (15 - hco3), half = def / 2, amps = half / 50;
    var elig = (!na(ph) && ph <= 7.1) || (!na(hco3) && hco3 <= 5);
    var h = row('HCO₃ 缺口', na(def) ? '—' : fmt(Math.max(def, 0), 0), 'mEq', 'fl-na', '0.6 × 體重 × (15 − HCO₃)', '目標只到 15');
    h += row('先補一半', na(half) ? '—' : fmt(Math.max(half, 0), 0), 'mEq', 'fl-na', na(amps) ? '' : '≈ ' + fmt(Math.max(amps, 0), 1) + ' 支 8.4%（50 mEq/50 mL）', '稀釋在 D5W 數小時緩慢輸；看血行動力學有無改善再續');
    h += row('符合「嚴重」', na(ph) && na(hco3) ? '—' : elig ? (unst ? '是，且不穩定' : '是，但穩定') : '否', '', elig ? (unst ? 'fl-warn' : 'fl-na') : 'fl-ok', 'pH ≤7.1 或 HCO₃ ≤5', unst ? '作者只建議用在需升壓劑者' : renal ? '腎功能不全（HCO₃ 流失）最可能受益' : '');
    h += '<div class="rx-flag">酸中毒本身不傷人（完整生物體酸血症反升心輸出量；細胞外酸中毒延緩能量耗竭細胞的死亡——醃漬就是 pH 4）。碳酸氫鹽 pK 6.1、有效範圍 5.1–7.1，在生理 pH 不是緩衝劑，而是 CO₂ 運輸的終產物；輸注生成 CO₂ 讓細胞內與 CSF 更酸（溶液 PCO₂ 200 mmHg）、還升乳酸。8.4% 2,000 mOsm/L；監測游離鈣（pH 升鈣降 → 不穩定）；呼吸器病人要加分鐘通氣量。</div>';
    document.getElementById('c32bic_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c32dka', function () {
    var wt = num('dk_w'), k = num('dk_k'), glu = num('dk_g'), naM = num('dk_na');
    var kRec = na(k) ? '—' : k < 3.3 ? '停 insulin；K 40 mEq/hr 到 >3.3' : k <= 4 ? 'K 20 mEq/hr' : k <= 5.5 ? 'K 10 mEq/hr' : '不補，每 2 小時驗';
    var corrNa = na(naM) || na(glu) ? NaN : naM + 2.4 * Math.max(glu - 100, 0) / 100;
    var h = row('輸液', fmt(wt * 15, 0) + '–' + fmt(wt * 20, 0), 'mL/hr', 'fl-na', '15–20 mL/kg/hr（約 1 L/hr）頭幾小時', '平衡液優於食鹽水；穩定後 250；葡萄糖 ≤250 改 D5 ½NS 150–200');
    h += row('Insulin', na(wt) ? '—' : fmt(wt * 0.1, 1) + ' U bolus → ' + fmt(wt * 0.1, 1) + ' U/hr', '', na(k) ? 'fl-na' : k < 3.3 ? 'fl-hot' : 'fl-ok', na(k) ? '' : k < 3.3 ? 'K <3.3 先不給' : '可開始', '目標每小時降 100 mg/dL；≤250 減到 ' + (na(wt) ? '—' : fmt(wt * 0.05, 1)) + ' U/hr，維持 150–200');
    h += row('鉀', kRec, '', na(k) ? 'fl-na' : k < 3.3 ? 'fl-hot' : k <= 4 ? 'fl-warn' : 'fl-na', na(k) ? '' : '前 6 小時每 1–2 小時驗', '缺口平均 3–5 mEq/kg；初始正常或偏高占 96%');
    h += row('校正鈉', na(corrNa) ? '—' : fmt(corrNa, 0), 'mEq/L', 'fl-na', '每 100 mg/dL 葡萄糖 ＋2.4', '算 AG 用實測鈉（氯也被稀釋）');
    h += '<div class="rx-flag">缺水 50–100 mL/kg。ADA 判準：葡萄糖 >250、HCO₃ <18、pH ≤7.30、高 AG、酮體——3% 是正常血糖 DKA（SGLT2i、懷孕、飢餓，輸液全加 D5）；AG 也可正常。白血球隨酮體升、看 band；27% troponin 升。磷 <1 才補；碳酸氫鹽不常規。Insulin 直接推入靜脈、管路先跑 10 mL；AG 正常且 HCO₃ >18 才轉皮下，重疊 1 小時；新病人 0.5–0.8 U/kg/天。</div>';
    document.getElementById('c32dka_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c32lac', function () {
    var lac = num('la_v'), pyr = num('la_p'), ph = num('la_ph'), hrs = num('la_t');
    var lp = lac / pyr;
    var h = row('乳酸', fmt(lac, 1), 'mmol/L', na(lac) ? 'fl-na' : lac >= 4 ? 'fl-hot' : lac > 2 ? 'fl-warn' : 'fl-ok', na(lac) ? '' : lac >= 4 ? '≥4 才有預後意義' : lac > 2 ? '2–4 輕度升高' : '正常 ≤2', '動脈或靜脈都可；不能馬上驗就冰');
    h += row('乳酸／丙酮酸', na(lp) ? '—' : fmt(lp, 0), '', na(lp) ? 'fl-na' : lp > 10 ? 'fl-warn' : 'fl-ok', na(lp) ? '選填' : lp > 10 ? '>10：敗血性休克型' : '≈10：壓力性高乳酸（丙酮酸多）', (!na(ph) && ph >= 7.35 && !na(lac) && lac <= 5) ? '乳酸 2–5、pH 正常、比值正常 ＝ stress hyperlactatemia' : '');
    h += row('清除時間', na(hrs) ? '—' : fmt(hrs, 0), '小時', na(hrs) ? 'fl-na' : hrs <= 24 ? 'fl-ok' : 'fl-warn', na(hrs) ? '選填' : hrs <= 24 ? '24 小時內正常化：死亡率最低' : '拖過 24 小時：死亡率上升', '清除時間比初值更能預測');
    h += '<div class="rx-flag">每天產 1,500 mmol（肌肉 25、皮膚 25、紅血球 20、腦 20、腸 10%）；肝清 60、腎 30、心 10%。乳酸不是酸（產生它的反應消耗 H⁺）、不是無氧代謝驅動、是燃料（心 60%、腦 30%）。AG 正常不能排除乳酸酸中毒。找原因：休克、敗血症（PDH 抑制、細胞病性缺氧）、thiamine 缺乏、epinephrine／albuterol、metformin（腎功能不全、死亡 17–30%、洗腎）、抗反轉錄病毒、linezolid（25%）、propofol、CO、氰化物、propylene glycol（lorazepam >2 天 19–66%）、癲癇（可達 15、短暫）、肝衰竭、氣喘、血液惡性腫瘤、鹼中毒 pH ≥7.6。</div>';
    document.getElementById('c32lac_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch33 ================= */
  I.bindCalc('c33cl', function () {
    var wt = num('cd_w'), cl = num('cd_cl'), loss = num('cd_l') || 0;
    var def = 0.2 * wt * (100 - cl), vol = def / 154;
    var h = row('氯缺口', na(def) ? '—' : fmt(Math.max(def, 0), 0), 'mEq', 'fl-na', '0.2 × 淨體重 × (100 − Cl)', '目標 Cl 100');
    h += row('等張食鹽水', na(vol) ? '—' : fmt(Math.max(vol, 0), 1), 'L', 'fl-na', '缺口 / 154', '');
    h += row('速率', fmt(100 + loss, 0), 'mL/hr', 'fl-na', '每小時流失 ＋ 100', '不必快');
    h += '<div class="rx-flag">氯敏感型（低 ECV、尿氯 <20）：嘔吐／鼻胃管、低血容續發性高醛固酮、利尿劑（效應退了尿氯才低）、瀉藥濫用（糞便 K、Cl 70–90）。補氯＋KCl；利尿劑引起的低鉀常因缺鎂而補不上——先驗鎂。水腫（心衰竭、肝硬化、肺心症）：食鹽水反效果，改 KCl＋acetazolamide 250–375 mg IV/PO qd–bid（抑制近曲小管 HCO₃ 再吸收、兼利尿）。</div>';
    document.getElementById('c33cl_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c33hcl', function () {
    var wt = num('hc_w'), hco3 = num('hc_h'), ph = num('hc_ph');
    var def = 0.5 * wt * (hco3 - 24), vol = def / 100, maxRate = 0.2 * wt, minH = def / maxRate;
    var elig = (!na(hco3) && hco3 > 50) || (!na(ph) && ph > 7.55);
    var h = row('H⁺ 缺口', na(def) ? '—' : fmt(Math.max(def, 0), 0), 'mEq', 'fl-na', '0.5 × 淨體重 × (HCO₃ − 24)');
    h += row('0.1N HCl 體積', na(vol) ? '—' : fmt(Math.max(vol, 0), 1), 'L', 'fl-na', '100 mL 1N HCl ＋ 900 mL 食鹽水或無菌水 ＝ 100 mEq/L', '不必全補，pH <7.5 就停');
    h += row('最高速率', na(maxRate) ? '—' : fmt(maxRate, 0), 'mEq/hr', 'fl-na', '0.2 mEq/kg/hr', na(minH) ? '' : '全補至少 ' + fmt(Math.max(minH, 0), 0) + ' 小時');
    h += row('適應症', na(hco3) && na(ph) ? '—' : elig ? '符合' : '不符', '', elig ? 'fl-hot' : 'fl-ok', 'HCO₃ >50 或 pH >7.55，且 KCl 與 acetazolamide 無效', '');
    h += '<div class="rx-flag">腐蝕性：必須走大中央靜脈，外滲即使經中央靜脈也可嚴重壞死（有胸壁壞死致死報告）。</div>';
    document.getElementById('c33hcl_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c33resp', function () {
    var hco3 = num('rs_h'), pco2 = num('rs_p');
    var exp = 40 + 0.7 * (hco3 - 24);
    var h = row('預期 PaCO₂', fmt(exp, 0), 'mmHg', na(exp) ? 'fl-na' : exp > 50 ? 'fl-hot' : exp > 46 ? 'fl-warn' : 'fl-ok', na(exp) ? '' : exp > 50 ? '>50：令人擔心的高碳酸' : exp > 46 ? '>46：高碳酸' : '未達高碳酸', '40 ＋ 0.7 × (HCO₃ − 24)');
    if (!na(pco2)) h += row('實測 PaCO₂', fmt(pco2, 0), 'mmHg', pco2 > exp + 2 ? 'fl-warn' : pco2 < exp - 2 ? 'fl-warn' : 'fl-ok', pco2 > exp + 2 ? '偏高：次發呼吸性酸中毒' : pco2 < exp - 2 ? '偏低：次發呼吸性鹼中毒' : '代償適當', '');
    h += '<div class="rx-flag">低通氣反應不強（周邊化學受體平時不活躍、容易開難關）：HCO₃ 要升近 10（+40%）才 PaCO₂ >46，>50 要嚴重鹼中毒。代謝性鹼中毒多半無症狀（HCO₃ 151 的病例都穩定恢復）；神經症狀多屬呼吸性鹼中毒；Bohr 效應左移但無組織缺氧證據。</div>';
    document.getElementById('c33resp_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch31 高 AG 酸中毒追查 */
  var ga = { lac: null, ket: null, osm: null };
  window.gaPick = function (k, v, btn) { flowSelect(btn); ga[k] = v; gaRender(); };
  function gaRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ga.lac === 'yes') { cls = 'rec-urgent'; t = '乳酸升高：乳酸酸中毒——找原因，不要盯著 pH'; d = '<li>休克、敗血症、thiamine 缺乏、藥物（epinephrine、albuterol、metformin、linezolid、propofol、抗反轉錄病毒）、毒物（CO、氰化物、propylene glycol）、癲癇、肝衰竭、鹼中毒。</li><li>AG 正常也可能是乳酸酸中毒——AG 不是篩檢工具。</li>'; }
    else if (ga.lac === 'no') {
      if (ga.ket === 'yes') { cls = 'rec-urgent'; t = '酮酸：DKA（血糖 >250 或 SGLT2i 的正常血糖 DKA）或酒精性（AKA）'; d = '<li>β-hydroxybutyrate 儀器測（nitroprusside 只測 acetoacetate，AKA 可陰性）。</li><li>DKA：平衡液、insulin、鉀；AKA：含葡萄糖的食鹽水＋thiamine，24 小時內解。</li>'; }
      else if (ga.ket === 'no') {
        if (ga.osm === 'yes') { cls = 'rec-urgent'; t = '滲透壓間隙升高：隱藏的酸——甲醇、乙二醇、水楊酸、D-乳酸、5-oxoproline'; d = '<li>D-乳酸：短腸症、神經症狀（混亂、躁動、失調、眼震），要特別要求檢驗。</li><li>5-oxoproline：長期 acetaminophen，血中濃度常在治療範圍。</li><li>甲醇（甲酸）、乙二醇（草酸）見第 52–53 章。</li>'; }
        else if (ga.osm === 'no') { cls = 'rec-elective'; t = '乳酸酮酸都不高、間隙正常：晚期腎衰竭（H⁺ 分泌喪失）或漏掉的檢驗'; d = '<li>再算一次白蛋白校正 AG；ICU 90% 低白蛋白，AG 常被藏起來。</li>'; }
        else { cls = 'rec-elective'; t = '乳酸酮酸都不是：算滲透壓間隙'; d = '<li>請回答第 3 步。</li>'; }
      } else { cls = 'rec-elective'; t = '乳酸不高：測 β-hydroxybutyrate'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (ga.lac) n = '高 AG ＝ 非揮發性酸累積；正常 AG（高氯）＝ HCO₃ 直接流失（食鹽水、腹瀉、早期腎功能不全、RTA、acetazolamide）。';
    flowRec('ga_rec', cls, t, d, n);
  }
  window.gaReset = function () { ga = { lac: null, ket: null, osm: null }; selAll('#ga_flow'); gaRender(); };

  /* Ch32 高乳酸分型 */
  var hl = { shock: null, ph: null };
  window.hlPick = function (k, v, btn) { flowSelect(btn); hl[k] = v; hlRender(); };
  function hlRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (hl.shock === 'yes') { cls = 'rec-urgent'; t = '休克：乳酸是預後指標，處理灌流；碳酸氫鹽只考慮 pH ≤7.1 且需升壓劑者'; d = '<li>低血容／心因性：DO₂ 不足；敗血性：丙酮酸生產增加＋粒線體用不掉氧（PDH 抑制），組織氧合甚至升高。</li><li>24 小時內清除死亡率最低。</li>'; }
    else if (hl.shock === 'no') {
      if (hl.ph === 'normal') { cls = 'rec-blue'; t = '乳酸 2–5、pH 正常、L:P 正常：壓力性高乳酸（stress hyperlactatemia）'; d = '<li>全身發炎讓丙酮酸生產增加，無氧合或氧利用缺陷；不必治乳酸。</li><li>也想：epinephrine／albuterol（有氧、糖解加速）、癲癇後（可達 15、短暫）、劇烈運動。</li>'; }
      else if (hl.ph === 'low') { cls = 'rec-elective'; t = '無休克的乳酸酸中毒：藥物、thiamine、毒物、肝衰竭、D-乳酸'; d = '<li>Thiamine 缺乏（PDH 輔因子）可極嚴重——所有不明乳酸酸中毒都要想、直接補。</li><li>Metformin（腎功能不全、洗腎優於鹼）、linezolid（25% 死亡）、抗反轉錄病毒 >10 死亡 33–57%、propylene glycol（lorazepam／diazepam／esmolol／NTG／phenytoin 溶劑，停藥換非 diazepam 鎮靜）、CO、氰化物、肝衰竭（清除差）、血液惡性腫瘤。</li><li>短腸症＋腦病變：驗 D-乳酸。</li>'; }
      else if (hl.ph === 'high') { cls = 'rec-elective'; t = '鹼血症伴高乳酸：乳酸性鹼中毒'; d = '<li>pH 依賴的糖解酶活性上升；肝正常要 pH ≥7.6 才顯現，肝功能差更早。</li>'; }
      else { cls = 'rec-elective'; t = '無休克：看 pH 與乳酸／丙酮酸比'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (hl.shock) n = '問題不在酸中毒，在造成它的病；碳酸氫鹽不是生理 pH 的緩衝劑。';
    flowRec('hl_rec', cls, t, d, n);
  }
  window.hlReset = function () { hl = { shock: null, ph: null }; selAll('#hl_flow'); hlRender(); };

  /* Ch33 代謝性鹼中毒評估 */
  var ma = { ecv: null, edema: null };
  window.maPick = function (k, v, btn) { flowSelect(btn); ma[k] = v; maRender(); };
  function maRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ma.ecv === 'low') {
      if (ma.edema === 'no') { cls = 'rec-elective'; t = '氯敏感型（低 ECV、尿氯 <20）：等張食鹽水＋KCl'; d = '<li>嘔吐／鼻胃管（胃液 H⁺ 50–100、Cl 120–160、K 10–15 mEq/L）、續發性高醛固酮、利尿劑後效應、瀉藥濫用（病人常否認）。</li><li>氯缺口 ＝ 0.2 × 體重 × (100 − Cl)、食鹽水 ＝ 缺口/154，速率流失＋100 mL/hr。</li><li>補鉀前先驗鎂——缺鎂的低鉀補不上。</li>'; }
      else if (ma.edema === 'yes') { cls = 'rec-elective'; t = '水腫狀態（心衰竭、肝硬化、肺心症）的利尿劑鹼中毒：KCl＋acetazolamide，不灌食鹽水'; d = '<li>Acetazolamide 250–375 mg IV/PO qd–bid：抑制近曲小管 HCO₃ 再吸收、排 NaHCO₃ 兼利尿。</li><li>仍嚴重（HCO₃ >50 或 pH >7.55）→ 0.1N HCl 經中央靜脈、≤0.2 mEq/kg/hr。</li>'; }
      else { cls = 'rec-elective'; t = '低 ECV、尿氯 <20：有水腫嗎？'; d = '<li>請回答第 2 步。</li>'; }
    } else if (ma.ecv === 'high') { cls = 'rec-blue'; t = '氯抗性型（高 ECV、尿氯 >20）：原發性高醛固酮、外源性礦物皮質素、甘草'; d = '<li>ICU 少見；腺瘤或特發性增生。</li>'; }
    else if (ma.ecv === 'var') { cls = 'rec-blue'; t = 'ECV 與尿氯不定：鉀或鎂耗竭'; d = '<li>低鉀讓 H⁺ 進細胞、腎小管細胞內酸 → HCO₃ 再吸收增加；補鉀鎂。</li>'; }
    if (ma.ecv) n = '住院病人最常見的酸鹼失衡就是代謝性鹼中毒（HCO₃ >30）：誘因常見、會自我維持、常被忽略。「收縮性鹼中毒」是誤稱——問題是氯缺乏不是水少。';
    flowRec('ma_rec', cls, t, d, n);
  }
  window.maReset = function () { ma = { ecv: null, edema: null }; selAll('#ma_flow'); maRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_ab', 'acidbase-ab', [
    { q: 'pH 7.41、PaCO₂ 60，怎麼判？', o: ['慢性呼吸性酸中毒完全代償', '混合：呼吸性酸中毒＋代謝性鹼中毒（代償不會把 pH 拉回正常）', '正常', '代謝性鹼中毒'], a: 1, why: '規則 2：PaCO₂ 異常而 pH 正常＝兩個原發。規則 1：同向＝代謝、反向＝呼吸。' },
    { q: 'HCO₃ 14 的代謝性酸中毒，預期 PaCO₂？', o: ['40', '28（40 − 1.2 × 10）；實測 23 就是加上呼吸性鹼中毒', '20', '35'], a: 1, why: '呼吸代償 30–120 分鐘；鹼中毒用 0.7。呼吸性的腎代償要 2–3 天：急性 0.1（酸）／0.2（鹼）、慢性 0.4 × ΔPaCO₂。' },
    { q: '白蛋白 2 g/dL、AG 10，校正後？', o: ['10', '16（＋2.5 × 2.5）——正常變升高', '8', '20'], a: 1, why: '白蛋白是主要未測陰離子、每克 2.5 mEq；ICU 90% 低白蛋白會把乳酸藏起來。' },
    { q: 'DKA 用食鹽水復甦，HCO₃ 一直不升，該看？', o: ['再給碳酸氫鹽', 'Delta gap：<1 表示合併了高氯酸中毒，酮酸其實在退', '停 insulin', '加快輸液'], a: 1, why: '(AG − 12)/(24 − HCO₃)：≈1 單純高 AG、<1 併正常 AG 酸中毒、>1 併代謝性鹼中毒（ICU 常見，利尿劑）。' },
    { q: '高 AG 酸中毒，乳酸與酮體都正常，下一步？', o: ['觀察', '算滲透壓間隙（≥10）找隱藏的酸：D-乳酸、草酸、甲酸、水楊酸、5-oxoproline', '給碳酸氫鹽', '洗腎'], a: 1, why: '計算滲透壓 2Na＋葡萄糖/18＋BUN/2.8 ≈ 290。D-乳酸（短腸症）與 5-oxoproline（長期 acetaminophen）要特別要求。' },
    { q: '傳統酸鹼架構的問題？', o: ['沒有問題', 'HCO₃ 幾乎就是血中的 CO₂、難有獨立身分；且它在生理 pH 不是緩衝劑——H⁺ 其實由血漿蛋白的陰離子電荷決定（Stewart）', 'PCO₂ 量不準', '只適用於動脈血'], a: 1, why: '「尋求簡單，並且不信任它。」' }
  ]);
  I.renderQuiz('qz_lac', 'acidbase-lac', [
    { q: '乳酸是酸嗎？', o: ['是，糖解的終產物', '不是：終產物是乳酸陰離子，產生它的反應消耗 H⁺；高乳酸可以沒有酸中毒', '只在無氧時是', '只有 D 型是'], a: 1, why: 'H⁺ 來自糖解產生的 2 ATP 水解。乳酸是燃料：壓力下心 60%、腦 30% 的能量。' },
    { q: '敗血性休克乳酸升高的機轉？', o: ['組織缺氧', '丙酮酸生產增加＋粒線體氧利用缺陷（PDH 抑制、細胞病性缺氧），組織氧合甚至升高', '肝臟不清', '紅血球'], a: 1, why: '壓力性高乳酸：2–5、L:P 正常、pH 正常。嚴重敗血症 L:P 升、pH 降。' },
    { q: '不明原因乳酸酸中毒一律要想？', o: ['肺栓塞', 'Thiamine 缺乏（PDH 輔因子）——可極嚴重，直接補', '甲狀腺', '腎上腺'], a: 1, why: '濕性腳氣病、Wernicke、周邊神經病變、乳酸酸中毒。300 多種藥物也會：metformin（腎功能不全、洗腎）、linezolid、抗反轉錄病毒、propofol、epinephrine。' },
    { q: '碳酸氫鹽為什麼不是好緩衝劑？', o: ['太貴', 'pK 6.1、有效範圍 5.1–7.1 不含生理 pH；它是 CO₂ 運輸的終產物，輸注生成 CO₂ 讓細胞內更酸、還升乳酸', '會低血鉀', '只對呼吸性有效'], a: 1, why: '多數專家仍建議 pH ≤7.1 或 HCO₃ ≤5 時用；作者只給需升壓劑者。缺口 0.6 × 體重 × (15 − HCO₃)，先補一半。' },
    { q: '酒精性酮酸中毒 nitroprusside 試驗為什麼可陰性？', o: ['沒有酮體', 'NADH 讓 acetoacetate 轉成 β-hydroxybutyrate（8:1），試劑只測 acetoacetate（要 ≥3）', '酒精干擾', '尿太稀'], a: 1, why: 'AKA 總酮酸 13 仍陰性；用 β-OHB 儀器（ADA 首選）。治療只要含葡萄糖的食鹽水＋thiamine，24 小時內解；排除胰臟炎。' },
    { q: 'DKA 初始 K 3.0，該？', o: ['開 insulin', '停 insulin、K 40 mEq/hr 到 >3.3——低鉀代表嚴重耗竭', '給碳酸氫鹽', '補磷'], a: 1, why: '缺口 3–5 mEq/kg 但 96% 初始正常或偏高。3.3–4：20/hr；4–5.5：10/hr；>5.5 每 2 小時驗。磷 <1 才補；碳酸氫鹽不常規；平衡液優於食鹽水。' }
  ]);
  I.renderQuiz('qz_alk', 'acidbase-alk', [
    { q: '住院病人最常見的酸鹼失衡？', o: ['代謝性酸中毒', '代謝性鹼中毒（HCO₃ >30）：誘因多、自我維持、常被忽略', '呼吸性酸中毒', '呼吸性鹼中毒'], a: 1, why: '腎每天濾 4,000–4,500 mEq HCO₃ 全部回收；pendrin 在鹼中毒上調排 HCO₃，缺氯把它抑制掉。' },
    { q: '「收縮性鹼中毒」為什麼是誤稱？', o: ['因為沒有收縮', '問題是氯缺乏（升 HCO₃ 再吸收、抑制 pendrin 分泌），不是自由水少', '應該叫稀釋性', '因為都是嘔吐'], a: 1, why: '低血容還經 GFR 降（濾出 HCO₃ 少）與 RAAS→醛固酮（K 流失、H⁺ 分泌）維持鹼中毒。' },
    { q: 'HCO₃ 要升多少 PaCO₂ 才 >46？', o: ['2', '近 10（+40%）；>50 要嚴重鹼中毒', '20', '任何上升'], a: 1, why: 'ΔPaCO₂ ＝ 0.7 × ΔHCO₃；化學受體易開難關。多數無症狀，HCO₃ 151 的病例都穩定。' },
    { q: '70 kg、Cl 80 的嘔吐病人要多少食鹽水？', o: ['0.5 L', '氯缺口 280 mEq → 1.8 L，速率流失＋100 mL/hr', '5 L', '不需要'], a: 1, why: '0.2 × 70 × 20 ＝ 280；/154 ＝ 1.8。補鉀前先驗鎂。' },
    { q: '心衰竭利尿劑造成的鹼中毒該？', o: ['灌食鹽水', 'KCl＋acetazolamide 250–375 mg（抑制近曲小管 HCO₃ 再吸收、兼利尿），不灌食鹽水', 'HCl', '停利尿劑'], a: 1, why: '尿氯 >20 的氯抗性型是原發性高醛固酮、甘草、外源性礦物皮質素；ECV 不定的是鉀鎂耗竭。' },
    { q: 'HCl 輸注的條件與風險？', o: ['任何鹼中毒', 'HCO₃ >50 或 pH >7.55 且 KCl 與 acetazolamide 無效；0.1N 經大中央靜脈、≤0.2 mEq/kg/hr；外滲嚴重壞死', 'pH >7.45', '只能周邊給'], a: 1, why: 'H⁺ 缺口 0.5 × 體重 × (HCO₃ − 24)；pH <7.5 就停。氯是「電解質女王」。' }
  ]);
})();
