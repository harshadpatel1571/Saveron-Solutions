/** Shared DOM enhancements for static pages. */ (function initialiseSharedComponents() {
  const config = window.SAVERON_CONFIG;
  function enhanceBranding() {
    document.querySelectorAll(".brand-logo").forEach((brand) => {
      brand.setAttribute("aria-label",
      `${config.companyName} home`);
      brand.innerHTML = `
        <img class="brand-logo-image" src="assets/images/saveron-logo.png"
          width="1733" height="1396" alt="SAVERON Solutions Private Limited">
        <span class="sr-only">${config.companyName}</span>`;
    });
  } function setExternalLinkSafety() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      link.rel = "noopener noreferrer";
    });
  } document.addEventListener("DOMContentLoaded",
  () => {
    enhanceBranding();
    setExternalLinkSafety();
  });
})();
