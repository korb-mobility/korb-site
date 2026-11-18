/*! © Transfer. Alle Rechte vorbehalten. Vervielfältigung, Weitergabe oder Nutzung dieses Codes,
    auch in Teilen, nur mit schriftlicher Genehmigung von Transfer. */
/* After a ride request: the customer waits here and follows the ride live. */
(function () {
  var POLL_MS = 4000;
  var WAIT_MIN = 10;
  var api = (function () {
    var u = new URL(CONFIG.bookingsEndpoint);
    return { base: u.origin + "/rest/v1/rpc/", key: u.searchParams.get("apikey") };
  })();

  var box = document.getElementById("sent");
  var el = function (id) { return document.getElementById(id); };
  var current = null;     // { token, phone, name, wa }
  var last = null;        // last status answer
  var timer = null;
  var liveMap = null, driverMarker = null;

  function rpc(name, args) {
    return fetch(api.base + name, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: api.key },
      body: JSON.stringify(args)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  function t(key) { return TEXT[lang][key] || TEXT.de[key] || key; }
  function fill(text, values) {
    return text.replace(/\{(\w+)\}/g, function (_, k) { return values[k] == null ? "" : values[k]; });
  }

  function save() {
    if (current && current.follow) return;
    store("t-ride", current ? JSON.stringify(current) : "");
  }

  // Called by the booking form once the request is stored.
  window.tLiveStart = function (token, info) {
    current = { token: token, name: info.name, phone: info.phone, wa: info.wa, when: info.when, at: Date.now() };
    save();
    open();
  };

  // Words for the ride view that only this file uses.
  var LV = {
    de: { steps: ["Gesendet", "Angenommen", "Fahrer da", "Unterwegs"], chat: "Nachrichten mit {name}", empty: "Noch keine Nachrichten. Schreiben Sie Ihrem Fahrer hier.",
      quick: ["Ich bin da", "Ich komme gleich", "Wo sind Sie?"], newMsg: "Neue Nachricht" },
    en: { steps: ["Sent", "Accepted", "Driver here", "On the way"], chat: "Messages with {name}", empty: "No messages yet. Write to your driver here.",
      quick: ["I'm here", "Coming now", "Where are you?"], newMsg: "New message" },
    el: { steps: ["Στάλθηκε", "Αποδεκτό", "Ο οδηγός ήρθε", "Καθ' οδόν"], chat: "Μηνύματα με {name}", empty: "Δεν υπάρχουν μηνύματα. Γράψτε στον οδηγό σας εδώ.",
      quick: ["Είμαι εδώ", "Έρχομαι αμέσως", "Πού είστε;"], newMsg: "Νέο μήνυμα" }
  };
  function lv() { return LV[lang] || LV.de; }
  function sendChat(body) {
    if (!current || !body) return;
    rpc("chat_send", { p_token: current.token, p_body: body }).then(chatPoll, function () {});
  }
  el("chat-quick").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) sendChat(b.textContent);
  });

  // Notifications from the driver to this phone, also with the browser closed (Web Push).
  // Android: allowed with one tap. iPhone: only once the page is on the home screen (Apple's rule).
  var VAPID = "BI9kZOlGqYdjcQjuijQsMtEFQ3Z1xeZ-vYiWrHAqtOVo9kpnkXrG1urFnevXhm4Vt-4FkWWVDLpoDnYhhJUkjuE";
  var NT = {
    de: { on: "Benachrichtigen, wenn der Fahrer kommt", ok: "Sie werden benachrichtigt, auch wenn die Seite zu ist.", ios: "Für Benachrichtigungen auf dem iPhone: Teilen-Symbol → „Zum Home-Bildschirm“, dann die Seite von dort öffnen.", no: "Benachrichtigungen sind in diesem Browser blockiert." },
    en: { on: "Notify me when the driver comes", ok: "You will be notified, even with the page closed.", ios: "For notifications on iPhone: Share icon → “Add to Home Screen”, then open the page from there.", no: "Notifications are blocked in this browser." },
    el: { on: "Ειδοποίησέ με όταν έρχεται ο οδηγός", ok: "Θα ειδοποιηθείτε, ακόμα κι αν η σελίδα είναι κλειστή.", ios: "Για ειδοποιήσεις στο iPhone: Κοινοποίηση → «Προσθήκη στην οθόνη Αφετηρίας», μετά ανοίξτε τη σελίδα από εκεί.", no: "Οι ειδοποιήσεις είναι μπλοκαρισμένες σε αυτόν τον browser." }
  };
  function nt(k) { return (NT[lang] || NT.de)[k]; }
  var iOS = /iP(hone|ad|od)/.test(navigator.userAgent);
  var standalone = window.matchMedia && matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  var pushOk = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  function keyBytes(s) {
    var p = s.replace(/-/g, "+").replace(/_/g, "/"); p += "===".slice((p.length + 3) % 4);
    return Uint8Array.from(atob(p), function (c) { return c.charCodeAt(0); });
  }
  function b64(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function subscribe(ask) {
    if (!current || current.follow || !pushOk) return Promise.resolve(false);
    if (Notification.permission === "denied") return Promise.resolve(false);
    if (!ask && Notification.permission !== "granted") return Promise.resolve(false);
    return navigator.serviceWorker.register("sw.js").then(function () { return navigator.serviceWorker.ready; }).then(function (reg) {
      return (Notification.permission === "granted" ? Promise.resolve("granted") : Notification.requestPermission()).then(function (p) {
        if (p !== "granted") return false;
        return reg.pushManager.getSubscription().then(function (s) {
          return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID) });
        }).then(function (s) {
          return rpc("customer_push_subscribe", { p_token: current.token, p_endpoint: s.endpoint,
            p_p256dh: b64(s.getKey("p256dh")), p_auth: b64(s.getKey("auth")) }).then(function () { return true; });
        });
      });
    }).catch(function () { return false; });
  }
  function paintNotify(done) {
    var box = el("live-notify");
    var active = current && !current.follow && last && ["new", "accepted", "on_the_way", "arrived"].indexOf(last.status) >= 0;
    if (!active) { box.hidden = true; return; }
    box.hidden = false;
    var btn = el("notify-on"), note = el("notify-note");
    if (done || (pushOk && Notification.permission === "granted")) { btn.hidden = true; note.textContent = nt("ok"); return; }
    if (iOS && !standalone) { btn.hidden = true; note.textContent = nt("ios"); return; }
    if (!pushOk || Notification.permission === "denied") { btn.hidden = true; note.textContent = pushOk ? nt("no") : ""; box.hidden = !pushOk; return; }
    btn.hidden = false; btn.textContent = nt("on"); note.textContent = "";
  }
  el("notify-on").addEventListener("click", function () {
    subscribe(true).then(function (ok) { paintNotify(ok); });
  });

  function open() {
    // The page turns into the ride view: the headline goes, the card moves to the top.
    document.body.classList.add("riding");
    form.hidden = true;
    box.hidden = false;
    el("sticky").hidden = true;
    el("sent-wa").href = current.wa || waLink(TEXT[lang].greet);
    box.focus({ preventScroll: true });
    requestAnimationFrame(function () {
      var top = 0;
      if (window.tLenis) {
        window.tLenis.resize();
        window.tLenis.scrollTo(top, { immediate: true, force: true });
      } else {
        window.scrollTo(0, top);
      }
    });
    render({ status: "new", when: current.when || "asap" });
    poll();
  }

  /* The customer may share their position, so the driver finds them. Only after a tap, only while waiting. */
  var sharing = false, watchId = null, lastSent = 0;
  function stopSharing() {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    sharing = false;
  }
  el("live-share").addEventListener("click", function () {
    if (!current || !("geolocation" in navigator)) return;
    watchId = navigator.geolocation.watchPosition(function (p) {
      sharing = true;
      el("live-share").hidden = true;
      el("live-shared").hidden = false;
      if (Date.now() - lastSent < 8000) return;
      lastSent = Date.now();
      rpc("customer_ping", { p_token: current.token, p_lat: p.coords.latitude, p_lon: p.coords.longitude }).catch(function () {});
    }, function () { stopSharing(); }, { enableHighAccuracy: true, maximumAge: 5000 });
  });

  /* Chat with the driver while the ride is on. */
  var chatAfter = 0, chatSeen = false;
  // The driver may write in another language: the message shows in the language chosen on this page,
  // marked "translated"; a tap shows the original. Language detection by the free MyMemory service.
  var TR = { de: ["Übersetzt · tippen für Original", "Original · tippen für Übersetzung"],
             en: ["Translated · tap for original", "Original · tap for translation"],
             el: ["Μεταφρασμένο · πατήστε για το πρωτότυπο", "Πρωτότυπο · πατήστε για μετάφραση"] };
  function translateInto(p, text) {
    var target = lang;
    fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text.slice(0, 480)) + "&langpair=" + encodeURIComponent("Autodetect|" + target))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var data = d && d.responseData;
        if (!data) return;
        var detected = String(data.detectedLanguage || "").slice(0, 2).toLowerCase();
        var t = String(data.translatedText || "").trim();
        if (!t || detected === target || t.toLowerCase() === text.trim().toLowerCase() || /^MYMEMORY WARNING/.test(t)) return;
        var shown = true;
        var body = document.createElement("span");
        var note = document.createElement("small");
        note.className = "msg-tr";
        function paint() { body.textContent = shown ? t : text; note.textContent = (TR[lang] || TR.de)[shown ? 0 : 1]; }
        p.textContent = "";
        p.appendChild(body); p.appendChild(note);
        p.style.cursor = "pointer";
        p.addEventListener("click", function () { shown = !shown; paint(); });
        paint();
      }).catch(function () {});
  }
  function chatPoll() {
    if (!current) return;
    rpc("chat_list", { p_token: current.token, p_after: chatAfter }).then(function (list) {
      list.forEach(function (m) {
        chatAfter = Math.max(chatAfter, m.id);
        var p = document.createElement("p");
        p.className = "msg " + (m.sender === "customer" ? "me" : "them");
        p.textContent = m.body;
        el("chat-list").appendChild(p);
        if (m.sender !== "customer") translateInto(p, m.body);
        if (m.sender === "driver" && document.hidden) document.title = "✉ " + document.title.replace(/^✉ /, "");
      });
      if (list.length) {
        el("chat-list").scrollTop = el("chat-list").scrollHeight;
        // A new message from the driver: bring the chat into view, so nobody has to scroll for it.
        if (list.some(function (m) { return m.sender === "driver"; }) && chatSeen) el("live-chat").scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      chatSeen = true;
      el("chat-list").setAttribute("data-empty", lv().empty);
    }, function () {});
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) document.title = document.title.replace(/^✉ /, ""); });
  el("chat-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var body = el("chat-in").value.trim();
    if (!body || !current) return;
    el("chat-in").value = "";
    rpc("chat_send", { p_token: current.token, p_body: body }).then(chatPoll, function () {});
  });

  function close() {
    clearTimeout(timer);
    current = null;
    last = null;
    save();
    if (liveMap) { liveMap.remove(); liveMap = null; driverMarker = null; }
    chatAfter = 0;
    stopSharing();
    el("chat-list").textContent = "";
    box.hidden = true;
    form.hidden = false;
    document.body.classList.remove("riding");
  }

  function poll() {
    clearTimeout(timer);
    if (!current) return;
    rpc("booking_status", { p_token: current.token }).then(function (s) {
      last = s;
      render(s);
      if (["done", "cancelled", "expired", "rejected"].indexOf(s.status) < 0) timer = setTimeout(poll, POLL_MS);
    }, function () {
      timer = setTimeout(poll, POLL_MS * 2);
    });
  }

  function render(s) {
    var d = s.driver || {};
    var first = (current && current.name || "").split(/\s+/)[0];
    var title = "", sub = "";
    var later = s.when && s.when !== "asap";
    switch (s.status) {
      case "new":
        if (later) {
          title = t("wLater");
          sub = current && current.phone ? fill(t("wLaterSub"), { phone: current.phone }) : t("wLaterSub").split(/(?<=\.) /)[0];
        } else {
          title = t("wSearch");
          var started = s.created_at ? new Date(s.created_at).getTime() : current.at;
          var now = s.now ? new Date(s.now).getTime() : Date.now();
          var left = Math.max(0, WAIT_MIN * 60 - Math.round((now - started) / 1000));
          sub = t("wSearchSub") + " " + fill(t("wLeft"), { m: Math.floor(left / 60), s: ("0" + left % 60).slice(-2) });
        }
        break;
      case "accepted": title = fill(t("wAccepted"), { name: d.name }); break;
      case "on_the_way": title = fill(t("wComing"), { name: d.name }); break;
      case "arrived": title = fill(t("wArrived"), { name: d.name }); sub = t("wArrivedSub"); break;
      case "picked_up": title = t("wPicked"); break;
      case "done": title = s.rated ? t("wThanks") : fill(t("wDone"), { name: first }); break;
      case "expired": title = t("wExpired"); sub = t("wExpiredSub"); break;
      default:
        title = t("wCancelled");
        if (s.cancel_reason === "no_show") sub = fill(t("wNoShow"), { fee: s.cancel_fee ? money(s.cancel_fee) : "0 €" });
        else if (s.cancel_reason) sub = t("wDriverCancelled");
    }
    if ((s.status === "accepted" || s.status === "on_the_way") && s.eta_min != null) {
      sub = fill(t("wEta"), { n: Math.max(1, s.eta_min) });
    }
    el("live-title").textContent = title;
    el("live-sub").textContent = sub;
    box.setAttribute("data-status", s.status);

    var showDriver = !!s.driver && ["accepted", "on_the_way", "arrived", "picked_up"].indexOf(s.status) >= 0;
    el("live-driver").hidden = !showDriver;
    if (showDriver) {
      el("live-name").textContent = d.name || "";
      // Always the same car: shown with the plate, like the big ride apps.
      var car = { de: "Viertüriges Auto", en: "Four-door car", el: "Τετράπορτο αυτοκίνητο" }[lang] || "";
      el("live-plate").textContent = car + (d.plate ? " · " + d.plate : "");
      var r = d.rating || {};
      el("live-stars").textContent = r.count ? "★ " + Number(r.avg).toFixed(1).replace(".", lang === "en" ? "." : ",") : "";
      // The driver's photo, asked once per ride.
      if (current && current.photoFor !== current.token) {
        current.photoFor = current.token;
        rpc("booking_driver_photo", { p_token: current.token }).then(function (p) {
          var img = el("live-photo");
          if (!(p && p.photo && /^data:image\/jpeg;base64,/.test(p.photo))) { if (img) img.remove(); return; }
          // Made only when there is a photo, so the page never holds an empty image.
          if (!img) {
            img = document.createElement("img");
            img.id = "live-photo"; img.className = "live-photo"; img.alt = ""; img.width = 56; img.height = 56;
            el("live-driver").insertBefore(img, el("live-name"));
          }
          img.src = p.photo;
        }, function () {});
      }
    }

    var active = ["new", "accepted", "on_the_way", "arrived"].indexOf(s.status) >= 0;
    el("live-cancel").hidden = !active;
    el("sent-new").hidden = active || s.status === "picked_up";
    el("live-rate").hidden = !(s.status === "done" && !s.rated);
    el("sent-wa").hidden = !(s.status === "expired" || s.status === "new" && later);
    el("live-call").hidden = !(s.status === "expired" || showDriver);

    var waitingForCar = ["new", "accepted", "on_the_way", "arrived"].indexOf(s.status) >= 0;
    el("live-share").hidden = !waitingForCar || sharing || !("geolocation" in navigator);
    el("live-shared").hidden = !waitingForCar || !sharing;
    if (!waitingForCar) stopSharing();

    var step = { "new": 0, accepted: 1, on_the_way: 1, arrived: 2, picked_up: 3, done: 4 }[s.status];
    var steps = el("live-steps");
    steps.hidden = step == null;
    if (step != null) [].forEach.call(steps.children, function (li, i) {
      li.textContent = lv().steps[i];
      li.className = i < step ? "done" : i === step ? "now" : "";
    });

    var chatting = ["accepted", "on_the_way", "arrived", "picked_up"].indexOf(s.status) >= 0;
    el("live-chat").hidden = !chatting;
    if (chatting) {
      el("chat-title").textContent = fill(lv().chat, { name: d.name || "" });
      var q = el("chat-quick");
      if (q.getAttribute("data-lang") !== lang + s.status) {
        q.setAttribute("data-lang", lang + s.status);
        q.innerHTML = s.status === "picked_up" ? "" : lv().quick.map(function (x) { return '<button type="button">' + x.replace(/[<>&]/g, "") + "</button>"; }).join("");
      }
    }
    if (chatting) chatPoll();

    drawLive(s);
    paintNotify(false);
    if (current && current.pushFor !== current.token && pushOk && Notification.permission === "granted") {
      current.pushFor = current.token;
      subscribe(false);
    }
  }

  function drawLive(s) {
    var mapBox = el("live-map");
    var want = s.driver && s.driver.lat != null && s.from && s.from.lat != null;
    mapBox.hidden = !want;
    if (!want || !window.maplibregl) return;
    var me = [s.from.lon, s.from.lat], car = [s.driver.lon, s.driver.lat];
    if (!liveMap) {
      liveMap = new maplibregl.Map({ container: mapBox, style: CONFIG.services.mapStyle, center: car, zoom: 13,
        attributionControl: { compact: true }, cooperativeGestures: true, dragRotate: false });
      var pin = document.createElement("div");
      pin.className = "live-pin";
      new maplibregl.Marker({ element: pin }).setLngLat(me).addTo(liveMap);
      var dot = document.createElement("div");
      dot.className = "live-car";
      driverMarker = new maplibregl.Marker({ element: dot }).setLngLat(car).addTo(liveMap);
      liveMap.on("load", function () { fit(me, car); });
    } else {
      driverMarker.setLngLat(car);
      fit(me, car);
    }
  }

  function fit(a, b) {
    var bounds = new maplibregl.LngLatBounds(a, a).extend(b);
    liveMap.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 800 });
  }

  // Stars
  var stars = 0;
  document.querySelectorAll("#live-rate [data-star]").forEach(function (b) {
    b.addEventListener("click", function () {
      stars = Number(b.getAttribute("data-star"));
      document.querySelectorAll("#live-rate [data-star]").forEach(function (o) {
        o.setAttribute("aria-pressed", String(Number(o.getAttribute("data-star")) <= stars));
      });
      el("live-rate-send").disabled = false;
    });
  });
  el("live-rate-send").addEventListener("click", function () {
    if (!stars || !current) return;
    el("live-rate-send").disabled = true;
    rpc("rate_ride", { p_token: current.token, p_stars: stars, p_comment: el("live-comment").value }).then(function () {
      last.rated = true;
      render(last);
    }, function () { el("live-rate-send").disabled = false; });
  });

  el("live-cancel").addEventListener("click", function () {
    if (!current || !confirm(t("wCancelAsk"))) return;
    rpc("cancel_booking", { p_token: current.token }).then(poll, poll).then(toTop);
  });
  el("sent-new").addEventListener("click", function () { close(); toTop(); });

  // After cancelling or starting again the page goes back to its top, never left at the bottom.
  function toTop() {
    requestAnimationFrame(function () {
      if (window.tLenis) { window.tLenis.resize(); window.tLenis.scrollTo(0, { immediate: true, force: true }); }
      window.scrollTo(0, 0);
    });
  }

  // Language switch: redraw the texts.
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { if (current && last) render(last); });
  });

  // "Share ride": a link that shows this ride live to someone else, read-only.
  el("live-follow").addEventListener("click", function () {
    if (!current) return;
    var url = location.origin + location.pathname + "#follow=" + current.token;
    if (navigator.share) navigator.share({ title: "Transfer", url: url }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { el("live-follow").lastChild.textContent = t("copied"); });
  });
  setInterval(function () {
    var going = current && !current.follow && last && ["accepted", "on_the_way", "arrived", "picked_up"].indexOf(last.status) >= 0;
    el("live-follow").hidden = !going;
  }, 1000);

  // Someone opened a shared link: follow that ride, without being able to change it.
  var follow = /[#&]follow=([0-9a-f]{16,64})/.exec(location.hash);
  if (follow) {
    current = { token: follow[1], follow: true, at: Date.now() };
    box.classList.add("follow");
    open();
    return;
  }

  // The link the WhatsApp assistant sends: the customer's own ride, with chat and cancel.
  var own = /[#&]ride=([0-9a-f]{16,64})/.exec(location.hash);
  if (own) {
    current = { token: own[1], at: Date.now() };
    save();
    history.replaceState(null, "", location.pathname + location.search);
    open();
    return;
  }

  // Back on the page after closing it: continue where the customer was.
  try {
    var saved = JSON.parse(store("t-ride") || "null");
    if (saved && saved.token && Date.now() - saved.at < 12 * 3600 * 1000) {
      // Only reopen a ride that is still going, or one that waits for the customer's rating.
      rpc("booking_status", { p_token: saved.token }).then(function (s) {
        var going = ["new", "accepted", "on_the_way", "arrived", "picked_up"].indexOf(s.status) >= 0;
        if (going || (s.status === "done" && !s.rated)) {
          current = saved;
          open();
        } else {
          store("t-ride", "");
        }
      }, function () {});
    }
  } catch (e) {}
})();
