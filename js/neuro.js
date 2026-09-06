/* ICU Book · Section XIV 神經系統 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 45–47（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch45 ================= */
  I.bindCalc('c45gcs', function () {
    var e = num('gc_e'), v = num('gc_v'), m = num('gc_m'), tube = val('gc_t') === 'y';
    var vv = tube ? 1 : v, tot = e + vv + m, max = tube ? 11 : 15;
    var h = row('GCS', na(tot) ? '—' : fmt(tot, 0) + ' / ' + max, '', na(tot) ? 'fl-na' : tot <= 8 ? 'fl-hot' : tot <= 12 ? 'fl-warn' : 'fl-ok', na(tot) ? '' : 'E' + fmt(e, 0) + ' V' + fmt(vv, 0) + (tube ? 'T' : '') + ' M' + fmt(m, 0), tube ? '插管者語言給假分數 1，最高 11' : '最低 3、最高 15');
    if (!na(tot)) {
      h += row('判讀', tot <= 8 ? '昏迷（≤8）' : tot <= 12 ? '中度頭部外傷（9–12）' : '輕度（13–15）', '', tot <= 8 ? 'fl-hot' : 'fl-na', tot <= 8 ? '呼吸道保護反射通常失效：插管的指徵' : '', '非外傷性昏迷 GCS ≤6 者甦醒機率是 ≤5 的 7 倍');
      h += row('可靠嗎', '肌鬆、深度鎮靜、低血壓時不可靠', '', 'fl-na', '', '用最佳分數');
    }
    h += '<div class="rx-flag">睜眼 4 自發／3 對聲音／2 對痛／1 無；語言 5 定向／4 混亂／3 不當字詞／2 無意義聲音／1 無；運動 6 遵囑／5 定位痛／4 迴避痛／3 異常屈曲（去皮質）／2 異常伸展（去大腦）／1 無。去皮質＝視丘傷、去大腦＝中腦上橋腦、鬆弛＝下腦幹。</div>';
    document.getElementById('c45gcs_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c45delir', function () {
    var acute = val('dl_a') === 'y', inatt = val('dl_i') === 'y', loc = val('dl_l') === 'y', think = val('dl_t') === 'y', sub = val('dl_s'), agit = val('dl_g') === 'y', wt = num('dl_w');
    var delir = acute && inatt && (loc || think);
    var h = row('CAM-ICU', delir ? '譫妄' : '不符', '', delir ? 'fl-warn' : 'fl-ok', delir ? '急性或波動＋注意力不集中＋（意識改變或思考混亂）' : '四要件：急性起病或波動（24 小時內）、注意力不集中、思考混亂、意識改變', 'ICU 25–50%，老人與呼吸器病人多');
    if (delir) {
      h += row('亞型', sub === 'hypo' ? '低活動型：最常見、最常被漏' : sub === 'hyper' ? '高活動型：躁動' : '混合型', '', 'fl-na', '「譫妄＝躁動」是誤解', '與失智的差別：急性、波動；40% 有精神病症狀（視幻覺）——「ICU 精神病」是誤稱');
      if (agit) {
        h += row('Dexmedetomidine', (na(wt) ? '1 μg/kg' : fmt(wt, 0) + ' μg') + ' 10 分（可省）→ 0.2–1.5 μg/kg/hr' + (na(wt) ? '' : '（' + fmt(wt * 0.2, 0) + '–' + fmt(wt * 1.5, 0) + ' μg/hr）'), '', 'fl-warn', '首選；只為恢復平靜、不是治譫妄', '心搏過緩、低血壓；停藥有亢奮的戒斷');
        h += row('Haloperidol', '5 mg IV → 15 分無效 10 mg 或換藥', '', 'fl-na', '高活動型常用、起效慢', 'Ziprasidone 只能 IM，沒有靜脈通路時有用');
      }
    }
    h += '<div class="rx-flag">誘因：敗血症、肝衰竭、尿毒、鎮靜安眠藥——BZD 是主要促發者，避免 BZD 是重要預防。沒有藥能預防或矯正 ICU 譫妄。預防（止痛、避深鎮靜、睡醒週期、家屬、早期活動、避 BZD）在重症病人未見成效。</div><div class="note">原書表 45.2 在 haloperidol 列截斷，dexmedetomidine 與 haloperidol 依內文；CAM-ICU 全文在附錄 II。</div>';
    document.getElementById('c45delir_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c45etoh', function () {
    var hrs = num('et_h'), lz = num('et_lz'), tube = val('et_t') === 'y', wt = num('et_w');
    var phase = na(hrs) ? '' : hrs < 6 ? '尚未到戒斷時窗（最早 6 小時）' : hrs <= 48 ? '早期：焦慮噁心震顫（6–8 小時起）；癲癇 6–48 小時、24 小時高峰；幻覺 12–48 小時' : hrs <= 96 ? '震顫性譫妄時窗（48–96 小時）：高活動型譫妄、幻覺、發燒心搏快高血壓 → 血行動力不穩；持續 3–5 天' : '>96 小時：DT 仍可持續（3–5 天）；譫妄 >5 天要想其他原因';
    var h = row('距最後一杯', na(hrs) ? '—' : fmt(hrs, 0) + ' 小時', '', na(hrs) ? 'fl-na' : (hrs >= 48 && hrs <= 96) ? 'fl-hot' : 'fl-warn', phase, 'DT 約 5%；戒斷譫妄沒有低活動型');
    h += row('Lorazepam', '2–4 mg IV q5–10 分到平靜 → 2–4 mg q 幾小時', '', 'fl-warn', 'BZD 模擬酒精的 GABA 作用；癲癇用 2 mg IV push（phenytoin 不用）', '輸注 ≥0.1 mg/kg/hr' + (na(wt) ? '' : '（' + fmt(wt * 0.1, 1) + ' mg/hr）') + ' 不超過 48 小時：propylene glycol 毒性；脂溶性高、越早遞減越好');
    if (!na(lz)) h += row('前 3–4 小時已用', fmt(lz, 0) + ' mg lorazepam', '', lz >= 30 ? 'fl-hot' : 'fl-na', lz >= 30 ? 'BZD 抗性（≥30–40 mg lorazepam 或 150–200 mg diazepam）' : '未達抗性定義', '');
    if (!na(lz) && lz >= 30) {
      h += row('輔助', tube ? 'Propofol（插管者首選、GABA 作用快）' : 'Phenobarbital 130–260 mg IV q15–20 分到效', '', 'fl-warn', tube ? '' : '巴比妥壓呼吸、低血壓，小心', 'Dexmedetomidine 也列為輔助但經驗不佳');
      h += row('像戒斷又壓不住', 'Wernicke（thiamine 100 mg/天不夠治療）、gabapentin 戒斷（≥3,000 mg/天、停後 12 小時到 7 天，BZD 無效、恢復 gabapentin 就好）', '', 'fl-hot', '入院幾天後突然惡化：葡萄糖負荷耗盡邊緣的 thiamine', '眼震、眼肌麻痺少見');
    }
    h += '<div class="rx-flag">CIWA-Ar 是嚴重度標準工具但不用於戒斷譫妄——用 CAM-ICU。慢性飲酒讓 GABA 受體密度增加，停酒後興奮。</div>';
    document.getElementById('c45etoh_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c45pupil', function () {
    var sz = val('pu_s'), re = val('pu_r') === 'y', uni = val('pu_u') === 'y';
    var t, d;
    if (uni) { t = '單側放大固定'; d = '眼外傷或近期眼手術；或擴張中的顱內腫塊壓迫第三對腦神經'; }
    else if (sz === 'dil') { t = re ? '放大、有反應' : '放大、無反應'; d = re ? '藥物（抗膽鹼、中樞興奮劑、腎上腺素促效劑如 dopamine）或非抽搐性癲癇' : '瀰漫性腦傷、低體溫 <28、擴張腫塊壓迫腦幹、顱內壓升高'; }
    else if (sz === 'mid') { t = re ? '中等、有反應' : '中等、無反應'; d = re ? '代謝性腦病變、鎮靜劑過量、神經肌肉阻斷劑' : '急性肝衰竭、缺氧後腦病變、腦死'; }
    else if (sz === 'small') { t = '小、有反應'; d = '代謝性腦病變'; }
    else { t = re ? '針尖、有反應' : '針尖、無反應'; d = re ? '鴉片過量' : '橋腦損傷'; }
    var h = row('瞳孔', t, '', uni || (!re && sz !== 'small') ? 'fl-hot' : 'fl-na', d, '');
    h += '<div class="rx-flag">自發眼動（共軛或不共軛）是中毒代謝性腦病變的非專一徵象；固定凝視偏向高度提示腫塊或癲癇。眼頭反射（頸椎不穩不做）：大腦半球受損而下腦幹完好，眼睛偏離轉頭方向；下腦幹受損（或清醒）眼睛跟著頭走。眼前庭反射：每耳 50 mL 冰水（先確認耳膜完整、無阻塞），腦幹完好雙眼緩慢偏向灌洗側；兩耳間隔 5 分鐘。昏迷對痛的反應是無目的或無：迴避＝有目的、不是昏迷。自發睜眼＝有覺醒、不是昏迷（閉鎖或植物狀態）。</div>';
    document.getElementById('c45pupil_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c45apnea', function () {
    var base = num('ap_b'), hrs = num('ap_h'), sbp = num('ap_s'), map = num('ap_m'), temp = num('ap_t'), ttm = val('ap_ttm') === 'y', sed = val('ap_sed') === 'y';
    var ok = !na(hrs) && hrs >= 48 && (na(map) ? (!na(sbp) && sbp >= 100) : map >= 75) && !na(temp) && temp > 36 && !sed;
    var h = row('前提', ok ? '符合' : '未全符合', '', ok ? 'fl-ok' : 'fl-warn', '腦傷 ≥48 小時；收縮壓 ≥100（MAP ≥75 更重要，高於一般 65 以對抗顱內壓）；體溫 >36' + (ttm ? '（TTM <36 者要維持 >36 至少 24 小時）' : '') + '；無中樞抑制藥影響（無血中濃度就等 5 個半衰期）', '兩次評估間隔 ≥12 小時；有經驗者一人即可');
    h += row('腦幹反射', '角膜、瞳孔光、眼頭、眼前庭、嘔吐、咳嗽全部消失才進行', '', 'fl-na', '', '');
    if (!na(base)) h += row('呼吸暫停試驗', '目標 PaCO₂ ≥' + fmt(base + 20, 0) + '（基線 +20）', 'mmHg', 'fl-warn', '約 3 mmHg/分 → 6–7 分鐘', '先 100% 氧預充、脫離呼吸器、氣管內給氧；結束抽血氣、接回呼吸器；PaCO₂ 升 1 正常人分鐘通氣多 2 L');
    h += row('危險', '去飽和、低血壓、嚴重心律不整', '', 'fl-na', '做不完就要確認性檢查', '不可接受的確認檢查：EEG、誘發電位、CTA、MRA');
    h += '<div class="rx-flag">死亡時間＝第二次血氣結果出來的時間；常再維持呼吸器讓家屬道別。Lazarus 徵象：腦死者脫離呼吸器後頭軀幹上肢短暫自發動作（頸髓神經元放電，可能因低氧）——宣告後出現會讓家屬不安。腦死多來自 TBI 與腦出血（顱內壓讓腦血流完全停止），非外傷性昏迷少見。</div><div class="note">原書表 45.6（腦死判定清單）在前提第二條截斷，依內文重建。</div>';
    document.getElementById('c45apnea_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch46 ================= */
  I.bindCalc('c46se', function () {
    var wt = num('se_w'), step = val('se_s'), long = val('se_l') === 'y';
    var h;
    if (step === '1') {
      h = row('Lorazepam', na(wt) ? '0.1 mg/kg（或 4 mg）IV 2 分' : fmt(Math.min(wt * 0.1, 4), 1) + ' mg IV 2 分', '', 'fl-hot', '首選；<2 分起效、持續 6–12 小時', '5 分後可重複一次');
      h += row('Midazolam', na(wt) ? '0.15 mg/kg（或 10 mg）IV 或 IM' : fmt(Math.min(wt * 0.15, 10), 1) + ' mg IV／IM', '', 'fl-na', 'IM 與 IV lorazepam 等效、沒有靜脈通路時用', 'Diazepam 從腦洗出快、復發多、不偏好');
    } else if (step === '2') {
      h = row('Levetiracetam', na(wt) ? '60 mg/kg（≤4,500）IV 5–15 分' : fmt(Math.min(wt * 60, 4500), 0) + ' mg IV 5–15 分', '', 'fl-warn', '三者等效（約半數終止）、副作用最少常被偏好', '維持 1,000 mg IV q12h；無低血壓、無呼吸抑制、無交互作用');
      h += row('Fosphenytoin', na(wt) ? '20 mg PE/kg（≤1,500）≤150 mg/min' : fmt(Math.min(wt * 20, 1500), 0) + ' mg PE，≤150 mg/min', '', 'fl-na', '水溶性前驅藥、無 propylene glycol、比 phenytoin 快 3 倍', '維持 100 mg PE q8h；肝衰竭轉換增加要監測濃度；phenytoin 有 CNS 毒性與 P450 交互作用');
      h += row('Valproic acid', na(wt) ? '40 mg/kg（≤3,000）IV 5–10 分' : fmt(Math.min(wt * 40, 3000), 0) + ' mg IV 5–10 分', '', 'fl-na', '等效、副作用少但不流行', '高血氨 40%（腦病變）');
    } else {
      h = row('先', '插管＋機械通氣、連續 EEG、照會神經重症', '', 'fl-hot', '10–15% 頑固；三者都壓呼吸', '無證據哪個較優、看熟悉度');
      h += row('Propofol', na(wt) ? '1–2 mg/kg bolus → 1 mg/kg/hr，最高 15（>48 小時 5）' : fmt(wt, 0) + '–' + fmt(wt * 2, 0) + ' mg → ' + fmt(wt, 0) + ' mg/hr，最高 ' + fmt(wt * (long ? 5 : 15), 0) + ' mg/hr', '', 'fl-warn', long ? '輸注 >48 小時上限 5 mg/kg/hr' : '', '');
      h += row('Midazolam', na(wt) ? '0.2 mg/kg → 0.2 mg/kg/hr，最高 4' : fmt(wt * 0.2, 0) + ' mg → ' + fmt(wt * 0.2, 0) + ' mg/hr，最高 ' + fmt(wt * 4, 0) + ' mg/hr', '', 'fl-na', '', 'Thiopental、phenobarbital、ketamine 也可');
    }
    h += '<div class="rx-flag">癲癇重積：≥5 分鐘連續或兩次之間沒恢復意識；>30 分鐘永久神經元傷害。1/3 對 BZD 無反應。死亡率：全身抽搐型達 21%、非抽搐型約 50%、頑固型達 61%。非抽搐性重積很難認：混亂 49%、昏迷 22%、嗜睡 21%、語言障礙 15%、肌陣攣 13%、怪異行為 11%——意識障礙的 ICU 病人連續 EEG 抓到 16%（間歇 4–8%），為意識障礙做的 EEG 37% 有。</div><div class="note">原書表 46.3 在 midazolam 列、46.4 在第三種藥截斷，依內文重建。</div>';
    document.getElementById('c46se_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c46mg', function () {
    var vc = num('mg_vc'), wt = num('mg_w'), mip = num('mg_mip'), dz = val('mg_d'), walk = val('mg_wk') === 'n';
    var vckg = vc / wt;
    var tube = (!na(vc) && (vc < 1000 || (!na(vckg) && vckg <= 15))) || (!na(mip) && mip > -20);
    var h = row('肺活量', na(vc) ? '—' : fmt(vc, 0) + ' mL' + (na(vckg) ? '' : '（' + fmt(vckg, 0) + ' mL/kg）'), '', na(vc) ? 'fl-na' : (vc < 1000 || vckg <= 15) ? 'fl-hot' : 'fl-ok', na(vc) ? '' : (vc < 1000 || vckg <= 15) ? '≤15 mL/kg 或 <1 L：認真考慮插管' : '', '惡化很快、別等到極端');
    h += row('最大吸氣壓', na(mip) ? '—' : fmt(mip, 0), 'cm H₂O', na(mip) ? 'fl-na' : mip > -20 ? 'fl-hot' : 'fl-ok', na(mip) ? '正常比 −100 更負' : mip > -20 ? '比 −20 弱：考慮插管' : '', 'BiPAP 只在幾天內預期改善時（通常不是）');
    h += row('插管', tube ? '應認真考慮' : '目前未達門檻，密切追蹤', '', tube ? 'fl-hot' : 'fl-na', '', '');
    if (dz === 'mg') {
      h += row('肌無力危象', 'IVIG 2 g/kg 分 2–5 天' + (na(wt) ? '' : '（共 ' + fmt(wt * 2, 0) + ' g）') + '，或血漿置換 5 次／7–10 天（每次 1–1.5 血漿量）', '', 'fl-warn', '兩者等效約 70% 有效；血漿置換較快（第 2 次就見效，IVIG 要 4–5 天）', '呼吸衰竭時停 pyridostigmine（分泌物）；高劑量 methylprednisolone 2 g × 2 天有爭議、對 IVIG 或置換有反應者不給');
      h += row('其他', '冰敷試驗（2 分鐘瞼裂增 2 mm；敏感度專一性 80%）、AChR 抗體（陰性 10–15% 驗 MuSK，其中 40% 陽性）、胸部顯影 CT 找胸腺瘤（10%）、吞嚥評估、enoxaparin 40 mg', '', 'fl-na', '眼肌一定受累、活動後加重、純運動、反射保留；危象 15–20%', '避免：aminoglycoside、fluoroquinolone、macrolide、β 阻斷劑、CCB、Ia 類、肌鬆劑、鎂、高劑量類固醇；住院存活 95%');
    } else if (dz === 'gbs') {
      h += row('GBS', walk ? '無法獨走或呼吸衰竭：IVIG 或血漿置換（同 MG 方案、指引無偏好）' : '仍可獨走：支持與監測', '', walk ? 'fl-warn' : 'fl-na', '感染後 1–3 週（Campylobacter、Zika、SARS-CoV-2）、對稱肢體無力＋感覺異常、反射減弱、自主神經不穩；呼吸衰竭 25%', '疼痛是神經病變性：gabapentin 300 mg tid，急性可用類鴉片；80% 自行緩解但殘疾常見、住院存活 97%、10–15% 重度殘疾');
    } else {
      h += row('重症多發神經病變／肌病變', '無治療；一半可完全恢復但要數月', '', 'fl-na', '嚴重敗血症、不動（肌鬆）、高血糖、類固醇＋肌鬆的氣喘；鬆弛性四肢與軀幹無力、反射減弱——常在脫離呼吸器失敗才發現', 'CIP 神經傳導感覺運動都慢；CIM 肌電圖肌病變、切片肌凝蛋白喪失＋發炎浸潤；本質是發炎性器官傷害');
    }
    document.getElementById('c46mg_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c46nmb', function () {
    var wt = num('nb_w'), ag = val('nb_a'), depth = val('nb_d');
    var h;
    if (ag === 'sux') { h = row('Succinylcholine', na(wt) ? '1–1.5 mg/kg' : fmt(wt, 0) + '–' + fmt(wt * 1.5, 0) + ' mg IV', '', 'fl-warn', '唯一去極化劑：1–1.5 分起效、7–12 分恢復——快速插管的常客', '血鉀升 ≤0.5；禁忌：高血鉀、惡性高熱、橫紋肌溶解、燒傷、脊髓損傷不動；心搏過緩'); }
    else if (ag === 'roc') { h = row('Rocuronium', na(wt) ? '1.0 mg/kg' : fmt(wt, 0) + ' mg IV', '', 'fl-warn', '1.5–3 分起效（1 mg/kg 與 succinylcholine 相當）、50–70 分', '輸注 5–12 μg/kg/min' + (na(wt) ? '' : '（' + fmt(wt * 5 * 60 / 1000, 1) + '–' + fmt(wt * 12 * 60 / 1000, 1) + ' mg/hr）') + '；無心血管作用；肝功能差延長；已取代 vecuronium'); h += row('拔不到管', 'Sugammadex ' + (na(wt) ? '16 mg/kg' : fmt(wt * 16, 0) + ' mg'), '', 'fl-hot', '2–3 分逆轉、比 succinylcholine 恢復還快', ''); }
    else { h = row('Cisatracurium', na(wt) ? '0.15–0.2 mg/kg' : fmt(wt * 0.15, 1) + '–' + fmt(wt * 0.2, 1) + ' mg IV', '', 'fl-warn', '5–7 分起效、35–50 分；輸注 1–3 μg/kg/min' + (na(wt) ? '' : '（' + fmt(wt * 1 * 60 / 1000, 1) + '–' + fmt(wt * 3 * 60 / 1000, 1) + ' mg/hr）'), '不釋放組織胺、無心血管作用、不受腎肝衰竭影響——ICU 首選'); }
    var sg = depth === 'deep' ? 4 : 2;
    h += row('逆轉', ag === 'cis' ? 'Neostigmine ≤70 μg/kg' + (na(wt) ? '' : '（' + fmt(wt * 0.07, 1) + ' mg）') : 'Sugammadex ' + sg + ' mg/kg' + (na(wt) ? '' : '（' + fmt(wt * sg, 0) + ' mg）') + '，2–3 分', '', 'fl-na', ag === 'cis' ? '恢復 8–45 分視情況；超過 70 μg/kg 副交感副作用' : (depth === 'deep' ? '深度阻斷 4 mg/kg' : '中度 2 mg/kg') + '；無膽鹼副作用', 'Sugammadex 只結合 aminosteroid（rocuronium 最緊、vecuronium 等效、pancuronium 差）');
    h += '<div class="rx-flag">用理想體重。監測：尺神經 2 Hz 四連刺激看拇指內收，目標 1–2 個抽動、完全沒有＝過度。用途：插管、低溫治療防抖、嚴重不同步。清醒但癱瘓既恐怖又痛苦：必須重鎮靜＋止痛，但沒有 EEG 無法評估——這就是要避免長時間肌鬆的主因；還有 CIM、墜積性肺炎、VTE、壓瘡。</div><div class="note">原書表 46.7 在腎功能列截斷。</div>';
    document.getElementById('c46nmb_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch47 ================= */
  I.bindCalc('c47bp', function () {
    var type = val('bp_t'), sbp = num('bp_s'), dbp = num('bp_d'), af = val('bp_af') === 'y';
    var tgt, note, high;
    if (type === 'isch') { high = !na(sbp) && (sbp > 220 || dbp > 120); tgt = '前 72 小時只在 >220/120 才降'; note = '24 小時內降幅 ≤15%；>60% 中風有高血壓，是維持半影區血流的生理反應（自動調節失靈）'; }
    else if (type === 'lytic') { high = !na(sbp) && (sbp >= 180 || dbp >= 105); tgt = '溶栓後 24 小時 <180/105'; note = '>180/105 是溶栓後出血的危險因子'; }
    else if (type === 'thromb') { high = !na(sbp) && (sbp >= 180 || dbp >= 105); tgt = '取栓後指引 <180/105；有些方案再灌流成功後目標正常（<140/90）'; note = '可用 metoprolol 5–10 mg IV q6h'; }
    else if (type === 'ich') { high = !na(sbp) && sbp >= 140; tgt = '收縮壓 <140'; note = '早期惡化＝血腫擴大：先逆轉抗血栓、再控血壓'; }
    else { high = !na(sbp) && sbp > 140; tgt = '收縮壓 ≤140（指引無目標；<140 再出血少見）'; note = '降壓不可增加心輸出量：labetalol；抗纖溶劑無效不用'; }
    var h = row('血壓', na(sbp) ? '—' : fmt(sbp, 0) + '/' + (na(dbp) ? '?' : fmt(dbp, 0)), 'mmHg', na(sbp) ? 'fl-na' : high ? 'fl-hot' : 'fl-ok', na(sbp) ? tgt : high ? '超過目標：' + tgt : '在目標內：' + tgt, note);
    if (high) {
      h += row('Labetalol', '10 mg IV bolus → 2–8 mg/min', '', 'fl-warn', 'α＋β；與 nicardipine 等效', '純 β 阻斷劑不建議（降心輸出量）');
      h += row('Nicardipine', '5 mg/hr → 每次 +2.5 到 15 mg/hr', '', 'fl-na', '與 labetalol 等效；clevidipine 與 nicardipine 等效', '<b>Nitroprusside 不用</b>：升顱內壓');
    }
    if (type === 'isch' || type === 'lytic' || type === 'thromb') h += row('低血壓', '立刻矯正：輸液（等張食鹽水；低白蛋白可用 5% albumin）＋ ' + (af ? 'phenylephrine（快速心房顫動）' : 'norepinephrine'), '', 'fl-warn', '自動調節失靈：目標比一般 MAP 65 高', '晶體促水腫是用膠體的理由');
    h += '<div class="rx-flag">氧：100% O₂ 讓腦血流降 15–30% 並產生活性氧；SaO₂ >94% 反而結局差——只在低血氧（<90）給氧、維持 90–92%。正壓通氣升顱內壓、降腦灌流壓，審慎用。</div><div class="note">原書表 47.1、47.2 在血糖與 clevidipine 列截斷，依內文重建。</div>';
    document.getElementById('c47bp_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c47cpp', function () {
    var map = num('cp_m'), icp = num('cp_i'), gcs = num('cp_g'), ivh = val('cp_v') === 'y', hern = val('cp_h') === 'y';
    var cpp = map - icp;
    var mon = (!na(gcs) && gcs <= 8) || ivh || hern;
    var h = row('ICP 監測指徵', mon ? '符合' : '不符', '', mon ? 'fl-warn' : 'fl-na', 'GCS ≤8、腦室內出血、經天幕疝脫證據（單側瞳孔放大）', '缺血性中風併腦水腫不建議 ICP 監測、看神經學徵象就好');
    if (!na(icp)) h += row('ICP', fmt(icp, 0), 'mmHg', icp >= 20 ? 'fl-hot' : 'fl-ok', icp >= 20 ? '≥20：引流腦脊髓液（腦室導管）' : '<20', '腦室內血常阻塞性水腦：腦室導管引流＋腦室內溶栓、兼監測');
    if (!na(cpp)) h += row('CPP', fmt(cpp, 0), 'mmHg', cpp < 50 ? 'fl-hot' : cpp > 70 ? 'fl-warn' : 'fl-ok', 'MAP − ICP；ICH 目標 50–70', '腦血流還受血管阻力與自動調節影響');
    h += '<div class="rx-flag">ICH 占中風 10–15%（高血壓、抗凝）：30 天死亡一半、存活者 2/3 重度缺損。其他：血糖同缺血性中風；DVT 預防入院就開始（前 24 小時用間歇加壓，之後看穩定度用 heparin）；不預防癲癇但一週內 15% 有症狀性癲癇要 levetiracetam；意識障礙者連續 EEG 24–36 小時找非抽搐性重積；多數要照會神經外科。</div>';
    document.getElementById('c47cpp_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c47rev', function () {
    var ag = val('rv_a'), wt = num('rv_w'), inr = num('rv_i'), dose = num('rv_d'), hrs = num('rv_h'), fib = num('rv_f');
    var h;
    if (ag === 'warf') { h = row('Warfarin', 'Vitamin K 10 mg IV ＋ 4-factor PCC（依 INR 給量）', '', 'fl-hot', '4F-PCC 30 分內 INR 正常化 60%（FFP 只 9%）、體積小', 'Vitamin K 2 小時起效、24 小時最大'); if (!na(inr)) h += row('INR', fmt(inr, 1), '', inr >= 1.5 ? 'fl-warn' : 'fl-ok', '', ''); h += '<div class="note">原書表 47.4 的 4F-PCC 依 INR 劑量表在「dosing as follows」後截斷，未能取得。</div>'; }
    else if (ag === 'dabi') { h = row('Dabigatran', 'Idarucizumab 2.5 g IV bolus，15 分內再 2.5 g', '', 'fl-hot', '單株抗體、10–30 分逆轉', '沒有 idarucizumab：高劑量 4F-PCC 50 IU/kg' + (na(wt) ? '' : '（' + fmt(wt * 50, 0) + ' IU）') + '，經驗少'); h += '<div class="kbox alert"><div class="kbox-t">原文疑義</div>原書表 47.4 印成 idarucizumab「2.5 <b>mg</b>」；仿單與本章引用的指引都是 2.5 <b>g</b> × 2（共 5 g），本頁依後者。</div>'; }
    else if (ag === 'xa') {
      var highD = (!na(dose) && dose > 5) || (!na(hrs) && hrs < 8) || na(hrs);
      h = row('Apixaban／rivaroxaban', 'Andexanet alfa ' + (highD ? '高劑量：800 mg bolus（30 mg/min）→ 8 mg/min × 120 分' : '低劑量：400 mg bolus（30 mg/min）→ 4 mg/min × 120 分'), '', 'fl-hot', highD ? '末次 apixaban >5 mg 或 rivaroxaban >10 mg、或距末次 <8 小時或不明' : '末次 apixaban ≤5 mg 或 rivaroxaban ≤10 mg，且距末次 ≥8 小時', '10 分鐘抗 Xa 活性降 90%、12 小時止血恢復；10% 發生 VTE');
      h += row('替代', '4F-PCC 50 IU/kg' + (na(wt) ? '' : '（' + fmt(wt * 50, 0) + ' IU）'), '', 'fl-na', '沒有 andexanet 時', '');
      h += '<div class="note">原書表 47.5 高劑量方案在「Start with IV bol」截斷，高劑量數字依本章引用的 NCS/SCCM 指引補上。</div>';
    }
    else if (ag === 'plt') { h = row('Aspirin／clopidogrel', 'Desmopressin', '', 'fl-warn', '不可逆抑制血小板 7–10 天；desmopressin 促內皮釋放 vWF 拮抗', ''); }
    else { h = row('溶栓後出血', 'Cryoprecipitate 10 U' + (na(fib) ? '' : fib < 200 ? '，纖維蛋白原 ' + fmt(fib, 0) + ' <200 可重複' : ''), '', 'fl-hot', '要解凍、延遲 ≥20 分；纖維蛋白原濃縮劑更好（免解凍、濃度固定 20 g/L）', '沒有 cryo：tranexamic acid 1,000 mg IV 10 分'); h += row('照會', '神經外科（減壓開顱）', '', 'fl-na', '溶栓後症狀性 ICH 6.4–8.8%：高齡、血壓 >180/105、梗塞 >1/3 半球', '溶栓後 24 小時 ICU 或中風單位、抗凝抗血小板停 24 小時'); }
    document.getElementById('c47rev_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c47misc', function () {
    var glu = num('ms_g'), spo2 = num('ms_o'), temp = num('ms_t'), day = num('ms_d'), sah = val('ms_sah') === 'y', gdrop = num('ms_gd');
    var h = row('血糖', na(glu) ? '—' : fmt(glu, 0), 'mg/dL', na(glu) ? 'fl-na' : glu > 180 ? 'fl-warn' : 'fl-ok', na(glu) ? '>180 才治、目標 140–180' : glu > 180 ? '>180：治療、目標 140–180' : '不需治', '30–50% 前 24 小時高血糖、傷神經恢復（乳酸、活性氧、血腦障壁）；暫時性所以嚴格控制反而低血糖；避免含糖輸液');
    h += row('SpO₂', na(spo2) ? '—' : fmt(spo2, 0) + '%', '', na(spo2) ? 'fl-na' : spo2 < 90 ? 'fl-warn' : spo2 > 94 ? 'fl-warn' : 'fl-ok', na(spo2) ? '' : spo2 < 90 ? '低血氧：給氧到 90–92' : spo2 > 94 ? '>94 結局較差：調低到 90–92' : '90–92 剛好', '指引寫「只在低血氧給氧」又寫「維持 >94」自相矛盾——作者取 90–92');
    h += row('體溫', na(temp) ? '—' : fmt(temp, 1) + '°C', '', na(temp) ? 'fl-na' : temp >= 38 ? 'fl-hot' : 'fl-ok', na(temp) ? '' : temp >= 38 ? '前 24–48 小時的燒要立刻降（acetaminophen）、並找感染' : '', '中風發燒達 60%、傷恢復與存活；TTM 不改善結局；SAH 壓燒也未改善結局');
    h += row('每日常規', 'Aspirin 325 mg（溶栓者第 2 天起）；LMWH（溶栓者前 24 小時間歇加壓）', '', 'fl-na', '每治療 100 人少 1 次早期復發；不建議抗凝', 'PE 只 0.4% 但仍要預防');
    if (sah) {
      h += row('SAH：nimodipine', '60 mg PO q4h × 3 週', '', 'fl-warn', '減少神經缺損、不改善存活；IV 不用（低血壓）', '動脈瘤 3 天內處理結局較好、別拖過 7–10 天；VTE 達 25%，修補後 enoxaparin 40 mg 安全');
      h += row('遲發性腦缺血', na(day) ? '第 4–14 天' : (day >= 4 && day <= 14) ? '第 ' + fmt(day, 0) + ' 天：DCI 時窗' : '第 ' + fmt(day, 0) + ' 天：不在典型時窗', '', (!na(day) && day >= 4 && day <= 14) ? 'fl-hot' : 'fl-na', (!na(gdrop) && gdrop >= 2) ? 'GCS 掉 ' + fmt(gdrop, 0) + '：DCI 徵象——CTA 或經顱都卜勒（敏感度約 90%）' : '新局部缺損或 GCS 掉 2 分', '1/3 發生（血管痙攣＋血栓）；嚴重用動脈內血管擴張劑或血管成形術');
    }
    h += '<div class="rx-flag">缺血性中風 85%（20% 栓塞，少數經卵圓孔）；心臟超音波指徵：疑栓塞、心房顫動、透壁 MI、血液培養陽性、VTE 史或隱源性（<55 歲）——氣泡試驗：10 mL 攪動食鹽水快速注入，幾個心動週期後左心出現氣泡＝右到左分流；TEE 最敏感但 TTE 先。腦水腫用高張食鹽水（bolus 優於持續、目標 Na 145–155；mannitol 較差）、不改結局。中風後一週 20% 癲癇、1/4 復發：levetiracetam 並出院後續用；不預防。作者結語：每年 795,000 中風、7% 接受再灌流、1/9 獲益 → 0.8%。</div><div class="note">原書表 47.3（高張食鹽水配方）只剩標題。</div>';
    document.getElementById('c47misc_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch45 意識改變 */
  var cs = { eye: null, aware: null, foc: null };
  window.csPick = function (k, v, btn) { flowSelect(btn); cs[k] = v; csRender(); };
  function csRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (cs.eye === 'yes') {
      if (cs.aware === 'yes') { cls = 'rec-elective'; t = '可喚醒、有覺察：焦慮、嗜睡、譫妄（波動）、失智（持續）、精神病，或閉鎖狀態（只剩上下眼動與眨眼）'; d = '<li>譫妄用 CAM-ICU；ICU 誘因：鎮靜（BZD）、休克、腦病變（缺血、敗血、代謝）、藥物過量或戒斷。</li><li>閉鎖＝腹側橋腦雙側運動路徑受損、意識完整。</li>'; }
      else if (cs.aware === 'no') { cls = 'rec-elective'; t = '有覺醒（睜眼）、無覺察：植物狀態（一個月後稱持續性）'; d = '<li>自發動作與對深痛的反應可有、但無目的。</li><li>非抽搐性癲癇是常被忽略的意識障礙原因——考慮連續 EEG。</li>'; }
      else { cls = 'rec-elective'; t = '有覺醒：有覺察嗎？'; d = '<li>請回答第 2 步。</li>'; }
    } else if (cs.eye === 'no') {
      if (cs.foc === 'yes') { cls = 'rec-urgent'; t = '昏迷＋局部運動缺損（偏癱、反射不對稱）或固定凝視：占位病灶或局部腦／脊髓損傷——影像'; d = '<li>單側瞳孔放大固定＝第三對腦神經受壓（擴張中的腫塊）。</li><li>幕上腫塊經天幕疝脫、後顱窩腫塊直接壓腦幹、腦幹中風。</li>'; }
      else if (cs.foc === 'no') { cls = 'rec-urgent'; t = '昏迷、無局部徵象：瀰漫性缺氧缺血、中毒代謝性腦病變（含藥物過量）、非抽搐性重積'; d = '<li>瞳孔：中等有反應＝代謝或鎮靜劑；針尖有反應＝鴉片；放大無反應＝瀰漫腦傷或顱內壓。</li><li>自發眼動＝中毒代謝；肌陣攣可以是瀰漫失能或肌陣攣性癲癇；鬆弛＝瀰漫腦傷或腦幹。</li><li>連續 EEG；GCS ≤8 考慮插管。</li>'; }
      else { cls = 'rec-elective'; t = '無法喚醒、無覺察：昏迷（自發睜眼就不是昏迷）——有局部徵象嗎？'; d = '<li>請回答第 3 步。木僵＝難喚醒、部分覺察。</li>'; }
    }
    if (cs.eye) n = '腦死＝昏迷＋全部腦幹功能喪失（腦神經反射、自主呼吸）＋不可逆；持續昏迷或植物狀態的家屬溝通與照護同等重要。';
    flowRec('cs_rec', cls, t, d, n);
  }
  window.csReset = function () { cs = { eye: null, aware: null, foc: null }; selAll('#cs_flow'); csRender(); };

  /* Ch46 無力症候群 */
  var wk = { eye: null, ref: null };
  window.wkPick = function (k, v, btn) { flowSelect(btn); wk[k] = v; wkRender(); };
  function wkRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (wk.eye === 'yes') { cls = 'rec-urgent'; t = '眼肌受累（複視、眼瞼下垂）、活動後加重、反射保留：肌無力——冰敷試驗、AChR／MuSK 抗體；VC ≤15 mL/kg 或 MIP 弱於 −20 就插管；危象用血漿置換（較快）或 IVIG 2 g/kg'; d = '<li>15% 只有眼肌；純運動；胸腺瘤 10%（顯影 CT）。</li><li>停 pyridostigmine（分泌物）；避免 aminoglycoside、fluoroquinolone、macrolide、β 阻斷劑、CCB、Ia 類、鎂、肌鬆劑。</li>'; }
    else if (wk.eye === 'no') {
      if (wk.ref === 'low') {
        if (wk.ctx === 'inf') { cls = 'rec-urgent'; t = '感染後 1–3 週、對稱肢體無力＋感覺異常、反射減弱、自主神經不穩、神經傳導慢、CSF 蛋白高：Guillain–Barré——無法獨走或呼吸衰竭用 IVIG 或血漿置換'; d = '<li>Miller Fisher 變型有眼肌麻痺＋失調。</li><li>疼痛 gabapentin 300 mg tid（急性可類鴉片）；VC／MIP 監測及早插管。</li>'; }
        else if (wk.ctx === 'icu') { cls = 'rec-elective'; t = '嚴重敗血症、不動、高血糖之後、脫離呼吸器失敗才發現：重症多發神經病變／肌病變——無治療、一半數月後完全恢復'; d = '<li>CIP：神經傳導感覺運動都慢；CIM：肌電圖肌病變、切片肌凝蛋白喪失。</li><li>兩者都是全身發炎的器官傷害；早期活動與營養未經驗證。</li>'; }
        else { cls = 'rec-elective'; t = '反射減弱或消失：情境？'; d = '<li>請回答第 3 步。</li>'; }
      } else if (wk.ref === 'normal') { cls = 'rec-elective'; t = '反射正常、無眼肌受累：想藥物性麻痺殘留（sugammadex／neostigmine 逆轉）、電解質（鉀、磷、鎂）、脊髓或中樞病灶'; d = '<li>四連刺激看阻斷深度。</li>'; }
      else { cls = 'rec-elective'; t = '無眼肌受累：深腱反射？'; d = '<li>請回答第 2 步。</li>'; }
    }
    if (wk.eye) n = '神經肌肉無力都要 VTE 預防（enoxaparin 40 mg）與吞嚥評估。';
    flowRec('wk_rec', cls, t, d, n);
  }
  window.wkPick2 = function (v, btn) { flowSelect(btn); wk.ctx = v; wkRender(); };
  window.wkReset = function () { wk = { eye: null, ref: null, ctx: null }; selAll('#wk_flow'); wkRender(); };

  /* Ch47 中風型別的第一優先 */
  var st = { type: null, anti: null };
  window.stPick = function (k, v, btn) { flowSelect(btn); st[k] = v; stRender(); };
  function stRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (st.type === 'isch') { cls = 'rec-elective'; t = '缺血性（85%）：血壓只在 >220/120 才降（溶栓／取栓後 <180/105）、SaO₂ 90–92、血糖 140–180、壓燒、aspirin 325、LMWH；溶栓後 24 小時盯出血'; d = '<li>心臟超音波指徵：疑栓塞、心房顫動、透壁 MI、血液培養陽性、VTE 史或 <55 歲隱源性（氣泡試驗找 PFO）。</li><li>腦水腫惡化：高張食鹽水（Na 145–155）；不監測 ICP。</li>'; }
    else if (st.type === 'ich') {
      if (st.anti === 'yes') { cls = 'rec-urgent'; t = 'ICH 併抗血栓：立刻逆轉——warfarin 用 vitamin K ＋ 4F-PCC；dabigatran 用 idarucizumab；apixaban／rivaroxaban 用 andexanet（或 4F-PCC 50 IU/kg）；抗血小板用 desmopressin'; d = '<li>之後收縮壓 <140、ICP 指徵（GCS ≤8、腦室內血、疝脫）、CPP 50–70、照會神經外科。</li>'; }
      else if (st.anti === 'no') { cls = 'rec-urgent'; t = 'ICH：收縮壓 <140；ICP 監測指徵 GCS ≤8、腦室內血、疝脫；ICP <20、CPP 50–70；連續 EEG；照會神經外科'; d = '<li>DVT 預防先間歇加壓；不預防癲癇、有癲癇 levetiracetam。</li>'; }
      else { cls = 'rec-elective'; t = 'ICH（10–15%；早期惡化＝血腫擴大）：有抗血栓藥嗎？'; d = '<li>請回答第 2 步。</li>'; }
    } else if (st.type === 'sah') { cls = 'rec-urgent'; t = 'SAH：逆轉抗血栓、收縮壓 ≤140（labetalol）、3 天內處理動脈瘤、nimodipine 60 mg q4h × 3 週、第 4–14 天盯遲發性腦缺血、ICP 與水腦引流、VTE 預防'; d = '<li>25% 到院前死亡、住院再 20%、6 個月一半死亡或殘疾；平均 55 歲。</li><li>抗纖溶劑無效；低血鈉 35%（可能腦性鹽耗）；ARDS 與 AKI 常伴隨。</li>'; }
    if (st.type) n = '三型共同：nitroprusside 不用（升 ICP）；高血糖與發燒都傷神經恢復。';
    flowRec('st_rec', cls, t, d, n);
  }
  window.stReset = function () { st = { type: null, anti: null }; selAll('#st_flow'); stRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_consc', 'neuro-consc', [
    { q: '意識的兩個成分與植物狀態、閉鎖狀態的差別？', o: ['都一樣', '覺醒（可喚醒）與覺察；植物狀態有覺醒無覺察，閉鎖狀態兩者完整只剩上下眼動與眨眼（腹側橋腦雙側損傷）', '閉鎖是昏迷', '植物狀態不能睜眼'], a: 1, why: '昏迷＝無覺醒無覺察；腦死再加全部腦幹功能喪失且不可逆；自發睜眼就不是昏迷。' },
    { q: 'ICU 譫妄最常見的型？', o: ['高活動型', '低活動型（嗜睡）——常被漏，因為誤以為譫妄就是躁動', '混合型', '精神病型'], a: 1, why: '25–50%；CAM-ICU 篩檢；與失智的差別是急性、波動；BZD 是主要促發者。沒有藥能預防或治療，藥只為平靜（dexmedetomidine 首選）。' },
    { q: '酒精戒斷的癲癇怎麼處理？', o: ['Phenytoin', 'Lorazepam 2 mg IV push（防再發）；phenytoin 不建議', '不用處理', 'Levetiracetam'], a: 1, why: '6–48 小時、24 小時高峰、可單獨出現。DT 約 5%、48–96 小時起、3–5 天；BZD 抗性（3–4 小時 30–40 mg lorazepam）加 propofol（插管者）或 phenobarbital 130–260 mg q15–20 分。' },
    { q: '酒癮病人入院幾天後突然惡化、BZD 壓不住？', o: ['加倍 BZD', '想 Wernicke（葡萄糖負荷耗盡 thiamine，100 mg/天不夠治）與 gabapentin 戒斷（BZD 無效、恢復 gabapentin 就好）', '一定是 DT', '插管'], a: 1, why: '譫妄 >5 天也要想別的原因；眼震與眼肌麻痺少見。Lorazepam 輸注 ≥0.1 mg/kg/hr 別超過 48 小時（propylene glycol）。' },
    { q: '針尖瞳孔有反應 vs 無反應？', o: ['都是鴉片', '有反應＝鴉片過量、無反應＝橋腦損傷；中等無反應＝急性肝衰竭、缺氧後、腦死；放大有反應＝抗膽鹼／興奮劑／dopamine 或非抽搐性癲癇', '都是腦幹', '無意義'], a: 1, why: '眼頭反射：半球受損腦幹完好時眼睛偏離轉頭方向；眼前庭：50 mL 冰水、雙眼緩慢偏向灌洗側。' },
    { q: '呼吸暫停試驗的目標與速率？', o: ['PaCO₂ >60 就好', 'PaCO₂ 比基線升 ≥20，約 3 mmHg/分所以 6–7 分鐘；先 100% 氧預充、脫離呼吸器氣管內給氧', '5 分鐘就夠', '不需血氣'], a: 1, why: '前提：≥48 小時、收縮壓 ≥100／MAP ≥75、>36°C（TTM 後 24 小時）、無鎮靜（5 個半衰期）；兩次評估間隔 ≥12 小時；不可接受的確認檢查是 EEG、誘發電位、CTA、MRA；死亡時間是第二次血氣出來的時間。' }
  ]);
  I.renderQuiz('qz_move', 'neuro-move', [
    { q: '癲癇重積的定義？', o: ['任何 >1 分鐘的抽搐', '≥5 分鐘連續發作、或兩次之間沒恢復意識；>30 分鐘永久傷害', '三次以上', '只有全身抽搐型'], a: 1, why: '非抽搐性重積表現混亂 49%、昏迷 22%、嗜睡 21%——ICU 意識障礙連續 EEG 抓到 16%；死亡率抽搐型 21%、非抽搐 50%、頑固 61%。' },
    { q: '重積第一線與沒有靜脈通路時？', o: ['Diazepam IV', 'Lorazepam 0.1 mg/kg（4 mg）IV 2 分、可重複一次；沒有通路 midazolam 0.15 mg/kg（10 mg）IM 等效', 'Phenytoin', 'Propofol'], a: 1, why: 'Diazepam 從腦洗出快、復發多。1/3 對 BZD 無反應 → levetiracetam 60 mg/kg（≤4,500）、fosphenytoin 20 mg PE/kg（≤1,500、≤150 mg/min）、valproate 40 mg/kg（≤3,000）等效。' },
    { q: '頑固重積（10–15%）？', o: ['再給 BZD', '先插管＋連續 EEG，麻醉劑量 propofol（1–2 mg/kg → 1 mg/kg/hr 到 15、>48 小時 5）或 midazolam（0.2 → 0.2 mg/kg/hr 到 4）；照會神經重症', '等它停', '只用 levetiracetam'], a: 1, why: '無證據哪個較優。Valproate 高血氨 40%；fosphenytoin 肝衰竭轉換增加。' },
    { q: '肌無力何時插管？', o: ['PaCO₂ >50', '肺活量 ≤15 mL/kg（<1 L）或最大吸氣壓弱於 −20 cm H₂O（正常比 −100 更負）——惡化很快、別等極端；BiPAP 只在幾天內預期改善', 'SpO₂ <90', '等呼吸停止'], a: 1, why: '危象 15–20%；血漿置換（第 2 次見效）優於 IVIG 2 g/kg（4–5 天），皆 70% 有效；停 pyridostigmine；高劑量類固醇有爭議。' },
    { q: 'GBS 與 MG 怎麼分？', o: ['都一樣', 'GBS：無眼肌受累、無疲勞性、反射減弱、自主神經不穩、神經傳導慢、CSF 蛋白高；MG 相反', 'GBS 有複視', 'MG 反射消失'], a: 1, why: 'GBS 感染後 1–3 週（Campylobacter、Zika、SARS-CoV-2）、呼吸衰竭 25%、80% 自癒；無法獨走或呼吸衰竭 IVIG 或血漿置換等效；疼痛 gabapentin 300 tid。' },
    { q: 'Succinylcholine 的禁忌與替代？', o: ['沒有禁忌', '高血鉀、惡性高熱、橫紋肌溶解、燒傷、脊髓損傷不動（致命高血鉀）；替代 rocuronium 1 mg/kg（起效相當）、拔不到管用 sugammadex 16 mg/kg 2–3 分逆轉', '只有腎衰竭', '用 cisatracurium 插管'], a: 1, why: 'Cisatracurium 5–7 分起效、不受腎肝影響、ICU 首選；neostigmine ≤70 μg/kg 恢復 8–45 分；sugammadex 深度 4、中度 2 mg/kg。用理想體重；四連刺激目標 1–2 個抽動；避免長時間肌鬆。' }
  ]);
  I.renderQuiz('qz_stroke', 'neuro-stroke', [
    { q: '缺血性中風的氧氣目標？', o: ['SaO₂ >98', '只在低血氧（<90）給氧，維持 90–92：100% O₂ 讓腦血流降 15–30% 並產生活性氧，>94% 結局較差', '一律高流量', '>94 才安全'], a: 1, why: '指引「只在低血氧給氧」與「維持 >94」自相矛盾，作者取 90–92。正壓通氣升 ICP 審慎用。' },
    { q: '未溶栓的缺血性中風何時降壓？', o: ['>140/90', '前 72 小時只在 >220/120（左心衰竭等例外），24 小時降幅 ≤15%；溶栓／取栓後 <180/105 24 小時', '>160/100', '一律降到正常'], a: 1, why: '高血壓 >60%、是維持半影區的生理反應（自動調節失靈）。Labetalol 10 mg → 2–8 mg/min 與 nicardipine 5→15 mg/hr 等效；純 β 阻斷劑不建議；nitroprusside 升 ICP 不用。' },
    { q: '溶栓後 5 小時意識惡化？', o: ['再溶栓', '症狀性 ICH（6.4–8.8%）：cryoprecipitate 10 U（纖維蛋白原 <200 重複；濃縮劑更好）、沒有 cryo 用 TXA 1 g、照會神經外科', '給 heparin', '降溫'], a: 1, why: '危險因子高齡、>180/105、>1/3 半球；溶栓後 24 小時停抗凝抗血小板。' },
    { q: 'ICH 的抗凝逆轉？', o: ['FFP 就好', 'Warfarin：vitamin K 10 mg ＋ 4F-PCC（30 分 INR 正常 60% vs FFP 9%）；dabigatran：idarucizumab；apixaban／rivaroxaban：andexanet（低／高劑量看末次劑量與時間；VTE 10%）或 4F-PCC 50 IU/kg；抗血小板：desmopressin', 'Protamine', '等它自己消'], a: 1, why: 'ICH 早期惡化＝血腫擴大；之後收縮壓 <140；ICP 監測指徵 GCS ≤8、腦室內血、疝脫，ICP <20、CPP 50–70。' },
    { q: 'SAH 的四個時間點？', o: ['沒有', '收縮壓 ≤140 防再出血；3 天內處理動脈瘤（別拖過 7–10 天）；nimodipine 60 mg q4h × 3 週；第 4–14 天遲發性腦缺血（GCS 掉 2、CTA／TCD 90%）', '只要開刀', '只要 nimodipine'], a: 1, why: '25% 到院前死亡、6 個月一半死亡或殘疾；抗纖溶劑無效；VTE 25%（修補後 enoxaparin 40 安全）；壓燒不改善結局；低血鈉 35%。' },
    { q: '中風後血糖與發燒？', o: ['血糖不重要', '血糖 >180 才治、目標 140–180（暫時性、太嚴會低血糖）、避含糖輸液；前 24–48 小時的燒要立刻降並找感染，但 TTM 不改善結局', '血糖目標 80–110', '發燒不用管'], a: 1, why: '高血糖 30–50%、發燒達 60%，都傷神經恢復；作者結語：只有 0.8% 的中風從再灌流獲益。' }
  ]);
})();
