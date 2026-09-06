/* ICU Book · Section II ICU 常規 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 4–6（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function chk(id) { var e = document.getElementById(id); return !!(e && e.checked); }
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }

  /* ================= Ch4：壓力性潰瘍出血風險（BMJ 2020 分層） ================= */
  I.bindCalc('c4sup', function () {
    var mv = val('sup_mv') === 'yes', feed = val('sup_feed') === 'yes', liver = chk('sup_liver'), coag = chk('sup_coag');
    var mod = num('sup_mod'); if (!isFinite(mod)) mod = 0;
    var modCount = mod + ((mv && feed) ? 1 : 0);
    var level, pct, need;
    if ((mv && !feed) || liver) { level = '最高風險'; pct = '8–10%'; need = true; }
    else if (coag || modCount >= 2) { level = '高風險'; pct = '4–8%'; need = true; }
    else if (modCount === 1) { level = '中度風險'; pct = '2–4%'; need = false; }
    else { level = '低風險'; pct = '<2%'; need = false; }
    var h = '';
    h += row('顯著出血風險', level, '', need ? 'fl-hot' : 'fl-ok', pct, need ? '指引：給預防' : '指引：不給預防');
    h += row('中度風險條件數', fmt(modCount, 0), '項', 'fl-na', mv && feed ? '含「呼吸器＋有餵食」' : '');
    h += '<div class="rx-flag">' + (need ? '書中的選擇順序：能餵就餵（足量腸道餵食本身就是預防）；要用藥則 PPI（pantoprazole 40 mg qd）效力 > H₂（famotidine 20 mg q12h，CrCl <50 減半）> sucralfate（1 g q6h，不能與管灌併用）。<b>沒有一種有存活效益</b>；SUP-ICU：對照 4.2%、絕對效果 1.7%，把 C. difficile、肺炎、心肌缺血算進去後淨效益為零。' : '不建議預防。類固醇與治療性抗凝都<b>不是</b>危險因子；>80% ICU 病人在吃預防藥、其中 70% 不需要。') + '</div>';
    document.getElementById('c4sup_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch5：預防劑量調整器 ================= */
  I.bindCalc('c5dose', function () {
    var w = num('vt_w'), hcm = num('vt_h'), crcl = num('vt_crcl'), hit = chk('vt_hit');
    var bmi = (w > 0 && hcm > 0) ? w / Math.pow(hcm / 100, 2) : NaN;
    var h = '';
    h += row('BMI', fmt(bmi, 1), 'kg/m²', !isFinite(bmi) ? 'fl-na' : bmi >= 40 ? 'fl-warn' : 'fl-ok', !isFinite(bmi) ? '' : bmi >= 40 ? '≥40 病態肥胖：加量' : bmi >= 30 ? '肥胖：標準劑量可能不足' : '標準劑量');
    var ufh = (isFinite(bmi) && bmi >= 40) ? '7,500 U SC q8h' : '5,000 U SC q8–12h';
    h += row('UFH', ufh, '', 'fl-ok', '腎功能不調', 'q8h 與 q12h 效力與出血無差');
    var enox;
    if (isFinite(crcl) && crcl < 20) enox = '改用 UFH';
    else if (isFinite(crcl) && crcl < 30) enox = '30 mg SC qd（或改 UFH）';
    else if (isFinite(bmi) && bmi >= 40) enox = '40 mg SC q12h';
    else enox = '40 mg SC qd 或 30 mg q12h';
    h += row('Enoxaparin', enox, '', (isFinite(crcl) && crcl < 30) ? 'fl-warn' : 'fl-ok', isFinite(crcl) ? 'CrCl ' + fmt(crcl, 0) : '填 CrCl', 'HIT 0.2%（UFH 2.6%）；anti-Xa 峰值目標 0.2–0.5 IU/mL');
    h += row('Dalteparin', isFinite(bmi) && bmi >= 40 ? fmt(200 * w, 0) + ' U SC qd（200 U/kg，經驗建議）' : '2,500–5,000 U SC qd', '', 'fl-ok', '腎功能不調');
    var fonda = (isFinite(crcl) && crcl < 20) ? '禁用' : (isFinite(crcl) && crcl <= 50) ? '1.5 mg SC qd' : '2.5 mg SC qd';
    h += row('Fondaparinux', fonda, '', fonda === '禁用' ? 'fl-hot' : hit ? 'fl-ok' : 'fl-na', hit ? 'HIT 疑似／病史：可用' : 't½ 17 h', 'ICU 病人未研究');
    var doac = (isFinite(crcl) && crcl < 30) ? 'Dabigatran 禁；apixaban／rivaroxaban CrCl <15 禁' : 'Apixaban 2.5 mg bid；dabigatran 110 → 220 mg qd；rivaroxaban 10 mg qd';
    h += row('DOAC（只建議 THA／TKA）', doac, '', (isFinite(crcl) && crcl < 30) ? 'fl-warn' : 'fl-na', isFinite(bmi) && bmi >= 40 ? 'dabigatran 禁、apixaban／rivaroxaban 標準' : '', '胃繞道術後不用');
    if (isFinite(crcl) && crcl < 15) h += '<div class="rx-flag"><span class="f-bad">CrCl &lt;15：只能用 UFH 或 warfarin。</span></div>';
    document.getElementById('c5dose_out').innerHTML = I.wrap(h);
  });

  /* 神經軸操作前停藥時間 */
  I.bindCalc('c5nx', function () {
    var d = val('nx_drug'), t = num('nx_t');
    var wait = { ufh: 12, enox: 24, dabi: 48, riva: 48, apix: 24 }[d];
    var name = { ufh: 'UFH SC', enox: 'Enoxaparin qd', dabi: 'Dabigatran', riva: 'Rivaroxaban', apix: 'Apixaban' }[d];
    var left = wait - t;
    var h = row(name + ' 最短間隔', fmt(wait, 0), 'h', 'fl-na', d === 'dabi' || d === 'riva' || d === 'apix' ? '腎功能正常或中度下降' : '');
    h += row('距上一劑', fmt(t, 1), 'h', !isFinite(t) ? 'fl-na' : left > 0 ? 'fl-hot' : 'fl-ok', !isFinite(t) ? '' : left > 0 ? '還要等 ' + fmt(left, 1) + ' h' : '可以做');
    h += '<div class="rx-flag">脊椎穿刺、放置與<b>拔除</b>硬膜外／脊髓內導管都算。腎功能更差時 DOAC 要等更久（依 CrCl 查表）。</div>';
    document.getElementById('c5nx_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch6：BPS 與輸注換算 ================= */
  I.bindCalc('c6bps', function () {
    var f = num('bps_f'), a = num('bps_a'), v = num('bps_v');
    var s = f + a + v;
    var h = row('BPS 總分', fmt(s, 0), '/ 12', !isFinite(s) ? 'fl-na' : s >= 6 ? 'fl-hot' : 'fl-ok', !isFinite(s) ? '' : s >= 6 ? '≥6 疼痛不可接受' : '<6', '3 ＝ 無痛');
    h += '<div class="rx-flag">能自評就用 NRS（>3 不可接受）；<b>生命徵象與疼痛強度相關性差，不要拿心跳血壓當疼痛證據</b>。約 50% 病人靜息時就痛（下背與腿）、翻身是常見痛源。</div>';
    document.getElementById('c6bps_out').innerHTML = I.wrap(h);
  });

  var SED = {
    prop: { name: 'Propofol', unit: 'μg/kg/min', lo: 5, hi: 50, conc: 10000, ibw: true, note: '負荷 5 μg/kg/min × 5 分鐘（血行動力不穩不打負荷）；>80 μg/kg/min（>5 mg/kg/h）超過 48 小時是 propofol 輸注症候群的典型情境（發生率約 3%、死亡率 30–35%）。10% 脂肪乳劑 1 kcal/mL 要算進熱量。' },
    dex: { name: 'Dexmedetomidine', unit: 'μg/kg/h', lo: 0.2, hi: 1.5, conc: 4, ibw: false, note: '負荷 1 μg/kg／10 分鐘；不抑制呼吸、可用於非呼吸器病人；心搏過緩與低血壓（HFrEF 尤甚）；戒斷 30%。' },
    mid: { name: 'Midazolam', unit: 'mg/kg/h', lo: 0.02, hi: 0.1, conc: 1000, ibw: false, note: 'Bolus 0.01–0.05 mg/kg；連續輸注 ≤48 小時（脂溶累積：停藥後 30 小時才醒 vs lorazepam 4–5 小時）。' },
    lor: { name: 'Lorazepam', unit: 'mg/kg/h', lo: 0.01, hi: 0.1, conc: 1000, ibw: false, note: '>0.1 mg/kg/h 或 >10 mg/h 超過 48 小時 → propylene glycol 毒性（乳酸酸中毒、意識改變、腎衰）；監測滲透壓間隙 >10。' },
    fen: { name: 'Fentanyl', unit: 'μg/kg/h', lo: 0.7, hi: 10, conc: 10, ibw: false, note: 'Bolus 0.35–0.5 μg/kg q0.5–1h；PCA 15–75 μg／lockout 3–10 分；無活性代謝物但 ESRD 累積、脂溶腦累積。' },
    mor: { name: 'Morphine', unit: 'mg/h', lo: 2, hi: 30, conc: 1000, ibw: false, note: 'Bolus 2–4 mg q1–2h；PCA 0.5–3 mg／10–20 分；腎衰減半（M3G 躁動癲癇、M6G 更強止痛）；組織胺 → 低血壓。' },
    rem: { name: 'Remifentanil', unit: 'μg/kg/h', lo: 0.5, hi: 15, conc: 50, ibw: false, note: '負荷 1.5 μg/kg；血漿酯酶代謝、停藥 10 分鐘內消失、腎肝不調；突然停會戒斷，配長效類鴉片。' }
  };
  I.bindCalc('c6inf', function () {
    var d = SED[val('sd_drug')], w = num('sd_w'), hcm = num('sd_h'), sex = val('sd_sex'), dose = num('sd_dose'), conc = num('sd_conc');
    var ibw = I.ibw(sex, hcm);
    var wt = d.ibw && isFinite(ibw) ? ibw : w;
    var perH = NaN;
    if (isFinite(dose) && isFinite(wt)) {
      if (d.unit === 'μg/kg/min') perH = dose * wt * 60;          // μg/h
      else if (d.unit === 'μg/kg/h') perH = dose * wt;             // μg/h
      else if (d.unit === 'mg/kg/h') perH = dose * wt * 1000;      // μg/h
      else if (d.unit === 'mg/h') perH = dose * 1000;              // μg/h
    }
    var c = isFinite(conc) && conc > 0 ? conc : d.conc;             // μg/mL
    var mlh = perH / c;
    var fc = !isFinite(dose) ? 'fl-na' : dose < d.lo ? 'fl-warn' : dose > d.hi ? 'fl-hot' : 'fl-ok';
    var h = row(d.name + ' 劑量', fmt(dose, dose < 1 ? 2 : 1), d.unit, fc, !isFinite(dose) ? '' : dose < d.lo ? '低於起始' : dose > d.hi ? '超過書中上限' : '在範圍 ' + d.lo + '–' + d.hi, d.ibw ? '以理想體重 ' + fmt(ibw, 1) + ' kg 計' : '以實際體重計');
    h += row('輸注速率', fmt(mlh, 1), 'mL/h', 'fl-na', fmt(c, c < 10 ? 1 : 0) + ' μg/mL');
    if (val('sd_drug') === 'prop' && isFinite(mlh)) h += row('脂肪熱量', fmt(mlh * 24, 0), 'kcal/day', 'fl-na', '1 kcal/mL');
    if (val('sd_drug') === 'lor' && isFinite(perH)) h += row('每小時毫克', fmt(perH / 1000, 1), 'mg/h', perH / 1000 > 10 ? 'fl-hot' : 'fl-ok', perH / 1000 > 10 ? '>10 mg/h 監測滲透壓間隙' : '');
    h += '<div class="rx-flag">' + d.note + '</div>';
    document.getElementById('c6inf_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch4 要不要 SUP */
  var su = { mv: null, feed: null, other: null };
  window.suPick = function (k, v, btn) { flowSelect(btn); if (k === 'mv') { su = { mv: v, feed: null, other: null }; } else su[k] = v; suRender(); };
  function suRender() {
    var s2 = su.mv === 'yes'; flowShow('su_c2', s2); flowShow('su_s2', s2); if (!s2) flowClearSel('su_s2');
    var s3 = !!su.mv && (su.mv === 'no' || !!su.feed); flowShow('su_c3', s3); flowShow('su_s3', s3); if (!s3) flowClearSel('su_s3');
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (s3 && su.other) {
      var highest = (su.mv === 'yes' && su.feed === 'no') || su.other === 'liver';
      var high = su.other === 'coag';
      if (highest || high) { cls = 'rec-urgent'; t = (highest ? '最高風險（8–10%）' : '高風險（4–8%）') + '：指引建議預防——但先把腸道餵食開起來'; d = '<li>能餵就餵：足量腸道餵食既有黏膜營養效應又提高胃 pH，三個研究合併後<b>制酸藥的效益在足量餵食下消失</b>。</li><li>要用藥：pantoprazole 40 mg IV qd（PPI 效力最強，腎不調）；或 famotidine 20 mg q12h（CrCl <50 減半，避免神經毒性）；sucralfate 1 g q6h 只適合沒有管灌的病人。</li><li>知道代價：PPI 讓 C. difficile 三倍、肺炎增加；SUP-ICU 的複合結局與安慰劑無差。</li>'; n = 'BMJ 2020 指引分層；Marino：這是「更多麻煩而非價值」的常規。'; }
      else { cls = 'rec-blue'; t = '中度或低風險：不給預防'; d = '<li>顯著出血 <4%，藥物只減 1–2 個百分點，還換來 C. difficile 與肺炎。</li><li>類固醇（25 研究）與治療性抗凝都不是危險因子。</li><li>六個試驗顯示對高風險病人停 pantoprazole 也沒有增加出血。</li>'; n = '>80% ICU 病人在吃預防藥，70% 不需要。'; }
    }
    flowRec('su_rec', cls, t, d, n);
  }
  window.suReset = function () { su = { mv: null, feed: null, other: null }; selAll('#su_flow'); suRender(); };

  /* Ch5 選預防方案 */
  var vp = { set: null, bleed: null };
  window.vpPick = function (k, v, btn) { flowSelect(btn); vp[k] = v; vpRender(); };
  function vpRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (vp.set && vp.bleed) {
      if (vp.bleed === 'yes') { cls = 'rec-urgent'; t = '出血或高出血風險：先只用間歇氣壓加壓（IPC）'; d = '<li>絕對禁忌：顱內出血、臨床重要出血（SBP 降 ≥20、Hb 降 ≥2、輸 ≥2 U）；相對：頭脊創傷、反覆 GI 出血、血小板 <50k。月經不是禁忌。</li><li>IPC 踝 35–40／大腿 20 mmHg、10 秒一週期，壓力不可超過舒張壓；效果可等同抗凝，還促進纖溶。GCS 太弱不單用。</li><li>出血風險退了就加抗凝（TBI：CT 24 小時無進展；神經外科：出血風險降低後）。</li>'; }
      else {
        cls = 'rec-elective';
        var R = {
          gen: ['一般大手術：UFH 或 LMWH，高風險加 IPC', '<li>高風險常用 UFH 5,000 U q8h 或 enoxaparin 30 mg bid。</li><li>術前最後一劑：UFH 6 小時、LMWH 12 小時前；術後 6／12 小時可開始。</li><li>到能走或出院；腹盆腔癌症高風險延長 LMWH 4 週。</li>'],
          bari: ['減重手術：LMWH ＋ IPC，劑量加重、出院後延長', '<li>Enoxaparin 40 mg bid（BMI 30–49）、60 mg bid（BMI ≥50）。</li><li>80% 的 VTE 發生在出院後 → 延長約 2 週。</li>'],
          tka: ['髖／膝關節置換：DOAC 優於 LMWH，早期加 IPC', '<li>Apixaban 可能是首選（dabigatran、rivaroxaban 出血較多）。</li><li>延長預防到術後 35 天。Aspirin 單用不妥。</li>'],
          hip: ['髖骨折手術：LMWH', '<li>DOAC 在髖骨折沒有足夠研究；延長 35 天。</li>'],
          neuro: ['神經外科：先 IPC，出血風險過了高風險與癌症加 LMWH', ''],
          card: ['心臟手術：IPC；複雜或高風險加 LMWH', ''],
          trauma: ['重大創傷：enoxaparin 40 mg q12h ＋ IPC，監測 anti-Xa', '<li>實質器官或肢體：出血無虞後開始，理想 12–24 小時內。</li><li>TBI：IPC 至 CT 24 小時無新出血或進展，再 enoxaparin 30 mg q12h。</li><li>脊椎：enoxaparin 30 mg q12h 一旦安全就開始，IPC 儘早並持續。</li><li>腎功能常變動 → 監測 anti-Xa（峰值 0.2–0.5）。</li>'],
          med: ['內科急症與所有 ICU 病人：LMWH，不加機械式、不延長', '<li>Enoxaparin 40 mg qd；出院後不延長。</li><li>內科用 DOAC 效力同但出血多。</li>']
        }[vp.set];
        t = R[0]; d = R[1] + '<li><b>特殊狀況</b>：CrCl <15 只能 UFH 或 warfarin；BMI ≥40 加量（UFH 7,500 q8h、enoxaparin 40 bid）；HIT 疑似或病史用 fondaparinux。</li>';
        n = 'ASH 2018／2019、WTA 2020、ASMBS 2022。';
      }
    }
    flowRec('vp_rec', cls, t, d, n);
  }
  window.vpReset = function () { vp = { set: null, bleed: null }; selAll('#vp_flow'); vpRender(); };

  /* Ch6 鎮痛鎮靜路徑 */
  var sd = { pain: null, renal: null, need: null };
  window.sdPick = function (k, v, btn) { flowSelect(btn); sd[k] = v; sdRender(); };
  function sdRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (sd.pain && sd.renal && sd.need) {
      cls = 'rec-elective';
      var an = sd.renal === 'yes' ? 'fentanyl（無活性代謝物；ESRD 仍會累積）或 hydromorphone（腎不調）；morphine 要減半' : sd.pain === 'unstable' ? 'fentanyl（不釋放組織胺，血行動力最穩）' : 'fentanyl 或 hydromorphone；morphine 可用但注意組織胺低血壓';
      d = '<li><b>先止痛再鎮靜</b>：' + (sd.pain === 'none' ? '目前 NRS ≤3／BPS <6，仍要每班評估——50% 病人靜息也痛。' : '類鴉片首選 ' + an + '，劑量由反應決定不是表訂。') + '</li>';
      d += '<li>省類鴉片：acetaminophen 1 g IV q6h（≤4 g/day）、ketorolac 30 mg IV q6h（腎損／≥65 歲／<50 kg 減半，短期安全）、低劑量 ketamine 60–120 μg/kg/h（心肌缺血不建議）；神經痛用 gabapentin 600 q8h。</li>';
      var N = {
        vent_light: ['呼吸器、目標輕度鎮靜 RASS −1～−2：dexmedetomidine 或 propofol', '<li>Dexmedetomidine：合作式鎮靜、可隨時喚醒、不需 sedation holiday、譫妄最少，適合脫離呼吸器期與需頻繁神經評估者；小心心搏過緩／低血壓。</li><li>Propofol：起效 1–2 分鐘、輕鎮靜下 24 小時內停藥 13 分鐘醒；只能用於呼吸器病人；用 IBW；<b>避免 >80 μg/kg/min 超過 48 小時</b>。</li><li>避免 benzodiazepine 長期輸注（累積、譫妄）。</li>'],
        vent_deep: ['呼吸器、需要深鎮靜：propofol（短期）；必要時 lorazepam，midazolam ≤48 小時', '<li>深鎮靜的代價：propofol 深鎮靜 24 小時後要 25 小時才醒、14 天後 74 小時。</li><li>Lorazepam >0.1 mg/kg/h 或 >10 mg/h 超過 48 小時 → 監測滲透壓間隙（propylene glycol）。</li><li>每天 sedation holiday、以 RASS 為目標滴定。</li>'],
        nonvent: ['未插管：dexmedetomidine（不抑制呼吸）', '<li>Propofol 禁用於非呼吸器病人；benzodiazepine 與類鴉片併用會加重呼吸抑制與低血壓。</li>'],
        withdraw: ['酒精或類鴉片戒斷：benzodiazepine 是首選', '<li>Midazolam 快、lorazepam 久；連續輸注注意累積與 propylene glycol。</li>'],
        delirium: ['譫妄（非戒斷）：dexmedetomidine 首選；不耐受改 haloperidol', '<li>Haloperidol 5 mg IV（可加 midazolam 1–2 mg 求快）→ 15–20 分鐘無效加倍 10 mg → 再無效換藥 → 有效則以初始有效劑量的 25% q4–6h 維持。</li><li><b>QTc >500 ms 禁用</b>（TdP 3–4%，多在 QTc >500 或每日 >35 mg）；留意 NMS（高熱、僵硬、橫紋肌溶解）。</li><li>Benzodiazepine 會促進譫妄。</li>']
      }[sd.need];
      t = N[0]; d += N[1];
      n = 'SCCM PADIS 2018；RASS 目標 0～−2；40% 離開 ICU 的病人不記得住院期間發生的事。';
    }
    flowRec('sd_rec', cls, t, d, n);
  }
  window.sdReset = function () { sd = { pain: null, renal: null, need: null }; selAll('#sd_flow'); sdRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_gi', 'practices-gi', [
    { q: '胃酸的主要功能是？', o: ['消化蛋白質', '幫助鐵鈣吸收', '殺死吃進來的病原（抗菌防線）', '刺激胰液'], a: 2, why: 'Achlorhydria 病人並無吸收不良；Salmonella 在 pH 2 一小時內被清除。制酸 → Salmonella／Campylobacter 腸炎與 C. difficile 增加。' },
    { q: '口腔去污用 chlorhexidine 的現況是？', o: ['國際指引強烈建議', 'VAP 有效且降死亡率', '11 試驗合併顯示死亡率上升，指引已撤回建議；且它主要只對革蘭氏陽性菌', '2% 溶液效果更好'], a: 2, why: '2% 會造成黏膜炎；ICU 病人口咽定殖的是革蘭氏陰性菌。SOD（gentamicin＋colistin＋vancomycin 膏）反而有效卻少人用。' },
    { q: 'SDD 的證據與被忽視的理由？', o: ['沒有降低感染', '降低感染與死亡率、GN 菌血症 −67%；被忽視是因為擔心抗藥性，但 5 年與 16 年研究都沒看到', '會增加 MDR 菌血症', '只對外科病人有效'], a: 1, why: 'MDR 盛行的 ICU 效益消失；SDD 甚至消除了導管相關菌血症（暗示來源在腸道）。' },
    { q: '壓力性潰瘍的起因是？', o: ['胃酸太多', '黏膜低灌流（缺血），酸只是加重', '幽門螺旋桿菌', '類固醇'], a: 1, why: '胃 70–90% 血流供給黏膜；非低血壓病人也常有隱性胃低灌流。類固醇在 25 個研究合併後不是危險因子。' },
    { q: '依 BMJ 2020 分層，哪個屬於「最高風險」需要預防？', o: ['使用類固醇', '治療性抗凝', '呼吸器 >24 小時且沒有腸道餵食，或慢性肝病', '敗血症'], a: 2, why: '高風險：凝血病變或 ≥2 項中度條件；中度（2–4%）不建議預防，包括有餵食的呼吸器病人。' },
    { q: 'SUP-ICU 試驗的結論如何被 Marino 解讀？', o: ['PPI 顯著降低死亡率', 'PPI 減少出血 1.7 個百分點，但加上 C. difficile、肺炎、心肌缺血後複合結局與安慰劑無差——沒有淨效益', 'H2 blocker 優於 PPI', 'Sucralfate 是首選'], a: 1, why: '再加上足量腸道餵食就讓制酸效益消失，作者的結論是：餵食就是預防。' }
  ]);
  I.renderQuiz('qz_vte', 'practices-vte', [
    { q: 'LMWH 相對 UFH 的優點不包括？', o: ['生體可用率 90% vs 15–30%', 'HIT 0.2% vs 2.6%', '腎衰竭時不需調整', '劑量反應可預測、不需監測'], a: 2, why: 'Enoxaparin 經腎排除，CrCl <30 減至 30 mg qd 或改 UFH（<20 一定改 UFH）；dalteparin 才不需腎調整。' },
    { q: 'BMI ≥40 的病人，預防劑量怎麼調？', o: ['UFH 5,000 q12h 即可', 'UFH 7,500 U q8h 或 enoxaparin 40 mg q12h', '一律改 DOAC', 'Enoxaparin 20 mg qd'], a: 1, why: '分佈體積增加使標準劑量不足；apixaban／rivaroxaban 在肥胖用標準劑量，dabigatran 則禁用。' },
    { q: 'DOAC 用於 VTE 預防目前只建議在？', o: ['所有 ICU 病人', '髖／膝關節置換術', '創傷', '減重手術'], a: 1, why: '在 THA／TKA 優於 LMWH，apixaban 可能最佳；內科病人效力同但出血多；胃繞道後吸收不確定。' },
    { q: '間歇氣壓加壓（IPC）的正確敘述？', o: ['壓力越高越好', '踝 35–40、大腿 20 mmHg，不可超過舒張壓；促進靜脈回流與纖溶，可等同抗凝且與抗凝加成', '和 GCS 效果一樣', '不能用在出血病人'], a: 1, why: 'GCS 只有 18／8 mmHg，是最弱的方法、從不單用；IPC 正是出血病人的替代方案。' },
    { q: '重大創傷的 VTE 預防，正確的是？', o: ['等到出院再開始', 'Enoxaparin 40 mg q12h 在出血無虞後（理想 12–24 小時內）開始、加 IPC，並監測 anti-Xa', '只用 IPC', 'Warfarin'], a: 1, why: 'TBI 要等 CT 24 小時無進展再用 30 mg q12h；創傷未預防 DVT 高達 58%。' },
    { q: '硬膜外導管拔除前，enoxaparin 每日一次的病人至少要停多久？', o: ['6 小時', '12 小時', '24 小時', '48 小時'], a: 2, why: 'UFH SC 12 小時；dabigatran／rivaroxaban 48 小時、apixaban 24 小時（腎功能差要更久）。' }
  ]);
  I.renderQuiz('qz_sed', 'practices-sed', [
    { q: '無法自評的呼吸器病人，疼痛怎麼評？', o: ['看心跳血壓', 'Behavioral Pain Scale：臉部、上肢、呼吸器配合三項各 1–4 分，≥6 不可接受', 'RASS', '瞳孔'], a: 1, why: '生命徵象與疼痛強度相關性差；能自評用 NRS >3。' },
    { q: 'Fentanyl 取代 morphine 成為 ICU 首選類鴉片的理由？', o: ['更便宜', '600 倍脂溶起效快、不釋放組織胺、無活性代謝物', '不會累積', '可以口服'], a: 1, why: '缺點是脂溶累積在腦；ESRD 母藥仍會累積。Morphine 腎衰減半（M3G 躁動癲癇）。' },
    { q: 'Meperidine 為何不再用於 ICU？', o: ['太貴', 'Normeperidine 半衰期 15–40 小時，腎功能差時累積造成躁動、肌陣攣、癲癇', '止痛太弱', '會低血壓'], a: 1, why: '腎功能異常在 ICU 很常見，這個風險不可接受。' },
    { q: 'Lorazepam 連續輸注最該監測什麼？', o: ['血鉀', '滲透壓間隙——>0.1 mg/kg/h 或 >10 mg/h 超過 48 小時的 propylene glycol 毒性', 'QTc', '三酸甘油酯'], a: 1, why: '乳酸值不可靠；表現是乳酸酸中毒、意識改變、全身發炎、腎衰竭。' },
    { q: 'Propofol 輸注症候群的典型情境？', o: ['負荷劑量太快', '>80 μg/kg/min（>5 mg/kg/h）超過 48 小時：收縮性心衰竭、頑固乳酸酸中毒、橫紋肌溶解、腎衰', '用在腎衰竭病人', '和 fentanyl 併用'], a: 1, why: '中等速率也有報告；發生率約 3%，死亡率 30–35%。Propofol 用理想體重、只能用於呼吸器病人。' },
    { q: 'Dexmedetomidine 的「合作式鎮靜」指的是？', o: ['病人配合護理', '深鎮靜下仍可喚醒、不必停藥，放開又回到原本鎮靜狀態，EEG 似自然睡眠', '需要每天 sedation holiday', '會抑制呼吸'], a: 1, why: '不抑制呼吸、譫妄少、是 ICU 譫妄的首選；代價是心搏過緩與低血壓（HFrEF 尤甚）、戒斷 30%。' },
    { q: 'IV haloperidol 的禁忌與最被忽略的併發症？', o: ['QTc >500 ms；神經抑制劑惡性症候群', '腎衰竭；便秘', '肝衰竭；低血糖', '氣喘；支氣管痙攣'], a: 0, why: 'TdP 3–4%，多在 QTc >500 或每日 >35 mg；EPS 在 IV 給藥反而少見。' }
  ]);

  suRender(); vpRender(); sdRender();
})();
