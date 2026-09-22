let activeCategory = "all";
let searchTerm = "";
const featuredProductIds = [
    "golden-penny-rice-10kg",
    "coca-cola-50cl",
    "dettol-soap-150g",
    "peak-milk-400g"
];

document.addEventListener("DOMContentLoaded", () => {
    renderCategories();
    renderProducts();
    updateCart();
    setupInteractions();
});

function setupInteractions() {
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
    search?.addEventListener("input", event => {
        searchTerm = event.target.value.trim().toLowerCase();
        document.getElementById("clear-search").hidden = !searchTerm;
        renderCategories();
        renderProducts();
    });

    document.getElementById("clear-search")?.addEventListener("click", () => {
        search.value = "";
        searchTerm = "";
        document.getElementById("clear-search").hidden = true;
        renderProducts();
        search.focus();
    });

    document.getElementById("view-all")?.addEventListener("click", () => {
        activeCategory = "all";
        searchTerm = "";
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
    const viewAll = document.getElementById("view-all");
    if (!container || !emptyState) return;

    let products = getFilteredProducts();
    const isDefaultView = activeCategory === "all" && !searchTerm;

    if (isDefaultView) {
        products = PRODUCTS.filter(product => featuredProductIds.includes(product.id));
        label.textContent = "A few customer favourites to get you started.";
        viewAll.hidden = false;
    } else {
        const categoryName = activeCategory === "all" ? "All products" : getCategoryName(activeCategory);
        const searchNote = searchTerm ? ' matching "' + searchTerm + '"' : "";
        label.textContent = products.length + " product" + (products.length === 1 ? "" : "s") + " in " + categoryName + searchNote + ".";
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

    const media = document.createElement("div");
    media.className = "product-media";
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.addEventListener("error", () => {
        image.removeAttribute("src");
        image.classList.add("image-fallback");
        image.alt = product.name + " image unavailable";
    });
    media.appendChild(image);

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
    button.textContent = "Add to Cart";
    button.addEventListener("click", () => {
        addToCart(product.id);
        button.textContent = "Added ✓";
        setTimeout(() => { button.textContent = "Add to Cart"; }, 900);
    });

    footer.append(price, button);
    content.append(category, name, description, footer);
    card.append(media, content);
    return card;
}

function getCategoryName(id) {
    return CATEGORIES.find(category => category.id === id)?.name || "Other";
}
