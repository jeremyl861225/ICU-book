/* ICU Book · Section VII 心臟疾患 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 18–21（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch18 ================= */
  I.bindCalc('c18ef', function () {
    var edv = num('ef_edv'), sv = num('ef_sv'), bsa = num('ef_bsa');
    var ef = sv / edv * 100, edvi = edv / bsa;
    var cls = na(ef) ? '' : ef >= 50 ? 'HFpEF（舒張功能障礙）' : ef >= 41 ? 'HFmrEF（輕度收縮障礙）' : 'HFrEF（收縮功能障礙）';
    var h = row('射出分率 EF', fmt(ef, 0), '%', na(ef) ? 'fl-na' : ef >= 50 ? 'fl-ok' : 'fl-warn', na(ef) ? '' : cls, '正常 ≥55；心衰竭病人以 ≥50 為正常（後負荷可壓低 5–10%）');
    h += row('EDV 指數', na(edvi) ? '—' : fmt(edvi, 0), 'mL/m²', na(edvi) ? 'fl-na' : edvi > 97 ? 'fl-warn' : 'fl-ok', na(edvi) ? '選填 BSA' : edvi > 97 ? '>97：收縮功能障礙' : '≤97：舒張功能障礙', '容積才分得出收縮／舒張，壓力分不出');
    h += '<div class="rx-flag">舒張功能障礙已占左心衰竭 ≥50%：順應性 ＝ ΔEDV/ΔEDP 下降，EDV 變小、EF 保留但心搏量仍低。常見原因：心室肥厚、缺血頓抑、限制型心肌病變、心包填塞、呼吸器高胸內壓。</div>';
    document.getElementById('c18ef_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c18bnp', function () {
    var t = val('bn_t'), v = num('bn_v'), ob = val('bn_ob') === 'y', rf = val('bn_rf') === 'y';
    var cut = t === 'nt' ? 300 : 100;
    var h = row(t === 'nt' ? 'NT-proBNP' : 'BNP', fmt(v, 0), 'pg/mL', na(v) ? 'fl-na' : v < cut ? 'fl-ok' : 'fl-warn', na(v) ? '' : v < cut ? '<' + cut + '：心衰竭不太可能' : '≥' + cut + '：不排除，但不專一', t === 'nt' ? '半衰期較長，值約為 BNP 的 3–5 倍' : '');
    h += '<div class="rx-flag">' + (ob ? '肥胖：脂肪組織的受體會清除胜肽，數值偏低，排除力減弱。 ' : '') + (rf ? '腎衰竭：清除主要靠腎，數值會偏高。 ' : '') + '非心衰竭也會升高：心肌炎、心室肥厚、ACS、心包疾病、心房顫動、電擊、心臟手術、高齡、腎衰竭、貧血、肺栓塞、肺高壓、細菌性敗血症、重症本身——所以在 ICU 它適合<b>排除</b>心衰竭，不適合確診。</div>';
    document.getElementById('c18bnp_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c18ntg', function () {
    var dose = num('ng_d'), mg = num('ng_mg') || 50, ml = num('ng_ml') || 250;
    var conc = mg * 1000 / ml, rate = dose / conc * 60;
    var h = row('濃度', fmt(conc, 0), 'μg/mL', 'fl-na', mg + ' mg / ' + ml + ' mL');
    h += row('輸注速率', fmt(rate, 1), 'mL/hr', na(dose) ? 'fl-na' : dose > 200 ? 'fl-hot' : dose > 100 ? 'fl-warn' : 'fl-ok', na(dose) ? '' : dose > 200 ? '>200 μg/min 不建議' : dose > 100 ? '多數有效劑量 5–100' : '有效範圍內', '起始 5 μg/min，每 5 分加 5');
    h += '<div class="rx-flag">Nitroglycerin 會吸附 PVC（可損失 80%）：<b>用玻璃瓶＋聚乙烯管路</b>。連續輸注 >24 小時常見耐受性，長時間輸注的溶劑 propylene glycol 會造成乳酸酸中毒、譫妄、低血壓。20% 病人對 NTG 無反應 → nitroprusside（含 5 個氰化物；腎肝功能不全與缺血性心臟病不建議，可加 thiosulfate）。</div>';
    document.getElementById('c18ntg_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c18fur', function () {
    var home = num('fu_home') || 0, renal = val('fu_renal') === 'y', resp = val('fu_resp'), last = num('fu_last'), gfr = num('fu_gfr');
    var first = home > 0 ? home : (renal ? 80 : 40);
    var next = na(last) ? NaN : resp === 'no' ? Math.min(last * 2, 200) : last;
    var h = row('首劑 IV', fmt(first, 0), 'mg', 'fl-na', home > 0 ? '＝ 門診每日總量' : renal ? '腎功能不全 60–80' : '未用過 40', '5 分鐘起效、20–60 分高峰、2 小時結束');
    h += row('下一劑', na(next) ? '—' : fmt(next, 0), 'mg', na(next) ? 'fl-na' : (resp === 'no' && last >= 200) ? 'fl-hot' : 'fl-ok', na(next) ? '填上一劑與反應' : resp === 'no' ? (last >= 200 ? '200 mg 無效 ＝ furosemide 抗藥' : '2 小時尿量 <1 L → 加倍') : '有效劑量改 bid', '之後口服吸收只有 50%，可能要加量');
    h += row('等效換算', fmt(first / 40, 1) + ' / ' + fmt(first / 2, 0), 'mg', 'fl-na', 'bumetanide / torsemide', '40 mg furosemide ＝ 1 mg bumetanide ＝ 20 mg torsemide');
    if (!na(gfr)) h += row('連續輸注', gfr >= 30 ? '5 → 10 → 40' : '20 → 40', 'mg/hr', 'fl-na', 'eGFR ' + fmt(gfr, 0), '先 80 mg bolus；尿量 <100 mL/hr 再 bolus 並升速');
    h += '<div class="rx-flag">抗藥時：換 bumetanide／torsemide（生體可用率高）；加 metolazone 2.5–10 mg qd（腎功能不全仍有效，1 小時起效 9 小時高峰，要比 furosemide 早幾小時給；小心低血鉀）。<b>IV furosemide 會降心輸出量</b>（腎素 → angiotensin II 縮血管＋前負荷降），血壓高時先擴血管再利尿；HFpEF 與缺血性「flash」肺水腫要保守。</div>';
    document.getElementById('c18fur_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch19 ================= */
  I.bindCalc('c19qtc', function () {
    var qt = num('qt_qt'), hr = num('qt_hr');
    var rr = 60 / hr, qtc = qt / Math.sqrt(rr);
    var h = row('RR 間期', fmt(rr, 2), '秒', 'fl-na', '60 / HR');
    h += row('QTc（Bazett）', fmt(qtc, 3), '秒', na(qtc) ? 'fl-na' : qtc > 0.5 ? 'fl-hot' : qtc > 0.44 ? 'fl-warn' : 'fl-ok', na(qtc) ? '' : qtc > 0.5 ? '>0.50：torsade 風險' : qtc > 0.44 ? '延長（正常 ≤0.44）' : '正常', 'QT / √RR；V3–V4 量最可靠');
    h += '<div class="rx-flag">QT 延長在 ICU 很常見、torsade 卻少見——風險沒有廣告的那麼大。誘因：Class IA／III 抗心律不整藥、macrolide、phenothiazine／butyrophenone（haloperidol）、cisapride；低鉀、低鈣、低鎂。Torsade：不同步電擊＋MgSO₄ 1–2 g/15 分，補鉀鎂、停藥。</div>';
    document.getElementById('c19qtc_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c19cha', function () {
    var f = val('ch_f') === 'y';
    var s = (val('ch_c') === 'y' ? 1 : 0) + (val('ch_h') === 'y' ? 1 : 0) + (val('ch_d') === 'y' ? 1 : 0) + (val('ch_v') === 'y' ? 1 : 0) + (f ? 1 : 0) + ({ '0': 0, '1': 1, '2': 2 }[val('ch_a')] || 0) + (val('ch_s') === 'y' ? 2 : 0);
    var def = f ? 3 : 2, con = f ? 2 : 1;
    var cat = s >= def ? 'def' : s >= con ? 'con' : 'no';
    var h = row('CHA₂DS₂-VASc', fmt(s, 0), '分', cat === 'def' ? 'fl-hot' : cat === 'con' ? 'fl-warn' : 'fl-ok', cat === 'def' ? '確定抗凝（' + (f ? '女 ≥3' : '男 ≥2') + '）' : cat === 'con' ? '考慮抗凝（' + (f ? '女 2' : '男 1') + '）' : '不需抗凝', '確定者中風風險 ≥5 倍（年 >5%）');
    h += '<div class="rx-flag">瓣膜性 AF（二尖瓣狹窄、人工瓣）<b>一律抗凝、且 warfarin 優於 DOAC</b>；非瓣膜性 AF 首選 DOAC（同效、大出血較少；edoxaban 效果可能稍差、dabigatran 出血可能較多）。CrCl <30 全部減量、<15 避免。禁忌：活動性出血、腦出血史、顱內腫瘤、病灶未除的反覆出血、血小板 <50k；<b>跌倒史不是禁忌</b>。首次發作 <48 小時不需抗凝。</div>';
    document.getElementById('c19cha_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c19rate', function () {
    var wt = num('rt_w'), d = val('rt_d');
    var h = '';
    if (d === 'dilt') { h += row('Diltiazem bolus', fmt(wt * 0.25, 1), 'mg', 'fl-na', '0.25 mg/kg / 2 分', '1 小時內 55% 達標'); h += row('維持', '5–15', 'mg/hr', 'fl-na', '維持率達 90%', '低血壓 20–30%、負性肌力（HFrEF 慎用）'); }
    else if (d === 'esm') { h += row('Esmolol bolus', fmt(wt * 0.5, 0), 'mg', 'fl-na', '500 μg/kg', '半衰期 9 分鐘，好滴定'); h += row('維持', fmt(wt * 50 / 1000, 1) + '–' + fmt(wt * 200 / 1000, 1), 'mg/min', 'fl-na', '50–200 μg/kg/min', '每升一階前再 bolus'); }
    else if (d === 'meto') { h += row('Metoprolol', '2.5–5', 'mg IV / 2 分', 'fl-na', '每 5–10 分可重複', 'β 阻斷劑對 70% 有效，高腎上腺狀態最好'); }
    else if (d === 'amio') { h += row('Amiodarone 負荷', '150', 'mg / 10 分', 'fl-na', '可重複', '低血壓少（溶劑 polysorbate 80 造成）'); h += row('維持', '1 → 0.5', 'mg/min', 'fl-na', '6 小時 → 18 小時', '24 小時 ≤2.2 g；HFrEF 較宜；可能轉律'); }
    else if (d === 'dig') { h += row('Digoxin', '不單用', '', 'fl-warn', '起效慢，6 小時仍未達標', '只當 diltiazem／β 阻斷劑的輔助'); }
    else if (d === 'aden') { h += row('Adenosine', '6 → 12 → 12', 'mg 快速推', 'fl-na', '每 2 分鐘一階', '周邊靜脈＋沖管；>90% 終止 AVNRT'); h += row('經中央導管', '3 → 6 → 6', 'mg', 'fl-warn', '減半', '曾有心室停搏報告'); }
    else if (d === 'mg') { h += row('MgSO₄（MAT）', '2 g / 15 分 → 6 g / 6 小時', '', 'fl-na', '88% 轉律', '不看血鎂；先補鎂再補鉀'); }
    else if (d === 'vera') { h += row('Verapamil', '2.5–5', 'mg / 2 分', 'fl-na', '每 15–30 分可重複，總量 20 mg', 'MAT 轉律 <50% 但可減速；HFrEF 不用'); }
    var warn = (d === 'dilt' || d === 'esm' || d === 'meto' || d === 'dig' || d === 'vera') ? '<b>WPW 併 AF 禁用 AV 結阻斷劑</b>（旁路不受阻、可誘發 VF）：改電擊或 amiodarone／procainamide。' : '';
    h += '<div class="rx-flag">' + warn + ' 速率控制的終點沒有共識（80–110）；生理上更合理的終點是<b>脈搏短絀消失</b>。不穩定 → 同步電擊，雙相 100 J 多可成功（單相 200），固定能量比遞增有效；電擊前要 TEE 排除心房血栓。</div>';
    document.getElementById('c19rate_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c19amio', function () {
    var iv = num('am_iv') || 0, days = num('am_d') || 0;
    var oral = days * 800, total = iv + oral, left = Math.max(10000 - total, 0);
    var h = row('累積負荷量', fmt(total / 1000, 1), 'g', total >= 10000 ? 'fl-ok' : 'fl-na', total >= 10000 ? '達 10 g，可降到 100–200 mg qd' : '目標 10 g', 'IV ' + fmt(iv / 1000, 1) + ' g ＋ 口服 400 bid × ' + days + ' 天');
    h += row('尚需', fmt(left / 1000, 1), 'g', 'fl-na', left > 0 ? '≈ ' + fmt(Math.ceil(left / 800), 0) + ' 天 400 mg bid' : '完成');
    h += '<div class="rx-flag">轉口服：停輸注前 4–5 小時先給 400 mg 口服。前 24 小時 IV 約 1 g。IV amiodarone 沒有長期用藥的肺纖維化／甲狀腺問題；會延長 QT（torsade 罕見）、抑制 digoxin 與 warfarin 代謝。</div>';
    document.getElementById('c19amio_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch20 ================= */
  I.bindCalc('c20rep', function () {
    var st = val('rp_st'), hrs = num('rp_h'), pci = val('rp_pci'), tx = num('rp_tx') || 0, unst = val('rp_un') === 'y';
    var cls = 'fl-na', t = '', sub = '', msg = '';
    if (st === 'stemi') {
      if (pci === 'y') { cls = 'fl-hot'; t = '緊急 PCI'; sub = 'door-to-balloon ≤90 分（上限 120）'; msg = '>120 分死亡率顯著上升；AHA 目標 90 分留 30 分緩衝。'; }
      else if (tx <= 120) { cls = 'fl-hot'; t = '立即轉送 PCI 醫院'; sub = '預計 ' + tx + ' 分內可到，總 door-to-balloon ≤120'; msg = '美國 <30% 醫院能做 PCI，每 4 個 STEMI 就有 1 個先到非 PCI 醫院；120 分內轉送有存活效益。'; }
      else if (!na(hrs) && hrs > 12) { cls = 'fl-warn'; t = '轉送，不溶栓'; sub = '症狀 >12 小時溶栓已無存活效益'; msg = '溶栓效益隨時間遞減、12 小時後消失。'; }
      else { cls = 'fl-hot'; t = '先溶栓再轉送'; sub = 'door-to-needle ≤30 分'; msg = '轉送 >120 分時溶栓當橋接；查絕對／相對禁忌（第 47 章）。溶栓顯著出血 10%、致命 1%（fibrinogen <100 → cryo／濃縮製劑，不用 TXA）。'; }
    } else if (st === 'nstemi') {
      if (unst) { cls = 'fl-hot'; t = '緊急 PCI（盡快）'; sub = '不穩定、心因性休克、急性心衰竭或持續胸痛'; }
      else { cls = 'fl-warn'; t = 'PCI 24–72 小時內'; sub = '溶栓在 NSTEMI 無存活效益'; }
      msg = 'NSTEMI 不溶栓。';
    } else if (st === 'ua') { cls = 'fl-ok'; t = '穩定且無痛者住院期間可不做 PCI'; sub = '不穩定心絞痛'; msg = 'UA 是反覆的開—關式閉塞，無 ST 上升。'; }
    var h = row('再灌流策略', t || '—', '', cls, sub);
    if (st === 'stemi' && !na(hrs)) h += row('症狀至今', fmt(hrs, 1), '小時', hrs > 12 ? 'fl-warn' : 'fl-ok', hrs > 12 ? '溶栓窗已過' : '溶栓仍有效益（越早越大）');
    h += '<div class="rx-flag">' + msg + ' ECG 要在首次接觸 10 分鐘內；LBBB 或節律器遮蔽 ST 時視同 STEMI。CABG 留給 PCI 失敗且持續缺血者。</div>';
    document.getElementById('c20rep_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c20lys', function () {
    var wt = num('ly_w');
    var tnk = na(wt) ? NaN : wt < 60 ? 30 : wt < 70 ? 35 : wt < 80 ? 40 : wt < 90 ? 45 : 50;
    var a2 = Math.min(wt * 0.75, 50), a3 = Math.min(wt * 0.5, 35);
    var h = row('Tenecteplase', fmt(tnk, 0), 'mg 單次 bolus', 'fl-ok', '90 分通暢 85%', '最流行，無存活優勢');
    h += row('Alteplase', '15 → ' + fmt(a2, 0) + ' → ' + fmt(a3, 0), 'mg', 'fl-na', 'bolus → 30 分 → 60 分', '總量 ≤100 mg / 90 分；通暢 73–84%；較慢已不受青睞');
    h += row('Reteplase', '10 U × 2', '間隔 30 分', 'fl-na', '通暢 84%', '溶栓較快但無存活優勢');
    h += '<div class="rx-flag">三者都作用在血栓上的 plasminogen，限制全身纖溶。合併 UFH 60 U/kg（≤4,000）bolus → 12 U/kg/hr（≤1,000），aPTT 1.5–2 倍，24–48 小時；HIT 病史改 fondaparinux 2.5 mg IV → 隔天起 2.5 mg SC qd（CrCl <30 禁用）。</div>';
    document.getElementById('c20lys_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c20hep', function () {
    var wt = num('hp_w'), age = num('hp_age'), crcl = num('hp_cr'), hit = val('hp_hit') === 'y', set = val('hp_set');
    var h = '';
    if (!hit) {
      if (set === 'pci') { h += row('UFH bolus', fmt(Math.min(wt * 60, 4000), 0), 'U', 'fl-na', '60 U/kg，≤4,000'); h += row('UFH 輸注', fmt(Math.min(wt * 12, 1000), 0), 'U/hr', 'fl-na', '12 U/kg/hr，≤1,000', 'aPTT 1.5–2 倍，24–48 小時'); }
      else { var q = (!na(crcl) && crcl < 30) ? 'q24h（CrCl <30 減半）' : 'q12h'; h += row('Enoxaparin bolus', (!na(age) && age > 75) ? '不給' : '30', (!na(age) && age > 75) ? '' : 'mg IV', 'fl-na', (!na(age) && age > 75) ? '>75 歲不 bolus' : '15 分後開始 SC'); h += row('Enoxaparin SC', fmt(wt, 0), 'mg ' + q, 'fl-na', '1 mg/kg', 'PCI 非緊急或延後時'); }
    } else {
      if (set === 'pci') { h += row('Bivalirudin bolus', fmt(wt * 0.75, 0), 'mg', 'fl-na', '0.75 mg/kg'); h += row('Bivalirudin 輸注', fmt(wt * ((!na(crcl) && crcl < 30) ? 1 : 1.75), 0), 'mg/hr', 'fl-na', (!na(crcl) && crcl < 30) ? '1 mg/kg/hr（CrCl <30）' : '1.75 mg/kg/hr', 'PCI 成功後停'); }
      else { h += row('Fondaparinux', (!na(crcl) && crcl < 30) ? '禁用' : '2.5 → 2.5', 'mg IV → SC qd', (!na(crcl) && crcl < 30) ? 'fl-hot' : 'fl-na', (!na(crcl) && crcl < 30) ? 'CrCl <30' : '隔天起皮下，到心導管', '溶栓時的 HIT 替代'); }
    }
    h += row('Aspirin', '162–325 → 81', 'mg', 'fl-ok', '嚼碎頰黏膜吸收、不吞', '每 42 人救 1 命；過敏改 clopidogrel');
    h += row('P2Y12', 'PCI 前先給', '', 'fl-na', 'ticagrelor 180→90 bid／prasugrel／clopidogrel 300–600→75', 'ticagrelor 較優但 ICH 多（ICH 史禁）；prasugrel 中風／TIA 史禁；clopidogrel 術前停 5 天');
    h += '<div class="rx-flag">Eptifibatide／tirofiban（IIb/IIIa）給高風險緊急 PCI，由心導管團隊管理；CrCl <50／<30 輸注減半。長期：atorvastatin 80、RAA 抑制（sacubitril/valsartan；血管性水腫史禁）、β 阻斷劑。</div>';
    document.getElementById('c20hep_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c20tn', function () {
    var t0 = num('tn_0'), t1 = num('tn_1'), url = num('tn_u') || 14, hrs = num('tn_h');
    var d = (t1 - t0) / t0 * 100;
    var h = row('初值', fmt(t0, 0), 'ng/L', na(t0) ? 'fl-na' : t0 > url ? 'fl-warn' : 'fl-ok', na(t0) ? '' : t0 > url ? '高於第 99 百分位' : '正常', '各廠 hs-cTn 的參考值不同');
    h += row('1 小時變化', na(d) ? '—' : (d > 0 ? '+' : '') + fmt(d, 0), '%', na(d) ? 'fl-na' : Math.abs(d) > 10 ? 'fl-hot' : 'fl-ok', na(d) ? '' : Math.abs(d) > 10 ? '>10%：急性缺血（急性 MI）' : '平坦：非缺血性心肌損傷', '');
    var msg = '';
    if (!na(hrs) && hrs < 3) msg = '症狀 <3 小時：hs-cTn 可能還沒升，初值正常不能排除。';
    else if (!na(t0) && t0 > url && !na(d) && Math.abs(d) <= 10) msg = '升高但不變：心肌病變、持續心搏過速、心衰竭、肺高壓、敗血症等非缺血原因；顯著升高者通常仍收治檢查。';
    h += '<div class="rx-flag">' + msg + ' 80% 有胸部不適：深沉、無法定點、>15 分、可放射肩頸臂腹。尖銳、短暫、可定點、吸氣痛、按壓或動作誘發 → 不像 ACS；<b>NTG 止痛不是缺血的證據</b>（食道痙攣也會好）。</div>';
    document.getElementById('c20tn_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch21 ================= */
  I.bindCalc('c21o2', function () {
    var vo2 = num('ox_vo2') || 250, store = num('ox_st') || 1000, temp = num('ox_t');
    var f = na(temp) ? 1 : Math.pow(0.5, (37 - temp) / 10);
    var mins = store / (vo2 * f);
    var h = row('缺氧細胞死亡前的時間', fmt(mins, 1), '分鐘', mins < 6 ? 'fl-hot' : 'fl-warn', '全身氧存量 ÷ VO₂', '正常約 4–5 分鐘');
    if (!na(temp)) h += row('低溫校正 VO₂', fmt(vo2 * f, 0), 'mL/min', 'fl-na', temp + '°C', '冷水溺水是例外：代謝降、時窗延長');
    h += '<div class="rx-flag">全身氧只有約 1 公升、休息 VO₂ 250 mL/min → 血流停止 4 分鐘就用完。所以壓胸要在確認無脈搏 10 秒內開始：深 5–6 cm、100–120/分、完全回彈、每 2 分鐘換人；30:2，插管後每 6 秒一次（10/分）不停壓、不與壓胸同步。</div>';
    document.getElementById('c21o2_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c21et', function () {
    var e0 = num('et_0'), e20 = num('et_20'), rate = num('et_r');
    var d = (e20 - e0) / e0 * 100;
    var h = row('20 分鐘 ETCO₂', fmt(e20, 0), 'mmHg', na(e20) ? 'fl-na' : e20 <= 10 ? 'fl-hot' : e20 < 15 ? 'fl-warn' : 'fl-ok', na(e20) ? '' : e20 <= 10 ? '≤10：ROSC 機會低' : e20 < 15 ? '10–15：灰色帶' : '>15：繼續，可達 1.5 小時', 'ETCO₂ 隨心輸出量成比例變動');
    h += row('趨勢', na(d) ? '—' : (d > 0 ? '+' : '') + fmt(d, 0), '%', na(d) ? 'fl-na' : d > 0 ? 'fl-ok' : 'fl-warn', na(d) ? '填基線' : d > 0 ? '上升：ROSC 組的型態' : '下降：非 ROSC 組的型態', '≈ 心輸出量的變化幅度');
    if (!na(rate)) h += row('通氣次數', fmt(rate, 0), '/分', rate > 12 ? 'fl-hot' : 'fl-ok', rate > 12 ? '過快：intrinsic PEEP → 靜脈回流與冠狀灌流壓下降' : '10/分 正常', '實測平均可達 30/分');
    h += '<div class="rx-flag">ETCO₂ 也反映壓胸深度。手摸脈搏敏感度低又要中斷壓胸；超音波看頸動脈搏動較快但也要中斷。POCUS 找可逆原因（氣胸敏感 91%／專一 99%、心包積液 → 立即穿刺，心跳停止時 RV 舒張塌陷不可靠）；<b>心臟靜止不能當停止 CPR 的理由</b>（判讀者間差異大）。</div>';
    document.getElementById('c21et_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c21drug', function () {
    var wt = num('dr_w');
    var h = row('Epinephrine', '1 mg q3–5 分', 'IV/IO', 'fl-na', '第 2 次電擊後開始（非電擊律立即）', '升 ROSC、存活效益不明；冠狀灌流壓 +30% 持續 3 分');
    h += row('Amiodarone', '300 → 150', 'mg', 'fl-na', '第 3 次電擊後', '無藥則 lidocaine');
    h += row('Lidocaine', fmt(wt, 0) + '–' + fmt(wt * 1.5, 0) + ' → ' + fmt(wt * 0.5, 0) + '–' + fmt(wt * 0.75, 0), 'mg', 'fl-na', '1–1.5 → 0.5–0.75 mg/kg q5–10 分', '總量 ≤' + fmt(wt * 3, 0) + ' mg（3 mg/kg）');
    h += row('電擊', '120–200 J 雙相', '', 'fl-hot', '不同步；電後立刻壓 2 分鐘再看律', '可升到 360；三次無效只有 5% 好結局 → 考慮 ECMO');
    h += row('通氣', '500–600 mL · 10/分', '', 'fl-na', '單手壓袋約 600–700', '1 L 袋壓到半滿 ≈ 500');
    h += '<div class="rx-flag">5 分鐘內電擊存活 40%、20 分鐘 <10%。PEA／asystole：epinephrine 為主、不電擊；找 T：張力性氣胸、心包填塞、肺栓塞、冠狀動脈血栓。血管通路不中斷壓胸——骨內針常較周邊靜脈快又穩。</div>';
    document.getElementById('c21drug_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c21post', function () {
    var t = num('po_t'), map = num('po_map'), sa = num('po_sa'), glu = num('po_g');
    var h = row('體溫', na(t) ? '—' : fmt(t, 1), '°C', na(t) ? 'fl-na' : t > 37.7 ? 'fl-hot' : t <= 37.5 ? 'fl-ok' : 'fl-warn', na(t) ? '' : t > 37.7 ? '>37.7：啟動降溫裝置，目標 37.5' : t < 32 ? '過低' : t <= 36 && t >= 32 ? '輕度低溫：不主動回溫' : '≤37.5 達標', '維持 72 小時或到清醒；膀胱溫連續監測');
    h += row('MAP', na(map) ? '—' : fmt(map, 0), 'mmHg', na(map) ? 'fl-na' : map >= 75 ? 'fl-ok' : map >= 65 ? 'fl-warn' : 'fl-hot', na(map) ? '' : map >= 75 ? '≥75 較佳' : map >= 65 ? '65–74：可再高一點' : '<65 積極處理', '自動調節失效、腦血流靠血壓；norepinephrine 優於 epinephrine');
    h += row('SaO₂', na(sa) ? '—' : fmt(sa, 0), '%', na(sa) ? 'fl-na' : sa < 90 ? 'fl-hot' : sa > 98 ? 'fl-warn' : 'fl-ok', na(sa) ? '' : sa < 90 ? '<90 補氧' : sa > 98 ? '避免高氧（加重神經損傷）' : '適當', '');
    h += row('血糖', na(glu) ? '—' : fmt(glu, 0), 'mg/dL', na(glu) ? 'fl-na' : (glu >= 145 && glu <= 180) ? 'fl-ok' : 'fl-warn', na(glu) ? '' : (glu >= 145 && glu <= 180) ? '目標 145–180' : glu < 145 ? '偏低：嚴格控糖會低血糖' : '偏高：與差預後相關', '避開含糖輸液');
    h += '<div class="rx-flag">TTM 演變：33°C（2002）→ 36 同效（2013）→ 37.5 同效（2021）：現在的目標是<b>不發燒</b>。低溫的代價：低血壓、心搏過緩、顫抖要重鎮靜（延誤評估）。ROSC 後 70% 仍死於住院；腦損傷占死因 23–68%，心肌頓抑 72 小時內恢復。</div>';
    document.getElementById('c21post_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch18 急性心衰竭初步處置 */
  var hf = { bp: null, cong: null };
  window.hfPick = function (k, v, btn) { flowSelect(btn); hf[k] = v; hfRender(); };
  function hfRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (hf.bp === 'low') { cls = 'rec-urgent'; t = '低血壓或乳酸升高 ＝ 心因性休克，走第 16 章'; d = '<li>本章的處置只適用於沒有低灌流的急性左心衰竭。</li><li>不要給利尿劑；長期藥物（RAA 抑制、β 阻斷劑、SGLT2i、aldosterone 拮抗劑）在低血壓或低灌流時都不開。</li>'; }
    else if (hf.bp === 'high') { cls = 'rec-urgent'; t = '高血壓：先擴血管（nitroglycerin），血壓正常後仍鬱血才利尿'; d = '<li>NTG 5 μg/min 起、每 5 分加 5，多數 5–100，>200 不建議；玻璃瓶＋聚乙烯管；≤24 小時。</li><li>20% 對 NTG 無反應 → nitroprusside（腎肝功能不全、缺血性心臟病不用；可加 thiosulfate）。</li><li>IV furosemide 會經腎素→angiotensin II 急性縮血管，所以<b>血壓控制前不給</b>；有 PA 導管時 wedge 目標 18–20，>20 才加利尿。</li>'; n = '高血壓常是次發的（躁動、低血氧），偶爾才是主因（高血壓急症）。'; }
    else if (hf.bp === 'normal') {
      if (hf.cong === 'hypo') { cls = 'rec-elective'; t = '正常血壓但周邊灌流下降（PCO₂ gap 大）：考慮 nitroglycerin'; d = '<li>擴血管降前後負荷、升心輸出量、降肺微血管靜水壓。</li><li>利尿後若灌流變差，改用 NTG，有時反而要 bolus 一點輸液。</li>'; }
      else if (hf.cong === 'yes') { cls = 'rec-elective'; t = '正常血壓、靜脈鬱血：1 小時內給 IV furosemide'; d = '<li>1 小時內給利尿劑與較好結局相關。首劑：未用過 40 mg（腎功能不全 60–80）；門診有在吃＝每日總量；2 小時尿 <1 L 就加倍，到 200 mg。</li><li>三個警語：IV furosemide 會降心輸出量；肺水腫不等於液體過多（缺血性「flash」肺水腫）；HFpEF（50% 的病例）利尿會減少充填。利尿只在劑量有限時改善結局。</li><li>肺水腫：CPAP／非侵襲性正壓可升心輸出量、加速改善。</li>'; }
      else { cls = 'rec-elective'; t = '正常血壓：看有沒有周邊灌流下降的證據'; d = '<li>請回答第 2 步。</li>'; }
    }
    flowRec('hf_rec', cls, t, d, n);
  }
  window.hfReset = function () { hf = { bp: null, cong: null }; selAll('#hf_flow'); hfRender(); };

  /* Ch19 心搏過速辨識 */
  var ta = { qrs: null, reg: null, p: null, wp: null };
  window.taPick = function (k, v, btn) { flowSelect(btn); ta[k] = v; taRender(); };
  function taRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ta.qrs === 'narrow') {
      if (ta.reg === 'reg') {
        var R = { sinus: ['rec-blue', '竇性心搏過速：找原因，不治心跳', '<li>P 波與 PR 一致；起始漸進。心跳快通常是問題的證據，本身不一定是問題。</li>'], nop: ['rec-elective', 'AVNRT（陣發性 SVT）：迷走神經操作 → adenosine', '<li>140–250/分、突發、多無心臟病、女性較多；ICU 少見。改良式 Valsalva（吹完抬腿）44% vs 傳統 24%、頸動脈按摩 9%。</li><li>Adenosine 6 → 12 → 12 mg 快推＋沖管（中央導管減半）；>90% 終止；轉律後短暫心搏過緩／AV 阻斷 60 秒內自解、atropine 無效；dipyridamole 併用禁忌、氣喘禁忌。</li><li>無效 → diltiazem／verapamil；不穩定或抗藥 → 同步電擊（可能 >100 J）。</li>'], saw: ['rec-elective', '心房撲動（固定 2:1／3:1 阻斷）：處置同 AF', '<li>鋸齒波。速率控制與抗凝同心房顫動。</li>'] }[ta.p];
        if (R) { cls = R[0]; t = R[1]; d = R[2]; } else { cls = 'rec-elective'; t = '窄 QRS、規律：看 P 波'; d = '<li>請回答第 3 步。注意快速 AF 也可能看起來規律。</li>'; }
      } else if (ta.reg === 'irr') {
        var R2 = { multi: ['rec-elective', '多源性心房搏過速 MAT：補鎂鉀 → metoprolol → verapamil', '<li>老年、過半有慢性肺病；鎂鉀缺乏、冠心病。</li><li>MgSO₄ 2 g/15 分 → 6 g/6 小時（88% 轉律、不看血鎂；先鎂後鉀）。</li><li>無效且非 COPD → metoprolol（80%）；COPD 疑慮 → verapamil（<50% 轉律但可減速，HFrEF 不用）。</li>'], fib: ['rec-urgent', '心房顫動：穩定就速率控制，不穩定就同步電擊；再算 CHA₂DS₂-VASc', '<li>ICU 最常見。Diltiazem 0.25 mg/kg → 5–15 mg/hr（低血壓 20–30%、HFrEF 慎）；β 阻斷劑（esmolol 好滴定）；amiodarone 150 → 1 → 0.5 mg/min（HFrEF 較宜）；digoxin 不單用。</li><li><b>WPW 併 AF：禁 AV 結阻斷劑</b>，電擊或 amiodarone／procainamide。</li><li>電擊：雙相 100 J、固定能量、先 TEE；DOAC 盡早；<48 小時首發不需抗凝。</li>'] }[ta.p];
        if (R2) { cls = R2[0]; t = R2[1]; d = R2[2]; } else { cls = 'rec-elective'; t = '窄 QRS、不規律：看 P 波'; d = '<li>請回答第 3 步。</li>'; }
      } else { cls = 'rec-elective'; t = '窄 QRS（≤0.12 秒）＝ 上心室：看規不規律'; d = '<li>請回答第 2 步。</li>'; }
    } else if (ta.qrs === 'wide') {
      if (ta.reg === 'irr') { cls = 'rec-elective'; t = '寬 QRS 且不規律：幾乎都是 AF（或 MAT）併傳導異常——VT 從不不規律'; d = '<li>依 AF 處置；波高忽大忽小則是 torsade。</li>'; }
      else if (ta.reg === 'reg') {
        if (ta.wp === 'unstable') { cls = 'rec-urgent'; t = '血行動力學不穩：同步電擊，不管是 VT 還是 SVT 併傳導異常'; d = '<li>100 J（單相或雙相）終止多數單形 VT；無效再 100 J 雙相；可升到 200，避免 360（傷心肌）。</li>'; }
        else if (ta.wp === 'vt') { cls = 'rec-urgent'; t = '確定 VT（AV 分離、融合波、或有結構性心臟病）：IV amiodarone'; d = '<li>有心臟病者的寬 QRS 心搏過速 95% 是 VT——一律當 VT 處理。</li><li>多形 VT 持續 → 不同步電擊；torsade 加 MgSO₄ 1–2 g/15 分、補鉀鎂、停高風險藥（haloperidol 等）；QT 正常的多形 VT 是缺血，amiodarone／β 阻斷劑防復發。</li>'; }
        else if (ta.wp === 'unsure') { cls = 'rec-elective'; t = '穩定但不確定：給 adenosine 試——SVT 會突然終止，VT 不會'; d = '<li>對 adenosine 無反應 → 當 VT，IV amiodarone。</li><li>自行轉律後 QRS 仍寬 → 原本就有束支阻斷，是 SVT。</li>'; }
        else { cls = 'rec-elective'; t = '寬 QRS、規律：最可能 VT（快速 AF 併傳導異常也可能看似規律）'; d = '<li>請回答第 4 步。</li>'; }
      } else { cls = 'rec-elective'; t = '寬 QRS（>0.12 秒）：心室或上心室併傳導異常——先看規律性'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (ta.qrs) n = 'ECG 三件事：QRS 寬度、R-R 一致性、心房活動。';
    flowRec('ta_rec', cls, t, d, n);
  }
  window.taReset = function () { ta = { qrs: null, reg: null, p: null, wp: null }; selAll('#ta_flow'); taRender(); };

  /* Ch20 主動脈剝離警訊 */
  var ad = { pain: null, find: null };
  window.adPick = function (k, v, btn) { flowSelect(btn); ad[k] = v; adRender(); };
  function adRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ad.pain && ad.find) {
      var hi = ad.pain === 'tear' || ad.find === 'yes';
      cls = hi ? 'rec-urgent' : 'rec-blue';
      t = hi ? '疑 type A 主動脈剝離：影像確認、esmolol 先降心跳再降壓、外科' : '剝離證據不足，但每 3 例就漏 1 例——胸痛消失又回來要警覺';
      d = hi ? '<li>MRI 敏感／專一 98%；CT 血管攝影 94／87 也可；TEE 98／77。內膜瓣分隔真假腔。</li><li>目標收縮壓 120（可到 90）；<b>降壓不可伴心搏過速或心輸出量上升</b>——β 阻斷劑優先（esmolol 500 μg/kg → 50–200 μg/kg/min；labetalol 20 → 20–40 q10 分或 1–2 mg/min，≤300；metoprolol 5 mg ×3），nicardipine 只能與 β 阻斷劑合用。</li><li>IV 類鴉片止痛（痛 → 交感 → 心跳血壓上升）。</li><li>開刀是標準：發病後每小時死亡率增 1–2%，不開 60% 死亡、開刀可降到 10%；無心臟外科就轉院。</li>' : '<li>只有 5% 無痛；高血壓與主動脈瓣逆流各 50%；上肢脈搏不等只有 15%；縱膈增寬 60%（20% 胸片正常）；ECG 缺血 15%、正常 30%。</li><li>疼痛可自行消退數小時到數天，再痛常是破裂前兆——這是漏診的主因。</li>';
      n = 'Type A：升主動脈到頭臂動脈之間；逆行 → 主動脈瓣逆流、冠狀動脈閉塞、心包填塞；順行 → 弓部血管阻塞的神經缺損。';
    }
    flowRec('ad_rec', cls, t, d, n);
  }
  window.adReset = function () { ad = { pain: null, find: null }; selAll('#ad_flow'); adRender(); };

  /* Ch21 ACLS 分支 */
  var ca = { rhythm: null, shocks: null, et: null };
  window.caPick = function (k, v, btn) { flowSelect(btn); ca[k] = v; caRender(); };
  function caRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ca.rhythm === 'shock') {
      var s = ca.shocks;
      if (s === '1') { cls = 'rec-urgent'; t = 'VF／無脈 VT：電擊 120–200 J 雙相 → 立刻壓胸 2 分鐘 → 再看律'; d = '<li>壓胸只在電擊瞬間暫停。5 分鐘內電擊存活 40%、20 分鐘 <10%。</li>'; }
      else if (s === '2') { cls = 'rec-urgent'; t = '第 2 次電擊：加 epinephrine 1 mg q3–5 分'; d = '<li>可升能量。Epinephrine 升冠狀灌流壓 30%、持續 3 分鐘；β 效應可能抵銷效益並造成復甦後心衰竭；存活效益不明（PARAMEDIC2 30 天存活升但神經完整者少）。</li>'; }
      else if (s === '3') { cls = 'rec-urgent'; t = '第 3 次電擊：amiodarone 300 mg（→ 150）；無則 lidocaine 1–1.5 mg/kg'; d = '<li>三次電擊無效只有 5% 好結局 → 24 小時有 ECMO 的單位考慮 ECPR。</li>'; }
      else { cls = 'rec-elective'; t = '可電擊律：第幾次電擊？'; d = '<li>請回答第 2 步。</li>'; }
    } else if (ca.rhythm === 'noshock') { cls = 'rec-urgent'; t = 'PEA／asystole：epinephrine 1 mg q3–5 分，不電擊（除非轉成 VF/VT）'; d = '<li>找可逆原因 T：張力性氣胸、心包填塞、肺栓塞、冠狀動脈血栓——POCUS 幫得上（氣胸 91／99%、任何心包積液就穿刺）。</li>'; }
    if (ca.rhythm && ca.et) {
      d += ca.et === 'low' ? '<li><b>20 分鐘 ETCO₂ ≤10–15 mmHg：ROSC 機會低</b>，可考慮終止（心臟靜止不能單獨當理由）。</li>' : '<li>ETCO₂ 仍 >15 且上升：繼續，有到 1.5 小時仍神經完整的報告。</li>';
    }
    if (ca.rhythm) n = 'CPR 成功只有 1–7%，但 95% 民眾以為過半能回家。';
    flowRec('ca_rec', cls, t, d, n);
  }
  window.caReset = function () { ca = { rhythm: null, shocks: null, et: null }; selAll('#ca_flow'); caRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_hf', 'cardiac-hf', [
    { q: '區分收縮與舒張功能障礙，床邊最實用的是？', o: ['舒張末壓', 'EF（≥50 為 HFpEF，41–49 HFmrEF，≤40 HFrEF）', 'CVP', 'BNP'], a: 1, why: '壓力分不出兩者，容積（EDV 指數 >97 mL/m²＝收縮）才行；EDV 床邊難量，所以用 EF。舒張功能障礙已占 ≥50%。' },
    { q: '右心衰竭為什麼 CVP 常不升？', o: ['右心室不會擴大', 'RVEDV 增加要到心包限制才反映在 CVP', 'CVP 只反映左心', '因為三尖瓣逆流'], a: 1, why: '所以床邊靠 TTE：RV 腔正常是 LV 的 2/3，舒張期中隔變平＝容積過載；室間相依會讓左心舒張功能障礙。有 PA 導管時 CVP ≥ PAWP 要想右心衰竭或填塞。' },
    { q: '心腎症候群的主要機轉是？', o: ['心輸出量下降', '靜脈壓升高降低腎動靜脈壓差', '腎動脈狹窄', '利尿劑腎毒性'], a: 1, why: '心輸出量與腎功能不相關；MAP >70 腎自動調節仍在。低心輸出量只在心因性休克才是主角。主要治療是利尿。' },
    { q: 'BNP 在 ICU 最適合做什麼？', o: ['確診心衰竭', '排除心衰竭（BNP <100、NT-proBNP <300 不太可能）', '決定利尿劑劑量', '預測死亡'], a: 1, why: '敗血症、腎衰竭、貧血、肺栓塞、AF、高齡、重症本身都會升；肥胖偏低。' },
    { q: '高血壓的急性心衰竭，IV furosemide 要等到？', o: ['立刻給', '擴血管把血壓控制後仍有鬱血才給', '永遠不給', '給 NTG 後 24 小時'], a: 1, why: 'IV furosemide 刺激腎素 → angiotensin II 急性縮血管，還會降心輸出量（前負荷降＋後負荷升）。有 PA 導管時 wedge >20 才加。' },
    { q: 'Nitroglycerin 輸注的三個實務陷阱？', o: ['要冷藏、要避光、要過濾', 'PVC 吸附 80%（用玻璃瓶＋PE 管）、24 小時耐受、propylene glycol 中毒', '只能周邊給、要稀釋、要監測 INR', '會升高血鉀'], a: 1, why: '20% 對 NTG 無反應改 nitroprusside，但它含氰化物（腎肝功能不全不用、可加 thiosulfate）且會冠狀竊血（缺血性心臟病不用）。' },
    { q: 'Furosemide 抗藥時的做法？', o: ['再加倍到 400', '換 bumetanide／torsemide（40:1:20），或加 metolazone 2.5–10 mg 先給幾小時', '改 mannitol', '停利尿改透析'], a: 1, why: '200 mg 無效＝抗藥；原因是低白蛋白、腎低灌流、diuretic braking。Metolazone 腎功能不全仍有效但會低血鉀。大量過載可連續輸注（80 bolus → 5→10→40 或 20→40 mg/hr）。' }
  ]);
  I.renderQuiz('qz_tachy', 'cardiac-tachy', [
    { q: '窄 QRS、規律、看不到 P 波、突發 180/分，最可能是？', o: ['竇性心搏過速', 'AVNRT（陣發性 SVT）', '心房撲動', '心房顫動'], a: 1, why: '突發、無 P、140–250、多無心臟病。竇性是漸進且每個 QRS 前有 P。先改良式 Valsalva（44%），再 adenosine 6→12→12。' },
    { q: 'Adenosine 經中央靜脈導管給要注意？', o: ['劑量加倍', '劑量減半（曾有心室停搏）', '不能給', '要稀釋到 50 mL'], a: 1, why: '有效劑量是周邊靜脈研究出來的；快推＋沖管、貼導管接頭。轉律後 AV 阻斷 60 秒內自解、atropine 無效；氣喘與 dipyridamole 併用禁忌。' },
    { q: 'AF 併 WPW，不能用哪類藥？', o: ['Amiodarone', 'AV 結阻斷劑（diltiazem、β 阻斷劑、digoxin）', 'Procainamide', '電擊'], a: 1, why: '旁路不被阻斷、選擇性阻斷 AV 結反而誘發 VF。改電擊或 amiodarone／procainamide。' },
    { q: '寬 QRS 心搏過速且不規律，最可能是？', o: ['VT', 'AF（或 MAT）併傳導異常——VT 從不不規律', 'Torsade', '竇性併束支阻斷'], a: 1, why: '規律的寬 QRS 最可能 VT，有心臟病者 95% 是 VT。AV 分離與融合波是 VT 的直接證據；穩定但不確定可試 adenosine。' },
    { q: 'MAT 的第一線處置？', o: ['Adenosine', '補鎂（2 g/15 分 → 6 g/6 小時，88% 轉律）與鉀', '電擊', 'Digoxin'], a: 1, why: '老年、慢性肺病；血鎂正常也可能缺鎂，先鎂後鉀。之後 metoprolol（非 COPD，80%）或 verapamil。' },
    { q: 'AF 電擊的能量與前置作業？', o: ['單相 50 J、不需影像', '雙相 100 J、固定能量、先 TEE 排除心房血栓、DOAC 盡早', '360 J 遞增', '先 digoxin 6 小時'], a: 1, why: '雙相成功率高、能量低；新發 AF 最易成功；<48 小時首發不需抗凝。' },
    { q: 'CHA₂DS₂-VASc 男性 2 分的意義？', o: ['不需抗凝', '確定抗凝（女性 ≥3）', '只需 aspirin', '要 warfarin 不能 DOAC'], a: 1, why: '中風風險 ≥5 倍。非瓣膜性 AF 首選 DOAC；瓣膜性 AF 一律抗凝且 warfarin 較優。跌倒史不是禁忌。' }
  ]);
  I.renderQuiz('qz_acs', 'cardiac-acs', [
    { q: '胸痛被 nitroglycerin 緩解，代表？', o: ['確定心肌缺血', '不是缺血的證據——食道痙攣也會好', '排除主動脈剝離', '可以不做 ECG'], a: 1, why: 'ACS 的痛：深沉、無法定點、>15 分、可放射；尖銳短暫可定點、吸氣痛、按壓誘發 → 不像。ECG 要在 10 分鐘內。' },
    { q: 'hs-troponin 初值高、1 小時後變化 <10%，最可能？', o: ['急性 MI', '非缺血性心肌損傷（心肌病變、心搏過速、心衰竭、肺高壓、敗血症）', '檢驗錯誤', '不穩定心絞痛'], a: 1, why: '>10% 變化才是急性缺血。症狀 <3 小時初值可能還沒升。顯著升高者通常仍收治。' },
    { q: 'STEMI 到了非 PCI 醫院、轉送預計 150 分鐘，該？', o: ['直接轉送', '30 分鐘內溶栓（若症狀 <12 小時）再轉送', '等 PCI 團隊', '給 heparin 觀察'], a: 1, why: 'Door-to-balloon >120 分死亡率上升；轉送 >120 分用溶栓當橋接；12 小時後溶栓無存活效益。NSTEMI 不溶栓。' },
    { q: 'ACS 病人 SaO₂ 95%，要不要給氧？', o: ['要，一律高流量', '不要——SaO₂ ≥90% 給氧無益，氧會收縮冠狀動脈、活性氧加重再灌流傷害', '給到 100%', '只給 2 L'], a: 1, why: 'DETO2X：常規氧無益。只在 SaO₂ <90% 給。' },
    { q: 'ACS 早期 β 阻斷劑要避開的情況？', o: ['高血壓', '急性心衰竭、收縮壓 <120（心因性休克風險）、古柯鹼（無對抗的 α 收縮）', '心搏過速', '糖尿病'], a: 1, why: '穩定後 HFrEF 長期仍建議。傳統禁忌：心搏過緩、低血壓、高度 AV 阻斷。' },
    { q: 'Ticagrelor 與 prasugrel 各自的禁忌？', o: ['腎衰竭／肝衰竭', 'Ticagrelor：顱內出血史；prasugrel：近期中風或 TIA', '年齡 >75／<60 kg', '氣喘／COPD'], a: 1, why: 'Ticagrelor 優於 clopidogrel 但 ICH 較多；prasugrel 防支架血栓較強但出血多。Clopidogrel 是前驅藥、術前停 5 天、CABG 在即不用。Aspirin 嚼碎頰吸收、每 42 人救 1 命。' },
    { q: '主動脈剝離的降壓原則？', o: ['Nicardipine 單用快速降壓', 'β 阻斷劑優先（esmolol），收縮壓目標 120，擴血管只能與 β 阻斷劑合用', '不降壓以維持灌流', '先給 NTG'], a: 1, why: '降壓不可伴心搏過速或心輸出量上升（剪力）。Type A 每小時死亡率增 1–2%，開刀可降到 10%；每 3 例漏 1 例，疼痛自行消退是主因。' }
  ]);
  I.renderQuiz('qz_arrest', 'cardiac-arrest', [
    { q: '血流停止後多久細胞開始缺氧死亡？', o: ['30 秒', '4–5 分鐘（全身氧約 1 L ÷ VO₂ 250 mL/min）', '15 分鐘', '1 小時'], a: 1, why: '冷水溺水是例外。壓胸要在確認無脈搏 10 秒內開始：5–6 cm、100–120/分、完全回彈、2 分鐘換人。' },
    { q: 'CPR 時通氣過快的害處？', o: ['低血氧', 'Intrinsic PEEP → 靜脈回流與冠狀灌流壓下降', '胃脹氣', '沒有害處'], a: 1, why: '實測平均 30/分（建議的 3 倍）。插管後每 6 秒一次、不與壓胸同步；500–600 mL 或看到胸起伏；單手壓袋約 600–700。' },
    { q: '第 3 次電擊仍是 VF，該加什麼？', o: ['Epinephrine 3 mg', 'Amiodarone 300 mg（→150），無藥則 lidocaine 1–1.5 mg/kg', 'Vasopressin', 'Atropine'], a: 1, why: 'Epinephrine 在第 2 次電擊後開始、1 mg q3–5 分。三次無效只有 5% 好結局 → 考慮 ECMO。' },
    { q: 'CPR 20 分鐘 ETCO₂ 仍 8 mmHg，意義？', o: ['壓胸品質好', 'ROSC 機會低（門檻 10–15）', '要加大通氣', '要給碳酸氫鈉'], a: 1, why: 'ETCO₂ 隨心輸出量成比例變動；ROSC 組上升、非 ROSC 組下降。>15 且上升可繼續到 1.5 小時。' },
    { q: 'ROSC 後昏迷的體溫目標（2022 指引）？', o: ['33°C 24 小時', '≤37.5°C 72 小時：防發燒；>37.7 才啟動降溫；輕度低溫不主動回溫', '36°C 48 小時', '不需控制'], a: 1, why: 'TTM（33 vs 36）與 TTM2（33 vs 37.5）都無差；低溫的代價是低血壓、心搏過緩、顫抖要重鎮靜。' },
    { q: 'ROSC 後的血壓與升壓劑？', o: ['MAP ≥65、epinephrine 繼續', 'MAP ≥75 較佳、norepinephrine 優於 epinephrine（心血管死亡與神經預後）', 'MAP ≥90、vasopressin', '不需升壓'], a: 1, why: '腦自動調節失效、腦血流靠血壓。也要避免高氧（SaO₂ <90 才給氧）、血糖 145–180、避開含糖輸液。' },
    { q: '哪一項是高確定度的差預後指標？', o: ['第 1 天不清醒', '去大腦姿勢', 'ROSC 後任何時間的肌陣攣性癲癇重積、第 4 天雙側瞳孔或角膜反射消失、N20 雙側消失', '第 3 天仍需呼吸器'], a: 2, why: '80–95% 會醒的人 72 小時內醒，但可到 5 天以上（低溫者更久）；早期肌陣攣不等於無望；去大腦姿勢不是高確定度指標。EEG 等電位、非抽搐性重積、抑制背景併週期放電；CT 瀰漫腦水腫（第 2 天起）。' }
  ]);
})();
