function getCart() { return JSON.parse(localStorage.getItem('cart')) || []; }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }
function getWishlist() { return JSON.parse(localStorage.getItem('wishlist')) || []; }
function saveWishlist(wishlist) { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }

function updateCounters() {
  const cart = getCart();
  const cartTotal = cart.reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = cartTotal);
}

function addToCart(id) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.quantity++; } else { cart.push({ id, quantity: 1 }); }
  saveCart(cart); updateCounters(); showToast('Produit ajouté au panier');
}

function addToWishlist(id) {
  const wish = getWishlist();
  if (wish.includes(id)) { showToast('Déjà dans la wishlist'); return; }
  wish.push(id); saveWishlist(wish);
  showToast('Ajouté aux favoris');
  if (window.location.pathname.includes('wishlist')) renderWishlist();
}

function showToast(msg) {
  const t = document.createElement('div');
  t.innerHTML = `<i class="ph ph-check-circle" style="font-size:1.2rem;"></i> ${msg}`;
  t.style.cssText = `position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
    background:#000; color:white; padding:1rem 2rem; z-index:9999; font-weight:800; 
    font-size:0.9rem; display:flex; align-items:center; gap:0.5rem; text-transform:uppercase; letter-spacing:1px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 2000);
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'card';

  const heart = document.createElement('button');
  heart.className = 'card-heart';
  heart.innerHTML = '<i class="ph ph-heart"></i>';
  heart.onclick = () => addToWishlist(product.id);

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;

  const cat = document.createElement('span');
  cat.className = 'card-category';
  cat.textContent = product.category;

  const h3 = document.createElement('h3');
  h3.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'card-price';
  price.textContent = product.price.toLocaleString('fr-FR') + ' FCFA';

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const btnCart = document.createElement('button');
  btnCart.className = 'btn';
  btnCart.style.width = '100%';
  btnCart.innerHTML = '<i class="ph ph-shopping-cart"></i> Ajouter';
  btnCart.onclick = () => addToCart(product.id);

  actions.appendChild(btnCart);
  card.appendChild(heart);
  card.appendChild(img);
  card.appendChild(cat);
  card.appendChild(h3);
  card.appendChild(price);
  card.appendChild(actions);
  return card;
}

document.addEventListener('DOMContentLoaded', updateCounters);