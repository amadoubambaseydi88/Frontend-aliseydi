// --- ICÔNES SVG PROFESSIONNELLES (Remplace les émojis) ---
const icons = {
  cart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  heartFill: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
};

// --- LOCALSTORAGE ---
function getCart() { return JSON.parse(localStorage.getItem('cart')) || []; }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }
function getWishlist() { return JSON.parse(localStorage.getItem('wishlist')) || []; }
function saveWishlist(wishlist) { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }

// --- MISE À JOUR DES COMPTEURS ---
function updateCounters() {
  const cart = getCart();
  const cartTotal = cart.reduce((s, i) => s + i.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = cartTotal;
}

// --- NOTIFICATIONS ---
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `${icons.check} <span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

// --- ACTIONS PANIER & WISHLIST ---
function addToCart(id) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.quantity++; } else { cart.push({ id, quantity: 1 }); }
  saveCart(cart); updateCounters(); showToast('Produit ajouté au panier');
}

function addToWishlist(id) {
  const wish = getWishlist();
  if (wish.includes(id)) {
    saveWishlist(wish.filter(i => i !== id)); // Toggle (retire si déjà présent)
    showToast('Retiré des favoris');
  } else {
    wish.push(id); saveWishlist(wish);
    showToast('Ajouté aux favoris');
  }
  updateWishlistIcons();
  if (window.location.pathname.includes('wishlist')) renderWishlist();
}

function updateWishlistIcons() {
  const wish = getWishlist();
  document.querySelectorAll('.card-heart').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (wish.includes(id)) {
      btn.innerHTML = icons.heartFill;
      btn.classList.add('active');
    } else {
      btn.innerHTML = icons.heart;
      btn.classList.remove('active');
    }
  });
}

// --- CRÉATION D'UNE CARTE PRODUIT ---
function createProductCard(product) {
  const wish = getWishlist();
  const isWished = wish.includes(product.id);

  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <button class="card-heart ${isWished ? 'active' : ''}" data-id="${product.id}">
      ${isWished ? icons.heartFill : icons.heart}
    </button>
    <img src="${product.image}" alt="${product.name}" loading="lazy">
    <span class="card-category">${product.category}</span>
    <h3>${product.name}</h3>
    <p class="card-price">${product.price.toLocaleString('fr-FR')} FCFA</p>
    <div class="card-actions">
      <button class="btn btn-solid add-cart-btn" data-id="${product.id}">Ajouter au panier</button>
      <a href="produit-detail.html?id=${product.id}" class="btn btn-outline">Voir le détail</a>
    </div>
  `;

  card.querySelector('.card-heart').addEventListener('click', (e) => {
    e.preventDefault(); addToWishlist(product.id);
  });
  
  card.querySelector('.add-cart-btn').addEventListener('click', () => addToCart(product.id));

  return card;
}

// --- DARK MODE ---
function initDarkMode() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) document.body.classList.add('dark-mode');
  
  const btn = document.getElementById('dark-mode-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
  }
}

// --- INITIALISATION GLOBALE ---
// --- GESTION AUTOMATIQUE DU LIEN ACTIF (Le bouton doré) ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. On récupère le nom de la page actuelle (ex: "boutique.html")
  let currentPage = window.location.pathname.split('/').pop();
  
  // 2. Si on est sur l'accueil (l'URL ne finit pas par .html), on met "index.html"
  if (currentPage === '' || currentPage === '/') {
    currentPage = 'index.html';
  }

  // 3. On sélectionne tous les liens du menu
  const navLinks = document.querySelectorAll('.header-nav .nav-link');

  // 4. On nettoie et on allume le bon bouton
  navLinks.forEach(link => {
    // On enlève la classe "active" de TOUS les liens pour être sûr
    link.classList.remove('active');
    
    // On récupère le lien (ex: "boutique.html")
    const linkUrl = link.getAttribute('href');
    
    // Si le lien correspond à la page, on l'allume !
    if (linkUrl === currentPage) {
      link.classList.add('active');
    }
  });
});

// --- GESTION DU DARK MODE ---
document.addEventListener('DOMContentLoaded', () => {
  const darkModeBtn = document.getElementById('dark-mode-btn');
  
  // 1. Vérifier si le mode sombre était activé (mémorisé)
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // 2. Écouter le clic sur la lune
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
      // On ajoute ou on enlève la classe "dark-mode" sur le <body>
      document.body.classList.toggle('dark-mode');
      
      // On sauvegarde le choix dans le navigateur
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }
});