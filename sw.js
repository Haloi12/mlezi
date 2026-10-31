/* Mlezi — service worker : tout le jeu fonctionne hors ligne.
   Changer VERSION à chaque mise à jour du contenu. */
var VERSION = "mlezi-v10";
var COEUR = ["./", "index.html", "style.css", "app.js", "contenu.js", "scenes.js", "manifest.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
var AUDIO = ["n1-s1","n1-s2","n1-s3","n1-s4","n1-s5"].map(function (n) { return "audio/sh/" + n + ".mp3"; });

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(COEUR).then(function () {
      return Promise.all(AUDIO.map(function (u) { return c.add(u).catch(function () {}); }));
    });
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    return r || fetch(e.request).then(function (res) {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        var copie = res.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copie); });
      }
      return res;
    }).catch(function () { return caches.match("index.html"); });
  }));
});
