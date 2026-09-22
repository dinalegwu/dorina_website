let activeCategory = "all";
let searchTerm = "";
let showAllProducts = false;
const featuredProductIds = [
    "golden-penny-rice-10kg",
    "coca-cola-50cl",
    "dettol-soap-150g",
    "peak-milk-400g"
];

document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    renderCategories();
    renderProducts();
    updateCart();
    setupInteractions();
});

function setupInteractions() {
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle?.addEventListener("click", toggleTheme);

    const menuButton = document.getElementById("menu-button");
    const navigation = document.getElementById("primary-navigation");

    menuButton?.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
        navigation?.classList.toggle("open", !isOpen);
    });

    navigation?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => closeMobileNavigation());
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMobileNavigation();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) closeMobileNavigation();
    });

    document.getElementById("shop-now")?.addEventListener("click", () => {
        document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("cart-button")?.addEventListener("click", () => {
        document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("contact-whatsapp")?.addEventListener("click", () => {
        window.open("https://wa.me/2348148157968", "_blank", "noopener,noreferrer");
    });

    document.getElementById("order-whatsapp")?.addEventListener("click", orderOnWhatsApp);
    document.getElementById("clear-cart")?.addEventListener("click", clearCart);

    const search = document.getElementById("product-search");
    const searchForm = document.getElementById("search-form");

    searchForm?.addEventListener("submit", event => {
        event.preventDefault();
        searchTerm = search?.value.trim().toLowerCase() || "";
        showAllProducts = true;
        document.getElementById("clear-search").hidden = !searchTerm;
        renderCategories();
        renderProducts();
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    search?.addEventListener("input", event => {
        document.getElementById("clear-search").hidden = !event.target.value.trim();
    });

    document.getElementById("clear-search")?.addEventListener("click", () => {
        search.value = "";
        searchTerm = "";
        showAllProducts = false;
        document.getElementById("clear-search").hidden = true;
        renderProducts();
        search.focus();
    });

    document.getElementById("view-all")?.addEventListener("click", () => {
        const showingAll = activeCategory === "all" && !searchTerm && showAllProducts;
        activeCategory = "all";
        searchTerm = "";
        showAllProducts = !showingAll;
        const search = document.getElementById("product-search");
        if (search) search.value = "";
        document.getElementById("clear-search").hidden = true;
        renderCategories();
        renderProducts();
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("reset-filters")?.addEventListener("click", () => {
        activeCategory = "all";
        searchTerm = "";
        showAllProducts = false;
        const search = document.getElementById("product-search");
        if (search) search.value = "";
        document.getElementById("clear-search").hidden = true;
        renderCategories();
        renderProducts();
    });
}

function renderCategories() {
    const container = document.getElementById("category-grid");
    if (!container) return;

    container.replaceChildren();

    CATEGORIES.forEach(category => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "category-card" + (category.id === activeCategory ? " active" : "");
        button.setAttribute("aria-pressed", String(category.id === activeCategory));
        button.innerHTML = '<span class="category-top"><span class="category-icon" aria-hidden="true">' + category.icon + '</span><span class="category-count"></span></span><span class="category-name"></span><span class="category-description"></span>';

        const categoryProducts = category.id === "all"
            ? PRODUCTS
            : PRODUCTS.filter(product => product.category === category.id);
        button.querySelector(".category-count").textContent = categoryProducts.length + (categoryProducts.length === 1 ? " item" : " items");
        button.querySelector(".category-name").textContent = category.name;
        button.querySelector(".category-description").textContent = category.description;

        button.addEventListener("click", () => {
            activeCategory = category.id;
            const search = document.getElementById("product-search");
            if (search) search.value = "";
            searchTerm = "";
            showAllProducts = true;
            document.getElementById("clear-search").hidden = true;
            renderCategories();
            renderProducts();
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        container.appendChild(button);
    });
}

function getFilteredProducts() {
    let products = PRODUCTS;

    if (activeCategory !== "all") {
        products = products.filter(product => product.category === activeCategory);
    }

    if (searchTerm) {
        const terms = searchTerm.split(/\s+/).filter(Boolean);
        products = products.filter(product => {
            const haystack = (
                product.name + " " +
                product.description + " " +
                getCategoryName(product.category)
            ).toLowerCase();

            return terms.every(term => haystack.includes(term));
        });
    }

    return products;
}

function renderProducts() {
    const container = document.getElementById("product-container");
    const emptyState = document.getElementById("empty-products");
    const label = document.getElementById("product-results-label");
    const status = document.getElementById("product-status");
    const title = document.getElementById("products-title");
    const viewAll = document.getElementById("view-all");
    if (!container || !emptyState) return;

    let products = getFilteredProducts();
    const isDefaultView = activeCategory === "all" && !searchTerm && !showAllProducts;

    if (isDefaultView) {
        products = PRODUCTS.filter(product => featuredProductIds.includes(product.id));
        title.textContent = "Featured products";
        label.textContent = "A few customer favourites to get you started.";
        if (status) status.textContent = "";
        viewAll.textContent = "View All Products";
        viewAll.hidden = false;
    } else {
        const categoryName = activeCategory === "all" ? "All products" : getCategoryName(activeCategory);
        const searchNote = searchTerm ? ' matching "' + searchTerm + '"' : "";
        title.textContent = searchTerm ? "Search results" : (activeCategory === "all" ? "All products" : categoryName);
        label.textContent = products.length + " product" + (products.length === 1 ? "" : "s") + " in " + categoryName + searchNote + ".";
        if (status) status.textContent = products.length ? "Showing " + products.length + " available product" + (products.length === 1 ? "" : "s") + "." : "";
        viewAll.textContent = activeCategory === "all" && !searchTerm ? "Back to Featured" : "View All Products";
        viewAll.hidden = false;
    }

    container.replaceChildren();

    if (!products.length) {
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;
    products.forEach(product => container.appendChild(createProductCard(product)));
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "View details for " + product.name);
    card.addEventListener("click", event => {
        if (event.target.closest("button")) return;
        openProductDetails(product.id);
    });
    card.addEventListener("keydown", event => {
        if ((event.key === "Enter" || event.key === " ") && event.target === card) {
            event.preventDefault();
            openProductDetails(product.id);
        }
    });

    const media = document.createElement("div");
    media.className = "product-media";
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
        image.removeAttribute("src");
        image.classList.add("image-fallback");
        image.alt = product.name + " image unavailable";
    });
    media.appendChild(image);

    const cartQuantity = cart.find(item => item.name === product.name)?.quantity || 0;
    if (cartQuantity > 0) {
        card.classList.add("in-cart");
        const badge = document.createElement("span");
        badge.className = "product-cart-badge";
        badge.textContent = cartQuantity + " in cart";
        media.appendChild(badge);
    }

    const content = document.createElement("div");
    content.className = "product-content";

    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = getCategoryName(product.category);

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const footer = document.createElement("div");
    footer.className = "product-footer";

    const price = document.createElement("strong");
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-button";
    button.textContent = cartQuantity > 0 ? "Add Another" : "Add to Cart";
    button.addEventListener("click", () => {
        addToCart(product.id);
        button.textContent = "Added ✓";
        button.classList.add("added");
        setTimeout(() => {
            const quantity = cart.find(item => item.name === product.name)?.quantity || 0;
            button.textContent = quantity > 0 ? "Add Another" : "Add to Cart";
            button.classList.remove("added");
        }, 900);
    });

    footer.append(price, button);
    content.append(category, name, description, footer);
    card.append(media, content);
    return card;
}

function getCategoryName(id) {
    return CATEGORIES.find(category => category.id === id)?.name || "Other";
}


function closeMobileNavigation() {
    const menuButton = document.getElementById("menu-button");
    const navigation = document.getElementById("primary-navigation");

    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("open");
}


let detailProductId = null;
let detailQuantity = 1;

function openProductDetails(productId) {
    const product = PRODUCTS.find(item => item.id === productId);
    if (!product) return;

    detailProductId = productId;
    detailQuantity = 1;

    let modal = document.getElementById("product-details-modal");
    if (!modal) {
        modal = createProductDetailsModal();
        document.body.appendChild(modal);
    }

    renderProductDetails(product);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".product-details-close")?.focus();
}

function createProductDetailsModal() {
    const modal = document.createElement("div");
    modal.id = "product-details-modal";
    modal.className = "product-details-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "product-details-title");

    modal.innerHTML = `
        <div class="product-details-backdrop" data-close-details></div>
        <div class="product-details-dialog">
            <button class="product-details-close" type="button" aria-label="Close product details">×</button>
            <div class="product-details-media">
                <img id="product-details-image" src="" alt="">
            </div>
            <div class="product-details-content">
                <span id="product-details-category" class="product-category"></span>
                <h2 id="product-details-title"></h2>
                <p id="product-details-description" class="product-details-description"></p>
                <strong id="product-details-price" class="product-details-price"></strong>
                <div class="product-details-actions">
                    <div class="detail-quantity-controls" aria-label="Quantity">
                        <button id="detail-quantity-decrease" type="button" aria-label="Decrease quantity">−</button>
                        <span id="detail-quantity" aria-live="polite">1</span>
                        <button id="detail-quantity-increase" type="button" aria-label="Increase quantity">+</button>
                    </div>
                    <button id="detail-add-button" class="add-button" type="button">Add to Cart</button>
                </div>
                <p id="product-details-cart-status" class="product-details-cart-status" aria-live="polite"></p>
            </div>
        </div>
    `;

    modal.querySelector(".product-details-close").addEventListener("click", closeProductDetails);
    modal.querySelector("[data-close-details]").addEventListener("click", closeProductDetails);
    modal.querySelector("#detail-quantity-decrease").addEventListener("click", () => {
        detailQuantity = Math.max(1, detailQuantity - 1);
        updateDetailQuantity();
    });
    modal.querySelector("#detail-quantity-increase").addEventListener("click", () => {
        detailQuantity += 1;
        updateDetailQuantity();
    });
    modal.querySelector("#detail-add-button").addEventListener("click", () => {
        const product = PRODUCTS.find(item => item.id === detailProductId);
        if (!product) return;

        for (let i = 0; i < detailQuantity; i += 1) addToCart(product.id);
        const status = modal.querySelector("#product-details-cart-status");
        status.textContent = detailQuantity + (detailQuantity === 1 ? " item" : " items") + " added to your cart.";
        modal.querySelector("#detail-add-button").textContent = "Added ✓";
        setTimeout(() => {
            if (modal.hidden) return;
            modal.querySelector("#detail-add-button").textContent = "Add to Cart";
        }, 900);
    });

    modal.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeProductDetails();
            return;
        }

        if (event.key !== "Tab") return;
        const focusable = [...modal.querySelectorAll("button")].filter(button => !button.disabled);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    return modal;
}

function renderProductDetails(product) {
    const modal = document.getElementById("product-details-modal");
    if (!modal) return;

    const image = modal.querySelector("#product-details-image");
    image.src = product.image;
    image.alt = product.name;
    image.onerror = () => {
        image.removeAttribute("src");
        image.classList.add("image-fallback");
        image.alt = product.name + " image unavailable";
    };

    modal.querySelector("#product-details-category").textContent = getCategoryName(product.category);
    modal.querySelector("#product-details-title").textContent = product.name;
    modal.querySelector("#product-details-description").textContent = product.description;
    modal.querySelector("#product-details-price").textContent = formatPrice(product.price);

    const existing = cart.find(item => item.name === product.name)?.quantity || 0;
    modal.querySelector("#product-details-cart-status").textContent = existing
        ? existing + (existing === 1 ? " item" : " items") + " already in your cart."
        : "";
    modal.querySelector("#detail-add-button").textContent = "Add to Cart";
    updateDetailQuantity();
}

function updateDetailQuantity() {
    const quantity = document.getElementById("detail-quantity");
    if (quantity) quantity.textContent = detailQuantity;
}

function closeProductDetails() {
    const modal = document.getElementById("product-details-modal");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    detailProductId = null;
}


function initializeTheme() {
    const storedTheme = localStorage.getItem("dorinasTheme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    applyTheme(storedTheme === "dark" || (!storedTheme && prefersDark) ? "dark" : "light");
}

function toggleTheme() {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("dorinasTheme", nextTheme);
}

function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);

    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

    const icon = toggle.querySelector(".theme-icon");
    const label = toggle.querySelector(".theme-label");
    if (icon) icon.textContent = isDark ? "☀" : "☾";
    if (label) label.textContent = isDark ? "Light" : "Dark";
}
