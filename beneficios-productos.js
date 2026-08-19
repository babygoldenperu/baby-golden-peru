/* =========================================================
   BABY GOLDEN PERÚ — CARRUSEL DE PRODUCTOS
   Se monta sobre beneficios.html sin alterar su render existente.
   Requiere que cada .brand-card tenga data-beneficio-id="UUID".
========================================================= */
(function () {
  const SUPABASE_URL = "https://cxgcmrpqqaachnfavplh.supabase.co";
  const SUPABASE_KEY = "sb_publishable_6ZXdTZFUqYZUR-4aGU9VSQ_X8rtNtxY";

  const sb =
    window.supabaseClient ||
    (window.supabase && window.supabase.createClient
      ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
      : null);

  if (!sb) {
    console.error("Productos: Supabase no está disponible.");
    return;
  }

  const styles = `
    .products-link{
      display:flex;
      align-items:center;
      justify-content:space-between;
      width:100%;
      margin-top:12px;
      padding:12px 2px 0;
      border:0;
      border-top:1px solid var(--line,#ebe5dc);
      background:transparent;
      color:var(--gold-dark,#8d6b35);
      font-size:10.5px;
      font-weight:700;
      letter-spacing:.9px;
      cursor:pointer;
      text-align:left;
      transition:color .2s ease;
    }
    .products-link:hover{color:var(--ink,#292521);}
    .products-link span:last-child{
      font-size:15px;
      line-height:1;
    }

    .products-modal{
      position:fixed;
      inset:0;
      z-index:20000;
      display:none;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:rgba(30,25,20,.70);
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
    }
    .products-modal.open{display:flex;}

    .products-dialog{
      width:min(900px,100%);
      max-height:min(90vh,760px);
      overflow:hidden;
      background:#fff;
      border:1px solid #e6dfd5;
      border-radius:22px;
      box-shadow:0 30px 90px rgba(0,0,0,.25);
      position:relative;
      display:flex;
      flex-direction:column;
    }

    .products-head{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:20px;
      padding:20px 22px 16px;
      border-bottom:1px solid #eee8e0;
    }
    .products-kicker{
      color:#b18a4a;
      font-size:9px;
      letter-spacing:2px;
      font-weight:700;
      text-transform:uppercase;
      margin-bottom:4px;
    }
    .products-title{
      margin:0;
      color:#292521;
      font-family:Georgia,"Times New Roman",serif;
      font-size:27px;
      font-weight:400;
    }
    .products-close{
      width:38px;
      height:38px;
      flex:0 0 38px;
      border:1px solid #ddd5ca;
      border-radius:50%;
      background:#faf8f5;
      color:#4a433d;
      cursor:pointer;
      font-size:22px;
      line-height:1;
      display:grid;
      place-items:center;
    }

    .products-stage{
      position:relative;
      flex:1;
      min-height:330px;
      background:#f7f4ef;
      display:grid;
      place-items:center;
      overflow:hidden;
    }
    .products-image{
      max-width:100%;
      max-height:58vh;
      width:auto;
      height:auto;
      object-fit:contain;
      display:block;
      user-select:none;
    }

    .products-arrow{
      position:absolute;
      top:50%;
      transform:translateY(-50%);
      width:44px;
      height:44px;
      border:1px solid rgba(55,48,41,.12);
      border-radius:50%;
      background:rgba(255,255,255,.90);
      color:#3c342d;
      cursor:pointer;
      font-size:25px;
      display:grid;
      place-items:center;
      box-shadow:0 10px 24px rgba(38,31,26,.10);
    }
    .products-arrow:disabled{
      opacity:.35;
      cursor:default;
    }
    .products-prev{left:18px;}
    .products-next{right:18px;}

    .products-empty{
      padding:50px 24px;
      text-align:center;
      color:#77716a;
      font-size:13px;
      line-height:1.6;
    }

    .products-foot{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:12px;
      padding:12px 18px 16px;
      border-top:1px solid #eee8e0;
      color:#7b746c;
      font-size:11px;
    }
    .products-counter{font-weight:700;color:#5d554d;}

    @media(max-width:600px){
      .products-modal{padding:10px;}
      .products-dialog{border-radius:18px;}
      .products-title{font-size:23px;}
      .products-stage{min-height:280px;}
      .products-image{max-height:55vh;}
      .products-arrow{width:40px;height:40px;}
      .products-prev{left:10px;}
      .products-next{right:10px;}
    }
  `;

  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.className = "products-modal";
  modal.innerHTML = `
    <div class="products-dialog" role="dialog" aria-modal="true" aria-labelledby="productsDialogTitle">
      <div class="products-head">
        <div>
          <div class="products-kicker">CATÁLOGO DE PRODUCTOS</div>
          <h2 class="products-title" id="productsDialogTitle">Productos de la marca</h2>
        </div>
        <button class="products-close" type="button" aria-label="Cerrar">×</button>
      </div>
      <div class="products-stage">
        <div class="products-empty">Cargando productos...</div>
        <button class="products-arrow products-prev" type="button" aria-label="Anterior">‹</button>
        <button class="products-arrow products-next" type="button" aria-label="Siguiente">›</button>
      </div>
      <div class="products-foot">
        <span class="products-counter"></span>
        <span>Desliza o utiliza las flechas para ver los productos.</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const stage = modal.querySelector(".products-stage");
  const closeBtn = modal.querySelector(".products-close");
  const prevBtn = modal.querySelector(".products-prev");
  const nextBtn = modal.querySelector(".products-next");
  const counter = modal.querySelector(".products-counter");

  let products = [];
  let index = 0;

  function esc(value){
    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function setEmpty(message){
    stage.innerHTML = `<div class="products-empty">${esc(message)}</div>`;
    counter.textContent = "";
  }

  function renderSlide(){
    if (!products.length) {
      setEmpty("Esta marca todavía no tiene productos publicados.");
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const item = products[index];

    stage.innerHTML = `
      <img
        class="products-image"
        src="${esc(item.imagen_url)}"
        alt="Producto ${index + 1}"
      >
    `;

    stage.appendChild(prevBtn);
    stage.appendChild(nextBtn);

    prevBtn.disabled = products.length < 2;
    nextBtn.disabled = products.length < 2;

    counter.textContent = `${index + 1} / ${products.length}`;
  }

  async function openProducts(beneficioId, title){
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.querySelector(".products-title").textContent =
      `Productos · ${title || "Marca Aliada"}`;

    stage.innerHTML = `<div class="products-empty">Cargando productos...</div>`;
    counter.textContent = "";
    products = [];
    index = 0;

    const {data, error} = await sb
      .from("beneficio_productos")
      .select("id,imagen_url,orden")
      .eq("beneficio_id", beneficioId)
      .order("orden",{ascending:true});

    if (error) {
      console.error(error);
      setEmpty("No pudimos cargar los productos en este momento.");
      return;
    }

    products = data || [];
    renderSlide();
  }

  function closeProducts(){
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  prevBtn.addEventListener("click", () => {
    if (!products.length) return;
    index = (index - 1 + products.length) % products.length;
    renderSlide();
  });

  nextBtn.addEventListener("click", () => {
    if (!products.length) return;
    index = (index + 1) % products.length;
    renderSlide();
  });

  closeBtn.addEventListener("click", closeProducts);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeProducts();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("open")) return;
    if (event.key === "Escape") closeProducts();
    if (event.key === "ArrowLeft") prevBtn.click();
    if (event.key === "ArrowRight") nextBtn.click();
  });

  function enhanceCards(){
    document.querySelectorAll(".brand-card[data-beneficio-id]").forEach(card => {
      const benefitId = card.dataset.beneficioId;
      if (!benefitId) return;

      const detailsBox = card.querySelector(".details");
      if (!detailsBox || detailsBox.querySelector(".products-link")) return;

      const title =
        card.querySelector(".brand-name")?.textContent?.trim() || "Marca Aliada";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "products-link";
      button.innerHTML = `<span>VER PRODUCTOS</span><span>→</span>`;
      button.addEventListener("click", () => openProducts(benefitId, title));

      detailsBox.appendChild(button);
    });
  }

  const grid = document.getElementById("brandGrid");
  if (grid) {
    const observer = new MutationObserver(enhanceCards);
    observer.observe(grid,{childList:true,subtree:true});
    enhanceCards();
  }
})();
