/* ICU Book · Section XIII 體溫異常 — 計算器、決策流程、章末測驗
 * 來源：Marino's The ICU Book 5e, Ch 43–44（數字改寫自內文）。 */
(function () {
  'use strict';
  var I = window.ICU, num = I.num, val = I.val, fmt = I.fmt, row = I.row;
  function selAll(sel) { document.querySelectorAll(sel + ' .flow-opt').forEach(function (b) { b.classList.remove('selected'); }); }
  function na(x) { return !isFinite(x); }

  /* ================= Ch43 ================= */
  I.bindCalc('c43heat', function () {
    var t = num('ht_t'), cns = val('ht_cns') === 'y', sweat = val('ht_sw') === 'y', hd = val('ht_hd') === 'y', ex = val('ht_ex') === 'y';
    var stroke = (!na(t) && t >= 41) || cns || hd;
    var h = row('體溫', na(t) ? '—' : fmt(t, 1), '°C', na(t) ? 'fl-na' : t >= 41 ? 'fl-hot' : t >= 38 ? 'fl-warn' : 'fl-ok', na(t) ? '' : t >= 41 ? '≥41：熱中暑範圍' : t >= 38 ? '38–39：熱衰竭範圍' : '', '高體溫（調節失靈）不是發燒（正常調節、設定點升）：退燒藥無效');
    h += row('判定', stroke ? '熱中暑' : '熱衰竭', '', stroke ? 'fl-hot' : 'fl-warn', stroke ? '中樞失能、血行動力不穩、多器官（橫紋肌溶解、AKI、DIC、缺血性肝炎）' + (sweat ? '；仍有汗（無汗典型但非必然）' : '；無汗') : '類流感、肌肉痙攣、脫水但血行動力穩、意識清', ex ? '運動型較嚴重、多器官失能較多' : '古典型與環境溫度相關');
    if (stroke) {
      var mins = na(t) ? NaN : (t - 38) / 0.3;
      h += row('目標', '降到 38°C', '', 'fl-hot', '體積復甦＋主動降溫', '');
      h += row('現場', '冷水／冰水浸泡；沒有就噴水＋風扇蒸發', '', 'fl-na', '蒸發法約 0.3°C/分', na(mins) ? '' : '估 ' + fmt(mins, 0) + ' 分鐘到 38（熱而乾的天氣最有效）');
      h += row('急診', '鼠蹊腋下冰袋、上胸頸部覆冰、全身降溫毯', '', 'fl-na', '缺點：發抖反而升溫', '');
      h += row('內部', '4°C 食鹽水輸注；血管內降溫裝置更快', '', 'fl-na', '裝置需中心靜脈、結局未證實', '');
    } else h += row('處置', '補體積、冷氣房', '', 'fl-na', '不需主動降溫', '汗流失可高血鈉，只補水可低血鈉');
    h += '<div class="rx-flag">人體靜止每小時產熱可升 1°C，靠皮膚對流（血流、風）與蒸發散熱：每公升汗蒸發帶走 580 kcal（約每日產熱 1/4），大汗 1–2 L/hr 每小時可散 >1,000 kcal——汗要蒸發才散熱，擦掉沒用。</div>';
    document.getElementById('c43heat_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c43ck', function () {
    var ck = num('ck_v'), uln = num('ck_u') || 200, ctx = val('ck_c');
    var x = ck / uln;
    var h = row('CK', na(ck) ? '—' : fmt(ck, 0) + '（×' + fmt(x, 1) + ' ULN）', 'U/L', na(ck) ? 'fl-na' : x >= 5 ? 'fl-hot' : 'fl-ok', na(ck) ? '' : x >= 5 ? '≥5 倍：橫紋肌溶解' : '未達 5 倍', '沒有標準切點、5 倍是建議值；後果是無力與肌紅蛋白的 AKI（第 34 章）');
    if (ctx === 'nms') h += row('NMS vs 張力異常', na(ck) ? '—' : ck > 1000 ? 'CK >1,000：偏 NMS' : 'CK 只輕微升高：偏張力異常反應', '', na(ck) ? 'fl-na' : ck > 1000 ? 'fl-hot' : 'fl-na', '早期 NMS 可能只有僵硬', '');
    if (ctx === 'ss') h += row('血清素症候群', '橫紋肌溶解 15%、多與僵硬同時', '', 'fl-na', '', '');
    h += '<div class="rx-flag">高體溫症候群（熱中暑、MH、NMS、SS）都常見橫紋肌溶解；監測鉀與腎功能、積極輸液。</div>';
    document.getElementById('c43ck_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c43drug', function () {
    var wt = num('dr_w'), syn = val('dr_s'), sev = val('dr_sev') === 'y';
    var h = row('第一步', '立刻停誘發藥物', '', 'fl-hot', syn === 'nms' ? '若是停多巴胺藥誘發：立刻恢復、之後再慢減' : '', syn === 'mh' ? '停吸入麻醉劑與 succinylcholine' : syn === 'ss' ? '多半停藥＋支持幾天內緩解' : '');
    if (syn === 'mh') {
      h += row('Dantrolene', na(wt) ? '1–2 mg/kg 快速 IV' : fmt(wt, 0) + '–' + fmt(wt * 2, 0) + ' mg 快速 IV', '', 'fl-hot', '阻斷肌漿網釋鈣；早給死亡率 ≥70% → ≤10%', '副作用：無力（握力，停藥 2–4 天恢復）；肝毒性只在口服數月');
      h += row('其他', '控制僵硬體溫就降、通常不需主動降溫', '', 'fl-na', '自主神經不穩或橫紋肌溶解要積極輸液；防高血鉀與 AKI', '存活者戴警示手環、告知一等親（體染色體顯性）');
      h += '<div class="note">原書表 43.2 的 dantrolene 方案在「1–2 mg/kg 快速 IV」後截斷，重複劑量與上限依原書未能取得。</div>';
    } else if (syn === 'nms') {
      h += row('Bromocriptine', '10 mg PO tid', '', 'fl-warn', '多巴胺促效劑；僵硬幾小時內開始改善、完整反應要數天', '副作用低血壓、幻覺');
      if (sev) { h += row('Dantrolene', na(wt) ? '1 mg/kg IV q8h' : fmt(wt, 0) + ' mg IV q8h', '', 'fl-hot', '到症狀緩解或累積 ' + (na(wt) ? '10 mg/kg' : fmt(wt * 10, 0) + ' mg'), '之後口服 50–200 mg/天分 3–4 次；試驗結果不一致'); }
      h += row('療程', '緩解後續 10 天；長效針劑 2–3 週', '', 'fl-na', '神經抑制劑清除慢', '');
      h += row('一般', '輸液（橫紋肌溶解、低血壓）、必要時外部降溫、VTE 預防必做、躁動用 BZD', '', 'fl-na', '控制僵硬通常體溫就降', 'DVT 風險升高');
    } else if (syn === 'ss') {
      h += row('Cyproheptadine', '12 mg → 2 mg q2h（持續症狀）→ 維持 8 mg q6h', '', sev ? 'fl-warn' : 'fl-na', '血清素拮抗劑、只有口服（磨碎鼻胃管）', '鎮靜反而幫躁動；嚴重才需要');
      if (sev) h += row('頑固僵硬', '非去極化肌鬆（rocuronium）', '', 'fl-hot', '嚴重僵硬與橫紋肌溶解不改善時', '');
      h += row('一般', '同 NMS：輸液、降溫、VTE 預防、BZD', '', 'fl-na', '多數幾天內緩解', '');
    }
    document.getElementById('c43drug_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c43hypo', function () {
    var t = num('hy_t'), tube = val('hy_tube') === 'y', arrest = val('hy_arr') === 'y';
    var sev = na(t) ? '' : t < 24 ? 'fatal' : t < 28 ? 'severe' : t < 32 ? 'mod' : t < 35 ? 'mild' : 'none';
    var L = { fatal: ['<24：預期呼吸停止與心搏停止', 'fl-hot'], severe: ['重度 <28：昏迷、瞳孔放大固定、低血壓、嚴重心搏過緩、寡尿、水腫；VF／asystole 風險', 'fl-hot'], mod: ['中度 28–31.9：嗜睡、發抖減少或消失、心搏與呼吸變慢', 'fl-warn'], mild: ['輕度 32–35：混亂、皮膚冷白、發抖明顯、心搏快血壓可高', 'fl-warn'], none: ['≥35 不算低體溫', 'fl-ok'] };
    var h = row('核心溫度', na(t) ? '—' : fmt(t, 1), '°C', na(t) ? 'fl-na' : L[sev][1], na(t) ? '' : L[sev][0], '要量核心（膀胱、食道、直腸）；口腔腋下顳動脈耳溫都不行');
    if (sev && sev !== 'none') {
      h += row('復溫', sev === 'mild' ? '被動（脫濕衣、蓋毯）或主動外部' : sev === 'mod' ? '主動外部（加熱墊、暖風系統）' : '主動外部無效就內部復溫', '', 'fl-na', sev === 'mild' ? '多數夠用' : '', '');
      if (sev !== 'mild') h += row('內部', tube ? '吸入氣加熱 40–45°C：約 2.5°C/hr' + (na(t) ? '' : '，到 35 約 ' + fmt((35 - t) / 2.5, 1) + ' 小時') : '插管者可加熱吸入氣（2.5°C/hr）', '', 'fl-na', '加熱輸液只防再冷、不會復溫', '不建議：熱水洗胃（吸入）、膀胱灌洗（無效）');
      h += row('體積', '加熱輸液（室溫 21°C 的液體會再冷）', '', 'fl-warn', '冷利尿造成低血容、復溫的血管擴張造成低血壓', '輸液無效考慮 VA-ECMO');
      if (arrest || sev === 'severe' || sev === 'fatal') h += row('心搏停止', 'VA-ECMO', '', 'fl-hot', '低體溫心搏停止已成功使用', '復溫到正常前不能宣告死亡');
      h += row('檢驗', '血氣要校正到病人體溫（中重度：合併呼吸＋代謝性酸中毒）', '', 'fl-na', '高血鉀（發抖、橫紋肌溶解）、肌酸酐升（冷利尿）、<34 凝血病變（37°C 跑的檢驗看不出）', '<32 心律不整閾值降、atropine 無效的心搏過緩；<28 VF／asystole');
    }
    h += '<div class="rx-flag">冷水（<15°C）浸泡 30 分鐘可致命（水散熱遠快於空氣）；風促進對流（風寒指數）；酒精毒品破壞行為反應。Osborn（J）波不專一（高血鈣、SAH、腦傷、心肌缺血）、幾乎沒有診斷或預後價值。</div>';
    document.getElementById('c43hypo_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c43conv', function () {
    var c = num('cv_c'), f = num('cv_f');
    var h = '';
    if (!na(c)) h += row('°C → °F', fmt(c * 9 / 5 + 32, 1), '°F', 'fl-na', '°F ＝ °C × 9/5 ＋ 32', '');
    if (!na(f)) h += row('°F → °C', fmt((f - 32) * 5 / 9, 1), '°C', 'fl-na', '°C ＝ (°F − 32) × 5/9', '');
    if (!h) h = row('換算', '—', '', 'fl-na', '任填一格', '');
    h += '<div class="rx-flag">冰點 0°C ＝ 32°F、沸點差 Δ100°C ＝ Δ180°F，化簡 Δ5°C ＝ Δ9°F。常用：35 ＝ 95、37 ＝ 98.6、38 ＝ 100.4、38.3 ＝ 101、39 ＝ 102.2、40 ＝ 104、41 ＝ 106。「攝氏」叫 Celsius，centigrade 是指羅盤的度。</div>';
    document.getElementById('c43conv_out').innerHTML = I.wrap(h);
  });

  /* ================= Ch44 ================= */
  I.bindCalc('c44fever', function () {
    var t = num('fv_t'), site = val('fv_site'), neut = val('fv_neut') === 'y', tachy = val('fv_tp') === 'y', hr1 = val('fv_hr') === 'y';
    var adj = site === 'oral' && tachy ? t + 0.5 : t;
    var fever = site === 'periph' ? null : (!na(adj) && (adj >= 38.3 || (neut && adj >= 38.0 && hr1)));
    var h = row('量測', site === 'core' ? '核心（肺動脈／食道／膀胱導管）' : site === 'oral' ? '口腔或直腸' : '周邊（耳溫／顳動脈／腋下）', '', site === 'periph' ? 'fl-hot' : site === 'core' ? 'fl-ok' : 'fl-na', site === 'periph' ? '準確度不可接受：不能拿來做決定，換核心或口腔／直腸' : site === 'core' ? '最準、可連續' : tachy ? '呼吸快時口溫比核心低 0.5°C，已校正' : '', '');
    if (site !== 'periph') h += row('校正後體溫', na(adj) ? '—' : fmt(adj, 1), '°C', na(adj) ? 'fl-na' : fever ? 'fl-hot' : 'fl-ok', na(adj) ? '' : fever ? (neut && adj < 38.3 ? '嗜中性球低下：≥38.0 持續 1 小時算發燒' : '≥38.3：發燒、要評估') : (neut && adj >= 38.0 ? '≥38.0 但未持續 1 小時' : '未達 38.3'), '日夜差可達 1.3°C（清晨 4–8 最低、下午 4–6 最高）');
    h += '<div class="rx-flag">發燒是發炎的徵象不是感染：ICU 新發燒一半沒有感染證據；燒的高低與感染的有無、輕重不相關（高燒可以是非感染、致命感染可以不燒）。發燒＝正常調節系統設定點升高，是適應性反應。</div>';
    document.getElementById('c44fever_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c44bc', function () {
    var n = num('bc_n'), vol = num('bc_v'), ie = val('bc_ie') === 'y', cvc = val('bc_cvc') === 'y';
    var det = na(n) ? NaN : ie ? (n >= 2 ? 94 : 70) : (n >= 3 ? 90 : n === 2 ? 80 : 65);
    var h = row('採血套數', na(n) ? '—' : fmt(n, 0), '套（穿刺處）', na(n) ? 'fl-na' : (ie ? n >= 2 : n >= 3) ? 'fl-ok' : 'fl-warn', na(n) ? '' : ie ? (n >= 2 ? '心內膜炎 2 套偵測 94%（持續菌血）' : '心內膜炎至少 2 套') : (n >= 3 ? '3–4 套／24 小時：>90%' : '其他感染要 3 套才 >90%'), na(det) ? '' : '約 ' + det + '% 偵測');
    h += row('每套血量', na(vol) ? '—' : fmt(vol, 0), 'mL', na(vol) ? 'fl-na' : vol >= 20 ? 'fl-ok' : 'fl-warn', na(vol) ? '20–30 mL 最佳' : vol >= 30 ? '30 比 20 多 10% 產率，多的 10 mL 進好氧瓶' : vol >= 20 ? '各 10 mL 進好氧與厭氧瓶' : '不足：產率隨血量降', '');
    if (cvc) h += row('多腔導管', '兩個腔各抽一套 ＋ 周邊一套', '', 'fl-warn', '只抽一個腔會漏 40%', '同菌時比陽性時間：導管血早 ≥2 小時＝導管相關敗血症；每個腔都是來源，最好全抽');
    h += '<div class="rx-flag">分子檢測（T2Bacteria 六菌 3–5 小時、Candida PCR >90%）：陽性仍要培養做藥敏、陰性不排除其他菌，改善結局的價值存疑。培養常要 48 小時以上。</div>';
    document.getElementById('c44bc_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c44drug', function () {
    var days = num('df_d'), rig = val('df_r') === 'y', hypo = val('df_h') === 'y', eos = val('df_e') === 'y', rash = val('df_ra') === 'y', other = val('df_o') === 'y';
    var h = row('時序', na(days) ? '—' : '用藥第 ' + fmt(days, 0) + ' 天', '', 'fl-na', '幾天到一個月以上都可能', '無標準描述；通常是排除其他來源後才想到');
    h += row('表現', [rig ? '寒顫' : '', hypo ? '低血壓' : '', eos ? '嗜酸性球增多' : '', rash ? '皮疹' : ''].filter(Boolean).join('、') || '單獨發燒', '', rig || hypo ? 'fl-warn' : 'fl-na', '寒顫 53%、肌痛 25%、白血球增多 22%、嗜酸性球 22%、皮疹 18%、低血壓 18%', (eos || rash) ? '' : '過敏證據（嗜酸性球、皮疹）>75% 沒有——沒有不能排除');
    h += row('處置', other ? '先處理其他可能來源' : '停可疑藥物，72 小時內應退', '', other ? 'fl-na' : 'fl-warn', '常見：amphotericin、carbamazepine、cephalosporin、heparin、penicillin、phenytoin、procainamide、quinidine', '寒顫＋低血壓可以看起來像重症');
    h += '<div class="rx-flag">其他非感染來源：術後第一天 15–40%（組織傷害，24–48 小時退；<b>肺擴張不全不會發燒</b>——有燒者 90% 有擴張不全，但有擴張不全者 75% 沒燒）、肺栓塞（可燒一週）、輸血非溶血性發燒（輸血中或 6 小時內；血小板約每 1,000 單位 1 次）、戒斷（酒精、鴉片、BZD、巴比妥、gabapentin）、腎上腺功能不全（抗凝或 DIC 的出血）、ARDS、心腦腸梗塞、血清素症候群（fentanyl、tramadol、linezolid）、醫源性（水床與加濕器的溫控壞掉——一分鐘就能查）。</div>';
    document.getElementById('c44drug_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c44anti', function () {
    var wt = num('ap_w'), liver = val('ap_l') === 'y', brain = val('ap_b') === 'y', sepsis = val('ap_s') === 'y';
    var h = row('該不該退燒', brain ? '要：缺血性腦傷（心搏停止後、急性中風）發燒有害' : sepsis ? '不建議常規壓燒：敗血症體溫與存活反比、退燒者死亡率較高' : '指引：不常規壓燒', '', brain ? 'fl-hot' : 'fl-ok', brain ? '' : '發燒升抗體細胞激素、活化 T 細胞、趨化吞噬；升 4°C 可完全抑制細菌生長', sepsis ? '無燒的敗血症外部加溫 1.5°C 反而降死亡率（試驗性）' : '');
    h += row('Acetaminophen', liver ? '禁忌（肝功能不全）' : '650 mg q6h PO/PR；IV 650 q6h 或 1,000 q8h', '', liver ? 'fl-hot' : 'fl-na', liver ? '' : '每日上限 3 g（肝毒性）', 'ICU 最常用、有效');
    h += row('Ibuprofen', na(wt) ? '10 mg/kg IV（≤800）q6h' : fmt(Math.min(wt * 10, 800), 0) + ' mg IV q6h', '', 'fl-na', '', '對腎毒性與消化道出血的恐懼被誇大、ICU 經驗有限');
    h += row('Ketorolac', na(wt) ? '0.5 mg/kg IV 單次' : fmt(wt * 0.5, 0) + ' mg IV 單次', '', 'fl-na', '', '');
    h += row('降溫毯', '發燒時反效果', '', 'fl-warn', '發燒靠皮膚血管收縮＋發抖升溫，像被裹在降溫毯裡；再加毯子只加重收縮與發抖', '降溫毯適合熱中暑（調節失靈）');
    h += '<div class="rx-flag">Prostaglandin E 介導發燒反應；aspirin、acetaminophen、NSAID 都能退燒，ICU 只用後兩者。1927 年諾貝爾獎：Wagner-Jauregg 用瘧疾發燒治神經梅毒，9 人 6 人緩解——「發燒能根除感染」的含意後來被遺忘。</div>';
    document.getElementById('c44anti_out').innerHTML = I.wrap(h);
  });
  I.bindCalc('c44ssi', function () {
    var pod = num('ss_d'), cls = val('ss_c'), deep = val('ss_deep') === 'y', nec = val('ss_nec') === 'y', fever = val('ss_f') === 'y';
    var h;
    if (nec) { h = row('壞死性傷口感染', '緊急、廣泛清創（存活的必要條件）', '', 'fl-hot', '術後頭幾天：明顯紅腫、與皮膚變化不成比例的痛（缺血性神經傷）；晚期捻髮音、水泡、乳白或惡臭分泌物', '擴散到深層很快（橫紋肌溶解）'); h += row('抗生素', '革蘭染色引導：鏈球菌／梭菌 → penicillin ＋ clindamycin；腹腔或胸腔深部手術 → carbapenem', '', 'fl-hot', '單一菌（β 溶血性鏈球菌、Clostridium）或多菌（腸道革蘭陰性＋厭氧）', ''); }
    else {
      h = row('時序', na(pod) ? '—' : '術後第 ' + fmt(pod, 0) + ' 天', '', na(pod) ? 'fl-na' : (pod >= 5 && pod <= 7) ? 'fl-warn' : pod <= 30 ? 'fl-na' : 'fl-ok', na(pod) ? '' : (pod >= 5 && pod <= 7) ? '典型 5–7 天' : pod <= 30 ? '30 天內都算 SSI' : '>30 天不算', '術後第一天的燒多是組織傷害');
      h += row('傷口分類', cls === 'clean' ? '乾淨（未開胸腹）：發生率 1–2%、多 S. aureus' : '污染（如腸穿孔汙染腹腔）：4–5%、多革蘭陰性桿菌', '', 'fl-na', deep ? '深部感染較會發燒' : '表淺感染較少發燒', '徵象：紅腫壓痛、膿或惡臭分泌物');
      h += row('處置', '清創' + (fever ? ' ＋ 抗生素' : '；有燒才加抗生素'), '', fever ? 'fl-warn' : 'fl-na', cls === 'clean' ? '疑 S. aureus：vancomycin' : 'Piperacillin-tazobactam，或第三代 cephalosporin ＋ metronidazole', '');
    }
    h += '<div class="rx-flag">美國 2021 院內感染：呼吸器相關事件 50,050（ICU 47,254）、C. difficile 44,948、導管相關血流感染 27,021（14,003）、導管相關 UTI 24,710（12,208）、手術部位感染 21,186。其他要想的：心內膜炎（S. aureus 菌血症一律評估；鏈球菌、腸球菌併瓣膜異常；TTE 敏感度 60–70%、人工瓣 50%，陰性要 TEE ≥90%）、腹膜炎（污染腹部手術後持續或晚發燒）、SBP、播散性念珠菌症（CVC、腹部手術、廣效抗生素；血液培養敏感度低到 20%、PCR >90%；一半非 albicans → echinocandin）。嗜中性球 <500 延遲幾小時就影響結局。</div>';
    document.getElementById('c44ssi_out').innerHTML = I.wrap(h);
  });

  /* ================= 流程 ================= */
  /* Ch43 高體溫症候群 */
  var hp = { trig: null, sign: null };
  window.hpPick = function (k, v, btn) { flowSelect(btn); hp[k] = v; hpRender(); };
  function hpRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (hp.trig === 'env') { cls = 'rec-urgent'; t = '環境或運動誘發 ≥41°C 併中樞失能：熱中暑——冰水浸泡或蒸發降溫到 38°C ＋ 體積復甦'; d = '<li>退燒藥無效；發抖是外部降溫的缺點。</li>'; }
    else if (hp.trig === 'anes') { cls = 'rec-urgent'; t = '吸入麻醉劑或 succinylcholine 後：惡性高熱——停藥、dantrolene 1–2 mg/kg 快速 IV'; d = '<li>最早徵象是呼氣末 CO₂ 突然升；接著僵硬（咬肌起）、體溫 >40 較晚；橫紋肌溶解常見。</li><li>1/50,000、體染色體顯性；早給死亡率 ≥70% → ≤10%。</li>'; }
    else if (hp.trig === 'drug') {
      if (hp.sign === 'clonus') { cls = 'rec-urgent'; t = '反射亢進、肌陣攣、陣攣（眼陣攣最可靠）：血清素症候群——停血清素藥物，嚴重用 cyproheptadine'; d = '<li>兩種血清素藥合用最常見；fentanyl、linezolid、tramadol 都在名單。</li><li>體溫升只 60%、橫紋肌溶解 15%；重症僵硬會遮住反射亢進。</li>'; }
      else if (hp.sign === 'rigid') { cls = 'rec-urgent'; t = '鉛管樣僵硬、CK >1,000、體溫晚 8–10 小時才升：神經抑制劑惡性症候群——停藥（或恢復多巴胺藥）、bromocriptine 10 mg tid、嚴重 dantrolene'; d = '<li>用藥 24–72 小時起、幾乎都在 2 週內；haloperidol 最常見；<1%、與劑量無關。</li><li>VTE 預防必做；緩解後續治 10 天（長效針劑 2–3 週）。</li>'; }
      else { cls = 'rec-elective'; t = '藥物相關：主要神經肌肉表現？'; d = '<li>請回答第 2 步。SS 與 NMS 都有僵硬、意識改變、高溫、腎上腺素亢進；差別在反射亢進與陣攣。</li>'; }
    }
    if (hp.trig) n = '這些都是高體溫（調節失靈），不是發燒：acetaminophen 無效。';
    flowRec('hp_rec', cls, t, d, n);
  }
  window.hpReset = function () { hp = { trig: null, sign: null }; selAll('#hp_flow'); hpRender(); };

  /* Ch44 新發燒 */
  var fv = { when: null, inf: null, cvc: null };
  window.fvPick = function (k, v, btn) { flowSelect(btn); fv[k] = v; fvRender(); };
  function fvRender() {
    var cls = 'rec-idle', t = '請由第 1 步開始選擇', d = '', n = '';
    if (fv.when === 'pod1') { cls = 'rec-blue'; t = '術後 24 小時內：多是組織傷害的發炎（15–40%），24–48 小時退——不是肺擴張不全'; d = '<li>例外：惡性高熱（>40°C、僵硬、橫紋肌溶解）。</li><li>先查加熱墊與呼吸器加濕器的溫度設定。</li>'; }
    else if (fv.when === 'other') {
      if (fv.inf === 'no') { cls = 'rec-elective'; t = '感染不太可能：找非感染來源'; d = '<li>藥物熱（停藥 72 小時退）、肺栓塞、輸血、戒斷、腎上腺功能不全、ARDS、梗塞、血清素症候群、醫源性。</li><li>一半的 ICU 發燒沒有感染證據；別壓燒。</li>'; }
      else if (fv.inf === 'yes') {
        if (fv.cvc === 'yes') { cls = 'rec-urgent'; t = '有中心靜脈導管：兩個腔＋周邊各一套血液培養（比陽性時間 ≥2 小時）；經驗性蓋革蘭陰性桿菌 ＋ vancomycin'; d = '<li>3–4 套／24 小時、每套 20–30 mL。</li><li>持續不明熱、污染腸道手術後、持續念珠菌尿：加 echinocandin。</li>'; }
        else if (fv.cvc === 'no') { cls = 'rec-urgent'; t = '3–4 套血液培養／24 小時；感染可能性高就經驗性抗生素蓋革蘭陰性桿菌（pip-tazo、cefepime 或 meropenem）'; d = '<li>VAP 加 vancomycin；S. aureus 菌血症一律評估心內膜炎。</li><li>嗜中性球 <500 幾小時的延遲就影響結局。</li>'; }
        else { cls = 'rec-elective'; t = '可能感染：有中心靜脈導管嗎？'; d = '<li>請回答第 3 步。</li>'; }
      } else { cls = 'rec-elective'; t = '感染有可能嗎？'; d = '<li>請回答第 2 步。ICU 感染多是 S. aureus 或腸道菌。</li>'; }
    }
    if (fv.when) n = '體溫用核心或口腔／直腸；門檻 38.3（嗜中性球低下 38.0 持續 1 小時）。';
    flowRec('fv_rec', cls, t, d, n);
  }
  window.fvReset = function () { fv = { when: null, inf: null, cvc: null }; selAll('#fv_flow'); fvRender(); };

  /* ================= 測驗 ================= */
  I.renderQuiz('qz_thermo', 'temp-thermo', [
    { q: '高體溫與發燒的差別？', o: ['沒有差別', '高體溫是調節失靈、發燒是正常調節在較高設定點——退燒藥對高體溫無效', '高體溫比較高', '發燒才需要降溫'], a: 1, why: '熱中暑、MH、NMS、SS 都是高體溫。降溫毯適合熱中暑、對發燒反效果。' },
    { q: '熱衰竭與熱中暑怎麼分？', o: ['體溫 >39', '中樞失能、血行動力不穩、多器官（橫紋肌溶解、AKI、DIC、缺血性肝炎）、≥41°C；熱衰竭是脫水但意識與血行動力正常', '有沒有流汗', '年齡'], a: 1, why: '無汗典型但非必然；運動型較嚴重。熱中暑：冰水浸泡或噴水＋風扇（0.3°C/分）、目標 38、發抖是缺點；4°C 食鹽水。' },
    { q: '惡性高熱最早的徵象？', o: ['體溫 >40', '呼氣末 CO₂ 突然升（鈣導致氧化磷酸化解偶聯的高代謝），再來是僵硬（咬肌起），體溫較晚', '心搏過速', '橫紋肌溶解'], a: 1, why: '吸入麻醉劑與 succinylcholine 誘發、1/50,000、體染色體顯性；dantrolene 1–2 mg/kg 早給死亡率 ≥70% → ≤10%；存活者戴手環、告知家屬。' },
    { q: 'NMS 與早期張力異常反應怎麼分？', o: ['體溫', 'CK：NMS 通常 >1,000、張力異常只輕微升；早期 NMS 可能只有僵硬', '意識', '脈搏'], a: 1, why: '用藥 24–72 小時起、2 週內；體溫比僵硬晚 8–10 小時；haloperidol 最常見、<1%、與劑量無關。治療：停藥、bromocriptine 10 mg tid、嚴重 dantrolene 1 mg/kg q8h（累積 10 mg/kg）、VTE 預防、緩解後 10 天。' },
    { q: '血清素症候群最專一的表現？', o: ['高溫', '反射亢進、肌陣攣、陣攣（眼陣攣最可靠）；高溫只 60%', '僵硬', '瞳孔放大'], a: 1, why: '兩種血清素藥合用最常見（fentanyl、linezolid、tramadol 在內）。Cyproheptadine 12 mg → 2 mg q2h → 8 mg q6h；頑固僵硬用 rocuronium。' },
    { q: '重度低體溫的復溫與陷阱？', o: ['熱水洗胃', '主動外部無效才內部：加熱吸入氣 40–45°C 約 2.5°C/hr；加熱輸液只防再冷；洗胃（吸入）與膀胱灌洗（無效）不建議；心搏停止用 VA-ECMO；復溫到正常前不能宣告死亡', '加熱輸液就能復溫', '直接宣告死亡'], a: 1, why: '量核心溫度；<32 心律不整閾值降與 atropine 無效的心搏過緩、<28 VF／asystole、<34 凝血病變（37°C 跑的看不出）；血氣要校正體溫；Osborn 波被過度渲染。' }
  ]);
  I.renderQuiz('qz_fever', 'temp-fever', [
    { q: 'ICU 的發燒門檻？', o: ['37.5', '單次 ≥38.3°C；嗜中性球低下 ≥38.0 持續 1 小時', '38.0', '39.0'], a: 1, why: '核心（肺動脈／食道／膀胱）最準，其次口腔／直腸（呼吸快時口溫低 0.5）；耳溫顳動脈腋下不能拿來做決定；日夜差可達 1.3。' },
    { q: 'ICU 新發燒有多少是感染？', o: ['幾乎都是', '約一半沒有感染證據；燒的高低與感染的有無輕重不相關', '90%', '10%'], a: 1, why: '發燒是發炎不是感染的徵象；區分才能少用抗生素。' },
    { q: '肺擴張不全會不會造成術後發燒？', o: ['會，是首因', '不會：有燒者 90% 有擴張不全，但有擴張不全者 75% 沒燒；動物結紮主支氣管也不燒；術後第一天的燒是組織傷害、24–48 小時退', '只在胸腔手術後', '只在第 3 天以後'], a: 1, why: '全身麻醉 >90% 有擴張不全。術後 24 小時內例外：惡性高熱。' },
    { q: '藥物熱的特徵？', o: ['一定有皮疹與嗜酸性球', '寒顫 53%、低血壓 18%——可以看起來像重症；過敏證據 >75% 沒有；停藥 72 小時內退', '只在用藥第一天', '不會低血壓'], a: 1, why: '常見：amphotericin、carbamazepine、cephalosporin、heparin、penicillin、phenytoin、procainamide、quinidine。' },
    { q: '血液培養怎麼抽最好？', o: ['一套就夠', '3–4 套／24 小時（心內膜炎 2 套即 94%）、每套 20–30 mL；多腔導管兩腔＋周邊、只抽一腔漏 40%、比陽性時間 ≥2 小時', '每套 5 mL', '全抽導管血'], a: 1, why: '30 比 20 mL 多 10% 產率，多的進好氧瓶。分子檢測陽性仍要培養、陰性不排除。' },
    { q: '敗血症的發燒該不該壓？', o: ['一律壓到 37', '不常規壓：體溫與存活反比、退燒者死亡率較高、外部加溫 1.5°C 反而降死亡率；例外是缺血性腦傷（心搏停止後、中風）', '用降溫毯', '只用 NSAID'], a: 1, why: '發燒升免疫功能、抑制細菌病毒；降溫毯在發燒是反效果。Acetaminophen 650 q6h（IV 650 q6h／1,000 q8h、上限 3 g、肝功能不全禁忌）；ibuprofen 10 mg/kg ≤800 q6h；ketorolac 0.5 mg/kg。' }
  ]);
})();
