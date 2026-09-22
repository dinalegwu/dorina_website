const PRODUCTS = [
    { id: "golden-penny-rice-10kg", name: "Golden Penny Rice (10kg)", description: "Quality rice for everyday meals.", price: 25500, image: "images/rice.png", category: "food-stuffs" },
    { id: "golden-penny-spaghetti-500g", name: "Golden Penny Spaghetti (500g)", description: "Delicious pasta for the whole family.", price: 1200, image: "images/spaghetti.png", category: "food-stuffs" },
    { id: "indomie-noodles-70g", name: "Indomie Noodles (70g)", description: "Quick and tasty chicken-flavour noodles.", price: 250, image: "images/indomie.png", category: "food-stuffs" },
    { id: "grand-vegetable-oil-1l", name: "Grand Vegetable Oil (1L)", description: "Vegetable oil for your cooking needs.", price: 4000, image: "images/vegetable-oil.png", category: "food-stuffs" },
    { id: "coca-cola-50cl", name: "Coca-Cola (50cl)", description: "A refreshing soft drink for any occasion.", price: 500, image: "images/coca-cola.png", category: "soft-drinks" },
    { id: "pepsi-50cl", name: "Pepsi (50cl)", description: "Refreshing cola drink.", price: 500, image: "images/pepsi.png", category: "soft-drinks" },
    { id: "milo-400g", name: "Milo (400g)", description: "Chocolate malt beverage for the family.", price: 2500, image: "images/milo.png", category: "beverages" },
    { id: "dettol-soap-150g", name: "Dettol Soap (150g)", description: "Personal-care soap for everyday use.", price: 800, image: "images/dettol-soap.png", category: "cosmetics-personal-care" },
    { id: "ariel-detergent-1kg", name: "Ariel Detergent (1kg)", description: "Quality detergent for laundry.", price: 2300, image: "images/ariel.png", category: "household-cleaning" },
    { id: "pepsodent-50cl", name: "Pepsodent (50cl)", description: "Fresh and clean everyday oral-care essential.", price: 850, image: "images/pepsodent.png", category: "cosmetics-personal-care" },
    { id: "nescafe-100g", name: "Nescafé (100g)", description: "Classic coffee for your everyday moments.", price: 2800, image: "images/nescafe.png", category: "beverages" },
    { id: "familia-tissue-10-rolls", name: "Familia Tissue (10 Rolls)", description: "Soft household tissue for everyday use.", price: 2000, image: "images/familia.png", category: "sanitary-wares" },
    { id: "cosmetics", name: "Cosmetics", description: "Premium cosmetics for everyday use.", price: 2300, image: "images/cosmetics.png", category: "cosmetics-personal-care" },
    { id: "peak-milk-400g", name: "Peak Milk (400g)", description: "Creamy milk for drinks and meals.", price: 1800, image: "images/peak-milk.png", category: "milk-dairy" },
    { id: "dano-milk-powder-400g", name: "Dano Milk Powder (400g)", description: "Milk powder for the whole family.", price: 2700, image: "images/dano-milk powder.png", category: "milk-dairy" },
    { id: "cabin-biscuits", name: "Cabin Biscuits", description: "A convenient snack for everyday moments.", price: 2700, image: "images/biscuit.png", category: "biscuits-snacks" }
];

const CATEGORIES = [
    { id: "all", name: "All Products", icon: "◉", description: "Browse everything" },
    { id: "soft-drinks", name: "Soft Drinks", icon: "◌", description: "Refreshing favourites" },
    { id: "beverages", name: "Beverages", icon: "☕", description: "Milo, coffee & more" },
    { id: "food-stuffs", name: "Food Stuffs", icon: "▦", description: "Kitchen essentials" },
    { id: "cosmetics-personal-care", name: "Cosmetics & Personal Care", icon: "✦", description: "Everyday care" },
    { id: "sanitary-wares", name: "Sanitary Wares", icon: "＋", description: "Clean & comfortable" },
    { id: "household-cleaning", name: "Household & Cleaning", icon: "⌂", description: "Home essentials" },
    { id: "milk-dairy", name: "Milk & Dairy", icon: "○", description: "Milk for the family" },
    { id: "biscuits-snacks", name: "Biscuits & Snacks", icon: "◇", description: "Quick bites" }
];

let cart = loadCart();

function loadCart() {
    try {
        const stored = JSON.parse(localStorage.getItem("dorinasCart"));
        if (!Array.isArray(stored)) return [];
        return stored.filter(item =>
            item &&
            typeof item.name === "string" &&
            Number.isFinite(Number(item.price)) &&
            Number(item.price) >= 0 &&
            Number.isInteger(Number(item.quantity)) &&
            Number(item.quantity) > 0
        ).map(item => ({
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity)
        }));
    } catch {
        return [];
    }
}

function saveCart() {
    localStorage.setItem("dorinasCart", JSON.stringify(cart));
}

function addToCart(productId) {
    const product = PRODUCTS.find(item => item.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: product.name, price: product.price, quantity: 1 });
    }

    saveCart();
    updateCart();
}

function changeQuantity(index, change) {
    const item = cart[index];
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) cart.splice(index, 1);

    saveCart();
    updateCart();
}

function removeFromCart(index) {
    if (!cart[index]) return;
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function clearCart() {
    if (!cart.length) return;
    cart = [];
    saveCart();
    updateCart();
}

function updateCart() {
    const count = document.getElementById("cart-count");
    const itemsContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (count) count.textContent = totalQuantity.toLocaleString();
    if (totalElement) totalElement.textContent = formatPrice(totalPrice);

    const orderButton = document.getElementById("order-whatsapp");
    const clearButton = document.getElementById("clear-cart");
    if (orderButton) orderButton.disabled = cart.length === 0;
    if (clearButton) clearButton.disabled = cart.length === 0;
    if (!itemsContainer) return;

    itemsContainer.replaceChildren();

    if (!cart.length) {
        const empty = document.createElement("p");
        empty.className = "cart-empty";
        empty.textContent = "Your cart is empty.";
        itemsContainer.appendChild(empty);
        return;
    }

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");
        const name = document.createElement("h3");
        name.textContent = item.name;
        const unit = document.createElement("p");
        unit.textContent = formatPrice(item.price) + " each";
        details.append(name, unit);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";
        controls.append(
            createCartButton("−", "Decrease quantity", () => changeQuantity(index, -1))
        );
        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;
        quantity.setAttribute("aria-label", "Quantity");
        controls.appendChild(quantity);
        controls.append(
            createCartButton("+", "Increase quantity", () => changeQuantity(index, 1))
        );

        const subtotal = document.createElement("strong");
        subtotal.textContent = formatPrice(item.price * item.quantity);

        const remove = document.createElement("button");
        remove.className = "remove-button";
        remove.type = "button";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => removeFromCart(index));

        row.append(details, controls, subtotal, remove);
        itemsContainer.appendChild(row);
    });
}

function createCartButton(text, label, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", handler);
    return button;
}

function orderOnWhatsApp() {
    if (!cart.length) {
        alert("Your cart is empty. Please add a product first.");
        return;
    }

    const items = cart.map(item =>
        item.name + " x" + item.quantity + " = " + formatPrice(item.price * item.quantity)
    ).join("\n");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const message = "Hello Dorina's, I would like to place an order:\n\n" + items + "\n\nTotal: " + formatPrice(total);
    window.open("https://wa.me/2348148157968?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
}

function formatPrice(value) {
    return "₦" + Number(value).toLocaleString("en-NG");
}
