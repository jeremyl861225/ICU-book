/* ICU Book · Section IX 呼吸治療 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 25–30（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }
  function pbw(cm, sex) { if (na(cm)) return NaN; return (sex === 'f' ? 45.5 : 50) + 2.3 * (cm / 2.54 - 60); }

  /* ================= Ch25 ================= */
  I.bindCalc('c25cao2', function () {
    var hb = num('ca_hb'), sa = num('ca_sa');
    var base = 1.34 * 15 * 0.98 * 10, now = 1.34 * hb * sa / 100 * 10;
    var drop = (1 - now / base) * 100;
    var h = row('CaO₂', fmt(now, 0), 'mL/L', na(now) ? 'fl-na' : now < 92 ? 'fl-hot' : now < 181 ? 'fl-warn' : 'fl-ok', na(now) ? '' : now < 92 ? '<92：已低於輸血門檻的含量' : now < 181 ? '介於給氧門檻與輸血門檻之間' : '≥ 給氧門檻的含量', '1.34 × Hb × SaO₂ × 10');
    h += row('相對正常（197）', na(drop) ? '—' : '−' + fmt(drop, 0), '%', 'fl-na', 'Hb 15、SaO₂ 98% 為基準', 'SaO₂ 90% 只掉 8%；Hb 7 掉 64%');
    h += '<div class="rx-flag">給氧門檻（SaO₂ 90%）對應的 CaO₂ 只比正常少 8%，而組織氧合要到輸血門檻（Hb 7、CaO₂ 92）以下才受損——所以給氧門檻可以再低。COPD 惡化 PaO₂ <40 一小時以上 8 人乳酸全正常；模擬聖母峰頂 PaO₂ 30、SaO₂ 58% 乳酸 1.7；Messner 無氧登頂。給氧不升 VO₂（有氧代謝沒被限制）。</div>';
    document.getElementById('c25cao2_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c25dev', function () {
    var dev = val('dv_d'), flow = num('dv_f'), ins = num('dv_i') || 30;
    var D = { nc: ['低流量鼻導管', 1, 6, '24–40%', '>4 L/min 要加濕；可進食交談'], fm: ['一般面罩', 5, 10, '35–50%（最高約 60%）', '至少 5 L/min 沖掉呼出氣'], nrb: ['非再吸入面罩', 10, 15, '60–80%（理論 100%）', '閥門故障會再吸入 CO₂、袋沒充飽會低血氧——已不受青睞'], ven: ['空氣夾帶（Venturi）面罩', 2, 15, '24–50%，固定', '總流量常 ≥60 L/min；慢性 CO₂ 滯留者曾流行，脈搏血氧普及後式微'], oxy: ['OxyMask', 1, 15, '低流量即高濃度', '再吸入少於 NRB、濃度高於 Venturi；但不如 HFNO'], hf: ['高流量鼻導管 HFNO', 40, 60, '21–100%，獨立調', '加溫加濕、沖掉鼻咽死腔、升呼氣末肺容積、降呼吸功；閉嘴才有 2–3 cmH₂O PEEP'] }[dev];
    var est = dev === 'nc' && !na(flow) ? '≈ ' + fmt(20 + 4 * Math.min(flow, 6), 0) + '%（安靜呼吸）' : D[3];
    var h = row(D[0], D[1] + '–' + D[2], 'L/min', 'fl-na', 'FIO₂ ' + est, D[4]);
    h += row('病人吸氣流速', fmt(ins, 0), 'L/min', ins > (dev === 'hf' ? 60 : 15) ? 'fl-hot' : 'fl-ok', ins > (dev === 'hf' ? 60 : 15) ? '超過裝置供給：夾帶室內空氣、FIO₂ 下降' : '裝置供得上', '安靜 15、呼吸衰竭可達 120');
    h += '<div class="rx-flag">FIO₂ 由「氧氣流量 vs 病人吸氣流速」的平衡決定；低流量系統只適合輕度低血氧且無呼吸窘迫者。HFNO 是近年最大的進步：能矯正嚴重低血氧、讓呼吸舒服、減少 P-SILI，已建議取代一般給氧用於急性低血氧呼吸衰竭。</div>';
    document.getElementById('c25dev_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c25ao', function () {
    var se = num('ao_se'), ve = num('ao_ve'), fio2 = num('ao_f');
    var h = row('血清硒', na(se) ? '—' : fmt(se, 2), 'μmol/L', na(se) ? 'fl-na' : se < 0.72 ? 'fl-warn' : 'fl-ok', na(se) ? '選填' : se < 0.72 ? '低於 0.72–1.33' : '正常', '重症常偏低；一週無硒 glutathione peroxidase 就降');
    h += row('維生素 E', na(ve) ? '—' : fmt(ve, 2), 'mg/dL', na(ve) ? 'fl-na' : ve < 0.5 ? 'fl-warn' : 'fl-ok', na(ve) ? '選填' : ve < 0.5 ? '<0.5 缺乏' : '正常約 1', 'ARDS 常缺乏');
    h += row('FIO₂', na(fio2) ? '—' : fmt(fio2, 0), '%', na(fio2) ? 'fl-na' : fio2 > 60 ? 'fl-hot' : 'fl-ok', na(fio2) ? '' : fio2 > 60 ? '>60%：肺氧毒性門檻——重症者抗氧化物不足，可能更低' : '≤60', '用最低可耐受的 FIO₂');
    h += row('創傷抗氧化組合', 'C 1000 q8h · E 1000 U q8h · Se 200 μg qd', '× 7 天', 'fl-na', '呼吸衰竭與呼吸器依賴顯著減少', '硒安全上限 200 μg/天；SIC 試驗 1000 μg IV 提升存活');
    h += '<div class="rx-flag">O₂ 的代謝中間物（superoxide、H₂O₂、hydroxyl radical）是活性氧；正常 95% 直接還原成水、只 3% 生成 ROS，但發炎時中性球呼吸爆發 VO₂ 升 20 倍專門造氧化劑。防線：SOD、glutathione（細胞內主力，N-acetylcysteine 可補）、硒、維生素 E（斷鏈）、維生素 C、ceruloplasmin／transferrin（鎖住游離鐵）。健康人 100% O₂ 6–12 小時就氣管支氣管炎與吸收性肺塌陷。</div>';
    document.getElementById('c25ao_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch26 ================= */
  I.bindCalc('c26niv', function () {
    var type = val('nv_t'), ipap = num('nv_ip'), epap = num('nv_ep'), a0 = num('nv_0'), a1 = num('nv_1');
    var h = row('IPAP', na(ipap) ? '—' : fmt(ipap, 0), 'cmH₂O', na(ipap) ? 'fl-na' : (ipap >= 10 && ipap <= 20) ? 'fl-ok' : 'fl-warn', na(ipap) ? '' : (ipap >= 10 && ipap <= 20) ? '常用 10–20' : '超出常用範圍：耐受差、漏氣', '');
    h += row('EPAP／PEEP', na(epap) ? '—' : fmt(epap, 0), 'cmH₂O', na(epap) ? 'fl-na' : (epap >= 5 && epap <= 10) ? 'fl-ok' : 'fl-warn', na(epap) ? '' : (epap >= 5 && epap <= 10) ? '常用 5–10' : '超出常用範圍', '壓力支持 ＝ ' + (na(ipap) || na(epap) ? '—' : fmt(ipap - epap, 0)));
    if (type === 'hc') { var d = (a0 - a1) / a0 * 100; h += row('1 小時 PaCO₂ 降幅', na(d) ? '—' : fmt(d, 0), '%', na(d) ? 'fl-na' : d >= 10 ? 'fl-ok' : 'fl-hot', na(d) ? '' : d >= 10 ? '≥10%：有反應' : '<10%：NIV 失敗，考慮插管', '意識改變恢復較慢，不能當早期失敗指標'); }
    else { var dd = a1 - a0; h += row('1 小時 P/F 變化', na(dd) ? '—' : (dd > 0 ? '+' : '') + fmt(dd, 0), 'mmHg', na(dd) ? 'fl-na' : dd > 0 ? 'fl-ok' : 'fl-hot', na(dd) ? '' : dd > 0 ? '有反應' : '沒升：NIV 失敗，嚴重或高失敗率疾病就插管', 'CPE 失敗率最低、CAP 最高、ARDS 看嚴重度'); }
    h += '<div class="rx-flag">NIV 最成功的是 COPD 急性高碳酸（17 篇研究：插管大減、存活小增；慢性高碳酸無效）；肥胖低通氣也有效。低血氧型：HFNO 與 NIV 插管率相當、免疫不全者 HFNO 更好、還能吃東西——低血氧型應優先 HFNO。面罩不耐受占失敗 18%；頭盔插管與死亡更少但成人少用。</div>';
    document.getElementById('c26niv_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c26aft', function () {
    var lv = num('af_lv'), ppl = num('af_ppl');
    var aft = lv - ppl;
    var h = row('左心室後負荷（跨壁壓）', fmt(aft, 0), 'mmHg', 'fl-na', '腔內壓 − 肋膜壓', na(ppl) ? '' : ppl < 0 ? '負胸內壓（自主吸氣）→ 後負荷上升' : ppl > 0 ? '正胸內壓 → 後負荷下降、幫左心室排空' : '');
    h += '<div class="rx-flag">正壓呼吸對心臟：<b>前負荷</b>降（靜脈回流梯度降、肺靜脈受壓、跨壁充填壓降——右心更明顯、肺血管阻力升推中隔），低血容時放大；<b>後負荷</b>降（吸氣期收縮壓反而升＝反向脈搏奇異）。正常心臟在前負荷曲線陡段 → 正壓多半降心輸出量、要維持血量；衰竭心臟在後負荷曲線陡段 → 正壓升心輸出量——這就是 CPAP／NIV 治心因性肺水腫的道理（3CPO：CPAP 與 NIV 同效）。</div>';
    document.getElementById('c26aft_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch27 ================= */
  I.bindCalc('c27mech', function () {
    var pk = num('mc_pk'), pl = num('mc_pl'), peep = num('mc_peep') || 0, auto = num('mc_auto') || 0, vt = num('mc_vt');
    var tot = peep + auto, pres = pk - pl, cst = vt / (pl - tot), dp = pl - tot, lost = 3 * pk, vtAct = vt - lost;
    var h = row('阻力壓 Ppeak − Pplat', fmt(pres, 0), 'cmH₂O', na(pres) ? 'fl-na' : pres > 10 ? 'fl-warn' : 'fl-ok', na(pres) ? '' : pres > 10 ? '偏高：氣道阻力、管子、分泌物' : '正常', '氣道阻力的部分');
    h += row('肺泡壓 Pplat', na(pl) ? '—' : fmt(pl, 0), 'cmH₂O', na(pl) ? 'fl-na' : pl <= 30 ? 'fl-ok' : 'fl-hot', na(pl) ? '' : pl <= 30 ? '≤30 達標' : '>30 肺泡破裂風險', '吸氣末閉鎖：無流量時＝肺泡壓＝彈性回縮壓');
    h += row('驅動壓', na(dp) ? '—' : fmt(dp, 0), 'cmH₂O', 'fl-na', 'Pplat − 總 PEEP', '總 PEEP ' + fmt(tot, 0) + '（外加 ' + fmt(peep, 0) + ' ＋ 內生 ' + fmt(auto, 0) + '）');
    h += row('靜態順應性', na(cst) ? '—' : fmt(cst, 0), 'mL/cmH₂O', na(cst) ? 'fl-na' : cst < 25 ? 'fl-hot' : cst >= 50 ? 'fl-ok' : 'fl-warn', na(cst) ? '' : cst < 25 ? '<25：浸潤性肺病（ARDS、肺水腫）' : cst >= 50 ? '正常 50–80' : '偏低', 'VT / (Pplat − 總 PEEP)');
    h += row('管路損失', na(lost) ? '—' : fmt(lost, 0), 'mL', 'fl-na', '3 mL/cmH₂O × Ppeak', na(vtAct) ? '' : '實到病人 ≈ ' + fmt(vtAct, 0) + ' mL');
    h += '<div class="rx-flag">量順應性要在無呼吸努力時（胸壁占 35%、肌肉收縮更多）、同一個潮氣量下（順應性隨肺容積變）。Best PEEP：順應性由升轉降、驅動壓由降轉升的轉折點；P/F 升不等於 DO₂ 升（PEEP 會降心輸出量，看 ScvO₂）。平均氣道壓：正常肺 5–10、阻塞 10–20、硬肺 20–30。</div>';
    document.getElementById('c27mech_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c27set', function () {
    var ht = num('st_h'), sex = val('st_sex'), rr = num('st_rr'), flow = num('st_fl'), mv = num('st_mv');
    var p = pbw(ht, sex), vt8 = p * 8, vt6 = p * 6;
    var ti = vt8 / 1000 / (flow / 60), cyc = 60 / rr, te = cyc - ti, ie = te / ti;
    var h = row('PBW', fmt(p, 1), 'kg', 'fl-na', (sex === 'f' ? '45.5' : '50') + ' ＋ 2.3 × (吋 − 60)');
    h += row('VT 起始 → 目標', fmt(vt8, 0) + ' → ' + fmt(vt6, 0), 'mL', 'fl-na', '8 → 6 mL/kg，每 2 小時降 1', 'Pplat >30 再降到 4');
    h += row('吸氣流速', na(flow) ? '—' : fmt(flow, 0), 'L/min', na(flow) ? 'fl-na' : flow >= (mv >= 10 ? 80 : 60) ? 'fl-ok' : 'fl-warn', na(flow) ? '' : (mv >= 10 ? '窘迫或分鐘通氣 ≥10 用 ≥80' : '安靜 60'), '');
    h += row('I:E', na(ie) ? '—' : '1:' + fmt(ie, 1), '', na(ie) ? 'fl-na' : ie >= 2 ? 'fl-ok' : 'fl-hot', na(ie) ? '填 RR 與流速' : ie >= 2 ? '≥1:2 達標' : '<1:2：升流速、降 VT 或降速率', na(ti) ? '' : 'Ti ' + fmt(ti, 2) + ' 秒、Te ' + fmt(te, 2) + ' 秒（VT 8 mL/kg）');
    h += row('速率', na(rr) ? '—' : fmt(rr, 0), '/分', na(rr) ? 'fl-na' : rr > 35 ? 'fl-hot' : 'fl-ok', na(rr) ? '' : rr > 35 ? '>35 不建議' : '', '無自主呼吸：估插管前分鐘通氣量；有觸發：略低於自主速率；30 分後看 PaCO₂');
    h += '<div class="rx-flag">初始模式 assist-control、用某種容積控制（VCV 或 PRVC）才能鎖 VT；PEEP 5–8 起，FIO₂ >60% 才靠升 PEEP 換；呼吸太快併呼吸性鹼中毒或內生性 PEEP → 改 SIMV（＋壓力支持 10）。174 種模式只有一種改善結局，而且是因為「少給」。</div>';
    document.getElementById('c27set_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch28 ================= */
  I.bindCalc('c28ett', function () {
    var ht = num('et_h'), sex = val('et_sex'), depth = num('et_d'), cuff = num('et_c');
    var inch = ht / 2.54, size = na(inch) ? '—' : inch <= 62 ? '7.0' : inch <= 70 ? '7.5' : '8.0';
    var lim = sex === 'f' ? 21 : 23;
    var h = row('建議管徑', size, 'mm ID', 'fl-na', na(inch) ? '' : '身高 ' + fmt(inch, 0) + ' 吋', '≤5\'2" 7、5\'3"–5\'10" 7.5、≥5\'11" 8；管徑與結局無關');
    h += row('門齒深度', na(depth) ? '—' : fmt(depth, 0), 'cm', na(depth) ? 'fl-na' : depth <= lim ? 'fl-ok' : 'fl-warn', na(depth) ? '' : depth <= lim ? '≤' + lim + '：移位風險低' : '>' + lim + '：右主支氣管風險', '女 21、男 23；尖端在隆突上 3–5 cm（T4–T5）；頭屈伸移 2 cm');
    h += row('氣囊壓', na(cuff) ? '—' : fmt(cuff, 0), 'cmH₂O', na(cuff) ? 'fl-na' : cuff <= 25 ? 'fl-ok' : 'fl-hot', na(cuff) ? '' : cuff <= 25 ? '≤25' : '>25：壓過氣管黏膜微血管 → 缺血', '');
    h += '<div class="rx-flag">插管 >12 小時過半有喉損傷（困難、粗管、久插）。>2 週建議氣切：早（1 週內）vs 晚：減鎮靜與呼吸器天數，不減 VAP 與死亡；常規是 1 週後評估下週能否拔管。經皮擴張氣切為首選（便宜、免全麻、感染少）；環甲膜切開只作緊急用，穩定後要改正規氣切。氣切一週內脫出 → 先經口插管再放回。氣管狹窄（拔除後 6 個月內、0–15%、多無症狀）。</div>';
    document.getElementById('c28ett_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c28leak', function () {
    var set = num('lk_set'), exh = num('lk_exh'), pilot = val('lk_p');
    var leak = set - exh;
    var h = row('漏氣量', na(leak) ? '—' : fmt(leak, 0), 'mL', na(leak) ? 'fl-na' : leak > 50 ? 'fl-warn' : 'fl-ok', na(leak) ? '' : '設定 VT − 呼出 VT', '');
    h += row('指示氣球', pilot === 'up' ? '充飽' : '扁的', '', 'fl-na', pilot === 'up' ? '氣囊有氣 → 與氣管壁貼合不均：放氣、調整位置、再充（≤25）；不行換大管' : '單向閥壞或氣囊破 → 試再充，氣球不起就換管', '先脫離呼吸器用甦醒球手動通氣');
    h += '<div class="rx-flag">漏氣多不是氣囊破。NAC 化痰：噴霧 10% 2.5 mL＋生理食鹽水 2.5 mL q8h（會誘發支氣管痙攣，氣喘不用）；氣管內注入 20% 1 mL＋食鹽水（原表截斷）——呼吸器病人偏好直接注入。<b>不做常規抽痰、不灌生理食鹽水</b>（5 mL 可沖下 30 萬個菌落的生物膜；食鹽水降不了痰的黏度——像在油上澆水）；抽痰指徵：看得到痰、聽得到、流量波形鋸齒。</div>';
    document.getElementById('c28leak_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c28auto', function () {
    var auto = num('ap_a'), cvp = num('ap_cvp'), app = num('ap_app');
    var h = row('內生性 PEEP', na(auto) ? '—' : fmt(auto, 0), 'cmH₂O', na(auto) ? 'fl-na' : auto <= 3 ? 'fl-ok' : 'fl-warn', na(auto) ? '' : auto <= 3 ? '≤3：ARDS 也常見' : '氣喘／COPD 呼吸器病人幾乎必有', '呼氣末閉鎖法，只在無自主呼吸時準');
    h += row('校正 CVP', na(cvp) || na(auto) ? '—' : fmt(cvp - auto, 0), 'mmHg', 'fl-na', '內生性 PEEP 會傳到上腔靜脈假性抬高 CVP', '粗估：直接減');
    h += row('外加 PEEP', na(app) ? '—' : fmt(app, 0), 'cmH₂O', na(app) || na(auto) ? 'fl-na' : app < auto ? 'fl-ok' : 'fl-hot', na(app) || na(auto) ? '' : app < auto ? '低於內生性 PEEP：撐開小氣道不阻礙呼氣' : '≥內生性 PEEP：會阻礙呼氣流', '作者：用外加 PEEP 去抵內生性 PEEP 大概不值得');
    h += '<div class="rx-flag">內生性 PEEP 的害處：平均胸內壓升 → 靜脈回流降；過度充氣升呼吸功；吸氣末肺泡容積與壓力升 → 容積傷／氣壓傷；假性高 CVP。對策都在促進吐氣：降 VT、升吸氣流速、縮吸氣時間（PCV）、降速率。</div>';
    document.getElementById('c28auto_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch29 ================= */
  I.bindCalc('c29risk', function () {
    var day = num('vr_d'), shock = val('vr_s') === 'y', mdr = val('vr_m') === 'y', abx = val('vr_a') === 'y', ab25 = val('vr_h') === 'y';
    var late = !na(day) && day >= 5, hi = late || shock || mdr || abx || ab25;
    var h = row('發病時間', na(day) ? '—' : late ? '晚發（≥5 天）' : day >= 2 ? '早發（2–4 天）' : '<48 小時不算 VAP', '', na(day) ? 'fl-na' : late ? 'fl-warn' : 'fl-ok', '', 'VAP 占 ICU 肺炎 80%、60% 是晚發');
    h += row('經驗性方案', hi ? '高風險' : '低風險', '', hi ? 'fl-hot' : 'fl-ok', hi ? 'MRSA（vancomycin 或 linezolid）＋抗綠膿 β-lactam（cefepime 或 pip/tazo）' + (mdr ? '＋非 β-lactam 抗革蘭氏陰性（fluoroquinolone 或 aminoglycoside）' : '') : '單一藥物：cefepime、levofloxacin 或 pip/tazo（涵蓋 MSSA、腸內菌、綠膿）', '培養都陰性就停藥；確診療程 7 天');
    h += '<div class="rx-flag">高風險因子：晚發、敗血性休克、曾有 MRSA 或多重抗藥菌、院內抗藥菌 ≥25%、90 天內抗生素。病原：腸內菌（早 32／晚 34%）、綠膿（14／20%）、Acinetobacter（8／21%）、金黃色葡萄球菌（30／21%，MRSA 9／13%）；1/4 多菌；病毒約 20%；Candida 不致肺炎。VAP 延長呼吸器與住院，對死亡率影響不明——作者認為是過度診斷。</div>';
    document.getElementById('c29risk_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c29cx', function () {
    var sq = num('cx_sq'), pmn = num('cx_pmn'), spec = val('cx_sp'), cfu = num('cx_cfu');
    var thr = { ta: 5, psb: 3, bal: 4 }[spec], perf = { ta: '敏感 76／專一 68、OR 6.6', psb: '敏感 61／專一 77、OR 5.1', bal: '敏感 71／專一 80、OR 9.6（最好但仍不到 10）' }[spec];
    var h = row('鱗狀上皮', na(sq) ? '—' : fmt(sq, 0), '/低倍視野', na(sq) ? 'fl-na' : sq > 10 ? 'fl-hot' : 'fl-ok', na(sq) ? '' : sq > 10 ? '>10：口水汙染，不宜培養' : '可培養', '');
    h += row('中性球', na(pmn) ? '—' : fmt(pmn, 0), '/低倍視野', na(pmn) ? 'fl-na' : pmn > 25 ? 'fl-warn' : 'fl-ok', na(pmn) ? '' : pmn > 25 ? '>25：感染證據（分不出氣管支氣管炎與肺炎）' : '漱口水都有 20% 中性球', '');
    h += row('定量培養', na(cfu) ? '—' : '10^' + fmt(cfu, 0), 'CFU/mL', na(cfu) ? 'fl-na' : cfu >= thr ? 'fl-hot' : 'fl-ok', na(cfu) ? '' : cfu >= thr ? '≥10^' + thr + '：達 VAP 門檻' : '未達門檻', perf);
    h += '<div class="rx-flag">氣管抽吸物定性培養敏感 >90% 但專一 15–40%：陰性可排除、陽性不能當病原。BAL 至少 120 mL（6 × 20 mL，回收 ≤25%，第一管丟）；細胞內菌 >3% → 肺炎機率 >90%（要特別要求）。Mini-BAL 免支氣管鏡、呼吸治療師可做、產率相當。指引分歧：國際建議定量 BAL／PSB，美國建議氣管抽吸——都要在抗生素前採。血液培養常來自肺外。</div>';
    document.getElementById('c29cx_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c29eff', function () {
    var th = num('ef_t'), loc = val('ef_l') === 'y', half = val('ef_h') === 'y', ph = num('ef_ph'), glu = num('ef_g'), gs = val('ef_gs') === 'y', pus = val('ef_p') === 'y';
    var cat = pus ? 4 : (loc || half || (!na(ph) && ph < 7.2) || (!na(glu) && glu < 60) || gs) ? 3 : (!na(th) && th <= 10) ? 1 : 2;
    var T = { 1: ['第 1 類：<10 mm 游離', '不必穿刺', 'fl-ok'], 2: ['第 2 類：>10 mm、<半側胸、游離、無感染證據', '穿刺盡量抽乾（肋膜壓到 −20 cmH₂O 就停），不需引流', 'fl-ok'], 3: ['第 3 類（複雜性）：分隔或 >半側胸，pH <7.2／糖 <60／染色培養陽性', '小口徑胸管 8.5–14 Fr 引流', 'fl-warn'], 4: ['第 4 類：膿胸', '立即引流；小口徑管與 28–36 Fr 大管效果相當', 'fl-hot'] }[cat];
    var h = row('分類', T[0], '', T[2], T[1], '');
    h += '<div class="rx-flag">住院肺炎 20–40% 有肋膜積液；超音波定位。感染性積液引流＋經驗性抗生素要涵蓋 MRSA 與腸內菌含綠膿（vancomycin＋cefepime 或 pip/tazo）。引流不佳：CT 導引加管 → VATS；肋膜內纖溶劑一般不建議。</div>';
    document.getElementById('c29eff_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch30 ================= */
  I.bindCalc('c30sbt', function () {
    var spo2 = num('sb_sp'), fio2 = num('sb_f'), peep = num('sb_peep'), rr = num('sb_rr'), vt = num('sb_vt'), pi = num('sb_pi');
    var ready = spo2 >= 90 && fio2 <= 50 && peep <= 8;
    var rsbi = rr / (vt / 1000);
    var h = row('準備度', na(spo2) || na(fio2) || na(peep) ? '—' : ready ? '符合' : '不符', '', na(spo2) ? 'fl-na' : ready ? 'fl-ok' : 'fl-warn', 'SpO₂ ≥90 於 FIO₂ ≤50、PEEP ≤8', '加上 PaCO₂ 正常或基線、血行動力學穩定、可喚醒合作');
    h += row('RR／VT', na(rsbi) ? '—' : fmt(rsbi, 0), '/min/L', na(rsbi) ? 'fl-na' : rsbi <= 105 ? 'fl-ok' : 'fl-hot', na(rsbi) ? '' : rsbi <= 105 ? '60–105 預測成功' : '>105：淺快呼吸', na(rr) ? '' : (rr >= 40 ? 'RR ≥40 ' : '') + (na(vt) ? '' : 'VT ' + fmt(vt, 0) + ' mL'));
    h += row('PImax', na(pi) ? '—' : fmt(pi, 0), 'cmH₂O', na(pi) ? 'fl-na' : pi <= -20 ? 'fl-ok' : 'fl-hot', na(pi) ? '選填' : pi <= -20 ? '比 −20 更負：足夠' : '−20 到 −30 就危及安靜通氣', '正常男 −120、女 −84；急性呼吸衰竭常做不到');
    h += '<div class="rx-flag">序列變化比單點更有預測力。SBT 連著呼吸器（可看 RR 與 VT；壓力支持 5 其實沒減少呼吸功）或 T-piece（高流量、看不到 VT）——沒有哪一種證明較好。能撐 2 小時的 80% 可永久脫離。</div>';
    document.getElementById('c30sbt_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c30rr', function () {
    var rr0 = num('rb_r0'), rr1 = num('rb_r1'), vt0 = num('rb_v0'), vt1 = num('rb_v1'), sv0 = num('rb_s0'), sv1 = num('rb_s1');
    var fast = rr1 > rr0 * 1.2, up = vt1 > vt0, down = vt1 < vt0;
    var h = row('呼吸型態', na(rr1) || na(vt1) ? '—' : fast && up ? '快且深：過度通氣' : fast && down ? '快且淺：通氣衰竭' : fast ? '快、VT 不變' : '不快', '', na(rr1) || na(vt1) ? 'fl-na' : fast && down ? 'fl-hot' : fast && up ? 'fl-warn' : 'fl-ok', fast && up ? '疑焦慮：考慮鎮靜，類鴉片最能止喘（COPD 也安全）' : fast && down ? '回呼吸器' : '', '');
    var ds = sv1 - sv0;
    h += row('ScvO₂ 變化', na(ds) ? '—' : (ds > 0 ? '+' : '') + fmt(ds, 0), '%', na(ds) ? 'fl-na' : ds < -5 ? 'fl-hot' : 'fl-ok', na(ds) ? '選填' : ds < -5 ? '下降：心輸出量掉 → 想心臟' : '未降', '失敗的 SBT 中 SvO₂ 下降、成功的不降');
    h += '<div class="rx-flag">快呼吸的害處：氣喘／COPD 過度充氣與內生性 PEEP（降心輸出量、增死腔、降順應性、橫膈變平）；浸潤性肺病促進肺塌陷；全身 VO₂ 上升。心臟失能占失敗 40%：負胸內壓升後負荷、內生性 PEEP 降回流、順應性降、無聲缺血；橫膈像心臟一樣萃取最大，靠心輸出量供氧。處理：CPAP（抵掉負壓的後負荷效應、不擋拔管）、利尿（LV 擴大或脫離性肺水腫）、NTG（伴高血壓）。</div>';
    document.getElementById('c30rr_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c30leak', function () {
    var set = num('cl_set'), exh = num('cl_exh'), hi = val('cl_hi') === 'y';
    var leak = set - exh;
    var h = row('氣囊放氣漏氣量', na(leak) ? '—' : fmt(leak, 0), 'mL', na(leak) ? 'fl-na' : leak > 110 ? 'fl-ok' : 'fl-hot', na(leak) ? '' : leak > 110 ? '>110：95% 不會喉水腫，直接拔' : '<110：喉水腫風險 7 倍', '吸入 VT − 呼出 VT（容積控制下做）');
    h += row('類固醇前置', na(leak) ? '—' : leak > 110 ? '不需' : 'methylprednisolone 20 mg IV q4h', '', na(leak) ? 'fl-na' : leak > 110 ? 'fl-na' : 'fl-warn', na(leak) || leak > 110 ? '' : '拔管前 12 小時起', '喉水腫降 7 倍、再插管減半；臨拔才給無效');
    h += row('拔管後', na(leak) ? '—' : leak > 110 ? '一般照護' : '立即 NIV', '', 'fl-na', na(leak) || leak > 110 ? '' : '高風險者拔管後立即 NIV 減少再插管；已發生呼吸衰竭再用無效', '');
    h += '<div class="rx-flag">' + (hi ? '高風險（久插、困難插管、粗管、自拔）才做 cuff-leak 測試。' : '低風險者不必做 cuff-leak 測試。') + ' 拔管前另看咳嗽（紙放管口 1–2 cm 咳出濕痕）與嘔吐反射；弱不一定不能拔，但要注意吞嚥。需再插管的喉水腫 1–10%；喘鳴多在 30 分內（可到 2 小時），阻塞 50% 才出現、吸氣期最明顯；有呼吸衰竭徵象立即再插管——霧化 epinephrine 與 IV 類固醇治療都未證實。</div>';
    document.getElementById('c30leak_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch25 給氧裝置 */
  var ox = { need: null, co2: null };
  window.oxPick = function (k, v, btn) { flowSelect(btn); ox[k] = v; oxRender(); };
  function oxRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ox.need === 'none') { cls = 'rec-blue'; t = 'SaO₂ ≥90%（COPD 88–92）：不必給氧'; d = '<li>給氧門檻對應的 CaO₂ 只少 8%、不升 VO₂；氧在所有器官（除了肺）都是血管收縮劑，冠狀動脈也是，DO₂ 淨變化為零。</li><li>組織不缺氧、也不想要更多——血管收縮本身就是抗氧化防禦。</li>'; }
    else if (ox.need === 'mild') { cls = 'rec-blue'; t = '輕度低血氧、無窘迫：低流量鼻導管 1–6 L/min'; d = '<li>FIO₂ 約 24–40%；>4 L/min 加濕；可進食交談。</li><li>' + (ox.co2 === 'yes' ? '慢性 CO₂ 滯留：目標 88–92%、不要更高；Venturi 面罩可固定 FIO₂，但有脈搏血氧就夠。' : '目標 90–94%。') + '</li>'; }
    else if (ox.need === 'severe') { cls = 'rec-urgent'; t = '嚴重低血氧或呼吸窘迫：高流量鼻導管 40–60 L/min'; d = '<li>吸氣流速可達 120 L/min，低流量系統與面罩都供不上；HFNO 沖掉鼻咽死腔（潮氣量 30% 來自死腔再吸入）、升呼氣末肺容積、降呼吸功、讓呼吸舒服、減少 P-SILI。</li><li>非再吸入面罩已不受青睞（閥門、袋沒充飽）；OxyMask 不錯但不如 HFNO。</li><li>' + (ox.co2 === 'yes' ? 'CO₂ 滯留者仍守 88–92%。' : 'FIO₂ 盡量 ≤60%：氧毒性門檻可能比想像低。') + '</li>'; }
    else if (ox.need) { cls = 'rec-elective'; t = '有慢性 CO₂ 滯留嗎？'; d = '<li>請回答第 2 步。</li>'; }
    if (ox.need) n = 'FIO₂ ＝ 氧流量 vs 病人吸氣流速的平衡。';
    flowRec('ox_rec', cls, t, d, n);
  }
  window.oxReset = function () { ox = { need: null, co2: null }; selAll('#ox_flow'); oxRender(); };

  /* Ch26 NIV 決策 */
  var nv = { ok: null, type: null };
  window.nvPick = function (k, v, btn) { flowSelect(btn); nv[k] = v; nvRender(); };
  function nvRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (nv.ok === 'no') { cls = 'rec-urgent'; t = '不符合 NIV 條件：插管'; d = '<li>條件：呼吸衰竭非立即致命、無致命循環崩潰、清醒或可喚醒且合作、無持續癲癇、無吐血或持續嘔吐、無面罩無法克服的阻塞（喉腫瘤、水腫）。</li><li>拒絕插管者（NIV 病人的 20%）不受此限。</li>'; }
    else if (nv.ok === 'yes') {
      var R = { copd: ['rec-elective', 'COPD 急性高碳酸：NIV 第一線；1 小時 PaCO₂ 沒降 ≥10% 就插管', '<li>17 篇研究：插管大減、存活小增；慢性高碳酸無效。肥胖低通氣也有效，同樣看 1 小時。</li><li>意識改變恢復慢，不當早期失敗指標。怕插管會拔不掉而拖延，反而更糟。</li>'], cpe: ['rec-elective', '心因性肺水腫：CPAP 或 NIV 都好、同效', '<li>正壓降左心室後負荷、升心搏量（衰竭心臟在後負荷曲線陡段）。</li>'], hypox: ['rec-elective', '低血氧型（肺炎、ARDS）：優先 HFNO；用 NIV 的話 1 小時 P/F 沒升就插管', '<li>失敗率：CPE 最低、CAP 最高、ARDS 看嚴重度；HFNO 插管率與 NIV 相當、免疫不全者更好、可進食。</li><li>持續窘迫＋大 VT → P-SILI → 早插管；在極端狀態下緊急插管很麻煩。</li>'] }[nv.type];
      if (R) { cls = R[0]; t = R[1]; d = R[2]; } else { cls = 'rec-elective'; t = '符合條件：哪一種呼吸衰竭？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (nv.ok) n = '1 小時就該看到效益（PaCO₂ 降、P/F 升、窘迫緩解）；沒有就別拖。IPAP 10–20、EPAP 5–10，更高耐受差又漏氣。';
    flowRec('nv_rec', cls, t, d, n);
  }
  window.nvReset = function () { nv = { ok: null, type: null }; selAll('#nv_flow'); nvRender(); };

  /* Ch27／28 內生性 PEEP 處理 */
  var ap = { flow: null, spont: null };
  window.apPick = function (k, v, btn) { flowSelect(btn); ap[k] = v; apRender(); };
  function apRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ap.flow === 'no') { cls = 'rec-blue'; t = '吐氣末流量歸零：沒有內生性 PEEP'; d = '<li>維持 I:E ≥1:2。</li>'; }
    else if (ap.flow === 'yes') {
      if (ap.spont === 'no') { cls = 'rec-elective'; t = '有內生性 PEEP、無自主呼吸：呼氣末閉鎖量出數值，先拉長吐氣，再考慮外加 PEEP 略低於它'; d = '<li>升吸氣流速、降 VT、降速率、縮吸氣時間（PCV）——有些會降分鐘通氣量。</li><li>快呼吸併呼吸性鹼中毒 → 改 SIMV（＋PS 10）。</li><li>外加 PEEP 要低於內生性 PEEP 才不擋吐氣；能減少吐氣末流量就表示在減內生性 PEEP。</li>'; }
      else if (ap.spont === 'yes') { cls = 'rec-elective'; t = '有內生性 PEEP、有自主呼吸：量不準，看外加 PEEP 能否消掉吐氣末流量'; d = '<li>閉鎖法要在吐氣最末端、自主呼吸時抓不準。</li><li>同樣先促進吐氣：流速、VT、速率、鎮靜。</li>'; }
      else { cls = 'rec-elective'; t = '有吐氣末流量 ＝ 動態過度充氣：病人有自主呼吸嗎？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (ap.flow) n = '內生性 PEEP 在氣喘／COPD 呼吸器病人幾乎必有，ARDS ≤3 也常見。';
    flowRec('ap_rec', cls, t, d, n);
  }
  window.apReset = function () { ap = { flow: null, spont: null }; selAll('#ap_flow'); apRender(); };

  /* Ch28 張力性氣胸 */
  var px = { sus: null, us: null };
  window.pxPick = function (k, v, btn) { flowSelect(btn); px[k] = v; pxRender(); };
  function pxRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (px.sus === 'tension') { cls = 'rec-urgent'; t = '張力性氣胸：立即減壓——14G、8 cm 導管，第 5 肋間腋中線前'; d = '<li>第 2 肋間鎖骨中線與短針失敗率高；針不成就用手指減壓；之後放 8.5–14 Fr 小口徑胸管。</li><li>胸片：患側無肺紋、縱膈推向對側、橫膈壓低。任何呼吸器病人無法解釋的低血氧或低血壓都要想它（阻塞性休克、PEA）。</li>'; }
    else if (px.sus === 'stable') {
      if (px.us === 'slide') { cls = 'rec-blue'; t = '有肺滑動：排除該處氣胸'; d = '<li>肺滑動存在可排除；消失只是提示（非病徵）。</li>'; }
      else if (px.us === 'point') { cls = 'rec-elective'; t = '肺滑動消失＋找到 lung point：確診氣胸，放小口徑胸管'; d = '<li>探頭往外下移到滑動重現處＝lung point，病徵性。</li><li>仰臥時肺尖不積氣，胸片常看不到；氣積在前基底與肺下——CT 或超音波才看得到。</li><li>三腔系統：水封 2 cm；水封冒泡＝支氣管肋膜瘻管漏氣；抽吸 −20 常不必要且會維持瘻管——持續漏氣就關抽吸。</li>'; }
      else { cls = 'rec-elective'; t = '穩定：超音波第 3–4 肋間鎖骨中線找肋膜線'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (px.sus) n = '肺保護通氣下氣胸 3–10%（COVID 35%）；最專一的徵象是頸部與上胸皮下氣腫；呼吸器病人的呼吸音不可靠。';
    flowRec('px_rec', cls, t, d, n);
  }
  window.pxReset = function () { px = { sus: null, us: null }; selAll('#px_flow'); pxRender(); };

  /* Ch29 VAP 診斷路徑 */
  var vp = { inf: null, cx: null };
  window.vpPick = function (k, v, btn) { flowSelect(btn); vp[k] = v; vpRender(); };
  function vpRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (vp.inf === 'no') { cls = 'rec-blue'; t = '沒有新浸潤：不是 VAP；發燒與白血球去找別的來源'; d = '<li>臨床準則（發燒、白血球、膿痰、浸潤）敏感度與專一度都差，OR 只 2–3（可靠要 ≥10）。</li>'; }
    else if (vp.inf === 'yes') {
      if (vp.cx === 'before') { cls = 'rec-urgent'; t = '先採檢再給經驗性抗生素；依風險分低／高方案'; d = '<li>定量 BAL／mini-BAL／PSB（國際）或氣管抽吸（美國）；抹片先看鱗狀上皮 >10 就退件、中性球 >25 才算感染。</li><li>低風險單藥（cefepime／levofloxacin／pip-tazo）；高風險 MRSA 藥＋抗綠膿 β-lactam（疑多重抗藥再加 FQ 或 aminoglycoside）。</li><li>培養全陰性就停；確診 7 天。</li>'; }
      else if (vp.cx === 'after') { cls = 'rec-elective'; t = '抗生素已經給了：培養敏感度大降，別過度解讀陰性'; d = '<li>肺浸潤只有 1/3 是肺炎（肺塌陷、肺水腫、ARDS）；仰臥吐氣末的胸片基底擁擠會像肺炎。</li>'; }
      else { cls = 'rec-elective'; t = '有新浸潤：檢體採了嗎？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (vp.inf) n = '預防：SOD（chlorhexidine 已因死亡率上升被撤）、呼吸器組套（床頭 30–45°、SUP、VTE 預防、每日鎮靜假期與評估拔管）、聲門下引流管、不常規抽痰。';
    flowRec('vp_rec', cls, t, d, n);
  }
  window.vpReset = function () { vp = { inf: null, cx: null }; selAll('#vp_flow'); vpRender(); };

  /* Ch30 SBT 失敗 */
  var wf = { sign: null };
  window.wfPick = function (k, v, btn) { flowSelect(btn); wf[k] = v; wfRender(); };
  function wfRender() {
    var cls = 'rec-idle', t = '請選擇失敗時的主要表現', d = '', n = '';
    var R = { anx: ['rec-elective', '快且深（VT 上升）：焦慮——鎮靜，類鴉片最能止喘', '<li>COPD 也可安全使用。氣體交換惡化分不出焦慮與衰竭。</li>'], fail: ['rec-urgent', '快且淺（VT 下降）：通氣衰竭——回呼吸器，找原因', '<li>先看原疾病有沒有再進步。</li><li>心臟（40%）：超音波、ScvO₂ 下降、PA 導管；處理 CPAP、利尿、NTG。</li><li>呼吸肌：控制通氣 3 天橫膈力量降一半（讓病人觸發）、重症神經肌病變（無治療）、低鎂低磷（補）；PImax、超音波橫膈厚度。</li>'], para: ['rec-urgent', '吸氣時腹壁內縮：橫膈無力', '<li>PImax 到 −20～−30 就危及安靜通氣。物理治療、營養；避免肌鬆與深鎮靜。</li>'], scv: ['rec-urgent', 'ScvO₂ 下降：心輸出量掉——想心臟', '<li>負胸內壓升後負荷、內生性 PEEP 降回流與順應性、無聲缺血；橫膈靠心輸出量供氧。</li><li>CPAP 不擋拔管；LV 擴大或脫離性肺水腫用利尿；伴高血壓用 IV NTG。</li>'] }[wf.sign];
    if (R) { cls = R[0]; t = R[1]; d = R[2]; n = '避免延誤：輕鎮靜、避開 BZD、每日假期；穩定就物理治療；營養；每天找 SBT 時機；別忘了心臟。'; }
    flowRec('wf_rec', cls, t, d, n);
  }
  window.wfReset = function () { wf = { sign: null }; selAll('#wf_flow'); wfRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_o2', 'vent-o2', [
    { q: '給氧門檻 SaO₂ 90% 對應的 CaO₂ 比正常少多少？', o: ['50%', '8%（輸血門檻 Hb 7 才少 64%）', '25%', '2%'], a: 1, why: '組織氧合要到輸血門檻以下才受損，所以給氧門檻可以再低。COPD PaO₂ <40 一小時乳酸全正常；聖母峰頂 SaO₂ 58% 乳酸 1.7。' },
    { q: '給氧對 VO₂ 的影響？', o: ['明顯上升', '不變——PaO₂ 升但有氧代謝不變；氧還會收縮血管讓 DO₂ 淨變化為零', '下降', '只在敗血症上升'], a: 1, why: '氧在肺以外所有器官都是血管收縮劑（superoxide 氧化掉 NO）；動物實驗可讓肌肉微血管網消失。血管收縮可視為抗氧化防禦。' },
    { q: '呼吸衰竭病人的吸氣流速可高達？', o: ['15 L/min', '120 L/min——低流量系統供不上，會夾帶室內空氣', '30 L/min', '60 L/min'], a: 1, why: '安靜呼吸約 15 L/min。HFNO 40–60 L/min 加溫加濕、獨立調 FIO₂。' },
    { q: 'HFNO 的生理效益不包括？', o: ['沖掉鼻咽死腔', '穩定提供 10 cmH₂O PEEP', '升呼氣末肺容積與順應性', '降呼吸功與速率'], a: 1, why: '只有閉嘴才有 2–3 cmH₂O PEEP，呼吸衰竭病人很少閉嘴。臨床效益：矯正嚴重低血氧、呼吸舒服、減少 P-SILI，建議取代一般給氧。' },
    { q: '最具破壞力的活性氧是？', o: ['Superoxide', 'Hydroxyl radical——在三個分子直徑內就反應', 'H₂O₂', '一氧化氮'], a: 1, why: '游離 Fe²⁺ 催化它生成（ceruloplasmin／transferrin 的抗氧化作用就是鎖鐵）；H₂O₂ 非自由基但可穿膜擴散。正常只 3% 的 O₂ 代謝生成 ROS，發炎才是大宗。' },
    { q: '重症病人肺氧毒性的門檻 FIO₂？', o: ['100%', '傳統 60%，但抗氧化物（glutathione、維生素 E、硒）耗竭者可能更低——用最低可耐受的', '80%', '40%'], a: 1, why: '健康人 100% O₂ 6–12 小時就氣管炎與吸收性肺塌陷；創傷抗氧化組合（C 1000 q8h、E 1000 U q8h、Se 200 μg qd × 7 天）減少呼吸衰竭。' }
  ]);
  I.renderQuiz('qz_niv', 'vent-niv', [
    { q: 'CPAP 與 BiPAP 的差別？', o: ['沒有差別', 'CPAP 只有呼氣末正壓、不增潮氣量；BiPAP 是病人觸發、壓力目標的吸氣支持＋PEEP', 'CPAP 需要插管', 'BiPAP 只用於睡眠呼吸中止'], a: 1, why: 'CPAP 5–10 升 FRC；BiPAP IPAP 10–20、EPAP 5–10，更高耐受差又漏氣。PSV 吸氣流降到峰值 25% 就結束、讓病人決定 Ti 與 VT。' },
    { q: 'NIV 最成功的適應症？', o: ['ARDS', 'COPD 急性高碳酸呼吸衰竭——插管大減、存活小增', '社區肺炎', '氣喘'], a: 1, why: '慢性高碳酸無效。10–20% 不反應：1 小時 PaCO₂ 沒降 ≥10% 就是失敗。肥胖低通氣也有效。' },
    { q: '低血氧呼吸衰竭 NIV 失敗率最高的是？', o: ['心因性肺水腫', '社區肺炎', '輕度 ARDS', 'COPD'], a: 1, why: 'CPE 最低（CPAP 與 NIV 同效）；ARDS 看嚴重度。1 小時 P/F 沒升＝失敗。' },
    { q: '低血氧型呼吸衰竭，HFNO 與 NIV 哪個優先？', o: ['NIV', 'HFNO——插管率相當、免疫不全者更好、沒有面罩、可進食', '一律插管', '一般面罩'], a: 1, why: '面罩不耐受占 NIV 失敗 18%、鼻樑壓瘡；頭盔插管與死亡更少但成人少用。' },
    { q: '正壓為什麼幫助衰竭的左心室？', o: ['增加前負荷', '降低後負荷（後負荷＝腔內壓 − 肋膜壓），衰竭心臟在後負荷曲線陡段', '增加收縮力', '減慢心跳'], a: 1, why: '正常心臟在前負荷曲線陡段，正壓反而降心輸出量——要維持血量。吸氣期收縮壓升＝反向脈搏奇異。' },
    { q: 'NIV 何時該放棄改插管？', o: ['48 小時後', '1 小時沒有效益（PaCO₂ 沒降、P/F 沒升、仍窘迫）', '只有心跳停止時', '面罩漏氣時'], a: 1, why: '持續窘迫＋大 VT → P-SILI；極端狀態下的緊急插管很麻煩。插管提供更高的通氣控制。' }
  ]);
  I.renderQuiz('qz_mv', 'vent-mv', [
    { q: '肺泡破裂的風險看哪個壓力？', o: ['峰壓', '平台壓（吸氣末閉鎖、無流量＝肺泡壓）≤30', '平均氣道壓', 'PEEP'], a: 1, why: 'VCV 峰壓較高是誤解為更危險的來源；峰壓 − 平台壓是氣道阻力的部分。' },
    { q: '靜態順應性的公式與正常值？', o: ['VT / Ppeak；20–30', 'VT / (Pplat − 總 PEEP)；正常 50–80，ARDS <25 mL/cmH₂O', 'Pplat / VT；1–2', 'VT / PEEP；100'], a: 1, why: '要無呼吸努力、同一 VT；管路每 cmH₂O 吃掉 3 mL（500 mL、40 cmH₂O → 只剩 380）。' },
    { q: 'Best PEEP 的判定？', o: ['P/F 最高', '順應性由升轉降、驅動壓由降轉升的轉折點；並看 ScvO₂ 因為 PEEP 會降心輸出量', 'PEEP 20', '平台壓 30'], a: 1, why: '5–10 防塌陷、10–20 招募但可能過度膨脹；P/F 升不等於 DO₂ 升。' },
    { q: 'I:E 應該？', o: ['1:1', '≥1:2；不夠就升吸氣流速、降 VT 或降速率', '2:1', '1:5'], a: 1, why: '吐氣不完就動態過度充氣與內生性 PEEP。快呼吸併鹼中毒或內生性 PEEP → SIMV＋PS 10。' },
    { q: '壓力觸發的問題？', o: ['太靈敏', '1/3 的吸氣努力觸發不到——流量觸發已取代（但漏氣會自動觸發）', '需要更多鎮靜', '只能用於 PCV'], a: 1, why: '負壓 2–3 cmH₂O 就該開閥，但仍有 1/3 失敗；流量觸發 1–10 L/min。' },
    { q: 'SIMV 的主要適應症與代價？', o: ['所有病人；無代價', 'AC 下呼吸太快吐不完；代價是呼吸功增加（管路阻力，要加 PS）與左心衰竭者心輸出量下降', '肌無力者', 'ARDS'], a: 1, why: '自主呼吸期負壓升左心室後負荷。呼吸肌無力與左心衰竭不建議。' }
  ]);
  I.renderQuiz('qz_dep', 'vent-dep', [
    { q: '氣管內管尖端的正確位置？', o: ['隆突上 1 cm', '隆突上 3–5 cm（T4–T5）；女 ≤21、男 ≤23 cm 防移位', '聲帶下 1 cm', '右主支氣管'], a: 1, why: '頭屈伸移 2 cm；門齒到胸骨柄角的距離可估插入深度；移位多進右主支氣管造成左肺塌陷。' },
    { q: '早期氣切（1 週內）的證據？', o: ['降死亡率與 VAP', '減鎮靜與呼吸器天數，但不減 VAP 也不減死亡', '增加出血', '無任何效益'], a: 1, why: '常規：1 週後評估下週能否拔管。經皮擴張為首選（便宜、免全麻、感染少）；一週內脫出先經口插管。' },
    { q: '為什麼不灌生理食鹽水抽痰？', o: ['會造成低血鈉', '降不了黏度（黏的是水不溶層）且會沖下生物膜菌落（5 mL 可達 30 萬）', '會嗆咳', '太貴'], a: 1, why: '不常規抽痰；指徵：看得到、聽得到、流量波形鋸齒。黏痰用 NAC（呼吸器病人偏好氣管內注入）。' },
    { q: '仰臥病人的氣胸積在哪？', o: ['肺尖', '前基底與肺下——胸片常看不到，超音波（無肺滑動＋lung point）更敏感', '後側', '縱膈'], a: 1, why: '有肺滑動可排除、消失只是提示、lung point 才是病徵。最專一的徵象是皮下氣腫。' },
    { q: '張力性氣胸的減壓位置？', o: ['第 2 肋間鎖骨中線、5 cm 針', '第 5 肋間腋中線前、14G 8 cm；失敗就手指減壓，再放 8.5–14 Fr 胸管', '劍突下', '第 8 肋間後側'], a: 1, why: '第 2 肋間與短針失敗率高。呼吸器病人無法解釋的低血氧或低血壓都要想它。' },
    { q: '胸管持續漏氣（水封冒泡）時，抽吸該？', o: ['調到 −40', '關掉——負壓升跨肺壓，會維持支氣管肋膜瘻管', '維持 −20', '換大管'], a: 1, why: '肋膜壓高於水封壓時漏氣仍會排出。抽吸只在最初復張有幫助。' }
  ]);
  I.renderQuiz('qz_vap', 'vent-vap', [
    { q: 'VAP 的定義與分類？', o: ['插管後任何肺炎', '插管 ≥48 小時後；早發 2–4 天、晚發 ≥5 天（占 60%）', 'ICU 住院 ≥7 天', '只限呼吸器 >2 週'], a: 1, why: 'VAP 占 ICU 肺炎 80%；病原以腸內菌與葡萄球菌為主、1/4 多菌、病毒 20%、Candida 不致肺炎。' },
    { q: '口腔去污首選？', o: ['Chlorhexidine 0.12% q6h', 'SOD（不吸收抗生素塗口腔）——chlorhexidine 因黏膜炎與死亡率上升被指引撤下', '漱口水', '不需要'], a: 1, why: '口咽病原吸入是 VAP 起點；SOD 降氣管定殖與肺炎。美國因擔心抗藥性（無根據）不流行。' },
    { q: '呼吸器組套包含？', o: ['床頭 30–45°、SUP、VTE 預防、每日鎮靜假期、每日評估拔管', '只有床頭抬高', '每日抽痰與胸片', '預防性抗生素'], a: 0, why: '組套降 VAP。作者提醒：抬高床頭理論上可能讓口水順重力進肺，從未被研究。聲門下引流管（−20 cmH₂O）也降 VAP。' },
    { q: '臨床準則診斷 VAP 的可靠度？', o: ['很高', '發燒／白血球／膿痰／浸潤的 OR 只 2–3（可靠要 ≥10）；浸潤只 1/3 是肺炎', '中等', '只有胸片可靠'], a: 1, why: '肺塌陷、肺水腫、ARDS 更常見；仰臥吐氣末胸片基底擁擠會像肺炎。' },
    { q: '痰檢體退件的標準？', o: ['中性球 >25/LPF', '鱗狀上皮 >10/低倍視野＝口水汙染', '看到細菌', '顏色黃'], a: 1, why: '中性球 >25 才算感染（漱口水都有 20%）。定性培養敏感 >90% 專一 15–40%；定量門檻 TA 10⁵、PSB 10³、BAL 10⁴（BAL OR 9.6 最好）。' },
    { q: '複雜性肋膜積液（第 3 類）的定義與處置？', o: ['<10 mm，觀察', '分隔或 >半側胸，pH <7.2／糖 <60／染色培養陽性；小口徑胸管引流＋vancomycin＋cefepime', '任何積液都放大管', '只給抗生素'], a: 1, why: '膿胸（第 4 類）立即引流，小管與大管效果相當；引流差 → CT 導引加管 → VATS；肋膜內纖溶劑不建議。' }
  ]);
  I.renderQuiz('qz_wean', 'vent-wean', [
    { q: '控制通氣 3 天對橫膈的影響？', o: ['沒有', '收縮力降約 50%——讓病人觸發呼吸可保護橫膈', '增強', '只影響肋間肌'], a: 1, why: '避免肌鬆與深鎮靜；輕鎮靜、每日假期、避開 BZD；穩定就物理治療。' },
    { q: 'SBT 的準備條件？', o: ['FIO₂ 100% 下 SpO₂ 90', 'SpO₂ ≥90 於 FIO₂ ≤50%、PEEP ≤8、PaCO₂ 正常或基線、穩定、可喚醒合作', '只要清醒', 'PImax −10'], a: 1, why: '預測成功：VT 4–6 mL/kg、RR <40、RR/VT 60–105、PImax 比 −20 更負；序列變化比單點有用。' },
    { q: 'SBT 用壓力支持 5 還是 T-piece？', o: ['一定要 PS', '沒有一種證明較好；PS 5 其實沒減少呼吸功；連呼吸器好設又能看 RR／VT', 'T-piece 一定較好', '要 PS 10'], a: 1, why: '撐 2 小時的 80% 可永久脫離。拔管後呼吸功反而可能上升——別為了減少呼吸功而拔管。' },
    { q: 'SBT 中呼吸變快、VT 也變大，最可能是？', o: ['通氣衰竭', '焦慮（過度通氣）——鎮靜，類鴉片最能止喘', '肺栓塞', '氣胸'], a: 1, why: '快且淺（VT 降）才是通氣衰竭，回呼吸器。氣體交換惡化分不出兩者。' },
    { q: '失敗的 SBT 有多少是心臟造成？', o: ['5%', '約 40%——負胸內壓升後負荷、內生性 PEEP、順應性降、無聲缺血；ScvO₂ 下降是線索', '80%', '幾乎沒有'], a: 1, why: '處理：CPAP（不擋拔管）、利尿（LV 擴大或脫離性肺水腫）、NTG（伴高血壓）。橫膈靠心輸出量供氧。' },
    { q: '高風險病人 cuff-leak <110 mL 該怎麼辦？', o: ['直接拔管', 'Methylprednisolone 20 mg q4h 從拔管前 12 小時起，拔管後立即 NIV', '再等 7 天', '氣切'], a: 1, why: '>110 mL 95% 不會喉水腫。臨拔才給類固醇無效；呼吸衰竭已發生再 NIV 也無效。喘鳴多在 30 分內、阻塞 50% 才出現、有衰竭徵象立即再插管。' }
  ]);
})();
