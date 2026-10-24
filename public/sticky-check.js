// Diagnostic: run in browser console to find sticky blockers
// Paste this in DevTools console on any mission page after the gallery renders.
(function () {
  var gallery = document.querySelector('.md-gallery-inner') || document.querySelector('.md-gallery-wrap');
  if (!gallery) { console.warn('Gallery not found'); return; }

  var blockers = [];
  var el = gallery;
  while (el && el !== document.documentElement) {
    var cs = getComputedStyle(el);
    var issues = [];
    if (cs.overflowX !== 'visible' && cs.overflowX !== '') issues.push('overflow-x:' + cs.overflowX);
    if (cs.overflowY !== 'visible' && cs.overflowY !== '') issues.push('overflow-y:' + cs.overflowY);
    if (cs.transform && cs.transform !== 'none') issues.push('transform:' + cs.transform);
    if (cs.filter && cs.filter !== 'none') issues.push('filter:' + cs.filter);
    if (cs.willChange && cs.willChange !== 'auto') issues.push('will-change:' + cs.willChange);
    if (cs.perspective && cs.perspective !== 'none') issues.push('perspective:' + cs.perspective);
    if (cs.contain && cs.contain !== 'none') issues.push('contain:' + cs.contain);
    if (cs.position === 'fixed') issues.push('position:fixed');

    var tag = el.tagName.toLowerCase();
    var cls = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\s+/).join('.') : '';
    console.log('%c' + tag + cls, 'color:#00a3da', issues.length ? ('  >> BLOCKS STICKY: ' + issues.join(', ')) : '  ok');
    if (issues.length) blockers.push({ el: tag + cls, issues: issues });
    el = el.parentElement;
  }
  console.log('%c=== STICKY BLOCKERS: ' + blockers.length + ' ===', 'color:#e53935;font-weight:bold');
  blockers.forEach(function (b) { console.log('  ' + b.el + ' -> ' + b.issues.join(', ')); });
  return blockers;
})();
