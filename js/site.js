document.addEventListener("DOMContentLoaded", function() {

    document.documentElement.style.setProperty(
        "--hero-bg-image",
        `url('${SITE_CONFIG.heroImage}')`
    );

    document.querySelectorAll(".site-tagline").forEach(function(el) {
        el.textContent = SITE_CONFIG.tagline;
    });

    document.querySelectorAll(".site-email").forEach(function(el) {
        el.textContent = SITE_CONFIG.email;
        el.href = "mailto:" + SITE_CONFIG.email;
    });

    document.querySelectorAll(".site-phone").forEach(function(el) {
        el.textContent = SITE_CONFIG.phone;
    });

    document.querySelectorAll(".site-phone-link").forEach(function(el) {
        el.textContent = SITE_CONFIG.phone;
        el.href = "tel:" + SITE_CONFIG.phone.replace(/\s/g, "");
    });

    document.querySelectorAll(".site-address").forEach(function(el) {
        el.textContent = SITE_CONFIG.address;
    });

    document.querySelectorAll(".site-website").forEach(function(el) {
        el.textContent = SITE_CONFIG.website.replace(/^https?:\/\//, "");
        el.href = SITE_CONFIG.website;
    });
});
