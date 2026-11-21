// Scroll reveal
const cards = document.querySelectorAll(".category-card");

cards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(60px)";
    card.style.transition = "all 0.8s ease";
});

window.addEventListener("scroll", () => {
    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {
        const top = card.getBoundingClientRect().top;

        if (top < trigger) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
});
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});



// your animations (KEEP)

// your header scroll (KEEP)


// ===== CART SYSTEM (NEW) =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        removeItem(index);
        return;
    }

    saveCart();
    updateCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems) return; // IMPORTANT (prevents errors on other pages)

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <p>${item.name}</p>
                <p>$${item.price} x ${item.quantity}</p>

                <div>
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                    <button onclick="removeItem(${index})">❌</button>
                </div>
            </div>
        `;
    });

    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.innerText = total;
}

updateCart();
function addProductToCart(button) {
    const card = button.closest('.product-card');

    const name = card.querySelector("h3").innerText;
    const priceText = card.querySelector(".price").innerText;
    const price = parseFloat(priceText.replace("$", ""));

    const flavorSelect = card.querySelector(".flavor-select");

    if (!flavorSelect.value || flavorSelect.value === "Choose Flavor") {
        alert("Please select a flavor first");
        return;
    }

    const flavor = flavorSelect.value;

    const fullName = `${name} (${flavor})`;

    addToCart(fullName, price);
}
function orderProduct(button) {
    const card = button.closest('.product-card');

    if (!card) return;

    const name = card.querySelector("h3")?.innerText;
    const flavorSelect = card.querySelector(".flavor-select");

    if (!flavorSelect || !flavorSelect.value || flavorSelect.value === "Choose Flavor") {
        alert("Please select a flavor first");
        return;
    }

    const flavor = flavorSelect.value;

    const message = `Hello, I want to order:\nProduct: ${name}\nFlavor: ${flavor}`;
    const url = `https://wa.me/96171236230?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}