(function () {
  "use strict";

  function trafficSource() {
    var campaignSource = new URLSearchParams(window.location.search).get("utm_source");
    if (campaignSource) return campaignSource;
    if (!document.referrer) return "direct";
    try {
      return new URL(document.referrer).hostname || "referral";
    } catch (_error) {
      return "referral";
    }
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-adobe-license]");
    if (!link || typeof window.gtag !== "function") return;
    window.gtag("event", "click_adobe_stock", {
      asset_id: link.dataset.assetId || "",
      page_path: link.dataset.page || window.location.pathname,
      collection: link.dataset.collection || "uncategorized",
      traffic_source: trafficSource(),
      transport_type: "beacon"
    });
  });
})();
