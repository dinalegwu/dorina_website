const PRODUCTS = [
    { id: "golden-penny-rice-10kg", name: "Golden Penny Rice (10kg)", description: "Quality rice for everyday meals.", price: 25500, image: "images/rice.jpg", category: "food-stuffs" },
    { id: "golden-penny-spaghetti-500g", name: "Golden Penny Spaghetti (500g)", description: "Delicious pasta for the whole family.", price: 1200, image: "images/spaghetti.jpg", category: "food-stuffs" },
    { id: "indomie-noodles-70g", name: "Indomie Noodles (70g)", description: "Quick and tasty chicken-flavour noodles.", price: 250, image: "images/indomie.jpg", category: "food-stuffs" },
    { id: "grand-vegetable-oil-1l", name: "Grand Vegetable Oil (1L)", description: "Vegetable oil for your cooking needs.", price: 4000, image: "images/vegetable-oil.jpg", category: "food-stuffs" },
    { id: "coca-cola-50cl", name: "Coca-Cola (50cl)", description: "A refreshing soft drink for any occasion.", price: 500, image: "images/coca-cola.jpg", category: "soft-drinks" },
    { id: "pepsi-50cl", name: "Pepsi (50cl)", description: "Refreshing cola drink.", price: 500, image: "images/pepsi.jpg", category: "soft-drinks" },
    { id: "milo-400g", name: "Milo (400g)", description: "Chocolate malt beverage for the family.", price: 2500, image: "images/milo.jpg", category: "beverages" },
    { id: "dettol-soap-150g", name: "Dettol Soap (150g)", description: "Personal-care soap for everyday use.", price: 800, image: "images/dettol-soap.jpg", category: "cosmetics-personal-care" },
    { id: "ariel-detergent-1kg", name: "Ariel Detergent (1kg)", description: "Quality detergent for laundry.", price: 2300, image: "images/ariel.jpg", category: "household-cleaning" },
    { id: "pepsodent-50cl", name: "Pepsodent (50cl)", description: "Fresh and clean everyday oral-care essential.", price: 850, image: "images/pepsodent.jpg", category: "cosmetics-personal-care" },
    { id: "nescafe-100g", name: "Nescafé (100g)", description: "Classic coffee for your everyday moments.", price: 2800, image: "images/nescafe.jpg", category: "beverages" },
    { id: "familia-tissue-10-rolls", name: "Familia Tissue (10 Rolls)", description: "Soft household tissue for everyday use.", price: 2000, image: "images/familia.jpg", category: "sanitary-wares" },
    { id: "cosmetics", name: "Cosmetics", description: "Personal-care cosmetics for everyday use.", price: 2300, image: "images/cosmetics.jpg", category: "cosmetics-personal-care" },
    { id: "peak-milk-400g", name: "Peak Milk (400g)", description: "Creamy milk for drinks and meals.", price: 1800, image: "images/peak-milk.jpg", category: "milk-dairy" },
    { id: "dano-milk-powder-400g", name: "Dano Milk Powder (400g)", description: "Milk powder for the whole family.", price: 2700, image: "images/dano.jpg", category: "milk-dairy" },
    { id: "cabin-biscuits", name: "Cabin Biscuits", description: "A convenient snack for everyday moments.", price: 2700, image: "images/biscuit.jpg", category: "biscuits-snacks" }
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
        ).map(item => {
            const product = PRODUCTS.find(productItem => productItem.name === item.name);
            return {
                id: item.id || (product ? product.id : ""),
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity),
                image: item.image || (product ? product.image : "")
            };
        });
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
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
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

    const itemCountElement = document.getElementById("cart-item-count");
    if (itemCountElement) itemCountElement.textContent = totalQuantity + (totalQuantity === 1 ? " item" : " items");

    const orderButton = document.getElementById("order-whatsapp");
    const clearButton = document.getElementById("clear-cart");
    if (orderButton) orderButton.disabled = cart.length === 0;
    if (clearButton) clearButton.disabled = cart.length === 0;
    if (!itemsContainer) return;

    itemsContainer.replaceChildren();

    if (!cart.length) {
        const empty = document.createElement("div");
        empty.className = "cart-empty";
        const message = document.createElement("p");
        message.textContent = "Your cart is empty.";
        const browse = document.createElement("button");
        browse.className = "secondary-button cart-browse-button";
        browse.type = "button";
        browse.textContent = "Browse Products";
        browse.addEventListener("click", () => {
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        empty.append(message, browse);
        itemsContainer.appendChild(empty);
        return;
    }

    cart.forEach((item, index) => {
        const row = document.createElement("article");
        row.className = "cart-item";

        const media = document.createElement("div");
        media.className = "cart-item-media";
        if (item.image) {
            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;
            image.loading = "lazy";
            image.decoding = "async";
            image.addEventListener("error", () => {
                image.removeAttribute("src");
                image.classList.add("image-fallback");
                image.alt = item.name + " image unavailable";
            });
            media.appendChild(image);
        } else {
            media.classList.add("image-fallback");
        }

        const details = document.createElement("div");
        details.className = "cart-item-details";
        const name = document.createElement("h3");
        name.textContent = item.name;
        const unit = document.createElement("p");
        unit.textContent = formatPrice(item.price) + " each";
        details.append(name, unit);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";
        controls.append(
            createCartButton("−", "Decrease quantity for " + item.name, () => changeQuantity(index, -1))
        );
        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;
        quantity.setAttribute("aria-label", item.name + " quantity");
        quantity.setAttribute("aria-live", "polite");
        controls.appendChild(quantity);
        controls.append(
            createCartButton("+", "Increase quantity for " + item.name, () => changeQuantity(index, 1))
        );

        const subtotal = document.createElement("div");
        subtotal.className = "cart-item-subtotal";
        const subtotalLabel = document.createElement("span");
        subtotalLabel.textContent = "Subtotal";
        const subtotalValue = document.createElement("strong");
        subtotalValue.textContent = formatPrice(item.price * item.quantity);
        subtotal.append(subtotalLabel, subtotalValue);

        const remove = document.createElement("button");
        remove.className = "remove-button";
        remove.type = "button";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => removeFromCart(index));

        row.append(media, details, controls, subtotal, remove);
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

    const items = cart.map((item, index) =>
        (index + 1) + ". " + item.name + "\n" +
        "   Qty: " + item.quantity + "\n" +
        "   Subtotal: " + formatPrice(item.price * item.quantity)
    ).join("\n\n");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const message =
        "Hello Dorina's,\n\n" +
        "I'd like to place the following order:\n\n" +
        items +
        "\n\n----------------\n" +
        "TOTAL: " + formatPrice(total) +
        "\n----------------\n\n" +
        "Please confirm availability and delivery details.\n" +
        "Thank you.";
    window.open("https://wa.me/2348148157968?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
}

function formatPrice(value) {
    return "₦" + Number(value).toLocaleString("en-NG");
}
