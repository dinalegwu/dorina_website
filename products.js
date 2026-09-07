let cart = JSON.parse(localStorage.getItem("dorinasCart")) || [];

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

function saveCart() {
    localStorage.setItem("dorinasCart", JSON.stringify(cart));
}

function updateCart() {
    const count = document.getElementById("cart-count");
    const itemsContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (count) count.textContent = totalQuantity;
    if (totalElement) totalElement.textContent = `₦${totalPrice.toLocaleString()}`;

    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    itemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <h3>${item.name}</h3>
                <p>₦${item.price.toLocaleString()} each</p>
            </div>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <strong>₦${(item.price * item.quantity).toLocaleString()}</strong>
            <button class="remove-button" onclick="removeFromCart(${index})">Remove</button>
        </div>
    `).join("");
}

function changeQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function clearCart() {
    if (cart.length === 0) return;

    cart = [];
    saveCart();
    updateCart();
}

function showCart() {
    const cartSection = document.getElementById("cart");

    if (cartSection) {
        cartSection.scrollIntoView({ behavior: "smooth" });
    }
}

function orderOnWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add a product first.");
        return;
    }

    const items = cart.map(item =>
        `${item.name} x${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
    ).join("\n");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const message = `Hello Dorina's, I would like to place an order:\n\n${items}\n\nTotal: ₦${total.toLocaleString()}`;

    window.open(`https://wa.me/2348148157968?text=${encodeURIComponent(message)}`, "_blank");
}

window.addEventListener("DOMContentLoaded", updateCart);
