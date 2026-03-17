export function setupNavbar() {
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = `
    <nav class="nav-container weeboo-nav">
      <div class="logo weeboo-logo">
        <span class="slanted-box"></span>
        <span class="logo-text">CARBON <span style="color: var(--manga-red);">MANGA</span></span>
      </div>
      <ul class="nav-menu weeboo-menu">
        <li><a href="#hero" class="active">EVENT</a></li>
        <li><a href="#trending">MANGA</a></li>
        <li><a href="#cta">PROMO</a></li>
        <li><a href="#community">ABOUT US</a></li>
        <li><a href="#genres">DESIGN</a></li>
      </ul>
      <div class="weeboo-actions">
        <!-- Cart Button -->
        <button class="nav-cart-btn" id="nav-cart-btn" aria-label="Open Cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-badge" id="cart-badge">0</span>
        </button>
      </div>

      <button class="hamburger-btn" id="hamburger-btn" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  `;

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger-btn');
  const menu = navbar.querySelector('.weeboo-menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    // Close menu when a link is clicked
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Secret Admin Access via Logo Click
  const logo = navbar.querySelector('.weeboo-logo');
  let clickCount = 0;
  let clickTimer;

  if (logo) {
    logo.style.cursor = 'pointer'; // Ensure it looks clickable
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      clickCount++;

      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0; // Reset if clicks are too slow
        }, 800);
      }

      if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;
        
        // Prevent showing multiple modals
        if (document.getElementById('admin-modal-overlay')) return;

        // Inject Custom Modal
        const overlay = document.createElement('div');
        overlay.id = 'admin-modal-overlay';
        overlay.className = 'admin-login-overlay';
        overlay.innerHTML = `
          <div class="admin-login-modal">
            <button id="admin-close-btn" class="admin-close-btn">X</button>
            <div class="admin-login-content">
              <h2 class="modal-title">RESTRICTED<br/>AREA</h2>
              <p class="modal-desc">Enter administrative passcode</p>
              <input type="password" id="admin-passcode-input" class="admin-input" placeholder="PASSCODE" />
              <div id="admin-error-text" class="admin-error-text">ACCESS DENIED</div>
              <button id="admin-submit-btn" class="admin-submit-btn">ENTER</button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);

        // Trigger animation
        requestAnimationFrame(() => overlay.classList.add('active'));

        const input = document.getElementById('admin-passcode-input');
        const submitBtn = document.getElementById('admin-submit-btn');
        const closeBtn = document.getElementById('admin-close-btn');
        const errorText = document.getElementById('admin-error-text');
        const modal = overlay.querySelector('.admin-login-modal');

        input.focus();

        const verifyPassword = () => {
          if (input.value === 'admin123') {
            sessionStorage.setItem('carbon_manga_admin_auth', 'true');
            window.location.href = "admin.html";
          } else {
            errorText.style.display = 'block';
            modal.classList.remove('manga-shake');
            void modal.offsetWidth; // trigger reflow
            modal.classList.add('manga-shake');
            input.value = '';
            input.focus();
          }
        };

        submitBtn.addEventListener('click', verifyPassword);
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') verifyPassword();
        });

        const closeModal = () => {
          overlay.classList.remove('active');
          setTimeout(() => overlay.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) closeModal();
        });
      }
    });
  }
}
