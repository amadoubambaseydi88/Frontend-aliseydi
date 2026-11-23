/**
 * js/wishlist.js
 * Gestion de la page "Ma Wishlist" fidèle à la maquette.
 * Affichage des produits favoris en cartes horizontales, ajout au panier,
 * retrait des favoris et affichage soigné de l'état vide.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Pré-remplissage de démonstration si non initialisé (pour correspondre à la maquette)
  const currentWish = getWishlist();
  if (currentWish.length === 0 && !localStorage.getItem("wishlist_initialized")) {
    saveWishlist([1]); // Sneakers Nike par défaut
    localStorage.setItem("wishlist_initialized", "true");
  }

  renderWishlistItems();
});

/**
 * Affiche la liste des favoris ou l'état vide.
 */
function renderWishlistItems() {
  const container = document.querySelector("#wishlist-container");
  const emptyBox = document.querySelector("#wishlist-empty-box");

  if (!container) return;

  const wishlist = getWishlist();
  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  if (favoriteProducts.length === 0) {
    container.style.display = "none";
    if (emptyBox) emptyBox.style.display = "block";
    return;
  }

  container.style.display = "flex";
  if (emptyBox) emptyBox.style.display = "none";

  container.innerHTML = "";

  favoriteProducts.forEach(item => {
    const row = document.createElement("article");
    row.classList.add("wishlist-row-card");

    // Partie gauche (Image + Informations)
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("wishlist-left-info");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.classList.add("wishlist-thumb");

    const meta = document.createElement("div");
    meta.classList.add("wishlist-meta");

    const title = document.createElement("h3");
    title.textContent = item.name;

    const price = document.createElement("div");
    price.classList.add("price");
    price.textContent = formatPrice(item.price);

    const cat = document.createElement("div");
    cat.classList.add("category");
    cat.textContent = item.category;

    meta.appendChild(title);
    meta.appendChild(price);
    meta.appendChild(cat);

    leftDiv.appendChild(img);
    leftDiv.appendChild(meta);

    // Partie droite (Boutons d'action)
    const rightDiv = document.createElement("div");
    rightDiv.classList.add("wishlist-right-actions");

    const addCartBtn = document.createElement("button");
    addCartBtn.classList.add("btn", "btn-primary");
    addCartBtn.innerHTML = "🛒 Ajouter au panier";
    addCartBtn.addEventListener("click", () => {
      addToCart(item.id, 1);
    });

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("btn-remove-fav-outline");
    removeBtn.innerHTML = "🗑️ Retirer";
    removeBtn.addEventListener("click", () => {
      toggleWishlist(item.id);
      renderWishlistItems();
    });

    const heartIcon = document.createElement("span");
    heartIcon.style.fontSize = "1.2rem";
    heartIcon.style.color = "var(--color-danger)";
    heartIcon.style.cursor = "pointer";
    heartIcon.textContent = "♥";
    heartIcon.title = "Retirer des favoris";
    heartIcon.addEventListener("click", () => {
      toggleWishlist(item.id);
      renderWishlistItems();
    });

    rightDiv.appendChild(addCartBtn);
    rightDiv.appendChild(removeBtn);
    rightDiv.appendChild(heartIcon);

    row.appendChild(leftDiv);
    row.appendChild(rightDiv);

    container.appendChild(row);
  });
}
