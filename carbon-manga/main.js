import { setupNavbar } from './components/Navbar.js';
import { setupHero } from './components/Hero.js';
import { renderMangaList, renderGrid } from './components/MangaCard.js';
import { CartSystem } from './components/Cart.js';

// default book data
const DEFAULT_INVENTORY = [
  { id: 1, title: 'Chainsaw Man (VOL. 1)', price: 749, stock: 'In Stock', cover: './images/comics/chainsawman.png', genre: 'Action' },
  { id: 2, title: 'Jujutsu Kaisen (VOL. 3)', price: 799, stock: '5 left', cover: './images/comics/jujutsu_kaisen.png', genre: 'Dark Fantasy' },
  { id: 3, title: 'Demon Slayer (VOL. 2)', price: 699, stock: 'Sold Out', cover: './images/comics/demon_slayer.png', genre: 'Action' },
  { id: 4, title: 'Attack on Titan (VOL. 5)', price: 849, stock: '3 left', cover: './images/comics/attack_on_titan.png', genre: 'Action' },
  { id: 5, title: 'My Hero Academia (VOL. 7)', price: 649, stock: 'In Stock', cover: './images/comics/my_hero_academia.png', genre: 'Action' },
  { id: 6, title: 'Tokyo Revengers (VOL. 4)', price: 749, stock: 'Sold Out', cover: './images/comics/tokyo_ravegers.png', genre: 'Action' },
  { id: 7, title: 'One Piece (VOL. 10)', price: 599, stock: 'In Stock', cover: './images/comics/one_piece.png', genre: 'Action' },
  { id: 8, title: 'Naruto (VOL. 6)', price: 549, stock: 'In Stock', cover: './images/comics/naruto.png', genre: 'Action' },
];

const DEFAULT_DEALS = [
  { id: 1, title: 'Combo Deal', desc: 'Buy any 3 manga and get 10% OFF' },
  { id: 2, title: 'Free Delivery', desc: 'On all orders above ₹1500' },
  { id: 3, title: 'Flash Sale', desc: '15% OFF every Weekend!' },
];

const DEAL_ICONS = [
  '<svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/></svg>',
  '<svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 4v5h-3"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  '<svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
];

let stored = localStorage.getItem('carbon_manga_inventory');

// One-time migration: detect stale gradient-based cover data and reset to image paths
if (stored && !localStorage.getItem('carbon_manga_data_v3')) {
  const parsed = JSON.parse(stored);
  const hasGradients = parsed.some(item => item.cover && item.cover.startsWith('linear-gradient'));
  if (hasGradients) {
    const userBooks = parsed.filter(item => item.cover && !item.cover.startsWith('linear-gradient') && ![1,2,3,4,5,6,7,8].includes(item.id));
    const merged = [...userBooks, ...DEFAULT_INVENTORY];
    localStorage.setItem('carbon_manga_inventory', JSON.stringify(merged));
    stored = localStorage.getItem('carbon_manga_inventory');
  }
  localStorage.setItem('carbon_manga_data_v3', 'true');
}

// Also clean up old key
localStorage.removeItem('carbon_manga_inventory_v2');

let STORE_INVENTORY = stored ? JSON.parse(stored) : DEFAULT_INVENTORY;
if (!stored) {
  localStorage.setItem('carbon_manga_inventory', JSON.stringify(STORE_INVENTORY));
}

// Load deals from localStorage or use defaults
let storedDeals = localStorage.getItem('carbon_manga_deals');
let DEALS = storedDeals ? JSON.parse(storedDeals) : DEFAULT_DEALS;
if (!storedDeals) {
  localStorage.setItem('carbon_manga_deals', JSON.stringify(DEALS));
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Layout
  setupNavbar();
  setupHero();

  // Render Sections
  renderMangaList('trending-list', STORE_INVENTORY.slice(0, 4), false);
  renderGrid('popular-grid', STORE_INVENTORY);

  // Initialize Cart System
  window.carbonMangaCart = new CartSystem(STORE_INVENTORY);

  // Add reveal classes to sections
  document.querySelectorAll('#trending, #genres, #popular, #community, #cta').forEach(el => {
    el.classList.add('reveal');
  });
  
  // Render Offers from localStorage
  const cta = document.getElementById('cta');
  cta.innerHTML = `
    <div class="offers-section">
      <h2 class="section-title">Current Deals</h2>
      <div class="offers-grid stagger-children">
        ${DEALS.map((offer, i) => `
          <div class="offer-card reveal">
            <div class="offer-icon">${DEAL_ICONS[i % DEAL_ICONS.length]}</div>
            <h3>${offer.title}</h3>
            <p>${offer.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Render Genres with filtering
  const genreGrid = document.getElementById('genre-grid');
  const genres = ['All', 'Action', 'Romance', 'Dark Fantasy', 'Fantasy', 'Adventure', 'Comedy', 'Mystery', 'Sci-Fi', 'Slice of Life'];
  genreGrid.innerHTML = genres.map(g => `<div class="genre-tile ${g === 'All' ? 'active' : ''}" data-genre="${g}">${g}</div>`).join('');

  // Genre click handler
  genreGrid.addEventListener('click', (e) => {
    const tile = e.target.closest('.genre-tile');
    if (!tile) return;
    const genre = tile.dataset.genre;

    // Update active state
    genreGrid.querySelectorAll('.genre-tile').forEach(t => t.classList.remove('active'));
    tile.classList.add('active');

    // Filter
    const filtered = genre === 'All' ? STORE_INVENTORY : STORE_INVENTORY.filter(m => m.genre === genre);
    renderGrid('popular-grid', filtered);

    // Update section title
    const sectionTitle = document.querySelector('#popular .section-title');
    if (sectionTitle) {
      sectionTitle.textContent = genre === 'All' ? 'All Manga' : `${genre} Manga`;
    }

    // Re-observe for reveal animation
    document.querySelectorAll('#popular-grid .reveal, #popular-grid .reveal-scale').forEach(el => {
      revealObserver.observe(el);
    });
  });

  // Render Testimonials
  const testimonialGrid = document.getElementById('testimonial-grid');
  const reviews = [
    { user: 'MangaFan99', avatar: 'MF', text: 'Carbon Manga is the best site I\u2019ve ever used. The UI is so clean!', rating: 5 },
    { user: 'OtakuSpirit', avatar: 'OS', text: 'Love the horizontal scrolling. Feels just like a premium app.', rating: 5 },
    { user: 'Satoshi_K', avatar: 'SK', text: 'The discovery features helped me find my new favorite series!', rating: 4 },
  ];
  testimonialGrid.innerHTML = reviews.map(r => `
    <div class="testimonial-card reveal">
      <div class="user-info">
        <div class="avatar">${r.avatar}</div>
        <div class="username">${r.user}</div>
      </div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
    </div>
  `).join('');

  // Setup Footer
  const footer = document.getElementById('footer');
  footer.innerHTML = `
    <div class="container footer-content">
      <div class="footer-logo">Carbon<span>Manga</span></div>
      <ul class="footer-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="#">Manga</a></li>
        <li><a href="#">Genres</a></li>
        <li><a href="#">About</a></li>
      </ul>
      <p>&copy; 2026 Carbon Manga. Premium Experience.</p>
    </div>
  `;

  // Initialize Scroll Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });
});
