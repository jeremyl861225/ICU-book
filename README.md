# ICU Book 重症筆記（Marino's The ICU Book 5e 統整版）

獨立的靜態 PWA，設計與程式契約完全沿用 `Clinical-Tools`，目的是日後整批匯入。

- 一個 Section 一頁（`sections/<k>.html`），章節是分頁（`data-p`／`.<k>-panel[data-panel]`，與 `schema/templates/guide.html` 同契約，kind = `guide`）。
- 每章固定骨架，**元件全部是臨床工具箱既有的**（造句設計的內頁語彙，ui-sentence.css 原樣套上）：章抬頭 `.dirhead`（`.dh-n`／`.dh-e`）→ 章內導覽 `.sp-chips > a.sp-chip`（`#panel/anchor`）→ 章首論點 `.lede` → 重點卡 `details.def-box`（summary＝編號＋標題＋`.en`；`.box-inner` 第一行 `.kp` 是一句主張，其後 ul；標籤用 `.dg-tag`／`.dg-tag.ctrl`；原文疑義 `.kbox.alert`、在地備註 `.kbox`）→ 對照表 `.tw > table.def-table` → 計算器 `.rxbox`（`.rxbox-t`／`.lead`／`.rx-grid > .rx-row`）＋輸出 `.rx-out`（`ICU.row` 產 `.rx-metric`，`ICU.wrap` 包 `.rx-grid`，說明 `.rx-flag`）→ 決策流程 `js/common.js` 的 flow-* → 章末測驗 `ICU.renderQuiz`（`.flow-step`＋`.flow-opt`＋`.flow-rec`＋`.refbar`）→ 相關工具 `a.flow-link[data-ct]`。`css/icu.css` 只剩幾條補充，不另立元件。
- **造句導覽就是模板本身**：`js/sentence-nav.js` 是 Clinical-Tools 的副本，只改了寫死的常數（`SECT_ORDER`／`TILE` 六個範圍、`TAB_PAGES`（17 個 Section 的 k）、`SUB_FILES=[]`、三段提示文字）；詞表與標的登錄在 `data/facets.js`（同一個形狀：s／c／a／tools／classif／lex）。首頁 `index.html` 的 `#hub` 六格是造句導覽讀的資料節點（隱藏），`#gs-home` 是插入點，`#home-body` 是貓咪主題才看得到的卡片清單。
- `css/styles.css`、`ui-sentence.css`、`guide.css`、`js/ui-mode.js`、`common.js`、`pull-to-refresh.js`、`backlink.js`、`icons/` 是 Clinical-Tools 的逐字副本；本套自己的只有 `css/icu.css`、`js/icu.js`、`js/<k>.js`、`data/facets.js`、`sections/`。
- 一個 Section 頁在 `facets.js` 登錄成「頁面本身 ＋ 各章 `#hash` 深層連結」，句子才收斂得到章；章的 c 詞各自掛，共通的 a 詞掛在頁面那筆。
- 內容規則：不搬原書文字與圖表，數字以原書為準；作者觀點（A Final Word）在重點卡尾端標 `.kc-tags > .dg-tag`「作者觀點」，原書疑似誤植處放 `.kbox.alert`（標題「原文疑義」），抽出時截斷的表格用 `.note` 註明「依內文重建」，台大在地備註放 `.kbox`。

## 進度（2026-09-06：全書完成）

| k | Section | 分頁（`data-panel`） | 計算器／流程／題 |
|---|---|---|---|
| access | I 血管通路 | primer／cvc／dwell | — |
| practices | II ICU 常規 | gi／vte／sed | — |
| monitoring | III 生理監測 | ox／pac／o2 | — |
| fluids | IV 輸液 | iv／mgmt | 9／2／14 |
| blood | V 血品 | rbc／plt | 8／2／14 |
| shock | VI 休克 | ov／hem／cs／inf | 12／4／32 |
| cardiac | VII 心臟 | hf／tachy／acs／arrest | 16／4／28 |
| respdis | VIII 呼吸疾病 | pe／obst／ards | 13／3／21 |
| vent | IX 通氣 | o2／niv／mv／dep／vap／wean | 16／6／36 |
| acidbase | X 酸鹼 | ab／lac／alk | 9／3／18 |
| renallyte | XI 腎臟與電解質 | aki／na／k／mg／capo | 15／5／30 |
| abdomen | XII 腹部 | liver／panc／abdinf／uti | 12／4／24 |
| temp | XIII 體溫 | thermo／fever | 10／2／12 |
| neuro | XIV 神經 | consc／move／stroke | 12／3／18 |
| nutrition | XV 營養與代謝 | req／ent／tpn／endo | 12／3／24 |
| tox | XVI 中毒 | rx／poison | 8／2／12 |
| appendix | XVII 附錄 | units／ranges／body | 7／0／6 |

每頁都經瀏覽器驗證（桌機計算值、流程建議、題數、375px 無橫向溢出、console 無錯）；`data/facets.js` tools 73 筆、c 詞 81。原書抽出時截斷或為圖檔的表格、與疑似誤植處，都在頁內以 `.note`／`.kbox.alert` 標明。

## 每個 Section 的固定管線

1. 讀該 Section 各章文字 → 寫 `js/<k>.js`（`ICU.bindCalc`／`flowRec`／`ICU.renderQuiz`）。
2. 寫 body（panel id `<k>-p-<tab>`、章內導覽錨點 `#tab/xx-key|tab|calc|flow|quiz|x`），套進 `sections/shock.html` 的 head 組出 `sections/<k>.html`。
3. PubMed 批次核對 PMID（一次 50–65 筆）放頁尾 REF。
4. 登錄：`data/facets.js`（c／a 新詞＋頁面與各章 tools 條目）、`sw.js` 兩行、`index.html` 卡片去 `.soon` 加 onclick 與計數、`sentence-nav.js` 的 `TAB_PAGES`。
5. 檢查：標籤配對、js 引用的 id 都存在、錨點、onclick 函式、跨頁 `other.html#tab` 的 panel 存在、`data-ct` 目標在 Clinical-Tools 存在。
6. 瀏覽器：清 SW 與 caches、`fetch(f,{cache:'reload'})`、JS 灌值核對計算、點流程、數題、375px 溢出、console。

## 匯入 Clinical-Tools 時

1. `js/icu.js` 的 `CT_ROOT` 改成 `'../'`。
2. 用 `schema/new_page.py --kind guide` 產生頁面骨架與五處登錄，再把 `sections/<k>.html` 的 `<body>` 內容搬進去（head 交給鷹架，會補上 nav／backlink／sentence-nav）。
3. `css/icu.css`、`js/icu.js`、`js/<k>.js` 各加一行 precache；`k` 加進 `sentence-nav.js` 的 `TAB_PAGES`；`data/facets.js` 這裡的 tools 條目與新詞併進 Clinical-Tools 的 `data/facets.js`（sec 換成 Clinical-Tools 的分區，例如 `critical`）。本套的 `js/sentence-nav.js` 不搬（那邊用原版）。
4. 跑 `python3 schema/check_pages.py`。

## 本機預覽

`.claude/launch.json` 已有 `icu-book`（port 8474）。
