/* ICU Book · Section I 血管通路 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 1–3（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;

  /* ================= Ch1 ================= */
  /* French ↔ gauge ↔ 外徑（表 1.1；gauge 的外徑各廠不一，取表中對照） */
  var GAUGE = { 27: [1, 0.4], 20: [3, 0.9], 18: [4, 1.2], 16: [5, 1.7], 13: [7, 2.4], 11: [9, 3.2] };
  I.bindCalc('c1sz', function () {
    var fr = num('sz_fr'), g = num('sz_g');
    var h = '';
    if (isFinite(fr)) h += row('外徑（由 French）', fmt(fr * 0.33, 2), 'mm', 'fl-na', fr + ' Fr', 'Fr × 0.33 mm');
    if (isFinite(g)) {
      var m = GAUGE[g];
      h += row('由 gauge 對照', m ? m[0] + ' Fr · ' + m[1] : '—', m ? 'mm' : '', 'fl-na', m ? g + ' G' : '表中無此 gauge', 'gauge 越大管越細；各廠外徑不標準化');
    }
    if (!h) h += row('請填 French 或 gauge', '—', '', 'fl-na', '');
    h += '<div class="rx-flag">Fr 用在多腔導管、大口徑單腔、導尿管、鼻胃管、胸管；gauge 用在針、小口徑單腔與多腔導管的各腔（16 G 最粗 → 21 G 最細）。</div>';
    document.getElementById('c1sz_out').innerHTML = I.wrap(h);
  });

  /* Hagen-Poiseuille 相對流量：Q ∝ r⁴ / L，以表 1.1 的外徑當口徑代理 */
  I.bindCalc('c1hp', function () {
    var g1 = num('hp_g1'), l1 = num('hp_l1'), g2 = num('hp_g2'), l2 = num('hp_l2');
    var d1 = GAUGE[g1] ? GAUGE[g1][1] : NaN, d2 = GAUGE[g2] ? GAUGE[g2][1] : NaN;
    var q = (isFinite(d1) && isFinite(d2) && l1 > 0 && l2 > 0) ? Math.pow(d2 / d1, 4) * (l1 / l2) : NaN;
    var h = '';
    h += row('導管 B 相對於 A 的流量', fmt(q, 2), '×', !isFinite(q) ? 'fl-na' : q >= 1 ? 'fl-ok' : 'fl-warn', !isFinite(q) ? '' : q >= 1 ? 'B 流得快' : 'B 流得慢', '(r_B/r_A)⁴ × (L_A/L_B)');
    h += row('口徑因子', isFinite(d1) && isFinite(d2) ? fmt(Math.pow(d2 / d1, 4), 2) : '—', '×', 'fl-na', '半徑四次方');
    h += row('長度因子', (l1 > 0 && l2 > 0) ? fmt(l1 / l2, 2) : '—', '×', 'fl-na', '長度反比');
    h += '<div class="rx-flag">書中實測：16 G 是 18 G 的兩倍多、是 20 G 的近四倍（外徑差不到 1 mm）；2 吋 → 6 吋流量降 40%，再到 12 吋又降 40%。輸液速率由<b>導管</b>尺寸決定，不是被插的靜脈。這裡用外徑當內徑的代理，只看相對大小。</div>';
    document.getElementById('c1hp_out').innerHTML = I.wrap(h);
  });

  /* 重力輸注壓力：68 cm → 50 mmHg（1 psi） */
  I.bindCalc('c1ht', function () {
    var cm = num('ht_cm');
    var mm = cm * 50 / 68, psi = mm / 50;
    var h = '';
    h += row('輸注壓力', fmt(mm, 0), 'mmHg', 'fl-na', isFinite(psi) ? fmt(psi, 2) + ' psi' : '', '68 cm ＝ 50 mmHg ＝ 1 psi；100 cm ＝ 75 mmHg');
    h += row('與幫浦上限相比', isFinite(psi) ? fmt(psi / 15 * 100, 0) : '—', '%', 'fl-na', '幫浦最高 15 psi', '容積式 0.1–1,000 mL/h；針筒式 ≤100 mL、0.1–100 mL/h');
    h += '<div class="rx-flag">大出血專用的快速輸液系統可到 1.5 L/min，要配 7–8 Fr、2–2.5 吋的快速輸液導管。</div>';
    document.getElementById('c1ht_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch3 ================= */
  /* 配對血液培養判讀：定量 ≥3 倍、時間差 ≥2 小時 */
  I.bindCalc('c3cx', function () {
    var cc = num('cx_cath'), cp = num('cx_per'), tc = num('cx_tcath'), tp = num('cx_tper'), same = val('cx_same');
    var ratio = cc / cp, dt = tp - tc;
    var h = '';
    h += row('定量比值 導管血 / 周邊血', fmt(ratio, 1), '×', !isFinite(ratio) ? 'fl-na' : ratio >= 3 ? 'fl-hot' : 'fl-ok', !isFinite(ratio) ? '' : ratio >= 3 ? '≥3 符合導管來源' : '<3 不符合', '準確度 94%');
    h += row('陽性時間差 周邊 − 導管', fmt(dt, 1), 'h', !isFinite(dt) ? 'fl-na' : dt >= 2 ? 'fl-hot' : 'fl-ok', !isFinite(dt) ? '' : dt >= 2 ? '導管血早 ≥2 h 符合' : '<2 h 不符合', '準確度 91%');
    var verdict = same === 'no' ? '兩邊菌種不同：不符合導管相關菌血症的定義，先找其他來源。' :
      (ratio >= 3 || dt >= 2) ? '同一菌種且至少一項達標：<b>符合導管相關菌血症</b>。' :
      (isFinite(ratio) || isFinite(dt)) ? '同一菌種但都未達標：不能歸咎導管；臨床上常只憑「同菌種、無其他來源」就當作導管來源。' : '填入數值後判讀。';
    h += '<div class="rx-flag">' + verdict + ' 兩種方法都要周邊靜脈血一套；<b>多腔導管每一腔都要抽</b>，只抽一腔會漏掉 38%。</div>';
    document.getElementById('c3cx_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }

  /* Ch1 選通路 */
  var ac = { ctx: null, iv: null, dur: null };
  window.acPick = function (k, v, btn) {
    flowSelect(btn);
    if (k === 'ctx') { ac = { ctx: v, iv: null, dur: null }; } else ac[k] = v;
    acRender();
  };
  function acRender() {
    var em = ac.ctx === 'emerg', gen = ac.ctx === 'ward';
    flowShow('ac_c2', em); flowShow('ac_s2', em);
    flowShow('ac_c3', gen); flowShow('ac_s3', gen);
    if (!em) flowClearSel('ac_s2'); if (!gen) flowClearSel('ac_s3');
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (em) {
      if (ac.iv === 'yes') { cls = 'rec-elective'; t = '短周邊導管，越粗越短越好'; d = '<li>16 G 的流量是 18 G 兩倍多、20 G 近四倍；2 吋比 6 吋多 40%。</li><li>需要大量輸液就加壓（重力 68 cm 只有 50 mmHg）或用 7–8 Fr 快速輸液導管配快速輸液系統（1.5 L/min）。</li><li>已有中央導管時用<b>遠端腔（16 G）</b>，流量是其他腔的兩倍以上。</li>'; }
      else if (ac.iv === 'no') { cls = 'rec-urgent'; t = '骨內通路：IV 一次失敗就上 IO'; d = '<li>近端脛骨首選（成功率高、不干擾插管與胸外按壓）；插入點＝髕骨下緣下 3 cm 再往內 2 cm；近端肱骨流量較高。</li><li>15 G 針：25 mm 一般成人、45 mm 肥胖；針要垂直 90°，突然失去阻力＝進髓腔；抽不到血先沖 5–10 mL。</li><li>清醒病人先打 2% lidocaine 40 mg（2 mL）2 分鐘、停 1 分鐘、沖 10 mL；不夠再 20 mg。</li><li>流速只有周邊靜脈 25%（骨髓壓約 30 mmHg）→ 一律加壓；大出血可雙 IO。24 小時內換成靜脈通路。</li><li>禁忌：該骨骨折或剛穿刺過、該肢血管損傷、穿刺處燒傷／蜂窩組織炎／骨髓炎、osteopetrosis。</li>'; n = 'AHA 2020：IV 初次失敗或不可行即改 IO；院外成功率可達 97%。'; }
      else { t = '緊急狀況：第 2 步——周邊靜脈一次就上得去嗎？'; }
    } else if (gen) {
      if (ac.dur === 'short') { cls = 'rec-blue'; t = '短周邊導管就好'; d = '<li>16–22 G、3–5 cm；首次失敗約 1/3，3 天內 40–60% 會失效（靜脈炎、阻塞、脫落、外滲）。</li><li>周邊只需手套（可不滅菌，別碰導管）。</li>'; }
      else if (ac.dur === 'mid') { cls = 'rec-blue'; t = 'Midline 導管：數天到數週的首選'; d = '<li>15–20 cm，超音波下進 basilic（首選，直、遠離動脈與神經）／brachial／cephalic。</li><li>平均留置 14 天；<b>升壓劑可走 7–8 天</b>；比 PICC 阻塞少、CRBSI 少，DVT <5%。</li><li>雙腔 15 cm 每腔重力流量約 1.3 L/h——只有短導管的 20%，但仍超過幫浦上限。</li>'; n = '需要專責團隊放置是它普及的瓶頸。'; }
      else if (ac.dur === 'long') { cls = 'rec-blue'; t = 'PICC：預計數週以上的靜脈治療'; d = '<li>40–55 cm 進上腔靜脈；流量只有 midline 的 20%，阻塞較多；導管相關血栓常見但 >95% 無症狀。</li><li>能用 midline 就不必 PICC；PICC 仍適合需要好幾週的靜脈治療。</li>'; }
      else if (ac.dur === 'cvc') { cls = 'rec-urgent'; t = '中央靜脈導管：仍然需要它的情境'; d = '<li>危及生命的血行動力不穩、急性透析、暫時性經靜脈節律、侵入性血行動力學監測。</li><li>三腔 CVC 15／20／30 cm；快速輸液走遠端 16 G 腔。</li><li>部位、bundle 與確認方式見「中央靜脈」分頁。</li>'; }
      else { t = '一般住院：第 2 步——預計要用多久、要做什麼？'; }
    }
    flowRec('ac_rec', cls, t, d, n);
  }
  window.acReset = function () { ac = { ctx: null, iv: null, dur: null }; selAll('#ac_flow'); acRender(); };

  /* Ch2 選部位與插後確認 */
  var cv = { us: null, need: null };
  window.cvPick = function (k, v, btn) { flowSelect(btn); cv[k] = v; cvRender(); };
  function cvRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (cv.us && cv.need) {
      cls = 'rec-elective';
      var site = { std: '右側內頸靜脈', dial: '右側內頸靜脈（未來透析側的鎖骨下靜脈禁區）', icp: '股靜脈或平躺的內頸靜脈', obese: '內頸靜脈（超音波）或股靜脈', coag: '內頸靜脈或股靜脈（可壓迫的部位）' }[cv.need];
      t = '建議部位：' + site;
      d = '<li><b>Bundle</b>：手部衛生、chlorhexidine-alcohol 乾 30 秒（濕皮膚 2 分鐘）、帽口罩無菌衣手套全身鋪單。</li>';
      if (cv.us === 'yes') d += '<li>超音波：短軸找血管、看伴行動脈、確認穿刺；<b>長軸確認導線與導管在管腔內</b>（短軸後壁穿破可達 40%）。頸動脈穿刺 9.2% → 1.8%。</li>';
      else d += '<li>無超音波：IJV 前路（三角頂點朝同側乳頭 45°，5 cm 未進就偏外）或後路（EJV 越過 SCM 外緣上 1 cm，朝胸骨上切跡 5–6 cm）；鎖骨下 landmark 貼著鎖骨下緣朝胸骨上切跡；股靜脈脈搏內側 1–2 cm、深 2–4 cm。</li>';
      if (cv.need === 'icp') d += '<li>顱內壓高不做 Trendelenburg；股靜脈不進胸腔、沒有負壓吸氣的空氣栓塞風險。</li>';
      if (cv.need === 'dial') d += '<li>鎖骨下狹窄 15–50%，要保護未來透析的那一側手臂。</li>';
      if (cv.need === 'obese') d += '<li>病態肥胖的鎖骨下靜脈可能深過探針長度，landmark 法避免。</li>';
      if (cv.need === 'coag') d += '<li>凝血異常不是禁忌（plt <20k 或 INR >3 的矯正建議沒有證據），但選可以壓迫止血的部位。</li>';
      d += '<li>IJV／鎖骨下：頭低 15° 就夠（IJV 直徑 +20–25%、再多無用）、頭別轉超過 40°。股靜脈反而上身抬 15°（截面 +50%）並外展。</li><li><b>插完</b>：肺滑動排除氣胸（仰臥 CXR 漏一半）；subcostal 看右心房或 bubble study（10 mL 生理鹽水 2 秒內出現）；CXR 的話尖端在 carina 高度。尖端進右心房不必重放。</li>';
      n = '3SITES：CRBSI IJV 0.5%／鎖骨下 1.4%／股 1.2%，症狀性 DVT 0.5／0.9／1.4%——股靜脈的壞名聲大多不成立。';
    }
    flowRec('cv_rec', cls, t, d, n);
  }
  window.cvReset = function () { cv = { us: null, need: null }; selAll('#cv_flow'); cvRender(); };

  /* Ch3 疑似導管相關血流感染 */
  var cr = { sick: null, cand: null, conf: null, org: null };
  window.crPick = function (k, v, btn) { flowSelect(btn); if (k === 'conf') { cr.conf = v; cr.org = null; } else cr[k] = v; crRender(); };
  function crRender() {
    var s4 = cr.conf === 'yes';
    flowShow('cr_c4', s4); flowShow('cr_s4', s4); if (!s4) flowClearSel('cr_s4');
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (cr.sick || cr.cand || cr.conf) {
      cls = cr.conf === 'yes' ? 'rec-urgent' : 'rec-elective';
      t = cr.conf === 'yes' ? '確認導管相關菌血症：決定拔不拔、治多久' : '疑似導管相關感染：先培養、立刻經驗性治療、導管先留著';
      d = '<li>抽<b>每一腔</b>導管血＋周邊血培養後立即給藥；<b>vancomycin</b> 是骨幹（MRSA MIC >2 用 daptomycin）。</li>';
      if (cr.sick === 'yes') d += '<li>重症或中性球低下：加革蘭氏陰性覆蓋（carbapenem／cefepime／piperacillin-tazobactam），疑多重抗藥菌再加 aminoglycoside。</li>';
      if (cr.cand === 'yes') d += '<li>Candida 風險（股靜脈導管、TPN、血液惡性、長期抗生素、近期移植、他處有 Candida）：加 <b>echinocandin</b>。</li>';
      if (cr.conf === 'no' || !cr.conf) d += '<li>疑似案例只有 11% 最後確認——<b>先留管等培養</b>，不要反射性拔。48 小時內出現的發燒不會是導管。</li>';
      if (cr.conf === 'yes') {
        d += '<li><b>拔管指徵</b>：血行動力不穩或多重器官惡化、心內膜炎或化膿性血栓靜脈炎、S. aureus／Candida／Pseudomonas／多重抗藥 GN、適當治療下菌血症 >96 小時。拔了換新穿刺點，不走導線（血管極少時例外）。</li><li>留管時系統性抗生素穿不透 biofilm → <b>antibiotic lock</b>（同一抗生素 2–5 mg/mL 於 heparinized saline，每腔留 24 小時、每天換）；不能鎖就從可疑腔給藥。</li>';
        var dur = { cons: 'CoNS 且 72 小時內反應良好：≤7 天。', sa: 'S. aureus：先做 TEE 找心內膜炎（2/3 沒有雜音）；無心內膜炎且已拔管、非免疫低下、無血管內人工裝置 → 14 天；有心內膜炎 → 4–6 週＋感染科會診。', gn: '腸球菌或革蘭氏陰性桿菌：7–14 天，拔不拔都一樣。', cand: 'Candida：拔管；療程依念珠菌血症準則（本章未給天數）。' }[cr.org];
        if (dur) d += '<li><b>療程</b>：' + dur + '</li>';
        d += '<li>治療 72 小時仍敗血：找化膿性血栓靜脈炎（超音波血栓＋持續菌血症 → 拔管＋4–6 週，考慮 heparin）與心內膜炎。</li>';
      }
      n = 'IDSA 2009；前十名病原：CoNS 16%、S. aureus 13%、E. faecalis 8.4%、K. pneumoniae 8.4%、E. faecium 7%、C. albicans 6%…';
    }
    flowRec('cr_rec', cls, t, d, n);
  }
  window.crReset = function () { cr = { sick: null, cand: null, conf: null, org: null }; selAll('#cr_flow'); crRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_primer', 'access-primer', [
    { q: 'French 尺寸與外徑的關係是？', o: ['Fr × 0.33 mm ＝ 外徑', 'Fr ÷ 3 ＝ 內徑（吋）', 'Fr 越大管越細', 'Fr 與外徑無固定關係'], a: 0, why: 'French 從零起算、每一級增加 0.33 mm 外徑（4 Fr ＝ 1.2 mm、9 Fr ＝ 3.2 mm）；gauge 才是越大越細，而且各廠外徑不標準化。' },
    { q: '依 Hagen-Poiseuille，對流量影響最大的是？', o: ['導管長度', '被插的靜脈直徑', '導管內徑（半徑四次方）', '輸液黏度'], a: 2, why: '流量 ∝ r⁴／L：16 G 是 18 G 的兩倍多、20 G 的近四倍；長度只是反比。輸液速率由導管決定，不是靜脈。' },
    { q: 'Midline 導管與 PICC 相比，正確的是？', o: ['Midline 阻塞與 CRBSI 較少，DVT 略高但 <5%', 'Midline 不能輸升壓劑', 'PICC 流量比 midline 大', 'Midline 進上腔靜脈'], a: 0, why: 'Midline 15–20 cm 不進上腔靜脈；升壓劑可走 7–8 天；PICC 長度三倍多、流量只剩 20%，阻塞較多。' },
    { q: '三腔中央導管快速輸液應該用哪一腔？', o: ['近端腔', '中間腔', '遠端腔（16 G）', '哪一腔都一樣'], a: 2, why: '遠端腔口徑 16 G，其餘 18 G；流量差兩倍以上。' },
    { q: '超音波短軸與長軸的取捨，正確的是？', o: ['長軸較容易找到血管', '短軸看得到伴行動脈但針只是一個亮點；長軸看得到整根針', '短軸後壁穿破較少', '兩者都看不到導線'], a: 1, why: '短軸後壁穿破達 40%、長軸 18%；現行做法：短軸找血管與確認穿刺、長軸確認導線與導管在管腔內。' },
    { q: '成人骨內通路的首選部位與理由？', o: ['近端肱骨，流量最高', '近端脛骨，成功率高且不干擾插管與胸外按壓', '胸骨，歷史最久', '遠端股骨，最容易摸到'], a: 1, why: '肱骨流量較高但脛骨成功率高、位置不礙事；插入點在髕骨下緣下 3 cm、內側 2 cm。原文 A Final Word 寫成「近端股骨」，與內文不一致。' }
  ]);
  I.renderQuiz('qz_cvc', 'access-cvc', [
    { q: '中央靜脈導管的六項傳統適應症中，仍然沒有替代方案的是？', o: ['長期靜脈治療', '多重靜脈藥物', '危及生命的血行動力不穩與急性透析等特殊處置', '升壓劑輸注'], a: 2, why: '前四項都能用 midline 或 PICC 取代；休克與透析／節律／監測仍需 CVC。' },
    { q: '凝血異常病人要放中央導管，正確的態度是？', o: ['INR >1.5 一律先矯正', '沒有絕對禁忌；plt <20k 或 INR >3 的矯正建議沒有證據', 'plt <100k 禁止', '只能放 PICC'], a: 1, why: '書中明言沒有絕對禁忌，並指出矯正門檻缺乏證據；實務上選可壓迫的部位。' },
    { q: '內頸靜脈插管時頭低腳高的角度與頭部轉動，正確的是？', o: ['越低越好、頭轉到底', '15° 就夠（直徑 +20–25%），頭轉不超過 40°', '不需要頭低', '頭轉 90° 讓靜脈拉直'], a: 1, why: '超過 15° 沒有額外效果；頭轉 >40° 會把 IJV 拉到頸動脈上方，增加動脈穿刺。' },
    { q: '不小心把導管（不是探針）放進頸動脈，該怎麼辦？', o: ['立刻拔除並壓迫 5 分鐘', '留在原位，會診血管外科或介入放射科', '灌 heparin 後拔除', '改放對側'], a: 1, why: '探針穿刺壓 5 分鐘（凝血異常加倍）即可；大口徑導管拔除可能致命。' },
    { q: '3SITES 研究對股靜脈的結論？', o: ['CRBSI 最高', '症狀性 DVT 最高（1.4%）但整體風險小；CRBSI 與其他部位相當', '應禁用', '氣胸最多'], a: 1, why: 'IJV／鎖骨下／股：CRBSI 0.5／1.4／1.2%，DVT 0.5／0.9／1.4%。感染風險取決於維護不是部位。' },
    { q: '插管後要排除氣胸，最好的工具是？', o: ['仰臥 portable CXR', '床邊超音波看肺滑動', '立位 CXR', '聽診'], a: 1, why: '仰臥 CXR 漏掉多達 50%（積氣在前胸）；超音波敏感度更高，也能用 bubble study 確認導管位置。' },
    { q: '導管尖端進了右心房，要怎麼處理？', o: ['立刻退到上腔靜脈', '可以留著——2,348 例無心臟穿孔或惱人心律不整', '換一條', '做 TEE'], a: 1, why: '重放的慣例正在被放棄；理想位置仍是上腔靜脈、右心房上 1–2 cm（carina 高度）。' }
  ]);
  I.renderQuiz('qz_dwell', 'access-dwell', [
    { q: '中央導管沖洗與鎖管的首選溶液？', o: ['Heparin 100 U/mL', '保存劑 free 的生理鹽水', '1.4% sodium citrate', '70% 乙醇'], a: 1, why: '生理鹽水與 heparin 同效且沒有 HIT 風險；動脈導管例外，citrate 可替代 heparin。' },
    { q: '導管阻塞時第一步應該？', o: ['用導線通', '換新導管', '局部灌 alteplase 2 mg／2 mL，30 分鐘後回抽', '灌 70% 乙醇'], a: 2, why: '60% 是血栓；alteplase 30 → 120 分鐘、可第二劑，80–90% 成功；導線會把栓子推成栓塞。非血栓：鹼性沉澱用 bicarbonate、酸性用 HCl、脂質用 70% 乙醇。' },
    { q: '導管相關上肢 DVT 的診斷與處置，正確的是？', o: ['D-dimer 篩檢', '壓迫超音波（97%／96%），不必拔管除非嚴重腫痛或抗凝禁忌', '一律拔管', '一律溶栓'], a: 1, why: '重症病人 D-dimer 本來就高；抗凝療程比照下肢 DVT。' },
    { q: '導管相關菌血症的診斷需要？', o: ['導管出口紅斑', '發燒加白血球上升', '周邊血培養陽性＋導管是來源的證據（定量 ≥3 倍或導管血早 ≥2 小時陽性）', '導管尖端培養'], a: 2, why: '紅斑無預測價值、發燒是發炎不是感染；尖端培養要拔管且漏掉腔內感染。多腔導管每腔都抽。' },
    { q: '經驗性抗生素的骨幹與 Candida 覆蓋的條件？', o: ['Cefepime；所有病人都加 fluconazole', 'Vancomycin；股靜脈導管、TPN、血液惡性、長期抗生素、移植、他處 Candida 時加 echinocandin', 'Piperacillin-tazobactam；不需抗黴菌', 'Daptomycin；一律加 azole'], a: 1, why: '葡萄球菌＋腸球菌占 45%；echinocandin 對所有 Candida 都比 azole 強。' },
    { q: 'S. aureus 導管相關菌血症，療程怎麼決定？', o: ['一律 7 天', '先 TEE；無心內膜炎且已拔管、非免疫低下、無人工裝置 → 14 天，否則 4–6 週', '拔管即可不必抗生素', '一律 6 週'], a: 1, why: '院內 S. aureus 心內膜炎有 2/3 沒有雜音，所以每個 S. aureus 菌血症都要找。' },
    { q: 'Marino 對導管相關感染來源的「另類觀點」是？', o: ['皮膚菌沿導管下行是唯一途徑', '腸道才是主要來源：一半病原是腸道菌、腸道去污能大幅減少 CRBSI', '空氣是主要來源', '輸液污染是主要來源'], a: 1, why: '皮膚菌與尖端菌相關性差、抗生素藥膏無效、周邊導管反而少感染；S. epidermidis 在 MOF 病人的上消化道很常見。作者觀點，非指引。' }
  ]);

  acRender(); cvRender(); crRender();
})();
