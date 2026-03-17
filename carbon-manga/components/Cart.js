// Manage the state of the shopping cart

export class CartSystem {
  constructor(inventory) {
    this.inventory = inventory;
    this.cartItems = [];
    
    // Load from localStorage if present
    const storedCart = localStorage.getItem('carbon_manga_cart');
    if (storedCart) {
      try {
        this.cartItems = JSON.parse(storedCart);
      } catch (e) {
        console.error("Failed to load cart", e);
        this.cartItems = [];
      }
    }

    this.initUI();
    this.renderCart();
  }

  initUI() {
    this.modalOverlay = document.getElementById('cart-modal-overlay');
    this.itemsContainer = document.getElementById('cart-items');
    this.totalPriceEl = document.getElementById('cart-total-price');
    this.badgeEl = document.getElementById('cart-badge');
    this.nameInput = document.getElementById('cart-user-name');
    
    // Custom Confirmation UI
    this.confirmOverlay = document.getElementById('checkout-confirm-overlay');
    this.confirmDetailsText = document.getElementById('confirm-details-text');
    this.confirmSubmitBtn = document.getElementById('confirm-submit-btn');
    this.confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    this.confirmCloseBtn = document.getElementById('confirm-close-btn');
    
    document.getElementById('cart-close-btn').addEventListener('click', () => this.toggleCart(false));
    document.getElementById('nav-cart-btn').addEventListener('click', () => this.toggleCart(true));
    document.getElementById('cart-checkout-btn').addEventListener('click', () => this.initiateCheckout());

    // Allow clicking outside the cart modal to close it
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) {
        this.toggleCart(false);
      }
    });

    // Confirmation Modal Events
    this.confirmCancelBtn.addEventListener('click', () => this.closeConfirmModal());
    this.confirmCloseBtn.addEventListener('click', () => this.closeConfirmModal());
    this.confirmOverlay.addEventListener('click', (e) => {
      if (e.target === this.confirmOverlay) this.closeConfirmModal();
    });

    // Make addToCart available globally for inline onclick handlers
    window.addToCart = (id) => this.addToCart(id);
    window.updateCartQty = (id, delta) => this.updateQuantity(id, delta);
    window.removeFromCart = (id) => this.removeFromCart(id);
  }

  toggleCart(forceState) {
    if (typeof forceState === 'boolean') {
      if (forceState) {
        this.modalOverlay.classList.add('active');
      } else {
        this.modalOverlay.classList.remove('active');
      }
    } else {
      this.modalOverlay.classList.toggle('active');
    }
  }

  addToCart(id) {
    const book = this.inventory.find(item => item.id === id);
    if (!book) return;

    const existingItem = this.cartItems.find(item => item.id === id);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      this.cartItems.push({ ...book, qty: 1 });
    }

    this.saveAndRender();
    this.toggleCart(true); // Open cart to show user it was added
  }

  updateQuantity(id, delta) {
    const item = this.cartItems.find(item => item.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        this.removeFromCart(id);
      } else {
        this.saveAndRender();
      }
    }
  }

  removeFromCart(id) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.saveAndRender();
  }

  saveAndRender() {
    localStorage.setItem('carbon_manga_cart', JSON.stringify(this.cartItems));
    this.renderCart();
  }

  renderCart() {
    // Update badge count
    const totalItems = this.cartItems.reduce((sum, item) => sum + item.qty, 0);
    if (this.badgeEl) {
      this.badgeEl.textContent = totalItems;
      this.badgeEl.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Update items container
    if (this.cartItems.length === 0) {
      this.itemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Your cart is empty.</p>';
      this.totalPriceEl.textContent = '₹0';
      return;
    }

    let totalPrice = 0;
    this.itemsContainer.innerHTML = this.cartItems.map(item => {
      totalPrice += item.price * item.qty;
      return `
        <div class="cart-item">
          <img src="${item.cover}" alt="${item.title}" class="cart-item-img" />
          <div class="cart-item-details">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">₹${item.price}</div>
            <div class="cart-item-actions">
              <button class="cart-qty-btn" onclick="window.updateCartQty(${item.id}, -1)">-</button>
              <span>${item.qty}</span>
              <button class="cart-qty-btn" onclick="window.updateCartQty(${item.id}, 1)">+</button>
              <button class="cart-remove-btn" onclick="window.removeFromCart(${item.id})" aria-label="Remove item">🗑️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.totalPriceEl.textContent = `₹${totalPrice}`;
  }

  initiateCheckout() {
    if (this.cartItems.length === 0) return;

    const userName = this.nameInput ? this.nameInput.value.trim() : "";
    
    if (!userName) {
      // Temporarily grab focus back to the input and highlight it
      this.nameInput.focus();
      this.nameInput.classList.remove('manga-shake');
      void this.nameInput.offsetWidth; // trigger reflow
      this.nameInput.classList.add('manga-shake');
      this.nameInput.style.borderColor = 'var(--manga-red)';
      
      // Wait for user to type
      this.nameInput.addEventListener('input', () => {
        this.nameInput.style.borderColor = '';
      }, { once: true });
      
      return;
    }

    // Prepare confirmation details
    let totalItems = 0;
    let totalCost = 0;
    
    this.cartItems.forEach(item => {
      totalItems += item.qty;
      totalCost += item.price * item.qty;
    });

    this.confirmDetailsText.textContent = `Name: ${userName}\nItems: ${totalItems}\nTotal Amount: ₹${totalCost}`;

    // Show Confirmation Modal
    this.confirmOverlay.classList.add('active');

    // Handle Confirm action (needs to remove old listeners to prevent multiple clicks)
    const handleConfirm = () => {
      this.closeConfirmModal();
      this.executeCheckout(userName);
      this.confirmSubmitBtn.removeEventListener('click', handleConfirm);
    };

    // Clean up old listeners (hacky but works for simple case or clone/replace node)
    const newBtn = this.confirmSubmitBtn.cloneNode(true);
    this.confirmSubmitBtn.parentNode.replaceChild(newBtn, this.confirmSubmitBtn);
    this.confirmSubmitBtn = newBtn;
    
    this.confirmSubmitBtn.addEventListener('click', handleConfirm);
  }

  closeConfirmModal() {
    this.confirmOverlay.classList.remove('active');
  }

  executeCheckout(userName) {
    const phoneNumber = "917388912221"; // Existing phone number
    
    let message = `Hi! I am *${userName}* and I would like to order the following items from Carbon Manga:%0A%0A`;
    
    let total = 0;
    this.cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.title}* - Qty: ${item.qty} - ₹${item.price * item.qty}%0A`;
      total += item.price * item.qty;
    });

    message += `%0A*Total Amount: ₹${total}*%0A%0APlease confirm my order.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
