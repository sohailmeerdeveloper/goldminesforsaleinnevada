(function () {
  "use strict";

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

  function fixedCoord(value) {
    return Number(value).toFixed(5);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function makeMarkerIcon(mindatId) {
    var safeId = escapeHtml(mindatId);
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" role="img" aria-label="Survey marker">',
      '<path d="M22 3 39 20 22 37 5 20Z" fill="' + copper + '" stroke="' + copperDeep + '" stroke-width="2"/>',
      '<path d="M22 9 33 20 22 31 11 20Z" fill="#f4efe6" opacity="0.96"/>',
      '<path d="M22 13V27M15 20H29" stroke="' + copperDeep + '" stroke-width="2" stroke-linecap="square"/>',
      '<text x="22" y="41" text-anchor="middle" font-family="ui-monospace, monospace" font-size="6" fill="' + copperDeep + '">' + safeId + '</text>',
      '</svg>',
    ].join("");

    return L.divIcon({
      className: "survey-marker",
      html: svg,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });
  }

  function copyText(text, button) {
    function done() {
      var original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(function () {
        button.textContent = original;
      }, 1600);
    }

    function legacyCopy() {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        done();
      } finally {
        document.body.removeChild(textarea);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(legacyCopy);
      return;
    }

    legacyCopy();
  }

  function buildPopup(property) {
    var coord = fixedCoord(property.lat) + ", " + fixedCoord(property.lng);
    var earthUrl = "https://earth.google.com/web/@" + property.lat + "," + property.lng + ",2000a,5000d,35y,0h,0t,0r/";
    var mapsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + property.lat + "," + property.lng;

    return [
      '<div class="map-popup">',
      "<h3>" + escapeHtml(property.name) + "</h3>",
      '<p><strong>Coordinates:</strong> <span class="mono numerals-data">' + coord + "</span></p>",
      '<p><strong>Mindat ID:</strong> <span class="mono numerals-data">' + escapeHtml(property.mindatId) + "</span></p>",
      '<div class="map-popup__actions">',
      '<button type="button" class="js-copy-coords" data-coords="' + coord + '">Copy coordinates</button>',
      '<a href="' + earthUrl + '" target="_blank" rel="noopener">Open in Google Earth</a>',
      '<a href="' + mapsUrl + '" target="_blank" rel="noopener">Get directions</a>',
      "</div>",
      "</div>",
    ].join("");
  }

  function addCoordinateReadout(map, property) {
    var Control = L.Control.extend({
      options: { position: "bottomleft" },
      onAdd: function () {
        var div = L.DomUtil.create("div", "map-readout");
        div.setAttribute("aria-live", "polite");
        div.textContent = fixedCoord(property.lat) + ", " + fixedCoord(property.lng);
        L.DomEvent.disableClickPropagation(div);
        return div;
      },
    });
    var control = new Control();
    control.addTo(map);
    var node = control.getContainer();

    map.on("mousemove", function (event) {
      node.textContent = fixedCoord(event.latlng.lat) + ", " + fixedCoord(event.latlng.lng);
    });
    map.on("mouseout", function () {
      node.textContent = fixedCoord(property.lat) + ", " + fixedCoord(property.lng);
    });
  }

  function addFullscreenControl(map, element) {
    var Control = L.Control.extend({
      options: { position: "topleft" },
      onAdd: function () {
        var wrapper = L.DomUtil.create("div", "leaflet-bar");
        var button = L.DomUtil.create("button", "map-fullscreen", wrapper);
        button.type = "button";
        button.setAttribute("aria-label", "Toggle fullscreen map");
        button.title = "Toggle fullscreen map";
        button.textContent = "FS";
        L.DomEvent.disableClickPropagation(wrapper);
        L.DomEvent.on(button, "click", function () {
          var action;
          if (document.fullscreenElement) {
            action = document.exitFullscreen();
          } else if (element.requestFullscreen) {
            action = element.requestFullscreen();
          }
          if (action && action.catch) {
            action.catch(function () {});
          }
        });
        return wrapper;
      },
    });
    new Control().addTo(map);

    document.addEventListener("fullscreenchange", function () {
      var active = document.fullscreenElement === element;
      element.classList.toggle("is-fullscreen", active);
      window.setTimeout(function () {
        map.invalidateSize();
      }, 80);
    });
  }

  function initMap(element) {
    if (!window.L || element.goldstoneLeafletMap) return;

    var stage = element.closest(".js-map-stage");
    var property = {
      name: stage ? stage.dataset.propertyName : element.dataset.propertyName,
      lat: Number(stage ? stage.dataset.lat : element.dataset.lat),
      lng: Number(stage ? stage.dataset.lng : element.dataset.lng),
      mindatId: stage ? stage.dataset.mindatId : element.dataset.mindatId,
      mrds: stage ? stage.dataset.mrds : element.dataset.mrds,
    };

    if (!Number.isFinite(property.lat) || !Number.isFinite(property.lng)) return;

    var center = [property.lat, property.lng];
    var map = L.map(element, {
      center: center,
      zoom: 12,
      scrollWheelZoom: false,
      keyboard: true,
    });

    var dark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
    });
    var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri",
    });
    var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      attribution: 'Map data &copy; OpenStreetMap, SRTM | Map style &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    });
    var light = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    });
    var hybridBase = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri",
    });
    var hybridLabels = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Labels &copy; Esri",
    });
    var hybrid = L.layerGroup([hybridBase, hybridLabels]);

    osm.addTo(map);

    var marker = L.marker(center, {
      icon: makeMarkerIcon(property.mindatId),
      title: property.name,
      keyboard: true,
    }).addTo(map);
    marker.bindPopup(buildPopup(property));

    map.on("popupopen", function (event) {
      var button = event.popup.getElement().querySelector(".js-copy-coords");
      if (button) {
        button.addEventListener("click", function () {
          copyText(button.dataset.coords, button);
        });
      }
    });

    var layerControl = L.control.layers({
      "Standard 2D": osm,
      "Satellite": satellite,
      "Topographic": topo,
      "Black & White": light,
      "Dark": dark,
      "Hybrid": hybrid,
    }, null, {
      position: "topright",
      collapsed: true,
    }).addTo(map);
    var layerToggle = layerControl.getContainer().querySelector(".leaflet-control-layers-toggle");
    if (layerToggle) {
      layerToggle.setAttribute("aria-label", "Choose map layer");
    }

    L.control.scale({ metric: true, imperial: true, position: "bottomright" }).addTo(map);
    addCoordinateReadout(map, property);
    addFullscreenControl(map, element);
    element.goldstoneLeafletMap = map;

    window.setTimeout(function () {
      map.invalidateSize();
    }, 100);
  }

  function markUnavailable(elements) {
    elements.forEach(function (element) {
      element.classList.add("map-block__canvas--unavailable");
      element.textContent = "2D map could not load. Coordinate data remains available below.";
    });
  }

  function initMaps(elements) {
    loadLeaflet().then(function () {
      elements.forEach(initMap);
    }).catch(function () {
      markUnavailable(elements);
    });
  }

  var mapElements = Array.prototype.slice.call(document.querySelectorAll(".js-property-map"));
  if (!mapElements.length) return;

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        // The 2D canvas itself may start hidden (3D is the default tab),
        // so initialize the inner map element; Leaflet will size correctly
        // once the user reveals it and the toggle script calls invalidateSize.
        var inner = entry.target.querySelector(".js-property-map") || entry.target;
        initMaps([inner]);
      });
    }, { rootMargin: "320px 0px" });

    mapElements.forEach(function (element) {
      var stage = element.closest(".js-map-stage") || element;
      observer.observe(stage);
    });
  } else {
    initMaps(mapElements);
  }
})();
