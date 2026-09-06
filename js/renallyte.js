/* ICU Book · Section XI 腎臟與電解質 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 34–38（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch34 ================= */
  I.bindCalc('c34kdigo', function () {
    var base = num('kd_b'), cur = num('kd_c'), uo = num('kd_uo'), hrs = num('kd_h');
    var ratio = cur / base, delta = cur - base;
    var stage = na(ratio) ? 0 : (ratio >= 3 || cur >= 4) ? 3 : ratio >= 2 ? 2 : (ratio >= 1.5 || delta >= 0.3) ? 1 : 0;
    var olig = !na(uo) && uo < 0.5 && !na(hrs) && hrs >= 6;
    var h = row('肌酸酐變化', na(ratio) ? '—' : '×' + fmt(ratio, 2) + '（+' + fmt(delta, 2) + '）', '', na(ratio) ? 'fl-na' : stage ? 'fl-warn' : 'fl-ok', na(ratio) ? '' : stage ? '符合 AKI（48 小時內 +0.3 或 7 天內 ×1.5）' : '未達診斷', 'KDIGO 分期 ' + (stage || '—') + '（1：×1.5–1.9 或 +0.3；2：×2–2.9；3：×3、≥4 或 RRT）');
    h += row('尿量', na(uo) ? '—' : fmt(uo, 2), 'mL/kg/hr', na(uo) ? 'fl-na' : olig ? 'fl-warn' : uo < 0.5 ? 'fl-na' : 'fl-ok', na(uo) ? '選填' : olig ? '<0.5 持續 ≥6 小時：符合' : uo < 0.5 ? '<0.5 但未滿 6 小時' : '≥0.5', '寡尿可能是對低灌流的適當調整，不一定是「損傷」');
    h += '<div class="rx-flag">ICU 60% 有 AKI、15% 需 RRT、死亡可達 60%。肌酸酐的限制：來自肌肉（重症每天掉 2% 肌肉、敗血症肌酸生成減少）、受血漿量影響、還有腎小管分泌——重症以肌酸酐估 GFR 一律高估；cystatin C 不受肌肉影響但常低估，兩者合併最準但太複雜。持續幾天叫急性腎臟病、≥90 天叫慢性腎臟病。</div>';
    document.getElementById('c34kdigo_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c34press', function () {
    var map = num('pr_map'), cvp = num('pr_cvp'), iap = num('pr_iap');
    var fg = map - cvp, app = map - iap, fgIap = map - 2 * iap;
    var h = row('腎絲球灌流壓', na(fg) ? '—' : fmt(fg, 0), 'mmHg', 'fl-na', 'MAP − 靜脈壓', '靜脈壓（CVP）升高一樣降 GFR——心腎症候群的主角');
    if (!na(iap)) {
      h += row('腹內壓', fmt(iap, 0), 'mmHg', iap > 20 ? 'fl-hot' : iap >= 12 ? 'fl-warn' : 'fl-ok', iap > 20 ? '>20 併器官失能＝腹腔腔室症候群' : iap >= 12 ? '≥12 腹內高壓' : '正常 5–7', '膀胱壓：仰臥、腋中線歸零、注 25 mL、呼氣末、無腹肌收縮；mmHg 不是 cmH₂O');
      h += row('腹部灌流壓', fmt(app, 0), 'mmHg', app > 60 ? 'fl-ok' : 'fl-hot', app > 60 ? '>60 結局較好' : '≤60', 'MAP − IAP');
      h += row('過濾梯度', fmt(fgIap, 0), 'mmHg', fgIap > 0 ? 'fl-na' : 'fl-hot', 'MAP − 2 × IAP', 'IAP 升 1 的殺傷力是 MAP 降 1 的兩倍——寡尿是 ACS 最早的徵象');
    }
    h += '<div class="rx-flag">過濾梯度 ＝ (MAP − Pv) − 近曲小管壓：MAP 降、靜脈壓升、小管壓升（ATN 脫落細胞塞住 → 管球回饋）都降 GFR。IAH 在內外科 ICU 達 60%：胃脹、腸阻塞、腹水、腸壁水腫、正壓通氣、肥胖；24 小時正平衡 >5 L 者 85% IAH、25% ACS。理學檢查測不出，一定要量。</div>';
    document.getElementById('c34press_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c34fe', function () {
    var una = num('fe_una'), pna = num('fe_pna'), ucr = num('fe_ucr'), pcr = num('fe_pcr'), uur = num('fe_uur'), bun = num('fe_bun'), diur = val('fe_d') === 'y';
    var fena = (una / pna) / (ucr / pcr) * 100, feu = (uur / bun) / (ucr / pcr) * 100;
    var h = row('尿鈉', na(una) ? '—' : fmt(una, 0), 'mEq/L', na(una) ? 'fl-na' : una < 20 ? 'fl-warn' : una > 40 ? 'fl-hot' : 'fl-na', na(una) ? '' : una < 20 ? '<20：腎低灌流' : una > 40 ? '>40：腎小管損傷' : '灰色帶', diur ? '利尿劑與慢性腎病會假性升高' : '');
    h += row('FENa', na(fena) ? '—' : fmt(fena, 1), '%', na(fena) ? 'fl-na' : fena < 1 ? 'fl-warn' : fena > 2 ? 'fl-hot' : 'fl-na', na(fena) ? '' : fena < 1 ? '<1：保鈉、低灌流' : fena > 2 ? '>2：小管損傷' : '灰色帶', '敗血症與肌紅蛋白尿的 ATN 也可假性 <1');
    h += row('FEUrea', na(feu) ? '—' : fmt(feu, 0), '%', na(feu) ? 'fl-na' : feu < 35 ? 'fl-warn' : feu > 50 ? 'fl-hot' : 'fl-na', na(feu) ? '選填尿素' : feu < 35 ? '<35：低灌流' : feu > 50 ? '>50：小管損傷' : '灰色帶', '不受利尿劑影響——正在用利尿劑時用它');
    h += '<div class="rx-flag">尿滲透壓 >500、U/P >1.5 偏低灌流；300–400、1–1.3 偏小管損傷。床邊超音波先看小腎（慢性）與水腎（阻塞——尿有感染要緊急引流）。生物標記不普及。</div>';
    document.getElementById('c34fe_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c34rhab', function () {
    var wt = num('rh_w'), myo = num('rh_m'), uo = num('rh_uo');
    var h = row('初始等張食鹽水', fmt(wt * 10, 0) + '–' + fmt(wt * 20, 0), 'mL', 'fl-na', '10–20 mL/kg', '之後維持尿量');
    h += row('目標尿量', fmt(wt, 0), 'mL/hr', na(uo) ? 'fl-na' : uo >= wt ? 'fl-ok' : 'fl-warn', na(uo) ? '≥1 mL/kg/hr' : uo >= wt ? '達標' : '未達：幾小時仍寡尿就放棄灌水，防過載', '');
    h += row('尿肌紅蛋白', na(myo) ? '—' : fmt(myo, 0), 'μg/L', na(myo) ? 'fl-na' : myo > 20 ? 'fl-hot' : 'fl-ok', na(myo) ? '選填' : myo > 20 ? '>20 顯著肌紅蛋白尿（尿轉褐）' : '', '試紙潛血陽性、沉渣無紅血球＝肌紅蛋白');
    h += '<div class="rx-flag">受傷肌肉釋放肌酸讓肌酸酐上升，AKI 難判；CK 反映肌肉傷程度多於 AKI 風險——肌紅蛋白尿才是關鍵。尿液鹼化到 pH >6.5 難做又有碳酸氫鹽的問題；mannitol／furosemide 利尿與灌水目標矛盾。30% 需 RRT。多重創傷 30% 有 AKI、其中 30% 是橫紋肌溶解。</div>';
    document.getElementById('c34rhab_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch35 ================= */
  I.bindCalc('c35osm', function () {
    var naV = num('om_na'), glu = num('om_glu'), bun = num('om_bun');
    var tot = 2 * naV + glu / 18 + bun / 2.8, eff = 2 * naV + glu / 18, corr = naV + 2.4 * Math.max(glu - 100, 0) / 100;
    var h = row('總滲透壓', fmt(tot, 0), 'mOsm/kg', na(tot) ? 'fl-na' : (tot < 285 || tot > 295) ? 'fl-warn' : 'fl-ok', na(tot) ? '' : '正常 285–295', '2Na ＋ 葡萄糖/18 ＋ BUN/2.8');
    h += row('有效滲透壓', fmt(eff, 0), 'mOsm/kg', 'fl-na', '不含尿素（自由穿膜，高氮血症是高滲透不是高張）', '鈉占 98%');
    h += row('高血糖校正鈉', na(corr) ? '—' : fmt(corr, 0), 'mEq/L', na(corr) ? 'fl-na' : corr !== naV ? 'fl-warn' : 'fl-na', na(glu) ? '' : glu > 100 ? '每 100 mg/dL ＋2.4' : '血糖正常不需校正', '');
    h += '<div class="rx-flag">假性低血鈉：蛋白 ≥12 g/dL 或三酸甘油酯 ≥1,500 讓固相變多、機器算低（骨髓瘤、免疫球蛋白、DKA、胰臟炎、膽汁鬱積）——實測滲透壓正常（285–295）就是假的，真低血鈉 <275。</div>';
    document.getElementById('c35osm_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c35hyper', function () {
    var wt = num('hn_w'), sex = val('hn_sex'), naV = num('hn_na');
    var tbw = wt * (sex === 'f' ? 0.5 : 0.6), def = tbw * (naV / 140 - 1), hrs = (naV - 140) / 0.5;
    var h = row('自由水缺口', na(def) ? '—' : fmt(Math.max(def, 0), 1), 'L', 'fl-na', 'TBW × (Na/140 − 1)', 'TBW ' + fmt(tbw, 1) + ' L（' + (sex === 'f' ? '50' : '60') + '%）');
    h += row('矯正時間', na(hrs) ? '—' : '≥' + fmt(Math.max(hrs, 0), 0), '小時', 'fl-na', '傳統上限 0.5 mEq/L/hr', '超過 0.5 也有安全使用的報告');
    h += row('補什麼', '½NS 或 D5W', '', 'fl-na', '低張流失也丟鈉，½NS 比 D5W 合理', '管灌加水 200 mL q8h；等張食鹽水只矯正低血壓、矯正不了高血鈉');
    h += '<div class="rx-flag">ICU 高血鈉 25%、多為住院中獲得。低 ECV：低張流失（胃液 Na 60、腹瀉 75–90、利尿尿 80、汗 65）；正常 ECV：純水流失或尿崩（中樞：尿滲透壓常 <200、限水後不升 30 以上、vasopressin 後升 ≥50%；腎性 200–500、vasopressin 無反應；妊娠性 vasopressinase）；高 ECV：碳酸氫鈉或食鹽水灌太多（利尿尿 Na 80 <血漿，利尿會加重、要配 D5W）。腦細胞 9 小時起累積 osmolyte、48 小時恢復體積——太快補水會腦水腫。</div>' + '<div class="note">原書未給自由水缺口公式，此處用標準 TBW 公式（Adrogué–Madias）。</div>';
    document.getElementById('c35hyper_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c35hts', function () {
    var wt = num('ht_w'), naV = num('ht_na'), sym = val('ht_s') === 'y', risk = val('ht_r') === 'y';
    var bolus = Math.min(wt * 2, 150);
    var h = row('3% 食鹽水 bolus', na(bolus) ? '150' : fmt(bolus, 0), 'mL', sym ? 'fl-hot' : 'fl-na', sym ? '有腦病變症狀：立刻給、幾小時重複到症狀緩解' : '無症狀不需要快速矯正', '2 mL/kg 或 150 mL；Na 513 mEq/L、1,026 mOsm/L；周邊靜脈可給');
    h += row('每次可升', '≤2', 'mEq/L', 'fl-na', '升 5–6 應見改善', '沒改善就想別的原因');
    h += row('24 小時上限', '8–10', 'mEq/L', 'fl-na', '終點 130（留緩衝防過頭）', na(naV) ? '' : '今日目標 ≤' + fmt(Math.min(naV + 8, 130), 0));
    h += row('Desmopressin', risk ? '常規 2 μg SC' : '尿量驟增 >100 mL/hr 或超過上限時', '', risk ? 'fl-warn' : 'fl-na', risk ? '高風險（thiazide、腎上腺功能不全、原發性多飲）' : '', '用時必須限水');
    h += '<div class="rx-flag">腦病變（噁心嘔吐頭痛失調 → 躁動混亂癲癇昏迷）是立即威脅，與血鈉高低不相關——決定用 3% 的是症狀不是數字；急性（<48 小時）較常見。太快或過頭 → 滲透性脫髓鞘（雙相：先好轉再構音障礙、眼動、四肢癱、閉鎖）；慢性低血鈉風險更高。過度矯正達 25%：自發水利尿讓 ECV 縮、鈉濃縮。</div>';
    document.getElementById('c35hts_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch36 ================= */
  I.bindCalc('c36def', function () {
    var k = num('kd_k'), wt = num('kd_w'), mg = val('kd_mg') === 'y';
    var tbk = wt * 50, def = na(k) ? NaN : Math.max(3.5 - k, 0) * 0.1 * tbk;
    var h = row('總體鉀', fmt(tbk, 0), 'mEq', 'fl-na', '50 mEq/kg', '98% 在細胞內；血漿只有 0.4%');
    h += row('估計缺口', na(def) ? '—' : fmt(def, 0), 'mEq', na(def) ? 'fl-na' : def > 0 ? 'fl-warn' : 'fl-ok', na(k) ? '' : k >= 3.5 ? '無缺口（以 3.5 為基準）' : '每降 1 mEq/L 少 10% 總體鉀', '70 kg：3.0 → 175、2.5 → 350');
    h += row('補充速率', '20', 'mEq/hr', 'fl-na', '20 mEq 加 100 mL 食鹽水 1 小時', '嚴重可 40（用過到 100）；大中央靜脈較不刺激，但 >20/hr 別進上腔靜脈（心搏停止）');
    h += '<div class="rx-flag">' + (mg ? '<b>補鉀補不上 → 先補鎂</b>：缺鎂讓腎小管漏鉀，鎂補足前低鉀難矯正。' : '補不上時想鎂。') + ' 初期血鉀升得慢（曲線平段）。KCl 濃縮液 2 mEq/mL 是 4,000 mOsm/L 一定要稀釋；DKA 可用磷酸鉀（4.5 mEq K＋3 mmol P/mL）。<2.5 才瀰漫無力；ECG（U 波 >1 mm、T 平／倒、QT 長）50% 有但不專一；低鉀本身不致心律不整，只是放大其他原因的風險。先處理跨細胞移動（鹼中毒、β 促效劑、insulin、低溫）。</div>';
    document.getElementById('c36def_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c36hyper', function () {
    var k = num('hk_k'), ecg = val('hk_ecg') === 'y', uk = num('hk_uk'), units = num('hk_u') || 0, dig = val('hk_dig') === 'y';
    var severe = (!na(k) && k > 6.5) || ecg;
    var h = row('嚴重度', na(k) && !ecg ? '—' : severe ? '嚴重（>6.5 或 ECG 變化）' : '非嚴重', '', severe ? 'fl-hot' : 'fl-ok', severe ? '三步：穩心 → 推進細胞 → 排出' : '找原因、停藥、排出', 'ECG：T 尖（V2–V3）→ P 變小 PR 延長 → P 消失 QRS 變寬 → VF/asystole；血鉀與 ECG 不相關（>7 只 40% 有變化）');
    if (severe) {
      h += row('穩定心臟', '10% 葡萄糖酸鈣 10 mL / 3 分', '', 'fl-hot', '5 分後可重複；幾分鐘見效、30–60 分消退', dig ? 'Digitalis 中毒傳統禁忌，但回溯研究多無害' : '循環崩潰用 10% 氯化鈣（鈣是 3 倍：27 vs 9 mg/mL）');
      h += row('推進細胞', 'Regular insulin 10 U ＋ D50 50 mL', '', 'fl-warn', '降 ≥0.6，30–60 分高峰、暫時', '吸入 β2 要 4 倍治療劑量才降 0.5–1，不可單用；碳酸氫鈉無效（非酸中毒）且與鈣結合');
      h += row('排出', 'SZC 10 g tid × 48 h ／ 血液透析', '', 'fl-warn', '透析 1 小時降 1、3 小時降 2', 'SPS（Kayexalate）15 g q6h 或灌腸 30–50 g：效果不定、起效慢、腸壞死報告');
    }
    if (!na(uk)) h += row('尿鉀', fmt(uk, 0), 'mEq/L', uk < 30 ? 'fl-warn' : 'fl-na', uk < 30 ? '<30：腎排泄受損（腎病、慢性腎上腺功能不全、藥物）' : '腎排泄正常 → 跨細胞移動', 'ACEi／ARB／spironolactone／amiloride／NSAID／TMP-SMX 抑制排泄；β 阻斷劑／digitalis／succinylcholine 推出細胞');
    if (units > 0) h += row('輸血鉀負荷', fmt(units * 2, 0) + '–' + fmt(units * 3, 0), 'mEq', units >= 7 ? 'fl-warn' : 'fl-na', '每單位 2–3 mEq（存 18 天）', '血漿總共只有 9–10 mEq；7 單位起出現高血鉀（灌流差時排不掉）');
    h += '<div class="rx-flag">先想假性高血鉀：溶血、血小板 >500k、白血球極高、握拳找血管、抽太用力、氣送管、放太久——不合理就自己重抽。腫瘤溶解症候群：高鉀＋高磷＋低鈣＋高尿酸＋AKI，7 天內。</div>';
    document.getElementById('c36hyper_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch37 ================= */
  I.bindCalc('c37conv', function () {
    var v = num('mc_v'), u = val('mc_u');
    var mgdl = u === 'mgdl' ? v : u === 'meq' ? v * 24 / 20 : v * 24 / 10;
    var meq = mgdl * 10 / 24 * 2, mmol = meq / 2;
    var h = row('mg/dL', fmt(mgdl, 2), '', na(mgdl) ? 'fl-na' : (mgdl >= 1.7 && mgdl <= 2.4) ? 'fl-ok' : 'fl-warn', na(mgdl) ? '' : mgdl < 1.7 ? '<1.7 低血鎂' : mgdl > 2.4 ? '偏高' : '正常 1.7–2.4', '');
    h += row('mEq/L', fmt(meq, 2), '', 'fl-na', '正常 1.4–2.0', 'mg/dL × 10 / 24 × 2');
    h += row('mmol/L', fmt(mmol, 2), '', 'fl-na', '正常 0.7–1.0', 'mEq × 0.5');
    h += '<div class="rx-flag">血鎂只占總體 1%（24 g／2,000 mEq，一半在骨）：缺鎂時血鎂可正常。67% 游離、33% 結合蛋白或磷酸硫酸；用血清不用血漿（抗凝劑污染）。尿鎂正常 5–15 mEq/天，缺鎂一週內就掉到幾乎零、血鎂還正常——尿鎂比血鎂早。</div>';
    document.getElementById('c37conv_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c37rep', function () {
    var wt = num('mr_w'), sev = val('mr_s'), renal = val('mr_r') === 'y';
    var f = renal ? 0.5 : 1;
    var h = '';
    if (sev === 'mild') { var d1 = wt * 1 * f, d2 = wt * 0.5 * f; h += row('第 1 天', fmt(d1, 0) + ' mEq ≈ ' + fmt(d1 / 8, 1) + ' g MgSO₄', '', 'fl-na', '1 mEq/kg', '缺口 1–2 mEq/kg；50% 從尿流失所以總量 ×2'); h += row('第 2–5 天', fmt(d2, 0) + ' mEq ≈ ' + fmt(d2 / 8, 1) + ' g/天', '', 'fl-na', '0.5 mEq/kg/天 × 3–5 天', ''); }
    else if (sev === 'mod') { h += row('第一段', fmt(6 * f, 1) + ' g MgSO₄ / 3 小時', '', 'fl-warn', '48 mEq，250–500 mL 食鹽水', '血鎂 <1 mEq/L（<1.2 mg/dL）或併其他電解質異常'); h += row('接著', fmt(5 * f, 1) + ' g / 6 小時', '', 'fl-na', '40 mEq', ''); h += row('之後', fmt(5 * f, 1) + ' g q12h × 5 天', '', 'fl-na', '連續輸注', ''); }
    else { h += row('立即', fmt(2 * f, 1) + ' g MgSO₄ / 2–5 分', '', 'fl-hot', '16 mEq（8 mmol）', 'torsade、癲癇'); h += row('接著', fmt(5 * f, 1) + ' g / 6 小時', '', 'fl-na', '40 mEq', ''); h += row('之後', fmt(5 * f, 1) + ' g q12h × 5 天', '', 'fl-na', '', ''); }
    h += '<div class="rx-flag">' + (renal ? '腎功能不全（CrCl 30–50）：劑量減半、密切監測。' : '') + ' MgSO₄·7H₂O 每克 8 mEq（4 mmol）；稀釋別用 Ringer（鈣抵銷鎂）。Bolus 後 15 分鐘血鎂就開始掉——一定要接輸注；血鎂 1–2 天正常、總體庫存要好幾天。每日需求男 35、女 26 mEq；口服氧化鎂 400 mg 含 20 mEq，ICU 吸收不穩用 IV。</div>';
    document.getElementById('c37rep_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c37ret', function () {
    var ex = num('rt_ex');
    var pct = ex / 48 * 100;
    var h = row('24 小時尿鎂', na(ex) ? '—' : fmt(ex, 0), 'mEq', na(ex) ? 'fl-na' : ex <= 24 ? 'fl-hot' : ex > 38 ? 'fl-ok' : 'fl-warn', na(ex) ? '' : ex <= 24 ? '≤50%：仍缺鎂，繼續補' : ex > 38 ? '>80%：庫存已足' : '50–80% 灰色帶', na(pct) ? '' : fmt(pct, 0) + '% 的負荷');
    h += '<div class="rx-flag">做法：6 g MgSO₄（48 mEq／24 mmol）加 250 mL 食鹽水 1 小時輸完，從輸注開始收 24 小時尿。原理：庫存正常時再吸收已接近 Tmax、負荷多半排掉；缺鎂時再吸收率低、留得多。腎功能差時不可靠——很多 ICU 病人就是。</div>';
    document.getElementById('c37ret_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch38 ================= */
  I.bindCalc('c38ca', function () {
    var ion = num('ca_i'), unit = val('ca_u'), sym = val('ca_s') === 'y', wt = num('ca_w'), mgLow = val('ca_mg') === 'y';
    var mmol = unit === 'mmol' ? ion : ion * 0.25;
    var h = row('游離鈣', na(mmol) ? '—' : fmt(mmol, 2), 'mmol/L', na(mmol) ? 'fl-na' : mmol < 0.65 ? 'fl-hot' : mmol < 1.15 ? 'fl-warn' : mmol > 1.25 ? 'fl-warn' : 'fl-ok', na(mmol) ? '' : mmol < 0.65 ? '<0.65：極度，才會有心血管併發症' : mmol < 1.15 ? '偏低（正常 1.15–1.25）' : mmol > 1.25 ? '偏高' : '正常', '白蛋白校正公式都不可靠，要直接測游離鈣；避免氣泡、不用 heparin／citrate／EDTA 管');
    var treat = sym || (!na(mmol) && mmol < 0.65);
    h += row('要不要補', na(mmol) && !sym ? '—' : treat ? (mgLow ? '先補鎂' : '補') : '不補', '', treat ? 'fl-warn' : 'fl-ok', treat ? (mgLow ? '缺鎂的低血鈣補鈣無效，補鎂常自己好' : '有症狀或極度才補') : 'ICU 88% 有游離低血鈣、多無後果——是疾病標記不是病', '');
    if (treat && !mgLow) { h += row('Bolus', '200 mg 元素鈣 ≈ 22 mL 10% 葡萄糖酸鈣', '', 'fl-na', '100 mL 食鹽水 5–10 分', '升總鈣 0.5 mg/dL，30 分鐘後開始掉'); h += row('輸注', na(wt) ? '1–2 mg/kg/hr' : fmt(wt, 0) + '–' + fmt(wt * 2, 0) + ' mg/hr', '元素鈣', 'fl-na', '至少 6 小時', '依游離鈣調；氯化鈣 27 mg/mL（2,000 mOsm）、葡萄糖酸鈣 9 mg/mL（680）'); }
    h += '<div class="rx-flag">ICU 低血鈣原因：鹼中毒（結合白蛋白）、碳酸氫鈉、缺鎂（PTH 分泌與反應差）、敗血症（細胞激素 → calcitonin）、腎衰竭（磷滯留、維生素 D）、大量輸血（citrate；創傷過半 <0.9）、胰臟炎、橫紋肌溶解、腫瘤溶解。Chvostek 徵象 50% 健康人也有。<b>IV 鈣會促進重症多器官衰竭</b>（細胞內鈣過載）；鈣的主要用途是擋高血鉀的心臟毒性。</div>';
    document.getElementById('c38ca_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c38hyca', function () {
    var ca = num('hc_ca'), wt = num('hc_w'), neuro = val('hc_n') === 'y', crcl = num('hc_cr');
    var treat = (!na(ca) && ca > 14) || neuro;
    var h = row('血鈣', na(ca) ? '—' : fmt(ca, 1), 'mg/dL', na(ca) ? 'fl-na' : ca > 14 ? 'fl-hot' : ca > 12.5 ? 'fl-warn' : 'fl-ok', na(ca) ? '' : ca > 14 ? '>14（游離 >3.5）：治療' : ca > 12.5 ? '>12.5 開始有症狀' : '', '症狀：噁心嘔吐便秘腸阻塞、低血容低血壓 QT 短、多尿 AKI、混亂昏迷');
    h += row('治療指徵', na(ca) && !neuro ? '—' : treat ? '符合' : '不符', '', treat ? 'fl-hot' : 'fl-ok', '>14 或神經症狀', '');
    if (treat) {
      h += row('等張食鹽水', '尿量 100–150 mL/hr', '', 'fl-warn', '先矯正低血容、促排鈣', '降 1–2 mg/dL；furosemide 只用於過載（無加成證據、反促低血容）');
      h += row('Calcitonin', na(wt) ? '4 U/kg SC q12h' : fmt(wt * 4, 0) + ' U SC q12h', '', 'fl-na', '2 小時起效、降 1–2', '24–48 小時後耐受、停');
      h += row('Bisphosphonate', 'Zoledronate 4 mg IV / 15 分', '', 'fl-na', '第一線；2–4 天起效、4–7 天高峰、持續 1–4 週', (!na(crcl) && crcl < 50 ? 'CrCl <50 有人建議減量；' : '') + '一決定治療就給；pamidronate 90 mg/2 h 替代');
      h += row('類固醇', 'Hydrocortisone 200–400 mg/天 × 3 天 → prednisone 10–20 × 7 天', '', 'fl-na', '骨髓瘤、淋巴瘤最有效', '腎衰竭可透析');
    }
    h += '<div class="rx-flag">ICU 高血鈣多是惡性腫瘤（骨髓瘤、乳癌、肺癌、卵巢癌、頭頸鱗癌、淋巴瘤）；高鈣尿滲透性利尿 → 低血容 → 排鈣更少 → 鈣升更快。</div>';
    document.getElementById('c38hyca_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c38po4', function () {
    var p = num('po_p'), wt = num('po_w'), k = num('po_k'), organ = val('po_o') === 'y';
    var band = na(p) ? '' : p < 1 ? 'severe' : p <= 1.7 ? 'mod' : p <= 2.5 ? 'mild' : p > 5 ? 'high' : 'ok';
    var wb = na(wt) ? '' : wt <= 60 ? 'a' : wt <= 80 ? 'b' : 'c';
    var D = { severe: { a: 30, b: 40, c: 50 }, mod: { a: 20, b: 30, c: 40 }, mild: { a: 10, b: 15, c: 20 } };
    var dose = (D[band] && wb) ? D[band][wb] : NaN;
    var treat = band === 'severe' || ((band === 'mod' || band === 'mild') && organ);
    var h = row('血磷', na(p) ? '—' : fmt(p, 1), 'mg/dL', na(p) ? 'fl-na' : band === 'severe' ? 'fl-hot' : (band === 'mod' || band === 'mild') ? 'fl-warn' : band === 'high' ? 'fl-warn' : 'fl-ok', na(p) ? '' : band === 'severe' ? '<1：一律補' : band === 'mod' ? '1–1.7' : band === 'mild' ? '1.8–2.5' : band === 'high' ? '>5 高血磷' : '正常 2.5–5', 'ICU 80% 低血磷、多無症狀（<1 也常無害）');
    if (band && band !== 'ok' && band !== 'high') h += row('要不要補', treat ? '補' : '不補', '', treat ? 'fl-warn' : 'fl-ok', treat ? (band === 'severe' ? '嚴重' : '有心臟失能／呼吸衰竭／橫紋肌溶解') : '無器官失能不補——疾病標記', '');
    if (treat && !na(dose)) h += row('IV 磷酸鹽', fmt(dose, 0), 'mmol', 'fl-na', (na(k) ? '' : k >= 4 ? '血鉀 ≥4 用磷酸鈉' : '血鉀 <4 用磷酸鉀'), '3 mmol/mL；依體重 40–60／61–80／81–120 kg');
    if (band === 'high') h += row('Sevelamer', p > 9 ? '1,600 mg tid' : p >= 7.5 ? '1,200–1,600 mg tid' : p >= 5.6 ? '800 mg tid' : '—', '', 'fl-na', '用 carbonate 不用 hydrochloride（酸中毒）', '或 calcium acetate 1,334 mg tid，目標 <6、不高血鈣；末期腎病、腫瘤溶解、副甲狀腺低下');
    h += '<div class="rx-flag">低血磷原因：葡萄糖負荷最常見（TPN 2 天出現、一週 <1；再餵食症候群；DKA 給 insulin 後）、呼吸性鹼中毒（糖解加速）、β 刺激、發炎、含鋁製劑（sucralfate）。缺磷威脅氧化代謝：心輸出量降、紅血球變形差溶血、2,3-DPG 降左移、ATP 少；橫紋肌溶解、呼吸肌無力。「正常化捷思」：把統計範圍外的數字矯正回來很常見、也沒有價值。</div>';
    document.getElementById('c38po4_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch34 AKI 追查 */
  var ak = { us: null, idx: null };
  window.akPick = function (k, v, btn) { flowSelect(btn); ak[k] = v; akRender(); };
  function akRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ak.us === 'hydro') { cls = 'rec-urgent'; t = '水腎：腎後阻塞——引流，尿有感染就緊急'; d = '<li>小腎則是慢性腎病。</li>'; }
    else if (ak.us === 'ok') {
      if (ak.idx === 'hypo') { cls = 'rec-elective'; t = '指數偏低灌流：輸液挑戰 500 mL/10–15 分，看心搏量與尿量，無反應就停'; d = '<li>尿鈉 <20、FENa <1、FEUrea <35、尿滲透壓 >500。</li><li>利尿劑或慢性腎病會讓尿鈉／FENa 假性升高——用 FEUrea。</li><li>利尿劑<b>絕不</b>用來在低灌流時增加尿量；低劑量 dopamine 是「壞醫療」。</li>'; }
      else if (ak.idx === 'atn') { cls = 'rec-elective'; t = '指數偏小管損傷（敗血症最常見）：支持、避腎毒、管理水分'; d = '<li>尿鈉 >40、FENa >2、FEUrea >50、尿滲透壓 300–400。敗血症與肌紅蛋白尿的 ATN 也可 FENa <1。</li><li>IV furosemide 只為水分管理、不改善腎功能。停 NSAID／ACEi／ARB／cyclosporine／HES／aminoglycoside；顯影劑在重症不增 AKI、GFR <30 才視為風險（AKI 或 GFR <30 前 1 小時起食鹽水到後 3–12 小時）。</li><li>RRT 10–15%：症狀性尿毒、過載、頑固高血鉀、毒物。</li>'; }
      else { cls = 'rec-elective'; t = '無阻塞：算尿液指數'; d = '<li>請回答第 2 步。也量腹內壓——IAH 在 ICU 達 60%、常被忽略。</li>'; }
    }
    if (ak.us) n = '肝腎症候群：排除低血容與敗血症（SBP）後，尿液指數可與 ATN 區分；肝移植是根治，短期策略見第 39 章。';
    flowRec('ak_rec', cls, t, d, n);
  }
  window.akReset = function () { ak = { us: null, idx: null }; selAll('#ak_flow'); akRender(); };

  /* Ch35 血鈉 */
  var sn = { dir: null, sym: null, ecv: null };
  window.snPick = function (k, v, btn) { flowSelect(btn); sn[k] = v; snRender(); };
  function snRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (sn.dir === 'high') {
      var R = { low: ['rec-elective', '低 ECV 高血鈉：低張流失——先食鹽水救血壓，再 ½NS 補水，≤0.5 mEq/L/hr', '<li>嘔吐、腹瀉、利尿劑、糖尿；流失的都含鈉所以也缺鈉。</li>'], normal: ['rec-elective', '正常 ECV 高血鈉：純水流失或尿崩', '<li>補的液比流失的高張（鈉補了水沒補）；尿崩：限水後尿滲透壓不升 30 → 中樞（desmopressin 1 μg SC 或 2 μg IV q12h；口服只吸收 5%）vs 腎性（停藥、indomethacin 2 mg/kg/天）。</li>'], high: ['rec-elective', '高 ECV 高血鈉：碳酸氫鈉或食鹽水灌太多——腎正常自己排；不行 furosemide 配 D5W', '<li>利尿尿鈉 80 低於血漿，單用利尿劑會加重。</li>'] }[sn.ecv];
      if (R) { cls = R[0]; t = R[1]; d = R[2]; } else { cls = 'rec-elective'; t = '高血鈉：看細胞外容積'; d = '<li>請回答第 3 步（症狀那步可略）。</li>'; }
    } else if (sn.dir === 'low') {
      if (sn.sym === 'yes') { cls = 'rec-urgent'; t = '低血鈉腦病變：3% 食鹽水 2 mL/kg（150 mL）bolus，幾小時重複到緩解'; d = '<li>與血鈉高低無關、看症狀；升 5–6 應改善；24 小時 ≤8–10、終點 130；周邊靜脈可給。</li><li>尿量驟增 >100 mL/hr → desmopressin 2 μg SC 並限水；thiazide、腎上腺功能不全、多飲者常規給。</li>'; }
      else if (sn.sym === 'no') {
        var R2 = { low: ['rec-elective', '低 ECV：等張食鹽水救血壓灌流，治病因鈉才會好', '<li>Thiazide（1/3、3 週後）、原發性腎上腺功能不全（礦物皮質素）、腦性鹽耗（SAH、TBI、CNS 感染、GBS、神經外科）；尿鈉 >20 腎性、<20 腎外。</li>'], normal: ['rec-elective', '正常 ECV：水多鈉不少——限水到比尿量少 500 mL/天', '<li>SIADH（尿滲透壓 >100、尿鈉 >20；與腦性鹽耗只差 ECV）、壓力（術後、重症、Ringer 等低張液）、原發性多飲（尿滲透壓 <200）、啤酒多飲；甲狀腺低下證據薄弱但驗 TSH。</li><li>不耐限水：demeclocycline 600–1,200 mg/天（腎毒）；vaptans 升 6–7 但貴不流行。</li>'], high: ['rec-elective', '高 ECV：鹽水都多、水更多——心衰竭、肝硬化、腎衰竭', '<li>腎衰竭尿鈉 >20、心衰竭肝硬化 <20（利尿劑除外）；furosemide 理論上可，但 RAAS 持續活化維持低血鈉。</li>'] }[sn.ecv];
        if (R2) { cls = R2[0]; t = R2[1]; d = R2[2]; } else { cls = 'rec-elective'; t = '無症狀：看細胞外容積'; d = '<li>請回答第 3 步。</li>'; }
      } else { cls = 'rec-elective'; t = '低血鈉（先排除假性與高血糖）：有腦病變症狀嗎？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (sn.dir) n = '高低血鈉都是水的問題不是鈉的問題：低血鈉是水過多（絕對或相對）的徵象。';
    flowRec('sn_rec', cls, t, d, n);
  }
  window.snReset = function () { sn = { dir: null, sym: null, ecv: null }; selAll('#sn_flow'); snRender(); };

  /* Ch36 低血鉀來源 */
  var hk = { uk: null, ucl: null };
  window.hkPick = function (k, v, btn) { flowSelect(btn); hk[k] = v; hkRender(); };
  function hkRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (hk.uk === 'low') { cls = 'rec-elective'; t = '尿鉀低：腎外流失——腹瀉'; d = '<li>正常糞便只丟 5–10 mEq/天；分泌性／發炎性腹瀉糞便 K 15–40 mEq/L、每天可達 10 L → 400 mEq。</li>'; }
    else if (hk.uk === 'high') {
      if (hk.ucl === 'low') { cls = 'rec-elective'; t = '腎性流失、尿氯 <15：鼻胃管引流或鹼中毒'; d = '<li>鼻胃管 K 只 10–15 但丟體積與 H⁺ → 尿丟鉀；先治鹼中毒（跨細胞移動）。</li>'; }
      else if (hk.ucl === 'high') { cls = 'rec-elective'; t = '腎性流失、尿氯 >25：利尿劑或缺鎂'; d = '<li>利尿劑是首因；缺鎂讓腎小管漏鉀，重症（尤其用利尿劑者）很重要——補鉀無效就補鎂。</li>'; }
      else { cls = 'rec-elective'; t = '尿鉀高＝腎性：看尿氯'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (hk.uk) n = '先排除跨細胞移動：β2 促效劑（≤0.5，併利尿劑更大）、鹼中毒、低溫（回溫恢復）、insulin。';
    flowRec('hk_rec', cls, t, d, n);
  }
  window.hkReset = function () { hk = { uk: null, ucl: null }; selAll('#hk_flow'); hkRender(); };

  /* Ch37 疑缺鎂 */
  var mg = { ctx: null, level: null };
  window.mgPick = function (k, v, btn) { flowSelect(btn); mg[k] = v; mgRender(); };
  function mgRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (mg.ctx === 'emerg') { cls = 'rec-urgent'; t = 'Torsade 或癲癇：不等血鎂，2 g MgSO₄ 2–5 分 → 5 g/6 h → 5 g q12h × 5 天'; d = '<li>IV 鎂在血鎂正常也能壓掉 digitalis 毒性與頑固心室心律不整（膜穩定效應）。</li>'; }
    else if (mg.ctx === 'sus') {
      if (mg.level === 'low') { cls = 'rec-elective'; t = '血鎂低：依嚴重度補（輕度 1 mEq/kg → 0.5 × 3–5 天；<1 mEq/L 或併其他電解質異常用中度方案）'; d = '<li>缺鎂常伴低鉀 40%、低磷 30%、低鈉 27%、低鈣 22%；低鉀與低鈣補鎂前補不上。</li><li>腎功能不全減半。</li>'; }
      else if (mg.level === 'normal') { cls = 'rec-elective'; t = '血鎂正常但高度懷疑：血鎂正常不排除缺鎂——做鎂保留試驗或經驗性補'; d = '<li>6 g/1 小時收 24 小時尿：≤50% 排出＝缺；>80%＝夠；腎功能差不可靠。</li><li>Furosemide 50%、aminoglycoside 30%、酒精 44%、急性 MI 80%、DKA 12 小時內 50%、PPI、metformin、cisplatin、分泌性腹瀉（下消化道 10–14 mEq/L；嘔吐不會）。</li>'; }
      else { cls = 'rec-elective'; t = '有誘因（利尿劑、頑固低鉀、酒精、MI、DKA）：血鎂？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (mg.ctx) n = '鎂是 Na-K ATPase 的輔因子、天然鈣阻斷劑；缺鎂還讓 thiamine 變不成 TPP（Wernicke）。高血鎂：>4 反射低、>5 一度 AV 阻斷、>10 完全阻斷、>13 停止——透析，葡萄糖酸鈣 1 g 暫時對抗。';
    flowRec('mg_rec', cls, t, d, n);
  }
  window.mgReset = function () { mg = { ctx: null, level: null }; selAll('#mg_flow'); mgRender(); };

  /* Ch38 低血鈣要不要處理 */
  var lc = { sym: null, mg: null };
  window.lcPick = function (k, v, btn) { flowSelect(btn); lc[k] = v; lcRender(); };
  function lcRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (lc.sym === 'no') { cls = 'rec-blue'; t = '無症狀的游離低血鈣：不補——它是疾病的標記'; d = '<li>ICU 88% 有、幾乎都無後果；有人主張別常規驗。IV 鈣促進多器官衰竭（細胞內鈣過載）。</li><li>找原因就好：鹼中毒、碳酸氫鈉、缺鎂、敗血症、腎衰竭、大量輸血、胰臟炎、橫紋肌溶解、腫瘤溶解。</li>'; }
    else if (lc.sym === 'yes') {
      if (lc.mg === 'yes') { cls = 'rec-elective'; t = '有症狀且缺鎂：先補鎂——缺鎂的低血鈣補鈣無效'; d = '<li>PTH 分泌與末梢反應都差。</li>'; }
      else if (lc.mg === 'no') { cls = 'rec-urgent'; t = '有症狀（tetany、癲癇、低血壓；游離 <0.65）：200 mg 元素鈣 bolus → 1–2 mg/kg/hr ≥6 小時，依游離鈣調'; d = '<li>22 mL 10% 葡萄糖酸鈣（9 mg/mL、680 mOsm）加 100 mL 食鹽水 5–10 分；氯化鈣 27 mg/mL 但 2,000 mOsm 刺激。</li><li>心血管併發症只在 <0.65 mmol/L。</li>'; }
      else { cls = 'rec-elective'; t = '有症狀：鎂正常嗎？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (lc.sym) n = '副甲狀腺低下（甲狀腺手術後）才是症狀性低血鈣的主角，ICU 少見。';
    flowRec('lc_rec', cls, t, d, n);
  }
  window.lcReset = function () { lc = { sym: null, mg: null }; selAll('#lc_flow'); lcRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_aki', 'renallyte-aki', [
    { q: 'KDIGO 的 AKI 診斷條件？', o: ['肌酸酐 >2', '48 小時內 +0.3、7 天內 ×1.5、或尿量 <0.5 mL/kg/hr 6 小時', 'BUN >40', '需要透析'], a: 1, why: '限制：寡尿可能是適當調整；基線常不知；肌酸酐受肌肉量（每天掉 2%）、血漿量、小管分泌影響——重症一律高估 GFR。' },
    { q: '腹內壓升高對 GFR 的影響比動脈壓降多少？', o: ['一樣', '兩倍：過濾梯度 ＝ MAP − 2 × IAP', '一半', '無影響'], a: 1, why: 'IAP 正常 5–7、≥12 IAH、>20 併器官失能 ACS；APP ＝ MAP − IAP >60 較好。正平衡 >5 L 者 85% IAH；理學檢查測不出，膀胱壓要量。' },
    { q: '正在用利尿劑的 AKI 病人，該用哪個指數？', o: ['尿鈉', 'FEUrea（<35 低灌流、>50 小管損傷）——不受利尿劑影響', 'FENa', '尿滲透壓'], a: 1, why: 'FENa 與尿鈉被利尿劑與慢性腎病假性升高；敗血症與肌紅蛋白尿的 ATN 反而可 FENa <1。' },
    { q: '重症病人打顯影劑會不會造成 AKI？', o: ['一定會', '對照良好的研究顯示不增加、也不惡化既有 AKI；GFR <30 仍視為風險', '只在糖尿病', '只在脫水'], a: 1, why: '共識：AKI 或 GFR <30 前 1 小時起食鹽水到後 3–12 小時（心衰竭未必）。' },
    { q: '橫紋肌溶解防 AKI 最有效的是？', o: ['碳酸氫鈉鹼化', '積極灌等張食鹽水（10–20 mL/kg 起，尿 ≥1 mL/kg/hr）；幾小時仍寡尿就放棄', 'Mannitol', 'Furosemide'], a: 1, why: '肌紅蛋白（血基質鐵 → hydroxyl radical）傷小管；CK 反映肌傷不反映 AKI 風險，肌紅蛋白尿 >20 μg/L 才是重點。30% 需 RRT。' },
    { q: '血液透析與血液過濾的差別？', o: ['沒有差別', '透析靠擴散、快清小分子（鉀、尿毒）但除水與大分子差、不穩定者低血壓；過濾靠對流、除水達 3 L/hr、可清藥物毒素與細胞激素、要連續（CVVH）', '過濾比較快', '透析可除細胞激素'], a: 1, why: 'CVVHD 兩者兼得、ICU 首選但表現不穩。導管走內頸或股靜脈，不走鎖骨下（狹窄）。低劑量 dopamine 是壞醫療；furosemide 不改善腎功能。' }
  ]);
  I.renderQuiz('qz_na', 'renallyte-na', [
    { q: '有效滲透壓為什麼不算 BUN？', o: ['BUN 太小', '尿素自由穿膜，高氮血症是高滲透不是高張', 'BUN 不準', '因為鈉占 98%'], a: 1, why: '2Na＋葡萄糖/18＋BUN/2.8 ≈ 290；有效 ≈ 285；去掉葡萄糖 280——鈉占有效滲透壓 98%，決定水在細胞內外的分布。' },
    { q: '高血鈉病人低血壓，該給？', o: ['D5W 快灌', '等張食鹽水救血壓，但矯正高血鈉無效——之後 ½NS 或 D5W、≤0.5 mEq/L/hr', '3% 食鹽水', 'Furosemide'], a: 1, why: '低張流失也丟鈉所以 ½NS 較合理；腦細胞 9 小時起累積 osmolyte、48 小時恢復——補太快腦水腫。' },
    { q: '中樞性與腎性尿崩怎麼分？', o: ['尿量', '限水後尿滲透壓不升 30 → 尿崩；vasopressin 後升 ≥50% ＝ 中樞（<200）、不變 ＝ 腎性（200–500）', '血鈉高低', '尿鈉'], a: 1, why: '中樞：desmopressin 1 μg SC／2 μg IV q12h（口服只吸收 5%）；腎性：停藥（amphotericin、aminoglycoside、dopamine、lithium）、indomethacin 2 mg/kg/天。' },
    { q: 'Na 130、血糖 600 的病人，校正鈉？', o: ['130', '142（每 100 mg/dL ＋2.4）', '125', '135'], a: 1, why: '高血糖把水拉出細胞稀釋鈉。假性低血鈉（蛋白 ≥12、TG ≥1,500）則實測滲透壓正常。' },
    { q: '什麼決定要不要給 3% 食鹽水？', o: ['Na <120', '腦病變症狀（與血鈉高低無關）：2 mL/kg／150 mL bolus 重複到緩解', 'Na <125 且 ECV 低', '尿鈉'], a: 1, why: '升 5–6 應改善；24 小時 ≤8–10、終點 130；過度矯正 25%（自發水利尿）→ desmopressin 2 μg SC 並限水；慢性低血鈉脫髓鞘風險更高。' },
    { q: 'SIADH 與腦性鹽耗的差別？', o: ['尿鈉', '只差 ECV：SIADH 正常、腦性鹽耗低；兩者尿滲透壓 >100、尿鈉 >20', '尿滲透壓', '血鈉高低'], a: 1, why: '正常 ECV 低血鈉限水到比尿量少 500 mL；SIADH vs 原發性多飲看尿滲透壓（300–500 vs <200）；demeclocycline、vaptans 是備案。' }
  ]);
  I.renderQuiz('qz_k', 'renallyte-k', [
    { q: '血鉀降 1 mEq/L 大約缺多少總體鉀？', o: ['20 mEq', '200–400 mEq（10% 總體鉀）；升 1 只要多 100–200', '1,000 mEq', '無法估'], a: 1, why: '98% 在細胞內、血漿只 0.4%——量血鉀像看冰山一角。70 kg 血鉀 3.0 缺 175、2.5 缺 350。' },
    { q: '低鉀補不上，最可能？', o: ['劑量太少', '缺鎂——腎小管漏鉀，鎂補足前矯正不了', '吸收差', '假性低鉀'], a: 1, why: '利尿劑是腎性流失首因；尿氯 <15 是鼻胃管／鹼中毒、>25 是利尿劑／缺鎂；腹瀉可丟 400 mEq/天。' },
    { q: '低鉀會不會造成嚴重心律不整？', o: ['會，是主要原因', '單獨不會；只放大其他原因（缺血）的風險', '只有 <3.0', '只有併高鎂'], a: 1, why: '<2.5 才瀰漫無力；ECG（U 波、T 平倒、QT 長）50% 有但不專一。補 20 mEq/100 mL/hr、嚴重 40；>20/hr 別進上腔靜脈。' },
    { q: '高血鉀但沒有任何原因，第一步？', o: ['立刻透析', '想假性高血鉀：溶血、血小板 >500k、白血球極高、握拳、抽太用力、氣送管、放太久——自己重抽', '給鈣', '給 insulin'], a: 1, why: '高血鉀一定有腎排泄缺陷的成分（正常腎排得掉負荷）；尿鉀 <30 ＝ 排泄受損。' },
    { q: '嚴重高血鉀的三步與陷阱？', o: ['碳酸氫鈉為主', '鈣（葡萄糖酸鈣 10 mL；崩潰用氯化鈣，鈣 3 倍）→ insulin 10 U＋D50（降 ≥0.6、暫時）→ SZC／透析；碳酸氫鈉無效且與鈣結合、β2 不可單用', 'Kayexalate 為主', '只要透析'], a: 1, why: '嚴重＝>6.5 或 ECG 變化；血鉀與 ECG 不相關（>7 只 40% 有變化、14 無變化的案例）。SPS 起效慢、腸壞死；SZC 10 g tid 1 小時見效；透析 1 小時降 1。' },
    { q: '大量輸血的鉀負荷？', o: ['每單位 20 mEq', '存 18 天每單位 2–3 mEq；7 單位起出現高血鉀（灌流差排不掉）', '零', '每單位 10 mEq'], a: 1, why: '4°C 關掉紅血球的 Na-K 幫浦、鉀漏出。血漿總共只 9–10 mEq。Succinylcholine 在脊髓損傷可致命性升鉀；腫瘤溶解症候群最急的是鉀。' }
  ]);
  I.renderQuiz('qz_mg', 'renallyte-mg', [
    { q: '血鎂正常能排除缺鎂嗎？', o: ['能', '不能——血鎂只占 1%；無鎂飲食一週尿鎂已近零、血鎂仍正常', '只有 ICU 不能', '只看游離鎂'], a: 1, why: 'ICU 低血鎂達 65%、缺鎂更多。鎂保留試驗（6 g/1 小時、24 小時尿 ≤50% 排出＝缺、>80%＝夠）是最好的終點指標，腎功能差不可靠。' },
    { q: 'ICU 缺鎂的首因？', o: ['營養不良', 'Furosemide（慢性使用 50%）；還有 aminoglycoside 30%、酒精 44%、急性 MI 80%、PPI、insulin', '腹瀉', '嘔吐'], a: 1, why: '保鉀利尿劑不會；上消化道分泌鎂少（嘔吐不會），下消化道 10–14 mEq/L（分泌性腹瀉會）；DKA 入院 7%、12 小時 50%（insulin 推進細胞）。' },
    { q: '缺鎂為什麼低鉀低鈣都補不上？', o: ['吸收差', '鎂讓腎小管漏鉀；缺鎂抑制 PTH 分泌與反應——鎂補足前兩者都難矯正', '因為酸中毒', '因為利尿劑'], a: 1, why: '缺鎂伴低鉀 40%、低磷 30%（磷是因不是果）、低鈉 27%、低鈣 22%。' },
    { q: 'Torsade 病人血鎂正常，要不要給鎂？', o: ['不要', '要：2 g MgSO₄ 2–5 分 → 5 g/6 h → 5 g q12h × 5 天；IV 鎂在血鎂正常也能壓 digitalis 毒性與頑固心室心律不整', '只給口服', '先驗游離鎂'], a: 1, why: 'MgSO₄·7H₂O 每克 8 mEq；bolus 後 15 分鐘血鎂就掉、要接輸注；不用 Ringer 稀釋。' },
    { q: '輕度無症狀低血鎂（1–1.4 mEq/L）怎麼補？', o: ['一劑 2 g', '假設缺 1–2 mEq/kg、尿丟 50% 所以總量 ×2：第 1 天 1 mEq/kg，之後 0.5 mEq/kg × 3–5 天；腎功能不全減半', '口服氧化鎂就好', '不用補'], a: 1, why: '中度（<1 mEq/L 或併其他電解質異常）：6 g/3 h → 5 g/6 h → 5 g q12h × 5 天。血鎂 1–2 天正常、庫存要好幾天。' },
    { q: '高血鎂的閾值與處置？', o: ['>2 就透析', '>4 反射低、>5 一度 AV 阻斷、>10 完全阻斷、>13 停止；透析為首選，葡萄糖酸鈣 1 g 暫時對抗，有腎功能可灌水＋furosemide', '只要停鎂', '給 insulin'], a: 1, why: '多為 CrCl <30 加鎂製劑（制酸劑、瀉藥）；大量溶血每 250 mL 紅血球升 0.1；鎂是天然鈣阻斷劑，主要是 AV 傳導。' }
  ]);
  I.renderQuiz('qz_capo', 'renallyte-capo', [
    { q: '白蛋白低的病人，血鈣該怎麼判？', o: ['用校正公式', '校正公式都不可靠，直接測游離鈣（避免氣泡、不用 heparin／citrate／EDTA 管）', '總鈣就好', '看 PTH'], a: 1, why: '鈣半數游離、40% 結合白蛋白、10% 複合陰離子；低白蛋白降總鈣不降游離鈣。' },
    { q: 'ICU 的游離低血鈣該不該補？', o: ['一律補到正常', '幾乎都無後果（88% 有）、是疾病標記；只在有症狀或 <0.65 mmol/L 才補，IV 鈣會促進多器官衰竭', '補到 1.0', '只補大量輸血者'], a: 1, why: '缺鎂者先補鎂。補法：200 mg 元素鈣（22 mL 葡萄糖酸鈣）→ 1–2 mg/kg/hr ≥6 小時。Chvostek 徵象 50% 健康人也有。' },
    { q: '嚴重高血鈣的第一步？', o: ['Furosemide', '等張食鹽水到尿量 100–150 mL/hr（降 1–2）；furosemide 無加成證據、只用於過載', 'Zoledronate', '透析'], a: 1, why: '治療門檻 >14 或神經症狀（>12.5 開始有症狀）；calcitonin 4 U/kg q12h 2 小時起效但 24–48 小時耐受；zoledronate 4 mg 第一線但 2–4 天起效，一決定就給；類固醇對骨髓瘤淋巴瘤。' },
    { q: '住院低血磷最常見的原因？', o: ['腎流失', '葡萄糖負荷（TPN、再餵食、DKA 給 insulin）——磷跟葡萄糖一起進細胞', '制酸劑', '透析'], a: 1, why: 'TPN 2 天出現、一週 <1；呼吸性鹼中毒、β 刺激、發炎、sucralfate 也會。ICU 80% 有、多無症狀。' },
    { q: '低血磷何時補？', o: ['<2.5 一律補', '<1 一律補；1–2.5 只在有心臟失能、呼吸衰竭或橫紋肌溶解時補', '從不補', '只補 DKA'], a: 1, why: 'IV 依體重與血磷 10–50 mmol（3 mmol/mL）；血鉀 ≥4 用磷酸鈉、<4 用磷酸鉀。缺磷降心輸出量、紅血球變形差、2,3-DPG 降。' },
    { q: '「正常化捷思」是什麼？', o: ['把數值調到正常最安全', '把統計範圍外的數字矯正回來的習慣——很常見、沒有價值；範圍外可能是正常離群值', '指引的建議', '透析的原則'], a: 1, why: '低血鈣與低血磷在 ICU 多是疾病標記而非需要矯正的病。' }
  ]);
})();
