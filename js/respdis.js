/* ICU Book · Section VIII 呼吸疾患 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 22–24（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }
  function ibw(cm, sex) { if (na(cm)) return NaN; var inch = cm / 2.54; return (sex === 'f' ? 45.5 : 50) + 2.3 * (inch - 60); }

  /* ================= Ch22 ================= */
  I.bindCalc('c22hep', function () {
    var wt = num('hp_w'), ht = num('hp_h'), sex = val('hp_sex');
    var ib = ibw(ht, sex), bmi = wt / Math.pow(ht / 100, 2), adj = ib + 0.4 * (wt - ib);
    var use = (!na(bmi) && bmi >= 40 && !na(adj)) ? adj : wt;
    var h = row('IBW', na(ib) ? '—' : fmt(ib, 0), 'kg', 'fl-na', na(ht) ? '填身高' : (sex === 'f' ? '45.5' : '50') + ' ＋ 2.3 × (吋 − 60)');
    h += row('BMI', na(bmi) ? '—' : fmt(bmi, 1), 'kg/m²', na(bmi) ? 'fl-na' : bmi >= 40 ? 'fl-warn' : 'fl-ok', na(bmi) ? '' : bmi >= 40 ? '≥40：用校正體重' : '用實際體重', !na(adj) ? '校正體重 ' + fmt(adj, 0) + ' kg ＝ IBW ＋ 0.4 × (實際 − IBW)' : '');
    h += row('UFH bolus', fmt(use * 80, 0), 'U', 'fl-na', '80 U/kg', '依 ' + fmt(use, 0) + ' kg');
    h += row('UFH 輸注', fmt(use * 18, 0), 'U/hr', 'fl-na', '18 U/kg/hr', '6 小時查 PTT，目標 46–70 秒（1.5–2.5 倍）');
    h += '<div class="rx-flag">高風險 PE 用 UFH 依體重給（比固定劑量更快達標）；溶栓期間可繼續，溶栓後更該給——血塊溶解釋出凝血酶會再閉塞。體重 >130 kg 的原始公式會過量抗凝，BMI ≥40 用校正體重。</div>' + '<div class="note">原書表 22.3 的 UFH 劑量列在抽出時被截斷，本頁用 Raschke 1993 依體重列線圖（80 U/kg → 18 U/kg/hr）。</div>';
    document.getElementById('c22hep_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c22lys', function () {
    var wt = num('ly_w'), col = val('ly_c') === 'y';
    var acc = Math.min(wt * 0.6, 50);
    var h = row(col ? 'Alteplase 加速方案' : 'Alteplase 標準方案', col ? fmt(acc, 0) : '100', col ? 'mg / 15 分' : 'mg / 2 小時', col ? 'fl-hot' : 'fl-warn', col ? '0.6 mg/kg，上限 50' : '高風險且不穩定', col ? '即將或已經循環崩潰' : '');
    h += row('全身溶栓大出血', '10–12', '%', 'fl-warn', '顱內出血 1–2%', '把效益抵掉');
    h += row('效益時窗', '48', '小時', 'fl-na', '症狀開始起', '越早越好');
    h += '<div class="rx-flag"><b>絕對禁忌</b>：活動性出血、出血性中風史、6 個月內缺血性中風、CNS 腫瘤、3 週內大創傷／手術／頭部外傷。導管內溶栓劑量低、大出血少、對 PA 壓的效果相當，但要介入放射。機械取栓對 PA 壓與 RV 的改善遠大於溶栓、可維持 3 個月——目前是溶栓失敗或禁忌的救援，有的話可直接取代。</div>';
    document.getElementById('c22lys_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c22ac', function () {
    var crcl = num('ac_cr'), wt = num('ac_w'), risk = val('ac_r');
    var h = '';
    if (risk === 'int') { h += row('觀察期抗凝', fmt(wt, 0), 'mg enoxaparin q12h', 'fl-na', '1 mg/kg', '住院觀察 24–48 小時看有無惡化'); }
    if (na(crcl) || crcl > 30) {
      h += row('Apixaban', '10 bid × 7 天 → 5 bid', 'mg', 'fl-ok', 'AMPLIFY', '起始劑量比一般高、出血不增');
      h += row('Rivaroxaban', '15 bid × 3 週 → 20 qd', 'mg', 'fl-ok', 'EINSTEIN-PE', '');
    } else {
      h += row('DOAC', '不建議', '', 'fl-hot', 'CrCl ≤30', '改 warfarin');
      h += row('橋接 enoxaparin', crcl >= 15 ? fmt(wt, 0) : '不建議', crcl >= 15 ? 'mg qd' : '', crcl >= 15 ? 'fl-warn' : 'fl-hot', crcl >= 15 ? '減量 1 mg/kg 一天一次，到 INR 達標（≥2–3 天）' : 'CrCl <15 連 enoxaparin 也不行', '');
    }
    h += '<div class="rx-flag">低風險 PE 診斷後盡快口服抗凝、DOAC 優於 warfarin；沒有低血氧等共病可直接從急診或病房出院。中風險：觀察期用 enoxaparin，未惡化再轉口服。抗凝的目的不是溶掉這顆，是防下一顆。</div>';
    document.getElementById('c22ac_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c22rad', function () {
    var n = num('rd_n') || 1, vq = num('rd_vq') || 0;
    var d = n * 15 + vq * 2;
    var h = row('累積劑量', fmt(d, 0), 'mSv', d >= 50 ? 'fl-hot' : d >= 15 ? 'fl-warn' : 'fl-ok', 'CTPA 每次 15、V/Q 每次 2', '≈ ' + fmt(d / 0.02, 0) + ' 張胸部 X 光（0.02 mSv）');
    h += row('占放射工作者年上限', fmt(d / 50 * 100, 0), '%', 'fl-na', '50 mSv/年');
    h += '<div class="rx-flag">CTPA 的另一個代價是顯影劑腎病變（腎功能不穩或 CrCl <30 盡量避免；必要時輸液＋N-acetylcysteine；顯影劑過敏史禁忌）。懷孕與哺乳優先考慮替代檢查。V/Q 只在 20–30% 有診斷價值（3/4 不確定），但不確定＋靜脈超音波陰性、且血行動力學穩定，可排除 PE。</div>';
    document.getElementById('c22rad_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch23 ================= */
  I.bindCalc('c23pefr', function () {
    var m = num('pf_m'), p = num('pf_p');
    var pct = m / p * 100;
    var h = row('% 預測值', fmt(pct, 0), '%', na(pct) ? 'fl-na' : pct < 40 ? 'fl-hot' : pct < 70 ? 'fl-warn' : 'fl-ok', na(pct) ? '' : pct < 25 ? '<25%：可能已 CO₂ 滯留' : pct < 40 ? '<40% 重度' : pct < 70 ? '40–69% 中度' : '≥70% 輕度', na(m) ? '' : m < 200 ? '<200 L/min ＝ 重度阻塞' : '');
    h += '<div class="rx-flag">PEFR 靠努力（吸到 TLC 再吐到 RV），急性發作時多半做不到，所以急性期不流行；喘緩解後可拿來追蹤。臨床徵象（心搏過速、呼吸急促、輔助肌、講不完整句、pulsus paradoxus >12 mmHg）對重度阻塞都不敏感也不專一。急性氣喘分鐘通氣量常倍增，<b>PaCO₂「正常」（42）就是 CO₂ 滯留</b>——該進 ICU。</div>';
    document.getElementById('c23pefr_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c23dep', function () {
    var dev = val('dp_d'), dose = num('dp_dose');
    var F = { neb: [0.12, '噴霧器：肺 12%、裝置 66%、呼出 20%、口咽 2%'], mdi: [0.09, 'MDI 直接噴：肺 9%、口咽 80%（噴速 >30 m/s 慣性撞擊）'], sp: [0.20, 'MDI＋spacer：肺 20%、裝置 78%'] }[dev];
    var h = row('到肺的劑量', fmt(dose * F[0] * 1000, 0), 'μg', 'fl-na', Math.round(F[0] * 100) + '% 的標示劑量', F[1]);
    h += '<div class="rx-flag">噴霧器 2.5 mg 與 MDI 4 噴（0.36 mg）擴張支氣管效果相同——換算到肺是 300 vs 72 μg，差 4 倍卻同效，原因不明。呼吸器上冷凝讓沉積更少（放慢吸氣流速、拉長吸氣有幫助），劑量不變。MDI＋spacer 劑量低副作用少，穩定後就換；急性發作偏好噴霧器（沒有證據更好）。</div>';
    document.getElementById('c23dep_out').innerHTML = I.wrap(h);
  });
  var ST = { hc: [20, 1, 20, 'Hydrocortisone'], pred: [5, 3.5, 1, 'Prednisone'], mp: [4, 5, 0.5, 'Methylprednisolone'], dex: [0.75, 30, 0, 'Dexamethasone'] };
  I.bindCalc('c23ster', function () {
    var from = val('st_f'), to = val('st_t'), d = num('st_d');
    var eq = d / ST[from][0] * ST[to][0];
    var h = row(ST[to][3] + ' 等效', fmt(eq, 1), 'mg', 'fl-na', '由 ' + fmt(d, 0) + ' mg ' + ST[from][3], '等效 hydrocortisone 20 ＝ prednisone 5 ＝ methylpred 4 ＝ dexamethasone 0.75');
    h += row('相對抗發炎', ST[to][1] + '', '×', 'fl-na', 'hydrocortisone ＝ 1', '礦物皮質活性 ' + ST[to][2]);
    h += '<div class="rx-flag">氣喘：40–80 mg/天 prednisone 或 methylprednisolone，口服＝IV，12 小時後才見效（急診看不到），沒有劑量反應（>100 mg prednisone 無益），10 天內可直接停不必漸減。COPD：prednisone 40 mg × 5 天（NNT 9、NNH 6）。Dexamethasone 抗發炎最強卻不建議用於氣喘——類固醇在氣喘的機轉可能不只是抗發炎。</div>';
    document.getElementById('c23ster_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c23ket', function () {
    var wt = num('kt_w'), conc = num('kt_c') || 1;
    var h = row('Ketamine 負荷', fmt(wt * 0.1, 0) + '–' + fmt(wt * 0.2, 0), 'mg IV', 'fl-na', '0.1–0.2 mg/kg');
    h += row('輸注', fmt(wt * 0.15, 1) + '–' + fmt(wt * 0.25, 1), 'mg/hr', 'fl-na', '0.15–0.25 mg/kg/hr × 1–5 小時', '≈ ' + fmt(wt * 0.15 / conc, 1) + '–' + fmt(wt * 0.25 / conc, 1) + ' mL/hr（' + conc + ' mg/mL）');
    h += row('MgSO₄', '2', 'g / 15–30 分', 'fl-na', '鈣通道阻斷的輕度擴張', 'albuterol＋ipratropium＋類固醇不夠時；吸入型不建議');
    h += '<div class="rx-flag">鎮靜降呼吸速率就能減少氣體滯留；ketamine 另有支氣管擴張。副作用：躁動不安、幻覺、分泌物增加。低血氧：SaO₂ ≥90 即可；急性氣喘吸氣流速可 >60 L/min，一般給氧 15 L/min 不夠 → 高流量鼻導管 40–60 L/min。</div>';
    document.getElementById('c23ket_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c23vent', function () {
    var rr = num('vt_rr'), ti = num('vt_ti'), vt = num('vt_vt'), ht = num('vt_h'), sex = val('vt_sex');
    var cyc = 60 / rr, te = cyc - ti, frac = ti / cyc, pbw = ibw(ht, sex), mlkg = vt / pbw;
    var h = row('呼吸週期', fmt(cyc, 2), '秒', 'fl-na', '60 / RR');
    h += row('吸氣占比', fmt(frac * 100, 0), '%', na(frac) ? 'fl-na' : frac <= 34 ? 'fl-ok' : 'fl-warn', na(frac) ? '' : frac <= 34 ? '≤1/3：吐氣時間夠' : '>1/3：拉高吸氣流速或降速率', '吐氣 ' + fmt(te, 2) + ' 秒');
    h += row('潮氣量', na(mlkg) ? '—' : fmt(mlkg, 1), 'mL/kg PBW', na(mlkg) ? 'fl-na' : mlkg > 8 ? 'fl-hot' : 'fl-ok', na(mlkg) ? '填身高性別' : mlkg > 8 ? '>8：加重動態過度充氣' : '6–8 mL/kg', na(pbw) ? '' : 'PBW ' + fmt(pbw, 0) + ' kg');
    h += '<div class="rx-flag">動態過度充氣：吐不完就吸 → 內生性 PEEP → 在較平的壓力容積曲線上呼吸、呼吸功增加；正壓通氣從更高的壓力起跳，大潮氣量或快速率再加重 → 氣壓傷、靜脈回流受阻。流量波形在下一次吹氣前還有吐氣流量就是證據；嚴重度看內生性 PEEP（第 28 章）。對策：VT 6–8 mL/kg、鎮靜降速率、拉高吸氣流速。</div>';
    document.getElementById('c23vent_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch24 ================= */
  I.bindCalc('c24pf', function () {
    var pa = num('pf_pa'), fi = num('pf_fi'), peep = num('pf_peep'), hrs = num('pf_hr');
    var f = fi > 1 ? fi / 100 : fi, pf = pa / f;
    var sev = na(pf) ? '' : pf > 300 ? '不符 ARDS' : pf > 200 ? '輕度' : pf >= 100 ? '中度' : '重度';
    var mort = na(pf) ? '' : pf > 300 ? '' : pf > 200 ? '院內死亡約 35%' : pf >= 100 ? '約 40%' : '約 45%';
    var h = row('PaO₂/FIO₂', fmt(pf, 0), 'mmHg', na(pf) ? 'fl-na' : pf > 300 ? 'fl-ok' : pf > 200 ? 'fl-warn' : 'fl-hot', sev, mort + (na(peep) ? '' : peep < 5 ? ' · PEEP <5，不符定義' : ''));
    h += row('俯臥適應症', na(pf) ? '—' : (pf < 150 && f >= 0.6 && peep >= 5) ? '符合' : '不符', '', na(pf) ? 'fl-na' : (pf < 150 && f >= 0.6 && peep >= 5) ? 'fl-hot' : 'fl-na', 'P/F <150 且 FIO₂ ≥60% 且 PEEP ≥5', '插管且 VT ~6 mL/kg 時有存活效益');
    h += row('ECMO 門檻', na(pf) ? '—' : (pf < 50 && hrs >= 3) ? '符合' : (pf < 80 && hrs >= 6) ? '符合' : '不符', '', na(pf) ? 'fl-na' : ((pf < 50 && hrs >= 3) || (pf < 80 && hrs >= 6)) ? 'fl-hot' : 'fl-na', '<80 持續 ≥6 小時 或 <50 持續 ≥3 小時', '10–15% 的 ARDS 對呼吸器＋俯臥無效');
    h += row('類固醇適應症', na(pf) ? '—' : (pf < 200 && peep >= 10) ? '符合（弱建議）' : '不符', '', 'fl-na', 'P/F <200 且 PEEP 10', '中重度 ARDS 前 14 天');
    h += '<div class="rx-flag">Berlin：7 天內急性、雙側浸潤、P/F ≤300 且 PEEP ≥5、非左心衰竭或過載、有誘因。診斷錯誤（過與不及）達 50%：胸片典型只 15–25%、對 CT 的陰性預測值 47%（擲銅板）；屍檢只 50% 相符；wedge ≤18 不能排除靜水壓性肺水腫。80% 在 48 小時內插管。</div>';
    document.getElementById('c24pf_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c24pbw', function () {
    var ht = num('pb_h'), sex = val('pb_sex'), vt = num('pb_vt');
    var pbw = ibw(ht, sex), mlkg = vt / pbw;
    var h = row('預測體重 PBW', fmt(pbw, 1), 'kg', 'fl-na', (sex === 'f' ? '45.5' : '50') + ' ＋ 2.3 × (吋 − 60)', '正常肺容積對應的體重');
    h += row('起始 VT（8 mL/kg）', fmt(pbw * 8, 0), 'mL', 'fl-na', '→ 目標 6 mL/kg ＝ ' + fmt(pbw * 6, 0) + ' mL');
    h += row('目前 VT', na(mlkg) ? '—' : fmt(mlkg, 1), 'mL/kg PBW', na(mlkg) ? 'fl-na' : mlkg > 8 ? 'fl-hot' : mlkg > 6.5 ? 'fl-warn' : 'fl-ok', na(mlkg) ? '選填' : mlkg > 9.5 ? '≥9.5：NIV 失敗的型態、P-SILI' : mlkg > 8 ? '>8：傳統大潮氣量' : mlkg > 6.5 ? '往 6 靠' : '達標');
    h += row('Methylprednisolone', fmt(pbw * 1, 0) + ' / ' + fmt(pbw * 2, 0), 'mg/天', 'fl-na', '1 mg/kg（72 小時內）／2 mg/kg（持續 7–14 天）', '連續輸注，14 天內慢慢減；用 IBW');
    h += '<div class="rx-flag">傳統 VT 12–15 mL/kg 是正常的兩倍，塞進只剩 50% 容量的肺 → 容積傷（不是壓力傷）。肺保護通氣是唯一有存活效益的通氣策略，但只有不到 2/3 的 ARDS 拿到 ≤8 mL/kg。</div>';
    document.getElementById('c24pbw_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c24vent', function () {
    var ppl = num('vn_ppl'), ph = num('vn_ph'), pco2 = num('vn_pco2'), spo2 = num('vn_spo2');
    var h = row('平台壓', na(ppl) ? '—' : fmt(ppl, 0), 'cmH₂O', na(ppl) ? 'fl-na' : ppl <= 30 ? 'fl-ok' : 'fl-hot', na(ppl) ? '' : ppl <= 30 ? '≤30 達標' : '>30：肺泡破裂風險，降 VT', '≈ 肺泡峰壓');
    h += row('pH', na(ph) ? '—' : fmt(ph, 2), '', na(ph) ? 'fl-na' : (ph >= 7.30 && ph <= 7.45) ? 'fl-ok' : ph >= 7.20 ? 'fl-warn' : 'fl-hot', na(ph) ? '' : (ph >= 7.30 && ph <= 7.45) ? '目標 7.30–7.45' : ph >= 7.20 ? '7.20–7.30：允許性高碳酸多數安全' : '<7.20：超出耐受', '');
    h += row('PaCO₂', na(pco2) ? '—' : fmt(pco2, 0), 'mmHg', na(pco2) ? 'fl-na' : pco2 <= 70 ? 'fl-ok' : 'fl-warn', na(pco2) ? '' : pco2 <= 70 ? '60–70 可接受（無 CO₂ 麻醉）' : '>70 超出試驗範圍', '');
    h += row('SpO₂', na(spo2) ? '—' : fmt(spo2, 0), '%', na(spo2) ? 'fl-na' : (spo2 >= 88 && spo2 <= 95) ? 'fl-ok' : 'fl-warn', na(spo2) ? '' : (spo2 >= 88 && spo2 <= 95) ? '目標 88–95' : spo2 > 95 ? '偏高：降 FIO₂（氧毒性）' : '偏低', '用最低的 FIO₂');
    h += '<div class="rx-flag">PEEP 5 防小氣道週期性開合的剪力傷（atelectrauma）；大容積通氣還會釋放細胞激素到全身（biotrauma）→ 呼吸器本身是多器官衰竭的來源。APRV：高壓＝上一次平台壓（≤30）、低壓 5；縮短呼吸器天數但無存活效益。FIO₂ ≥70% 久了就是氧毒性——與 ARDS 病理相同，惡化可能是氧造成的。</div>';
    document.getElementById('c24vent_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c24niv', function () {
    var pf0 = num('nv_0'), pf1 = num('nv_1'), vt = num('nv_vt'), eff = val('nv_eff') === 'y';
    var d = pf1 - pf0;
    var h = row('1 小時 P/F 變化', na(d) ? '—' : (d > 0 ? '+' : '') + fmt(d, 0), 'mmHg', na(d) ? 'fl-na' : d > 0 ? 'fl-ok' : 'fl-hot', na(d) ? '' : d > 0 ? '有改善' : '未改善：考慮插管', '');
    h += row('潮氣量', na(vt) ? '—' : fmt(vt, 1), 'mL/kg PBW', na(vt) ? 'fl-na' : vt >= 9.5 ? 'fl-hot' : 'fl-ok', na(vt) ? '選填' : vt >= 9.5 ? '≥9.5：NIV 失敗者的典型' : '<9.5', '');
    var rec = (!na(d) && d <= 0) || (!na(vt) && vt >= 9.5) || eff ? '<b>P/F 沒改善、VT ≥9.5 或仍用力呼吸 → 早插管而非晚</b>：P-SILI（大負壓 → 負壓性肺水腫、大 VT → 容積傷）會把肺越弄越壞；NIV 失敗者死亡率高很多。' : 'NIV 在輕度 ARDS（P/F 201–300）最能避免插管。';
    h += '<div class="rx-flag">' + rec + ' 一般給氧不夠先試高流量鼻導管（40–60 L/min、可獨立調 FIO₂）：呼吸舒服 → 減少 P-SILI；COVID 研究插管較少但死亡率無差。</div>';
    document.getElementById('c24niv_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch22 PE 分層與處置 */
  var pe = { hd: null, rv: null, ci: null };
  window.pePick = function (k, v, btn) { flowSelect(btn); pe[k] = v; peRender(); };
  function peRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (pe.hd === 'yes') {
      if (pe.ci === 'no') { cls = 'rec-urgent'; t = '高風險（massive）PE：UFH 依體重＋全身溶栓，不行就導管溶栓或機械取栓'; d = '<li>Alteplase 100 mg/2 小時；即將崩潰 0.6 mg/kg/15 分（≤50 mg）。效益 48 小時內最大。</li><li>UFH 依體重（BMI ≥40 用校正體重）、PTT 46–70，溶栓期間繼續。</li><li>血行動力學：輸液 ≤500 mL 且用超音波導引（RV 過載會把中隔推向左）；CVP 4–6 在右心衰竭代表低血容；低血壓用 <b>norepinephrine</b>（不升肺血管阻力）；dobutamine 是擴血管劑，低血壓時不單用。</li>'; }
      else if (pe.ci === 'yes') { cls = 'rec-urgent'; t = '高風險 PE 但溶栓禁忌：機械取栓（或導管溶栓），抗凝禁忌加 IVC 濾器'; d = '<li>取栓對 PA 壓與 RV 功能的改善遠大於溶栓、維持 3 個月。</li><li>IVC 濾器：DVT／PE 且抗凝絕對禁忌，或治療中仍發生 PE（來源在下肢／骨盆）。濾器後症狀性 PE 約 5%、致命併發症 <1%、幾乎不感染。</li>'; }
      else { cls = 'rec-elective'; t = '不穩定 ＝ 高風險：有沒有溶栓的絕對禁忌？'; d = '<li>活動性出血、出血性中風史、6 個月內缺血性中風、CNS 腫瘤、3 週內大創傷／手術／頭部外傷。</li>'; }
    } else if (pe.hd === 'no') {
      if (pe.rv === 'yes') { cls = 'rec-elective'; t = '中風險（submassive）PE：住院觀察 24–48 小時，enoxaparin 1 mg/kg q12h'; d = '<li>RV 功能障礙 ± troponin；未惡化再轉口服（apixaban／rivaroxaban）。</li><li>溶栓不是正式建議：減少失代償但增加大出血與顱內出血（PEITHO）；嚴重 RV 障礙或持續右心勞損時有人用。</li><li>血壓正常的右心勞損可考慮 dobutamine。</li>'; }
      else if (pe.rv === 'no') { cls = 'rec-blue'; t = '低風險 PE：盡快口服抗凝（DOAC），沒有共病可直接出院'; d = '<li>Apixaban 10 bid × 7 天 → 5 bid；rivaroxaban 15 bid × 3 週 → 20 qd。</li><li>CrCl ≤30：warfarin＋減量 enoxaparin 1 mg/kg qd 橋接（到 CrCl 15）。</li><li>單一亞段栓塞＋腿部無殘餘血栓＋無 RV 障礙＋無顯著共病 → 可不抗凝；多顆亞段不抗凝復發高。</li>'; }
      else { cls = 'rec-elective'; t = '穩定：有沒有 RV 功能障礙（超音波）？'; d = '<li>RV 擴大 ± troponin 升高是預後指標不是診斷指標；活動性右心血栓（2–18%）與 McConnell 徵象（20%）才專一。</li>'; }
    }
    if (pe.hd) n = '30–50% 的 PE 有近端 DVT，超音波陽性且穩定就不必再做影像；CTPA 陰性預測值 95%。';
    flowRec('pe_rec', cls, t, d, n);
  }
  window.peReset = function () { pe = { hd: null, rv: null, ci: null }; selAll('#pe_flow'); peRender(); };

  /* Ch23 氣喘／COPD 進 ICU */
  var ob = { dz: null, hc: null, bp: null };
  window.obPick = function (k, v, btn) { flowSelect(btn); ob[k] = v; obRender(); };
  function obRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    var base = ob.dz === 'asthma' ? '<li>Albuterol 2.5–5 mg（或 4–8 噴）q20 分 ×3 → 每小時或連續 5–15 mg/hr（最多 3 小時）→ 住院 q4–6h；ipratropium 0.5 mg q20 ×3 只用前 3–4 小時；prednisone／methylpred 40–80 mg/天（口服＝IV，12 小時見效）；不夠再 MgSO₄ 2 g、ketamine。</li>' : '<li>Albuterol 2.5–5 mg 或 2–8 噴 q4–6h（MDI 較宜）；prednisone 40 mg × 5 天；<b>ICU 收治者都給抗生素</b>（cefepime 類、5–7 天；H. influenzae、S. pneumoniae、呼吸器者 Pseudomonas）；找誘因：感染、隱藏的 PE（<10%）、左心衰竭。</li><li>氧氣目標 SaO₂ 88–92%（不是失去驅動，可能是 Haldane 效應）。</li>';
    if (ob.dz && ob.hc === 'no') { cls = 'rec-elective'; t = (ob.dz === 'asthma' ? '急性氣喘' : 'COPD 急性惡化') + '：支氣管擴張劑＋類固醇' + (ob.dz === 'copd' ? '＋抗生素' : '') + '，監測 PaCO₂'; d = base + '<li>氣喘：分鐘通氣量倍增下 PaCO₂ 42 就是滯留。</li>'; }
    else if (ob.dz && ob.hc === 'yes') {
      if (ob.bp === 'ok') { cls = 'rec-elective'; t = 'BiPAP 有效（' + (ob.dz === 'copd' ? '1 小時 PaCO₂ 降 ≥10' : 'PaCO₂ 下降') + '）：繼續 NIV＋藥物'; d = base; }
      else if (ob.bp === 'fail') { cls = 'rec-urgent'; t = 'BiPAP 失敗：插管，用防止動態過度充氣的策略'; d = base + '<li>VT 6–8 mL/kg PBW；鎮靜降速率；拉高吸氣流速讓吸氣只占 1/3 週期；看流量波形與內生性 PEEP。</li><li>高胸內壓 → 氣壓傷（氣胸）、靜脈回流受阻。</li>'; }
      else { cls = 'rec-elective'; t = '高碳酸血症：先試 BiPAP，' + (ob.dz === 'copd' ? '1 小時 PaCO₂ 沒降 10 mmHg' : 'PaCO₂ 沒降') + '就插管'; d = '<li>請回答第 3 步。</li>'; }
    } else if (ob.dz) { cls = 'rec-elective'; t = '有高碳酸血症嗎？'; d = '<li>請回答第 2 步。</li>'; }
    if (ob.dz) n = ob.dz === 'asthma' ? '需要呼吸器是氣喘死亡最強的危險因子。' : 'COPD 進 ICU：1/4 死於住院、40% 一年內再住院。';
    flowRec('ob_rec', cls, t, d, n);
  }
  window.obReset = function () { ob = { dz: null, hc: null, bp: null }; selAll('#ob_flow'); obRender(); };

  /* Ch24 ARDS 呼吸支持升階 */
  var ar = { tube: null, sev: null, resp: null };
  window.arPick = function (k, v, btn) { flowSelect(btn); ar[k] = v; arRender(); };
  function arRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ar.tube === 'no') {
      if (ar.resp === 'ok') { cls = 'rec-blue'; t = '未插管且有反應：HFNO／NIV ＋ 清醒俯臥每天 ≥8 小時（單次）'; d = '<li>清醒俯臥只在 HFNO 或 NIV 的病人減少插管（COVID 資料，無死亡率效益）。</li><li>限制 FIO₂（≥70% 久了是氧毒性）；每天看水平衡、正平衡用利尿劑，但別脫水。</li><li>COVID 需氧或通氣支持：dexamethasone 6 mg × ≤10 天。</li>'; }
      else if (ar.resp === 'fail') { cls = 'rec-urgent'; t = '1 小時 P/F 不升、VT ≥9.5 mL/kg 或仍用力呼吸：早插管'; d = '<li>P-SILI：大負壓與大 VT 會加重肺傷；NIV 失敗者死亡率高很多。</li>'; }
      else { cls = 'rec-elective'; t = '未插管：一般給氧不夠先 HFNO；NIV 在輕度最有用——1 小時後 P/F 有升嗎？'; d = '<li>請回答第 3 步。</li>'; }
    } else if (ar.tube === 'yes') {
      if (ar.sev === 'mild') { cls = 'rec-blue'; t = '插管、P/F ≥150：肺保護通氣'; d = '<li>PBW → VT 8 → 6 mL/kg、PEEP 5、最低 FIO₂ 達 SpO₂ 88–95、平台壓 ≤30、pH 7.30–7.45（允許 PaCO₂ 60–70、pH 7.2–7.25）。</li>'; }
      else if (ar.sev === 'mod') { cls = 'rec-urgent'; t = 'P/F <150（FIO₂ ≥60、PEEP ≥5）且 VT ~6：俯臥每天 ≥16 小時'; d = '<li>PROSEVA 存活效益；第一次就該看到 P/F 或順應性改善，改善持續 4 小時就不必再趴；沒反應就別再趴。</li><li>絕對禁忌：活動性出血、脊椎不穩定、（原表截斷）；相對：休克、懷孕、近期致命心律不整、胸管。升壓劑不是禁忌。</li><li>中重度（P/F <200、PEEP 10）：methylpred 1 mg/kg/天（72 小時內）或 2 mg/kg/天（持續 7–14 天），14 天內減量（弱建議）。</li>'; }
      else if (ar.sev === 'ref') { cls = 'rec-urgent'; t = '難治性低血氧（P/F <80 ≥6 小時或 <50 ≥3 小時）：VV-ECMO ＋ 肺保護通氣'; d = '<li>10–15% 的 ARDS；成功取決於可逆性（病毒性肺炎較有成績）。</li><li>別忘了 70% 的死亡是多器官衰竭不是呼吸衰竭——只盯著肺是失敗的處方。</li>'; }
      else { cls = 'rec-elective'; t = '插管：嚴重度？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (ar.tube) n = '肺保護通氣是唯一有存活效益的策略；呼吸器不是治療，是少傷一點。';
    flowRec('ar_rec', cls, t, d, n);
  }
  window.arReset = function () { ar = { tube: null, sev: null, resp: null }; selAll('#ar_flow'); arRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_pe', 'respdis-pe', [
    { q: 'PE 病人 PaO₂ 正常的比例？', o: ['0', '約 30%（低血氧的陰性預測值 70%）；A-a 差也可正常', '5%', '80%'], a: 1, why: '沒有一個臨床表現的陽性預測值超過 50%。屍檢 30% 有 PE 且多未被懷疑；懷疑的只有 10% 證實。' },
    { q: 'D-dimer 在 ICU 為什麼沒用？', o: ['敏感度太低', '80% 的 ICU 病人都升高（敗血症、發炎、心衰竭、腎衰竭、懷孕、高齡）', '需要 6 小時', '只對 DVT 有效'], a: 1, why: 'PPV 27%、NPV 92%：正常可排除、升高不代表高機率。' },
    { q: '疑 PE 的病人下肢超音波發現近端 DVT，接下來？', o: ['CTPA 確認', '穩定者不必再做影像，直接抗凝', 'V/Q 掃描', '等 D-dimer'], a: 1, why: '30–50% 的 PE 有近端 DVT；雙工超音波敏感 ≥95、專一 ≥97。上肢 DVT 症狀性 PE <10%，陽性要抗凝並拔導管。' },
    { q: 'CTPA 的輻射量相當於幾張胸部 X 光？', o: ['10', '約 750（15 mSv vs 0.02）', '50', '2,000'], a: 1, why: '放射工作者年上限 50 mSv；V/Q 只 2 mSv。CrCl <30 或腎功能不穩避免顯影劑。' },
    { q: '單一亞段栓塞可以不抗凝的條件？', o: ['一律不抗凝', '單顆＋腿部無殘餘血栓＋無 RV 障礙＋無顯著共病', '一律抗凝', '只看 D-dimer'], a: 1, why: '合併分析不抗凝不影響死亡與復發；但多顆亞段不抗凝復發高。' },
    { q: '高風險 PE 低血壓，升壓劑首選？', o: ['Dopamine', 'Norepinephrine（不升肺血管阻力）；dobutamine 是擴血管劑不單用', 'Epinephrine', 'Vasopressin'], a: 1, why: '輸液 ≤500 mL 且超音波導引（RV 過載推中隔）；CVP 4–6 在右心衰竭代表低血容。' },
    { q: '預防性 IVC 濾器的證據？', o: ['降 PE 60%、降 DVT', 'PE 減 60% 但 DVT 增 70%，淨效益存疑', '無效', '增加感染'], a: 1, why: '適應症：抗凝絕對禁忌、治療中仍 PE。濾器後 PE 5%、致命 <1%、從不感染；可回收型 2003、可降解型 60 天。' }
  ]);
  I.renderQuiz('qz_obst', 'respdis-obst', [
    { q: '急性氣喘 PaCO₂ 42 mmHg 代表？', o: ['正常', 'CO₂ 滯留（分鐘通氣量倍增下應該偏低）→ ICU', '過度通氣', '可以出院'], a: 1, why: '臨床徵象對重度阻塞不敏感不專一；PEFR <40% 重度、<25% 才高碳酸，但急性期做不到。' },
    { q: '噴霧器 2.5 mg 與 MDI＋spacer 4 噴，到肺的劑量？', o: ['相同', '300 vs 72 μg（12% vs 20%），效果卻相同', 'MDI 較多', '噴霧器 10 倍'], a: 1, why: 'MDI 直接噴 80% 撞在口咽。呼吸器上沉積更少但劑量不變。MDI＋spacer 劑量低副作用少，穩定就換。' },
    { q: '氣喘用類固醇，哪一項正確？', o: ['IV 優於口服', '口服＝IV、12 小時才見效、>100 mg prednisone 無益、10 天可直接停', '要 tapering', 'Dexamethasone 首選'], a: 1, why: '40–80 mg/天；dexamethasone 抗發炎最強卻不建議，機轉存疑。' },
    { q: 'Ipratropium 在急性氣喘的角色？', o: ['主角', '只在重度發作前 3–4 小時併用，住院後停', '長期維持', '取代 albuterol'], a: 1, why: '0.5 mg q20 ×3 或 8 噴；全身吸收極少。COPD 併用也有 3 篇研究不支持。' },
    { q: 'COPD 急性惡化的氧氣目標？', o: ['SaO₂ ≥95', 'SaO₂ 88–92%，不要更高', '100%', '不給氧'], a: 1, why: '高濃度氧升 PaCO₂ 不是失去驅動（驅動沒降），可能是 Haldane 效應。BiPAP 1 小時 PaCO₂ 沒降 10 就插管。' },
    { q: 'COPD 惡化用類固醇的 NNT／NNH？', o: ['3／30', '9／6——但副作用（高血糖）比治療失敗輕，仍划算', '20／2', '無效'], a: 1, why: 'Prednisone 40 mg × 5 天，IV 無優勢。ICU 收治者都給抗生素 5–7 天（只 50% 是細菌）。' },
    { q: '呼吸器上減少動態過度充氣的做法？', o: ['大 VT、快速率', 'VT 6–8 mL/kg、鎮靜降速率、拉高吸氣流速讓吸氣占 1/3', '加 PEEP 15', '延長吸氣'], a: 1, why: '吐氣末仍有流量＝過度充氣；高胸內壓 → 氣胸、靜脈回流受阻。' }
  ]);
  I.renderQuiz('qz_ards', 'respdis-ards', [
    { q: 'ARDS 最常見的誘因？', o: ['創傷', '肺炎（60%），其次腸胃內容物吸入 14%、肺外敗血症 16%', '輸血', '胰臟炎'], a: 1, why: '共同機轉是中性球活化；10% 找不到來源。COVID 是特殊型（順應性常保留），研究結果不一定能推廣。' },
    { q: '胸部 X 光對 ARDS 的陰性預測值？', o: ['95%', '47%（對 CT）——擲銅板', '80%', '100%'], a: 1, why: '典型瀰漫毛玻璃只 15–25%；屍檢 50% 相符；wedge ≤18 不能排除靜水壓性肺水腫（wedge 低於微血管壓）。' },
    { q: 'P-SILI 是什麼？', o: ['呼吸器造成的損傷', '用力呼吸的大負壓（負壓性肺水腫）與大 VT（容積傷）造成的自我肺傷', '氧毒性', '俯臥的併發症'], a: 1, why: '所以持續用力呼吸者要早插管；HFNO 讓呼吸舒服可減少它；NIV 失敗者 VT ≥9.5 mL/kg。' },
    { q: '肺保護通氣的目標？', o: ['VT 10 mL/kg 實際體重', 'VT 6 mL/kg PBW、平台壓 ≤30、PEEP 5、SpO₂ 88–95、pH 7.30–7.45', 'VT 12–15 mL/kg', 'PEEP 0'], a: 1, why: '容積傷不是壓力傷；PEEP 防 atelectrauma；大容積通氣的細胞激素造成 biotrauma → 多器官衰竭。唯一有存活效益的策略，但不到 2/3 的病人拿到 ≤8。' },
    { q: '允許性高碳酸的安全範圍？', o: ['PaCO₂ 45、pH 7.35', 'PaCO₂ 60–70、pH 7.2–7.25 多數安全（無 CO₂ 麻醉）', 'PaCO₂ 100', '不允許'], a: 1, why: '協定目標 pH 7.30–7.45。' },
    { q: '插管的 ARDS 俯臥有存活效益的條件？', o: ['所有 ARDS', 'P/F <150、FIO₂ ≥60%、PEEP ≥5，且 VT ~6 mL/kg；每天 ≥16 小時', '只有 COVID', 'P/F >200'], a: 1, why: '第一次就該有反應、持續 4 小時就不必再趴。清醒俯臥 ≥8 小時只在 HFNO／NIV 減少插管、無死亡率效益。' },
    { q: 'ARDS 的主要死因？', o: ['難治性低血氧', '多器官衰竭（達 70%），死亡率隨衰竭器官數上升', '氣胸', '肺栓塞'], a: 1, why: '呼吸器不是治療，只是少傷一點；ECMO 留給 P/F <80 ≥6 小時或 <50 ≥3 小時的 10–15%。' }
  ]);
})();
