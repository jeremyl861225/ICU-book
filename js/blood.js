/* ICU Book · Section V 血液成分 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 12–13（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch12 ================= */
  /* 紅血球量與抽血失血 */
  I.bindCalc('c12rcm', function () {
    var wt = num('rc_w'), sex = val('rc_sex'), hct = num('rc_hct'), daily = num('rc_ph'), days = num('rc_d'), ret = val('rc_ret') === 'y';
    var bv = wt * (sex === 'f' ? 65 : 70), rcm = bv * hct / 100, rcmN = wt * (sex === 'f' ? 24 : 26);
    var deficit = rcmN - rcm, units = deficit / 210;
    var loss = daily * days * (ret ? 0.5 : 1);
    var h = row('估計紅血球量', fmt(rcm, 0), 'mL', na(rcm) ? 'fl-na' : rcm >= rcmN ? 'fl-ok' : 'fl-warn', na(rcm) ? '' : '正常 ' + fmt(rcmN, 0) + '（' + (sex === 'f' ? '24' : '26') + ' mL/kg）', '血量 ' + fmt(bv, 0) + ' mL × Hct');
    h += row('紅血球缺口', na(deficit) ? '—' : fmt(Math.max(deficit, 0), 0), 'mL', 'fl-na', na(units) ? '' : '≈ ' + fmt(Math.max(units, 0), 1) + ' 單位 PRBC 的紅血球', '1 U PRBC ＝ 350 mL × 60% ≈ 210 mL');
    h += row('每單位 PRBC', '+1 / +3', 'g/dL · %', 'fl-na', 'Hb ／ Hct', '一般成人、無持續失血');
    h += row('抽血累積失血', na(loss) ? '—' : fmt(loss, 0), 'mL', na(loss) ? 'fl-na' : loss >= 500 ? 'fl-hot' : 'fl-ok', na(loss) ? '選填' : loss >= 500 ? '≥1 單位全血' : '<1 單位全血', ret ? '棄血回輸已減半' : '每次棄血約 5 mL，回輸可減半');
    h += '<div class="rx-flag">ICU 每天抽 40–70 mL，一週就是一單位全血。Hct 是<b>濃度</b>：平躺 4 小時或 20 mL/kg 食鹽水都能讓 Hct 降 4%（相當於少一單位血），ICU 病人血漿量常偏多，Hb／Hct 會高估貧血。</div>';
    document.getElementById('c12rcm_out').innerHTML = I.wrap(h);
  });

  /* 輸血觸發 */
  I.bindCalc('c12trig', function () {
    var hb = num('tg_hb'), grp = val('tg_grp'), sa = num('tg_sa'), sc = num('tg_sc'), stable = val('tg_st') === 'y';
    var thr = grp === 'cad' ? 8 : 7;
    var er = sa - sc;
    var h = row('指引門檻', 'Hb < ' + thr, 'g/dL', na(hb) ? 'fl-na' : hb < thr ? 'fl-warn' : 'fl-ok', na(hb) ? '' : hb < thr ? '低於門檻' : '在門檻之上', grp === 'cad' ? '冠心病／心臟或骨科手術' : '穩定重症（含心臟術後、敗血性休克）');
    h += row('O₂ 萃取 SaO₂ − ScvO₂', na(er) ? '—' : fmt(er, 0), '%', na(er) ? 'fl-na' : er >= 50 ? 'fl-hot' : er > 30 ? 'fl-warn' : 'fl-ok', na(er) ? '選填' : er >= 50 ? '≥50%：組織氧合受威脅，生理性輸血指徵' : er > 30 ? '代償中，還沒到門檻' : '正常 20–30%', '萃取上限約 50%');
    h += row('ScvO₂', na(sc) ? '—' : fmt(sc, 0), '%', na(sc) ? 'fl-na' : sc < 70 ? 'fl-warn' : 'fl-ok', na(sc) ? '選填' : sc < 70 ? '<70%：被提議的輸血指徵（SaO₂ 近 100% 時）' : '≥70%');
    var msg;
    if (na(hb)) msg = '';
    else if (!stable) msg = '<b>不穩定或活動性出血</b>：不適用這些門檻，依出血復甦處理（第 14–15 章）。';
    else if (hb < thr && (!na(er) && er < 50)) msg = 'Hb 低於門檻但萃取沒到 50%：組織氧合尚未受威脅——先想稀釋（近期輸液？平躺？）與血量，Hb 本身不是需求證據。';
    else if (hb < thr) msg = 'Hb 低於門檻' + (na(er) ? '；若能量 ScvO₂，用 SaO₂ − ScvO₂ 確認需求。' : '且萃取 ≥50%：輸血有生理依據。');
    else if (!na(er) && er >= 50) msg = 'Hb 在門檻之上但萃取 ≥50%：組織氧合受威脅，先找心輸出量／血量的問題，再考慮輸血。';
    else msg = '不符合輸血指徵。';
    h += '<div class="rx-flag">' + msg + ' 1942 年的 Hb 10 用了 60 年；7–8 vs 9–10 結局相同、少用血 41%；但 60% 的輸血仍不照指引。1–2 單位把 Hb 6.4 拉到 8，DO₂ 升 25% 而 <b>VO₂ 不變</b>——輸血不是改善組織氧合的可靠手段。</div>';
    document.getElementById('c12trig_out').innerHTML = I.wrap(h);
  });

  /* 輸注時間 */
  I.bindCalc('c12inf', function () {
    var u = num('in_u') || 1, g = val('in_g'), dil = val('in_dil') === 'y';
    var per = g === '18' ? (dil ? 12 : 70) : (dil ? 19 : 117), vol = dil ? 450 : 350;
    var t = per * u;
    var h = row('每單位重力輸注', fmt(per, 0), '分', 'fl-na', (g === '18' ? '18G' : '20G') + (dil ? '＋100 mL 食鹽水' : '，未稀釋'), vol + ' mL/單位');
    h += row('合計', t >= 60 ? fmt(t / 60, 1) + ' 小時' : fmt(t, 0) + ' 分', '', 'fl-na', u + ' 單位', '≈ ' + fmt(vol * u / (t / 60), 0) + ' mL/hr');
    h += row('穩定病人建議', '2', '小時/單位', 'fl-na', 'AABB', '矯正貧血時不必稀釋');
    h += '<div class="rx-flag">PRBC Hct 60% 黏稠：20G 未稀釋要近 2 小時，加 100 mL 食鹽水快 6 倍。所有血品都要 170–260 μm 標準濾器（不去白血球）；流速變慢就換濾器。稀釋液避開 RL（鈣），用食鹽水或 Plasma-Lyte。</div>';
    document.getElementById('c12inf_out').innerHTML = I.wrap(h);
  });

  /* 黏稠度 */
  var VISC = [[0, 1.4], [10, 1.8], [20, 2.1], [30, 2.8], [40, 3.7], [50, 4.8], [60, 5.8]];
  function visc(h) { if (na(h) || h < 0 || h > 60) return NaN; for (var i = 1; i < VISC.length; i++) { if (h <= VISC[i][0]) { var a = VISC[i - 1], b = VISC[i]; return a[1] + (b[1] - a[1]) * (h - a[0]) / (b[0] - a[0]); } } return NaN; }
  I.bindCalc('c12visc', function () {
    var hct = num('vs_h');
    var v = visc(hct), vN = visc(45);
    var h = row('相對黏稠度', fmt(v, 1), '× 水', 'fl-na', 'Hct ' + fmt(hct, 0) + '%', 'Hct 45% ≈ ' + fmt(vN, 1));
    h += row('流阻相對正常', na(v) ? '—' : fmt(v / vN * 100, 0), '%', na(v) ? 'fl-na' : v < vN ? 'fl-ok' : 'fl-warn', na(v) ? '' : v < vN ? '血流更順、心輸出量上升' : '流阻增加', 'Poiseuille：R ＝ 8μL / πr⁴');
    h += '<div class="rx-flag">血漿黏稠度只比水高一點；正常血是血漿的 3 倍、水的 4 倍。血是非牛頓流體（流速越快越稀），所以貧血時心輸出量上升的幅度比 Hct 下降還大——這是貧血耐受的第一道代償，第二道是氧萃取。</div>';
    document.getElementById('c12visc_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch13 ================= */
  /* 4Ts */
  I.bindCalc('c13ft', function () {
    var a = num('ft_t'), b = num('ft_o'), c = num('ft_th'), d = num('ft_x');
    var s = a + b + c + d;
    var cat = na(s) ? '' : s <= 3 ? 'low' : s <= 5 ? 'mid' : 'high';
    var h = row('4Ts 總分', fmt(s, 0), '/ 8', na(s) ? 'fl-na' : cat === 'low' ? 'fl-ok' : cat === 'mid' ? 'fl-warn' : 'fl-hot', na(s) ? '' : cat === 'low' ? '0–3 低機率' : cat === 'mid' ? '4–5 中機率' : '6–8 高機率');
    var act = cat === 'low' ? '不必檢驗、不必停 heparin。' : cat === 'mid' ? '<b>停 heparin、改非 heparin 抗凝</b>，送 PF4 ELISA；陰性就停替代藥、恢復 heparin。' : cat === 'high' ? '<b>停 heparin、全量非 heparin 抗凝</b>；ELISA 陰性才停。' : '';
    h += '<div class="rx-flag">' + act + (cat && cat !== 'low' ? ' ELISA 陽性而無血栓證據 → 下肢超音波（有 CVC 加上肢）；<b>所有 HIT 都要全量抗凝</b>（延遲抗凝血栓多 10 倍）。Warfarin 在急性 HIT 絕對禁忌（肢體壞疽），近日吃過要維生素 K 逆轉。' : '') + ' ELISA 高敏感低專一：陰性可排除、陽性不能確診；SRA 是金標準但多數醫院沒有。</div>';
    document.getElementById('c13ft_out').innerHTML = I.wrap(h);
  });

  /* 血小板輸注 */
  I.bindCalc('c13plt', function () {
    var p = num('pl_n'), sit = val('pl_sit'), u = num('pl_u') || 1, prior = num('pl_pr') || 0, tma = val('pl_tma') === 'y';
    var thr = { bleed: 50, ich: 100, none: 10, surg: 50, lp: 50, cvc: 20 }[sit];
    var inc1 = 35 * u, inc2 = 50 * u, fr = prior >= 5 ? 0.75 : 1;
    var h = row('門檻', '< ' + thr, '× 10³/μL', na(p) ? 'fl-na' : tma ? 'fl-hot' : p < thr ? 'fl-warn' : 'fl-ok', na(p) ? '' : tma ? '微血管病：不輸' : p < thr ? '低於門檻' : '高於門檻，不需輸', { bleed: '活動性出血', ich: '顱內出血', none: '無出血、預防性', surg: '擇期非神經軸手術', lp: '腰椎穿刺', cvc: '中央靜脈導管' }[sit]);
    h += row('1 小時預期增量', '+' + fmt(inc1 * fr, 0) + '–' + fmt(inc2 * fr, 0), '× 10³/μL', 'fl-na', u + ' 單位', prior >= 5 ? '已輸 ≥5 次：增量約低 25%' : '每單位 35–50k');
    h += row('24 小時後', '+' + fmt(inc1 * fr * 0.6, 0) + '–' + fmt(inc2 * fr * 0.6, 0), '× 10³/μL', 'fl-na', '約低 40%');
    h += '<div class="rx-flag">' + (tma ? '<b>DIC／TTP／HUS 的消耗性血小板低下不輸血小板</b>，會給微血管血栓添柴。' : (sit === 'bleed' || sit === 'ich') ? '活動性出血維持 >50k、顱內出血 >100k；同時處理出血源與原因。' : '沒有出血時，血小板數不是問題，背後的病才是；5k 也不會自發出血，這些預防門檻沒有一個被驗證過。') + ' 反覆輸注的「refractoriness」是對 ABO 的抗體，用 ABO 相符血小板；減白可降發燒、CMV 與同種免疫。</div>';
    document.getElementById('c13plt_out').innerHTML = I.wrap(h);
  });

  /* Argatroban */
  I.bindCalc('c13arg', function () {
    var wt = num('ar_w'), hep = val('ar_hep') === 'y', dose = num('ar_d') || (hep ? 0.5 : 2), conc = num('ar_c') || 1;
    var ugmin = dose * wt, mlhr = ugmin * 60 / (conc * 1000);
    var h = row('起始劑量', fmt(dose, 1), 'μg/kg/min', 'fl-na', hep ? '肝功能不全：0.5' : '一般：1–2', '腎功能不需調整');
    h += row('輸注速率', fmt(mlhr, 1), 'mL/hr', 'fl-na', fmt(ugmin, 0) + ' μg/min', conc + ' mg/mL');
    h += row('目標 aPTT', '1.5–3 ×', '正常', 'fl-na', '持續到血小板 >150k', '之後可換 DOAC（rivaroxaban）1–3 個月');
    h += '<div class="rx-flag">Argatroban 是美國唯一核准的 HIT 用藥；PCI 用 bivalirudin；穩定病人可用 fondaparinux 或 DOAC。HIT 後 3 個月戴識別牌、<b>終身避開 heparin</b>（含沖管與塗層導管）。</div>';
    document.getElementById('c13arg_out').innerHTML = I.wrap(h);
  });

  /* 血漿製品 */
  I.bindCalc('c13pl', function () {
    var wt = num('pp_w'), fib = num('pp_f'), tgt = num('pp_t') || 200;
    var need = Math.max(tgt - fib, 0), units = Math.ceil(need / 50 * wt / 10);
    var h = row('Cryo 單位數', na(fib) ? '—' : fmt(units, 0), 'U', na(fib) ? 'fl-na' : fib < 150 ? 'fl-hot' : fib < 200 ? 'fl-warn' : 'fl-ok', na(fib) ? '' : fib < 150 ? '<150：創傷大出血應給' : fib < 200 ? '150–200：灰色帶' : '≥200 不需', '1 U / 10 kg 升約 50 mg/dL（無出血時）');
    h += row('FFP 逆轉 warfarin', fmt(wt * 10, 0) + '–' + fmt(wt * 15, 0), 'mL', 'fl-na', '10–15 mL/kg', '≈ ' + fmt(wt * 10 / 230, 1) + '–' + fmt(wt * 15 / 230, 1) + ' 單位（230 mL）· 先給維生素 K');
    h += row('4F-PCC', '100', 'mL', 'fl-ok', '<30 分鐘逆轉', '取代 FFP 的解凍與體積問題');
    h += row('TACO 安全速率', fmt(wt, 0), 'mL/hr', 'fl-na', '≤1 mL/kg/hr', '心衰竭／已過載者');
    h += '<div class="rx-flag">Fibrinogen 是大出血最早耗竭、也最容易被稀釋的因子。Cryo 濃度不定、要解凍、未經病原減除；fibrinogen 濃縮製劑 20 g/L 不需解凍，正在取代它。ICU 大多數 FFP 用在「INR 高但沒出血」——沒有證據減少出血，且 FFP 同時把 antithrombin 拉高，淨止血能力可能沒變。</div>';
    document.getElementById('c13pl_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch12 輸血反應 */
  var tr = { sx: null, hf: null };
  window.trPick = function (k, v, btn) { flowSelect(btn); tr[k] = v; trRender(); };
  function trRender() {
    var cls = 'rec-idle', t = '請選擇主要表現', d = '', n = '';
    var R = {
      hemo: ['rec-urgent', '急性溶血反應：立刻停、核對血袋與病人、通知血庫', '<li>ABO 錯配幾乎都是人為錯誤；嚴重度與已輸入量成正比，所以<b>先停</b>。</li><li>血庫要血漿游離血紅素與 direct Coombs；配對正確就不太可能是溶血。</li><li>確診後支持治療：輸液、升壓劑、呼吸支持；可併消耗性凝血病變與多器官失能；致死 1:190 萬單位。</li>'],
      fever: ['rec-elective', '非溶血性發燒（1:60）：先照溶血反應處理，排除溶血後即可', '<li>>1°C、輸血中到 6 小時內、無其他原因；多在第一小時之後出現，可伴寒顫。抗白血球抗體 → 內生性致熱原；多見於曾輸血者與經產婦。</li><li>血庫做血袋革蘭氏染色、可能要血培養。</li><li>>75% 不會再發：下次不必特別處理；<b>第二次</b>才改用減白血球製劑。</li>'],
      urt: ['rec-blue', '蕁麻疹（1:100）：不發燒的輕微蕁麻疹不必停', '<li>對捐血者血漿蛋白致敏；習慣做法是暫停＋diphenhydramine 25–50 mg。</li><li>之後改用洗滌紅血球；查 IgA 缺乏。</li>'],
      ana: ['rec-urgent', '過敏性反應（1:1,000；休克 1:50,000）：立刻停，依第 17 章處理', '<li>突發呼吸困難、喘鳴；低血壓可能被誤判為溶血。IgA 缺乏者不需先前致敏。</li><li>以後非必要不輸血；要輸就洗滌製劑。</li>'],
      resp: null
    }[tr.sx];
    if (tr.sx === 'resp') {
      if (tr.hf === 'yes') { cls = 'rec-urgent'; t = 'TACO（1%）：停輸血、靜脈 loop 利尿劑、支持'; d = '<li>6 小時內的靜水壓性肺水腫；與單位數無關，心衰竭、腎衰竭、已過載者好發；30% 會發燒、3/4 需呼吸器，死亡率 20%。</li><li>下次輸血前先矯正正水平衡。</li>'; }
      else if (tr.hf === 'no') { cls = 'rec-urgent'; t = 'TRALI（1:12,000）：停輸血、通知血庫、依 ARDS 支持'; d = '<li>輸血相關死亡的首因，死亡率近 50%；80% 是捐血者抗白血球抗體活化中性球。</li><li>第一小時最常見、6 小時內都可能；發燒常見；CRP 升高支持發炎性損傷。</li><li>之後是否用洗滌製劑無定論。</li>'; }
      else { cls = 'rec-elective'; t = '輸血後 6 小時內低血氧呼吸衰竭：TRALI 還是 TACO？'; d = '<li>兩者時間窗相同、都可發燒、胸片都像肺水腫——請回答第 2 步。</li>'; }
    } else if (R) { cls = R[0]; t = R[1]; d = R[2]; }
    if (tr.sx) n = '風險（每單位）：發燒 1:60、蕁麻疹 1:100、TACO 1:100（每人）、過敏 1:1,000、TRALI 1:12,000、急性溶血 1:35,000。輸血錯誤遠比傳染病常見。';
    flowRec('tr_rec', cls, t, d, n);
  }
  window.trReset = function () { tr = { sx: null, hf: null }; selAll('#tr_flow'); trRender(); };

  /* Ch13 血小板低下鑑別 */
  var tp = { sch: null, coag: null, renal: null, hep: null };
  window.tpPick = function (k, v, btn) { flowSelect(btn); tp[k] = v; tpRender(); };
  function tpRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (tp.sch === 'yes') {
      if (tp.coag === 'yes') { cls = 'rec-urgent'; t = 'DIC：消耗性凝血病變——治病因、支持，血品只在危及生命的出血時給'; d = '<li>INR／aPTT 延長、fibrinogen 低、D-dimer 高；LDH 高、haptoglobin 低。</li><li>創傷、敗血性休克（血栓為主）、產科急症（出血為主）；purpura fulminans 見於腦膜炎雙球菌血症。</li><li>補血小板與凝血因子可能給微血管血栓添柴；併 MOF 死亡率 ≥80%。</li>'; }
      else if (tp.coag === 'no') {
        if (tp.renal === 'mild') { cls = 'rec-urgent'; t = 'TTP：立刻血漿置換，不治 24–48 小時可致死'; d = '<li>ADAMTS-13 抗體 → vWF 失控；中年女性 3 倍。五聯徵（發燒、意識、腎、血小板、MAHA）常不齊。</li><li>INR／aPTT／fibrinogen 正常、Cr 多 <2 mg/dL；ADAMTS-13 活性大降可確診但多數醫院沒有。</li><li>每日置換 1.5 倍血漿量，到血小板正常連續 2 天；48 小時內開始存活可達 90%。<b>不輸血小板</b>。</li>'; }
        else if (tp.renal === 'severe') { cls = 'rec-urgent'; t = 'HUS：治感染、支持與腎替代；非典型 HUS 用 eculizumab（無則血漿置換）'; d = '<li>三聯徵：血小板低、AKI、MAHA；腎衰竭比 TTP 重。</li><li>Shiga toxin 大腸桿菌、肺炎鏈球菌、流感；懷孕、狼瘡、APS、癌症、quinine／cyclosporin／tacrolimus。</li><li>aHUS 是補體失控（20% 有腎外表現，多為神經）；eculizumab 抗 C5。</li>'; }
        else { cls = 'rec-elective'; t = '凝血正常的血栓性微血管病：TTP 或 HUS？看腎衰竭的嚴重度'; d = '<li>請回答第 3 步。</li>'; }
      } else { cls = 'rec-elective'; t = '有 schistocytes ＝ 血栓性微血管病：先看 INR／aPTT／fibrinogen'; d = '<li>請回答第 2 步。這三種病<b>都不能輸血小板</b>。</li>'; }
      n = '共同特徵：消耗性血小板低下、微血管血栓＋器官失能、非免疫性微血管溶血（LDH↑、haptoglobin↓、schistocytes）。';
    } else if (tp.sch === 'no') {
      if (tp.hep === 'yes') { cls = 'rec-urgent'; t = '有 heparin 暴露：算 4Ts，中高機率就停 heparin、改非 heparin 抗凝'; d = '<li>典型 5–10 天（3 個月內接觸過可 24 小時內；遲發可到 3 週）；血小板降 50% 但很少 <20k。</li><li>可怕的是血栓不是出血：未治療 VTE 17–55%、動脈 1–3%；25% 血栓先於血小板下降。</li><li>沖管、塗層導管的微量暴露也會；UFH 風險是 LMWH 的 2–10 倍。</li>'; }
      else if (tp.hep === 'no') { cls = 'rec-blue'; t = '最常見是敗血症（巨噬細胞破壞）；再想藥物與假性血小板低下'; d = '<li>免疫性藥物：IIb/IIIa 拮抗劑、linezolid、β-lactam、vancomycin；骨髓抑制：化療。</li><li>其他：體外循環、IABP、RRT、肝病／脾亢、HIV、惡性腫瘤、大量輸血。</li><li>假性（2%）：EDTA 抗體讓血小板凝集被機器誤讀——改 citrate 或 heparin 管重驗。</li><li>沒有出血時，血小板數不是問題，背後的病才是。</li>'; }
      else { cls = 'rec-elective'; t = '沒有 schistocytes：有沒有 heparin 暴露？'; d = '<li>請回答第 4 步。</li>'; }
    }
    flowRec('tp_rec', cls, t, d, n);
  }
  window.tpReset = function () { tp = { sch: null, coag: null, renal: null, hep: null }; selAll('#tp_flow'); tpRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_rbc', 'blood-rbc', [
    { q: '平躺 4 小時或輸 20 mL/kg 食鹽水後，Hct 大約？', o: ['不變', '降約 4%，相當於少一單位血', '上升', '降 10%'], a: 1, why: 'Hct 是濃度，血漿量一變就變。ICU 病人血漿量常偏多，所以 Hb／Hct 會高估貧血——而所有輸血研究用的都是這個指標。' },
    { q: '發炎性貧血與缺鐵性貧血怎麼分？', o: ['MCV', '血清鐵', 'Ferritin：發炎 >100、缺鐵 <30 μg/L', 'TIBC'], a: 2, why: 'Hepcidin 把鐵封在巨噬細胞裡，鐵、TIBC、transferrin 都低、與缺鐵無法區分，只有 ferritin 反向。' },
    { q: '等容性貧血要到什麼程度組織氧合才受損？', o: ['Hb <10', 'Hb <7', 'Hct 約 10%（Hb 3 g/dL），氧萃取到 50% 上限之後', 'Hct <30%'], a: 2, why: '黏稠度降 → 心輸出量升，萃取升到 50% 之前 VO₂ 恆定。JW 病人 Hb 3–4 存活 75%、健康人 Hb 5 無害。' },
    { q: '穩定重症病人（無冠心病）的輸血門檻，多數指引訂在？', o: ['Hb <10', 'Hb <9', 'Hb <7；冠心病或心臟／骨科手術 <8', 'Hct <30%'], a: 2, why: '7–8 vs 9–10 結局相同（含心臟事件）、少用血 41%；含心臟術後與敗血性休克。但 60% 的輸血不照指引。' },
    { q: '輸 1–2 單位讓 Hb 從 6.4 升到 8，全身 VO₂ 的變化是？', o: ['升 25%', '不變——DO₂ 升但萃取降', '降低', '倍增'], a: 1, why: '多項研究一致；久存血甚至讓組織氧合變差。指引明言：不該把輸血當成改善組織氧合的方法。' },
    { q: '輸血中突發發燒、腰痛、低血壓，第一步是？', o: ['給退燒藥', '立刻停止輸血、核對血袋與病人', '減慢速度', '給 diphenhydramine'], a: 1, why: '急性溶血的嚴重度與已輸入量成正比。血庫查血漿游離血紅素與 direct Coombs。' },
    { q: 'TRALI 與 TACO 的鑑別，支持 TACO 的是？', o: ['發燒', '第一小時發作', '既有心衰竭或腎衰竭、液體過多的證據', 'CRP 升高'], a: 2, why: '兩者都在 6 小時內、都可發燒。TRALI 死亡率近 50%（抗白血球抗體）；TACO 1%、死亡率 20%，與單位數無關，給利尿劑。' }
  ]);
  I.renderQuiz('qz_plt', 'blood-plt', [
    { q: '臨床上有意義的血小板低下門檻是？', o: ['<150k', '<100k（止血栓形成能力保留到此）', '<50k', '<20k'], a: 1, why: '沒有結構性病灶時 5k 也可耐受；<10k 的風險是自發腦出血但少見。ICU 發生率高達 60%，最常見原因是敗血症。' },
    { q: 'HIT 最令人擔心的後果是？', o: ['出血', '血栓（未治療 VTE 17–55%），25% 血栓先於血小板下降', '腎衰竭', '過敏'], a: 1, why: 'PF4-heparin 抗體活化血小板；血小板降 50% 但很少 <20k。所有 HIT 都要全量抗凝，延遲抗凝血栓多 10 倍。' },
    { q: '4Ts 中機率的正確處置？', o: ['繼續 heparin、等 ELISA', '停 heparin、改非 heparin 抗凝、送 ELISA；陰性再回 heparin', '直接開 warfarin', '輸血小板'], a: 1, why: 'ELISA 陰性可排除、陽性不能確診（SRA 才是金標準）。Warfarin 在急性 HIT 絕對禁忌。' },
    { q: 'Argatroban 的起始劑量與監測？', o: ['5 μg/kg/min，看 INR', '1–2 μg/kg/min（肝功能不全 0.5），aPTT 1.5–3 倍，腎不調', '固定 1 mg/hr', '需依腎功能調整'], a: 1, why: '持續到血小板 >150k，之後可換 rivaroxaban 1–3 個月；PCI 用 bivalirudin。' },
    { q: '有 schistocytes、血小板低，但 INR／aPTT／fibrinogen 正常、Cr 1.4，最可能是？', o: ['DIC', 'TTP——立刻血漿置換', 'HUS', 'HIT'], a: 1, why: 'DIC 才有凝血因子消耗；HUS 腎衰竭較重。TTP 不治 24–48 小時可致死，48 小時內置換存活 90%。' },
    { q: '預防性血小板輸注的門檻（AABB）？', o: ['<50k 一律輸', '無出血 ≤10k；手術／LP <50k；CVC <20k——但都未驗證', '<100k', '<150k'], a: 1, why: '活動性出血 >50k、顱內出血 >100k。微血管病不輸。沒有出血時問題不在血小板數而在原因。' },
    { q: 'INR 為什麼是 FFP 的誤導指標？', o: ['INR 只在 warfarin 有效', 'FFP 降 INR 的同時也提高 antithrombin 等抗凝蛋白，淨止血能力可能沒變', 'INR 不受 FFP 影響', 'INR 在 ICU 不準'], a: 1, why: 'ICU 大多數 FFP 用在 INR 高但沒出血的病人，沒有證據減少出血。Warfarin 逆轉改用 4F-PCC（100 mL、<30 分鐘）。' }
  ]);
})();
