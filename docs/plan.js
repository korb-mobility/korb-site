/*! © Transfer. Alle Rechte vorbehalten. Vervielfältigung, Weitergabe oder Nutzung dieses Codes,
    auch in Teilen, nur mit schriftlicher Genehmigung von Transfer. */
/* "Plan your ride", like the big ride apps: "Now ▾" and "For me ▾" above the addresses,
   and the last destinations right under them, one tap each. */
(function () {
  if (!window.form) return;
  var T = {
    de: { now: "Sofort", later: "Termin", me: "Für mich", other: "Für jemand anderen", recent: "Zuletzt", km: "km" },
    en: { now: "Pick-up now", later: "Scheduled", me: "For me", other: "For someone else", recent: "Recent", km: "km" },
    el: { now: "Τώρα", later: "Ραντεβού", me: "Για μένα", other: "Για άλλον", recent: "Πρόσφατα", km: "χλμ." }
  };
  var t = function (k) { return (T[lang] || T.de)[k]; };
  var route = document.querySelector(".route-box");
  var laterRow = document.getElementById("later-row");
  var pax = document.getElementById("pax");
  var forOther = document.getElementById("for-other");

  var bar = document.createElement("div");
  bar.className = "plan-chips f-wide";
  route.parentNode.insertBefore(bar, route);
  var holder = document.createElement("div");
  holder.className = "plan-extra f-wide";
  route.parentNode.insertBefore(holder, route);

  var CLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var PERSON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6" fill="currentColor"/></svg>';
  var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>';

  function setMode(v) {
    var r = form.querySelector('input[name=mode][value="' + v + '"]');
    r.checked = true;
    r.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function laterLabel() {
    if (form.mode.value !== "later" || !form.date.value) return t("now");
    return new Date(form.date.value + "T" + form.time.value).toLocaleString(TEXT[lang].locale, { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }
  function render() {
    var later = form.mode.value === "later";
    var other = forOther && forOther.checked;
    bar.innerHTML = '<button type="button" class="plan-chip' + (later ? " on" : "") + '" data-plan="when">' + CLOCK + "<span>" + esc(laterLabel()) + "</span><b>▾</b></button>" +
      '<button type="button" class="plan-chip' + (other ? " on" : "") + '" data-plan="who">' + PERSON + "<span>" + t(other ? "other" : "me") + "</span><b>▾</b></button>";
  }
  // The time and the passenger fields open right here, under the chips.
  window.tShowLater = function () { holder.appendChild(laterRow); laterRow.hidden = false; render(); };
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("[data-plan]");
    if (!b) return;
    if (b.getAttribute("data-plan") === "when") {
      if (form.mode.value === "later") { setMode("asap"); laterRow.hidden = true; }
      else { setMode("later"); window.tShowLater(); form.date.focus(); }
    } else if (forOther) {
      forOther.checked = !forOther.checked;
      forOther.dispatchEvent(new Event("change", { bubbles: true }));
      if (forOther.checked) { holder.appendChild(pax); pax.hidden = false; form.paxName.focus(); } else pax.hidden = true;
    }
    render();
  });
  ["date", "time"].forEach(function (k) { form[k].addEventListener("change", render); });
  form.addEventListener("change", function (e) { if (e.target.name === "mode") render(); });

  // Last destinations: kept on this device only.
  var recentBox = document.createElement("div");
  recentBox.className = "plan-recent f-wide";
  route.parentNode.insertBefore(recentBox, route.nextSibling);
  function recent() { try { return JSON.parse(store("t-recent") || "[]"); } catch (e) { return []; } }
  function km(a, b) {
    var R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLon = (b.lon - a.lon) * Math.PI / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }
  function showRecent() {
    var list = recent();
    var hide = !list.length || (picked.to && form.to.value.trim());
    recentBox.hidden = hide;
    if (hide) return;
    recentBox.innerHTML = '<p class="plan-recent-title">' + t("recent") + "</p>" + list.map(function (p, i) {
      var d = picked.from && p.lat != null ? km(picked.from, p) : null;
      var parts = p.text.split(",");
      return '<button type="button" class="plan-place" data-recent="' + i + '">' + PIN + '<span class="plan-place-t"><b>' + esc(parts[0]) + "</b><small>" +
        esc(parts.slice(1).join(",").trim()) + "</small></span>" + (d != null ? '<em>' + d.toFixed(1).replace(".", lang === "en" ? "." : ",") + " " + t("km") + "</em>" : "") + "</button>";
    }).join("");
  }
  recentBox.addEventListener("click", function (e) {
    var b = e.target.closest("[data-recent]");
    if (!b) return;
    var p = recent()[Number(b.getAttribute("data-recent"))];
    if (p && window.tPick) window.tPick("to", { label: p.text, text: p.text, lat: p.lat, lon: p.lon });
    showRecent();
  });
  form.addEventListener("submit", function () {
    var p = picked.to;
    if (!p || p.lat == null) return;
    var text = form.to.value.trim();
    var list = recent().filter(function (x) { return x.text !== text; });
    list.unshift({ text: text, lat: p.lat, lon: p.lon });
    store("t-recent", JSON.stringify(list.slice(0, 5)));
  }, true);
  form.to.addEventListener("input", showRecent);
  setInterval(showRecent, 1500);

  document.querySelectorAll("[data-lang]").forEach(function (b) { b.addEventListener("click", function () { setTimeout(function () { render(); showRecent(); }, 0); }); });
  // "Plan for later" lower on the page: date and time, then up to the form with the ride already timed.
  var reserve = document.getElementById("reserve");
  if (reserve) {
    reserve.rdate.min = form.date.min; reserve.rdate.value = form.date.value; reserve.rtime.value = form.time.value;
    reserve.addEventListener("submit", function (e) {
      e.preventDefault();
      form.date.value = reserve.rdate.value; form.time.value = reserve.rtime.value;
      setMode("later"); window.tShowLater(); render();
      document.querySelector(".card").scrollIntoView({ block: "start", behavior: "smooth" });
      setTimeout(function () { form.to.focus({ preventScroll: true }); }, 600);
    });
  }

  // Pick-up spot on the map, like "Confirm the pickup spot" in the big ride apps:
  // a pin that can be dragged to the exact place; the address follows.
  var pin = null, pinFor = null;
  var PIN_T = { de: "Abholung hier · verschieben", en: "Pick-up here · drag", el: "Παραλαβή εδώ · μετακίνησε" };
  setInterval(function () {
    var m = window.map;
    if (!m || !window.maplibregl || !m.loaded || !m.loaded()) return;
    var f = picked.from;
    if (!f || f.lat == null) { if (pin) { pin.remove(); pin = null; } return; }
    var key = f.lat.toFixed(6) + "," + f.lon.toFixed(6);
    if (pin && pinFor === key) return;
    if (!pin) {
      var el = document.createElement("div");
      el.className = "pickup-pin";
      el.innerHTML = '<span class="pickup-pin-label"></span><span class="pickup-pin-dot"></span>';
      pin = new maplibregl.Marker({ element: el, draggable: true, anchor: "bottom" }).setLngLat([f.lon, f.lat]).addTo(m);
      pin.on("dragend", function () {
        var ll = pin.getLngLat();
        var place = { label: TEXT[lang].myLocation, text: "", lat: ll.lat, lon: ll.lng };
        fetch(CONFIG.services.reverse + "?lat=" + ll.lat + "&lon=" + ll.lng + "&lang=" + (lang === "de" ? "de" : "en"))
          .then(function (r) { return r.json(); })
          .then(function (d) { if (d.features && d.features[0] && window.labelOf) place.label = window.labelOf(d.features[0].properties); })
          .catch(function () {})
          .then(function () { place.text = place.label; pinFor = ll.lat.toFixed(6) + "," + ll.lng.toFixed(6); window.tPick("from", place); });
      });
    } else pin.setLngLat([f.lon, f.lat]);
    pin.getElement().querySelector(".pickup-pin-label").textContent = PIN_T[lang] || PIN_T.de;
    pinFor = key;
  }, 700);

  render();
  showRecent();
})();
