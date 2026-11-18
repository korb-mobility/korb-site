/*! © Transfer. Alle Rechte vorbehalten. */
/* Keeps the site's own files for when there is no signal. Bookings, maps and the driver feed always go to the network. */
var CACHE = "transfer-v3";
self.addEventListener("install", function (e) { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.indexOf("/driver/") >= 0) return;
  // Network first, so a new version shows at once; the saved copy only when offline.
  e.respondWith(fetch(e.request).then(function (res) {
    if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(e.request).then(function (hit) { return hit || caches.match("./"); });
  }));
});

// Ride updates from the driver (Web Push), also when the page or the browser is closed.
self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Transfer", {
    body: d.body || "", tag: d.tag || "ride", renotify: true, requireInteraction: /arrived|da$|here|έφτασε/i.test(d.title || ""),
    icon: "assets/icon-192.png", badge: "assets/icon-192.png", data: { url: d.url || "./" }, vibrate: [200, 100, 200]
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if (list[i].url.indexOf(self.registration.scope) === 0 && "focus" in list[i]) return list[i].focus();
    return self.clients.openWindow(url);
  }));
});
