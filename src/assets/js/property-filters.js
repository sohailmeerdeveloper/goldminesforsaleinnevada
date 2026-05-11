(function () {
  "use strict";

  var root = document.querySelector(".properties-listing");
  if (!root) return;

  var cards = Array.prototype.slice.call(root.querySelectorAll(".js-property-card"));
  var inputs = Array.prototype.slice.call(root.querySelectorAll(".filter-group input[type='checkbox']"));
  var countNode = root.querySelector(".js-result-count");
  var emptyNode = root.querySelector(".js-empty-state");
  var clearButton = root.querySelector(".js-filter-clear");

  function selectedValues(name) {
    return inputs
      .filter(function (input) {
        return input.name === name && input.checked;
      })
      .map(function (input) {
        return input.value;
      });
  }

  function matchesGroup(selected, values) {
    if (!selected.length) return true;
    return selected.some(function (value) {
      return values.indexOf(value) !== -1;
    });
  }

  function updateCount(count) {
    if (!countNode) return;
    countNode.textContent = count + " " + (count === 1 ? "property" : "properties") + " shown";
  }

  function applyFilters() {
    var commodities = selectedValues("commodity");
    var counties = selectedValues("county");
    var deposits = selectedValues("deposit");
    var visibleCount = 0;

    cards.forEach(function (card) {
      var cardCommodities = (card.dataset.commodities || "").split(/\s+/).filter(Boolean);
      var cardCounty = card.dataset.county || "";
      var cardDeposit = card.dataset.deposit || "";
      var visible = matchesGroup(commodities, cardCommodities) &&
        matchesGroup(counties, [cardCounty]) &&
        matchesGroup(deposits, [cardDeposit]);

      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    updateCount(visibleCount);
    if (emptyNode) emptyNode.hidden = visibleCount !== 0;
  }

  inputs.forEach(function (input) {
    input.addEventListener("change", applyFilters);
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      inputs.forEach(function (input) {
        input.checked = false;
      });
      applyFilters();
    });
  }

  updateCount(cards.length);
})();
