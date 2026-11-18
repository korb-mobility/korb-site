/*! © Transfer. Alle Rechte vorbehalten. Vervielfältigung, Weitergabe oder Nutzung dieses Codes,
    auch in Teilen, nur mit schriftlicher Genehmigung von Transfer. */
/* Ride classes, chosen like in the big ride apps: a list with price and times, cash, one black button
   with a calendar beside it. Also: the pick-up comes from the phone's position by itself. */
(function () {
  if (!window.form || !document.getElementById("result")) return;

  // Price rule per class, on top of the normal fare. Change here.
  var CLASSES = [
    // Proportions taken from Uber prices for the same trip in Stuttgart (Nov 2026):
    // Wait & Save 61.29 vs UberX 65.94 (-7 %), Priority 75.16 (+14 %), Pet 162.27 vs UberX 157.94 (+4.33 EUR).
    { id: "premium", name: "Transfer Premium", seats: 4, adjust: function (p) { return p; }, wait: 0 },
    { id: "pet", name: "Transfer Pet", seats: 4, adjust: function (p) { return p + 4.5; }, wait: 0 },
    { id: "courier", name: "Transfer Courier", seats: 0, adjust: function (p) { return p; }, wait: 0 }
  ];
  var T = {
    de: { premium: "Viertüriges Auto, bis 4 Personen", wait: "Etwas warten, günstiger", priority: "Schneller abgeholt, zuerst vermittelt",
      pet: "Mit Haustier", courier: "Paket oder Dokumente, ohne Fahrgast", choose: "{c} wählen", cash: "Bar im Fahrzeug", now: "Sofort",
      planned: "Abholung {d}", vehicle: "Viertüriges Auto", min: "Min.", title: "Fahrt wählen", pickNow: "Jetzt fahren", locating: "Ihr Standort wird gesucht …" },
    en: { premium: "Four-door car, up to 4 people", wait: "Wait a little, pay less", priority: "Picked up faster, matched first",
      pet: "With your pet", courier: "Parcel or documents, no passenger", choose: "Choose {c}", cash: "Cash in the car", now: "Now",
      planned: "Pick-up {d}", vehicle: "Four-door car", min: "min", title: "Choose a ride", pickNow: "Ride now", locating: "Finding your location …" },
    el: { premium: "Τετράπορτο αυτοκίνητο, έως 4 άτομα", wait: "Λίγη αναμονή, φθηνότερα", priority: "Πιο γρήγορη παραλαβή, προτεραιότητα",
      pet: "Με κατοικίδιο", courier: "Δέμα ή έγγραφα, χωρίς επιβάτη", choose: "Επιλογή {c}", cash: "Μετρητά στο αυτοκίνητο", now: "Τώρα",
      planned: "Παραλαβή {d}", vehicle: "Τετράπορτο αυτοκίνητο", min: "λεπ.", title: "Διάλεξε διαδρομή", pickNow: "Διαδρομή τώρα", locating: "Αναζήτηση τοποθεσίας …" }
  };
  var t = function (k) { return (T[lang] || T.de)[k]; };
  var chosen = CLASSES[0];
  var result = document.getElementById("result");

  // A plain car, drawn here (no photo of a real car).
  var CAR = '<svg viewBox="0 0 120 48" aria-hidden="true" class="cls-car"><path d="M6 34c0-6 3-9 9-10l14-2 14-11c3-2 6-3 10-3h40c5 0 8 1 11 4l8 9c4 1 6 4 6 8v5c0 2-1 3-3 3H9c-2 0-3-1-3-3z" fill="#161616" stroke="#8a8a8a" stroke-width="1.5"/>' +
    '<path d="M45 13l-11 9h28V12H53c-3 0-6 0-8 1zM66 12v10h36l-7-8c-2-2-4-2-7-2z" fill="#3d4650"/>' +
    '<circle cx="28" cy="38" r="7" fill="#111" stroke="#555" stroke-width="2"/><circle cx="28" cy="38" r="2.5" fill="#3ddc84"/>' +
    '<circle cx="94" cy="38" r="7" fill="#111" stroke="#555" stroke-width="2"/><circle cx="94" cy="38" r="2.5" fill="#3ddc84"/></svg>';

  // The list replaces the single price block; the facts below it stay.
  var box = document.createElement("div");
  box.className = "cls";
  result.insertBefore(box, result.firstChild);
  var top = result.querySelector(".quote-top");
  if (top) top.hidden = true;

  // Every price on the page (list, sticky bar, message, booking) follows the chosen class.
  var basePrice = window.priceFor;
  window.priceFor = function (trip) {
    var p = chosen.adjust(basePrice(trip));
    return Math.round(Math.ceil(p / CONFIG.pricing.roundUpTo - 1e-9) * CONFIG.pricing.roundUpTo * 100) / 100;
  };
  // What the driver sees with the ride.
  window.tClassNote = function () { return chosen.id === "premium" ? null : chosen.name; };

  var clock = function (d) { return d.toLocaleTimeString(TEXT[lang].locale, { hour: "2-digit", minute: "2-digit" }); };
  function render() {
    if (!window.trip) return;
    var later = form.mode.value === "later";
    var start = later && form.date.value && form.time.value ? new Date(form.date.value + "T" + form.time.value) : new Date();
    var keep = chosen;
    var rows = CLASSES.map(function (c) {
      chosen = c;
      var price = window.priceFor(window.trip);
      var pick = new Date(start.getTime() + (later ? 0 : c.wait * 60000));
      var arrive = new Date(pick.getTime() + window.trip.minutes * 60000);
      return '<button type="button" class="cls-row' + (c === keep ? " on" : "") + '" data-cls="' + c.id + '">' + CAR +
        '<span class="cls-main"><b>' + c.name + (c.seats ? ' <i class="cls-seats">' + c.seats + "</i>" : "") + "</b>" +
        '<span class="cls-sub">' + clock(arrive) + " · " + Math.round(window.trip.minutes) + " " + t("min") + "</span>" +
        '<span class="cls-sub">' + esc(t(c.id)) + "</span></span>" +
        '<span class="cls-price">' + money(price) + "</span></button>";
    }).join("");
    chosen = keep;
    var when = later && form.date.value ? t("planned").replace("{d}", new Date(form.date.value + "T" + form.time.value)
      .toLocaleString(TEXT[lang].locale, { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })) : t("now");
    box.innerHTML = '<p class="cls-title">' + t("title") + "</p>" + rows +
      '<p class="cls-car-note">' + t("vehicle") + "</p>" +
      '<div class="cls-pay"><span class="cls-cash" aria-hidden="true">€</span><span>' + t("cash") + "</span></div>" +
      '<div class="cls-go"><button type="button" class="btn btn-main cls-choose">' + t("choose").replace("{c}", chosen.name) + "</button>" +
      '<button type="button" class="cls-cal" aria-label="' + esc(when) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>' +
      '<p class="cls-when">' + esc(when) + (later ? ' · <button type="button" class="link-btn cls-now">' + t("pickNow") + "</button>" : "") + "</p>";

  }

  // The date and time fields move under the button while a time is being picked.
  var laterRow = document.getElementById("later-row");
  function placeLater() {
    if (window.tShowLater) return window.tShowLater();
    if (laterRow.parentNode !== box) box.appendChild(laterRow);
    laterRow.hidden = false;
  }
  function setMode(v) {
    var r = form.querySelector('input[name=mode][value="' + v + '"]');
    r.checked = true;
    r.dispatchEvent(new Event("change", { bubbles: true }));
  }

  box.addEventListener("click", function (e) {
    var row = e.target.closest("[data-cls]");
    if (row) {
      chosen = CLASSES.filter(function (c) { return c.id === row.getAttribute("data-cls"); })[0];
      if (form.parcel) { form.parcel.checked = chosen.id === "courier"; form.parcel.dispatchEvent(new Event("change", { bubbles: true })); }
      window.showPrice();
      askContact();
      return;
    }
    if (e.target.closest(".cls-cal")) { setMode("later"); placeLater(); form.date.scrollIntoView({ block: "center", behavior: "smooth" }); form.date.focus(); return; }
    if (e.target.closest(".cls-now")) { setMode("asap"); laterRow.hidden = true; return; }
    if (e.target.closest(".cls-choose")) {
      // Name and phone are the last step; with both filled in, the request goes out at once.
      if (form.name.value.trim() && form.phone.value.trim()) form.requestSubmit();
      else askContact();
    }
  });

  // Class chosen: the keyboard opens for the name, the phone right below it.
  function askContact() {
    var f = !form.name.value.trim() ? form.name : !form.phone.value.trim() ? form.phone : null;
    if (!f) return;
    f.focus({ preventScroll: true });
    setTimeout(function () { f.scrollIntoView({ block: "center", behavior: "smooth" }); }, 250);
  }
  form.name.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); form.phone.focus(); } });

  var baseShow = window.showPrice;
  window.showPrice = function () { baseShow(); render(); };
  document.querySelectorAll("[data-lang]").forEach(function (b) { b.addEventListener("click", function () { setTimeout(render, 0); }); });

  // Pick-up from the phone's position, right away, like the big ride apps. Then the cursor waits in "Destination".
  function autoLocate() {
    if (form.from.value.trim() || !navigator.geolocation) return;
    statusEl.textContent = t("locating");
    document.getElementById("locate").click();
    setTimeout(function () { if (statusEl.textContent === t("locating")) statusEl.textContent = ""; }, 9000);
  }
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: "geolocation" }).then(function (p) { if (p.state !== "denied") autoLocate(); }, autoLocate);
  } else autoLocate();
})();
