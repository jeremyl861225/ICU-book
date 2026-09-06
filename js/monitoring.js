/* ICU Book · Section III 生理監測 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 7–9（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }

  /* ================= Ch7 ================= */
  /* 雙重血氧：SpO₂ − SvO₂ ≈ 氧萃取 */
  I.bindCalc('c7dual', function () {
    var sp = num('du_sp'), sv = num('du_sv');
    var d = sp - sv;
    var h = row('SpO₂ − SvO₂', fmt(d, 0), '%', !isFinite(d) ? 'fl-na' : d >= 50 ? 'fl-hot' : d > 30 ? 'fl-warn' : d < 20 ? 'fl-warn' : 'fl-ok', !isFinite(d) ? '' : d >= 50 ? '≥50% 有氧代謝受威脅' : d > 30 ? '>30% DO₂ 相對不足' : d < 20 ? '<20% 氧利用缺陷' : '正常 20–30%', '≈ 氧萃取率（SaO₂ >90% 時）');
    h += row('SvO₂', fmt(sv, 0), '%', !isFinite(sv) ? 'fl-na' : sv <= 50 ? 'fl-hot' : sv < 65 ? 'fl-warn' : sv >= 80 ? 'fl-warn' : 'fl-ok', !isFinite(sv) ? '' : sv <= 50 ? '≤50% 威脅' : sv < 65 ? '<65% DO₂ 降' : sv >= 80 ? '≥80% 利用缺陷（敗血）' : '正常 65–75%', '變化 >5% 且持續 >10 分鐘才顯著');
    h += '<div class="rx-flag">SpO₂ − SvO₂ ≥50% 是被驗證過的<b>輸血指標</b>。ScvO₂ 在休克時比 SvO₂ 高（腦血流相對保留），單次可差 10%，看趨勢。</div>';
    document.getElementById('c7dual_out').innerHTML = I.wrap(h);
  });
  /* PaCO₂ − PETCO₂ */
  I.bindCalc('c7gap', function () {
    var pa = num('cg_pa'), pe = num('cg_pe');
    var d = pa - pe;
    var h = row('PaCO₂ − PETCO₂', fmt(d, 0), 'mmHg', !isFinite(d) ? 'fl-na' : d > 5 ? 'fl-warn' : d < 0 ? 'fl-warn' : 'fl-ok', !isFinite(d) ? '' : d > 5 ? 'PETCO₂ 偏低：死腔增加' : d < 0 ? 'PETCO₂ 高於 PaCO₂' : '接近（健康肺）', '');
    h += '<div class="rx-flag">' + (!isFinite(d) ? '' : d > 5 ? 'PETCO₂ &lt; PaCO₂ 的原因：呼吸器管路漏氣、肺過度充氣、肺炎、阻塞性肺病、肺水腫、肺栓塞、心輸出急降。呼吸器病人可用這個差值找最適當的潮氣量。' : d < 0 ? 'PETCO₂ &gt; PaCO₂：高代謝、代謝性酸中毒、高氧。' : '大多數呼吸衰竭會增加生理死腔，差值可用來追蹤病程。') + '</div>';
    document.getElementById('c7gap_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch8 ================= */
  I.bindCalc('c8hd', function () {
    var ht = num('pa_h'), wt = num('pa_w'), co = num('pa_co'), hr = num('pa_hr'), map = num('pa_map'), cvp = num('pa_cvp'), pap = num('pa_pap'), pawp = num('pa_pawp');
    var bsa = (ht > 0 && wt > 0) ? (ht + wt - 60) / 100 : NaN;
    var ci = co / bsa, si = ci / hr * 1000, svri = (map - cvp) / ci, pvri = (pap - pawp) / ci;
    var h = '';
    h += row('BSA', fmt(bsa, 2), 'm²', 'fl-na', 'Mattar', '(身高 cm ＋ 體重 kg − 60) / 100');
    h += row('CVP', fmt(cvp, 0), 'mmHg', !isFinite(cvp) ? 'fl-na' : (cvp >= 0 && cvp <= 5) ? 'fl-ok' : 'fl-warn', !isFinite(cvp) ? '' : '正常 0–5');
    h += row('PAWP', fmt(pawp, 0), 'mmHg', !isFinite(pawp) ? 'fl-na' : (pawp >= 6 && pawp <= 12) ? 'fl-ok' : 'fl-warn', !isFinite(pawp) ? '' : '正常 6–12', '呼氣末讀；變化 >4 才顯著');
    h += row('Cardiac index', fmt(ci, 2), 'L/min/m²', !isFinite(ci) ? 'fl-na' : (ci >= 2.4 && ci <= 4) ? 'fl-ok' : 'fl-warn', !isFinite(ci) ? '' : '正常 2.4–4.0', '熱稀釋變動 10%');
    h += row('Stroke index', fmt(si, 0), 'mL/m²', !isFinite(si) ? 'fl-na' : (si >= 20 && si <= 40) ? 'fl-ok' : 'fl-warn', !isFinite(si) ? '' : '正常 20–40', 'CI / HR');
    h += row('SVRI', fmt(svri, 1), 'Wood', !isFinite(svri) ? 'fl-na' : (svri >= 25 && svri <= 30) ? 'fl-ok' : 'fl-warn', !isFinite(svri) ? '' : '正常 25–30', '(MAP − CVP) / CI；×80 = ' + fmt(svri * 80, 0) + ' dyn·s·cm⁻⁵·m²');
    h += row('PVRI', fmt(pvri, 2), 'Wood', !isFinite(pvri) ? 'fl-na' : (pvri >= 1 && pvri <= 2) ? 'fl-ok' : 'fl-warn', !isFinite(pvri) ? '' : '正常 1–2', '(平均 PAP − PAWP) / CI');
    h += '<div class="rx-flag">Wood 單位 ＝ mmHg/L/min/m²。肺高壓時 wedge 會低於 PA 舒張壓；wedge 不是微血管靜水壓（Pc − Pw ＝ Q × Rv）。</div>';
    document.getElementById('c8hd_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c8td', function () {
    var a = num('td_1'), b = num('td_2'), c = num('td_3');
    var vals = [a, b, c].filter(isFinite);
    var mean = vals.length ? vals.reduce(function (x, y) { return x + y; }, 0) / vals.length : NaN;
    var spread = vals.length >= 2 ? (Math.max.apply(null, vals) - Math.min.apply(null, vals)) / mean * 100 : NaN;
    var h = row('平均 CO', fmt(mean, 2), 'L/min', 'fl-na', vals.length + ' 次');
    h += row('最大差距', fmt(spread, 0), '%', !isFinite(spread) ? 'fl-na' : spread <= 10 ? 'fl-ok' : 'fl-hot', !isFinite(spread) ? '' : spread <= 10 ? '≤10% 可信，取平均' : '>10% 不可靠，重測', '三次差 ≤10% 即可');
    h += '<div class="rx-flag">誤差來源：注射量不足或太溫（高估）、注射時機隨呼吸週期變動、三尖瓣逆流（多為低估）、心內分流（高估）。CO 本身在病況不變下也會波動 10%。</div>';
    document.getElementById('c8td_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch9 ================= */
  I.bindCalc('c9o2', function () {
    var hb = num('o2_hb'), sa = num('o2_sa'), pa = num('o2_pa'), sv = num('o2_sv'), pv = num('o2_pv'), co = num('o2_co'), ht = num('o2_h'), wt = num('o2_w');
    var bsa = (ht > 0 && wt > 0) ? (ht + wt - 60) / 100 : NaN;
    var cao2 = 1.34 * hb * sa / 100 + (isFinite(pa) ? 0.003 * pa : 0);
    var cvo2 = 1.34 * hb * sv / 100 + (isFinite(pv) ? 0.003 * pv : 0);
    var do2 = co * cao2 * 10, vo2 = co * (cao2 - cvo2) * 10, er = vo2 / do2;
    var h = '';
    h += row('CaO₂', fmt(cao2, 1), 'mL/dL', 'fl-na', isFinite(pa) ? '含溶解氧 ' + fmt(0.003 * pa, 2) : '未計溶解氧', '正常約 20；溶解只占 1.5%');
    h += row('CvO₂', fmt(cvo2, 1), 'mL/dL', 'fl-na', '', '正常約 15；動靜脈差 5 mL/dL');
    h += row('DO₂', fmt(do2, 0), 'mL/min', !isFinite(do2) ? 'fl-na' : do2 < 900 ? 'fl-warn' : 'fl-ok', !isFinite(do2) ? '' : '正常 900–1,100', isFinite(bsa) ? '指數化 ' + fmt(do2 / bsa, 0) + ' mL/min/m²（正常 520–600）' : '');
    h += row('VO₂', fmt(vo2, 0), 'mL/min', !isFinite(vo2) ? 'fl-na' : vo2 < 200 ? 'fl-warn' : 'fl-ok', !isFinite(vo2) ? '' : '正常 200–270', (isFinite(bsa) ? '指數化 ' + fmt(vo2 / bsa, 0) + '（正常 110–160）· ' : '') + '計算值變異 ±18%');
    h += row('O₂ER', fmt(er * 100, 0), '%', !isFinite(er) ? 'fl-na' : er >= 0.5 ? 'fl-hot' : er > 0.3 ? 'fl-warn' : er < 0.2 ? 'fl-warn' : 'fl-ok', !isFinite(er) ? '' : er >= 0.5 ? '≥50% 威脅' : er > 0.3 ? '>30% DO₂ 降' : er < 0.2 ? '<20% 利用缺陷' : '正常 20–30%', 'VO₂ / DO₂');
    h += '<div class="rx-flag">貧血減半 → CaO₂ 減半；PaO₂ 減半（SaO₂ 98 → 78%）→ CaO₂ 只減 20%：<b>貧血對動脈氧合的影響遠大於低血氧</b>。動脈血只裝了全身 30% 的氧，70% 在靜脈。</div>';
    document.getElementById('c9o2_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch7 PETCO₂ 判讀 */
  var cp = { ctx: null };
  window.cpPick = function (k, v, btn) { flowSelect(btn); cp[k] = v; cpRender(); };
  function cpRender() {
    var cls = 'rec-idle', t = '請選擇情境', d = '', n = '';
    var R = {
      tube: ['rec-urgent', '插管確認：呼氣 CO₂ 是標準作業，聽診不夠', '<li>未察覺的食道插管在重症緊急插管中<b>每 18 次就有 1 次</b>；呼吸音無法區分氣管與食道。</li><li>比色或紅外線 CO₂ 偵測都可以。</li><li>例外：心跳停止時靜脈回流極少，氣管內也可能測不到 CO₂；嚴重支氣管痙攣的說法未證實。</li>'],
      sed: ['rec-elective', '程序鎮靜：監測 PETCO₂，它比 SpO₂ 早警告', '<li>低通氣先讓 PETCO₂ 上升，SpO₂ 下降在後；高風險：高齡、肥胖、睡眠呼吸中止、慢性 CO₂ 滯留。</li><li>非插管病人用鼻管型紅外線探頭。所有程序鎮靜都建議監測。</li>'],
      cpr: ['rec-urgent', 'CPR：20 分鐘後 PETCO₂ ≤10 mmHg → 恢復自主循環機會低', '<li>PETCO₂ 隨心輸出量變動，是 CPR 品質與預後的即時指標。</li><li>詳見第 21 章。</li>'],
      vent: ['rec-blue', '呼吸器病人：PaCO₂ − PETCO₂ 變大 ＝ 死腔增加', '<li>肺炎、阻塞性肺病、肺水腫、肺栓塞、心輸出急降、管路漏氣、<b>潮氣量過大</b>都會拉大差值；可用來找最適潮氣量、追蹤病程。</li><li>PETCO₂ 反過來高於 PaCO₂：高代謝、代謝性酸中毒、高氧。</li>'],
      fluid: ['rec-blue', 'PETCO₂ 變化可預測呼吸器病人的液體反應性', '<li>PETCO₂ 與心輸出量變化相關；被動抬腿時 PETCO₂ 上升預測 fluid responsiveness（呼吸器病人成立、自主呼吸健康人不成立）。</li>']
    }[cp.ctx];
    if (R) { cls = R[0]; t = R[1]; d = R[2]; n = 'Nassar & Schmidt 2016（Chest）；PUMA 2022 食道插管共識。'; }
    flowRec('cp_rec', cls, t, d, n);
  }
  window.cpReset = function () { cp = { ctx: null }; selAll('#cp_flow'); cpRender(); };

  /* Ch8 wedge 可信度 */
  var wp = { resp: null, peep: null, ph: null, mr: null };
  window.wpPick = function (k, v, btn) { flowSelect(btn); wp[k] = v; wpRender(); };
  function wpRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (wp.resp && wp.peep && wp.ph && wp.mr) {
      var issues = [];
      if (wp.resp === 'yes') issues.push('有呼吸變異 → 在<b>呼氣末</b>讀（正壓通氣＝波動最低點、自主呼吸＝最高點）；此時 wedge 只在 Pc > 肺泡壓時才反映左房壓。');
      if (wp.peep === 'yes') issues.push('PEEP 會假性抬高 wedge 與 CVP → 可短暫脫離呼吸器測；intrinsic PEEP 更難，見第 29 章的校正法。');
      if (wp.ph === 'yes') issues.push('肺高壓：wedge 會<b>低於</b> PA 舒張壓，不能拿 PAD 代替 wedge。');
      if (wp.mr === 'yes') issues.push('二尖瓣逆流：大 v 波，wedge 高估左心室舒張末壓（PAWP ＝ PLA ＝ LVEDP 的前提是二尖瓣正常）。');
      cls = issues.length ? 'rec-urgent' : 'rec-elective';
      t = issues.length ? 'Wedge 有 ' + issues.length + ' 個干擾因素，讀值前先處理' : 'Wedge 可直接當左心室充填壓（Pw ＝ Pc ＝ PLA ＝ LVEDP）';
      d = issues.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '<li>正常 6–12 mmHg；自發變動 ≤4（可到 7），<b>變化 >4 才顯著</b>。</li><li>Wedge <b>不是</b>微血管靜水壓：Pc − Pw ＝ Q × Rv，肺靜脈收縮（低血氧、內毒素、升壓劑、ARDS）會放大差距——用「正常 wedge」排除靜水壓性肺水腫應廢棄。</li>';
      n = '球長期充氣會肺動脈破裂或肺梗塞：量完就放氣。';
    }
    flowRec('wp_rec', cls, t, d, n);
  }
  window.wpReset = function () { wp = { resp: null, peep: null, ph: null, mr: null }; selAll('#wp_flow'); wpRender(); };

  /* Ch9 氧萃取判讀 */
  var ox = { er: null, sep: null };
  window.oxPick = function (k, v, btn) { flowSelect(btn); ox[k] = v; oxRender(); };
  function oxRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ox.er && ox.sep) {
      var R = {
        lo: ['rec-urgent', '萃取 <20%（SvO₂ ≥80%）：氧利用缺陷，不是氧不夠', '<li>通常是敗血症（PDH 被內毒素與細胞激素抑制、粒線體用不掉氧）；也叫「周邊分流」。</li><li>此時 SvO₂／ScvO₂ 假性偏高，不能拿來判斷 DO₂；改追 PCO₂ gap 與乳酸趨勢。</li>'],
        ok: ['rec-blue', '萃取 20–30%（SvO₂ 65–75%）：供需平衡', '<li>維持；注意變化 >5% 且持續 >10 分鐘才算顯著。</li>'],
        mid: ['rec-elective', '萃取 30–49%（SvO₂ 50–64%）：DO₂ 相對不足但尚未危及有氧代謝', '<li>找哪一個掉了：心輸出、Hb、SaO₂。</li><li>萃取率的代償上限約 50%，還有空間但要開始處理。</li>'],
        hi: ['rec-urgent', '萃取 ≥50%（SvO₂ ≤50%）：有氧代謝受威脅，VO₂ 已變成 delivery-dependent', '<li>立即提升 DO₂：輸液／強心（CO）、輸血（Hb）、氧氣（SaO₂）。</li><li>SaO₂ − SvO₂ ≥50% 是驗證過的<b>輸血指標</b>。</li>']
      }[ox.er];
      cls = R[0]; t = R[1]; d = R[2];
      if (ox.sep === 'yes' && ox.er !== 'lo') d += '<li>敗血症背景：乳酸上升多半是<b>有氧</b>（PDH 抑制＋兒茶酚胺驅動糖解），不等於缺氧；乳酸仍有預後意義。</li>';
      n = '前提：代謝率正常、SaO₂ >90%。ScvO₂ 在休克比 SvO₂ 高（平均 7%、可達 18%），看趨勢。';
    }
    flowRec('ox_rec', cls, t, d, n);
  }
  window.oxReset = function () { ox = { er: null, sep: null }; selAll('#ox_flow'); oxRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_ox', 'monitoring-ox', [
    { q: '脈搏血氧計為什麼能只量到動脈血？', o: ['用了三種波長', '只分析光傳輸中隨動脈搏動變化的那一部分', '探頭夾在動脈上', '用反射式光學'], a: 1, why: '660／940 nm 兩個波長，收縮期動脈血容積增加使透光下降；只取搏動成分就排除靜脈血與組織的干擾。' },
    { q: '一氧化碳中毒病人 SpO₂ 98%，正確的解讀是？', o: ['氧合良好', 'SpO₂ 不偵測 COHb，會高估 SaO₂，要送血做 CO-oximetry', 'SpO₂ 會偏低', '改用額頭探頭'], a: 1, why: '標準脈搏血氧只用兩個波長，COHb 與 metHb 對它影響很小；實驗室 CO-oximeter 用到 8 個波長。' },
    { q: 'SpO₂ 與 SaO₂ 在深膚色病人的差異？', o: ['沒有差異', 'SpO₂ 高估 1–3%，未偵測低血氧（SaO₂ <88% 而 SpO₂ ≥92%）在黑人 6.9%、白人與亞裔 4.9%', 'SpO₂ 低估', '只有額頭探頭有差'], a: 1, why: '單次準確度 3–4%，SpO₂ 一般略高於 SaO₂。' },
    { q: 'SpO₂ − SvO₂ 差 ≥50% 代表？', o: ['正常', 'DO₂ 已低到威脅有氧代謝，也是有效的輸血指標', '敗血症的氧利用缺陷', '過度氧合'], a: 1, why: '正常 25%，DO₂ 下降時萃取線性升到 50%，之後 VO₂ 開始掉。<20% 才是利用缺陷。' },
    { q: '程序鎮靜為什麼要監測 PETCO₂ 而不只是 SpO₂？', o: ['SpO₂ 不準', '低通氣時 PETCO₂ 上升先於 SpO₂ 下降', 'PETCO₂ 比較便宜', '因為指引規定'], a: 1, why: '高齡、肥胖、睡眠呼吸中止、慢性 CO₂ 滯留者風險最高；所有程序鎮靜都建議監測。' },
    { q: 'CPR 20 分鐘後 PETCO₂ 仍 ≤10 mmHg，意義是？', o: ['要加大通氣', '恢復自主循環的機會不高', '管子在食道', '需要更多 epinephrine'], a: 1, why: 'PETCO₂ 隨心輸出量變動，是 CPR 的預後指標；氣管內管確認也靠它，但心跳停止時可能測不到。' }
  ]);
  I.renderQuiz('qz_pac', 'monitoring-pac', [
    { q: 'PA 導管從右心室進入肺動脈時，壓力波形的變化是？', o: ['收縮壓突升', '舒張壓突升、收縮壓不變', '波形消失', '出現 a、c、v 波'], a: 1, why: '舒張壓上升來自肺循環的阻力；再推進到搏動消失就是 wedge，正常與 PA 舒張壓同高。' },
    { q: 'Wedge 壓等於左心室舒張末壓的前提是？', o: ['沒有 PEEP', '二尖瓣功能正常（Q＝0 時 Pw＝Pc＝PLA）', '心輸出量正常', '病人自主呼吸'], a: 1, why: '球囊阻斷血流後導管尖端到左房是一段靜止血柱；二尖瓣逆流的大 v 波會讓它高估。' },
    { q: '正壓通氣下 wedge 有呼吸變異，該在哪裡讀？', o: ['波動最高點', '波動最低點（呼氣末）', '取平均', '吸氣末'], a: 1, why: '呼氣末胸內壓為零，血管內壓才等於穿壁壓；自主呼吸時反過來取最高點。PEEP 會假性抬高，可短暫脫離呼吸器。' },
    { q: '熱稀釋三次量到 5.0、5.4、6.2 L/min，怎麼處理？', o: ['取平均 5.5', '差距 >10%，不可靠，重測', '取最大值', '取中位數'], a: 1, why: '三次差 ≤10% 才可信；CO 本身在病況不變下也有 10% 波動，變化要 >10% 才顯著。' },
    { q: '三尖瓣逆流對熱稀釋 CO 最常見的影響？', o: ['高估', '低估（注射液再循環，曲線拉長低幅）', '無影響', '無法測得'], a: 1, why: '也可能因注射液被回溫而高估；心內分流則是高估。' },
    { q: 'Marino 對「PA 導管不改善存活」的反駁是？', o: ['研究做錯了統計', '它是監測工具不是治療，該用結果評估的是治療；而且醫師常看不懂它的數據', '存活率其實有改善', '應該全面禁用'], a: 1, why: '1999–2013 使用量降了 70%；在心因性休克它反而與較好結果相關。作者觀點。' }
  ]);
  I.renderQuiz('qz_o2', 'monitoring-o2', [
    { q: 'Hb 15、SaO₂ 98%、PaO₂ 90 時 CaO₂ 約多少？溶解氧占多少？', o: ['約 20 mL/dL，溶解氧只占 1.5%', '約 15 mL/dL，溶解氧 10%', '約 30 mL/dL，溶解氧 5%', '約 10 mL/dL，溶解氧 20%'], a: 0, why: '1.34 × 15 × 0.98 ＝ 19.7，加 0.003 × 90 ＝ 0.27。' },
    { q: '貧血與低血氧對 CaO₂ 的影響比較？', o: ['一樣', 'Hb 減半 CaO₂ 減半；PaO₂ 減半（SaO₂ 98→78%）CaO₂ 只減 20%', '低血氧影響較大', '兩者都不影響'], a: 1, why: '解離曲線上段平坦，PaO₂ 掉到 60 以前 SaO₂ 變化很小。' },
    { q: '正常成人靜息 VO₂ 約 250 mL/min 是怎麼來的？', o: ['DO₂ 的一半', '動靜脈氧含量差 5 mL/dL × CO 5 L/min', 'CaO₂ × 12', '每公斤 10 mL'], a: 1, why: '也就是每公升血被拿走 50 mL 氧；O₂ER 約 0.25。' },
    { q: 'DO₂ 下降時，身體怎麼維持 VO₂？', o: ['降低代謝', '提高氧萃取率，最高到約 50%，之後 VO₂ 才開始掉', '增加 Hb', '增加溶解氧'], a: 1, why: 'VO₂ ＝ DO₂ × O₂ER；萃取到 50% 仍不夠時就是氧限制代謝的門檻。' },
    { q: 'SvO₂ 85% 出現在敗血性休克病人，代表？', o: ['氧輸送充足', '氧利用缺陷（PDH 抑制、粒線體用不掉氧），SvO₂ 此時不可靠', '需要輸血', '過度通氣'], a: 1, why: '≥80% ＝ 利用缺陷；<65% 才是 DO₂ 不足；≤50% 威脅有氧代謝。' },
    { q: 'Marino 對乳酸的立場是？', o: ['乳酸就是缺氧', '重症的高乳酸多半是有氧生成（敗血症 PDH 抑制、壓力、硫胺缺乏、藥物），乳酸還是心腦的燃料；但初始值與清除時間仍與死亡率相關', '乳酸沒有預後意義', '乳酸只在肝衰竭升高'], a: 1, why: '細胞內 PO₂ 本來就只有 1–5 mmHg，缺氧不是常見死因；乳酸 3.62 kcal/g 可供心肌 60% 能量。作者觀點。' }
  ]);

  cpRender(); wpRender(); oxRender();
})();
