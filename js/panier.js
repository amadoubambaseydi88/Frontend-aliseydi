/**
 * js/panier.js
 * Gestion de la page Panier fidèle à la maquette "Mon Panier".
 * Calcul dynamique des totaux, ajustement des quantités (+/-), suppression et vidage.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialisation du panier de démonstration si vide (pour correspondre à la maquette)
  const currentCart = getCart();
  if (currentCart.length === 0 && !localStorage.getItem("cart_initialized")) {
    saveCart([
      { id: 1, quantity: 2 }, // Sneakers Nike x2 = 70 000 FCFA
      { id: 2, quantity: 1 }  // T-shirt Premium x1 = 15 000 FCFA
    ]);
    localStorage.setItem("cart_initialized", "true");
  }

  renderCartTable();

  // Bouton vider le panier
  const clearBtn = document.querySelector("#btn-clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) return;

      const ok = confirm("Êtes-vous sûr de vouloir vider l'ensemble du panier ?");
      if (ok) {
        saveCart([]);
        renderCartTable();
        showToast("Le panier a été vidé.", "danger");
      }
    });
  }

  // Bouton passer la commande
  const checkoutBtn = document.querySelector("#btn-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast("Votre panier est vide.", "danger");
        return;
      }

      alert("Commande validée avec succès !\nMerci pour votre achat sur Ma Boutique.");
      saveCart([]);
      renderCartTable();
      showToast("Commande validée avec succès !");
    });
  }
});

/**
 * Affiche dynamiquement les lignes du tableau du panier.
 */
function renderCartTable() {
  const tbody = document.querySelector("#cart-tbody");
  const totalDueEl = document.querySelector("#cart-total-due");
  const emptyBox = document.querySelector("#cart-empty-message");
  const cartCard = document.querySelector("#cart-table-card");
  const footerBar = document.querySelector("#cart-footer-bar");

  if (!tbody) return;

  const cart = getCart();

  if (cart.length === 0) {
    if (cartCard) cartCard.style.display = "none";
    if (footerBar) footerBar.style.display = "none";
    if (emptyBox) emptyBox.style.display = "block";
    return;
  }

  if (cartCard) cartCard.style.display = "block";
  if (footerBar) footerBar.style.display = "flex";
  if (emptyBox) emptyBox.style.display = "none";

  tbody.innerHTML = "";
  let totalGeneral = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const lineTotal = product.price * item.quantity;
    totalGeneral += lineTotal;

    const tr = document.createElement("tr");

    // Colonne 1 : Produit
    const tdProd = document.createElement("td");
    const cellWrap = document.createElement("div");
    cellWrap.classList.add("cart-product-cell");

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.classList.add("cart-thumb");

    const name = document.createElement("span");
    name.classList.add("cart-item-name");
    name.textContent = product.name;

    cellWrap.appendChild(img);
    cellWrap.appendChild(name);
    tdProd.appendChild(cellWrap);

    // Colonne 2 : Prix unitaire
    const tdPrice = document.createElement("td");
    tdPrice.classList.add("cart-price-unit");
    tdPrice.textContent = formatPrice(product.price);

    // Colonne 3 : Quantité [-] 2 [+]
    const tdQty = document.createElement("td");
    const stepper = document.createElement("div");
    stepper.classList.add("qty-stepper");

    const minusBtn = document.createElement("button");
    minusBtn.classList.add("qty-step-btn");
    minusBtn.textContent = "-";
    minusBtn.setAttribute("aria-label", "Diminuer");
    minusBtn.addEventListener("click", () => {
      updateCartItemQty(product.id, -1);
    });

    const valSpan = document.createElement("span");
    valSpan.classList.add("qty-step-value");
    valSpan.textContent = item.quantity;

    const plusBtn = document.createElement("button");
    plusBtn.classList.add("qty-step-btn");
    plusBtn.textContent = "+";
    plusBtn.setAttribute("aria-label", "Augmenter");
    plusBtn.addEventListener("click", () => {
      updateCartItemQty(product.id, 1);
    });

    stepper.appendChild(minusBtn);
    stepper.appendChild(valSpan);
    stepper.appendChild(plusBtn);
    tdQty.appendChild(stepper);

    // Colonne 4 : Total ligne
    const tdTotal = document.createElement("td");
    tdTotal.classList.add("cart-price-total");
    tdTotal.textContent = formatPrice(lineTotal);

    // Colonne 5 : Action (Poubelle rouge)
    const tdAction = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn-trash-action");
    delBtn.innerHTML = "🗑️";
    delBtn.setAttribute("aria-label", "Supprimer le produit");
    delBtn.addEventListener("click", () => {
      removeCartItem(product.id);
    });
    tdAction.appendChild(delBtn);

    tr.appendChild(tdProd);
    tr.appendChild(tdPrice);
    tr.appendChild(tdQty);
    tr.appendChild(tdTotal);
    tr.appendChild(tdAction);

    tbody.appendChild(tr);
  });

  if (totalDueEl) {
    totalDueEl.textContent = formatPrice(totalGeneral);
  }
}

/**
 * Modifie la quantité d'un article et met à jour l'interface.
 */
function updateCartItemQty(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
    showToast("Produit retiré du panier.", "danger");
  }

  saveCart(cart);
  renderCartTable();
}

/**
 * Supprime un article du panier.
 */
function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCartTable();
  showToast("Produit supprimé du panier.", "danger");
}
