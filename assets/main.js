/* ============================================================
   沉星手册 · 站点交互脚本（原创）
   星空画布 / 移动端导航 / 关卡索引筛选与解法展开
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 移动端导航 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  /* ---------- 首页星空 ---------- */
  var canvas = document.getElementById("starfield");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var W = 0, H = 0;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.floor(rect.width));
      H = canvas.height = Math.max(1, Math.floor(rect.height));
      stars = [];
      var count = Math.min(220, Math.floor((W * H) / 6500));
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.3 + 0.3,
          p: Math.random() * Math.PI * 2,
          s: 0.4 + Math.random() * 1.1
        });
      }
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        var a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(st.p + t * 0.001 * st.s));
        ctx.globalAlpha = a;
        ctx.fillStyle = i % 9 === 0 ? "#e3b45c" : "#cfd9ec";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
  }

  /* ============================================================
     关卡索引页
     ============================================================ */

  /* 机制分组的中文备注（本手册自拟译名，仅作检索提示；
     分组原名来自 joric/ootss 数据集，Unlicense 公共领域） */
  var SET_ZH = {
    "heroes_in_3d": "三维·英雄",
    "beams_and_basic_heroes": "光束与基础英雄",
    "heroes_and_stones": "英雄与石块",
    "beams_and_mirrors": "光束与镜子",
    "endgame3": "终局·三",
    "beams_and_stones": "光束与石块",
    "heroes_and_mirrors": "英雄与镜子",
    "heroes_and_water": "英雄与水域",
    "vertical_mirrors": "垂直镜面",
    "heroes2": "英雄二·怪物",
    "mirrors_and_stones": "镜子与石块",
    "skipping_in_3d": "三维·打水漂",
    "endgame2": "终局·二",
    "mirror": "镜像群岛",
    "underworld_heroes_and_mirrors": "地下·英雄与镜",
    "heroes3": "英雄三·诗人与德鲁伊",
    "underworld_heroes_and_promesst": "地下·英雄与誓约",
    "heroes1": "英雄一·搬运",
    "mirrorable_stones": "可镜化石块",
    "underworld_mirrors_and_promesst": "地下·镜与誓约",
    "double_beam_falling": "双光束下落",
    "mirrors_in_3d": "三维·镜面",
    "underworld_skipping_and_promesst": "地下·打水漂与誓约",
    "lily_highway_mirrors_and_stones": "睡莲通道·镜与石",
    "vertical_reflection": "垂直反射",
    "promesst1_and_2": "誓约·一与二",
    "monsters_and_beams": "怪物与光束",
    "clones": "克隆体",
    "advanced_bard_and_water": "进阶诗人与水域",
    "metamirrors": "元镜",
    "beaming_objects": "光束与物件",
    "lily_highway_stones_and_promesst": "睡莲通道·石与誓约",
    "spawners": "生成器",
    "intro_to_3d": "三维入门",
    "gems": "宝石",
    "lily_rotation": "睡莲旋转",
    "worlds_collide": "世界相撞",
    "goblin_rotation": "哥布林旋转",
    "strength": "蛮力试炼",
    "elevators": "升降梯",
    "orange_beam_highway_mirrors_and_promesst": "橙光通道·镜与誓约",
    "heroes_and_artifacts": "英雄与圣物",
    "promesst3": "誓约·三",
    "flat_things": "平面之物",
    "orange_beam_highway_worlds_collide": "橙光通道·世界相撞",
    "sideways_gates": "侧向闸门",
    "vertical_endpoint": "垂直终点",
    "orange_beam_highway_stones_and_promesst": "橙光通道·石与誓约",
    "underworld_lilies": "地下·睡莲",
    "skipping_stones": "打水漂石阵",
    "lily_highway_heroes_and_stones": "睡莲通道·英雄与石",
    "zachtronics": "Zach 式谜题",
    "beam_carrying": "光束搬运",
    "double_beam_falling_dropdown": "双光束下落·落差",
    "sky_promesst_misc": "天空·誓约杂项",
    "endgame1": "终局·一",
    "underworld_crossroads": "地下·交汇点",
    "vertical_promesst": "垂直·誓约",
    "UNDEFINED": "未分类"
  };

  var DIR_GLYPH = { U: "↑", D: "↓", L: "←", R: "→" };
  var ACT_LABEL = { X: "主行动", C: "切换角色", V: "副行动" };
  var FB_LABEL = { F: "前(未证实)", B: "后(未证实)" };

  /* 把紧凑解法串解析为记号数组，如 "R2XL4X" → [{c:'R',n:2},{c:'X'}…] */
  function parseMoves(str) {
    var out = [];
    var re = /([UDLRFBXCV])(\d*)/g;
    var m;
    while ((m = re.exec(str)) !== null) {
      out.push({ c: m[1], n: m[2] ? parseInt(m[2], 10) : 1 });
    }
    return out;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  function badge(q) {
    if (q === 1) return '<span class="badge comm">社区路线</span>';
    if (q === 2) return '<span class="badge auto">自动求解</span>';
    return '<span class="badge none">暂无解法</span>';
  }

  var listEl = document.getElementById("lv-list");
  if (!listEl || !window.HANDBOOK_LEVELS) return;

  var LEVELS = window.HANDBOOK_LEVELS;
  /* 全局序号，供列表展示与口头引用（#001 起，按数据排序） */
  LEVELS.forEach(function (lv, i) { lv.i = i + 1; });

  var searchEl = document.getElementById("lv-search");
  var setSelEl = document.getElementById("lv-set");
  var statusEl = document.getElementById("lv-status");
  var metaEl = document.getElementById("lv-meta");
  var moreBtn = document.getElementById("lv-more");
  var detailEl = document.getElementById("lv-detail");
  var chipsEl = document.getElementById("lv-chips");
  var chipsToggle = document.getElementById("lv-chips-toggle");

  var state = { q: "", set: "", status: "all", shown: 0, selected: null };
  var PAGE = 60;

  /* 分组筛选 chips：按数量降序 */
  var setCounts = {};
  LEVELS.forEach(function (lv) {
    setCounts[lv.s] = (setCounts[lv.s] || 0) + 1;
  });
  var setNames = Object.keys(setCounts).sort(function (a, b) {
    return setCounts[b] - setCounts[a];
  });

  if (chipsEl) {
    var frag = document.createDocumentFragment();
    setNames.forEach(function (s) {
      var b = document.createElement("button");
      b.className = "chip";
      b.dataset.set = s;
      b.title = s;
      b.textContent = (SET_ZH[s] || s) + " " + setCounts[s];
      b.addEventListener("click", function () {
        if (state.set === s) { state.set = ""; }
        else { state.set = s; }
        syncChips();
        syncSelect();
        updateChipsToggle();
        render(true);
      });
      frag.appendChild(b);
    });
    chipsEl.appendChild(frag);
  }

  /* 分组面板默认折叠，避免 59 个标签铺满一屏 */
  if (chipsToggle && chipsEl) {
    chipsEl.hidden = true;
    chipsToggle.setAttribute("aria-expanded", "false");
    chipsToggle.addEventListener("click", function () {
      chipsEl.hidden = !chipsEl.hidden;
      chipsToggle.setAttribute("aria-expanded", String(!chipsEl.hidden));
    });
  }

  function updateChipsToggle() {
    if (!chipsToggle) return;
    if (state.set) {
      chipsToggle.classList.add("on");
      chipsToggle.innerHTML = "分组：" + esc(SET_ZH[state.set] || state.set) + ' <span aria-hidden="true">×</span>';
      chipsToggle.title = "点击清除分组筛选（或再点一次同组标签）";
    } else {
      chipsToggle.classList.remove("on");
      chipsToggle.innerHTML = '按机制分组筛选 <span class="caret" aria-hidden="true">▾</span>';
      chipsToggle.title = "";
    }
  }

  if (setSelEl) {
    setSelEl.innerHTML =
      '<option value="">全部分组</option>' +
      setNames.map(function (s) {
        return '<option value="' + esc(s) + '">' + esc(SET_ZH[s] || s) + " · " + s + " (" + setCounts[s] + ")</option>";
      }).join("");
    setSelEl.addEventListener("change", function () {
      state.set = setSelEl.value;
      syncChips();
      updateChipsToggle();
      render(true);
    });
  }

  function syncChips() {
    if (!chipsEl) return;
    Array.prototype.forEach.call(chipsEl.children, function (c) {
      c.classList.toggle("on", c.dataset.set === state.set);
    });
  }
  function syncSelect() {
    if (setSelEl) setSelEl.value = state.set;
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      state.q = searchEl.value.trim().toLowerCase();
      render(true);
    });
  }
  if (statusEl) {
    statusEl.addEventListener("change", function () {
      state.status = statusEl.value;
      render(true);
    });
  }
  if (moreBtn) {
    moreBtn.addEventListener("click", function () {
      render(false);
    });
  }

  function filtered() {
    return LEVELS.filter(function (lv) {
      if (state.set && lv.s !== state.set) return false;
      if (state.status === "comm" && lv.q !== 1) return false;
      if (state.status === "auto" && lv.q !== 2) return false;
      if (state.status === "none" && lv.q !== 0) return false;
      if (state.status === "any" && lv.q === 0) return false;
      if (state.q) {
        var hay = (lv.n + " " + (lv.w || "") + " " + lv.s).toLowerCase();
        if (hay.indexOf(state.q) === -1) return false;
      }
      return true;
    });
  }

  function render(reset) {
    if (reset) state.shown = 0;
    var rows = filtered();
    if (state.shown === 0) listEl.innerHTML = "";
    var end = state.shown + PAGE;
    if (metaEl) {
      metaEl.textContent = "共 " + rows.length + " 个关卡 · 已显示 " + Math.min(rows.length, end) + " / " + rows.length;
    }
    var html = [];
    for (var i = state.shown; i < Math.min(end, rows.length); i++) {
      var lv = rows[i];
      html.push(
        '<div class="lv-row" data-n="' + esc(lv.n) + '">' +
          '<span class="idx">#' + String(lv.i).padStart(3, "0") + "</span>" +
          '<span class="nm">' + esc(lv.n) + "</span>" +
          (lv.w ? '<span class="wn">' + esc(lv.w) + "</span>" : "") +
          '<span class="meta">' +
            '<span class="grp" title="' + esc(lv.s) + '">' + esc(SET_ZH[lv.s] || lv.s) + "</span>" +
            badge(lv.q) +
          "</span>" +
        "</div>"
      );
    }
    listEl.insertAdjacentHTML("beforeend", html.join(""));
    state.shown = Math.min(end, rows.length);
    if (moreBtn) moreBtn.style.display = state.shown < rows.length ? "" : "none";
  }

  listEl.addEventListener("click", function (ev) {
    var row = ev.target.closest(".lv-row");
    if (!row) return;
    openDetail(row.dataset.n);
  });

  function openDetail(name) {
    var lv = null;
    for (var i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i].n === name) { lv = LEVELS[i]; break; }
    }
    if (!lv || !detailEl) return;
    state.selected = lv;
    /* 高亮当前选中行 */
    Array.prototype.forEach.call(listEl.children, function (r) {
      r.classList.toggle("sel", r.dataset && r.dataset.n === name);
    });
    var toks = parseMoves(lv.m || "");
    var movesHtml = toks.map(function (t) {
      var dir = DIR_GLYPH[t.c];
      var label, cls = "";
      if (dir) label = '<span class="dir">' + dir + "</span>";
      else if (ACT_LABEL[t.c]) label = '<span class="act">' + t.c + "</span>";
      else { label = '<span class="act">' + t.c + "</span>"; cls = " warn"; }
      var rep = t.n > 1 ? '<span class="x">×' + t.n + "</span>" : "";
      return '<span class="tok' + cls + '">' + label + rep + "</span>";
    }).join("");
    if (!movesHtml) movesHtml = '<span class="sub">该关卡暂无可用解法记录。</span>';

    var hasFB = /[FB]/.test(lv.m || "");
    detailEl.innerHTML =
      '<div class="hd"><h3>' + esc(lv.n) + "</h3>" + badge(lv.q) +
      (lv.w ? '<span class="sub">社区命名：' + esc(lv.w) + "</span>" : "") + "</div>" +
      '<div class="sub">分组：' + esc(SET_ZH[lv.s] || lv.s) + " · " + esc(lv.s) +
      (lv.r ? " · 大区：" + esc(lv.r) : "") +
      " · 坐标 " + lv.c[0] + ", " + lv.c[1] + " · 高度 " + lv.c[2] + "</div>" +
      '<div class="moves">' + movesHtml + "</div>" +
      (lv.q === 2
        ? '<div class="note" style="margin:10px 0 0">此序列来自<b>自动求解记录</b>，未经玩家逐关实机复核；如步骤对不上，请以游戏内实际局面为准。</div>'
        : "") +
      (hasFB
        ? '<div class="note gold" style="margin:10px 0 0">该记录含 <b>F / B</b> 记号。社区播放器目前会跳过这两个符号，其含义尚无权威定义，实机尝试前请先看第三章的说明。</div>'
        : "") +
      '<div class="detail-actions">' +
        '<button class="mini-btn" id="lv-copy">复制原始序列</button>' +
        '<a class="mini-btn" href="https://joric.github.io/ootss/" target="_blank" rel="noopener">在社区地图中搜索 ↗</a>' +
      "</div>" +
      (lv.m ? '<div class="raw-line">原始数据：' + esc(lv.m) + "</div>" : "");
    detailEl.style.display = "";
    detailEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

    var copyBtn = document.getElementById("lv-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var done = function () {
          copyBtn.textContent = "已复制 ✓";
          setTimeout(function () { copyBtn.textContent = "复制原始序列"; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lv.m).then(done, done);
        } else {
          var ta = document.createElement("textarea");
          ta.value = lv.m;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          done();
        }
      });
    }
  }

  render(true);
})();
