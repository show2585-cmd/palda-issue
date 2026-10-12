(function () {
  if (window.lucide) window.lucide.createIcons();

  var issues = Array.prototype.slice.call(document.querySelectorAll('.issue'));
  if (!issues.length) return;

  // 요약 숫자
  function count(sev) {
    return issues.filter(function (el) { return !sev || el.dataset.severity === sev; }).length;
  }
  ['all', 'high', 'mid', 'low'].forEach(function (k) {
    var el = document.querySelector('[data-count="' + k + '"]');
    if (el) el.textContent = count(k === 'all' ? null : k);
  });

  // 심각도 필터
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-filter]'));
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      issues.forEach(function (el) {
        el.hidden = f !== 'all' && el.dataset.severity !== f;
      });
      tocLinks.forEach(function (a) {
        var target = document.querySelector(a.getAttribute('href'));
        a.parentElement.hidden = !!(target && target.hidden);
      });
    });
  });

  // 목차 현재 위치 표시
  if ('IntersectionObserver' in window && tocLinks.length) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
        var a = byId[e.target.id];
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    issues.forEach(function (el) { io.observe(el); });
  }
})();
