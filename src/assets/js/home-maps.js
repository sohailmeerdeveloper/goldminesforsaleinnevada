// Lightweight Leaflet thumbnails for homepage featured property cards.
// Loads Leaflet on demand when a card scrolls near the viewport, then renders
// a small OSM map centered on the property with a copper survey marker.
// Intentionally minimal: no layer switcher, no fullscreen, no scale, no
// scroll-wheel zoom. Acts as a visual preview until client photos arrive.

(function () {
  "use strict";

  var elements = Array.prototype.slice.call(document.querySelectorAll(".js-home-map"));
  if (!elements.length) return;

  var leafletCss = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  var leafletScript = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  var leafletPromise = null;

  var copper = getComputedStyle(document.documentElement).getPropertyValue("--copper").trim() || "#a8472b";
  var copperDeep = getComputedStyle(document.documentElement).getPropertyValue("--copper-deep").trim() || "#7a2f1a";

  function loadCssOnce(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScriptOnce(src) {
    if (window.L) return Promise.resolve();
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
    return leafletPromise;
  }

  function loadLeaflet() {
    loadCssOnce(leafletCss);
    return loadScriptOnce(leafletScript);
  }

  function makeMarkerIcon() {
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" role="img" aria-label="Property location">',
      '<path d="M22 3 39 20 22 37 5 20Z" fill="' + copper + '" stroke="' + copperDeep + '" stroke-width="2"/>',
      '<path d="M22 9 33 20 22 31 11 20Z" fill="#f4efe6" opacity="0.96"/>',
      '<path d="M22 13V27M15 20H29" stroke="' + copperDeep + '" stroke-width="2" stroke-linecap="square"/>',
      '</svg>',
    ].join("");
    return L.divIcon({
      className: "survey-marker",
      html: svg,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }

  function initMap(element) {
    if (element.goldstoneHomeMap) return;
    var lat = Number(element.dataset.lat);
    var lng = Number(element.dataset.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    var map = L.map(element, {
      center: [lat, lng],
      zoom: 11,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
      keyboard: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([lat, lng], {
      icon: makeMarkerIcon(),
      title: element.dataset.name || "Property location",
      keyboard: false,
    }).addTo(map);

    element.goldstoneHomeMap = map;
    window.setTimeout(function () { map.invalidateSize(); }, 80);
  }

  function initAll(targets) {
    loadLeaflet().then(function () {
      targets.forEach(initMap);
    }).catch(function () {
      targets.forEach(function (el) {
        el.classList.add("property-card__map--unavailable");
        el.textContent = "Map unavailable.";
      });
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        initAll([entry.target]);
      });
    }, { rootMargin: "320px 0px" });
    elements.forEach(function (el) { observer.observe(el); });
  } else {
    initAll(elements);
  }
})();
