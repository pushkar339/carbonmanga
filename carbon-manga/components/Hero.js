export function setupHero() {
  const hero = document.getElementById('hero');
  hero.style.height = 'auto'; // Remove the old 400vh for scroll animation

  hero.innerHTML = `
    <div class="weeboo-hero">
      <!-- Background elements -->
      <div class="hero-bg-text top-left">STREET RACING</div>
      <div class="hero-bg-text top-right">DRIFT RACE</div>
      <div class="hero-bg-text bottom-left">MNCY</div>
      <div class="hero-bg-text bottom-right" style="bottom: 10%; right: -5%;">BETTER THAN BEFORE</div>
      
      <!-- Ink splatters (built via CSS radial gradients or static SVG paths, simplified here) -->
      <div class="splatter splatter-1"></div>
      <div class="splatter splatter-2"></div>

      <div class="hero-grid container">
        
        <!-- Center Title -->
        <div class="weeboo-title layer-text">
          <span class="red-text">CAR</span>BON<br>
          <span class="offset-text">MANGA</span>
        </div>

        <!-- Left Comic Panel -->
        <div class="comic-panel panel-left layer-1">
          <img src="/images/weeboo/left.png" alt="Manga Eyes" />
          <div class="social-tab">
            <span style="font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; padding: 0 10px;">OUR SOCIAL MEDIA</span>
            <div class="icons">
               <a href="https://wa.me/917388912221" target="_blank" rel="noopener noreferrer" style="color: inherit;">
                 <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 0C5.385 0 0 5.384 0 12.029c0 2.126.55 4.195 1.594 6.02L.055 23.636l5.748-1.508c1.78.944 3.791 1.443 5.856 1.443h.007c6.643 0 12.027-5.384 12.027-12.027C23.693 5.384 18.312 0 12.031 0zm0 21.572h-.007c-1.801 0-3.565-.483-5.11-1.399l-.367-.217-3.8.998.998-3.702-.238-.378a9.982 9.982 0 01-1.529-5.378c0-5.503 4.48-9.984 9.988-9.984 2.668 0 5.176 1.039 7.062 2.926 1.886 1.886 2.924 4.394 2.924 7.062 0 5.503-4.481 9.986-9.985 9.986zm5.474-7.478c-.301-.15-1.78-.88-2.057-.982-.276-.101-.478-.151-.679.151-.202.302-.777.982-.953 1.183-.176.202-.353.227-.654.076-.301-.15-1.27-.468-2.42-1.5-1.077-.962-1.802-2.15-2.015-2.451-.212-.302-.023-.465.128-.616.136-.135.301-.352.452-.529.15-.176.201-.301.302-.503.1-.201.05-.377-.026-.528-.076-.151-.679-1.636-.93-2.241-.242-.589-.488-.509-.679-.519-.175-.008-.376-.008-.578-.008-.201 0-.528.075-.805.377-.276.301-1.055 1.031-1.055 2.513 0 1.482 1.08 2.915 1.231 3.116.151.202 2.126 3.245 5.148 4.549.718.311 1.279.497 1.717.636.721.229 1.378.196 1.895.118.577-.087 1.78-.727 2.031-1.431.252-.704.252-1.308.177-1.432-.075-.125-.276-.201-.577-.352z"/></svg>
               </a>
               <a href="https://www.instagram.com/carbonmanga/?hl=en" target="_blank" rel="noopener noreferrer" style="color: inherit;">
                 <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
               </a>
            </div>
          </div>
        </div>

        <!-- Center Slanted Panel -->
        <div class="comic-panel panel-center layer-3">
          <img src="/images/weeboo/center.png" alt="Manga Character" />
        </div>

        <!-- Right Vertical Panel -->
        <div class="comic-panel panel-right layer-2">
          <img src="/images/weeboo/right.png" alt="Manga Portrait" />
        </div>

        <!-- Bottom typography and CTA -->
        <div class="bottom-section layer-3">
          <div class="bottom-left-text">
            <div class="red-polygon"></div>
            <h3 class="agency-title">CARBON MANGA STORE</h3>
            <h1 class="jp-text">ウブは決して死い</h1>
            <div class="slogan-box">
              <span class="corner top-left"></span><span class="corner bottom-right"></span>
              <p>THE AFFORDABLE MANGA SHOPPING EXPERIENCE</p>
            </div>
          </div>
          
          <div class="bottom-right-cta">
            <div class="hero-btns">
              <button class="btn-pill btn-filled-gray" onclick="document.getElementById('trending').scrollIntoView({behavior:'smooth'})">ORDER NOW</button>
              <button class="btn-pill btn-filled-black" onclick="window.open('https://wa.me/917388912221', '_blank')">CONTACT US</button>
            </div>
            <div class="barcode-area">
              <span style="font-weight: 800; letter-spacing: 0.2em;">2020 _ 2024</span>
              <div class="barcode-pattern"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
