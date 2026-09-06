/* ICU Book（Marino 5e 整理版）— 共用引擎
 * 每一個 Section 頁都載這支：分頁列、重點卡全開全收、章末測驗、計算器小工具、
 * 以及連到臨床工具箱既有工具的連結（CT_ROOT）。
 *
 * 匯入 Clinical-Tools 時：CT_ROOT 改成 '../'，其餘不動。 */
(function (global) {
  'use strict';

  /* 臨床工具箱部署位置。獨立 PWA 階段連到 github.io；併入 repo 後改 '../'。 */
  var CT_ROOT = 'https://jeremyl861225.github.io/Clinical-Tools/';

  /* ---- 分頁列：與 schema/templates/guide.html 同一套契約 ----
     <div class="tab-row" id="<k>_tabs"><button class="tab-btn" data-p="id">…</button></div>
     <section class="<k>-panel" data-panel="id">…</section>
     網址 hash 就是分頁 id；分頁內錨點用 #id/anchor。 */
  function makeTabs(k) {
    var tabs = document.getElementById(k + '_tabs');
    if (!tabs) return function () {};
    function show(id, anchor) {
      var ok = tabs.querySelector('[data-p="' + id + '"]');
      if (!ok) return;
      Array.prototype.forEach.call(tabs.querySelectorAll('.tab-btn'), function (b) {
        b.classList.toggle('active', b.getAttribute('data-p') === id);
      });
      Array.prototype.forEach.call(document.querySelectorAll('.' + k + '-panel'), function (p) {
        p.classList.toggle('hidden', p.getAttribute('data-panel') !== id);
      });
      if (history.replaceState) history.replaceState(null, '', '#' + id + (anchor ? '/' + anchor : ''));
      if (anchor) {
        var el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ block: 'start' });
      } else if (window.scrollY > 0) {
        var row = tabs.getBoundingClientRect().top + window.scrollY - 8;
        window.scrollTo(0, Math.max(0, row));
      }
    }
    Array.prototype.forEach.call(tabs.querySelectorAll('.tab-btn'), function (b) {
      b.addEventListener('click', function () { show(b.getAttribute('data-p')); });
    });
    /* 章內導覽：<a class="ch-nav" href="#panel/anchor"> */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('.ch-nav a');
      if (!a) return;
      var h = (a.getAttribute('href') || '').replace('#', '');
      if (!h) return;
      e.preventDefault();
      var parts = h.split('/');
      show(parts[0], parts[1]);
    });
    var h = location.hash.replace('#', '');
    if (h) { var parts = h.split('/'); show(parts[0], parts[1]); }
    return show;
  }

  /* ---- 重點卡：全部展開／收合 ---- */
  function bindExpandAll() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-expand]'), function (btn) {
      btn.addEventListener('click', function () {
        var root = document.getElementById(btn.getAttribute('data-expand'));
        if (!root) return;
        var cards = root.querySelectorAll('details.kc');
        var anyClosed = Array.prototype.some.call(cards, function (d) { return !d.open; });
        Array.prototype.forEach.call(cards, function (d) { d.open = anyClosed; });
        btn.textContent = anyClosed ? '全部收合' : '全部展開';
      });
    });
  }

  /* ---- 章末測驗 ----
     renderQuiz(containerId, storageKey, items) ；items: [{q, o:[…], a:index, why}]
     版型全部用臨床工具箱決策流程的元件：每題一個 .flow-step（編號＋題目）、選項是 .flow-opt、
     解析是 .flow-rec（答對 rec-elective／答錯 rec-urgent）、計分列是 .refbar、重來是 .btn-reset。
     答錯不扣分、不能重答；最佳成績記在 localStorage。 */
  function renderQuiz(id, key, items) {
    var root = document.getElementById(id);
    if (!root) return;
    var best = 0;
    try { best = parseInt(localStorage.getItem('icu-quiz-' + key) || '0', 10) || 0; } catch (e) {}
    var state = { done: 0, right: 0 };
    var letters = 'ABCDE';

    function build() {
      root.innerHTML = '';
      state.done = 0; state.right = 0;
      var bar = document.createElement('div');
      bar.className = 'refbar qz-bar';
      root.appendChild(bar);
      items.forEach(function (it, i) {
        var q = document.createElement('div');
        q.className = 'flow-step qz-q';
        var h = '<div class="flow-step-head"><span class="flow-num">' + (i + 1) + '</span><span class="flow-q">' + it.q + '</span></div><div class="flow-opts">';
        it.o.forEach(function (opt, j) {
          h += '<button type="button" class="flow-opt" data-i="' + j + '"><span class="mono">' + letters[j] + '</span>　' + opt + '</button>';
        });
        h += '</div><div class="flow-rec rec-idle qz-why" hidden></div>';
        q.innerHTML = h;
        Array.prototype.forEach.call(q.querySelectorAll('.flow-opt'), function (b) {
          b.addEventListener('click', function () {
            if (q.classList.contains('done')) return;
            var pick = parseInt(b.getAttribute('data-i'), 10);
            q.classList.add('done');
            var right = pick === it.a;
            Array.prototype.forEach.call(q.querySelectorAll('.flow-opt'), function (x, j) {
              if (j === it.a) { x.classList.add('selected'); x.insertAdjacentHTML('beforeend', '<span class="fo-sub">✓ 正解</span>'); }
              else if (j === pick) { x.insertAdjacentHTML('beforeend', '<span class="fo-sub">✗ 你的選擇</span>'); }
            });
            var why = q.querySelector('.qz-why');
            why.className = 'flow-rec qz-why ' + (right ? 'rec-elective' : 'rec-urgent');
            why.innerHTML = '<div class="rec-label">' + (right ? '答對 Correct' : '答錯 Incorrect') + '</div>' +
              '<div class="rec-title">' + (right ? '正解 ' + letters[it.a] : '正解是 ' + letters[it.a]) + '</div>' +
              '<div class="rec-note">' + it.why + '</div>';
            why.hidden = false;
            state.done++; if (right) state.right++;
            if (state.done === items.length && state.right > best) {
              best = state.right;
              try { localStorage.setItem('icu-quiz-' + key, String(best)); } catch (e) {}
            }
            paintBar();
          });
        });
        root.appendChild(q);
      });
      var rs = document.createElement('div');
      rs.className = 'flow-reset';
      rs.innerHTML = '<button type="button" class="btn-reset">重來一輪</button>';
      rs.querySelector('button').addEventListener('click', build);
      root.appendChild(rs);
      paintBar();
      function paintBar() {
        bar.innerHTML = '<span class="rb">本輪 <b>' + state.right + '</b> / ' + state.done + ' 答對</span>' +
          (best ? '<span class="rb">最佳 <b>' + best + '</b> / ' + items.length + '</span>' : '') +
          '<span class="rb-src">共 ' + items.length + ' 題 · 答錯不扣分、每題只能答一次</span>';
      }
    }
    build();
  }

  /* ---- 計算器小工具 ---- */
  function num(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    var v = parseFloat(el.value);
    return isFinite(v) ? v : NaN;
  }
  function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
  function fmt(x, d) {
    if (!isFinite(x)) return '—';
    return (d === 0 ? Math.round(x) : x.toFixed(d === undefined ? 1 : d)).toString();
  }
  /* row(label, value, unit, flagClass, flagText, sub) → 一顆 .rx-metric（臨床工具箱 guide.css 的計算輸出元件）
     flagClass 沿用舊名：fl-ok → 落在目標（.ok／.f-ok）、fl-warn／fl-hot → 偏離（.warn／.f-bad）、fl-na → 不上色 */
  function row(k, v, u, fc, ft, sub) {
    var vc = fc === 'fl-ok' ? ' ok' : (fc === 'fl-warn' || fc === 'fl-hot') ? ' warn' : '';
    var fcls = fc === 'fl-ok' ? 'f-ok' : (fc === 'fl-warn' || fc === 'fl-hot') ? 'f-bad' : '';
    return '<div class="rx-metric"><div class="rx-lab">' + k + '</div>' +
      '<div class="rx-val' + vc + '">' + v + (u ? '<small> ' + u + '</small>' : '') + '</div>' +
      ((ft || sub) ? '<div class="rx-sub">' + (ft ? '<span class="' + fcls + '">' + ft + '</span>' : '') + (ft && sub ? ' · ' : '') + (sub || '') + '</div>' : '') +
      '</div>';
  }
  /* 計算器輸出：把連串的 .rx-metric 包進 .rx-grid，其後的說明（.rx-flag）留在格線之外 */
  function wrap(h) {
    var i = h.indexOf('<div class="rx-flag">');
    if (i < 0) return '<div class="rx-grid">' + h + '</div>';
    return '<div class="rx-grid">' + h.slice(0, i) + '</div>' + h.slice(i);
  }
  /* 對同一個 .rxbox 內所有 input/select 綁 input 事件並立即算一次 */
  function bindCalc(calcId, fn) {
    var root = document.getElementById(calcId);
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('input,select'), function (el) {
      el.addEventListener('input', fn); el.addEventListener('change', fn);
    });
    fn();
  }
  /* Mosteller 體表面積 */
  function bsa(hCm, wKg) { return (hCm > 0 && wKg > 0) ? Math.sqrt(hCm * wKg / 3600) : NaN; }
  /* Devine 理想體重 */
  function ibw(sex, hCm) {
    if (!(hCm > 0)) return NaN;
    var inches = hCm / 2.54;
    var over = Math.max(0, inches - 60);
    return (sex === 'f' ? 45.5 : 50) + 2.3 * over;
  }

  /* ---- 連到臨床工具箱：<a data-ct="pathways/sepsis.html"> ---- */
  function resolveCT() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-ct]'), function (a) {
      var p = a.getAttribute('data-ct');
      if (a.tagName === 'A') { a.href = CT_ROOT + p; if (CT_ROOT.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; } }
      else a.addEventListener('click', function () { location.href = CT_ROOT + p; });
    });
  }

  /* ---- 章內導覽的目前區段：捲動時把最後一個已經捲過頂端的錨點標成 .is-cur ---- */
  function bindNavSpy() {
    var navs = document.querySelectorAll('.ch-nav');
    if (!navs.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      Array.prototype.forEach.call(navs, function (nav) {
        if (!nav.offsetParent) return;                 // 分頁被藏起來就不算
        var links = nav.querySelectorAll('a[href^="#"]');
        var cur = null, line = nav.getBoundingClientRect().bottom + 12;
        Array.prototype.forEach.call(links, function (a) {
          var id = (a.getAttribute('href') || '').split('/')[1];
          var el = id && document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) cur = a;
        });
        Array.prototype.forEach.call(links, function (a) { a.classList.toggle('is-cur', a === cur); });
      });
    }
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true; requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('hashchange', function () { setTimeout(update, 50); });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () { bindExpandAll(); resolveCT(); bindNavSpy(); });

  global.ICU = { makeTabs: makeTabs, renderQuiz: renderQuiz, num: num, val: val, fmt: fmt, row: row, wrap: wrap,
                 bindCalc: bindCalc, bsa: bsa, ibw: ibw, CT_ROOT: CT_ROOT };
})(window);
