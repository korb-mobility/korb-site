/* Everything you may want to change is in this block. */
var CONFIG = {
  // Set to true once the Genehmigung is granted: shows the ride request and the ride sections.
  licensed: true,
  // Set to false before publishing: removes the blue preview bar and the demo note.
  preview: false,
  whatsapp: "4915777104912",
  pricing: {
    // DEMO values: replace after comparing real prices in the Uber app.
    base: 4.5,
    perKm: 0.75,
    perMin: 0.15,
    minFare: 9,
    roundUpTo: 0.1,
    maxKm: 150
  },
  services: {
    // Free TomTom key (distance and live traffic). Empty: no price, the request goes straight to WhatsApp.
    trafficKey: "Xzl9mut4JQuFweqIwy07a9OMZnsWfte6",
    traffic: "https://api.tomtom.com/routing/1/calculateRoute/",
    // Free, no key. demoRoute has no traffic and is only used in the preview.
    search: "https://photon.komoot.io/api/",
    backupSearch: "https://api.tomtom.com/search/2/search/",
    reverse: "https://photon.komoot.io/reverse",
    demoRoute: "https://router.project-osrm.org/route/v1/driving/",
    mapStyle: "https://tiles.openfreemap.org/styles/dark"
  }
};

var PLACES = {
  fra1: { label: "Flughafen Frankfurt, Terminal 1", lat: 50.0510, lon: 8.5706 },
  fra2: { label: "Flughafen Frankfurt, Terminal 2", lat: 50.0500, lon: 8.5870 },
  hbf: { label: "Frankfurt Hauptbahnhof", lat: 50.1071, lon: 8.6638 },
  messe: { label: "Messe Frankfurt", lat: 50.1125, lon: 8.6520 }
};

var EN = {
  tagline: "Private hire car with driver in Frankfurt am Main.",
  ctaWa: "Message on WhatsApp",
  ctaSave: "Save contact",
  ctaCall: "Call",
  copyNumber: "Copy number",
  soonTitle: "Starting soon",
  soonLead: "Rides start as soon as our licence is granted.",
  soonBody: "Save our number now. We take rides from the day we start.",
  bookTitle: "Where can we take you?",
  whenLegend: "When do you want to ride?",
  asap: "As soon as possible",
  later: "Choose a time",
  swap: "Swap pick-up and destination",
  quoteClass: "Comfort and Premium",
  quoteSeats: "Up to 4 people, with driver",
  factKm: "Distance",
  factMin: "Driving time",
  factTraffic: "Traffic",
  factArrive: "Arrival approx.",
  benTitle: "Plan your ride ahead",
  ben1T: "Price before you send",
  ben1: "You see the distance, driving time, traffic and final price before you message us.",
  ben2T: "Your pick-up time",
  ben2: "You choose the day and time. We confirm the ride directly on WhatsApp.",
  ben3T: "Time to get in",
  ben3: "5 minutes of waiting are included; at the airport, 45 minutes after landing.",
  ben4T: "Cancel free of charge",
  ben4: "You pay nothing up to 1 hour before pick-up.",
  airCta: "See the price to the airport",
  q8: "Where does the traffic data come from?",
  a8: "From TomTom. For a ride now we use current traffic; for a later time, the usual traffic at that hour.",
  from: "Pick-up",
  to: "Destination",
  addrPh: "Enter an address",
  locate: "Use my location",
  chipHbf: "Central Station",
  chipMesse: "Trade fair",
  date: "Date",
  time: "Time",
  people: "People",
  flight: "Flight number (optional)",
  childseat: "Child seat needed",
  send: "Send on WhatsApp",
  preorder: "All our rides are booked in advance. Your ride is booked once we confirm it on WhatsApp.",
  howTitle: "How to book",
  how1: "Enter pick-up and destination.",
  how2: "Choose the date and time.",
  how3: "Send it on WhatsApp and get our confirmation.",
  airTitle: "Frankfurt Airport",
  airLead: "Book your ride to or from the airport in advance.",
  air1: "Give us your flight number at pick-up so we can plan around your arrival.",
  air2: "After landing we wait 45 minutes at no extra charge.",
  air3: "Cancel free of charge up to 1 hour before pick-up.",
  classTitle: "Vehicle class",
  classLead: "We drive in the Comfort and Premium class.",
  classBody: "In other ride apps this matches the Comfort and Premium categories.",
  classLegal: "Private hire with driver under sec.\u00a049\u00a0(4)\u00a0PBefG.",
  safeTitle: "Safety",
  safe1: "The car is checked every week.",
  safe2: "We check the driving licence and passenger transport permit before the first shift and at least every quarter after that.",
  safe3: "Before your ride you get the driver's name and the number plate on WhatsApp.",
  bizTitle: "For companies",
  bizLead: "Rides for staff and guests, with one invoice per month.",
  bizCta: "Ask for an offer on WhatsApp",
  faqTitle: "Questions",
  q1: "How is the price set?",
  a1: "From the distance and driving time of your route, so traffic counts too. You see the final price including VAT before you send.",
  q2: "Can I get in on the street?",
  a2: "No. As a private hire car we may only drive bookings received in advance.",
  q3: "How much luggage fits?",
  a3: "4 large suitcases with 4 people. For more luggage, message us first.",
  q4: "How long does the driver wait?",
  a4: "5 minutes from the agreed time at no charge; at the airport, 45 minutes after landing.",
  q5: "How can I pay?",
  a5: "Cash or card in the car.",
  q6: "Can I get an invoice?",
  a6: "Yes. Send us your billing address on WhatsApp.",
  q7: "I left something in the car.",
  a7: "Message us on WhatsApp with the date and route of your ride.",
  placeTitle: "Registered base",
  openMap: "Open in maps",
  share: "Share page",
  scanTitle: "Get it on your phone",
  scanWa: "Scan to open WhatsApp",
  scanSave: "Scan to save the contact",
  privacy: "Privacy"
};

var TEXT = {
  de: {
    greet: "Hallo Korb Mobility,", biz: "Hallo Korb Mobility, wir interessieren uns für Fahrten für unser Unternehmen.",
    copied: "Kopiert", request: "Fahrtanfrage", from: "Abholung", to: "Ziel", date: "Datum", time: "Uhrzeit", people: "Personen", flight: "Flug", childseat: "Kindersitz gewünscht", price: "Angezeigter Preis",
    finalPrice: "Endpreis inkl. MwSt., mit dem aktuellen Verkehr.", finalPriceLater: "Endpreis inkl. MwSt., mit dem üblichen Verkehr zu dieser Uhrzeit.", noDelay: "frei", delay: "+{n} Min.", whenLabel: "Zeit", asap: "So früh wie möglich",
    demo: "Vorschau: Beispieltarif ohne Verkehrsdaten.", working: "Route wird berechnet", failed: "Den Preis nennen wir Ihnen auf WhatsApp.", noAddress: "Adresse nicht gefunden. Bitte prüfen Sie die Eingabe.",
    tooFar: "Für so lange Strecken machen wir Ihnen ein Angebot auf WhatsApp.", noLocation: "Ihr Standort ist nicht verfügbar. Bitte geben Sie die Adresse ein.", myLocation: "Mein Standort", minutes: "Min.", locale: "de-DE"
  },
  en: {
    greet: "Hello Korb Mobility,", biz: "Hello Korb Mobility, we are interested in rides for our company.",
    copied: "Copied", request: "Ride request", from: "Pick-up", to: "Destination", date: "Date", time: "Time", people: "People", flight: "Flight", childseat: "Child seat needed", price: "Price shown",
    finalPrice: "Final price including VAT, with current traffic.", finalPriceLater: "Final price including VAT, with the usual traffic at this hour.", noDelay: "clear", delay: "+{n} min", whenLabel: "Time", asap: "As soon as possible",
    demo: "Preview: sample tariff without traffic data.", working: "Calculating your route", failed: "We will send you the price on WhatsApp.", noAddress: "Address not found. Please check what you entered.",
    tooFar: "For trips this long we make you an individual offer on WhatsApp.", noLocation: "Your location is not available. Please enter the address.", myLocation: "My location", minutes: "min", locale: "en-GB"
  }
};

var body = document.body;
var params = new URLSearchParams(location.search);
var form = document.getElementById("book");
var statusEl = document.getElementById("status");
var resultEl = document.getElementById("result");
var lang = "de";
var german = {};
var picked = { from: null, to: null };
var trip = null;
var routeRun = 0;
var routeDone = Promise.resolve();
// Prices need the traffic service; the preview can also show them with sample data.
var priceOn = !!CONFIG.services.trafficKey || CONFIG.preview;

function store(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch (e) { return null; }
}

function waLink(message) {
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(message);
}

function setLang(next) {
  lang = next;
  document.documentElement.lang = next;
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var key = el.getAttribute("data-i18n");
    if (!(key in german)) german[key] = el.textContent;
    el.textContent = next === "en" && EN[key] ? EN[key] : german[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    var key = el.getAttribute("data-i18n-ph");
    if (!(key in german)) german[key] = el.placeholder;
    el.placeholder = next === "en" && EN[key] ? EN[key] : german[key];
  });
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === next));
  });
  document.querySelectorAll(".js-wa").forEach(function (a) { a.href = waLink(TEXT[next].greet); });
  document.querySelectorAll(".js-wa-biz").forEach(function (a) { a.href = waLink(TEXT[next].biz); });
  store("korb-lang", next);
  showPrice();
}

function toast(message) {
  var t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("on");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(function () { t.classList.remove("on"); }, 1800);
}

function copy(text) {
  var done = function () { toast(TEXT[lang].copied); };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done);
  } else {
    var area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    done();
  }
}

/* Price */

function priceFor(km, minutes) {
  var p = CONFIG.pricing;
  var amount = Math.max(p.base + km * p.perKm + minutes * p.perMin, p.minFare);
  amount = Math.ceil(amount / p.roundUpTo - 1e-9) * p.roundUpTo;
  return Math.round(amount * 100) / 100;
}

function money(amount) {
  return new Intl.NumberFormat(TEXT[lang].locale, { style: "currency", currency: "EUR" }).format(amount);
}

function showPrice() {
  if (!trip || !priceOn) { resultEl.hidden = true; return; }
  var t = TEXT[lang];
  document.getElementById("price").textContent = money(priceFor(trip.km, trip.minutes));
  var later = form.mode.value === "later";
  var delay = Math.round(Math.max(trip.minutes - trip.freeMinutes, 0));
  var when = departure();
  document.getElementById("q-km").textContent = trip.km.toFixed(1).replace(".", lang === "de" ? "," : ".") + " km";
  document.getElementById("q-min").textContent = Math.round(trip.minutes) + " " + t.minutes;
  document.getElementById("q-traffic").textContent = delay ? t.delay.replace("{n}", delay) : t.noDelay;
  document.getElementById("q-arrive-row").hidden = !(later && when);
  if (later && when) {
    document.getElementById("q-arrive").textContent = new Date(new Date(when).getTime() + trip.minutes * 60000).toLocaleTimeString(t.locale, { hour: "2-digit", minute: "2-digit" });
  }
  document.getElementById("price-note").textContent = trip.demo ? t.demo : (later ? t.finalPriceLater : t.finalPrice);
  document.getElementById("sticky-price").textContent = money(priceFor(trip.km, trip.minutes));
  stickySync();
  resultEl.hidden = false;
}

/* Map */

var map = null;

function loadMap() {
  var box = document.getElementById("map");
  var script = document.createElement("script");
  script.src = "assets/vendor/maplibre-gl.js";
  script.onerror = function () { box.classList.add("off"); };
  script.onload = function () {
    try {
      var created = new maplibregl.Map({
        container: box,
        style: CONFIG.services.mapStyle,
        center: [8.66, 50.09],
        zoom: 10.5,
        attributionControl: { compact: true },
        cooperativeGestures: true,
        dragRotate: false,
        locale: {
          "CooperativeGesturesHandler.WindowsHelpText": "Zum Zoomen Strg gedrückt halten und scrollen",
          "CooperativeGesturesHandler.MacHelpText": "Zum Zoomen ⌘ gedrückt halten und scrollen",
          "CooperativeGesturesHandler.MobileHelpText": "Karte mit zwei Fingern bewegen"
        }
      });
      created.on("load", function () {
        // Keep the credits behind their info button so they do not cover the route.
        var credits = box.querySelector(".maplibregl-ctrl-attrib");
        if (credits) {
          credits.classList.remove("maplibregl-compact-show");
          credits.removeAttribute("open");
        }
        created.addSource("route", { type: "geojson", data: emptyLine() });
        created.addSource("points", { type: "geojson", data: emptyPoints() });
        created.addLayer({ id: "route", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#3ddc84", "line-width": 4 } });
        created.addLayer({ id: "points", type: "circle", source: "points", paint: {
          "circle-radius": 8,
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#000",
          "circle-stroke-width": 2
        } });
        map = created;
        drawMap();
      });
      created.on("error", function (e) {
        if (!map && e.error && /style/i.test(String(e.error.message))) box.classList.add("off");
      });
    } catch (e) {
      box.classList.add("off");
    }
  };
  document.head.appendChild(script);
}

function emptyLine() {
  return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } };
}

function emptyPoints() {
  return { type: "FeatureCollection", features: [] };
}

function drawMap() {
  if (!map) return;
  var features = [];
  var bounds = new maplibregl.LngLatBounds();
  [["from", "#ffffff"], ["to", "#3ddc84"]].forEach(function (pair) {
    var place = picked[pair[0]];
    if (!place) return;
    features.push({ type: "Feature", properties: { color: pair[1] }, geometry: { type: "Point", coordinates: [place.lon, place.lat] } });
    bounds.extend([place.lon, place.lat]);
  });
  var line = trip && trip.coords ? trip.coords : [];
  line.forEach(function (c) { bounds.extend(c); });
  map.getSource("points").setData({ type: "FeatureCollection", features: features });
  map.getSource("route").setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: line } });
  if (features.length === 1 && !line.length) {
    map.easeTo({ center: features[0].geometry.coordinates, zoom: 13 });
  } else if (features.length) {
    map.fitBounds(bounds, { padding: 44, maxZoom: 14, duration: 500 });
  }
}

if ("IntersectionObserver" in window) {
  new IntersectionObserver(function (entries, observer) {
    if (entries.some(function (e) { return e.isIntersecting; })) {
      observer.disconnect();
      loadMap();
    }
  }, { rootMargin: "300px" }).observe(document.getElementById("map"));
} else {
  loadMap();
}

/* Route */

function departure() {
  if (form.mode.value !== "later") return null;
  if (!form.date.value || !form.time.value) return null;
  var when = new Date(form.date.value + "T" + form.time.value + ":00");
  return when.getTime() > Date.now() + 120000 ? form.date.value + "T" + form.time.value + ":00" : null;
}

function fetchTrip() {
  var s = CONFIG.services, a = picked.from, b = picked.to;
  if (s.trafficKey) {
    var when = departure();
    var url = s.traffic + a.lat + "," + a.lon + ":" + b.lat + "," + b.lon + "/json?traffic=true&travelMode=car&computeTravelTimeFor=all&key=" + encodeURIComponent(s.trafficKey) + (when ? "&departAt=" + encodeURIComponent(when) : "");
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("route");
      return r.json();
    }).then(function (data) {
      var route = data.routes[0];
      var coords = [];
      route.legs.forEach(function (leg) {
        leg.points.forEach(function (p) { coords.push([p.longitude, p.latitude]); });
      });
      var free = route.summary.noTrafficTravelTimeInSeconds;
      var minutes = route.summary.travelTimeInSeconds / 60;
      return { km: route.summary.lengthInMeters / 1000, minutes: minutes, freeMinutes: free ? free / 60 : minutes, coords: coords, demo: false };
    });
  }
  if (!CONFIG.preview) return Promise.reject(new Error("no route service"));
  return fetch(s.demoRoute + a.lon + "," + a.lat + ";" + b.lon + "," + b.lat + "?overview=simplified&geometries=geojson").then(function (r) {
    if (!r.ok) throw new Error("route");
    return r.json();
  }).then(function (data) {
    var route = data.routes[0];
    return { km: route.distance / 1000, minutes: route.duration / 60, freeMinutes: route.duration / 60, coords: route.geometry.coordinates, demo: true };
  });
}

function updateRoute() {
  var run = ++routeRun;
  trip = null;
  resultEl.hidden = true;
  statusEl.textContent = "";
  stickySync();
  drawMap();
  routeDone = Promise.resolve();
  if (!picked.from || !picked.to) return;
  // Without a price the addresses are still shown on the map; there is nothing to calculate.
  if (!priceOn) return;
  statusEl.textContent = TEXT[lang].working;
  routeDone = fetchTrip().then(function (found) {
    if (run !== routeRun) return;
    if (found.km > CONFIG.pricing.maxKm) {
      statusEl.textContent = TEXT[lang].tooFar;
      return;
    }
    trip = found;
    statusEl.textContent = "";
    drawMap();
    showPrice();
  }).catch(function () {
    if (run === routeRun) statusEl.textContent = TEXT[lang].failed;
  });
}

/* Address fields */

function labelOf(p) {
  var street = p.street ? p.street + (p.housenumber ? " " + p.housenumber : "") : "";
  var first = p.name && p.name !== street ? p.name : "";
  var place = [p.postcode, p.city || p.town || p.village].filter(Boolean).join(" ");
  return [first, street, place].filter(Boolean).join(", ");
}

function choose(key, place) {
  picked[key] = place;
  document.getElementById(key).value = place.label;
  closeList(key);
  updateRoute();
}

function closeList(key) {
  var list = document.getElementById(key + "-list");
  list.hidden = true;
  list.innerHTML = "";
  document.getElementById(key).setAttribute("aria-expanded", "false");
}

function showList(key, places) {
  var list = document.getElementById(key + "-list");
  list.innerHTML = "";
  places.forEach(function (place) {
    var li = document.createElement("li");
    li.setAttribute("role", "option");
    li.textContent = place.label;
    li.addEventListener("mousedown", function (e) { e.preventDefault(); choose(key, place); });
    list.appendChild(li);
  });
  list.hidden = !places.length;
  document.getElementById(key).setAttribute("aria-expanded", String(!!places.length));
}

function photonSearch(query) {
  var url = CONFIG.services.search + "?limit=8&lat=50.11&lon=8.68&lang=" + (lang === "de" ? "de" : "en") + "&q=" + encodeURIComponent(query);
  var abort = new AbortController();
  var timer = setTimeout(function () { abort.abort(); }, 2500);
  return fetch(url, { signal: abort.signal }).then(function (r) {
    clearTimeout(timer);
    if (!r.ok) throw new Error("search");
    return r.json();
  }).then(function (data) {
    return (data.features || []).filter(function (f) {
      return f.properties.countrycode === "DE";
    }).map(function (f) {
      return { label: labelOf(f.properties), lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
    });
  });
}

function tomtomSearch(query) {
  var s = CONFIG.services;
  var url = s.backupSearch + encodeURIComponent(query) + ".json?typeahead=true&limit=5&countrySet=DE&lat=50.11&lon=8.68&language=" + (lang === "de" ? "de-DE" : "en-GB") + "&key=" + encodeURIComponent(s.trafficKey);
  return fetch(url).then(function (r) {
    if (!r.ok) throw new Error("search");
    return r.json();
  }).then(function (data) {
    return (data.results || []).map(function (r) {
      var address = r.address.freeformAddress;
      return { label: r.poi && r.poi.name ? r.poi.name + ", " + address : address, lat: r.position.lat, lon: r.position.lon };
    });
  });
}

// Photon is free but sometimes unreachable; TomTom takes over for the rest of the visit.
var photonDown = false;
function lookup(query) {
  var found = photonDown ? Promise.reject(new Error("down")) : photonSearch(query).catch(function (e) {
    photonDown = true;
    throw e;
  });
  return found.catch(function () { return tomtomSearch(query); }).then(function (places) {
    var seen = {};
    return places.filter(function (place) {
      if (!place.label || seen[place.label]) return false;
      seen[place.label] = true;
      return true;
    }).slice(0, 5);
  });
}

function search(key, query) {
  var input = document.getElementById(key);
  lookup(query).then(function (places) {
    if (input.value !== query || document.activeElement !== input) return;
    showList(key, places);
  }).catch(function () { closeList(key); });
}

// A typed address that was not tapped in the list still gets a route and a price.
function resolveTyped(key, force) {
  var input = document.getElementById(key);
  var query = input.value;
  if (picked[key] || !query.trim()) return Promise.resolve();
  return lookup(query).then(function (places) {
    if (picked[key] || input.value !== query || (!force && document.activeElement === input)) return;
    if (places.length) choose(key, places[0]);
    else statusEl.textContent = TEXT[lang].noAddress;
  }).catch(function () {
    if (input.value === query) statusEl.textContent = TEXT[lang].noAddress;
  });
}

["from", "to"].forEach(function (key) {
  var input = document.getElementById(key);
  var timer;
  input.addEventListener("input", function () {
    if (picked[key]) {
      picked[key] = null;
      updateRoute();
    }
    clearTimeout(timer);
    if (!input.value.trim()) { closeList(key); return; }
    timer = setTimeout(function () { search(key, input.value); }, 250);
  });
  input.addEventListener("keydown", function (e) {
    var list = document.getElementById(key + "-list");
    var items = Array.prototype.slice.call(list.children);
    if (!items.length) return;
    var at = items.findIndex(function (li) { return li.getAttribute("aria-selected") === "true"; });
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (at >= 0) items[at].removeAttribute("aria-selected");
      at = e.key === "ArrowDown" ? (at + 1) % items.length : (at - 1 + items.length) % items.length;
      items[at].setAttribute("aria-selected", "true");
    } else if (e.key === "Enter" && at >= 0) {
      e.preventDefault();
      items[at].dispatchEvent(new MouseEvent("mousedown"));
    } else if (e.key === "Escape") {
      closeList(key);
    }
  });
  input.addEventListener("blur", function () {
    setTimeout(function () {
      closeList(key);
      resolveTyped(key);
    }, 120);
  });
});

document.querySelectorAll("[data-place]").forEach(function (b) {
  b.addEventListener("click", function () {
    // Fills the empty field; with both filled, a tap replaces the destination.
    choose(b.getAttribute("data-target") || (document.getElementById("from").value.trim() ? "to" : "from"), PLACES[b.getAttribute("data-place")]);
    if (b.getAttribute("data-target")) {
      document.getElementById("fahrt").scrollIntoView();
      document.getElementById(picked.from ? "send" : "from").focus({ preventScroll: true });
    }
  });
});

document.getElementById("swap").addEventListener("click", function () {
  var from = document.getElementById("from"), to = document.getElementById("to");
  var place = picked.from, text = from.value;
  picked.from = picked.to;
  from.value = to.value;
  picked.to = place;
  to.value = text;
  updateRoute();
});

Array.prototype.forEach.call(form.elements.mode, function (radio) {
  radio.addEventListener("change", function () {
    document.getElementById("later-row").hidden = form.mode.value !== "later";
    updateRoute();
  });
});

document.getElementById("locate").addEventListener("click", function () {
  var fail = function () { statusEl.textContent = TEXT[lang].noLocation; };
  if (!navigator.geolocation) { fail(); return; }
  navigator.geolocation.getCurrentPosition(function (pos) {
    var lat = pos.coords.latitude, lon = pos.coords.longitude;
    var place = { label: TEXT[lang].myLocation, lat: lat, lon: lon };
    fetch(CONFIG.services.reverse + "?lat=" + lat + "&lon=" + lon + "&lang=" + (lang === "de" ? "de" : "en")).then(function (r) { return r.json(); }).then(function (data) {
      if (data.features && data.features[0]) place.label = labelOf(data.features[0].properties);
    }).catch(function () {}).then(function () { choose("from", place); });
  }, fail, { timeout: 8000 });
});

// With live traffic the price depends on when the ride starts.
form.date.addEventListener("change", function () { if (CONFIG.services.trafficKey) updateRoute(); });
form.time.addEventListener("change", function () { if (CONFIG.services.trafficKey) updateRoute(); });

(function presetTime() {
  var d = new Date(Date.now() + 60 * 60 * 1000);
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var day = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  form.date.min = day;
  form.date.value = day;
  form.time.value = pad(d.getHours()) + ":" + pad(d.getMinutes());
})();

function sendRequest() {
  var t = TEXT[lang];
  var later = form.mode.value === "later";
  var lines = [
    t.request,
    t.from + ": " + form.from.value.trim(),
    t.to + ": " + form.to.value.trim()
  ];
  if (later) {
    lines.push(t.date + ": " + form.date.value, t.time + ": " + form.time.value);
  } else {
    lines.push(t.whenLabel + ": " + t.asap);
  }
  lines.push(t.people + ": " + form.people.value);
  if (form.flight.value.trim()) lines.push(t.flight + ": " + form.flight.value.trim());
  if (form.childseat.checked) lines.push(t.childseat);
  if (trip && priceOn) lines.push(t.price + ": " + money(priceFor(trip.km, trip.minutes)));
  location.href = waLink(lines.join("\n"));
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  // A typed address may still be on its way to a route: wait briefly so the price is in the message.
  var ready = Promise.all([resolveTyped("from", true), resolveTyped("to", true)]).then(function () { return routeDone; });
  var limit = new Promise(function (done) { setTimeout(done, 4000); });
  Promise.race([ready, limit]).then(sendRequest, sendRequest);
});

var sendInView = false;
function stickySync() {
  document.getElementById("sticky").hidden = !trip || sendInView;
}
if ("IntersectionObserver" in window) {
  new IntersectionObserver(function (entries) {
    sendInView = entries[entries.length - 1].isIntersecting;
    stickySync();
  }).observe(document.getElementById("send"));
}

/* Page */

document.querySelectorAll("[data-lang]").forEach(function (b) {
  b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
});

document.querySelectorAll("[data-copy]").forEach(function (b) {
  b.addEventListener("click", function () { copy(b.getAttribute("data-copy")); });
});

document.getElementById("share").addEventListener("click", function () {
  if (navigator.share) {
    navigator.share({ title: "Korb Mobility", url: location.origin + location.pathname }).catch(function () {});
  } else {
    copy(location.origin + location.pathname);
  }
});

function setLicensed(value) {
  body.setAttribute("data-licensed", String(value));
}

setLicensed(CONFIG.licensed);

if (CONFIG.preview) {
  document.getElementById("preview-bar").hidden = false;
  var box = document.getElementById("preview-licensed");
  box.addEventListener("change", function () { setLicensed(box.checked); });
  if (params.get("licensed") === "1") { box.checked = true; setLicensed(true); }
  var priceBox = document.getElementById("preview-price");
  if (params.get("price") === "0") priceOn = false;
  priceBox.checked = priceOn;
  priceBox.addEventListener("change", function () { priceOn = priceBox.checked; updateRoute(); });
}

var preferred = params.get("lang") || store("korb-lang") || ((navigator.language || "de").indexOf("de") === 0 ? "de" : "en");
setLang(preferred === "en" ? "en" : "de");
