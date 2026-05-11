(function () {
  "use strict";

  function fixedCoord(value) {
    return Number(value).toFixed(5);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function getToken(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  var mapLibrePromise = null;

  function loadCssOnce(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScriptOnce(src) {
    if (window.maplibregl) return Promise.resolve();
    if (mapLibrePromise) return mapLibrePromise;

    mapLibrePromise = new Promise(function (resolve, reject) {
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

    return mapLibrePromise;
  }

  function loadMapLibre() {
    loadCssOnce("https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css");
    return loadScriptOnce("https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js");
  }

  function terrainStyle(key) {
    return {
      version: 8,
      sources: {
        terrain: {
          type: "raster-dem",
          url: "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=" + encodeURIComponent(key),
          tileSize: 512,
        },
        satellite: {
          type: "raster",
          tiles: [
            "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=" + encodeURIComponent(key),
          ],
          tileSize: 512,
          attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; OpenStreetMap contributors',
          maxzoom: 20,
        },
      },
      layers: [
        {
          id: "satellite",
          type: "raster",
          source: "satellite",
        },
        {
          id: "hillshade",
          type: "hillshade",
          source: "terrain",
          paint: {
            "hillshade-shadow-color": "#2a221b",
            "hillshade-highlight-color": "#f4efe6",
            "hillshade-accent-color": "#a8472b",
          },
        },
      ],
      terrain: {
        source: "terrain",
        exaggeration: 1.35,
      },
    };
  }

  function addFlyControl(map, property) {
    var container = document.createElement("div");
    container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "map-3d-fly";
    button.setAttribute("aria-label", "Fly to property");
    button.textContent = "Fly to property";
    button.addEventListener("click", function () {
      map.flyTo({
        center: [property.lng, property.lat],
        zoom: 13,
        pitch: 60,
        bearing: -18,
        essential: true,
      });
    });
    container.appendChild(button);

    return {
      onAdd: function () {
        return container;
      },
      onRemove: function () {
        container.parentNode.removeChild(container);
      },
    };
  }

  function addPropertyMarker(map, property) {
    var marker = document.createElement("div");
    marker.className = "map-3d-marker";
    marker.setAttribute("aria-label", property.name + " property marker");
    marker.innerHTML = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" aria-hidden="true" focusable="false">',
      '<path d="M22 3 39 20 22 37 5 20Z" fill="' + getToken("--copper", "#a8472b") + '" stroke="' + getToken("--copper-deep", "#7a2f1a") + '" stroke-width="2"/>',
      '<path d="M22 9 33 20 22 31 11 20Z" fill="' + getToken("--paper", "#f4efe6") + '" opacity="0.96"/>',
      '<path d="M22 13V27M15 20H29" stroke="' + getToken("--copper-deep", "#7a2f1a") + '" stroke-width="2" stroke-linecap="square"/>',
      "</svg>",
    ].join("");

    var popup = new maplibregl.Popup({ offset: 22 }).setHTML([
      '<div class="map-popup map-popup--3d">',
      "<h3>" + escapeHtml(property.name) + "</h3>",
      '<p><strong>Coordinates:</strong> <span class="mono numerals-data">' + fixedCoord(property.lat) + ", " + fixedCoord(property.lng) + "</span></p>",
      '<p><strong>Mindat ID:</strong> <span class="mono numerals-data">' + escapeHtml(property.mindatId) + "</span></p>",
      "</div>",
    ].join(""));

    return new maplibregl.Marker({ element: marker, anchor: "center" })
      .setLngLat([property.lng, property.lat])
      .setPopup(popup)
      .addTo(map);
  }

  function initStage(stage) {
    var twoD = stage.querySelector(".js-property-map");
    var threeD = stage.querySelector(".js-property-map-3d");
    var note = stage.querySelector(".js-map-terrain-note");
    var twoDButton = stage.querySelector(".js-map-2d-toggle");
    var threeDButton = stage.querySelector(".js-map-3d-toggle");
    var key = stage.dataset.maptilerKey || "";
    var map3d = null;
    var property = {
      name: stage.dataset.propertyName,
      lat: Number(stage.dataset.lat),
      lng: Number(stage.dataset.lng),
      mindatId: stage.dataset.mindatId,
    };

    if (!twoD || !threeD || !twoDButton || !threeDButton || !Number.isFinite(property.lat) || !Number.isFinite(property.lng)) return;

    function setMode(mode) {
      var is3d = mode === "3d";
      twoD.hidden = is3d;
      threeD.hidden = !is3d;
      twoDButton.classList.toggle("is-active", !is3d);
      threeDButton.classList.toggle("is-active", is3d);
      twoDButton.setAttribute("aria-pressed", String(!is3d));
      threeDButton.setAttribute("aria-pressed", String(is3d));
      if (!is3d && twoD.goldstoneLeafletMap) {
        window.setTimeout(function () {
          twoD.goldstoneLeafletMap.invalidateSize();
        }, 80);
      }
    }

    function showUnavailable() {
      if (note) {
        note.hidden = false;
        note.textContent = "3D terrain requires a MapTiler key. The 2D map remains available.";
        note.focus({ preventScroll: true });
      }
      if (note && note.id) {
        threeDButton.setAttribute("aria-describedby", note.id);
      }
    }

    function build3d() {
      if (!key) {
        showUnavailable();
        return;
      }
      if (!window.maplibregl) {
        if (note) {
          note.hidden = false;
          note.textContent = "3D terrain could not load. The 2D map remains available.";
        }
        return;
      }
      if (map3d) {
        setMode("3d");
        map3d.resize();
        return;
      }

      setMode("3d");
      map3d = new maplibregl.Map({
        container: threeD,
        style: terrainStyle(key),
        center: [property.lng, property.lat],
        zoom: 12,
        pitch: 60,
        bearing: -18,
        attributionControl: true,
      });
      map3d.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-left");
      map3d.addControl(addFlyControl(map3d, property), "top-left");
      addPropertyMarker(map3d, property);
      map3d.on("load", function () {
        map3d.resize();
      });
      map3d.on("error", function () {
        if (note) {
          note.hidden = false;
          note.textContent = "3D terrain could not load completely. The 2D map remains available.";
        }
      });
    }

    function init3d() {
      if (!key) {
        showUnavailable();
        return;
      }
      loadMapLibre().then(build3d).catch(function () {
        if (note) {
          note.hidden = false;
          note.textContent = "3D terrain could not load. The 2D map remains available.";
        }
      });
    }

    twoDButton.addEventListener("click", function () {
      setMode("2d");
    });
    threeDButton.addEventListener("click", init3d);
  }

  document.querySelectorAll(".js-map-stage").forEach(initStage);
})();
