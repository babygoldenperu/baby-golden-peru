/* =========================================================
   BABY GOLDEN PERÚ — ADMIN PRODUCTOS DE MARCA
   Inserta un gestor de múltiples fotos dentro de cada edición
   de beneficios_golden.
========================================================= */
(function () {
  const sb = window.supabaseClient;
  if (!sb) {
    console.error("Admin productos: Supabase no está disponible.");
    return;
  }

  const styles = `
    .gb-products-manager{
      grid-column:1/-1;
      margin-top:18px;
      padding:16px;
      background:#faf8f5;
      border:1px solid #e8e1d8;
      border-radius:14px;
    }
    .gb-products-title{
      margin:0 0 4px;
      font-family:Georgia,serif;
      font-size:20px;
      font-weight:400;
    }
    .gb-products-help{
      margin:0 0 13px;
      color:#777;
      font-size:11px;
      line-height:1.5;
    }
    .gb-products-upload{
      display:flex;
      gap:10px;
      align-items:center;
      flex-wrap:wrap;
    }
    .gb-products-upload input[type=file]{
      flex:1;
      min-width:240px;
      margin:0;
    }
    .gb-products-upload button{
      width:auto !important;
      margin:0;
      padding:11px 15px !important;
      border-radius:10px !important;
      background:#b18a4a !important;
    }
    .gb-products-status{
      display:none;
      margin-top:10px;
      padding:10px 12px;
      border-radius:9px;
      font-size:11px;
    }
    .gb-products-status.ok{
      display:block;
      background:#edf7ef;
      color:#27703c;
    }
    .gb-products-status.error{
      display:block;
      background:#faeaea;
      color:#a33b3b;
    }
    .gb-products-gallery{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(150px,1fr));
      gap:10px;
      margin-top:15px;
    }
    .gb-product-item{
      position:relative;
      background:#fff;
      border:1px solid #e4ddd3;
      border-radius:12px;
      padding:8px;
    }
    .gb-product-thumb{
      width:100%;
      aspect-ratio:1;
      object-fit:cover;
      border-radius:9px;
      background:#f5f2ed;
      display:block;
    }
    .gb-product-order{
      margin-top:7px;
      font-size:10px;
      font-weight:700;
      color:#777;
    }
    .gb-product-actions{
      display:flex;
      gap:5px;
      margin-top:7px;
    }
    .gb-product-actions button{
      width:auto !important;
      flex:1;
      padding:7px 8px !important;
      border-radius:8px !important;
      font-size:10px !important;
    }
    .gb-product-actions .move{
      background:#eee !important;
      color:#333 !important;
    }
    .gb-product-actions .remove{
      background:#a83b3b !important;
      color:#fff !important;
    }
    .gb-products-empty{
      margin-top:12px;
      padding:15px;
      border:1px dashed #ddd2c6;
      border-radius:10px;
      color:#888;
      font-size:11px;
      text-align:center;
      background:#fff;
    }
    @media(max-width:700px){
      .gb-products-gallery{grid-template-columns:repeat(2,minmax(0,1fr));}
      .gb-products-upload{align-items:stretch;}
      .gb-products-upload button{width:100% !important;}
    }
  `;

  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);

  function esc(value){
    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function getManager(card){
    return card.querySelector(".gb-products-manager");
  }

  function injectManager(card){
    if (getManager(card)) return;

    const benefitId = card.dataset.beneficioId;
    if (!benefitId) return;

    const edit = card.querySelector(".gb-edit");
    if (!edit) return;

    const actions = edit.querySelector(".gb-actions");
    const manager = document.createElement("div");
    manager.className = "gb-products-manager";
    manager.innerHTML = `
      <h3 class="gb-products-title">Productos de la marca</h3>
      <p class="gb-products-help">
        Carga varias fotos del catálogo. Aparecerán en el carrusel público de “VER PRODUCTOS”.
        Máximo recomendado: 5 MB por imagen.
      </p>

      <div class="gb-products-upload">
        <input
          type="file"
          class="gb-product-files"
          accept="image/png,image/jpeg,image/webp"
          multiple
        >
        <button type="button" class="gb-products-upload-button">
          SUBIR PRODUCTOS
        </button>
      </div>

      <div class="gb-products-status"></div>
      <div class="gb-products-gallery"></div>
      <div class="gb-products-empty">Cargando productos...</div>
    `;

    if (actions) {
      edit.insertBefore(manager, actions);
    } else {
      edit.appendChild(manager);
    }

    manager.querySelector(".gb-products-upload-button")
      .addEventListener("click", () => uploadProducts(card));

    loadProducts(card);
  }

  async function loadProducts(card){
    const benefitId = card.dataset.beneficioId;
    const manager = getManager(card);
    if (!manager || !benefitId) return;

    const gallery = manager.querySelector(".gb-products-gallery");
    const empty = manager.querySelector(".gb-products-empty");

    gallery.innerHTML = "";
    empty.textContent = "Cargando productos...";
    empty.style.display = "block";

    const {data, error} = await sb
      .from("beneficio_productos")
      .select("id,imagen_url,storage_path,orden")
      .eq("beneficio_id", benefitId)
      .order("orden",{ascending:true});

    if (error) {
      console.error(error);
      empty.textContent = "No se pudieron cargar los productos.";
      return;
    }

    if (!data || !data.length) {
      empty.textContent = "Todavía no hay fotos de productos.";
      return;
    }

    empty.style.display = "none";

    data.forEach((item, index) => {
      const box = document.createElement("div");
      box.className = "gb-product-item";
      box.innerHTML = `
        <img
          class="gb-product-thumb"
          src="${esc(item.imagen_url)}"
          alt="Producto ${index + 1}"
        >
        <div class="gb-product-order">Foto ${index + 1}</div>
        <div class="gb-product-actions">
          <button type="button" class="move move-up">↑</button>
          <button type="button" class="move move-down">↓</button>
          <button type="button" class="remove">ELIMINAR</button>
        </div>
      `;

      box.querySelector(".move-up").addEventListener("click", () =>
        moveProduct(card,item,"up",data)
      );
      box.querySelector(".move-down").addEventListener("click", () =>
        moveProduct(card,item,"down",data)
      );
      box.querySelector(".remove").addEventListener("click", () =>
        deleteProduct(card,item)
      );

      gallery.appendChild(box);
    });
  }

  async function uploadProducts(card){
    const benefitId = card.dataset.beneficioId;
    const manager = getManager(card);
    if (!manager || !benefitId) return;

    const input = manager.querySelector(".gb-product-files");
    const status = manager.querySelector(".gb-products-status");
    const files = Array.from(input.files || []);

    if (!files.length) {
      showStatus(manager,"Selecciona al menos una imagen.","error");
      return;
    }

    for (const file of files) {
      if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
        showStatus(manager,`Formato no permitido: ${file.name}`,"error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showStatus(manager,`La imagen ${file.name} supera 5 MB.`,"error");
        return;
      }
    }

    const {data: existing, error: existingError} = await sb
      .from("beneficio_productos")
      .select("orden")
      .eq("beneficio_id", benefitId)
      .order("orden",{ascending:false})
      .limit(1);

    if (existingError) {
      console.error(existingError);
      showStatus(manager,"No se pudo obtener el orden de las imágenes.","error");
      return;
    }

    let nextOrder = existing?.[0]?.orden ?? -1;
    nextOrder += 1;

    const button = manager.querySelector(".gb-products-upload-button");
    button.disabled = true;
    button.textContent = "SUBIENDO...";

    try {
      for (const file of files) {
        const extension = file.name.split(".").pop().toLowerCase();
        const storagePath =
          `productos/${benefitId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

        const {error: uploadError} = await sb.storage
          .from("logos-marcas")
          .upload(storagePath,file,{
            cacheControl:"3600",
            upsert:false,
            contentType:file.type
          });

        if (uploadError) throw uploadError;

        const {data: publicData} = sb.storage
          .from("logos-marcas")
          .getPublicUrl(storagePath);

        const {error: insertError} = await sb
          .from("beneficio_productos")
          .insert({
            beneficio_id:benefitId,
            imagen_url:publicData.publicUrl,
            storage_path:storagePath,
            orden:nextOrder
          });

        if (insertError) {
          await sb.storage.from("logos-marcas").remove([storagePath]);
          throw insertError;
        }

        nextOrder += 1;
      }

      input.value = "";
      showStatus(manager,"Productos cargados correctamente.","ok");
      await loadProducts(card);

    } catch(error) {
      console.error(error);
      showStatus(manager,error.message || "No se pudieron subir los productos.","error");
    } finally {
      button.disabled = false;
      button.textContent = "SUBIR PRODUCTOS";
    }
  }

  async function deleteProduct(card,item){
    if (!confirm("¿Eliminar esta foto del carrusel?")) return;

    const {error} = await sb
      .from("beneficio_productos")
      .delete()
      .eq("id",item.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (item.storage_path) {
      const {error: storageError} = await sb.storage
        .from("logos-marcas")
        .remove([item.storage_path]);

      if (storageError) {
        console.warn("La fila fue eliminada, pero no el archivo:",storageError);
      }
    }

    await normalizeOrder(card);
    await loadProducts(card);
  }

  async function moveProduct(card,item,direction,items){
    const index = items.findIndex(x => x.id === item.id);
    if (index < 0) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const other = items[targetIndex];

    const {error:errorA} = await sb
      .from("beneficio_productos")
      .update({orden:other.orden})
      .eq("id",item.id);

    if (errorA) {
      alert(errorA.message);
      return;
    }

    const {error:errorB} = await sb
      .from("beneficio_productos")
      .update({orden:item.orden})
      .eq("id",other.id);

    if (errorB) {
      alert(errorB.message);
      return;
    }

    await loadProducts(card);
  }

  async function normalizeOrder(card){
    const benefitId = card.dataset.beneficioId;
    const {data,error} = await sb
      .from("beneficio_productos")
      .select("id")
      .eq("beneficio_id",benefitId)
      .order("orden",{ascending:true});

    if (error) return;

    for (let i=0;i<(data || []).length;i++) {
      await sb
        .from("beneficio_productos")
        .update({orden:i})
        .eq("id",data[i].id);
    }
  }

  function showStatus(manager,text,type){
    const el = manager.querySelector(".gb-products-status");
    el.textContent = text;
    el.className = `gb-products-status ${type}`;
    window.clearTimeout(el._timer);
    el._timer = window.setTimeout(() => {
      el.className = "gb-products-status";
      el.textContent = "";
    },4500);
  }

  function enhanceCards(){
    document.querySelectorAll("#gbList .gb-card[data-beneficio-id]").forEach(card => {
      injectManager(card);
      const editButton = card.querySelector(".gb-edit-button");
      if (editButton && !editButton.dataset.productsBound) {
        editButton.dataset.productsBound = "true";
        editButton.addEventListener("click",() => loadProducts(card));
      }
    });
  }

  const list = document.getElementById("gbList");
  if (list) {
    const observer = new MutationObserver(enhanceCards);
    observer.observe(list,{childList:true,subtree:true});
    enhanceCards();
  }
})();
