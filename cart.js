// cart.js — shared across all pages

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
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

    if (!cartItems || !cartCount || !cartTotal) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <p>${item.name}</p>
                <p>$${item.price} x ${item.quantity}</p>
                <div>
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <button class="qty-btn" onclick="changeQuantity(${index}, +1)">+</button>
                    <button class="delete-btn" onclick="removeItem(${index})">X</button>
                </div>
            </div>
        `;
    });

cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.innerText = total.toFixed(2);

    const discountedRow = document.getElementById("discounted-total-row");
    const discountedTotal = document.getElementById("discounted-total");

    if (activePromo && discountedRow && discountedTotal) {
        const discounted = total * (1 - activePromo.discount / 100);
        discountedTotal.innerText = discounted.toFixed(2);
        discountedRow.style.display = "block";
    } else if (discountedRow) {
        discountedRow.style.display = "none";
    }
}

function addProductToCart(button) {
    const card = button.closest('.product-card');
    const name = card.querySelector("h3, h1").innerText;
    const price = parseFloat(card.querySelector(".price").innerText.replace("$", ""));
    const flavorSelect = card.querySelector(".flavor-select");

    if (flavorSelect && (!flavorSelect.value || flavorSelect.value === "Choose Flavor")) {
        alert("Please select a flavor first");
        return;
    }

    const flavor = flavorSelect ? flavorSelect.value : "";
    const fullName = flavor ? `${name} (${flavor})` : name;
    addToCart(fullName, price);
}

function orderProduct(button) {
    const card = button.closest('.product-card');
    if (!card) return;
    const name = card.querySelector("h3, h1")?.innerText;
    const flavorSelect = card.querySelector(".flavor-select");

    if (flavorSelect && (!flavorSelect.value || flavorSelect.value === "Choose Flavor")) {
        alert("Please select a flavor first");
        return;
    }

    const flavor = flavorSelect ? flavorSelect.value : "";
    const message = `Hello, I want to order:\nProduct: ${name}\nFlavor: ${flavor}`;
    window.open(`https://wa.me/96171236230?text=${encodeURIComponent(message)}`, "_blank");
}

document.addEventListener("DOMContentLoaded", updateCart);

// ── Cart checkout modal ──────────────────────────────────────────

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    openCartModal();
}

function openCartModal() {
    const existing = document.getElementById("cart-order-modal");
    if (existing) existing.remove();

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const discount = activePromo ? activePromo.discount : 0;
const total = subtotal * (1 - discount / 100);
const promoRow = activePromo
    ? `<div class="co-total" style="color:green;font-size:13px;">
           <span>🏷️ Promo (${activePromo.code})</span>
           <span>-${discount}%</span>
       </div>`
    : "";

    const itemsHTML = cart.map(item => `
        <div class="co-row">
            <span class="co-name">${item.name}</span>
            <span class="co-qty">x${item.quantity}</span>
            <span class="co-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join("");

    const modal = document.createElement("div");
modal.id = "cart-order-modal";
document.body.style.overflow = "hidden"; // prevent background scroll
modal.innerHTML = `
    <style>
        #cart-order-modal {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.6);
            display: flex; align-items: center; justify-content: center;
            z-index: 999999; padding: 1rem;
            box-sizing: border-box;
        }
            .co-box {
                background: #fff; border-radius: 14px; padding: 1.5rem;
                width: 100%; max-width: 460px; font-family: inherit;
                max-height: 90vh; overflow-y: auto;
            }
            .co-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 1.25rem;
            }
            .co-header h3 { font-size: 16px; font-weight: 600; margin: 0; }
            .co-close {
                background: none; border: none; font-size: 20px;
                cursor: pointer; color: #888; line-height: 1; padding: 0;
            }
            .co-items {
                border: 1px solid #eee; border-radius: 8px;
                overflow: hidden; margin-bottom: 0.75rem;
            }
            .co-row {
                display: flex; align-items: center; padding: 9px 12px;
                border-bottom: 1px solid #f0f0f0; font-size: 13px;
            }
            .co-row:last-child { border-bottom: none; }
            .co-name { flex: 1; }
            .co-qty { color: #888; margin: 0 12px; }
            .co-price { font-weight: 500; }
            .co-total {
                display: flex; justify-content: space-between;
                font-size: 14px; padding: 8px 0; margin-bottom: 1rem;
                border-top: 1px solid #eee;
            }
            .co-total span:last-child { font-weight: 600; }
            .co-divider { height: 1px; background: #eee; margin: 1rem 0; }
            .co-label { font-size: 12px; color: #888; margin-bottom: 8px; }
            .co-field {
                width: 100%; padding: 9px 11px; border: 1px solid #ddd;
                border-radius: 8px; font-size: 13px; margin-bottom: 10px;
                font-family: inherit; box-sizing: border-box;
            }
            textarea.co-field { resize: none; height: 64px; }
            .co-submit {
                width: 100%; padding: 11px; border: none; border-radius: 8px;
                background: #25D366; color: #fff; font-size: 14px;
                font-weight: 600; cursor: pointer; margin-top: 4px;
            }
            .co-submit:hover { background: #1ebe5d; }
        </style>
        <div class="co-box">
            <div class="co-header">
                <h3>Confirm your order</h3>
                <button class="co-close" onclick="closeCartModal()">✕</button>
            </div>
            <div class="co-items">${itemsHTML}</div>
            <div class="co-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="co-divider"></div>
            <p class="co-label">Delivery details</p>
            <input id="co-name"    class="co-field" type="text" placeholder="Full name" />
            <input id="co-phone"   class="co-field" type="tel"  placeholder="Phone number" />
            <input id="co-address" class="co-field" type="text" placeholder="Delivery address" />
            <textarea id="co-notes" class="co-field" placeholder="Notes (optional)"></textarea>
            <button class="co-submit" onclick="submitCartOrder()">Send order via WhatsApp</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", e => { if (e.target === modal) closeCartModal(); });
}

function closeCartModal() {
    const modal = document.getElementById("cart-order-modal");
    if (modal) modal.remove();
}

function submitCartOrder() {
    const name    = document.getElementById("co-name").value.trim();
    const phone   = document.getElementById("co-phone").value.trim();
    const address = document.getElementById("co-address").value.trim();
    const notes   = document.getElementById("co-notes").value.trim();

    if (!name || !phone || !address) {
        alert("Please fill in your name, phone, and address.");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = activePromo ? subtotal * (1 - activePromo.discount / 100) : subtotal;

    let message = `🛒 New Order!\n──────────────────\n`;

    // List all items
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `──────────────────\n`;

    // Promo & total
    if (activePromo) {
        message += `💰 Subtotal : $${subtotal.toFixed(2)}\n`;
        message += `🏷️ Promo    : ${activePromo.code} (-${activePromo.discount}%)\n`;
        message += `✅ Total    : $${finalTotal.toFixed(2)}\n`;
    } else {
        message += `💰 Total    : $${subtotal.toFixed(2)}\n`;
    }

    message += `──────────────────\n`;
    message += `👤 Name    : ${name}\n`;
    message += `📞 Phone   : ${phone}\n`;
    message += `📍 Address : ${address}\n`;
    message += `📝 Notes   : ${notes || "—"}\n`;
    message += `──────────────────`;

    window.open(`https://wa.me/96171236230?text=${encodeURIComponent(message)}`, "_blank");
    closeCartModal();
}
// ── PROMO CODES ──────────────────────────────────────────
const promoCodes = {
    "DRSUP10":  10,   // 10% off
    
    
    
};

let activePromo = null;

function applyPromo() {
    const input = document.getElementById("promo-input");
    const message = document.getElementById("promo-message");
    const code = input.value.trim().toUpperCase();

    if (!code) {
        message.style.color = "#ff4444";
        message.innerText = "Please enter a promo code.";
        return;
    }

    if (promoCodes[code]) {
        activePromo = { code, discount: promoCodes[code] };
        message.style.color = "#25D366";
        message.innerText = `✔ "${code}" applied — ${promoCodes[code]}% off!`;
        updateCart();
    } else {
        activePromo = null;
        message.style.color = "#ff4444";
        message.innerText = "❌ Invalid promo code.";
        updateCart();
    }
}