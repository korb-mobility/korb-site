/*! © Transfer. Alle Rechte vorbehalten. */
/* The 3D night drive is only for larger screens. Phones, data savers and reduced motion keep the plain background,
   so the booking form is ready at once. It loads after the page, when the browser is idle. */
(function () {
  var c = navigator.connection || {};
  var ok = matchMedia("(min-width: 860px)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !c.saveData && !/(^|-)2g$/.test(c.effectiveType || "") && (navigator.deviceMemory || 8) >= 4;
  if (!ok) return;
  var go = function () { import("./scene-3d.js?v=20261117a").catch(function () {}); };
  var later = function () { ("requestIdleCallback" in window) ? requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 1200); };
  if (document.readyState === "complete") later(); else addEventListener("load", later);
})();
