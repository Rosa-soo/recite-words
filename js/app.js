/* =========================================================
 * 记单词 · 应用逻辑
 * 依赖 js/data.js（内置词库）
 * 数据保存在浏览器 localStorage（KEY: vocab_words / vocab_progress / vocab_settings）
 * ========================================================= */
(function () {
  "use strict";

  const LS_WORDS = "vocab_words";
  const LS_PROGRESS = "vocab_progress";
  const LS_SETTINGS = "vocab_settings";

  /* ---------------- 状态 ---------------- */
  let words = [];          // [{id, word, phonetic, meaning, example, category, builtin}]
  let progress = {};       // { id: { status: 'new'|'learning'|'known', wrong: Number, seen: Number } }
  let settings = { dailyGoal: 20 };

  /* ---------------- 工具函数 ---------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const uid = () => "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function load() {
    words = loadWords();
    try { progress = JSON.parse(localStorage.getItem(LS_PROGRESS)) || {}; } catch (e) { progress = {}; }
    try { settings = Object.assign({ dailyGoal: 20 }, JSON.parse(localStorage.getItem(LS_SETTINGS)) || {}); } catch (e) { settings = { dailyGoal: 20 }; }
  }
  function loadWords() {
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem(LS_WORDS)) || []; } catch (e) { custom = []; }
    const map = {};
    const all = [];
    BUILTIN_WORDS.forEach((w, i) => {
      const id = "b" + i;
      map[id] = true;
      all.push({ id, word: w.word, phonetic: w.phonetic || "", meaning: w.meaning, example: w.example || "", category: w.category || "默认", builtin: true });
    });
    custom.forEach((w) => {
      if (!map[w.id]) all.push(w);
    });
    return all;
  }
  function saveWords() {
    const custom = words.filter((w) => !w.builtin);
    localStorage.setItem(LS_WORDS, JSON.stringify(custom));
  }
  function saveProgress() { localStorage.setItem(LS_PROGRESS, JSON.stringify(progress)); }
  function saveSettings() { localStorage.setItem(LS_SETTINGS, JSON.stringify(settings)); }

  const wordById = (id) => words.find((w) => w.id === id);
  const statusOf = (id) => (progress[id] || { status: "new" }).status;
  const wrongOf = (id) => (progress[id] || { status: "new", wrong: 0 }).wrong || 0;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------------- 页签切换 ---------------- */
  function bindTabs() {
    $$(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".tab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const view = btn.dataset.view;
        $$(".view").forEach((v) => v.classList.remove("active"));
        $("#view-" + view).classList.add("active");
        if (view === "bank") renderBank();
        if (view === "stats") renderStats();
        if (view === "study") renderStudy();
      });
    });
  }

  /* =========================================================
   * 学习视图（卡片记忆）
   * ========================================================= */
  let studyQueue = [];     // 今日要背的单词 id 队列
  let studyIdx = 0;
  let studyDoneCount = 0;

  function buildStudyQueue() {
    // 优先复习错词(learning/wrong>0)，再学新词，按每日目标
    const learning = words.filter((w) => statusOf(w.id) === "learning");
    const fresh = words.filter((w) => statusOf(w.id) === "new");
    const reviewFirst = learning.sort((a, b) => wrongOf(b.id) - wrongOf(a.id));
    let ids = reviewFirst.map((w) => w.id);
    const need = Math.max(0, settings.dailyGoal - ids.length);
    ids = ids.concat(shuffle(fresh).slice(0, need).map((w) => w.id));
    return ids;
  }

  function renderStudy() {
    const area = $("#studyCardArea");
    const goal = settings.dailyGoal;
    const done = studyDoneCount;

    // 进度条
    $("#studyProgressFill").style.width = Math.min(100, (done / goal) * 100) + "%";
    $("#studyProgressText").textContent = done + " / " + goal;

    if (!studyQueue.length) studyQueue = buildStudyQueue();

    if (studyIdx >= studyQueue.length) {
      // 队列完成
      const left = buildStudyQueue().length;
      if (left === 0) {
        area.innerHTML =
          '<div class="study-done"><div class="big">🎉</div><h3>太棒了，所有单词都掌握了！</h3>' +
          '<p class="tip">可以到「词库」添加更多单词继续学习。</p></div>';
      } else {
        area.innerHTML =
          '<div class="study-done"><div class="big">✅</div><h3>今日计划已完成！</h3>' +
          '<p class="tip">本组还有 ' + left + ' 个待巩固单词，点击继续学习。</p>' +
          '<button class="btn btn-primary" id="btnStudyAgain" style="margin-top:14px">继续学习</button></div>';
        $("#btnStudyAgain").addEventListener("click", () => {
          studyDoneCount = 0; studyIdx = 0; studyQueue = buildStudyQueue(); renderStudy();
        });
      }
      $("#studyProgressFill").style.width = "100%";
      $("#studyProgressText").textContent = goal + " / " + goal;
      return;
    }

    const w = wordById(studyQueue[studyIdx]);
    if (!w) { studyIdx++; renderStudy(); return; }
    const i = studyIdx + 1;
    const total = studyQueue.length;

    area.innerHTML =
      '<div class="card3d" id="studyCard">' +
      '  <div class="card-inner" id="studyCardInner">' +
      '    <div class="card-face card-front">' +
      '      <span class="card-hint">点击翻面</span>' +
      '      <span class="card-tag">' + escapeHtml(w.category) + '</span>' +
      '      <div class="card-word">' + escapeHtml(w.word) + '</div>' +
      '      <div class="card-phonetic">' + escapeHtml(w.phonetic) + '</div>' +
      '    </div>' +
      '    <div class="card-face card-back">' +
      '      <div class="card-word" style="font-size:26px">' + escapeHtml(w.word) + '</div>' +
      '      <div class="card-meaning">' + escapeHtml(w.meaning) + '</div>' +
      '      ' + (w.example ? '<div class="card-example">“' + escapeHtml(w.example) + '”</div>' : '') +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="study-actions">' +
      '  <button class="btn btn-dont"  id="btnDont">😖 不认识</button>' +
      '  <button class="btn btn-so"    id="btnSo">🤔 模糊</button>' +
      '  <button class="btn btn-know"  id="btnKnow">😎 认识</button>' +
      '</div>' +
      '<div class="tip" style="margin-top:12px">第 ' + i + ' / ' + total + ' 个</div>';

    // 翻面
    $("#studyCard").addEventListener("click", (e) => {
      if (e.target.closest(".study-actions")) return;
      $("#studyCardInner").classList.toggle("flipped");
    });

    // 打分
    const grade = (level) => {
      mark(studyQueue[studyIdx], level);
      studyDoneCount++;
      studyIdx++;
      renderStudy();
    };
    $("#btnDont").addEventListener("click", () => grade("dont"));
    $("#btnSo").addEventListener("click", () => grade("so"));
    $("#btnKnow").addEventListener("click", () => grade("know"));
  }

  function mark(id, level) {
    const p = progress[id] || { status: "new", wrong: 0, seen: 0 };
    p.seen = (p.seen || 0) + 1;
    if (level === "know") { p.status = "known"; p.wrong = 0; }
    else if (level === "so") { p.status = "learning"; p.wrong = (p.wrong || 0) + 1; }
    else { p.status = "learning"; p.wrong = (p.wrong || 0) + 2; }
    progress[id] = p;
    saveProgress();
  }

  /* ---------------- 目标设置 ---------------- */
  function bindPlanSettings() {
    $("#btnPlanSettings").addEventListener("click", () => {
      const v = prompt("每日目标背多少个单词？", settings.dailyGoal);
      const n = parseInt(v, 10);
      if (!isNaN(n) && n > 0 && n <= 500) {
        settings.dailyGoal = n;
        saveSettings();
        studyDoneCount = 0; studyIdx = 0; studyQueue = buildStudyQueue();
        renderStudy();
        toast("目标已更新为每天 " + n + " 个");
      }
    });
  }

  /* =========================================================
   * 测验视图
   * ========================================================= */
  let quizState = null;

  function bindQuiz() {
    // 题型选择
    $$("#quizTypeSeg .seg-btn").forEach((b) => b.addEventListener("click", () => {
      $$("#quizTypeSeg .seg-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
    }));
    $$("#quizScopeSeg .seg-btn").forEach((b) => b.addEventListener("click", () => {
      $$("#quizScopeSeg .seg-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
    }));
    $("#btnStartQuiz").addEventListener("click", startQuiz);
    $("#btnQuizAgain").addEventListener("click", startQuiz);
    $("#btnQuizReview").addEventListener("click", () => {
      quizState = null;
      $("#quizSetup").classList.remove("hidden");
      $("#quizPanel").classList.add("hidden");
      $("#quizResult").classList.add("hidden");
      const scopeBtn = document.querySelector('#quizScopeSeg .seg-btn[data-scope="wrong"]');
      scopeBtn.click();
      startQuiz();
    });
  }

  function startQuiz() {
    const type = document.querySelector("#quizTypeSeg .seg-btn.active").dataset.type;
    const scope = document.querySelector("#quizScopeSeg .seg-btn.active").dataset.scope;
    const count = parseInt($("#quizCount").value, 10) || 10;

    let pool = words.slice();
    if (scope === "wrong") pool = pool.filter((w) => statusOf(w.id) === "learning" && wrongOf(w.id) > 0);

    if (pool.length < 4) { toast("可用单词不足 4 个，先去词库添加吧"); return; }
    const n = Math.min(count, pool.length);
    const qs = shuffle(pool).slice(0, n).map((w) => {
      const others = shuffle(pool.filter((x) => x.id !== w.id)).slice(0, 3);
      return { w, options: shuffle([w].concat(others)) };
    });

    quizState = { type, qs, idx: 0, correct: 0, wrongList: [] };
    $("#quizSetup").classList.add("hidden");
    $("#quizResult").classList.add("hidden");
    $("#quizPanel").classList.remove("hidden");
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const s = quizState;
    const q = s.qs[s.idx];
    const letters = ["A", "B", "C", "D"];
    $("#quizIndex").textContent = "第 " + (s.idx + 1) + " / " + s.qs.length + " 题";
    $("#quizScore").textContent = "✅ " + s.correct;

    const body = $("#quizBody");
    if (s.type === "spell") {
      body.innerHTML =
        '<div class="quiz-q"><div class="q-meaning">' + escapeHtml(q.w.meaning) + '</div>' +
        '<div class="q-phonetic">' + escapeHtml(q.w.phonetic) + '</div></div>' +
        '<input class="input spell-input" id="spellInput" placeholder="请输入英文单词" autocomplete="off" spellcheck="false" />' +
        '<div id="quizFeedback"></div>' +
        '<div id="quizNextWrap"><button class="btn btn-primary hidden" id="btnSpellNext">下一题</button></div>';
      const input = $("#spellInput");
      input.focus();
      const submit = () => {
        const ans = input.value.trim().toLowerCase();
        if (!ans) return;
        checkSpell(q, ans);
      };
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      $("#btnSpellNext").addEventListener("click", nextQuiz);
    } else {
      const isEn2Zh = s.type === "en2zh";
      body.innerHTML =
        '<div class="quiz-q">' +
        (isEn2Zh
          ? '<div class="q-word">' + escapeHtml(q.w.word) + '</div><div class="q-phonetic">' + escapeHtml(q.w.phonetic) + '</div>'
          : '<div class="q-meaning">' + escapeHtml(q.w.meaning) + '</div>') +
        '</div>' +
        '<div id="quizOptions"></div>' +
        '<div id="quizFeedback"></div>' +
        '<div id="quizNextWrap"></div>';

      const optsWrap = $("#quizOptions");
      q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "opt";
        btn.dataset.id = opt.id;
        btn.innerHTML = '<span class="opt-letter">' + letters[i] + '</span>' +
          escapeHtml(isEn2Zh ? opt.meaning : opt.word);
        btn.addEventListener("click", () => checkChoice(q, opt.id, btn));
        optsWrap.appendChild(btn);
      });
    }
  }

  function checkChoice(q, pickedId, btn) {
    $$("#quizOptions .opt").forEach((o) => { o.disabled = true; });
    const correct = q.w.id === pickedId;
    const isEn2Zh = quizState.type === "en2zh";
    if (correct) {
      btn.classList.add("correct");
      quizState.correct++;
    } else {
      btn.classList.add("wrong");
      // 高亮正确答案
      $$("#quizOptions .opt").forEach((o) => {
        if (o.dataset.id === q.w.id) o.classList.add("correct");
      });
      recordQuizWrong(q.w.id);
    }
    $("#quizFeedback").innerHTML = '<div class="quiz-feedback ' + (correct ? "ok" : "no") + '">' +
      (correct ? "✅ 回答正确" : "❌ 答错了") +
      '　' + escapeHtml(q.w.word) + " " + escapeHtml(q.w.meaning) + "</div>";
    $("#quizScore").textContent = "✅ " + quizState.correct;
    const wrap = $("#quizNextWrap");
    wrap.innerHTML = '<button class="btn btn-primary" id="btnNextQ">下一题</button>';
    $("#btnNextQ").addEventListener("click", nextQuiz);
  }

  function checkSpell(q, ans) {
    const input = $("#spellInput");
    input.disabled = true;
    const correct = ans === q.w.word.toLowerCase();
    if (correct) quizState.correct++;
    else recordQuizWrong(q.w.id);
    $("#quizFeedback").innerHTML = '<div class="quiz-feedback ' + (correct ? "ok" : "no") + '">' +
      (correct ? "✅ 拼写正确：" : "❌ 正确答案是：") + escapeHtml(q.w.word) + " " + escapeHtml(q.w.meaning) + "</div>";
    $("#quizScore").textContent = "✅ " + quizState.correct;
    $("#btnSpellNext").classList.remove("hidden");
  }

  function recordQuizWrong(id) {
    if (!quizState.wrongList.includes(id)) quizState.wrongList.push(id);
    const p = progress[id] || { status: "new", wrong: 0, seen: 0 };
    p.status = "learning";
    p.wrong = (p.wrong || 0) + 1;
    progress[id] = p;
    saveProgress();
  }

  function nextQuiz() {
    quizState.idx++;
    if (quizState.idx >= quizState.qs.length) return finishQuiz();
    renderQuizQuestion();
  }

  function finishQuiz() {
    const s = quizState;
    $("#quizPanel").classList.add("hidden");
    $("#quizResult").classList.remove("hidden");
    $("#quizResultScore").textContent = s.correct + " / " + s.qs.length;
    const rate = Math.round((s.correct / s.qs.length) * 100);
    $("#quizResultDetail").textContent = "正确率 " + rate + "%　·　" + (s.wrongList.length ? "新增 " + s.wrongList.length + " 个生词" : "没有新增生词，继续保持！");
  }

  /* =========================================================
   * 词库视图
   * ========================================================= */
  function renderBank() {
    const kw = ($("#bankSearch").value || "").trim().toLowerCase();
    const cat = $("#bankCategory").value;

    // 分类下拉
    const cats = [...new Set(words.map((w) => w.category))].sort();
    const sel = $("#bankCategory");
    const prev = sel.value;
    const curOpts = [...sel.options].map((o) => o.value);
    cats.forEach((c) => { if (!curOpts.includes(c)) { const o = document.createElement("option"); o.value = c; o.textContent = c; sel.appendChild(o); } });

    const list = words.filter((w) => {
      if (cat && w.category !== cat) return false;
      if (kw && !(w.word.toLowerCase().includes(kw) || w.meaning.toLowerCase().includes(kw))) return false;
      return true;
    });

    $("#bankCount").textContent = list.length + " 个单词";
    const ul = $("#bankList");
    ul.innerHTML = "";
    if (!list.length) {
      ul.innerHTML = '<div class="empty-tip">没有匹配的单词</div>';
      return;
    }
    list.forEach((w) => {
      const li = document.createElement("li");
      li.className = "bank-item";
      const st = statusOf(w.id);
      const badge = st === "known" ? '<span class="badge known">已掌握</span>'
        : st === "learning" ? '<span class="badge learning">学习中 ×' + wrongOf(w.id) + '</span>'
        : '<span class="badge new">未学</span>';
      li.innerHTML =
        '<div class="bank-word">' + escapeHtml(w.word) + '<div class="bank-phonetic">' + escapeHtml(w.phonetic) + '</div></div>' +
        '<div class="bank-meaning">' + escapeHtml(w.meaning) + '</div>' +
        '<span class="bank-cat">' + escapeHtml(w.category) + '</span>' +
        badge +
        (w.builtin ? '' : '<button class="icon-btn" title="删除">🗑</button>');
      if (!w.builtin) {
        li.querySelector(".icon-btn").addEventListener("click", () => {
          if (confirm("确定删除「" + w.word + "」吗？")) {
            words = words.filter((x) => x.id !== w.id);
            delete progress[w.id];
            saveWords(); saveProgress();
            renderBank();
            toast("已删除 " + w.word);
          }
        });
      }
      ul.appendChild(li);
    });
  }

  function bindBank() {
    $("#bankSearch").addEventListener("input", renderBank);
    $("#bankCategory").addEventListener("change", renderBank);
    $("#btnAddWord").addEventListener("click", addWord);
    $("#bankSearch").addEventListener("keydown", (e) => { if (e.key === "Enter") renderBank(); });
  }

  function addWord() {
    const word = $("#addWord").value.trim();
    const meaning = $("#addMeaning").value.trim();
    if (!word || !meaning) { toast("单词和释义为必填项"); return; }
    if (words.some((w) => w.word.toLowerCase() === word.toLowerCase())) { toast("该单词已存在"); return; }
    const nw = {
      id: uid(), word, phonetic: $("#addPhonetic").value.trim(),
      meaning, example: $("#addExample").value.trim(),
      category: $("#addCategory").value.trim() || "自定义", builtin: false,
    };
    words.push(nw);
    saveWords();
    progress[nw.id] = { status: "new", wrong: 0, seen: 0 };
    saveProgress();
    ["addWord", "addPhonetic", "addMeaning", "addExample", "addCategory"].forEach((id) => $("#" + id).value = "");
    renderBank();
    toast("已添加 " + word);
  }

  /* =========================================================
   * 统计视图
   * ========================================================= */
  function renderStats() {
    const total = words.length;
    let known = 0, learning = 0, fresh = 0, wrongTotal = 0;
    words.forEach((w) => {
      const st = statusOf(w.id);
      if (st === "known") known++;
      else if (st === "learning") { learning++; if (wrongOf(w.id) > 0) wrongTotal++; }
      else fresh++;
    });
    $("#statTotal").textContent = total;
    $("#statKnown").textContent = known;
    $("#statLearning").textContent = learning;
    $("#statNew").textContent = fresh;

    // 正确率：按 seen 与 wrong 估算
    let seenSum = 0, wrongSum = 0;
    words.forEach((w) => {
      const p = progress[w.id];
      if (p) { seenSum += (p.seen || 0); wrongSum += (p.wrong || 0); }
    });
    const acc = seenSum + wrongSum > 0 ? Math.max(0, Math.round(((seenSum) / (seenSum + wrongSum)) * 100)) : null;
    $("#statAccuracyFill").style.width = (acc === null ? 0 : acc) + "%";
    $("#statAccuracyText").textContent = acc === null ? "暂无答题数据" : "综合正确率约 " + acc + "%（基于答题记录估算）";

    // 连续学习天数（基于 localStorage 日期记录）
    $("#statStreak").textContent = "🔥 连续学习 " + streakDays() + " 天";

    // 生词本
    $("#wrongCount").textContent = wrongTotal;
    const ul = $("#wrongList");
    ul.innerHTML = "";
    const wrongWords = words.filter((w) => statusOf(w.id) === "learning" && wrongOf(w.id) > 0)
      .sort((a, b) => wrongOf(b.id) - wrongOf(a.id));
    if (!wrongWords.length) ul.innerHTML = '<div class="empty-tip">太棒了，没有生词！</div>';
    wrongWords.forEach((w) => {
      const li = document.createElement("li");
      li.className = "wrong-item";
      li.innerHTML = '<div class="wrong-word">' + escapeHtml(w.word) + '</div>' +
        '<div class="wrong-mean">' + escapeHtml(w.meaning) + '</div>' +
        '<span class="wrong-times">错 ' + wrongOf(w.id) + ' 次</span>';
      ul.appendChild(li);
    });
  }

  function streakDays() {
    let days = 0;
    const d = new Date();
    for (let i = 0; i < 3650; i++) {
      const key = fmtDay(d);
      if (localStorage.getItem("vocab_day_" + key)) { days++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return days;
  }
  function fmtDay(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function markToday() { localStorage.setItem("vocab_day_" + fmtDay(new Date()), "1"); }

  /* =========================================================
   * 数据管理：导出 / 导入 / 重置
   * ========================================================= */
  function bindData() {
    $("#btnExport").addEventListener("click", () => {
      const data = JSON.stringify({ words: words.filter((w) => !w.builtin), progress, settings }, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "vocab-backup.json";
      a.click();
      URL.revokeObjectURL(a.href);
      toast("已导出备份");
    });
    $("#btnImport").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (data.words && Array.isArray(data.words)) {
            words = loadWords(); // 保留内置词，合并导入的自定义词
            data.words.forEach((w) => { if (!words.some((x) => x.id === w.id)) words.push(w); });
            saveWords();
          }
          if (data.progress) { progress = data.progress; saveProgress(); }
          if (data.settings) { settings = Object.assign(settings, data.settings); saveSettings(); }
          toast("导入成功");
          renderBank(); renderStats();
        } catch (err) { toast("导入失败：文件格式不正确"); }
      };
      reader.readAsText(f);
      e.target.value = "";
    });
    $("#btnReset").addEventListener("click", () => {
      if (!confirm("确定清空所有学习进度吗？词库会保留。")) return;
      progress = {};
      saveProgress();
      studyDoneCount = 0; studyIdx = 0; studyQueue = buildStudyQueue();
      renderStats(); renderStudy();
      toast("已重置进度");
    });
  }

  /* ---------------- 工具 ---------------- */
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    load();
    markToday();
    bindTabs();
    bindPlanSettings();
    bindQuiz();
    bindBank();
    bindData();
    renderStudy();
    renderBank();
    renderStats();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
