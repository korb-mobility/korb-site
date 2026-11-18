/*! © Transfer. Alle Rechte vorbehalten. Vervielfältigung, Weitergabe oder Nutzung dieses Codes,
    auch in Teilen, nur mit schriftlicher Genehmigung von Transfer. */
/* Customer account: save name and phone once, sign in next time with phone and a 4-digit code. */
(function () {
  var u = new URL(CONFIG.bookingsEndpoint);
  var base = u.origin + "/rest/v1/rpc/", key = u.searchParams.get("apikey");
  var T = {
    de: { have: "Schon Kunde? Mit Telefon und Code anmelden", phone: "Telefon", code: "4-stelliger Code", signIn: "Anmelden",
      wrong: "Telefon oder Code stimmt nicht.", locked: "Zu viele Versuche. Bitte in 15 Minuten noch einmal.", signedAs: "Angemeldet als {name}",
      signOut: "Abmelden", delete: "Konto löschen", deleteAsk: "Konto und gespeicherte Daten wirklich löschen?",
      saveTitle: "Daten für das nächste Mal speichern?", saveText: "Wählen Sie einen 4-stelligen Code. Nächstes Mal melden Sie sich mit Telefon und Code an und müssen nichts mehr eintippen.",
      save: "Speichern", saved: "Gespeichert. Nächstes Mal einfach mit Telefon und Code anmelden.", exists: "Für diese Nummer gibt es schon ein Konto. Melden Sie sich beim nächsten Mal damit an.",
      badPin: "Bitte genau 4 Ziffern.", places: "Ihre Orte" },
    en: { have: "Been with us before? Sign in with phone and code", phone: "Phone", code: "4-digit code", signIn: "Sign in",
      wrong: "Phone or code is wrong.", locked: "Too many tries. Please try again in 15 minutes.", signedAs: "Signed in as {name}",
      signOut: "Sign out", delete: "Delete account", deleteAsk: "Really delete your account and saved details?",
      saveTitle: "Save your details for next time?", saveText: "Choose a 4-digit code. Next time you sign in with phone and code and type nothing else.",
      save: "Save", saved: "Saved. Next time just sign in with phone and code.", exists: "There is already an account for this number. Use it to sign in next time.",
      badPin: "Please exactly 4 digits.", places: "Your places" },
    el: { have: "Έχετε ξαναταξιδέψει μαζί μας; Σύνδεση με τηλέφωνο και κωδικό", phone: "Τηλέφωνο", code: "Κωδικός 4 ψηφίων", signIn: "Σύνδεση",
      wrong: "Λάθος τηλέφωνο ή κωδικός.", locked: "Πολλές προσπάθειες. Δοκιμάστε ξανά σε 15 λεπτά.", signedAs: "Συνδεδεμένος ως {name}",
      signOut: "Αποσύνδεση", delete: "Διαγραφή λογαριασμού", deleteAsk: "Να διαγραφούν ο λογαριασμός και τα αποθηκευμένα στοιχεία;",
      saveTitle: "Αποθήκευση στοιχείων για την επόμενη φορά;", saveText: "Διαλέξτε έναν κωδικό 4 ψηφίων. Την επόμενη φορά συνδέεστε με τηλέφωνο και κωδικό, χωρίς να γράψετε τίποτα άλλο.",
      save: "Αποθήκευση", saved: "Αποθηκεύτηκε. Την επόμενη φορά συνδεθείτε με τηλέφωνο και κωδικό.", exists: "Υπάρχει ήδη λογαριασμός για αυτόν τον αριθμό. Συνδεθείτε με αυτόν την επόμενη φορά.",
      badPin: "Ακριβώς 4 ψηφία, παρακαλώ.", places: "Τα μέρη σας" }
  };
  var t = function (k) { return (T[lang] || T.de)[k]; };
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  var rpc = function (fn, args) {
    return fetch(base + fn, { method: "POST", headers: { "Content-Type": "application/json", apikey: key }, body: JSON.stringify(args) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (body) { return body ? JSON.parse(body) : null; });
  };
  var token = function (v) { if (v === undefined) return store("t-customer") || ""; store("t-customer", v); };

  // Sign-in box above the name field
  var nameLabel = form.name.closest("label");
  var box = el("div", "acct f-wide");
  nameLabel.parentNode.insertBefore(box, nameLabel);

  function renderSignedOut() {
    box.textContent = "";
    var link = el("button", "link-btn acct-toggle", t("have"));
    link.type = "button";
    var panel = el("div", "acct-panel");
    panel.hidden = true;
    var ph = el("input"); ph.type = "tel"; ph.autocomplete = "tel"; ph.placeholder = t("phone");
    var pin = el("input"); pin.inputMode = "numeric"; pin.maxLength = 4; pin.placeholder = t("code"); pin.autocomplete = "one-time-code";
    var go = el("button", "btn btn-small", t("signIn")); go.type = "button";
    var msg = el("p", "small acct-msg");
    panel.append(ph, pin, go, msg);
    link.onclick = function () { panel.hidden = !panel.hidden; if (!panel.hidden) ph.focus(); };
    go.onclick = function () {
      msg.textContent = "";
      rpc("customer_login", { p_phone: ph.value, p_pin: pin.value }).then(function (r) {
        if (r.error) { msg.textContent = r.error === "locked" ? t("locked") : t("wrong"); return; }
        token(r.token);
        load();
      }, function () { msg.textContent = t("wrong"); });
    };
    box.append(link, panel);
  }

  function renderSignedIn(me) {
    box.textContent = "";
    form.name.value = me.name || "";
    form.phone.value = me.phone || "";
    var row = el("p", "small acct-row");
    row.append(el("span", "acct-dot"), el("span", null, t("signedAs").replace("{name}", (me.name || "").split(/\s+/)[0])));
    var out = el("button", "link-btn", t("signOut")); out.type = "button";
    out.onclick = function () { rpc("customer_logout", { p_token: token() }).catch(function () {}); token(""); form.name.value = ""; form.phone.value = ""; renderSignedOut(); };
    var del = el("button", "link-btn", t("delete")); del.type = "button";
    del.onclick = function () {
      if (!confirm(t("deleteAsk"))) return;
      rpc("customer_delete", { p_token: token() }).then(function () { token(""); form.name.value = ""; form.phone.value = ""; renderSignedOut(); });
    };
    row.append(out, del);
    box.append(row);
    // Places used before, one tap to set as destination
    if (me.places && me.places.length) {
      var chips = el("div", "chips acct-places");
      chips.setAttribute("aria-label", t("places"));
      me.places.forEach(function (p) {
        var b = el("button", null, p.text.split(",")[0]); b.type = "button"; b.title = p.text;
        b.onclick = function () {
          form.to.value = p.text;
          if (p.lat != null && window.tPick) window.tPick("to", { label: p.text, text: p.text, lat: p.lat, lon: p.lon });
          else form.to.dispatchEvent(new Event("input", { bubbles: true }));
        };
        chips.append(b);
      });
      box.append(chips);
    }
  }

  function load() {
    if (!token()) { renderSignedOut(); return; }
    rpc("customer_me", { p_token: token() }).then(function (me) {
      if (me.error) { token(""); renderSignedOut(); } else renderSignedIn(me);
    }, renderSignedOut);
  }

  // Offer to save the details while waiting for the driver
  var sent = document.getElementById("sent");
  var offer = el("div", "acct-save");
  offer.hidden = true;
  sent.insertBefore(offer, document.getElementById("live-map"));
  function renderOffer() {
    offer.textContent = "";
    var pin = el("input"); pin.inputMode = "numeric"; pin.maxLength = 4; pin.placeholder = t("code"); pin.autocomplete = "new-password";
    var go = el("button", "btn btn-small", t("save")); go.type = "button";
    var msg = el("p", "small acct-msg");
    var row = el("div", "acct-panel"); row.append(pin, go);
    offer.append(el("strong", null, t("saveTitle")), el("p", "small", t("saveText")), row, msg);
    go.onclick = function () {
      if (!/^\d{4}$/.test(pin.value)) { msg.textContent = t("badPin"); return; }
      var ride = JSON.parse(store("t-ride") || "null");
      if (!ride) return;
      rpc("customer_register", { p_booking_token: ride.token, p_pin: pin.value }).then(function (r) {
        if (r.error === "exists") { offer.textContent = ""; offer.append(el("p", "small", t("exists"))); return; }
        if (r.error) { msg.textContent = t("badPin"); return; }
        token(r.token);
        offer.textContent = "";
        offer.append(el("p", "small acct-ok", t("saved")));
        load();
      });
    };
  }
  // Show the offer whenever the waiting screen is open and nobody is signed in.
  new MutationObserver(function () {
    var show = !sent.hidden && !token() && ["new", "accepted", "on_the_way", "arrived"].indexOf(sent.getAttribute("data-status")) >= 0;
    if (show && offer.hidden) renderOffer();
    offer.hidden = !show;
  }).observe(sent, { attributes: true, attributeFilter: ["hidden", "data-status"] });

  document.querySelectorAll("[data-lang]").forEach(function (b) { b.addEventListener("click", function () { setTimeout(load, 0); }); });
  load();
})();
