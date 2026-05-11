// 3D / aerial view: when the user clicks the 3D toggle on a property page,
// inject a Google Maps Embed iframe in satellite-hybrid mode (colorful aerial
// imagery, embeddable without an API key). A "Open in Google Earth" link in
// the popup and below the map covers true 3D perspective in a new tab.

(function () {
  "use strict";

  function buildEmbedUrl(lat, lng) {
    // t=k -> satellite, output=embed -> embeddable, hl=en -> English labels.
    return "https://www.google.com/maps?q=" + encodeURIComponent(lat + "," + lng) +
      "&t=k&z=15&hl=en&output=embed";
  }

  function buildEarthUrl(lat, lng) {
    return "https://earth.google.com/web/@" + lat + "," + lng + ",2000a,5000d,35y,0h,60t,0r/";
  }

  function initStage(stage) {
    var twoD = stage.querySelector(".js-property-map");
    var threeD = stage.querySelector(".js-property-map-3d");
    var note = stage.querySelector(".js-map-terrain-note");
    var twoDButton = stage.querySelector(".js-map-2d-toggle");
    var threeDButton = stage.querySelector(".js-map-3d-toggle");

    var property = {
      name: stage.dataset.propertyName,
      lat: Number(stage.dataset.lat),
      lng: Number(stage.dataset.lng),
    };

    if (!twoD || !threeD || !twoDButton || !threeDButton ||
        !Number.isFinite(property.lat) || !Number.isFinite(property.lng)) return;

    var iframeBuilt = false;

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

    function buildIframe() {
      if (iframeBuilt) return;
      threeD.innerHTML = "";
      var iframe = document.createElement("iframe");
      iframe.src = buildEmbedUrl(property.lat, property.lng);
      iframe.setAttribute("title", "Google Maps satellite view of " + (property.name || "property"));
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      iframe.setAttribute("allowfullscreen", "");
      iframe.style.border = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      threeD.appendChild(iframe);

      var actions = document.createElement("div");
      actions.className = "map-3d-actions";
      var earth = document.createElement("a");
      earth.href = buildEarthUrl(property.lat, property.lng);
      earth.target = "_blank";
      earth.rel = "noopener";
      earth.className = "map-3d-actions__link";
      earth.textContent = "Open in Google Earth (real 3D)";
      actions.appendChild(earth);
      threeD.appendChild(actions);

      if (note) note.hidden = true;
      iframeBuilt = true;
    }

    twoDButton.addEventListener("click", function () { setMode("2d"); });
    threeDButton.addEventListener("click", function () {
      buildIframe();
      setMode("3d");
    });

    // 3D Aerial is the default tab — build the iframe immediately so it
    // renders on first paint without waiting for a click.
    buildIframe();
  }

  document.querySelectorAll(".js-map-stage").forEach(initStage);
})();
