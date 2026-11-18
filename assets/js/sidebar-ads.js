
/* ==========================================
   SIDEBAR ADS CONNECTOR
   Reads advertisement data from ads.js
   ========================================== */

(function () {
    "use strict";

    const ROTATION_INTERVAL = 50000;
    const ADS_PER_PAGE = 3;

    const container = document.getElementById(
        "sidebarAdsContainer"
    );

    const indicator = document.getElementById(
        "sidebarAdsIndicator"
    );

    if (!container) return;

    let currentIndex = 0;
    let rotationTimer = null;

    function getAds() {
        return (window.SMM_ADS || []).filter(ad =>
            ad.active === true &&
            ad.media &&
            ad.link &&
            ["image", "video"].includes(ad.type)
        );
    }

    function createAdCard(ad) {
        const card = document.createElement("a");

        card.className = "sidebar-ad-card";
        card.href = ad.link;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.setAttribute(
            "aria-label",
            ad.title || "Sponsored advertisement"
        );

        if (ad.type === "video") {
            const video = document.createElement("video");

            video.className = "sidebar-ad-media";
            video.src = ad.media;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = "metadata";

            card.appendChild(video);

        } else {
            const img = document.createElement("img");

            img.className = "sidebar-ad-media";
            img.src = ad.media;
            img.alt = ad.title || "Sponsored advertisement";
            img.loading = "lazy";

            card.appendChild(img);
        }

        const label = document.createElement("span");
        label.className = "sidebar-ad-label";
        label.textContent = "Sponsored";

        card.appendChild(label);

        return card;
    }

    function renderAds() {
        const ads = getAds();

        if (!ads.length) {
            container.innerHTML = `
                <div class="sidebar-ads-empty">
                    No advertisements available.
                </div>
            `;

            if (indicator) indicator.innerHTML = "";
            return;
        }

        const totalPages = Math.ceil(
            ads.length / ADS_PER_PAGE
        );

        currentIndex = currentIndex % totalPages;

        const start = currentIndex * ADS_PER_PAGE;

        const visibleAds = ads.slice(
            start,
            start + ADS_PER_PAGE
        );

        const fragment = document.createDocumentFragment();

        visibleAds.forEach(ad => {
            fragment.appendChild(createAdCard(ad));
        });

        container.replaceChildren(fragment);

        if (indicator) {
            indicator.textContent =
                `${currentIndex + 1} / ${totalPages}`;
        }
    }

    function startRotation() {
        if (rotationTimer) {
            clearInterval(rotationTimer);
        }

        const ads = getAds();

        if (ads.length <= ADS_PER_PAGE) return;

        rotationTimer = setInterval(() => {
            currentIndex++;

            renderAds();
        }, ROTATION_INTERVAL);
    }

    function initAds() {
        renderAds();
        startRotation();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initAds
        );
    } else {
        initAds();
    }

})();
