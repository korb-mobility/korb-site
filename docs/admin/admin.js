/*! © Transfer. Alle Rechte vorbehalten. Vervielfältigung, Weitergabe oder Nutzung dieses Codes,
    auch in Teilen, nur mit schriftlicher Genehmigung von Transfer. */
/* Transfer Zentrale: live map, dispatch, phone bookings, rides, drivers, road reports. */
(function () {
  var ENDPOINT = "https://qdrwssvwlpbloqnnyrzk.supabase.co/rest/v1/rpc/book?apikey=sb_publishable_hLvHm_ujPZSNsEoxoiEdiw_2h7lTKjC";
  var TRAFFIC_KEY = "Xzl9mut4JQuFweqIwy07a9OMZnsWfte6";
  var PRICING = { base: 0.5, perKm: 1.58, perMin: 0.25, minFare: 7, roundUpTo: 0.1, trafficPerMin: 0.20,
    peak: { factor: 1.15, days: [1, 2, 3, 4, 5], windows: [["08:00", "10:00"], ["15:30", "17:30"]] } };
  var POLL_MS = 5000;

  var u = new URL(ENDPOINT), base = u.origin + "/rest/v1/rpc/", key = u.searchParams.get("apikey");
  var $ = function (id) { return document.getElementById(id); };
  var store = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } };
  var lang = store("t-admin-lang") || "de";
  var token = null; // kept in this tab only; a closed tab signs out
  try { token = sessionStorage.getItem("t-admin"); } catch (e) {}
  var data = null, map = null, markers = [], driversById = {}, timer = null;

  /* ---------- Texts ---------- */
  var T = {
    de: { central: "Zentrale", pin: "Fahrer-PIN", password: "Admin-Passwort", signIn: "Anmelden", signOut: "Abmelden", wrong: "PIN oder Passwort falsch.",
      locked: "Zu viele Versuche. Bitte in 15 Minuten noch einmal.", tLive: "Live", tRides: "Fahrten", tPhone: "Telefonbuchung", tDrivers: "Fahrer", tReports: "Meldungen",
      open: "Offene Anfragen", active: "Laufende Fahrten", drivers: "Fahrer", today: "Heute", week: "Diese Woche", month: "Dieser Monat", rides: "Fahrten",
      requests: "Anfragen heute", cancelled: "Storniert heute", expired: "Abgelaufen heute", rating: "Bewertung", online: "online", offline: "offline",
      assign: "Fahrer", assignBtn: "Zuweisen", cancel: "Stornieren", cancelAsk: "Diese Fahrt wirklich stornieren?", none: "Nichts da.", ago: "vor {n} Min.",
      sAll: "Alle", s_new: "Neu", s_accepted: "Angenommen", s_on_the_way: "Unterwegs", s_arrived: "Am Abholort", s_picked_up: "Fahrgast an Bord",
      s_done: "Abgeschlossen", s_cancelled: "Storniert", s_expired: "Abgelaufen", s_rejected: "Abgelehnt",
      d1: "Heute", d7: "7 Tage", d30: "30 Tage", d365: "1 Jahr", search: "Name, Telefon, Adresse, Nr.", hWhen: "Zeit", hNr: "Nr.", hCustomer: "Kunde",
      hRoute: "Strecke", hDriver: "Fahrer", hStatus: "Status", hPrice: "Preis", sumLine: "{n} Fahrten · {s} abgeschlossen",
      phoneTitle: "Fahrt am Telefon aufnehmen", cName: "Name des Kunden", cPhone: "Telefon", from: "Abholung", to: "Ziel", when: "Wann", asap: "Sofort",
      later: "Termin", date: "Datum", time: "Uhrzeit", people: "Personen", price: "Preis (€)", toAll: "An alle senden", note: "Notiz für den Fahrer",
      book: "Fahrt anlegen", booked: "Fahrt angelegt (Nr. {nr}).", quote: "{km} km · {min} Min. · Vorschlag {price}", pickAddr: "Bitte die Adresse aus der Liste wählen.",
      newDriver: "+ Neuer Fahrer", hName: "Name", hPlate: "Kennzeichen", hType: "Art", hState: "Status", hRides: "Fahrten", hSum: "Umsatz", hCancelled: "Storniert",
      newPin: "Neue PIN (4 Ziffern)", activeLbl: "Aktiv (darf sich anmelden)", save: "Speichern", close: "Schließen", saved: "Gespeichert.", edit: "Bearbeiten",
      addDriver: "Neuer Fahrer", editDriver: "Fahrer bearbeiten", inactive: "gesperrt", reportsHint: "Meldungen der Fahrer aus den letzten 2 Stunden. Falsches oder Unpassendes hier löschen.",
      del: "Löschen", rep_accident: "Unfall", rep_jam: "Stau", rep_roadworks: "Baustelle", rep_closed: "Straße gesperrt", rep_hazard: "Gefahr", rep_breakdown: "Pannenfahrzeug",
      phone: "Telefon", payment: "Bezahlung", km: "Strecke", min: "Dauer", source: "Quelle", created: "Eingegangen", eta: "Ankunft in", noteL: "Notiz",
      stars: "Bewertung Fahrer", cstars: "Bewertung Kunde", comment: "Kommentar", reason: "Grund", fee: "Gebühr", err: "Fehler: {e}" },
    el: { central: "Κέντρο", pin: "PIN οδηγού", password: "Κωδικός admin", signIn: "Σύνδεση", signOut: "Αποσύνδεση", wrong: "Λάθος PIN ή κωδικός.",
      locked: "Πολλές προσπάθειες. Δοκίμασε σε 15 λεπτά.", tLive: "Live", tRides: "Διαδρομές", tPhone: "Τηλεφωνική κράτηση", tDrivers: "Οδηγοί", tReports: "Αναφορές",
      open: "Ανοιχτά αιτήματα", active: "Διαδρομές σε εξέλιξη", drivers: "Οδηγοί", today: "Σήμερα", week: "Εβδομάδα", month: "Μήνας", rides: "διαδρομές",
      requests: "Αιτήματα σήμερα", cancelled: "Ακυρώσεις σήμερα", expired: "Έληξαν σήμερα", rating: "Αξιολόγηση", online: "online", offline: "offline",
      assign: "Οδηγός", assignBtn: "Ανάθεση", cancel: "Ακύρωση", cancelAsk: "Να ακυρωθεί σίγουρα αυτή η διαδρομή;", none: "Τίποτα.", ago: "πριν {n} λεπ.",
      sAll: "Όλες", s_new: "Νέα", s_accepted: "Αποδεκτή", s_on_the_way: "Καθ' οδόν", s_arrived: "Στην παραλαβή", s_picked_up: "Επιβάτης μέσα",
      s_done: "Ολοκληρώθηκε", s_cancelled: "Ακυρώθηκε", s_expired: "Έληξε", s_rejected: "Απορρίφθηκε",
      d1: "Σήμερα", d7: "7 μέρες", d30: "30 μέρες", d365: "1 χρόνος", search: "Όνομα, τηλέφωνο, διεύθυνση, αρ.", hWhen: "Ώρα", hNr: "Αρ.", hCustomer: "Πελάτης",
      hRoute: "Διαδρομή", hDriver: "Οδηγός", hStatus: "Κατάσταση", hPrice: "Τιμή", sumLine: "{n} διαδρομές · {s} ολοκληρωμένες",
      phoneTitle: "Καταχώριση διαδρομής από τηλέφωνο", cName: "Όνομα πελάτη", cPhone: "Τηλέφωνο", from: "Παραλαβή", to: "Προορισμός", when: "Πότε", asap: "Τώρα",
      later: "Ραντεβού", date: "Ημερομηνία", time: "Ώρα", people: "Άτομα", price: "Τιμή (€)", toAll: "Σε όλους", note: "Σημείωση για τον οδηγό",
      book: "Καταχώριση", booked: "Η διαδρομή καταχωρίστηκε (αρ. {nr}).", quote: "{km} km · {min} λεπ. · πρόταση {price}", pickAddr: "Διάλεξε τη διεύθυνση από τη λίστα.",
      newDriver: "+ Νέος οδηγός", hName: "Όνομα", hPlate: "Πινακίδα", hType: "Τύπος", hState: "Κατάσταση", hRides: "Διαδρομές", hSum: "Τζίρος", hCancelled: "Ακυρώσεις",
      newPin: "Νέο PIN (4 ψηφία)", activeLbl: "Ενεργός (μπορεί να συνδεθεί)", save: "Αποθήκευση", close: "Κλείσιμο", saved: "Αποθηκεύτηκε.", edit: "Επεξεργασία",
      addDriver: "Νέος οδηγός", editDriver: "Επεξεργασία οδηγού", inactive: "κλειδωμένος", reportsHint: "Αναφορές οδηγών των τελευταίων 2 ωρών. Ό,τι είναι λάθος ή ακατάλληλο διαγράψ' το εδώ.",
      del: "Διαγραφή", rep_accident: "Ατύχημα", rep_jam: "Μποτιλιάρισμα", rep_roadworks: "Έργα", rep_closed: "Κλειστός δρόμος", rep_hazard: "Κίνδυνος", rep_breakdown: "Ακινητοποιημένο όχημα",
      phone: "Τηλέφωνο", payment: "Πληρωμή", km: "Απόσταση", min: "Διάρκεια", source: "Πηγή", created: "Ελήφθη", eta: "Άφιξη σε", noteL: "Σημείωση",
      stars: "Αξιολόγηση οδηγού", cstars: "Αξιολόγηση πελάτη", comment: "Σχόλιο", reason: "Λόγος", fee: "Χρέωση", err: "Σφάλμα: {e}" }
  };
  var t = function (k, v) { var s = (T[lang] || T.de)[k] || T.de[k] || k; if (v) Object.keys(v).forEach(function (n) { s = s.replace("{" + n + "}", v[n]); }); return s; };
  function applyTexts() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach(function (e) { e.textContent = t(e.getAttribute("data-t")); });
    document.querySelectorAll("[data-tp]").forEach(function (e) { e.placeholder = t(e.getAttribute("data-tp")); });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-lang") === lang); });
  }
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { lang = b.getAttribute("data-lang"); store("t-admin-lang", lang); applyTexts(); if (data) render(); });
  });

  var money = function (n) { return new Intl.NumberFormat(lang === "el" ? "el-GR" : "de-DE", { style: "currency", currency: "EUR" }).format(n || 0); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var when = function (iso) { if (!iso) return ""; var d = new Date(iso); return d.toLocaleString(lang === "el" ? "el-GR" : "de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); };
  var pickup = function (b) { return b.when === "asap" ? t("asap") : when(b.when); };
  var mins = function (iso) { return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000)); };
  var pill = function (s) { return '<span class="pill ' + esc(s) + '">' + esc(t("s_" + s)) + "</span>"; };

  /* ---------- Server ---------- */
  function rpc(fn, args) {
    args = args || {};
    if (fn !== "admin_login") args.p_token = token;
    return fetch(base + fn, { method: "POST", headers: { "Content-Type": "application/json", apikey: key }, body: JSON.stringify(args) })
      .then(function (r) {
        return r.text().then(function (body) {
          var j = body ? JSON.parse(body) : null;
          if (!r.ok) { if (j && j.code === "28000") signOut(); throw new Error((j && j.message) || r.status); }
          return j;
        });
      });
  }

  /* ---------- Sign-in ---------- */
  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    $("login-msg").textContent = "";
    rpc("admin_login", { p_pin: f.pin.value, p_password: f.password.value }).then(function (r) {
      f.password.value = "";
      if (r.error) { $("login-msg").textContent = r.error === "locked" ? t("locked") : t("wrong"); return; }
      token = r.token; try { sessionStorage.setItem("t-admin", token); } catch (x) {}
      start();
    }, function (x) { $("login-msg").textContent = t("err", { e: x.message }); });
  });
  function signOut() {
    if (token) fetch(base + "admin_logout", { method: "POST", headers: { "Content-Type": "application/json", apikey: key }, body: JSON.stringify({ p_token: token }) }).catch(function () {});
    token = null; try { sessionStorage.removeItem("t-admin"); } catch (x) {}
    clearInterval(timer); $("app").hidden = true; $("login").hidden = false;
  }
  $("logout").addEventListener("click", signOut);

  function start() {
    $("login").hidden = true; $("app").hidden = false;
    if (!map) initMap();
    refresh(); clearInterval(timer); timer = setInterval(refresh, POLL_MS);
  }

  /* ---------- Tabs ---------- */
  var tab = "live";
  document.querySelectorAll("[data-tab]").forEach(function (b) {
    b.addEventListener("click", function () {
      tab = b.getAttribute("data-tab");
      document.querySelectorAll("[data-tab]").forEach(function (x) { x.classList.toggle("on", x === b); });
      document.querySelectorAll("[data-pane]").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== tab; });
      if (tab === "live" && map) map.resize();
      if (tab === "rides") loadRides();
      if (tab === "drivers") loadDrivers();
      if (tab === "reports") renderReports();
    });
  });

  /* ---------- Overview (every 5 s) ---------- */
  function refresh() {
    rpc("admin_overview").then(function (d) { data = d; render(); }, function () {});
  }
  function render() {
    $("me").textContent = data.me;
    driversById = {}; data.drivers.forEach(function (d) { driversById[d.id] = d; });
    var s = data.stats;
    $("kpis").innerHTML = [
      [money(s.today.sum), t("today") + " · " + s.today.rides + " " + t("rides"), true],
      [money(s.week.sum), t("week") + " · " + s.week.rides + " " + t("rides")],
      [money(s.month.sum), t("month") + " · " + s.month.rides + " " + t("rides")],
      [s.requests_today, t("requests")], [s.cancelled_today, t("cancelled")], [s.expired_today, t("expired")],
      [s.rating.avg ? "★ " + s.rating.avg : "—", t("rating") + " (" + s.rating.count + ")"]
    ].map(function (k) { return '<div class="kpi"><b' + (k[2] ? ' class="mint"' : "") + ">" + esc(k[0]) + "</b><span>" + esc(k[1]) + "</span></div>"; }).join("");

    $("open-n").textContent = data.open.length;
    $("active-n").textContent = data.active.length;
    $("online-n").textContent = data.drivers.filter(function (d) { return d.online; }).length + "/" + data.drivers.filter(function (d) { return d.active; }).length;
    renderOpen(); renderActive(); renderDriverList(); renderMap(); fillDriverSelect();
    if (tab === "reports") renderReports();
  }

  function driverOptions(sel) {
    return data.drivers.filter(function (d) { return d.active; }).map(function (d) {
      return '<option value="' + d.id + '"' + (sel === d.id ? " selected" : "") + ">" + esc(d.name) + (d.online ? " ●" : "") + (d.ride ? " (" + t("s_" + d.ride) + ")" : "") + "</option>";
    }).join("");
  }

  function renderOpen() {
    var box = $("open-list");
    // Keep a selection the dispatcher is making while the list refreshes.
    var keep = {}; box.querySelectorAll("select").forEach(function (s) { keep[s.getAttribute("data-id")] = s.value; });
    if (box.contains(document.activeElement) && document.activeElement.tagName === "SELECT") return;
    box.innerHTML = data.open.length ? data.open.map(function (b) {
      var age = mins(b.created_at);
      return '<div class="item" data-detail="' + b.id + '"><div class="r"><b>' + esc(b.name) + '</b><span class="price">' + money(b.price) + "</span></div>" +
        '<div class="sub">' + esc(b.from) + " → " + esc(b.to) + "</div>" +
        '<div class="sub"><span class="' + (age >= 5 ? "age-old" : "") + '">' + t("ago", { n: age }) + "</span> · " + esc(pickup(b)) + (b.note ? " · " + esc(b.note) : "") + "</div>" +
        '<div class="acts"><select data-id="' + b.id + '">' + driverOptions(keep[b.id]) + '</select><button class="btn small main" data-assign="' + b.id + '">' + t("assignBtn") +
        '</button><button class="btn small danger" data-cancel="' + b.id + '">' + t("cancel") + "</button></div></div>";
    }).join("") : '<p class="empty">' + t("none") + "</p>";
  }
  function renderActive() {
    $("active-list").innerHTML = data.active.length ? data.active.map(function (b) {
      return '<div class="item" data-detail="' + b.id + '"><div class="r"><b>' + esc(b.name) + "</b>" + pill(b.status) + "</div>" +
        '<div class="sub">' + esc(b.driver || "—") + (b.eta != null && b.status !== "picked_up" ? " · " + t("eta") + " " + b.eta + " min" : "") + " · " + money(b.final || b.price) + "</div>" +
        '<div class="sub">' + esc(b.from) + " → " + esc(b.to) + "</div></div>";
    }).join("") : '<p class="empty">' + t("none") + "</p>";
  }
  function renderDriverList() {
    $("driver-list").innerHTML = data.drivers.filter(function (d) { return d.active; }).map(function (d) {
      var cls = d.ride ? "busy" : d.online ? "on" : "";
      return '<div class="item" data-focus="' + d.id + '"><div class="r"><span><span class="dot ' + cls + '"></span><b>' + esc(d.name) + "</b></span><span class=\"sub\">" +
        (d.ride ? t("s_" + d.ride) : d.online ? t("online") : t("offline")) + "</span></div>" +
        '<div class="sub">' + esc(d.plate || "") + (d.loc_at ? " · " + t("ago", { n: mins(d.loc_at) }) : "") + "</div></div>";
    }).join("");
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-assign]"), c = e.target.closest("[data-cancel]"), dtl = e.target.closest("[data-detail]"), f = e.target.closest("[data-focus]");
    if (a) {
      e.stopPropagation();
      var id = a.getAttribute("data-assign"), sel = document.querySelector('select[data-id="' + id + '"]');
      a.disabled = true;
      rpc("admin_assign", { p_booking: id, p_driver: sel.value }).then(refresh, function (x) { alert(t("err", { e: x.message })); a.disabled = false; });
      return;
    }
    if (c) {
      e.stopPropagation();
      if (!confirm(t("cancelAsk"))) return;
      rpc("admin_cancel", { p_booking: c.getAttribute("data-cancel") }).then(function () { refresh(); if (tab === "rides") loadRides(); }, function (x) { alert(t("err", { e: x.message })); });
      return;
    }
    if (e.target.closest("select, button")) return;
    if (dtl) { showDetail(dtl.getAttribute("data-detail")); return; }
    if (f && map) { var d = driversById[f.getAttribute("data-focus")]; if (d && d.lat) map.flyTo({ center: [d.lon, d.lat], zoom: 14 }); }
  });

  /* ---------- Map ---------- */
  function initMap() {
    map = new maplibregl.Map({ container: "map", style: "https://tiles.openfreemap.org/styles/dark", center: [8.68, 50.11], zoom: 10, attributionControl: { compact: true } });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  }
  var fitted = false;
  function renderMap() {
    if (!map) return;
    markers.forEach(function (m) { m.remove(); }); markers = [];
    var pts = [];
    function add(lat, lon, cls, html) {
      if (lat == null || lon == null) return;
      var el = document.createElement("div"); el.className = "mk " + cls;
      markers.push(new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(html)).addTo(map));
      pts.push([lon, lat]);
    }
    data.drivers.forEach(function (d) { if (d.active && d.online) add(d.lat, d.lon, "drv" + (d.ride ? " busy" : ""), "<b>" + esc(d.name) + "</b><br>" + esc(d.ride ? t("s_" + d.ride) : t("online"))); });
    data.open.forEach(function (b) { add(b.from_lat, b.from_lon, "req", "<b>" + esc(b.name) + "</b> · " + money(b.price) + "<br>" + esc(b.from)); });
    data.reports.forEach(function (r) { add(r.lat, r.lon, "rep", esc(t("rep_" + r.kind)) + " · " + t("ago", { n: r.minutes })); });
    if (!fitted && pts.length) {
      fitted = true;
      var bb = pts.reduce(function (b, p) { return [[Math.min(b[0][0], p[0]), Math.min(b[0][1], p[1])], [Math.max(b[1][0], p[0]), Math.max(b[1][1], p[1])]]; }, [pts[0], pts[0]]);
      map.fitBounds(bb, { padding: 80, maxZoom: 13, duration: 0 });
    }
  }

  /* ---------- Booking details ---------- */
  var lastRides = [];
  function showDetail(id) {
    var b = (data ? data.open.concat(data.active) : []).concat(lastRides).filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    var rows = [[t("hNr"), b.nr], [t("hStatus"), pill(b.status)], [t("created"), when(b.created_at)], [t("when"), pickup(b)],
      [t("hCustomer"), esc(b.name)], [t("phone"), b.phone ? '<a href="tel:' + esc(b.phone) + '">' + esc(b.phone) + "</a>" : ""],
      [t("from"), esc(b.from)], [t("to"), esc(b.to)], [t("km"), b.km ? Number(b.km).toFixed(1) + " km" : ""], [t("min"), b.minutes ? Math.round(b.minutes) + " min" : ""],
      [t("hPrice"), money(b.final || b.price)], [t("payment"), esc(b.payment || "cash")], [t("hDriver"), esc(b.driver || "—")], [t("source"), esc(b.source)],
      [t("noteL"), esc(b.note || "")], [t("reason"), esc(b.cancel_reason || "")], [t("fee"), b.cancel_fee ? money(b.cancel_fee) : ""],
      [t("stars"), b.stars ? "★ " + b.stars : ""], [t("comment"), esc(b.comment || "")], [t("cstars"), b.customer_stars ? "★ " + b.customer_stars : ""]]
      .filter(function (r) { return r[1]; });
    $("detail-body").innerHTML = "<h2>" + esc(b.name) + " · " + money(b.final || b.price) + "</h2><dl>" + rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>"; }).join("") + "</dl>" +
      (["new", "accepted", "on_the_way", "arrived", "picked_up"].indexOf(b.status) >= 0 ? '<button class="btn danger" data-cancel="' + b.id + '">' + t("cancel") + "</button>" : "");
    $("detail").showModal();
  }

  /* ---------- Rides ---------- */
  var searchTimer = null;
  function loadRides() {
    rpc("admin_bookings", { p_status: $("f-status").value, p_days: Number($("f-days").value), p_search: $("f-search").value.trim() || null }).then(function (list) {
      lastRides = list;
      var done = list.filter(function (b) { return b.status === "done"; });
      $("f-sum").textContent = t("sumLine", { n: list.length, s: money(done.reduce(function (a, b) { return a + Number(b.final || b.price || 0); }, 0)) });
      $("rides-body").innerHTML = list.map(function (b) {
        return '<tr data-detail="' + b.id + '"><td>' + when(b.created_at) + "</td><td>" + b.nr + "</td><td>" + esc(b.name) + '<br><span class="sub">' + esc(b.phone || "") +
          "</span></td><td>" + esc(b.from) + "<br>→ " + esc(b.to) + "</td><td>" + esc(b.driver || "—") + "</td><td>" + pill(b.status) + '</td><td class="num">' +
          money(b.final || b.price) + "</td><td>" + (b.source === "phone" ? "☎" : b.source === "street" ? "⊕" : "") + "</td></tr>";
      }).join("");
    }, function (x) { $("f-sum").textContent = t("err", { e: x.message }); });
  }
  ["f-status", "f-days"].forEach(function (id) { $(id).addEventListener("change", loadRides); });
  $("f-search").addEventListener("input", function () { clearTimeout(searchTimer); searchTimer = setTimeout(loadRides, 350); });
  $("f-csv").addEventListener("click", function () {
    var cols = ["nr", "created_at", "when", "status", "name", "phone", "from", "to", "km", "minutes", "price", "final", "payment", "driver", "source", "cancel_reason"];
    var csv = [cols.join(";")].concat(lastRides.map(function (b) {
      return cols.map(function (c) { return '"' + String(b[c] == null ? "" : b[c]).replace(/"/g, '""') + '"'; }).join(";");
    })).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = "transfer-fahrten-" + new Date().toISOString().slice(0, 10) + ".csv"; a.click();
  });

  /* ---------- Drivers ---------- */
  function loadDrivers() {
    rpc("admin_driver_stats", { p_days: Number($("ds-days").value) }).then(function (stats) {
      var by = {}; stats.forEach(function (s) { by[s.id] = s; });
      $("drivers-body").innerHTML = (data ? data.drivers : []).map(function (d) {
        var s = by[d.id] || {};
        return "<tr><td><b>" + esc(d.name) + "</b>" + (d.admin ? ' <span class="pill">admin</span>' : "") + "</td><td>" + esc(d.plate || "") + "</td><td>" + esc(d.vehicle_type) +
          "</td><td>" + (d.active ? '<span class="dot ' + (d.ride ? "busy" : d.online ? "on" : "") + '"></span>' + (d.online ? t("online") : t("offline")) : t("inactive")) +
          '</td><td class="num">' + (s.rides || 0) + '</td><td class="num">' + money(s.sum) + '</td><td class="num">' + Math.round(s.km || 0) + '</td><td class="num">' + (s.cancelled || 0) +
          '</td><td class="num">' + (s.stars || "—") + '</td><td><button class="btn small" data-edit="' + d.id + '">' + t("edit") + "</button></td></tr>";
      }).join("");
    });
  }
  $("ds-days").addEventListener("change", loadDrivers);
  function driverForm(d) {
    var f = $("driver-form"); f.hidden = false; $("driver-msg").textContent = "";
    $("driver-form-title").textContent = d ? t("editDriver") : t("addDriver");
    f.id.value = d ? d.id : ""; f.name.value = d ? d.name : ""; f.plate.value = d ? d.plate || "" : ""; f.type.value = d ? d.vehicle_type : "mietwagen";
    f.active.checked = d ? d.active : true; f.pin.value = ""; f.pin.required = !d; f.name.focus();
  }
  $("d-new").addEventListener("click", function () { driverForm(null); });
  $("driver-cancel").addEventListener("click", function () { $("driver-form").hidden = true; });
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-edit]"); if (b) driverForm(driversById[b.getAttribute("data-edit")]); });
  $("driver-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    rpc("admin_driver_save", { p_id: f.id.value || null, p_name: f.name.value, p_plate: f.plate.value, p_vehicle_type: f.type.value, p_active: f.active.checked, p_pin: f.pin.value || null })
      .then(function () { $("driver-msg").className = "msg ok"; $("driver-msg").textContent = t("saved"); f.pin.value = ""; refresh(); setTimeout(loadDrivers, 600); },
            function (x) { $("driver-msg").className = "msg"; $("driver-msg").textContent = t("err", { e: x.message }); });
  });

  /* ---------- Road reports ---------- */
  function renderReports() {
    if (!data) return;
    $("reports-list").innerHTML = data.reports.length ? data.reports.map(function (r) {
      return '<div class="item"><div class="r"><b>' + esc(t("rep_" + r.kind)) + '</b><span class="sub">' + t("ago", { n: r.minutes }) + "</span></div>" +
        '<div class="sub">' + esc(r.driver || "") + " · " + r.lat.toFixed(4) + ", " + r.lon.toFixed(4) + '</div><div class="acts"><a class="btn small" target="_blank" rel="noopener" href="https://www.google.com/maps?q=' +
        r.lat + "," + r.lon + '">Map</a><button class="btn small danger" data-rep="' + r.id + '">' + t("del") + "</button></div></div>";
    }).join("") : '<p class="empty">' + t("none") + "</p>";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-rep]"); if (!b) return;
    rpc("admin_report_delete", { p_id: Number(b.getAttribute("data-rep")) }).then(refresh);
  });

  /* ---------- Phone booking ---------- */
  var pf = $("phone-form"), picked = { from: null, to: null }, route = null;
  function fillDriverSelect() {
    var sel = pf.driver, v = sel.value;
    sel.innerHTML = '<option value="">' + esc(t("toAll")) + "</option>" + driverOptions(v);
  }
  ["from", "to"].forEach(function (k) {
    var box = document.querySelector('.sugg[data-for="' + k + '"]'), tm = null;
    pf[k].addEventListener("input", function () {
      picked[k] = null; route = null; $("quote").textContent = "";
      clearTimeout(tm);
      var q = pf[k].value.trim();
      if (q.length < 3) { box.innerHTML = ""; return; }
      tm = setTimeout(function () {
        fetch("https://photon.komoot.io/api/?limit=6&lang=de&lat=50.11&lon=8.68&q=" + encodeURIComponent(q)).then(function (r) { return r.json(); }).then(function (j) {
          box.innerHTML = "";
          (j.features || []).forEach(function (f) {
            var p = f.properties, label = [p.name, [p.street, p.housenumber].filter(Boolean).join(" "), [p.postcode, p.city].filter(Boolean).join(" ")]
              .filter(function (x, i, a) { return x && a.indexOf(x) === i; }).join(", ");
            var b = document.createElement("button"); b.type = "button"; b.textContent = label;
            b.onclick = function () { pf[k].value = label; picked[k] = { text: label, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] }; box.innerHTML = ""; quote(); };
            box.appendChild(b);
          });
        }).catch(function () {});
      }, 300);
    });
  });
  function rideStart() {
    if (pf.mode.value === "later" && pf.date.value && pf.time.value) return new Date(pf.date.value + "T" + pf.time.value);
    return new Date();
  }
  function priceFor(r) {
    var p = PRICING, delay = Math.max(r.minutes - r.free, 0), at = rideStart();
    var amount = Math.max(p.base + r.km * p.perKm + r.minutes * p.perMin + delay * p.trafficPerMin, p.minFare);
    var hm = ("0" + at.getHours()).slice(-2) + ":" + ("0" + at.getMinutes()).slice(-2);
    if (p.peak.days.indexOf(at.getDay()) >= 0 && p.peak.windows.some(function (w) { return hm >= w[0] && hm < w[1]; })) amount *= p.peak.factor;
    return Math.round(Math.ceil(amount / p.roundUpTo - 1e-9) * p.roundUpTo * 100) / 100;
  }
  function quote() {
    if (!picked.from || !picked.to) return;
    var a = picked.from, b = picked.to;
    fetch("https://api.tomtom.com/routing/1/calculateRoute/" + a.lat + "," + a.lon + ":" + b.lat + "," + b.lon + "/json?key=" + TRAFFIC_KEY + "&traffic=true&computeTravelTimeFor=all")
      .then(function (r) { return r.json(); }).then(function (j) {
        var s = j.routes[0].summary;
        route = { km: s.lengthInMeters / 1000, minutes: s.travelTimeInSeconds / 60, free: (s.noTrafficTravelTimeInSeconds || s.travelTimeInSeconds) / 60 };
        var price = priceFor(route);
        pf.price.value = price.toFixed(2);
        $("quote").textContent = t("quote", { km: route.km.toFixed(1), min: Math.round(route.minutes), price: money(price) });
      }).catch(function () {});
  }
  ["mode", "date", "time"].forEach(function (k) { pf[k].addEventListener("change", quote); });
  pf.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("phone-msg"); msg.className = "msg"; msg.textContent = "";
    if (!picked.from || !picked.to) { msg.textContent = t("pickAddr"); return; }
    var later = pf.mode.value === "later" && pf.date.value && pf.time.value;
    var ride = { lang: lang === "el" ? "el" : "de", name: pf.name.value.trim(), phone: pf.phone.value.trim(), note: pf.note.value.trim() || null,
      from: picked.from, to: picked.to, when: later ? pf.date.value + "T" + pf.time.value : "asap", people: Number(pf.people.value) || 1,
      payment: "cash", km: route ? Math.round(route.km * 10) / 10 : null, minutes: route ? Math.round(route.minutes) : null,
      price: pf.price.value ? Number(pf.price.value) : null };
    var driver = pf.driver.value;
    rpc("admin_book", { p_ride: JSON.stringify(ride) }).then(function (r) {
      var nr = String(r.id).slice(0, 8).toUpperCase();
      var next = driver ? rpc("admin_assign", { p_booking: r.id, p_driver: driver }) : Promise.resolve();
      return next.then(function () {
        msg.className = "msg ok"; msg.textContent = t("booked", { nr: nr });
        pf.reset(); picked = { from: null, to: null }; route = null; $("quote").textContent = ""; refresh();
      });
    }).catch(function (x) { msg.textContent = t("err", { e: x.message }); });
  });

  /* ---------- Go ---------- */
  applyTexts();
  if (token) start();
})();
