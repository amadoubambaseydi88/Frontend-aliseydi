const icons = {
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  heartFill: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
};

function getCart() { return JSON.parse(localStorage.getItem('cart')) || []; }
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }
function getWishlist() { return JSON.parse(localStorage.getItem('wishlist')) || []; }
function saveWishlist(w) { localStorage.setItem('wishlist', JSON.stringify(w)); }

function updateCounters() {
  const total = getCart().reduce((s, i) => s + (i.quantity || 0), 0);
  document.querySelectorAll('#cart-count, .cart-badge').forEach(el => el.textContent = total);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.innerHTML = `${icons.check} <span>${msg}</span>`;
  t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#c9a227;color:#fff;padding:1rem 2rem;border-radius:6px;z-index:9999;display:flex;gap:.5rem;align-items:center;';
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

function addToCart(product) {
  if (!product || !product._id) return;
  const cart = getCart();
  const existing = cart.find(i => i._id === product._id);
  if (existing) existing.quantity++;
  else cart.push({ _id: product._id, name: product.name, price: product.price, image: product.image, category: product.category, quantity: 1 });
  saveCart(cart); updateCounters(); showToast('Produit ajouté au panier');
}

function addToWishlist(product) {
  if (!product || !product._id) return;
  const wish = getWishlist();
  const idx = wish.findIndex(i => i._id === product._id);
  if (idx > -1) { wish.splice(idx, 1); showToast('Retiré des favoris'); }
  else { wish.push({ _id: product._id, name: product.name, price: product.price, image: product.image, category: product.category }); showToast('Ajouté aux favoris'); }
  saveWishlist(wish); updateWishlistIcons();
}

function updateWishlistIcons() {
  const wish = getWishlist();
  document.querySelectorAll('.card-heart').forEach(btn => {
    const active = wish.some(i => i._id === btn.dataset.id);
    btn.innerHTML = active ? icons.heartFill : icons.heart;
    btn.classList.toggle('active', active);
  });
}

function createProductCard(product) {
  const isWished = getWishlist().some(i => i._id === product._id);
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <button class="card-heart ${isWished ? 'active' : ''}" data-id="${product._id}">${isWished ? icons.heartFill : icons.heart}</button>
    <img src="${product.image}" alt="${product.name}" loading="lazy">
    <span class="card-category">${product.category || ''}</span>
    <h3>${product.name}</h3>
    <p class="card-price">${Number(product.price).toLocaleString('fr-FR')} FCFA</p>
    <div class="card-actions">
      <button class="btn btn-solid add-cart-btn">Ajouter au panier</button>
      <a href="produit-detail.html?id=${product._id}" class="btn btn-outline">Voir le détail</a>
    </div>`;
  card.querySelector('.card-heart').addEventListener('click', e => { e.preventDefault(); addToWishlist(product); });
  card.querySelector('.add-cart-btn').addEventListener('click', () => addToCart(product));
  return card;
}

function initDarkMode() {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
  const btn = document.getElementById('dark-mode-btn');
  if (btn) btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
}

function initActiveNav() {
  let current = window.location.pathname.split('/').pop() || 'index.html';
  if (current === '' || current === '/') current = 'index.html';
  document.querySelectorAll('.header-nav .nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCounters(); initDarkMode(); initActiveNav(); updateWishlistIcons();
});

// --- GESTION DU MENU MOBILE (BURGER) ---
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const headerNav = document.querySelector('.header-nav');

  if (mobileMenuBtn && headerNav) {
    // Ouvrir / Fermer au clic sur le burger
    mobileMenuBtn.addEventListener('click', () => {
      headerNav.classList.toggle('active');
      
      // Changer l'icône (Croix si ouvert, Burger si fermé)
      if (headerNav.classList.contains('active')) {
        mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      } else {
        mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      }
    });

    // Fermer le menu quand on clique sur un lien (pour changer de page)
    headerNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });
  }
});