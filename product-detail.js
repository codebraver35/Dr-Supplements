function addDetailProductToCart(button) {
    const count = document.getElementById("cart-count");
    const status = button.closest(".product-card").querySelector(".detail-cart-status");
    const previousCount = count.textContent;

    status.textContent = "";
    addProductToCart(button);
    if (count.textContent !== previousCount) {
        status.textContent = "Added to your cart.";
    }
}

const detailPhotoButton = document.querySelector(".detail-photo");
if (detailPhotoButton) {
    const photo = detailPhotoButton.querySelector("img");
    const thumbnails = document.querySelectorAll(".detail-thumbnails button");
    for (const thumbnail of thumbnails) {
        thumbnail.addEventListener("click", () => {
            for (const item of thumbnails) {
                item.setAttribute("aria-pressed", String(item === thumbnail));
            }
            photo.src = thumbnail.querySelector("img").src;
        });
    }

    const lightbox = document.getElementById("lightbox");
    const closeButton = lightbox.querySelector("button");

    detailPhotoButton.addEventListener("click", () => {
        openLightbox(photo.src);
        closeButton.focus();
    });
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox || event.target === closeButton) {
            detailPhotoButton.focus();
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && lightbox.contains(document.activeElement)) {
            detailPhotoButton.focus();
        }
    }, { capture: true });
}
