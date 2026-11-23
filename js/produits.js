/**
 * js/produits.js
 * Affichage dynamique des cartes produits, recherche en temps réel et filtrage par catégorie.
 * Manipulation pure du DOM standard (document.createElement, appendChild, classList, textContent).
 */

document.addEventListener("DOMContentLoaded", () => {
  const featuredGrid = document.querySelector("#featured-products-grid");
  const allProductsGrid = document.querySelector("#all-products-grid");
  const searchInput = document.querySelector("#catalog-search-input");
  const categorySelect = document.querySelector("#category-select");
  const categoryPills = document.querySelectorAll(".pill-filter-btn");

  // 1. PAGE ACCUEIL (Section "Nos coups de cœur" - 4 premiers produits)
  if (featuredGrid) {
    renderProductCards(products.slice(0, 4), featuredGrid);
    return;
  }

  // 2. PAGE PRODUITS (Catalogue complet des 8 produits)
  if (allProductsGrid) {
    let currentCategory = "Toutes";
    let currentSearchTerm = "";

    function filterAndDisplay() {
      let filtered = [...products];

      // Recherche par mot-clé (nom ou catégorie)
      if (currentSearchTerm.trim() !== "") {
        const query = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      }

      // Filtrage par catégorie
      if (currentCategory !== "Toutes") {
        filtered = filtered.filter(item => item.category === currentCategory);
      }

      renderProductCards(filtered, allProductsGrid);
    }

    // Événement recherche instantanée (input)
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearchTerm = e.target.value;
        filterAndDisplay();
      });
    }

    // Événement dropdown catégorie
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        currentCategory = e.target.value;
        // Met à jour la pilule active correspondante
        categoryPills.forEach(pill => {
          pill.classList.toggle("active", pill.getAttribute("data-category") === currentCategory);
        });
        filterAndDisplay();
      });
    }

    // Événements sur les boutons pilules de catégories
    categoryPills.forEach(pill => {
      pill.addEventListener("click", () => {
        categoryPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");

        currentCategory = pill.getAttribute("data-category");
        if (categorySelect) categorySelect.value = currentCategory;

        filterAndDisplay();
      });
    });

    // Rendu initial
    filterAndDisplay();
  }
});

/**
 * Génère les cartes produits dans le conteneur spécifié via l'API DOM.
 * @param {Array} list
 * @param {HTMLElement} container
 */
function renderProductCards(list, container) {
  container.innerHTML = "";

  if (!list || list.length === 0) {
    const empty = document.createElement("div");
    empty.style.gridColumn = "1 / -1";
    empty.style.textAlign = "center";
    empty.style.padding = "48px 20px";
    empty.style.color = "var(--color-text-muted)";
    empty.textContent = "Aucun produit ne correspond à votre recherche.";
    container.appendChild(empty);
    return;
  }

  list.forEach(item => {
    const isFav = isProductInWishlist(item.id);

    // Conteneur de carte
    const card = document.createElement("article");
    card.classList.add("product-card");

    // Bouton favori (coeur en haut à droite)
    const favWrap = document.createElement("div");
    favWrap.classList.add("card-top-actions");

    const favBtn = document.createElement("button");
    favBtn.classList.add("btn-card-fav");
    favBtn.setAttribute("aria-label", "Ajouter aux favoris");
    favBtn.textContent = isFav ? "♥" : "♡";
    if (isFav) favBtn.classList.add("active");

    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowFav = toggleWishlist(item.id);
      favBtn.textContent = nowFav ? "♥" : "♡";
      favBtn.classList.toggle("active", nowFav);
    });

    favWrap.appendChild(favBtn);

    // Image du produit
    const imgWrap = document.createElement("div");
    imgWrap.classList.add("product-img-wrap");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.loading = "lazy";
    imgWrap.appendChild(img);

    // Informations du produit
    const info = document.createElement("div");
    info.classList.add("product-info");

    const title = document.createElement("h3");
    title.classList.add("product-title");
    title.textContent = item.name;

    const price = document.createElement("div");
    price.classList.add("product-price-green");
    price.textContent = formatPrice(item.price);

    const categoryTag = document.createElement("span");
    categoryTag.classList.add("product-category-tag");
    categoryTag.textContent = item.category;

    // Bouton Ajouter au panier
    const addBtn = document.createElement("button");
    addBtn.classList.add("btn-add-cart");
    addBtn.innerHTML = "🛒 Ajouter au panier";
    addBtn.addEventListener("click", () => {
      addToCart(item.id, 1);
    });

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(categoryTag);
    info.appendChild(addBtn);

    card.appendChild(favWrap);
    card.appendChild(imgWrap);
    card.appendChild(info);

    container.appendChild(card);
  });
}
