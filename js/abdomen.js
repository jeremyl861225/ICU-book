/* ICU Book · Section XII 腹部與骨盆 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 39–42（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch39 ================= */
  I.bindCalc('c39he', function () {
    var g = val('he_g'), nh3 = num('he_nh3'), olig = val('he_uo') === 'y', edema = val('he_ed') === 'y';
    var G = { '1': '注意力短、性格改變', '2': '淡漠或嗜睡、時間定向差', '3': '木僵但可喚醒、時間與地點定向差', '4': '昏迷' };
    var cvvh = olig || edema || (!na(nh3) && nh3 > 150);
    var h = row('West Haven', g ? '第 ' + g + ' 級' : '—', '', g === '4' || g === '3' ? 'fl-hot' : g ? 'fl-warn' : 'fl-na', G[g] || '', '運動徵象（僵硬、吞嚥困難、失調、撲翼震顫）任何一級都可出現');
    h += row('動脈氨', na(nh3) ? '—' : fmt(nh3, 0), 'μmol/L', na(nh3) ? 'fl-na' : nh3 > 150 ? 'fl-hot' : nh3 > 60 ? 'fl-warn' : 'fl-ok', na(nh3) ? '選填' : nh3 > 150 ? '>150：腦水腫風險升高' : nh3 > 60 ? '升高（正常 <60）' : '正常', '急性肝衰竭氨與嚴重度較相關；動脈血比靜脈血更能預測');
    h += row('CVVH', cvvh ? '建議、越早越好' : '目前不符三條件', '', cvvh ? 'fl-hot' : 'fl-na', cvvh ? (olig ? '持續寡尿；' : '') + (edema ? '腦水腫證據；' : '') + (!na(nh3) && nh3 > 150 ? '氨 >150' : '') : '持續寡尿、氨 >150、或腦水腫證據——不看肌酸酐', '急性肝衰竭的肝性腦病變 CVVH 優於 lactulose／rifaximin，效果與時間相關');
    h += row('Lactulose', '20–30 g（30–45 mL）q1h 到排便 → 20 g q8h', '', 'fl-na', '目標每天 2–3 次軟便', '灌腸：200 g 加 700 mL 水、Trendelenburg 保留 30–60 分；腹瀉就減量');
    h += row('Rifaximin', '400 mg tid ≥10 天', '', 'fl-na', '不吸收、通常與 lactulose 合用', '');
    h += '<div class="rx-flag">機轉：腸道蛋白分解產氨 → 肝的尿素循環失能 → 氨過血腦障壁進星狀細胞變 glutamine → 滲透壓把水拉進細胞（細胞毒性腦水腫）。急性肝衰竭 AKI 達 70%，RRT 用得更積極（同時清氨與水）。進行性腦病變一律照會移植：移植把死亡率從 80% 降到 33%。</div>';
    document.getElementById('c39he_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c39sbp', function () {
    var pmn = num('sb_pmn'), org = val('sb_org'), mrsa = val('sb_mrsa') === 'y', vre = val('sb_vre') === 'y', wt = num('sb_w');
    var dx = !na(pmn) && pmn > 250;
    var h = row('腹水嗜中性球', na(pmn) ? '—' : fmt(pmn, 0), '/mm³', na(pmn) ? 'fl-na' : dx ? 'fl-hot' : 'fl-ok', na(pmn) ? '' : dx ? '>250：確診，不等培養就給抗生素' : '≤250：培養陽性也不算 SBP，可考慮重抽', '床邊直接打進血瓶（好氧＋厭氧）；培養陽性只 60%');
    if (dx) {
      var abx = org === 'comm' ? '第三代 cephalosporin（cefotaxime 或 ceftriaxone）' : org === 'noso' ? 'Meropenem 1 g q8h' + (mrsa ? ' ＋ vancomycin' : '') + (vre ? ' ＋ daptomycin' : '') : '依院內抗藥盛行率：可能抗藥 → meropenem' + (mrsa ? ' ＋ vancomycin' : '') + (vre ? ' ＋ daptomycin' : '') + '；不太可能 → piperacillin-tazobactam';
      h += row('經驗性抗生素', abx, '', 'fl-warn', org === 'comm' ? '社區型抗藥菌少見' : org === 'noso' ? '院內型（>48 小時）抗藥菌常見' : '照護相關（90 天內接觸醫療機構、48 小時內發病）', '至少 7 天；48 小時重抽腹水，嗜中性球降 ≥25% 算有效');
      h += row('Albumin 第 1 天', na(wt) ? '1.5 g/kg' : fmt(wt * 1.5, 0) + ' g ≈ ' + fmt(wt * 1.5 * 4, 0) + ' mL 25%', '', 'fl-na', '改善存活，與肌酸酐無關', 'SBP 30% 併 AKI、死亡率大增');
      h += row('Albumin 第 3 天', na(wt) ? '1 g/kg' : fmt(wt, 0) + ' g ≈ ' + fmt(wt * 4, 0) + ' mL 25%', '', 'fl-na', '用 25% 減少輸注量', '');
    }
    h += '<div class="rx-flag">失代償肝硬化 1/3 有細菌感染、SBP 最常見：腸道菌移位、肝失去第二道防線（3/4 網狀內皮系統在腹部）。只發生在有腹水的肝硬化；1/3 無症狀——入 ICU 或突然惡化都要抽腹水。菌：革蘭陰性（E. coli、Klebsiella）為主，全球抗藥 35%、美國 16%。</div>';
    document.getElementById('c39sbp_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c39hrs', function () {
    var cr0 = num('hr_cr0'), cr1 = num('hr_cr1'), asc = val('hr_asc') === 'y', alb = val('hr_alb') === 'n', clean = val('hr_shock') === 'n', iap = num('hr_iap');
    var aki = !na(cr0) && !na(cr1) && (cr1 - cr0 >= 0.3 || cr1 / cr0 >= 1.5);
    var met = asc && aki && alb && clean;
    var h = row('AKI', na(cr1) ? '—' : aki ? '符合' : '不符', '', na(cr1) ? 'fl-na' : aki ? 'fl-warn' : 'fl-ok', na(cr1) ? '' : '48 小時 +0.3 或 ×1.5（' + (na(cr0) ? '' : '+' + fmt(cr1 - cr0, 2) + '、×' + fmt(cr1 / cr0, 2)) + '）', '失代償肝硬化 AKI 達 50%');
    h += row('HRS 判準', met ? '五項全符合' : '未全符合', '', met ? 'fl-hot' : 'fl-na', met ? '功能性 AKI、預後差' : '腹水＋AKI＋停利尿劑與 albumin 1 g/kg × 2 天無反應＋無休克無腎毒藥＋無結構性腎病', '尿液指數像腎前性（尿鈉低、滲透壓高），可與 ATN 區分');
    if (met) {
      h += row('Terlipressin', '首選（內臟血管收縮）', '', 'fl-warn', '改善腎功能，不改善存活或移植需求', '副作用：腹痛腹瀉、靜水性肺水腫、缺血事件；2022 美國核准');
      h += row('替代', 'Norepinephrine；midodrine ＋ octreotide 較差', '', 'fl-na', 'Norepinephrine 試驗中與 terlipressin 相當但經驗少', 'Midodrine ＋ octreotide 只在沒有 terlipressin 的地方用');
      h += row('Albumin', '20–40 g/天（25%：80–160 mL）', '', 'fl-na', '不只是體積：抗氧化、免疫調節', '');
    }
    if (!na(iap)) h += row('腹內壓', fmt(iap, 0), 'mmHg', iap > 12 ? 'fl-warn' : 'fl-ok', iap > 12 ? '>12：鼓勵大量放腹水（≥4 L 改善腎功能），放完密切監測血行動力' : '', '緊繃腹水的 HRS 都要量');
    h += '<div class="rx-flag">機轉：內臟血管擴張 → 腎素系統活化 → 腎血管收縮，GFR 對心輸出量的小幅下降極敏感；敗血症加重擴張。診斷就照會肝移植（根治）。</div><div class="kbox alert"><div class="kbox-t">原文疑義</div>本章寫腹內壓 >12 <b>cm H₂O</b> 放腹水，第 34 章與 WSACS 定義都用 <b>mmHg</b>（≥12 mmHg 為腹內高壓）；本頁以 mmHg 呈現。</div>';
    document.getElementById('c39hrs_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c39var', function () {
    var alb = num('vb_alb'), hb = num('vb_hb'), ms = val('vb_ms') === 'y', ref = val('vb_ref') === 'y';
    var h = row('內視鏡', '12 小時內', '', 'fl-hot', '找出血源（有預後意義）＋結紮或夾', ms ? '意識改變：先插管保護呼吸道' : '');
    h += row('復甦液', na(alb) ? '—' : alb < 3 ? '5% albumin' : '等張晶體', '', na(alb) ? 'fl-na' : alb < 3 ? 'fl-warn' : 'fl-na', na(alb) ? '白蛋白 <3 g/dL 用 5% albumin（70% 留在血管內）' : alb < 3 ? '白蛋白 ' + fmt(alb, 1) + ' <3' : '', '不用 Ringer 等低張液（加重腦水腫）；MAP 目標 65');
    h += row('血品', na(hb) ? '目標 Hb 7' : hb < 7 ? '輸血，目標 7' : '不輸紅血球（Hb ' + fmt(hb, 1) + '）', '', na(hb) ? 'fl-na' : hb < 7 ? 'fl-warn' : 'fl-ok', 'RBC：血漿：血小板 1:1:1', 'INR 在肝硬化不能代表出血風險——用 TEG 引導止血治療');
    h += row('Octreotide', '越早越好', '', 'fl-na', '內臟血管收縮（somatostatin 類似物）', '');
    h += row('Ceftriaxone', '2 g/天', '', 'fl-na', '預防性抗生素、越早越好', '前提是院內抗藥菌不盛行');
    if (ref) h += row('頑固出血', 'TIPS', '', 'fl-hot', '約 20% 對內視鏡與藥物無效', '繞過肝臟 → 肝性腦病變風險升高');
    h += '<div class="rx-flag">靜脈曲張是門脈高壓的黏膜下靜脈怒張；急性肝衰竭反而沒有腹水與曲張出血，主角是全身性發炎與多器官失能。</div><div class="note">原書表 39.3（劑量欄）截斷，octreotide 劑量依表未能取得，此處不列數字。</div>';
    document.getElementById('c39var_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch40 ================= */
  I.bindCalc('c40dx', function () {
    var pain = val('dx_pain') === 'y', enz = num('dx_enz'), img = val('dx_img') === 'y', of = val('dx_of'), local = val('dx_local') === 'y';
    var n = (pain ? 1 : 0) + (!na(enz) && enz >= 3 ? 1 : 0) + (img ? 1 : 0);
    var sev = of === 'persist' ? '重度' : (of === 'trans' || local) ? '中重度' : '輕度';
    var h = row('診斷條件', n + '/3', '', n >= 2 ? 'fl-warn' : 'fl-na', n >= 2 ? '≥2 項：符合急性胰臟炎' : '<2 項：不符', '典型腹痛、amylase 或 lipase ≥3 倍上限、影像（CT／MRI 水腫或壞死）');
    h += row('酵素', na(enz) ? '—' : '×' + fmt(enz, 1) + ' ULN', '', na(enz) ? 'fl-na' : enz >= 3 ? 'fl-warn' : 'fl-ok', '', 'Lipase 優於 amylase：專一性高、4–8 小時就升（amylase 6–12）、持續 8–14 天（3–5）；單測 lipase 準確度相同');
    h += row('嚴重度', sev, '', sev === '重度' ? 'fl-hot' : sev === '中重度' ? 'fl-warn' : 'fl-ok', sev === '重度' ? '器官衰竭 >48 小時；死亡 20–25%' : sev === '中重度' ? '暫時性器官衰竭（<48 小時）或局部併發症' : '無器官衰竭、無併發症；約 50%', '酵素高低與 CT 影像和嚴重度都不相關；器官衰竭（ARDS、AKI、休克）初期可能還沒出現');
    h += '<div class="rx-flag">型態：水腫型（最常見、自限）vs 壞死型（5–40%，可併感染與器官損傷）；壞死第一週可能還照不出來，症狀持續或重症要重照。無法打顯影劑用 MRI。膽結石是首因，每個確診都要評估膽道（CT 不夠就床邊超音波）。</div>';
    document.getElementById('c40dx_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c40fluid', function () {
    var wt = num('fl_w'), hypo = val('fl_hypo') === 'y', hyca = val('fl_ca') === 'y';
    var h = row('輸液', hyca ? '等張晶體（不用 RL）' : 'Ringer’s lactate', '', hyca ? 'fl-warn' : 'fl-na', hyca ? '高血鈣相關胰臟炎：RL 含鈣' : 'RL 結局優於等張食鹽水', '');
    h += row('Bolus', hypo ? (na(wt) ? '10 mL/kg' : fmt(wt * 10, 0) + ' mL') : '不給', '', hypo ? 'fl-warn' : 'fl-ok', hypo ? '有低血容證據才給' : '無低血容證據就跳過', '');
    h += row('維持', na(wt) ? '1.5 mL/kg/hr' : fmt(wt * 1.5, 0) + ' mL/hr', '', 'fl-na', '目標 MAP ≥65、尿 ≥0.5 mL/kg/hr', '積極方案（20 mL/kg ＋ 3 mL/kg/hr）只造成過載、不改善結局');
    h += row('升壓劑', 'Norepinephrine', '', 'fl-na', '輸液達不到血壓才用、小心調', '所有血管收縮劑都減內臟血流、可能促進壞死——避免 phenylephrine');
    h += '<div class="rx-flag">重症胰臟炎的微血管滲漏造成低血容、再造成更多壞死，所以早期要顧體積；但灌太多就是腸壁水腫與腹內高壓（55% >12、>20 寡尿）——重症併寡尿一定量膀胱壓。營養 48 小時內開始（口服或鼻胃管，元素配方低脂），腸道營養比 TPN 少感染、少器官衰竭、低死亡；胃或空腸餵食未定，先鼻胃。</div>';
    document.getElementById('c40fluid_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c40tg', function () {
    var tg = num('tg_v'), wt = num('tg_w');
    var high = !na(tg) && tg > 1000;
    var h = row('三酸甘油酯', na(tg) ? '—' : fmt(tg, 0), 'mg/dL', na(tg) ? 'fl-na' : high ? 'fl-hot' : tg > 500 ? 'fl-warn' : 'fl-ok', na(tg) ? '' : high ? '>1,000：高三酸甘油酯胰臟炎（達 7%，較嚴重）' : tg > 500 ? '治療目標是 <500' : '<500', 'PUFA 釋出、高度可氧化 → 發炎');
    if (high) {
      h += row('Insulin 輸注', na(wt) ? '0.1–0.4 U/kg/hr' : fmt(wt * 0.1, 1) + '–' + fmt(wt * 0.4, 1) + ' U/hr', '', 'fl-warn', '活化 lipoprotein lipase', '併禁食 24 小時可降 85–90%');
      h += row('葡萄糖', 'D5–10% 同時輸注', '', 'fl-na', '密切監測血糖', '');
      h += row('24 小時預估', fmt(tg * 0.1, 0) + '–' + fmt(tg * 0.15, 0), 'mg/dL', 'fl-na', '目標 <500', '之後 gemfibrozil 或 fenofibric acid 維持 <500');
    }
    h += '<div class="rx-flag">其他特定治療：膽結石併膽道阻塞證據 → ERCP 括約肌切開；膽囊切除輕症可同次住院、重症延後 4–6 週。藥物性（thiazide、azathioprine、doxycycline 最常見）。作者觀點：酒精與胰臟炎的關聯可能是唾液 amylase 造的（急性酒精中毒 40% 有唾液型高 amylase）——有酒癮史也要找別的原因。</div>';
    document.getElementById('c40tg_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch41 ================= */
  I.bindCalc('c41cdi', function () {
    var pcr = val('cd_pcr'), tox = val('cd_tox'), ful = val('cd_ful') === 'y', rec = val('cd_rec');
    var h;
    if (pcr === 'neg') h = row('判讀', 'PCR 陰性：排除 CDI', '', 'fl-ok', '沒有產毒株就沒有感染', 'PCR 敏感度高、當篩檢');
    else if (tox === 'pos') h = row('判讀', 'PCR ＋ 毒素陽性：確診 CDI', '', 'fl-hot', '', '');
    else if (tox === 'neg') h = row('判讀', 'PCR 陽性、毒素陰性：帶菌，多半不需治療', '', 'fl-warn', '毒素 ELISA 敏感度低、漏 20%；臨床高度懷疑做大腸鏡找偽膜', '只憑 PCR 治療是過度診斷：PCR 陽性者一半沒有毒素、不治療也好');
    else h = row('判讀', 'PCR 陽性：加驗毒素 ELISA', '', 'fl-na', 'PCR 只證明帶菌', '');
    if (pcr !== 'neg' && tox === 'pos') {
      if (ful) h += row('猛爆型', 'Vancomycin 500 mg q6h（口服／鼻胃管／灌腸）＋ metronidazole 500 mg IV q8h', '', 'fl-hot', '低血壓、腸阻塞腹脹、毒性巨結腸（外科急症）', '需手術用次全結腸切除；3–5%');
      else if (rec === '0') h += row('初次', 'Vancomycin 125 mg PO qid × 10 天 或 fidaxomicin 200 mg PO bid × 10 天', '', 'fl-warn', '燒 24–48 小時退、腹瀉 4–5 天退', '復發率 vancomycin 25%、fidaxomicin 13%');
      else if (rec === '1') h += row('第一次復發', 'Fidaxomicin 10 天，或 vancomycin 延長遞減', '', 'fl-warn', '多在 3 週內復發', '');
      else h += row('多次復發', '糞便微生物移植', '', 'fl-warn', '治癒率 80–100%', '約 5% 復發超過一次；鼻胃管、內視鏡或灌腸');
    }
    h += '<div class="rx-flag">C. difficile 不侵入，靠毒素 A／B 傷黏膜；偽膜＝重症。危險因子：高齡、醫療接觸、抗生素，還有 PPI（胃酸是抗菌防線）——社區型已占 34–48%。防護：手套隔離衣、接觸前後洗手，但無症狀帶菌者也傳播；益生菌不建議（反而阻礙重建）。</div>';
    document.getElementById('c41cdi_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c41iai', function () {
    var shock = val('ia_shock') === 'y', esbl = val('ia_esbl') === 'y', bla = val('ia_bla') === 'y', cand = val('ia_cand') === 'y';
    var h;
    if (bla) h = row('β-lactam 過敏', 'Amikacin ＋ metronidazole', '', 'fl-warn', '', '');
    else if (shock) h = row('敗血性休克', 'Meropenem', '', 'fl-hot', '覆蓋最廣、休克首選', '不蓋 MRSA／VRE；抗藥性快、要節制');
    else if (esbl) h = row('疑 ESBL', 'Meropenem、tigecycline 或 ceftazidime-avibactam', '', 'fl-warn', '曾定殖或感染 ESBL', 'Tigecycline 不蓋 Pseudomonas 但蓋 MRSA／VRE、休克不用；ceftazidime-avibactam 蓋 Pseudomonas 不蓋腸球菌與厭氧菌、經驗少');
    else h = row('無抗藥疑慮', 'Piperacillin-tazobactam 單方', '', 'fl-na', '', 'Ceftriaxone ＋ metronidazole 只給不重的病人、覆蓋差很多');
    if (cand) h += row('Candida', '加 echinocandin（micafungin／anidulafungin／caspofungin）', '', 'fl-warn', '上消化道穿孔、術後不穩定或重症', '近期用過抗生素者腸道 Candida 多；蓋所有 Candida 種');
    h += '<div class="rx-flag">複雜性腹腔內感染＝腹膜腔的瀰漫性腹膜炎或局部膿瘍，多來自穿孔或吻合口滲漏；先控制來源、再抗生素。穿孔：直立胸片橫膈下游離氣敏感度達 85%、CT 更敏感且 85% 能定位；術後一週內游離氣沒有意義。術前盡量不用升壓劑（內臟收縮加重腸缺血）。術後腹膜炎是 ICU 最常見腹腔感染：經驗性要蓋 ESBL、不穩定者蓋 Candida；CRP 預測滲漏未普及。膿瘍：發燒幾乎都有但 60% 無局部壓痛、<10% 摸得到、X 光腔外氣 <15%；CT 術後第一週後才可靠；CT 導引引流成功 90–95%。</div>';
    document.getElementById('c41iai_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c41acc', function () {
    var us = val('ac_us'), liver = val('ac_liver') === 'y', stable = val('ac_st') === 'y';
    var h;
    if (us === 'gang') h = row('超音波', '腔內脫落黏膜：壞疽性膽囊炎', '', 'fl-hot', '較專一的晚期表現', '');
    else if (us === 'sus') h = row('超音波', '膽囊脹大、淤泥：可疑但不專一', '', 'fl-warn', '合併 26 篇敏感度 81%、專一性 83%', liver ? '不確定 → HIDA 掃描（金標準，需要肝功能把示蹤劑送進膽道）' : '肝功能差 HIDA 不可靠；MRI 與超音波相當、CT 差');
    else h = row('超音波', '未見異常', '', 'fl-na', '診斷率有限、不能排除', liver ? '高度懷疑做 HIDA' : 'MRI');
    h += row('處置', stable ? '腹腔鏡膽囊切除' : '經皮膽囊引流', '', 'fl-warn', stable ? '首選' : '不穩定者的替代', '必須立刻處理、惡化很快');
    h += row('抗生素', '確診即開始，蓋革蘭陰性腸道菌', '', 'fl-na', '膽汁穿透好：ampicillin-sulbactam、ceftriaxone、ciprofloxacin、levofloxacin、piperacillin-tazobactam、tigecycline', '穿透差：cefepime、cefotaxime、ceftazidime、gentamicin、meropenem、vancomycin');
    h += '<div class="rx-flag">誘因：中風、敗血症、休克、長期禁食（TPN）、術後（尤其體外循環）；機轉：低灌流、膽囊不收縮淤泥累積、Oddi 括約肌鬆弛讓腸道菌上行、膽汁組成改變（微結石）。表現不專一：發燒低血壓多器官衰竭，1/3 沒有右上腹痛；血液培養陽性 90%、幾乎都是革蘭陰性桿菌。</div>';
    document.getElementById('c41acc_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch42 ================= */
  I.bindCalc('c42cauti', function () {
    var days = num('ut_days'), sym = val('ut_sym') === 'y', cfu = val('ut_cfu') === 'hi', sp = num('ut_sp'), blood = val('ut_blood') === 'y', py = val('ut_py'), resp = val('ut_resp') === 'y';
    var cath = !na(days) && days >= 2, cult = cfu && (na(sp) || sp <= 2);
    var cls = cult && cath && sym ? 'cauti' : cult && blood ? 'abuti' : cult && !sym ? 'asb' : 'none';
    var h = row('導管', na(days) ? '—' : fmt(days, 0) + ' 天', '', na(days) ? 'fl-na' : cath ? 'fl-warn' : 'fl-ok', na(days) ? '' : cath ? '≥2 天（仍在或前一天拔除）' : '<2 天不符 CAUTI', '每天 3–8% 產生菌尿；不需要就拔是最有效的預防');
    h += row('培養', cult ? '符合（≥10⁵ cfu/mL、≤2 種）' : '不符', '', cult ? 'fl-warn' : 'fl-na', '', '');
    var L = { cauti: ['CAUTI', 'fl-hot', '導管 ≥2 天＋症狀（發燒 >38、恥骨上或肋脊角壓痛；急迫頻尿與排尿痛不適用留置導管）＋培養'], abuti: ['無症狀菌血症性 UTI', 'fl-hot', '同一菌血尿都長：不管有沒有症狀都算 UTI（Candida 除外）'], asb: ['無症狀菌尿', 'fl-ok', '單一菌 >10⁵、血液培養無、無症狀：不治療（除非要做會出血的泌尿科處置）'], none: ['不符 UTI 定義', 'fl-na', ''] }[cls];
    h += row('分類', L[0], '', L[1], L[2], py === 'n' ? '無膿尿是反證據' : py === 'y' ? '膿尿不能確診（非感染性發炎也會）' : '');
    if (cls === 'cauti' || cls === 'abuti') {
      h += row('經驗性抗生素', 'Piperacillin-tazobactam 或 meropenem', '', 'fl-warn', '蓋革蘭陰性桿菌與腸球菌', '二線：ceftazidime、cefepime、levofloxacin；培養出來後窄化');
      h += row('療程', resp ? '7 天' : '10–14 天', '', 'fl-na', resp ? '反應快' : '反應慢', '放 >2 週的導管要換或拔');
    }
    h += '<div class="rx-flag">發燒當診斷條件有問題：有無 CAUTI 兩組發燒率相同。20% 住院菌血症來自 CAUTI。菌：E. coli 28%、Klebsiella 23%、腸球菌 17%、Pseudomonas 10%、Candida 5%；<30 天單一菌、≥30 天多菌。預防：每天清潔插入口反而增加菌尿、不建議；不預防性抗生素；銀合金導管要配合定期更換才有效。機轉不是細菌密度而是黏附——病人黏膜上的共生菌被致病菌取代。</div><div class="note">原書菌落數的上標在抽出時遺失（印成「>10 cfu/mL」），本頁依 NHSN 定義寫 10⁵。</div>';
    document.getElementById('c42cauti_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c42cand', function () {
    var sym = val('cn_sym') === 'y', neut = val('cn_neut') === 'y', sp = val('cn_sp'), sys = val('cn_sys') === 'y', wt = num('cn_w');
    var h;
    if (sys) h = row('疑全身性念珠菌症', 'Echinocandin', '', 'fl-hot', '蓋所有 Candida 種；血液培養 >50% 陰性、念珠菌尿可能是唯一線索', '菌落數對腎或全身感染無預測價值');
    else if (!sym) h = row('無症狀念珠菌尿', neut ? 'Echinocandin 預防' : '不治療（定殖）', '', neut ? 'fl-warn' : 'fl-ok', neut ? '嗜中性球低下：播散風險' : '留置導管的常態', '');
    else {
      h = row('有症狀', '抗黴菌 ＋ 血液培養 ＋ 腎臟影像（超音波／CT）', '', 'fl-warn', '找腎膿瘍與阻塞', '');
      if (sp === 'alb') h += row('Fluconazole 敏感（C. albicans）', 'Fluconazole 200–400 mg PO/天 × 2 週', '', 'fl-na', '', '');
      else if (sp === 'res') h += row('抗 fluconazole（glabrata、krusei）', 'Amphotericin B ' + (na(wt) ? '0.3–0.6 mg/kg' : fmt(wt * 0.3, 0) + '–' + fmt(wt * 0.6, 0) + ' mg') + '/天 × 1–7 天', '', 'fl-na', 'Echinocandin 尿中穿透差、不用', '');
      else h += row('種別未知', '等鑑定：albicans 約 50%、其次 glabrata（抗 fluconazole）', '', 'fl-na', '', '');
      h += row('真菌球', '手術；腎造口管用 amphotericin B 25–50 mg 加 200–500 mL 無菌水沖洗', '', 'fl-na', '', '');
    }
    document.getElementById('c42cand_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch39 SBP 抗生素 */
  var sb = { org: null, res: null };
  window.sbPick = function (k, v, btn) { flowSelect(btn); sb[k] = v; sbRender(); };
  function sbRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (sb.org === 'comm') { cls = 'rec-elective'; t = '社區型：第三代 cephalosporin（cefotaxime 或 ceftriaxone）'; d = '<li>抗藥菌少見；至少 7 天，48 小時重抽腹水看嗜中性球降 ≥25%。</li>'; }
    else if (sb.org === 'noso') { cls = 'rec-urgent'; t = '院內型（>48 小時）：meropenem 1 g q8h，疑 MRSA 加 vancomycin、疑 VRE 加 daptomycin'; d = '<li>抗藥菌典型。</li>'; }
    else if (sb.org === 'hca') {
      if (sb.res === 'yes') { cls = 'rec-urgent'; t = '照護相關＋抗藥可能：carbapenem ± vancomycin／daptomycin'; d = '<li>依院內抗藥盛行率決定。</li>'; }
      else if (sb.res === 'no') { cls = 'rec-elective'; t = '照護相關、抗藥不太可能：piperacillin-tazobactam 廣效覆蓋腸道菌'; d = ''; }
      else { cls = 'rec-elective'; t = '照護相關（90 天內接觸醫療機構、入院 48 小時內發病）：抗藥可能嗎？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (sb.org) n = '一律加 albumin 1.5 g/kg（第 1 天）＋ 1 g/kg（第 3 天），用 25% 溶液。';
    flowRec('sb_rec', cls, t, d, n);
  }
  window.sbReset = function () { sb = { org: null, res: null }; selAll('#sb_flow'); sbRender(); };

  /* Ch40 壞死性胰臟炎的發燒 */
  var pn = { nec: null, gas: null };
  window.pnPick = function (k, v, btn) { flowSelect(btn); pn[k] = v; pnRender(); };
  function pnRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (pn.nec === 'no') { cls = 'rec-blue'; t = '水腫型：發燒與白血球多為胰臟炎本身；找其他來源（導管、肺、膽道）'; d = '<li>水腫型自限、通常不需 ICU。</li>'; }
    else if (pn.nec === 'yes') {
      if (pn.gas === 'yes') { cls = 'rec-urgent'; t = 'CT 壞死區有氣泡：感染性壞死——抗生素蓋革蘭陰性腸道菌 ＋ CT 導引引流，早引流優於延後'; d = '<li>引流失敗 → 手術清創（necrosectomy）。</li>'; }
      else if (pn.gas === 'no') { cls = 'rec-elective'; t = '無氣泡：仍可能感染（1/3 壞死型在 7–10 天感染），持續或反覆發燒可經驗性抗生素、重照 CT'; d = '<li>發燒白血球在無感染的壞死型也常見。</li><li>預防性抗生素不減少感染、不建議。</li>'; }
      else { cls = 'rec-elective'; t = '壞死型：顯影 CT 有氣泡嗎？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (pn.nec) n = '腹內壓 >12 在重症胰臟炎 55%；併寡尿一定量膀胱壓（積液、腹水、腸壁水腫）。';
    flowRec('pn_rec', cls, t, d, n);
  }
  window.pnReset = function () { pn = { nec: null, gas: null }; selAll('#pn_flow'); pnRender(); };

  /* Ch41 CDI 診斷 */
  var cd = { pcr: null, tox: null, sus: null };
  window.cdPick = function (k, v, btn) { flowSelect(btn); cd[k] = v; cdRender(); };
  function cdRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (cd.pcr === 'neg') { cls = 'rec-blue'; t = 'PCR 陰性：排除 CDI，找其他腹瀉原因'; d = ''; }
    else if (cd.pcr === 'pos') {
      if (cd.tox === 'pos') { cls = 'rec-urgent'; t = '毒素陽性：確診 CDI——vancomycin 125 mg qid 或 fidaxomicin 200 mg bid × 10 天；猛爆型加 IV metronidazole'; d = ''; }
      else if (cd.tox === 'neg') {
        if (cd.sus === 'high') { cls = 'rec-elective'; t = '毒素陰性但高度懷疑：大腸鏡找偽膜（偽膜＝確診）'; d = '<li>ELISA 漏 20%；大腸鏡優於乙狀結腸鏡。</li>'; }
        else if (cd.sus === 'low') { cls = 'rec-blue'; t = '帶菌不是感染：不治療'; d = '<li>PCR 陽性者一半沒有毒素、不治療也好；只憑 PCR 治療是過度診斷。</li>'; }
        else { cls = 'rec-elective'; t = '毒素陰性：臨床懷疑程度？'; d = '<li>請回答第 3 步。</li>'; }
      } else { cls = 'rec-elective'; t = 'PCR 陽性只證明帶菌：驗毒素 A／B ELISA'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (cd.pcr) n = '典型：水瀉、低燒 ≤38.3、白血球 <15,000；猛爆型（3–5%）低血壓、腸阻塞、毒性巨結腸。';
    flowRec('cd_rec', cls, t, d, n);
  }
  window.cdReset = function () { cd = { pcr: null, tox: null, sus: null }; selAll('#cd_flow'); cdRender(); };

  /* Ch42 念珠菌尿 */
  var cu = { sym: null, neut: null, sp: null };
  window.cuPick = function (k, v, btn) { flowSelect(btn); cu[k] = v; cuRender(); };
  function cuRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (cu.sym === 'no') {
      if (cu.neut === 'yes') { cls = 'rec-elective'; t = '無症狀但嗜中性球低下：echinocandin 預防播散'; d = ''; }
      else if (cu.neut === 'no') { cls = 'rec-blue'; t = '無症狀念珠菌尿：定殖，不治療'; d = '<li>菌落數沒有預測價值。</li>'; }
      else { cls = 'rec-elective'; t = '無症狀：嗜中性球低下嗎？'; d = '<li>請回答第 2 步。</li>'; }
    } else if (cu.sym === 'yes') {
      if (cu.sp === 'alb') { cls = 'rec-elective'; t = 'C. albicans：fluconazole 200–400 mg/天 × 2 週；血液培養＋腎臟影像'; d = ''; }
      else if (cu.sp === 'res') { cls = 'rec-elective'; t = 'C. glabrata／krusei：amphotericin B 0.3–0.6 mg/kg/天 × 1–7 天（echinocandin 尿中穿透差）'; d = ''; }
      else { cls = 'rec-elective'; t = '有症狀（發燒、恥骨上或肋脊角壓痛）：菌種？'; d = '<li>請回答第 3 步（嗜中性球那步可略）。疑全身性一律 echinocandin。</li>'; }
    }
    if (cu.sym) n = '念珠菌尿可能是播散性念珠菌症的結果而非原因，血液培養 >50% 陰性。';
    flowRec('cu_rec', cls, t, d, n);
  }
  window.cuReset = function () { cu = { sym: null, neut: null, sp: null }; selAll('#cu_flow'); cuRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_liver', 'abdomen-liver', [
    { q: '急性肝衰竭的首因與抗劑？', o: ['B 型肝炎；抗病毒藥', 'Acetaminophen（美 46%、英 64%）；N-acetylcysteine 越早越好（10 小時內最有效）、任何時間都給到肝功能改善', '酒精；禁酒', '缺血；輸液'], a: 1, why: '一半是無意過量（600 多種成藥含它）、一半血中測不到。75% 不需移植。非 acetaminophen 的 ALF 經驗性 NAC 無證據但合理。' },
    { q: '急性肝衰竭復甦液不用 Ringer’s lactate 的原因？', o: ['含鉀', '低張、促進低血鈉，加重肝性腦病變的腦水腫；白蛋白 <3 用 5% albumin', '含鈣', '太貴'], a: 1, why: 'ALF 血行動力不穩來自血管擴張與低白蛋白的無效循環量；AKI 70%，RRT 積極用（清氨）。' },
    { q: '急性肝衰竭肝性腦病變何時 CVVH？', o: ['肌酸酐 >2', '持續寡尿、動脈氨 >150 μmol/L、或腦水腫證據——不看肌酸酐，越早越好', '只有第 4 級', 'lactulose 無效時'], a: 1, why: 'CVVH 在 ALF 優於 lactulose／rifaximin。氨 → 星狀細胞 glutamine → 細胞毒性腦水腫。' },
    { q: 'SBP 的診斷與抗生素起點？', o: ['培養陽性', '腹水嗜中性球 >250/mm³（不管培養）；培養陽性但 PMN 不夠不算，重抽', '發燒＋腹痛', '血液培養'], a: 1, why: '1/3 無症狀；培養只 60% 陽性，床邊打進血瓶。社區型 3 代 cephalosporin、院內型 carbapenem；albumin 1.5 g/kg 第 1 天＋1 g/kg 第 3 天改善存活。' },
    { q: '肝腎症候群的首選藥？', o: ['Dopamine', 'Terlipressin ＋ albumin 20–40 g/天：改善腎功能但不改善存活；norepinephrine 相當、midodrine＋octreotide 較差', 'Furosemide', 'Octreotide 單用'], a: 1, why: '判準：腹水＋AKI＋停利尿劑與 albumin 1 g/kg × 2 天無反應＋無休克腎毒＋無結構性腎病。緊繃腹水量腹內壓，>12 放 ≥4 L。移植根治。' },
    { q: '肝硬化靜脈曲張出血，INR 高要不要輸血漿？', o: ['要，矯正到 <1.5', 'INR 在肝硬化不代表出血風險——用 TEG 引導；1:1:1、Hb 目標 7、12 小時內內視鏡、octreotide、ceftriaxone 2 g', '要，一律 4 單位', '不需任何血品'], a: 1, why: '20% 頑固 → TIPS（換來腦病變風險）。' }
  ]);
  I.renderQuiz('qz_panc', 'abdomen-panc', [
    { q: '急性胰臟炎的診斷需要？', o: ['Amylase >3 倍就夠', '三選二：典型腹痛、amylase 或 lipase ≥3 倍上限、影像', 'CT 必要', 'Lipase ＋ amylase 都升'], a: 1, why: 'Lipase 優於 amylase：專一、早升（4–8 小時）、久（8–14 天），單測即可；腹痛＋酵素可診斷 75–80%。' },
    { q: '重度胰臟炎的定義？', o: ['壞死 >30%', '器官衰竭持續 >48 小時（暫時性 <48 小時或局部併發症＝中重度）', 'Lipase >10 倍', 'CT 嚴重度指數'], a: 1, why: '死亡幾乎都在重度、20–25%；酵素與 CT 和嚴重度不相關；壞死第一週可能還照不出來。' },
    { q: '重症胰臟炎的輸液方案？', o: ['等張食鹽水 20 mL/kg ＋ 3 mL/kg/hr', 'Ringer’s lactate：低血容才 bolus 10 mL/kg，之後 1.5 mL/kg/hr；積極方案只造成過載', 'Albumin', '限水'], a: 1, why: 'RL 結局優於食鹽水，但高血鈣相關者不用（含鈣）；升壓劑選 norepinephrine、避 phenylephrine。' },
    { q: '重症胰臟炎的營養？', o: ['禁食到酵素正常', '48 小時內口服或鼻胃管（元素配方），TPN 只給不耐受者；腸道營養少感染、少器官衰竭、低死亡', '一律 TPN', '一律空腸'], a: 1, why: '腸黏膜完整減少菌移位（胰臟感染主要來源）；鼻胃與鼻空腸未定，先鼻胃。' },
    { q: '壞死性胰臟炎的感染？', o: ['預防性抗生素可減少', '1/3 在 7–10 天感染；CT 氣泡提示；抗生素蓋腸道革蘭陰性菌 ＋ 早期 CT 導引引流，失敗才清創；預防性抗生素不建議', '一律早期手術', '發燒＝感染'], a: 1, why: '發燒白血球在無感染的壞死型也常見。' },
    { q: '高三酸甘油酯胰臟炎的治療？', o: ['Plasmapheresis 為主', 'Insulin 0.1–0.4 U/kg/hr ＋ 禁食（24 小時降 85–90%）、配 D5–10%，目標 <500；之後 fibrate', '禁脂就好', 'Heparin'], a: 1, why: 'TG >1,000 占達 7%、較嚴重（PUFA 氧化）。膽結石併阻塞 → ERCP；膽囊切除重症延 4–6 週。' }
  ]);
  I.renderQuiz('qz_abdinf', 'abdomen-abdinf', [
    { q: '無結石膽囊炎的診斷順序？', o: ['CT', '超音波先（敏感度 81%、專一性 83%；脹大淤泥不專一、脫落黏膜＝壞疽）→ 不確定用 HIDA（金標準、需肝功能）；MRI 與超音波相當、CT 差', 'HIDA 先', 'MRI 先'], a: 1, why: '誘因：中風、敗血症、休克、TPN、術後（體外循環）；1/3 無右上腹痛、血液培養 90% 陽性。腹腔鏡切除首選、不穩定經皮引流。' },
    { q: 'PCR 陽性的 C. difficile 該不該治？', o: ['一律治', '先驗毒素 ELISA：PCR 只證明帶菌，陽性者一半沒毒素、不治療也好；毒素陰性但高度懷疑做大腸鏡', 'PCR 陰性也治', '看白血球'], a: 1, why: '只憑 PCR 是過度診斷。ELISA 漏 20%。' },
    { q: '猛爆型 CDI 的治療？', o: ['Metronidazole 口服', 'Vancomycin 500 mg q6h（口服／鼻胃管／灌腸）＋ metronidazole 500 mg IV q8h；毒性巨結腸手術用次全結腸切除', 'Fidaxomicin', '益生菌'], a: 1, why: '初次：vancomycin 125 qid 或 fidaxomicin 200 bid × 10 天（復發 25% vs 13%）；第一次復發 fidaxomicin 或 vancomycin 延長；多次復發糞便移植 80–100%。' },
    { q: 'PPI 與 C. difficile 的關係？', o: ['無關', '胃酸是抗菌防線；PPI 增加 CDI 風險，且 21 世紀初 CDI 大增與 PPI 壓力性潰瘍預防普及同時——作者主張節制', 'PPI 保護', '只有 H2 阻斷劑有關'], a: 1, why: '社區型已占 34–48%；防護靠手套隔離衣與洗手，無症狀帶菌者也傳播；益生菌不建議。' },
    { q: '腹腔內感染合併敗血性休克的經驗性抗生素？', o: ['Ceftriaxone ＋ metronidazole', 'Meropenem（最廣；不蓋 MRSA／VRE）；無抗藥疑慮 piperacillin-tazobactam；ESBL 可 tigecycline（不蓋 Pseudomonas、休克不用）或 ceftazidime-avibactam；β-lactam 過敏 amikacin ＋ metronidazole', 'Vancomycin', 'Fluoroquinolone'], a: 1, why: '上消化道穿孔、術後不穩定者加 echinocandin 蓋 Candida。' },
    { q: '術後腹腔膿瘍怎麼找？', o: ['理學檢查', 'CT，但術後第一週內血與沖洗液會誤判、一週後才可靠；60% 無局部壓痛、<10% 摸得到、X 光腔外氣 <15%；CT 導引引流 90–95% 成功', '腹部 X 光', '超音波'], a: 1, why: '術後腹膜炎是 ICU 最常見腹腔感染（吻合口滲漏）；游離氣術後一週內無意義所以常延遲診斷。' }
  ]);
  I.renderQuiz('qz_uti', 'abdomen-uti', [
    { q: '預防導管相關 UTI 最有效的是？', o: ['每天清潔插入口', '不需要就拔導管；每天清潔反增菌尿、預防性抗生素不建議、銀合金導管要配合定期更換', '預防性抗生素', '銀合金導管單獨'], a: 1, why: '每天 3–8% 產生菌尿；致病在黏附（共生菌被致病菌取代、導管引發上皮脫落），不在密度。' },
    { q: 'CAUTI 的 NHSN 診斷？', o: ['菌尿就算', '導管 ≥2 天（仍在或前一天拔）＋至少一項症狀（發燒 >38、恥骨上或肋脊角壓痛；急迫頻尿排尿痛不適用留置）＋培養 ≤2 種且 ≥10⁵ cfu/mL', '膿尿＋菌尿', '發燒＋膿尿'], a: 1, why: '發燒不專一（有無 CAUTI 發燒率相同）；膿尿不能確診、無膿尿是反證據。' },
    { q: '尿與血長出同一菌但無症狀？', o: ['無症狀菌尿、不治', '無症狀菌血症性 UTI（ABUTI）：不管症狀都算 UTI、要治（Candida 除外）', '污染', '等重驗'], a: 1, why: '20% 住院菌血症來自 CAUTI。無症狀菌尿（單一菌 >10⁵、血液陰性、無症狀）不治，除非要做會出血的泌尿科處置。' },
    { q: 'CAUTI 的經驗性抗生素與療程？', o: ['Nitrofurantoin 5 天', 'Piperacillin-tazobactam 或 carbapenem（蓋革蘭陰性桿菌與腸球菌）；反應快 7 天、否則 10–14 天；>2 週的導管換或拔', 'Fluoroquinolone 3 天', '一律 14 天'], a: 1, why: '二線 ceftazidime、cefepime、levofloxacin；培養出來後窄化。菌：E. coli 28%、Klebsiella 23%、腸球菌 17%、Pseudomonas 10%、Candida 5%。' },
    { q: '無症狀念珠菌尿？', o: ['一律 fluconazole', '定殖、不治療；嗜中性球低下才 echinocandin 預防；菌落數沒有預測價值', '換導管就好', 'Amphotericin 沖洗'], a: 1, why: '念珠菌尿可能是播散的結果、可能是唯一線索（血液培養 >50% 陰性）。' },
    { q: 'C. glabrata 的念珠菌 UTI 怎麼治？', o: ['Fluconazole 加倍', 'Amphotericin B 0.3–0.6 mg/kg/天 × 1–7 天；echinocandin 尿中穿透差不用', 'Echinocandin', 'Caspofungin'], a: 1, why: 'Albicans 用 fluconazole 200–400 × 2 週；疑全身性 echinocandin（蓋所有種）；真菌球手術、腎造口管 amphotericin 沖洗。' }
  ]);
})();
