/* ICU Book · Section XV 營養與代謝 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 48–51（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }
  function ibw(ht, sex) { return na(ht) ? NaN : (sex === 'f' ? 45.5 : 50) + 0.91 * (ht - 152.4); }

  /* ================= Ch48 ================= */
  I.bindCalc('c48ree', function () {
    var wt = num('re_w'), ht = num('re_h'), sex = val('re_sex'), day = val('re_d'), ic = val('re_ic') === 'y', ne = num('re_ne'), prop = num('re_p') || 0;
    var ib = ibw(ht, sex), useW = wt, adj = false;
    if (!na(ib) && wt > 1.25 * ib) { useW = ib + 0.25 * (wt - ib); adj = true; }
    var ree = 25 * useW;
    var frac = ic ? (day === 'd1' ? 0.7 : 1) : (day === 'd7' ? 1 : 0.7);
    var lowNE = !na(ne) && ne > 0.2;
    var target = lowNE ? [10 * wt, 15 * wt] : [ree * frac, ree * frac];
    var h = row('計算體重', na(useW) ? '—' : fmt(useW, 0), 'kg', adj ? 'fl-warn' : 'fl-na', adj ? '實際體重 >125% 理想體重（' + fmt(ib, 0) + '）：用調整體重 ＝ IBW ＋ 0.25 × (實際 − IBW)' : (na(ib) ? '填身高可算理想體重' : '≤125% 理想體重（' + fmt(ib, 0) + '），用實際體重'), '');
    h += row('REE 估算', na(ree) ? '—' : fmt(ree, 0), 'kcal/天', 'fl-na', '25 kcal/kg（200 多條公式沒有更準的）', ic ? '有間接熱量測定就用量的：15–30 分穩態 × 1,440；FiO₂ >70% 不可靠' : '所有指引都建議間接熱量測定，但貴、要人');
    h += row('目前目標', na(target[0]) ? '—' : (lowNE ? fmt(target[0], 0) + '–' + fmt(target[1], 0) : fmt(target[0], 0)), 'kcal/天', lowNE ? 'fl-hot' : frac < 1 ? 'fl-warn' : 'fl-ok', lowNE ? 'Norepinephrine >0.2 μg/kg/min：10–15 kcal/kg × 7 天或到改善' : frac < 1 ? (ic ? '量測 REE：前 3 天 ≤70%' : '估算 REE：前 7 天 ≤70%') : '之後漸增到 100%', '急性期內生性調整（糖質新生）已在運作，全量就是過度餵食（高血糖、脂肪生成）；營養不良者也減少再餵食風險');
    if (prop > 0) h += row('Propofol 熱量', fmt(prop * 24 * 1.1, 0), 'kcal/天', 'fl-warn', '10% 脂肪乳劑 1.1 kcal/mL、要從目標扣掉', '長期輸注監測三酸甘油酯');
    h += row('蛋白質', na(wt) ? '1.2–2.0 g/kg' : fmt(wt * 1.2, 0) + '–' + fmt(wt * 2, 0) + ' g/天', '', 'fl-na', '高分解代謝；健康人 0.8–1.0', '中位 1.6 g/kg');
    h += row('碳水上限', na(wt) ? '5 mg/kg/min' : fmt(wt * 5 * 1440 / 1000, 0) + ' g/天', '', 'fl-na', '至少 130 g（中樞每天用 100–120 g 葡萄糖）', '過多 → CO₂ 與脂肪生成；胰島素阻抗常見');
    h += row('脂肪上限', na(wt) ? '1.5 g/kg' : fmt(wt * 1.5, 0) + ' g/天', '', 'fl-na', 'PUFA 高度可氧化 → 組織（尤其肺）氧化傷害、免疫抑制', 'Linoleic acid 是唯一必需脂肪酸（0.5% 即可）');
    h += '<div class="rx-flag">脂肪 9.1、碳水 3.7 kcal/g；RQ 碳水 1.0、脂肪 0.7。24–48 小時內開始。作者結語：重症的營養不良是營養處理異常不是飢餓，餵食矯正不了、還可能有害——急性病人葡萄糖負荷可有 85% 變乳酸（健康人 <5%）、脂肪在發炎環境被氧化。也許生病沒胃口是有道理的。</div><div class="note">原書表 48.1 與式 48.1–48.3 抽出時遺失；REE 依第 49、50 章內文的 25 kcal/kg，調整體重用標準公式。</div>';
    document.getElementById('c48ree_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c48nbal', function () {
    var pro = num('nb_p'), uun = num('nb_u'), diar = val('nb_d') === 'y';
    var nin = pro / 6.25, nout = uun + 4, bal = nin - nout;
    var h = row('氮攝入', na(nin) ? '—' : fmt(nin, 1), 'g/天', 'fl-na', '蛋白質 16% 是氮：g / 6.25', '');
    h += row('氮排出', na(nout) ? '—' : fmt(nout, 1), 'g/天', diar ? 'fl-warn' : 'fl-na', 'UUN ＋ 4（糞便等非尿液流失 4–6 g）', diar ? '腹瀉時非尿液流失估不準、氮平衡不可靠' : '2/3 從尿排、其中 85% 是尿素');
    h += row('氮平衡', na(bal) ? '—' : (bal >= 0 ? '+' : '') + fmt(bal, 1), 'g/天', na(bal) ? 'fl-na' : bal >= 4 ? 'fl-ok' : bal >= 0 ? 'fl-warn' : 'fl-hot', na(bal) ? '' : bal >= 4 ? '達目標 +4–6' : bal >= 0 ? '正但未達 +4' : '負平衡', '要病況穩定才做；ICU 很少做');
    h += '<div class="rx-flag">第一步是給夠非蛋白熱量以免蛋白被拿去產能：蛋白攝入固定時，非蛋白熱量達到 REE 氮平衡才轉正——熱量不夠，加蛋白也沒用。</div>';
    document.getElementById('c48nbal_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c48thi', function () {
    var etoh = val('th_a') === 'y', sep = val('th_s') === 'y', fur = val('th_f') === 'y', mg = val('th_m') === 'y', glu = val('th_g') === 'y', man = val('th_c');
    var risk = [etoh ? '酒精（抑制吸收）' : '', sep ? '敗血性休克（達 70%）' : '', fur ? 'furosemide（腎排泄）' : '', mg ? '缺鎂（TPP 轉換受阻）' : '', glu ? '葡萄糖負荷（用掉邊緣庫存）' : ''].filter(Boolean);
    var h = row('誘因', risk.length ? risk.join('、') : '未勾選', '', risk.length ? 'fl-warn' : 'fl-na', '庫存只 30 mg、2–3 週耗盡；需求 1 mg/天', '也有：營養不良、減重手術');
    h += row('表現', man === 'hf' ? '高輸出心衰竭（濕性腳氣病）' : man === 'we' ? 'Wernicke：三聯徵只 20%；意識改變 80%、眼徵 30%；MRI 敏感度 53% 專一性 93%（內側視丘、下視丘、乳頭體）' : man === 'la' ? '乳酸酸中毒（pyruvate 進不了粒線體）——不明乳酸升高都要想' : '周邊神經病變（乾性腳氣病）', '', 'fl-na', '臨床診斷：血中 thiamine 不可靠、全血 TPP 63–229 nmol/L 但少有', '');
    h += row('治療', '500 mg IV q8h × 2–3 天 → 250 mg IV/天 × 3–5 天 → 100 mg PO tid × 1–2 週 → 100 mg PO/天', '', 'fl-hot', '常規 100 mg/天不夠治療；IV 優先（重症腸道吸收不穩）', '同時矯正缺鎂，thiamine 才能變 TPP');
    h += '<div class="rx-flag">Thiamine → TPP 是 pyruvate dehydrogenase 的輔因子：缺乏＝葡萄糖代謝的能量缺口。可能是敗血症部分乳酸與 DKA 乳酸升高的原因。心衰竭補 thiamine 未見可靠效果。</div>';
    document.getElementById('c48thi_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c48micro', function () {
    var d = num('mi_d'), se = num('mi_se'), fer = num('mi_f');
    var h = row('25-OH 維生素 D', na(d) ? '—' : fmt(d, 0), 'nmol/L', na(d) ? 'fl-na' : d < 30 ? 'fl-hot' : d < 50 ? 'fl-warn' : 'fl-ok', na(d) ? '<50 缺乏、<30 嚴重' : d < 30 ? '嚴重缺乏' : d < 50 ? '缺乏' : '足夠', 'ICU 40–100% 缺乏（需求 600 IU、配方只給 200–400）；與感染率相關；單次 IM cholecalciferol 150,000 IU 90% 正常化');
    h += row('硒', na(se) ? '—' : fmt(se, 0), 'μg/L', na(se) ? 'fl-na' : se < 100 ? 'fl-warn' : 'fl-ok', na(se) ? '<100 glutathione peroxidase 活性降' : se < 100 ? '不足：亞硒酸鈉 IV，安全上限 225 μg/天' : '', '需求 55 μg、急性病利用增加；重症常缺');
    h += row('鐵蛋白', na(fer) ? '—' : fmt(fer, 0), 'μg/L', na(fer) ? 'fl-na' : fer < 18 ? 'fl-warn' : fer > 100 ? 'fl-ok' : 'fl-na', na(fer) ? '<18 可能缺鐵、>100 不太可能' : fer < 18 ? '可能缺鐵' : fer > 100 ? '不缺鐵' : '灰色帶', '游離鐵驅動 hydroxyl radical 與 ferroptosis：發炎時低血鐵是保護，重症不補鐵（除非組織缺鐵＋貧血）');
    h += '<div class="rx-flag">抗氧化維生素 E（脂溶性、保護膜）與 C（水溶性、維持 E 活性）重症常缺；補充改善結局的證據不一致，但氧化壓力在發炎性器官傷害的角色足以支持維持。微量元素製劑 7 種有 5 種達不到每日需求（表 50.3）。</div>';
    document.getElementById('c48micro_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch49 ================= */
  I.bindCalc('c49reg', function () {
    var wt = num('rg_w'), pk = num('rg_pk') || 1.6, kcal = num('rg_k') || 1, prot = num('rg_pr') || 44, prop = num('rg_p') || 0, day = val('rg_d');
    var ree = 25 * wt, frac = day === 'early' ? 0.7 : 1, need = ree * frac - prop * 24 * 1.1;
    var vol = need / kcal, rate = vol / 24, pgoal = wt * pk, pget = vol / 1000 * prot, pdef = pgoal - pget;
    var h = row('熱量目標', na(need) ? '—' : fmt(need, 0), 'kcal/天', 'fl-na', (day === 'early' ? '前期 70% × ' : '') + '25 kcal/kg' + (prop > 0 ? ' − propofol ' + fmt(prop * 24 * 1.1, 0) : ''), '');
    h += row('配方體積', na(vol) ? '—' : fmt(vol, 0), 'mL/天', 'fl-na', kcal + ' kcal/mL', '1–1.2 kcal/mL 標準；1.5–2 只在限水（滲透壓高促腹瀉）');
    h += row('輸注速率', na(rate) ? '—' : fmt(rate, 0), 'mL/hr', 'fl-warn', '連續輸注、不用 bolus', '');
    h += row('蛋白質', na(pget) ? '—' : fmt(pget, 0) + ' / 目標 ' + fmt(pgoal, 0), 'g/天', na(pdef) ? 'fl-na' : pdef > 5 ? 'fl-warn' : 'fl-ok', na(pdef) ? '' : pdef > 5 ? '不足 ' + fmt(pdef, 0) + ' g：加蛋白粉' : '足夠', '標準配方 35–65 g/L；HN 多 20%');
    h += '<div class="rx-flag">配方：聚合（完整蛋白）、半元素（胜肽）、元素（胺基酸；助吸收與水再吸收、腹瀉時有利）；碳水占熱量達 70%、脂肪約 30%；纖維＝可發酵（丁酸養結腸黏膜與好菌）＋不可發酵（滲透導瀉），配方混合兩者。魚油（ω-3）不常規、ARDS 可能有益；arginine 只考慮 TBI 與外科 ICU 圍手術期、內科敗血症不用（NO 低血壓）；glutamine 只加創傷 0.2–0.3 g/kg × 5 天、燒傷 >20% 0.3–0.5 × 10–15 天；carnitine <20 mmol/L 缺乏、20–30 mg/kg。沒有證據哪種配方結局較好。</div><div class="note">原書表 49.2–49.4 是圖檔或只剩標題，配方數字未收錄；範例蛋白濃度預設 44 g/L。</div>';
    document.getElementById('c49reg_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c49grv', function () {
    var grv = num('gv_v'), susp = val('gv_s') === 'y', opi = val('gv_o') === 'y', qt = val('gv_q') === 'y';
    var h = row('胃殘餘量', na(grv) ? '—' : fmt(grv, 0), 'mL/6 小時', na(grv) ? 'fl-na' : grv > 500 ? 'fl-hot' : 'fl-ok', na(grv) ? '不需常規測；疑吸入才測' : grv > 500 ? '>500：暫停餵食、床頭 ≥30°、試促動劑' : '≤500：繼續', '傳統 150–250 mL 門檻沒證據、只造成反覆中斷與餵食不足；微吸入近半數病人都有');
    if (grv > 500 || susp) {
      h += row('Erythromycin', '100–200 mg IV q8h × 3 天', '', 'fl-warn', '最有效（motilin）、第一線；幾天就耐受', '3 天不影響菌群');
      h += row('Metoclopramide', '10 mg IV q8h × 3 天', '', 'fl-na', '較差；合併 erythromycin 更好', qt ? 'QT 延長：兩者都延長、合併要小心' : '兩者都延長 QT');
      if (opi) h += row('鴉片相關', '胃內 naloxone', '', 'fl-na', '選擇性阻斷腸道受體、不抵銷止痛', '經驗有限');
      h += row('再發', '餵食部位前移（胃 → 十二指腸 → 空腸）', '', 'fl-na', '胃與十二指腸吸入風險相同、胃較易', '');
    }
    h += '<div class="rx-flag">禁忌：失控休克、腸缺血、頑固致命低血氧或高碳酸、活動性上消化道出血、腸阻塞、高流量腸瘻、腹腔腔室症候群、GRV >500/6 小時。穩定或下降的升壓劑不是禁忌；norepinephrine >0.2 μg/kg/min 用 10–15 kcal/kg × 7 天。不需腸音。</div>';
    document.getElementById('c49grv_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c49tube', function () {
    var co2 = num('tb_c'), slow = val('tb_s'), diar = val('tb_d') === 'y';
    var h = row('置入時 CO₂', na(co2) ? '—' : fmt(co2, 0), 'mmHg', na(co2) ? 'fl-na' : co2 >= 15 ? 'fl-hot' : 'fl-ok', na(co2) ? '有波形或 ≥15 ＝ 進肺（敏感度 96%、專一性 99%）' : co2 >= 15 ? '進肺：退出' : '未進氣道，但不排除食道盤繞', '仍要胸部 X 光：直下縱膈、平分氣管分岔角、尖端在左橫膈頂下約 10 cm；進肺約 1%、重症常無咳嗽、可穿破胸膜');
    h += row('Whoosh 試驗', '不可靠、應放棄', '', 'fl-warn', '肺內氣流也能在上腹聽到', '超音波敏感度 96%、專一性 91% 但未取代 X 光；NEX 距離 50–60 cm');
    if (slow === 'slow') h += row('流速變慢', '溫水沖 30% 有效 → Viokase 1 錠 ＋ 碳酸鈉 324 mg 溶 5 mL 注入夾 5 分再溫水（75%）', '', 'fl-na', '預防：每 4 小時 30 mL 水、給藥後 10 mL', '');
    else if (slow === 'block') h += row('完全阻塞', '試軟導線通；不行立刻換管', '', 'fl-warn', '胃酸逆流讓蛋白沉澱', '');
    if (diar) h += row('腹瀉（達 70%）', '換低滲透壓或元素配方；避免高滲（>3,000 mOsm）與含 sorbitol 的液劑', '', 'fl-na', '液劑：acetaminophen、dexamethasone、硫酸亞鐵、hydroxyzine、metoclopramide、多維生素、KCl、磷酸鈉（高滲）；cimetidine、isoniazid、lithium、theophylline、tetracycline（sorbitol）', '也想抗生素與 C. difficile；纖維配方混合型沒有幫助');
    h += '<div class="rx-flag">作者結語：腸腔的食物團塊有滋養黏膜的作用、維持屏障（給口服 TPN 液沒有這效果）；禁食黏膜萎縮、菌易入侵——「吃飯是抗菌防禦機制」。</div>';
    document.getElementById('c49tube_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch50 ================= */
  I.bindCalc('c50tpn', function () {
    var wt = num('tp_w'), pk = num('tp_pk') || 1.4, lip = num('tp_l') || 250, prop = num('tp_p') || 0, rf = val('tp_r') === 'y';
    var ree = 25 * wt - prop * 24, pro = wt * pk, aa = pro / 100 * 1000, lkcal = lip * 2, dk = ree - lkcal, d50 = dk / 1.7, tot = aa + lip + d50 + 30, rate = tot / 24;
    var h = row('熱量與蛋白', na(ree) ? '—' : fmt(ree, 0) + ' kcal、' + fmt(pro, 0) + ' g', '', 'fl-na', '25 kcal/kg（扣 propofol 1 kcal/mL）、' + pk + ' g/kg', '實際體重 >125% IBW 用調整體重');
    h += row('10% 胺基酸', na(aa) ? '—' : fmt(aa, 0), 'mL', 'fl-na', '100 g 蛋白/L（16.5 g 氮）', '50% 必需＋50% 非必需；支鏈胺基酸配方未改善結局');
    h += row('20% 脂肪乳劑', fmt(lip, 0) + ' mL ＝ ' + fmt(lkcal, 0) + ' kcal', '', 'fl-na', '2 kcal/mL（10% 是 1）；約 30% 熱量', '大豆油：linoleic 50%、oleic 25%、α-linolenic 10%；必需脂肪酸只要 3–4% 熱量');
    h += row('D50', na(d50) ? '—' : fmt(d50, 0) + ' mL ＝ ' + fmt(dk, 0) + ' kcal', '', 'fl-na', '1.7 kcal/mL（3.4 kcal/g）、2,525 mOsm/L 要中心靜脈', '');
    h += row('總量與速率', na(tot) ? '—' : fmt(tot, 0) + ' mL → ' + fmt(rate, 0) + ' mL/hr', '', rf ? 'fl-warn' : 'fl-ok', rf ? '再餵食風險：從 40–50%（' + fmt(rate * 0.5, 0) + ' mL/hr）起、4–7 天依磷鉀鎂進階' : '含 30 mL 電解質、維生素、微量元素', '');
    h += '<div class="rx-flag">併發症：高血糖（>200 達 45%；目標 140–180、不嚴控；regular insulin 加進袋＋lispro 皮下，穩定後一半換 glargine）、低血磷與低血鉀（葡萄糖進細胞帶著走）、高碳酸（過度餵食、不只碳水）；脂肪：發炎傷害（大豆油 ω-6／ω-9 → eicosanoid；oleic acid 是 ARDS 動物模型；輸注惡化氧合）、肝脂肪變、膽汁鬱積（無結石膽囊炎）、脂肪過載症候群（發燒、呼吸窘迫、黃疸、胰臟炎、全血球減少、凝血病變；停輸注可緩解）。新乳劑：Clinolipid（80% 橄欖油）、Smoflipid（大豆 30、MCT 30、橄欖 20、魚油 15）、Omegaven（純魚油、要配大豆油）。作者結語：能免則免。</div>';
    document.getElementById('c50tpn_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c50refeed', function () {
    var wl1 = num('rf_w1'), wl6 = num('rf_w6'), bmi = num('rf_b'), poor = val('rf_p') === 'y', lowe = val('rf_e') === 'y', abuse = val('rf_a') === 'y', wt = num('rf_kg');
    var f = [(!na(wl1) && wl1 >= 5) ? '1 個月減重 ≥5%' : '', (!na(wl6) && wl6 > 10) ? '6 個月減重 >10%' : '', (!na(bmi) && bmi <= 18.5) ? 'BMI ≤18.5' : '', poor ? '5 天攝食差' : '', lowe ? '基線鉀／磷／鎂低' : '', abuse ? '高營養不良風險（藥物濫用）' : ''].filter(Boolean);
    var hi = f.length > 0;
    var h = row('再餵食風險', hi ? '高風險' : '未見高風險因子', '', hi ? 'fl-hot' : 'fl-ok', f.join('、'), '機轉：葡萄糖負荷進細胞帶走磷鉀鎂、耗盡 thiamine；低白蛋白留鈉');
    if (hi) {
      h += row('開始前', '矯正電解質、先給 thiamine（500 mg IV q8h 方案；ASPEN 的 100–200 mg 不夠）', '', 'fl-warn', '', '');
      h += row('起始量', na(wt) ? '40–50% 目標或 10–15 kcal/kg，或葡萄糖 150 g/天（300 mL D50）' : fmt(wt * 10, 0) + '–' + fmt(wt * 15, 0) + ' kcal/天（或 150 g 葡萄糖＝300 mL D50）', '', 'fl-warn', '4–7 天慢慢進階', '密切監測磷、鉀、鎂');
    }
    h += '<div class="rx-flag">表現：全身無力（低磷）、意識改變與乳酸酸中毒（thiamine）、心搏過速心律不整（低鉀低鎂）、肺水腫（留鈉）、低血壓。二戰後餵戰俘與集中營倖存者時首次描述。</div>';
    document.getElementById('c50refeed_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c50ppn', function () {
    var wt = num('pp_w'), lip = val('pp_l') === 'y';
    var need = 20 * wt, base = 850, tot = base + (lip ? 500 : 0);
    var h = row('周邊配方', '3% 胺基酸 ＋ 20% 葡萄糖 各半（終濃度 1.5% ＋ 10%）', '', 'fl-na', '500 mOsm/L；周邊要 <900 mOsm/L、pH 7.2–7.4', '葡萄糖 340 kcal/L');
    h += row('2.5 L 提供', fmt(base, 0) + (lip ? ' ＋ 250 mL 20% 脂肪 500 ＝ ' + fmt(tot, 0) : ''), 'kcal', 'fl-na', lip ? '脂肪乳劑等張、可走周邊' : '加 250 mL 20% 脂肪乳劑可到 1,350', '');
    h += row('未壓力成人需求', na(need) ? '—' : fmt(need, 0), 'kcal/天', na(need) ? 'fl-na' : tot >= need ? 'fl-ok' : 'fl-warn', '約 20 kcal/kg（非蛋白熱量）', na(need) ? '' : tot >= need ? '夠：蛋白節省' : '不夠：只當補充');
    h += '<div class="rx-flag">PPN 是截短版 TPN：只供非蛋白熱量以節省蛋白，當腸道營養的補充或短期橋接；高分解代謝或營養不良者需要完整支持、不適用。</div>';
    document.getElementById('c50ppn_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch51 ================= */
  I.bindCalc('c51adr', function () {
    var c0 = num('ad_c'), inc = num('ad_i'), ss = val('ad_ss') === 'y', ref = val('ad_r') === 'y';
    var h;
    if (ss && ref) h = row('敗血性休克', '不需驗 cortisol：輸液與中等劑量升壓劑仍低血壓就試 hydrocortisone', '', 'fl-hot', '', '');
    else h = row('隨機 cortisol', na(c0) ? '—' : fmt(c0, 0), 'μg/dL', na(c0) ? 'fl-na' : c0 < 10 ? 'fl-hot' : c0 >= 35 ? 'fl-ok' : 'fl-warn', na(c0) ? '<10 抑制；≥35 足夠；中間做 ACTH 試驗' : c0 < 10 ? '<10：腎上腺抑制' : c0 >= 35 ? '≥35：功能足夠' : '不確定：cosyntropin 250 μg IV、60 分後再驗', '總 cortisol（90% 結合 CBG；急性病 CBG 降一半，游離值不普及）');
    if (!na(inc)) h += row('ACTH 後增量', fmt(inc, 0), 'μg/dL', inc < 9 ? 'fl-hot' : 'fl-ok', inc < 9 ? '<9：抑制' : '≥9：正常反應——但不排除下視丘腦下垂體性（敗血症 75% 是這型；要驗 ACTH、ICU 很少做）', '');
    var treat = (ss && ref) || (!na(c0) && c0 < 10) || (!na(inc) && inc < 9);
    if (treat) { h += row('Hydrocortisone', '100 mg IV q8h（200–300 mg/天）', '', 'fl-warn', 'Fludrocortisone 50 μg PO/天可加可不加（hydrocortisone 礦物皮質素活性好）', '敗血性休克：升壓劑停、乳酸正常就可停；幾天內漸減防發炎反彈'); }
    h += row('等效劑量', 'Hydrocortisone 20 ＝ prednisone 5 ＝ methylprednisolone 4 ＝ dexamethasone 0.75 mg', '', 'fl-na', '礦物皮質素活性 hydrocortisone 最強、dexamethasone 最弱；抗發炎相反', '抗發炎用途卻多選 methylprednisolone、原因不明');
    h += '<div class="rx-flag">CIRCI：重症 10–20%、敗血性休克達 60%，多可逆；主要表現是輸液無反應的低血壓（慢性腎上腺功能不全的低鈉高鉀少見）。誘因：敗血症、HIV、全身黴菌、腦膜炎雙球菌出血；突然停類固醇、DIC 或抗凝的腎上腺出血、etomidate／ketoconazole（抑制合成）、phenytoin／rifampin（加速代謝）。作者結語：CIRCI 常見但類固醇沒改善結局——「果實不多的樹」。</div>';
    document.getElementById('c51adr_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c51thy', function () {
    var t4 = num('ty_t4'), tsh = num('ty_tsh'), storm = val('ty_st') === 'y', myx = val('ty_mx') === 'y', wt = num('ty_w'), asth = val('ty_a') === 'y';
    var lowT = !na(t4) && t4 < 0.8, hiT = !na(t4) && t4 > 1.8, lowS = !na(tsh) && tsh < 0.3, hiS = !na(tsh) && tsh > 4.5;
    var pat = na(t4) || na(tsh) ? '' : hiT && lowS ? '原發性甲狀腺機能亢進' : !hiT && !lowT && lowS ? 'T3 毒症（輕度或亞臨床）' : hiT && !lowS && !hiS ? '正常甲狀腺高 T4 血症（amiodarone、amphetamine、heparin）' : lowT && hiS ? '原發性甲狀腺機能低下' : lowT && lowS ? '次發性（下視丘腦下垂體）低下' : lowT ? '正常甲狀腺病態症候群（30–50% ICU；不治療）' : '正常';
    var h = row('Free T4 / TSH', na(t4) ? '—' : fmt(t4, 2) + ' / ' + (na(tsh) ? '?' : fmt(tsh, 2)), '', pat && pat !== '正常' ? 'fl-warn' : 'fl-na', pat || '正常 0.8–1.8 ng/dL、0.3–4.5 mU/mL', 'TSH 最可靠：原發性反向、次發性同向、非甲狀腺病 TSH 正常；TSH 正常排除亢進');
    if (storm) { h += row('甲狀腺風暴', 'Propranolol 60–80 mg IV/PO q4h（高劑量阻斷 T4→T3）' + (asth ? '——氣喘或收縮性心衰竭改 metoprolol 25–50 mg bid–tid、急性氣喘發作所有 β 阻斷劑禁忌' : '') + '；esmolol 輸注快速控心率', '', 'fl-hot', 'PTU 500–1,000 mg 起（風暴偏好；猛爆性肝壞死、顆粒球缺乏）；Lugol 碘（阻斷合成與釋放）、碘過敏用 lithium 300 mg q8h', 'Hydrocortisone 300 mg 負荷 → 100 mg q8h（相對腎上腺功能不全）；積極輸液（嘔吐腹瀉不顯性流失）；治誘因；死亡達 25%'); }
    else if (hiT && lowS) h += row('甲狀腺毒症', 'Propranolol 10–40 mg PO tid–qid；methimazole 10–20 mg/天（偏好；膽汁鬱積黃疸）或 PTU 50–150 mg tid', '', 'fl-warn', 'Graves 最常見；老人可淡漠型（嗜睡＋心房顫動）', '嚴重加碘');
    if (myx) { h += row('黏液水腫昏迷', 'Hydrocortisone 100 mg IV q8h 先給 → levothyroxine 200–400 μg IV 緩推 → 50–100 μg PO/天' + (na(wt) ? '（1.6 μg/kg；IV 用 75%）' : '（' + fmt(wt * 1.6, 0) + ' μg PO ＝ ' + fmt(wt * 1.6 * 0.75, 0) + ' μg IV）'), '', 'fl-hot', '意識低下、低體溫、低血鈉、心血管不穩；死亡達 60%', '可加 liothyronine 5–20 μg IV 負荷 → 2.5–10 μg q8h 到清醒穩定（T4→T3 轉換受抑）；名稱是誤稱——既無昏迷也無黏液水腫'); }
    else if (lowT && hiS) h += row('甲狀腺機能低下', na(wt) ? 'Levothyroxine 1.5–1.8 μg/kg/天' : 'Levothyroxine ' + fmt(wt * 1.5, 0) + '–' + fmt(wt * 1.8, 0) + ' μg/天', '', 'fl-warn', '依 TSH 調到正常的最低劑量（通常 75–150）', 'Hashimoto 最常見；表現乾皮疲勞抽筋便秘（肥胖不是）、低血鈉、肌病變 CPK 升、肌酸酐升（非腎）、舒張性心衰竭、心包積液、QT 延長 torsade');
    h += '<div class="rx-flag">ICU 甲狀腺檢驗異常達 90%、多是非甲狀腺病。用 free T4（>99% 結合蛋白）；free T3 不普及。</div><div class="note">原書表 51.3（metoprolol 列）、51.4（PTU 風暴劑量）截斷，依內文重建。</div>';
    document.getElementById('c51thy_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch48／49 要不要餵、餵多少 */
  var fd = { shock: null, ci: null, day: null };
  window.fdPick = function (k, v, btn) { flowSelect(btn); fd[k] = v; fdRender(); };
  function fdRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (fd.shock === 'uncontrolled') { cls = 'rec-urgent'; t = '失控或進行中的休克：暫不腸道餵食'; d = '<li>其他禁忌：腸缺血、頑固致命低血氧或高碳酸、活動性上消化道出血、腸阻塞、高流量腸瘻、腹腔腔室症候群、GRV >500/6 小時。</li>'; }
    else if (fd.shock === 'highne') { cls = 'rec-elective'; t = 'Norepinephrine >0.2 μg/kg/min（70 kg >14 μg/min）：可餵，但 10–15 kcal/kg/天 × 7 天或到改善'; d = '<li>穩定或下降的升壓劑不是禁忌；不需腸音；48 小時內開始。</li>'; }
    else if (fd.shock === 'ok') {
      if (fd.ci === 'no') { cls = 'rec-elective'; t = '腸道可用：48 小時內鼻胃管連續輸注，' + (fd.day === 'early' ? '前 7 天（估算）或前 3 天（量測）≤70% REE' : fd.day === 'late' ? '之後漸增到 100% REE；穩定後可做氮平衡' : '前期 ≤70% REE、之後漸增'); d = '<li>REE 用間接熱量測定或 25 kcal/kg；蛋白 1.2–2.0 g/kg；標準 1–1.2 kcal/mL 配方；扣 propofol 熱量。</li><li>胃優先；不常規測 GRV；>500 才暫停＋床頭 30°＋erythromycin。</li>'; }
      else if (fd.ci === 'yes') { cls = 'rec-elective'; t = '腸道不可用：TPN（中心靜脈；再餵食風險從 40–50% 起）；短期或補充可用 PPN'; d = '<li>作者：能免則免——重症的營養不良是處理異常不是飢餓，葡萄糖負荷變乳酸、脂肪被氧化。</li>'; }
      else { cls = 'rec-elective'; t = '循環穩定：腸道可用嗎？'; d = '<li>請回答第 2 步（第 3 步選時期）。</li>'; }
    }
    if (fd.shock) n = '腸道營養的非營養角色：食物團塊維持黏膜屏障與 IgA、減少菌移位——早期腸道營養感染率較低。';
    flowRec('fd_rec', cls, t, d, n);
  }
  window.fdReset = function () { fd = { shock: null, ci: null, day: null }; selAll('#fd_flow'); fdRender(); };

  /* Ch50 TPN 併發症追查 */
  var tc = { sign: null };
  window.tcPick = function (k, v, btn) { flowSelect(btn); tc[k] = v; tcRender(); };
  function tcRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    var R = { glu: ['rec-elective', '高血糖（>200 達 45%）：目標 140–180、不嚴控；regular insulin 入袋＋lispro 皮下，穩定後一半換 glargine', '<li>低血糖比高血糖更危險。</li>'], lyte: ['rec-urgent', '低磷／低鉀／低鎂＋無力、心律不整、意識改變：再餵食症候群——降速、補電解質、thiamine 500 mg IV q8h', '<li>葡萄糖進細胞帶走磷與鉀；thiamine 被葡萄糖代謝用掉。</li>'], co2: ['rec-elective', '高碳酸：過度餵食（不只碳水）——降總熱量', '<li>葡萄糖 RQ 1.0 產 CO₂ 最多，但主因是總量過多。</li>'], lung: ['rec-elective', '氧合惡化：大豆油乳劑的發炎傷害（ω-6／ω-9 → eicosanoid；oleic acid 是 ARDS 模型）——減脂肪或換魚油配方', '<li>脂肪輸注可延長呼吸衰竭。</li>'], liver: ['rec-elective', '肝功能異常：肝脂肪變（ω-6：ω-3 比、植物固醇）、膽汁鬱積（無結石膽囊炎）；長期可到肝炎肝硬化', '<li>發燒黃疸胰臟炎全血球減少凝血病變＝脂肪過載症候群，暫停脂肪。</li>'] };
    if (tc.sign && R[tc.sign]) { cls = R[tc.sign][0]; t = R[tc.sign][1]; d = R[tc.sign][2]; n = '導管相關併發症見第 2、3 章。'; }
    flowRec('tc_rec', cls, t, d, n);
  }
  window.tcReset = function () { tc = { sign: null }; selAll('#tc_flow'); tcRender(); };

  /* Ch51 甲狀腺檢驗型態 */
  var ty = { t4: null, tsh: null };
  window.tyPick = function (k, v, btn) { flowSelect(btn); ty[k] = v; tyRender(); };
  function tyRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (ty.t4 && ty.tsh) {
      var k = ty.t4 + ty.tsh;
      var R = { highlow: ['rec-urgent', '原發性甲狀腺機能亢進（Graves 最常見）：propranolol、methimazole；風暴用 PTU、碘、hydrocortisone', ''], normallow: ['rec-elective', 'T3 毒症：輕度或亞臨床亢進（T3 也可正常）', ''], highnormal: ['rec-blue', '正常甲狀腺高 T4 血症：amiodarone、amphetamine（阻斷 T4→T3）、heparin（游離脂肪酸置換）——不是甲狀腺病', ''], lowhigh: ['rec-elective', '原發性甲狀腺機能低下（Hashimoto、放射碘、手術、lithium／amiodarone）：levothyroxine 1.5–1.8 μg/kg', '<li>黏液水腫昏迷：hydrocortisone 先、levothyroxine 200–400 μg IV、可加 T3。</li>'], lowlow: ['rec-elective', '次發性低下（下視丘腦下垂體：腫瘤、Sheehan）', ''], lownormal: ['rec-blue', '正常甲狀腺病態症候群（ICU 30–50%）：T4→T3 轉換受抑、重者 T4 也低；不治療', ''], normalnormal: ['rec-blue', '正常', ''], normalhigh: ['rec-elective', '亞臨床低下：依臨床追蹤', ''], highhigh: ['rec-elective', '罕見：TSH 分泌腫瘤或甲狀腺素阻抗——內分泌科', ''] }[k];
      if (R) { cls = R[0]; t = R[1]; d = R[2]; }
    } else if (ty.t4 || ty.tsh) { cls = 'rec-elective'; t = '再選另一項'; }
    if (ty.t4 && ty.tsh) n = '原發性：TSH 與 T4 反向；次發性：同向；非甲狀腺病：TSH 正常。用 free T4。';
    flowRec('ty_rec', cls, t, d, n);
  }
  window.tyReset = function () { ty = { t4: null, tsh: null }; selAll('#ty_flow'); tyRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_req', 'nutrition-req', [
    { q: '沒有間接熱量測定時怎麼估 REE？', o: ['Harris-Benedict 最準', '25 kcal/kg（200 多條公式沒有更準的）；實際體重 >125% IBW 用調整體重', '30 kcal/kg', '一律 2,000 kcal'], a: 1, why: '所有指引都建議間接熱量測定（15–30 分穩態 × 1,440；FiO₂ >70% 不可靠）。' },
    { q: '第一週要給多少？', o: ['100% REE', '估算 REE 前 7 天 ≤70%（量測 REE 前 3 天 ≤70% 再漸增）；norepinephrine >0.2 μg/kg/min 用 10–15 kcal/kg × 7 天', '120%', '前 3 天禁食'], a: 1, why: '急性期糖質新生已在運作、全量就是過度餵食（高血糖、脂肪生成）；營養不良者也防再餵食。' },
    { q: '蛋白、碳水、脂肪的上下限？', o: ['蛋白 0.8', '蛋白 1.2–2.0 g/kg；碳水 ≥130 g、≤5 mg/kg/min；脂肪 ≤1.5 g/kg；propofol 1.1 kcal/mL 要扣', '碳水無上限', '脂肪 3 g/kg'], a: 1, why: '氮平衡：蛋白/6.25 − (UUN ＋ 4)，目標 +4–6；非蛋白熱量不夠，加蛋白也轉不正。' },
    { q: 'Wernicke 的三聯徵有多常見？', o: ['幾乎都有', '只 20%；意識改變 80%、眼徵 30%；MRI 敏感度 53% 專一性 93%', '50%', '從不出現'], a: 1, why: '庫存 30 mg、2–3 週耗盡；誘因酒精、敗血性休克 70%、furosemide、缺鎂、葡萄糖負荷；不明乳酸升高也要想。' },
    { q: 'Thiamine 缺乏的治療？', o: ['100 mg/天', '500 mg IV q8h × 2–3 天 → 250 mg IV/天 × 3–5 天 → 100 mg PO tid × 1–2 週 → 100 mg/天；同時補鎂', '250 mg 單次', '口服即可'], a: 1, why: '常規 100 mg 不夠；IV 優先；缺鎂時 thiamine 變不成 TPP。血中 thiamine 不可靠、全血 TPP 63–229。' },
    { q: '重症該不該補鐵？', o: ['貧血就補', '不補，除非組織缺鐵（鐵蛋白 <18）併貧血：游離鐵驅動 hydroxyl radical 與 ferroptosis，發炎時低血鐵是保護', '一律補', '只補 IV'], a: 1, why: '維生素 D 缺乏 40–100%（150,000 IU IM 一次）；硒 <100 μg/L 補、上限 225；抗氧化維生素 C／E 常缺。' }
  ]);
  I.renderQuiz('qz_ent', 'nutrition-ent', [
    { q: '腸道營養的非營養角色？', o: ['沒有', '食物團塊滋養黏膜、維持屏障與 IgA、減少菌移位——早期腸道營養（48 小時內）感染率較低；口服 TPN 液沒有這效果', '只是熱量', '促進腸音'], a: 1, why: '禁食黏膜萎縮、菌易入侵；「吃飯是抗菌防禦機制」。不需腸音。' },
    { q: '升壓劑病人能不能餵？', o: ['一律不能', '失控或進行中的休克不能；穩定或下降的升壓劑可以；norepinephrine >0.2 μg/kg/min 減到 10–15 kcal/kg × 7 天', '一律可以', '只能 TPN'], a: 1, why: '其他禁忌：腸缺血、頑固低血氧高碳酸、活動性上消化道出血、腸阻塞、高流量腸瘻、ACS、GRV >500。' },
    { q: 'Arginine 與 glutamine 該給誰？', o: ['所有病人', 'Arginine 只考慮 TBI 與外科 ICU 圍手術期、內科敗血症不用（NO 低血壓）；glutamine 只加創傷 0.2–0.3 g/kg × 5 天、燒傷 >20% 0.3–0.5 × 10–15 天', '敗血症', '從不'], a: 1, why: '魚油不常規、ARDS 可能有益；沒有證據哪種配方結局較好。' },
    { q: '餵食管放好後怎麼確認？', o: ['Whoosh 試驗', '胸部 X 光必要（直下縱膈、平分氣管分岔角、尖端橫膈下 10 cm）；置入時 CO₂ ≥15 或波形＝進肺（96／99%）但測不到食道盤繞；whoosh 不可靠應放棄', '超音波就夠', '聽腸音'], a: 1, why: '進肺約 1%、重症無咳嗽、可穿破胸膜；NEX 50–60 cm；胃與十二指腸吸入風險相同。' },
    { q: '胃殘餘量怎麼用？', o: ['每班測、>200 就停', '不常規測；疑吸入才測，>500/6 小時暫停、床頭 30°、erythromycin 100–200 mg IV q8h × 3 天（第一線；metoclopramide 10 mg q8h 較差、合併更好、都延長 QT）；再發就前移餵食部位', '>150 就停', '無關'], a: 1, why: '傳統門檻沒證據、只造成餵食不足；微吸入近半數。鴉片相關用胃內 naloxone。' },
    { q: '管灌腹瀉（達 70%）先想什麼？', o: ['一律止瀉', '配方高滲、液劑（>3,000 mOsm 或含 sorbitol）、抗生素、C. difficile；換低滲或元素配方、避免問題液劑；混合纖維沒幫助', '停餵', '加纖維'], a: 1, why: '阻塞：每 4 小時 30 mL 水沖；溫水 30%、Viokase＋碳酸鈉 75%；完全塞就換。' }
  ]);
  I.renderQuiz('qz_tpn', 'nutrition-tpn', [
    { q: '70 kg、1.4 g/kg 蛋白的標準 TPN？', o: ['隨便配', '10% 胺基酸 1 L（98 g）＋ 20% 脂肪 250 mL（500 kcal）＋ D50 735 mL（1,250 kcal）＋ 30 mL 添加物 ≈ 2,015 mL、84 mL/hr；再餵食風險從 42 mL/hr', 'D5 就好', '只給脂肪'], a: 1, why: 'D50 1.7 kcal/mL、2,525 mOsm 要中心靜脈；20% 脂肪 2 kcal/mL 等張。' },
    { q: 'TPN 的高血糖怎麼管？', o: ['80–110', '目標 140–180、不嚴控（低血糖更危險）；regular insulin 入袋＋lispro，穩定後一半換 glargine', '不管', '停 TPN'], a: 1, why: '>200 達 45%；葡萄糖進細胞帶走磷與鉀（再餵食的核心）；過度餵食升 CO₂（不只碳水）。' },
    { q: '大豆油乳劑的問題？', o: ['沒有', 'ω-6／ω-9 → eicosanoid 發炎傷害（oleic acid 是 ARDS 模型、輸注惡化氧合）、肝脂肪變、膽汁鬱積、脂肪過載症候群；新乳劑加橄欖油、MCT、魚油', '只有高血脂', '只在小孩'], a: 1, why: '必需脂肪酸只要 3–4% 熱量；Omegaven 純魚油要配大豆油。' },
    { q: '再餵食症候群的高風險？', o: ['所有 ICU 病人', '1 個月減重 ≥5% 或 6 個月 >10%、BMI ≤18.5、5 天攝食差、基線鉀磷鎂低、藥物濫用', '只有厭食症', '只有酒癮'], a: 1, why: '先矯正電解質＋thiamine（ASPEN 100–200 不夠）；40–50% 或 10–15 kcal/kg 或葡萄糖 150 g（300 mL D50）起、4–7 天進階、盯磷鉀鎂。' },
    { q: '周邊靜脈營養的限制？', o: ['沒有限制', '滲透壓 <900、pH 7.2–7.4：1.5% 胺基酸＋10% 葡萄糖（500 mOsm）2.5 L 850 kcal，加 250 mL 20% 脂肪到 1,350——只夠未壓力成人（20 kcal/kg）的蛋白節省，不給高分解代謝或營養不良者', '可完整支持', '不能加脂肪'], a: 1, why: '作者結語：TPN 能免則免。' },
    { q: '支鏈胺基酸配方？', o: ['肝衰竭一律用', '理論上阻擋芳香族胺基酸過血腦障壁、在肌肉代謝利氮平衡，但在任何設計的情境都未改善結局', '敗血症首選', '禁用'], a: 1, why: '9 種必需胺基酸；10% 胺基酸 100 g 蛋白/L、16.5 g 氮。' }
  ]);
  I.renderQuiz('qz_endo', 'nutrition-endo', [
    { q: '重症腎上腺抑制的主要表現？', o: ['低鈉高鉀', '輸液無反應的低血壓（慢性腎上腺功能不全的電解質異常少見）；敗血性休克達 60%、多可逆（CIRCI）', '高血糖', '發燒'], a: 1, why: '75% 是下視丘腦下垂體層級；誘因敗血症、HIV、黴菌、腦膜炎雙球菌、停類固醇、腎上腺出血、etomidate／ketoconazole、phenytoin／rifampin。' },
    { q: '怎麼診斷？', o: ['一律 ACTH 試驗', '隨機 cortisol <10 抑制、≥35 足夠、中間做 cosyntropin 250 μg（增量 <9 抑制）；敗血性休克不必驗、輸液與中等升壓劑仍低血壓就試 hydrocortisone', '游離 cortisol', 'ACTH 濃度'], a: 1, why: '總 cortisol 受 CBG 降一半影響；ACTH 反應正常不排除次發性。' },
    { q: 'CIRCI 的治療與停藥？', o: ['Dexamethasone 4 mg', 'Hydrocortisone 100 mg IV q8h（fludrocortisone 50 μg 可選）；敗血性休克升壓劑停、乳酸正常就停，幾天漸減防發炎反彈', 'Prednisone 60', '不治療'], a: 1, why: '等效：hydrocortisone 20 ＝ prednisone 5 ＝ methylprednisolone 4 ＝ dexamethasone 0.75；抗發炎最強的是 dexamethasone 卻多用 methylprednisolone。' },
    { q: 'ICU 甲狀腺檢驗異常怎麼看？', o: ['都要治', '達 90% 異常、多是非甲狀腺病：TSH 正常＋free T4／T3 低＝正常甲狀腺病態（30–50%），不治療；原發性 TSH 反向、次發性同向', 'T3 最可靠', 'TSH 無用'], a: 1, why: '用 free T4（>99% 結合蛋白）；TSH 正常排除亢進；amiodarone／heparin 造成正常甲狀腺高 T4 血症。' },
    { q: '甲狀腺風暴的處方？', o: ['Methimazole 就好', 'Propranolol 60–80 mg q4h（高劑量阻斷 T4→T3；氣喘心衰竭改 metoprolol；esmolol 控率）＋ PTU（風暴偏好）＋ Lugol 碘（過敏用 lithium 300 q8h）＋ hydrocortisone 300 → 100 q8h ＋ 積極輸液 ＋ 治誘因', 'Amiodarone', '只降溫'], a: 1, why: '高熱 >40、躁動譫妄、心搏快高輸出心衰竭；死亡達 25%。Methimazole 適合一般毒症（膽汁鬱積）、PTU 猛爆肝壞死與顆粒球缺乏。' },
    { q: '黏液水腫昏迷的順序？', o: ['先 levothyroxine', 'Hydrocortisone 100 mg q8h 先（常伴腎上腺功能不全）→ levothyroxine 200–400 μg IV → 50–100 μg PO/天（IV 75%）；可加 liothyronine 5–20 μg → 2.5–10 q8h', '只給 T3', '等 TSH'], a: 1, why: '意識低下、低體溫、低血鈉、心血管不穩；死亡達 60%；名稱誤稱。一般低下 levothyroxine 1.5–1.8 μg/kg 依 TSH 調。' }
  ]);
})();
