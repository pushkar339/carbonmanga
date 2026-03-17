export function renderMangaList(containerId, mangaData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = mangaData.map(manga => {
    const isSoldOut = manga.stock.toLowerCase() === 'sold out';
    return `
    <div class="manga-card-horizontal ${isSoldOut ? 'sold-out' : ''}" data-id="${manga.id}">
      <div class="manga-cover" style="background: url('${manga.cover}') center/cover no-repeat">
        <div class="manga-tag">${manga.stock}</div>
        ${isSoldOut ? '<div class="sold-out-banner">SOLD OUT</div>' : `
        <div class="card-hover-overlay">
          <button class="btn-buy" onclick="window.addToCart(${manga.id})">Add To Cart</button>
        </div>`}
      </div>
      <div class="manga-info">
        <h3 class="manga-title">${manga.title}</h3>
        <div class="manga-price-container">
          <span class="manga-price-original">₹${manga.price + 200}</span>
          <span class="manga-price">₹${manga.price}</span>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

export function renderGrid(containerId, mangaData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = mangaData.map(manga => {
    const isSoldOut = manga.stock.toLowerCase() === 'sold out';
    return `
    <div class="manga-card-vertical ${isSoldOut ? 'sold-out' : ''}" data-id="${manga.id}">
      <div class="manga-cover-v" style="background: url('${manga.cover}') center/cover no-repeat">
        <div class="manga-tag-v">${manga.stock}</div>
        ${isSoldOut ? '<div class="sold-out-banner">SOLD OUT</div>' : `
        <div class="buy-overlay-v">
          <button class="btn-buy-v" onclick="window.addToCart(${manga.id})">Add To Cart</button>
        </div>`}
        <div class="card-glow"></div>
      </div>
      <div class="manga-info-v">
        <h3 class="manga-title">${manga.title}</h3>
        <div class="manga-price-container">
          <span class="manga-price-original">₹${manga.price + 200}</span>
          <span class="manga-price-v">₹${manga.price}</span>
        </div>
      </div>
    </div>
  `;
  }).join('');
}