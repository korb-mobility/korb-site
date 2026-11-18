/*! © Transfer. Alle Rechte vorbehalten. Vervielfältigung, Weitergabe oder Nutzung dieses Codes,
    auch in Teilen, nur mit schriftlicher Genehmigung von Transfer. */
/* Scroll and entrance motion. Runs only when GSAP loaded and the visitor allows motion. */
(function () {
  var root = document.documentElement;
  var nav = document.getElementById("nav");
  var setNav = function () { nav.classList.toggle("solid", window.scrollY > 20); };
  setNav();
  window.addEventListener("scroll", setNav, { passive: true });

  if (!root.classList.contains("motion") || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove("motion");
    return;
  }

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var E = "expo.out";

  // Smooth wheel scrolling on desktop; touch keeps the native feel.
  if (window.Lenis && matchMedia("(pointer: fine)").matches) {
    var lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    lenis.on("scroll", window.ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.tLenis = lenis;
  }

  // Entrance: title rises, copy follows, the booking card slides in.
  var intro = gsap.timeline({ delay: 0.1 });
  if (matchMedia("(min-width: 860px)").matches) intro
    .fromTo(".hero-title", { opacity: 0, yPercent: 40, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, yPercent: 0, clipPath: "inset(0 0 -20% 0)", duration: 1.3, ease: E })
    .fromTo(".hero-in", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: E, stagger: 0.08 }, "-=1")
    .fromTo(".card", { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: E }, "-=0.95")
    .fromTo(".nav-mark .mark-dot", { x: "-60vw" }, { x: 0, duration: 1.4, ease: E }, 0.2);

  // Hero copy drifts up as you leave it.
  gsap.to(".hero-copy", { yPercent: -12, opacity: 0.35, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // Generic reveals.
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 1.2, ease: E, scrollTrigger: { trigger: el, start: "top 86%" } });
  });

  var mm = gsap.matchMedia();

  // Journey: on wide screens the section pins and the route draws as you scroll.
  var draw = document.querySelector(".journey-draw");
  if (draw) {
    // pathLength="1" on the path keeps the dash maths independent of its size.
    gsap.set(draw, { strokeDasharray: 1, strokeDashoffset: 1 });
    mm.add("(min-width: 860px)", function () {
      gsap.from(".journey h2", { opacity: 0, y: 40, duration: 1.2, ease: E, scrollTrigger: { trigger: ".journey", start: "top 75%" } });
      var tl = gsap.timeline({ scrollTrigger: { trigger: ".journey", start: "top top", end: "+=140%", scrub: 1, pin: true } });
      tl.to(draw, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
      gsap.utils.toArray(".journey-steps li").forEach(function (li, i) {
        tl.from(li, { opacity: 0.15, y: 30, duration: 0.25 }, 0.05 + i * 0.42)
          .from(li.querySelector(".stop"), { scale: 0, duration: 0.2, ease: "back.out(3)" }, 0.05 + i * 0.42);
      });
    });
    mm.add("(max-width: 859px)", function () {
      gsap.from(".journey h2", { opacity: 0, y: 30, duration: 1, ease: E, scrollTrigger: { trigger: ".journey", start: "top 80%" } });
      gsap.utils.toArray(".journey-steps li").forEach(function (li) {
        gsap.from(li, { opacity: 0, x: -24, duration: 1, ease: E, scrollTrigger: { trigger: li, start: "top 85%" } });
      });
    });
  }

  // Airport: the huge FRA slides across.
  gsap.fromTo(".fra", { xPercent: 12 }, { xPercent: -28, ease: "none", scrollTrigger: { trigger: ".airport", start: "top bottom", end: "bottom top", scrub: true } });

  // Class marquee: steady drift, nudged by scroll speed.
  var marquee = document.querySelector(".marquee-in");
  if (marquee) {
    var loop = gsap.to(marquee, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
    window.ScrollTrigger.create({
      trigger: ".klasse", start: "top bottom", end: "bottom top",
      onUpdate: function (self) { gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(self.getVelocity()) / 400, 4), duration: 0.2, overwrite: true }); gsap.to(loop, { timeScale: 1, duration: 1, delay: 0.25 }); }
    });
  }

  // Footer: the dot drives in as the wordmark arrives.
  gsap.fromTo(".foot-mark .mark-dot", { x: "-110vw" }, { x: 0, ease: "power3.out", scrollTrigger: { trigger: ".foot", start: "top 95%", end: "top 35%", scrub: 1 } });
  gsap.from(".foot-mark .mark-sub span", { opacity: 0, y: 20, stagger: 0.04, duration: 0.8, ease: E, scrollTrigger: { trigger: ".foot", start: "top 70%" } });

  // Anchor links go through Lenis so the motion stays smooth.
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (!target || !window.tLenis) return;
      e.preventDefault();
      window.tLenis.scrollTo(target, { offset: -60 });
    });
  });

  window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
})();
