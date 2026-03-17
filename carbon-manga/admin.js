import { setupNavbar } from './components/Navbar.js';

// Check if user is already authenticated via the homepage logo trigger
const isAuthorized = sessionStorage.getItem('carbon_manga_admin_auth') === 'true';

if (!isAuthorized) {
  window.location.href = "index.html";
}

const COVER_BASE_PATH = '/images/';
const DEFAULT_INVENTORY = [
  { id: 1, title: 'Chainsaw Man (VOL. 1)', price: 749, stock: 'In Stock', cover: COVER_BASE_PATH + 'chainsawman.png', genre: 'Action' },
  { id: 2, title: 'Jujutsu Kaisen (VOL. 3)', price: 799, stock: '5 left', cover: COVER_BASE_PATH + 'jujutsu_kaisen.png', genre: 'Dark Fantasy' },
  { id: 3, title: 'Demon Slayer (VOL. 2)', price: 699, stock: 'Sold Out', cover: COVER_BASE_PATH + 'demon_slayer.png', genre: 'Action' },
  { id: 4, title: 'Attack on Titan (VOL. 5)', price: 849, stock: '3 left', cover: COVER_BASE_PATH + 'attack_on_titan.png', genre: 'Action' },
  { id: 5, title: 'My Hero Academia (VOL. 7)', price: 649, stock: 'In Stock', cover: COVER_BASE_PATH + 'my_hero_academia.png', genre: 'Action' },
  { id: 6, title: 'Tokyo Revengers (VOL. 4)', price: 749, stock: 'Sold Out', cover: COVER_BASE_PATH + 'tokyo_ravegers.png', genre: 'Action' },
  { id: 7, title: 'One Piece (VOL. 10)', price: 599, stock: 'In Stock', cover: COVER_BASE_PATH + 'one_piece.png', genre: 'Action' },
  { id: 8, title: 'Naruto (VOL. 6)', price: 549, stock: 'In Stock', cover: COVER_BASE_PATH + 'naruto.png', genre: 'Action' },
];

const DEFAULT_DEALS = [
  { id: 1, title: 'Combo Deal', desc: 'Buy any 3 manga and get 10% OFF' },
  { id: 2, title: 'Free Delivery', desc: 'On all orders above ₹1500' },
  { id: 3, title: 'Flash Sale', desc: '15% OFF every Weekend!' },
];

const STOCK_OPTIONS = ['In Stock', '5 left', '3 left', 'Sold Out'];

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  
  // Setup Footer
  const footer = document.getElementById('footer');
  if (footer) {
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
  }

  // ========== INVENTORY MANAGEMENT ==========
  let stored = localStorage.getItem('carbon_manga_inventory');
  let inventory = stored ? JSON.parse(stored) : DEFAULT_INVENTORY;
  if (!stored) {
    localStorage.setItem('carbon_manga_inventory', JSON.stringify(inventory));
  }

  const inventoryList = document.getElementById('inventory-list');
  const addForm = document.getElementById('add-book-form');
  const uploadZone = document.getElementById('cover-upload-zone');
  const fileInput = document.getElementById('book-cover-file');
  const coverPreview = document.getElementById('cover-preview');

  let pendingCoverDataUrl = null;
  let editingBookId = null; // track which book is being edited

  // --- Cover Upload Handling ---
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });
  }

  function handleFile(file) {
    if (!file.type.startsWith('image/')) { alert('Please upload an image file.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      pendingCoverDataUrl = e.target.result;
      coverPreview.src = pendingCoverDataUrl;
      coverPreview.style.display = 'block';
      uploadZone.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  }

  function renderInventory() {
    if (!inventoryList) return;
    inventoryList.innerHTML = '';
    inventory.forEach(item => {
      const tr = document.createElement('tr');
      tr.dataset.id = item.id;
      const coverThumb = item.cover && (item.cover.startsWith('data:') || item.cover.startsWith('/') || item.cover.startsWith('http'))
        ? `<img src="${item.cover}" style="width:40px;height:55px;object-fit:cover;border:2px solid var(--manga-red);" />`
        : `<div style="width:40px;height:55px;background:${item.cover};border:2px solid var(--manga-red);"></div>`;
      
      const stockColor = item.stock === 'Sold Out' ? '#ef4444' : 'var(--text-white)';

      tr.innerHTML = `
        <td style="font-weight: bold" class="cell-title">${item.title}</td>
        <td class="cell-price">₹${item.price}</td>
        <td class="cell-stock"><span style="color: ${stockColor}">${item.stock}</span></td>
        <td class="cell-genre">${item.genre}</td>
        <td>${coverThumb}</td>
        <td class="action-btns">
          <button class="btn-edit edit-btn" data-id="${item.id}">Edit</button>
          <button class="btn-danger delete-btn" data-id="${item.id}">Delete</button>
        </td>
      `;
      inventoryList.appendChild(tr);
    });

    // Delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        inventory = inventory.filter(item => item.id !== id);
        saveAndRenderInventory();
      });
    });

    // Edit handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        enterEditMode(id);
      });
    });
  }

  function enterEditMode(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    editingBookId = id;

    const row = inventoryList.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    const currentCoverThumb = item.cover && (item.cover.startsWith('data:') || item.cover.startsWith('/') || item.cover.startsWith('http'))
      ? `<img src="${item.cover}" style="width:40px;height:55px;object-fit:cover;border:2px solid var(--manga-red); cursor:pointer;" title="Click to change cover" />`
      : `<div style="width:40px;height:55px;background:${item.cover};border:2px solid var(--manga-red); cursor:pointer;" title="Click to change cover"></div>`;

    row.querySelector('.cell-title').innerHTML = `<input class="inline-input" type="text" value="${item.title}" data-field="title" />`;
    row.querySelector('.cell-price').innerHTML = `<input class="inline-input" type="number" value="${item.price}" data-field="price" style="width:80px" />`;
    
    const stockSelect = `<select class="inline-select" data-field="stock">
      ${STOCK_OPTIONS.map(opt => `<option value="${opt}" ${item.stock === opt ? 'selected' : ''}>${opt}</option>`).join('')}
    </select>`;
    row.querySelector('.cell-stock').innerHTML = stockSelect;
    row.querySelector('.cell-genre').innerHTML = `<input class="inline-input" type="text" value="${item.genre}" data-field="genre" />`;

    const coverCell = row.children[4]; // The 5th cell is the cover 
    coverCell.innerHTML = `
      <div class="edit-cover-wrapper" style="position: relative; display: inline-block;">
        ${currentCoverThumb}
        <input type="file" class="edit-cover-input" accept="image/*" style="display: none;" />
        <div class="edit-cover-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; pointer-events: none; border: 2px solid var(--manga-red);"><span style="font-size: 1.2rem;">📷</span></div>
      </div>
    `;

    // Handle new cover selection
    const wrapper = coverCell.querySelector('.edit-cover-wrapper');
    const fileInput = coverCell.querySelector('.edit-cover-input');
    const overlay = coverCell.querySelector('.edit-cover-overlay');
    let editPendingCoverDataUrl = item.cover; // Default to existing cover

    wrapper.addEventListener('mouseenter', () => overlay.style.opacity = '1');
    wrapper.addEventListener('mouseleave', () => overlay.style.opacity = '0');
    wrapper.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) { alert('Please upload an image file.'); return; }
        const reader = new FileReader();
        reader.onload = (ev) => {
          editPendingCoverDataUrl = ev.target.result;
          const imgOrDiv = wrapper.querySelector('img, div:not(.edit-cover-overlay)');
          if (imgOrDiv.tagName === 'IMG') {
            imgOrDiv.src = editPendingCoverDataUrl;
          } else {
            wrapper.innerHTML = `<img src="${editPendingCoverDataUrl}" style="width:40px;height:55px;object-fit:cover;border:2px solid var(--manga-red); cursor:pointer;" title="Click to change cover" />` + wrapper.innerHTML;
            wrapper.querySelector('div:not(.edit-cover-overlay)').remove();
          }
          // Store the pending cover on the row so saveEdit can pick it up
          row.dataset.pendingCover = editPendingCoverDataUrl;
        };
        reader.readAsDataURL(file);
      }
    });

    row.querySelector('.action-btns').innerHTML = `
      <button class="btn-save save-btn" data-id="${id}">Save</button>
      <button class="btn-danger cancel-btn" data-id="${id}">Cancel</button>
    `;

    row.querySelector('.save-btn').addEventListener('click', () => saveEdit(id, row));
    row.querySelector('.cancel-btn').addEventListener('click', () => {
      editingBookId = null;
      renderInventory();
    });
  }

  function saveEdit(id, row) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const titleInput = row.querySelector('[data-field="title"]');
    const priceInput = row.querySelector('[data-field="price"]');
    const stockInput = row.querySelector('[data-field="stock"]');
    const genreInput = row.querySelector('[data-field="genre"]');

    item.title = titleInput.value;
    item.price = parseInt(priceInput.value);
    item.stock = stockInput.value;
    item.genre = genreInput.value;
    
    // If a new cover was selected, use it
    if (row.dataset.pendingCover) {
      item.cover = row.dataset.pendingCover;
      delete row.dataset.pendingCover;
    }

    editingBookId = null;
    saveAndRenderInventory();
  }

  function saveAndRenderInventory() {
    localStorage.setItem('carbon_manga_inventory', JSON.stringify(inventory));
    renderInventory();
  }

  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!pendingCoverDataUrl) { alert('Please upload a cover image.'); return; }
      
      const newBook = {
        id: Date.now(),
        title: document.getElementById('book-title').value,
        price: parseInt(document.getElementById('book-price').value),
        stock: document.getElementById('book-stock').value,
        cover: pendingCoverDataUrl,
        genre: document.getElementById('book-genre').value
      };

      inventory.unshift(newBook);
      saveAndRenderInventory();
      addForm.reset();
      pendingCoverDataUrl = null;
      coverPreview.style.display = 'none';
      coverPreview.src = '';
      uploadZone.classList.remove('has-image');
    });
  }

  renderInventory();

  // ========== DEALS MANAGEMENT ==========
  let storedDeals = localStorage.getItem('carbon_manga_deals');
  let deals = storedDeals ? JSON.parse(storedDeals) : DEFAULT_DEALS;
  if (!storedDeals) {
    localStorage.setItem('carbon_manga_deals', JSON.stringify(deals));
  }

  const dealsList = document.getElementById('deals-list');
  const addDealForm = document.getElementById('add-deal-form');
  let editingDealId = null;

  function renderDeals() {
    if (!dealsList) return;
    dealsList.innerHTML = '';
    deals.forEach(deal => {
      const tr = document.createElement('tr');
      tr.dataset.id = deal.id;
      tr.innerHTML = `
        <td class="cell-deal-title" style="font-weight: bold">${deal.title}</td>
        <td class="cell-deal-desc">${deal.desc}</td>
        <td class="action-btns">
          <button class="btn-edit edit-deal-btn" data-id="${deal.id}">Edit</button>
          <button class="btn-danger delete-deal-btn" data-id="${deal.id}">Delete</button>
        </td>
      `;
      dealsList.appendChild(tr);
    });

    document.querySelectorAll('.delete-deal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        deals = deals.filter(d => d.id !== id);
        saveAndRenderDeals();
      });
    });

    document.querySelectorAll('.edit-deal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        enterDealEditMode(id);
      });
    });
  }

  function enterDealEditMode(id) {
    const deal = deals.find(d => d.id === id);
    if (!deal) return;
    editingDealId = id;

    const row = dealsList.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    row.querySelector('.cell-deal-title').innerHTML = `<input class="inline-input" type="text" value="${deal.title}" data-field="title" />`;
    row.querySelector('.cell-deal-desc').innerHTML = `<input class="inline-input" type="text" value="${deal.desc}" data-field="desc" />`;
    row.querySelector('.action-btns').innerHTML = `
      <button class="btn-save save-deal-btn" data-id="${id}">Save</button>
      <button class="btn-danger cancel-deal-btn" data-id="${id}">Cancel</button>
    `;

    row.querySelector('.save-deal-btn').addEventListener('click', () => saveDealEdit(id, row));
    row.querySelector('.cancel-deal-btn').addEventListener('click', () => {
      editingDealId = null;
      renderDeals();
    });
  }

  function saveDealEdit(id, row) {
    const deal = deals.find(d => d.id === id);
    if (!deal) return;

    deal.title = row.querySelector('[data-field="title"]').value;
    deal.desc = row.querySelector('[data-field="desc"]').value;

    editingDealId = null;
    saveAndRenderDeals();
  }

  function saveAndRenderDeals() {
    localStorage.setItem('carbon_manga_deals', JSON.stringify(deals));
    renderDeals();
  }

  if (addDealForm) {
    addDealForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newDeal = {
        id: Date.now(),
        title: document.getElementById('deal-title').value,
        desc: document.getElementById('deal-desc').value,
      };
      deals.push(newDeal);
      saveAndRenderDeals();
      addDealForm.reset();
    });
  }

  renderDeals();
});
