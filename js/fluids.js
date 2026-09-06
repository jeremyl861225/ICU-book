/* ICU Book · Section IV 靜脈輸液治療 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 10–11（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch10 ================= */
  /* 體液分區 */
  I.bindCalc('c10bw', function () {
    var wt = num('bw_w'), sex = val('bw_sex');
    var f = sex === 'f' ? 0.5 : 0.6;
    var tbw = wt * f, icf = tbw * 0.65, ecf = tbw * 0.35, isf = ecf * 0.8, pv = ecf * 0.2;
    var pvq = wt * (sex === 'f' ? 36 : 40) / 1000;
    var h = row('總體水量 TBW', fmt(tbw, 1), 'L', 'fl-na', (sex === 'f' ? '50%' : '60%') + ' × 淨體重');
    h += row('細胞內液', fmt(icf, 1), 'L', 'fl-na', '65% × TBW');
    h += row('細胞外液 ECF', fmt(ecf, 1), 'L', 'fl-na', '35% × TBW');
    h += row('間質液', fmt(isf, 1), 'L', 'fl-na', '80% × ECF');
    h += row('血漿', fmt(pv, 1), 'L', 'fl-na', '20% × ECF', '速算 ' + (sex === 'f' ? '36' : '40') + ' mL/kg ≈ ' + fmt(pvq, 1) + ' L');
    h += row('臨床顯著缺失', fmt(pv * 0.15 * 1000, 0), 'mL', 'fl-na', '血漿量的 15%', '低血容在此之前多半沒有症狀');
    h += '<div class="rx-flag">血漿只占全身水分 6–7%，卻是輸液治療唯一的目標。晶體液會均勻分布在整個 ECF，所以進血漿的只有 20%。</div>';
    document.getElementById('c10bw_out').innerHTML = I.wrap(h);
  });

  /* 輸液分布：依第 10 章圖 10.1 的比例改寫 */
  var FLUIDS = {
    ns: { n: '0.9% 食鹽水', p: 0.275, i: 0.825, c: -0.10, note: '總 ECF 增加 110%：略高張，把細胞內的水拉出來；主要是撐大間質（水腫）。' },
    rl: { n: "Ringer's lactate／平衡液", p: 0.25, i: 0.75, c: 0, note: '鈉含量較低、分布與等張晶體液相同（假設 20%／80%）；不會高氯酸中毒。' },
    d5: { n: '5% 葡萄糖水 D5W', p: 0.07, i: 0.28, c: 0.65, note: '葡萄糖被代謝後只剩水：2/3 進細胞內，造成細胞腫脹；ECF 只增加 35%。' },
    hts: { n: '7.5% 高張食鹽水', p: 0.99, i: 3.95, c: -3.94, note: '2,567 mOsm/L（血漿 9 倍）：ECF 增加約 5 倍輸入量，全部來自細胞內的水。' },
    alb5: { n: '5% 白蛋白', p: 0.70, i: 0.30, c: 0, note: 'COP 20 mmHg ≈ 血漿；撐血漿的效率是 0.9% 食鹽水的 2.5–3 倍。6 小時開始消退、12 小時後失效。' },
    alb25: { n: '25% 白蛋白', p: 3.5, i: -2.5, c: 0, note: 'COP 70 mmHg（血漿 2.5 倍）：血漿增加 3–4 倍輸入量，但水是從間質搬來的——不補失血、只搬位置。' },
    hes: { n: '6% HES（hetastarch）', p: 1.15, i: -0.15, c: 0, note: 'COP 30；效果與 5% 白蛋白相近或略高；高分子量製劑可撐 24 小時、tetrastarch 約 6 小時。' },
    dex: { n: '10% dextran-40', p: 1.25, i: -0.25, c: 0, note: 'COP 40；撐血漿比白蛋白、HES 都多；dextran-70 作用 12 小時、dextran-40 只有 6 小時。' }
  };
  I.bindCalc('c10vol', function () {
    var f = FLUIDS[val('vd_f')] || FLUIDS.ns, v = num('vd_v');
    var h = row('血漿增加', fmt(v * f.p, 0), 'mL', na(v) ? 'fl-na' : f.p >= 0.7 ? 'fl-ok' : 'fl-warn', na(v) ? '' : Math.round(f.p * 100) + '% 的輸入量');
    h += row('間質增加', fmt(v * f.i, 0), 'mL', na(v) ? 'fl-na' : f.i > 0.5 ? 'fl-warn' : 'fl-ok', na(v) ? '' : f.i < 0 ? '從間質搬進血管' : Math.round(f.i * 100) + '% 的輸入量', f.i > 0.5 ? '促進水腫' : '');
    h += row('細胞內變化', fmt(v * f.c, 0), 'mL', 'fl-na', f.c > 0 ? '細胞腫脹' : f.c < 0 ? '細胞脫水' : '不變');
    h += row('ECF 淨增加', fmt(v * (f.p + f.i), 0), 'mL', 'fl-na', Math.round((f.p + f.i) * 100) + '% 的輸入量');
    h += '<div class="rx-flag"><b>' + f.n + '</b>：' + f.note + '</div>';
    document.getElementById('c10vol_out').innerHTML = I.wrap(h);
  });

  /* 高張食鹽水 vs mannitol（顱內壓） */
  I.bindCalc('c10hts', function () {
    var wt = num('ht_w'), osm = num('ht_osm'), icp = num('ht_icp');
    var h = row('10% 食鹽水', fmt(wt * 0.6, 0), 'mL', 'fl-na', '0.6 mL/kg', '每 6–8 小時視需要');
    h += row('20% mannitol', fmt(wt * 2, 0), 'mL', 'fl-na', '2 mL/kg', '與上面等滲透莫耳數');
    h += row('血清滲透壓', na(osm) ? '—' : fmt(osm, 0), 'mOsm/kg', na(osm) ? 'fl-na' : osm < 320 ? 'fl-ok' : 'fl-hot', na(osm) ? '' : osm < 320 ? '<320 可繼續' : '≥320 暫停高張治療');
    h += row('ICP', na(icp) ? '—' : fmt(icp, 0), 'mmHg', na(icp) ? 'fl-na' : icp < 20 ? 'fl-ok' : 'fl-hot', na(icp) ? '' : icp < 20 ? '目標 <20' : '≥20 需要處置');
    h += '<div class="rx-flag">高張食鹽水降 ICP 與 mannitol 相當，但更能維持腦灌流壓、也沒有 mannitol 的 AKI 風險；兩者都<b>沒有</b>改善創傷性腦損傷的存活。</div>';
    document.getElementById('c10hts_out').innerHTML = I.wrap(h);
  });

  /* 葡萄糖熱量 */
  I.bindCalc('c10dex', function () {
    var rate = num('dx_r'), pct = num('dx_p') || 5;
    var g = rate * 24 * pct / 100, kcal = g * 3.4;
    var h = row('每日葡萄糖', fmt(g, 0), 'g', 'fl-na', pct + '% × ' + fmt(rate * 24 / 1000, 1) + ' L');
    h += row('每日熱量', fmt(kcal, 0), 'kcal', na(kcal) ? 'fl-na' : kcal >= 510 ? 'fl-ok' : 'fl-warn', na(kcal) ? '' : kcal >= 510 ? '達蛋白節省門檻' : '低於 510 kcal', '3.4 kcal/g');
    h += row('滲透壓', pct === 5 ? '278' : fmt(278 * pct / 5, 0), 'mOsm/L', 'fl-na', 'D5W；D5NS 是 560');
    h += '<div class="rx-flag">蛋白節省效應（3 L/天 ≈ 510 kcal）在腸道／靜脈營養普及後已無必要；葡萄糖水在低灌流時把高達 85% 的葡萄糖變成乳酸，又讓高血糖惡化——<b>常規使用已不建議</b>。</div>';
    document.getElementById('c10dex_out').innerHTML = I.wrap(h);
  });

  /* 合成膠體上限 */
  I.bindCalc('c10hes', function () {
    var wt = num('hes_w'), given = num('hes_g');
    var lim = wt * 50, dlim = wt * 20;
    var h = row('Tetrastarch 顯著凝血病變門檻', fmt(lim, 0), 'mL', na(given) ? 'fl-na' : given > lim ? 'fl-hot' : 'fl-ok', na(given) ? '>50 mL/kg' : given > lim ? '已超過' : '目前 ' + fmt(given / wt, 0) + ' mL/kg');
    h += row('Dextran 每日上限', fmt(dlim, 0), 'mL', na(given) ? 'fl-na' : given > dlim ? 'fl-hot' : 'fl-ok', na(given) ? '20 mL/kg/天' : given > dlim ? '已超過' : '未超過', '限制出血傾向');
    h += '<div class="rx-flag">HES 抑制 Factor VII、vWF 與血小板黏附，取代比（MSR）越高越嚴重（hetastarch 0.7 &gt; tetrastarch 0.4）；AKI 風險在重症與敗血症較高、在腹部手術病人未見。Dextran 會干擾交叉配血、升 ESR，過敏 0.03%。</div>';
    document.getElementById('c10hes_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch11 ================= */
  /* 靜脈回流梯度 */
  I.bindCalc('c11vr', function () {
    var pms0 = num('vr_pms0'), cvp0 = num('vr_cvp0'), pms1 = num('vr_pms1'), cvp1 = num('vr_cvp1');
    var g0 = pms0 - cvp0, g1 = pms1 - cvp1, dg = g1 - g0;
    var h = row('輸液前梯度', fmt(g0, 1), 'mmHg', 'fl-na', 'Pms − CVP', '正常 Pms：動物 7–8、術後病人 14–20');
    h += row('輸液後梯度', na(g1) ? '—' : fmt(g1, 1), 'mmHg', 'fl-na', na(g1) ? '填入輸液後數值' : '');
    h += row('梯度變化', na(dg) ? '—' : (dg > 0 ? '+' : '') + fmt(dg, 1), 'mmHg', na(dg) ? 'fl-na' : dg > 0 ? 'fl-ok' : 'fl-hot', na(dg) ? '' : dg > 0 ? '梯度變大：有液體反應' : 'Pms 與 CVP 同步上升：沒有反應', '');
    h += row('CVP 每升 1 mmHg', '−14', '% 靜脈回流', 'fl-na', 'Guyton 曲線', 'CVP ＝ Pms 時回流歸零');
    h += '<div class="rx-flag">靜脈回流 ＝ (Pms − CVP) / Rv，輸液幾乎不改變 Rv。目標是<b>拉大梯度</b>，不是把 CVP 推高——Pms 上升但 CVP 跟著升等於白給。</div>';
    document.getElementById('c11vr_out').innerHTML = I.wrap(h);
  });

  /* 血漿量缺失與晶體／膠體需求 */
  I.bindCalc('c11pv', function () {
    var wt = num('pv_w'), sex = val('pv_sex'), pct = num('pv_pct') || 15;
    var pv = wt * (sex === 'f' ? 36 : 40), deficit = pv * pct / 100;
    var cry = deficit / 0.2, isf = cry * 0.8, col = deficit / 0.7;
    var h = row('血漿量', fmt(pv, 0), 'mL', 'fl-na', (sex === 'f' ? '36' : '40') + ' mL/kg');
    h += row('缺失量', fmt(deficit, 0), 'mL', 'fl-na', pct + '%', pct <= 15 ? '≤15% 通常無症狀' : pct > 30 ? '>30% 仰臥才會低血壓' : '15–30%：仰臥心跳可能正常');
    h += row('等張晶體液需求', fmt(cry, 0), 'mL', na(cry) ? 'fl-na' : 'fl-warn', na(cry) ? '' : '只有 20% 留在血漿', '其中 ' + fmt(isf, 0) + ' mL 跑進間質');
    h += row('5% 白蛋白需求', fmt(col, 0), 'mL', na(col) ? 'fl-na' : 'fl-ok', na(col) ? '' : '≥70% 留在血漿', '約為晶體液的 30%');
    h += '<div class="rx-flag">補半公升血漿要灌 2 公升多的晶體液、其中近 2 公升變成水腫。低白蛋白（COP 的 80% 來自白蛋白）與微血管滲漏（敗血症、ARDS）會把這個問題再放大。</div>';
    document.getElementById('c11pv_out').innerHTML = I.wrap(h);
  });

  /* PCO₂ gap ＋ ScvO₂ */
  I.bindCalc('c11gap', function () {
    var pv = num('gp_v'), pa = num('gp_a'), sc = num('gp_sc');
    var gap = pv - pa;
    var h = row('PCO₂ gap', fmt(gap, 0), 'mmHg', na(gap) ? 'fl-na' : gap > 6 ? 'fl-hot' : gap >= 2 ? 'fl-ok' : 'fl-na', na(gap) ? '' : gap > 6 ? '>6：組織低灌流' : '正常 2–5', na(gap) ? '' : fmt(gap * 0.133, 2) + ' kPa（門檻 0.8）');
    h += row('ScvO₂', na(sc) ? '—' : fmt(sc, 0), '%', na(sc) ? 'fl-na' : sc <= 50 ? 'fl-hot' : sc < 65 ? 'fl-warn' : sc > 80 ? 'fl-warn' : 'fl-ok', na(sc) ? '選填' : sc <= 50 ? '≤50：組織氧合受威脅' : sc < 65 ? '<65：DO₂ 下降' : sc > 80 ? '>80：氧利用缺陷（敗血）' : '正常 65–75');
    var msg = '';
    if (!na(gap) && !na(sc)) {
      if (gap > 6 && sc < 65) msg = '<b>低灌流且 DO₂ 不足</b>：輸液／強心，貧血則輸血；量乳酸。';
      else if (gap > 6) msg = '<b>ScvO₂ 正常或偏高但 gap 大</b>：敗血症典型——氧用不掉但血流也不夠；gap 在敗血症仍可靠，以它為復甦目標。';
      else if (sc < 65) msg = '<b>gap 正常但 ScvO₂ 低</b>：先排除貧血與低血氧；gap 正常不代表組織氧合足夠。';
      else msg = '<b>兩者皆正常</b>：目前無低灌流證據；但 gap 正常不能排除氧利用受損。';
    }
    h += '<div class="rx-flag">' + (msg ? msg + ' ' : '') + 'gap 反映 CO₂ 洗出（與心輸出量成反比），對低灌流較專一、不受敗血症干擾；ScvO₂ 反映 DO₂／VO₂ 平衡。兩者合看最好。</div>';
    document.getElementById('c11gap_out').innerHTML = I.wrap(h);
  });

  /* 液體反應性 */
  I.bindCalc('c11fr', function () {
    var sv0 = num('fr_sv0'), sv1 = num('fr_sv1'), hr0 = num('fr_hr0'), hr1 = num('fr_hr1'), svv = num('fr_svv');
    var d = (sv1 - sv0) / sv0 * 100, dhr = hr1 - hr0;
    var h = row('心搏量變化', na(d) ? '—' : (d > 0 ? '+' : '') + fmt(d, 0), '%', na(d) ? 'fl-na' : d >= 10 ? 'fl-ok' : 'fl-warn', na(d) ? '' : d >= 10 ? '≥10%：有反應' : '<10%：無反應', '輸液挑戰 500 mL／10–15 分 或 被動抬腿');
    h += row('心跳變化', na(dhr) ? '—' : (dhr > 0 ? '+' : '') + fmt(dhr, 0), 'bpm', na(dhr) ? 'fl-na' : dhr > 10 ? 'fl-hot' : 'fl-ok', na(dhr) ? '選填' : dhr > 10 ? '抬腿不該心跳加快：疑疼痛假陽性' : '無疼痛跡象');
    h += row('SVV', na(svv) ? '—' : fmt(svv, 0), '%', na(svv) ? 'fl-na' : svv >= 15 ? 'fl-ok' : 'fl-warn', na(svv) ? '選填' : svv >= 15 ? '≥15%：80% 為反應者' : '<15%', '只限控制通氣且無心律不整');
    h += '<div class="rx-flag">反應高峰在幾分鐘內、10 分鐘後消退——熱稀釋來不及，要用脈波輪廓或食道都卜勒連續監測；<b>只看血壓不夠</b>。有液體反應不等於低血容。被動抬腿 ≥10% 的敏感度 85%、專一度 92%；腹內高壓會假陰性。</div>';
    document.getElementById('c11fr_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch10 選輸液 */
  var fs = { sit: null };
  window.fsPick = function (k, v, btn) { flowSelect(btn); fs[k] = v; fsRender(); };
  function fsRender() {
    var cls = 'rec-idle', t = '請選擇情境', d = '', n = '';
    var R = {
      life: ['rec-urgent', '危及生命的低血容：膠體液（5% 白蛋白）最快撐起血漿', '<li>膠體撐血漿的效率約是晶體的 3 倍，同樣血漿增量只要 30% 的體積；500 mL dextran-40 提升的心輸出量是 1 L RL 的 3 倍。</li><li>沒有存活效益的證據是晶體派的主要論點；但大量晶體帶來的水腫本身與死亡率相關。</li><li>創傷腦損傷例外：SAFE 顯示白蛋白復甦死亡率較高。</li>'],
      dehyd: ['rec-elective', '脫水（整個 ECF 均勻流失）：平衡晶體液（RL／Plasma-Lyte）', '<li>晶體液本來就分布在整個 ECF，正好對應脫水的流失型態。</li><li>避開 0.9% 食鹽水：高氯酸中毒與 AKI（雖多為輕度）。DKA 尤其如此。</li><li>肝衰竭：改 Ringer’s acetate 或 Plasma-Lyte（乳酸緩衝靠肝、醋酸靠肌肉）。</li>'],
      hypoalb: ['rec-elective', '低白蛋白併水腫的低血容：25% 白蛋白', '<li>COP 70 mmHg，把間質的水搬回血管，血漿增加 3–4 倍輸入量；每次 50–100 mL。</li><li>它<b>不補</b>失去的體積，不能當失血的復甦液；休克時高滲透膠體有腎損傷風險（所有高滲透膠體共通）。</li>'],
      icp: ['rec-urgent', '顱內壓升高：高張食鹽水（或 mannitol）', '<li>10% 食鹽水 0.6 mL/kg ≈ 20% mannitol 2 mL/kg；每 6–8 小時視需要，ICP 目標 <20 mmHg，血清滲透壓 <320 才繼續。</li><li>高張食鹽水更能維持腦灌流壓、無 mannitol 的 AKI；但兩者都未改善存活。</li>'],
      trauma: ['rec-blue', '創傷性休克院前小體積復甦：高張食鹽水沒有存活優勢', '<li>動物實驗只要 1/5 體積就能維持心輸出量，但人體證據顯示與等張晶體液存活無差。</li><li>晶體液仍是主流，並依失血情況早期血品（見第 14 章）。</li>'],
      rbc: ['rec-blue', '輸紅血球的稀釋液：0.9% 食鹽水或 Plasma-Lyte', '<li>RL 的鈣理論上會與 CPD 抗凝劑結合成血塊——實驗證據薄弱、快速共輸研究是安全的，但能避就避。</li><li>Plasma-Lyte／Normosol 用鎂不用鈣，可與血品同路。</li>'],
      hyperk: ['rec-blue', '高血鉀病人：RL 可以用，0.9% 食鹽水反而更糟', '<li>RL 的鉀只有 4 mEq/L，沒有讓高血鉀惡化的案例；食鹽水造成的代謝性酸中毒才會把鉀推出細胞。</li>']
    }[fs.sit];
    if (R) { cls = R[0]; t = R[1]; d = R[2]; n = '「膠體 vs 晶體」的爭論本身就問錯問題：依情境選液，才是「問對問題」。'; }
    flowRec('fs_rec', cls, t, d, n);
  }
  window.fsReset = function () { fs = { sit: null }; selAll('#fs_flow'); fsRender(); };

  /* Ch11 液體反應性評估路徑 */
  var fr = { mon: null, vent: null, iah: null };
  window.frPick = function (k, v, btn) { flowSelect(btn); fr[k] = v; frRender(); };
  function frRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (fr.mon === 'no') {
      cls = 'rec-elective'; t = '沒有連續心輸出量監測：靠保守輸液原則減少醫源性水腫';
      d = '<li>初始復甦用膠體＋晶體合併，減少總量。</li><li>初期沒有臨床反應就<b>立刻降階</b>。</li><li>腸道／口服攝取足夠就不要每日維持輸液。</li><li>每天看進出量，正水平衡當天就處理（必要時利尿劑）——「fluid creep」是最常被忽略的來源。</li><li>輸液挑戰（500 mL／10–15 分）只看血壓判斷是不夠的。</li>';
      n = '身體排掉 2 L 食鹽水要超過 2 天：保守是有生理理由的。';
    } else if (fr.mon === 'yes' && fr.vent === 'ctrl') {
      cls = 'rec-blue'; t = '控制通氣且無心律不整：先看 SVV，≥15% 約 80% 是反應者';
      d = '<li>正壓吸氣降低左心室後負荷，讓心搏量隨呼吸週期擺動；SVV 由脈波輪廓算出。</li><li>有自主呼吸努力或心律不整就不能用——改做被動抬腿。</li>';
      n = '不必給一滴水。';
    } else if (fr.mon === 'yes' && fr.vent === 'spont' && fr.iah) {
      if (fr.iah === 'yes') { cls = 'rec-elective'; t = '腹內高壓：被動抬腿常假陰性，改做輸液挑戰'; d = '<li>500 mL 晶體液在 10–15 分鐘內輸完（速率比體積重要）；心搏量升 &gt;10% 為陽性，高峰幾分鐘、10 分鐘後消退。</li><li>反應性不等於低血容；正常甚至高血容的人也可能有反應。</li>'; }
      else { cls = 'rec-blue'; t = '自主呼吸（在或不在呼吸器上）：被動抬腿，≥10% 心搏量上升為陽性'; d = '<li>從半坐 30–45° 開始（平躺起始會少掉內臟血的貢獻），用病床把軀幹放平、腿抬 30–45°，約 300 mL 血回心。</li><li>敏感度 85%、專一度 92%；反應幾分鐘內消退，回半坐位後應消失。</li><li>心跳加快或回半坐後仍持續 → 懷疑疼痛造成的假陽性。</li>'; n = '只看血壓不行，要用脈波輪廓或食道都卜勒。'; }
    }
    flowRec('fr_rec', cls, t, d, n);
  }
  window.frReset = function () { fr = { mon: null, vent: null, iah: null }; selAll('#fr_flow'); frRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_iv', 'fluids-iv', [
    { q: '輸 1 公升 0.9% 食鹽水，最後留在血漿的大約是？', o: ['1,000 mL', '約 275 mL；825 mL 進間質', '500 mL', '全部進細胞內'], a: 1, why: '晶體液的鈉均勻分布在 ECF，而血漿只占 ECF 的 20%。ECF 總增加 1,100 mL，多出來的是從細胞內拉出的水。' },
    { q: '0.9% 食鹽水為什麼「不正常」？', o: ['鈉太低', '氯 154 mEq/L（血漿 103）、滲透壓 308、pH 5.7', '含鉀太多', '它是低張的'], a: 1, why: '高氯造成高氯代謝性酸中毒（30 mL/kg/hr 灌注 pH 7.41 → 7.28）與氯介導的腎血管收縮。Hamburger 當年把血漿誤判成 0.9% 鹽水，實際約 0.6%。' },
    { q: 'RL 裡的乳酸怎麼變成緩衝劑？', o: ['直接中和血中氫離子', '肝臟把乳酸轉成葡萄糖時消耗 H⁺，每 mmol 乳酸生成 1 mmol 碳酸氫根', '被腎臟排掉', '它不是緩衝劑'], a: 1, why: '肝臟每小時清 100 mmol 乳酸，相當於每小時 3.5 L RL；健康人 30 mL/kg 快速輸注只升 0.9 mmol/L，且食鹽水也一樣。從輸 RL 的導管抽血會假性高乳酸。' },
    { q: '5% 葡萄糖水 1 公升，多少進了細胞內？', o: ['0', '約 650 mL（三分之二）', '275 mL', '1,000 mL'], a: 1, why: '葡萄糖被代謝後只剩水，ECF 只增加 350 mL；低灌流時高達 85% 的葡萄糖代謝走向乳酸，加上高血糖的免疫抑制與死亡率——常規使用已不建議。' },
    { q: '25% 白蛋白不能當失血的復甦液，因為？', o: ['太貴', '它把水從間質搬進血管，並沒有補回失去的體積', '會造成過敏', '半衰期太短'], a: 1, why: 'COP 70 mmHg 是血漿的 2.5 倍，血漿增量 3–4 倍輸入量，全靠間質失水。適用於低白蛋白併水腫的病人。' },
    { q: '關於 HES 製劑，哪一項正確？', o: ['Tetrastarch 的取代比最高、凝血病變最嚴重', 'Hetastarch（450 kD／0.7）凝血病變風險最高；tetrastarch（130/0.4）要 >50 mL/kg 才顯著', 'HES 不影響腎功能已是定論', 'HES 會升高血清脂肪酶'], a: 1, why: 'HES 抑制 Factor VII、vWF 與血小板黏附。AKI 風險在重症／敗血症研究中升高、在腹部手術病人未見，仍是未解問題。HES 升的是澱粉酶（2–3 倍、一週內恢復），脂肪酶不變。' },
    { q: '膠體與晶體之爭，作者的立場是？', o: ['一律用膠體', '一律用晶體', '依情境挑：危及生命的低血容用 5% 白蛋白、脫水用 RL、低白蛋白併水腫用 25% 白蛋白', '兩者混合 1:1'], a: 2, why: '為所有低血容選同一種液體是問錯問題。膠體撐血漿與心輸出量較強但無存活優勢；晶體便宜但要 3 倍以上體積、水腫與死亡率相關。' }
  ]);
  I.renderQuiz('qz_mgmt', 'fluids-mgmt', [
    { q: '驅動靜脈回流的壓力梯度是？', o: ['MAP − CVP', 'Pms（平均系統壓）− 右房壓', '收縮壓 − 舒張壓', '肺動脈壓 − 左房壓'], a: 1, why: '靜脈系統裝著 75% 的血量，像一個大水槽：流出量由水位（Pms）決定，不是上游水塔（動脈壓）。輸液幾乎不改變 Rv。' },
    { q: '右房壓每上升 1 mmHg，靜脈回流大約？', o: ['增加 14%', '減少 14%', '不變', '增加 5%'], a: 1, why: 'Guyton 的靜脈回流曲線：PRA 升到等於 Pms 時回流歸零。所以 CVP 不該是輸液目標；真正的液體反應是 (Pms − CVP) 梯度變大。' },
    { q: '75 kg 男性血漿量約 3 L，臨床上觸發輸液的缺失量大約是？', o: ['1,500 mL', '450 mL（15%）', '100 mL', '3,000 mL'], a: 1, why: '15% 之前多半沒有症狀。用晶體液補 450 mL 血漿要 2.25 L，其中 1.8 L 進了間質。' },
    { q: '評估血管內容積，哪個生命徵象最敏感？', o: ['仰臥心搏過速', '仰臥低血壓', '站立心跳增加 ≥30 bpm（缺失 15% 即出現）', '呼吸速率'], a: 2, why: '急性失血 25% 仰臥也常沒有心搏過速（心搏過緩反而可能更常見）；仰臥低血壓要缺 >30%。可惜 ICU 病人多半站不起來。' },
    { q: 'CVP 與循環血量的關係？', o: ['線性正相關', '沒有可靠關係，且升高 CVP 會阻礙靜脈回流——不該拿它做輸液決策', '只在呼吸器病人可靠', 'CVP <8 一定是低血容'], a: 1, why: '右心室順應性與胸內正壓都會抬高 CVP；呼氣末量測減少但消不掉 PEEP 的影響。IVC 直徑變異也被證明不可靠。' },
    { q: 'PCO₂ gap 相對於 ScvO₂ 的優點？', o: ['更便宜', '對低灌流較專一，且不受敗血症的氧利用缺陷干擾', '能反映組織氧合是否足夠', '不需要中央靜脈導管'], a: 1, why: 'gap 與心輸出量成反比（CO₂ 洗出）；正常 2–5 mmHg，>6 為低灌流。但它不告訴你組織氧合夠不夠，兩者合看最好。' },
    { q: '被動抬腿試驗的正確做法？', o: ['從平躺開始抬腿 90°', '從半坐 30–45° 開始，用病床放平軀幹並抬腿 30–45°，以連續心輸出量監測心搏量 ≥10% 上升', '只看血壓上升', '需要先給 500 mL'], a: 1, why: '約 300 mL 血回心，敏感度 85%／專一度 92%；反應幾分鐘消退。心跳加快或回半坐後仍持續，要懷疑疼痛假陽性；腹內高壓會假陰性。' }
  ]);
})();
