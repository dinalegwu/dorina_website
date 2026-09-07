const cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartCount();
    alert(`${name} has been added to your cart.`);
}

function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (count) count.textContent = cart.length;
}

function showCart() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const items = cart.map((item, index) => `${index + 1}. ${item.name} - ₦${item.price.toLocaleString()}`).join("\n");
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Your Cart:\n\n${items}\n\nTotal: ₦${total.toLocaleString()}`);
}
