/* BABY GOLDEN PERÚ
   HISTORIAS DE ORO
   Galería premium de 6 fotos
*/

(function () {
  "use strict";

  const SB_URL =
    "https://cxgcmrpqqaachnfavplh.supabase.co";

  const SB_KEY =
    "sb_publishable_6ZXdTZFUqYZUR-4aGU9VSQ_X8rtNtxY";

  async function cargarHistoriasDeOro() {

    try {

      if (!window.supabase) return;

      const sb =
        window.supabase.createClient(
          SB_URL,
          SB_KEY
        );

      const { data, error } =
        await sb
          .from("site_gallery")
          .select(
            "slot,imagen_url,title,caption,published"
          )
          .eq("published", true)
          .in("slot", [
            "historia_1",
            "historia_2",
            "historia_3",
            "historia_4",
            "historia_5",
            "historia_6"
          ]);

      if (error) {
        console.warn(
          "Historias de Oro:",
          error.message
        );
        return;
      }

      const fotos =
        (data || [])
          .filter(f => f.imagen_url)
          .sort((a, b) => {

            const na =
              Number(
                String(a.slot)
                  .replace("historia_", "")
              );

            const nb =
              Number(
                String(b.slot)
                  .replace("historia_", "")
              );

            return na - nb;

          });

      if (!fotos.length) return;

      const antiguo =
        document.querySelector(
          ".stories-carousel"
        );

      if (!antiguo) return;

      /* Ocultamos solamente el carrusel antiguo */
      antiguo.style.display = "none";

      /* Eliminamos una galería anterior si existiera */
      const anterior =
        document.getElementById(
          "historiasOroPremium"
        );

      if (anterior) {
        anterior.remove();
      }

      /* ==========================
         GALERÍA
      ========================== */

      const galeria =
        document.createElement("section");

      galeria.id =
        "historiasOroPremium";

      galeria.innerHTML = `

<style>

#historiasOroPremium{
  width:100%;
  margin:0;
  padding:0;
}

#historiasOroPremium .ho-gallery{
  width:100%;
  display:grid;
  grid-template-columns:
    repeat(6, minmax(0,1fr));
  gap:12px;
}

#historiasOroPremium .ho-card{
  position:relative;
  height:390px;
  overflow:hidden;
  border-radius:22px;
  background:#e7dccb;
  cursor:pointer;
}

#historiasOroPremium .ho-card img{
  width:100%;
  height:100%;
  display:block;
  object-fit:cover;
  transition:
    transform .65s ease;
}

#historiasOroPremium
.ho-card:hover img{
  transform:scale(1.05);
}

#historiasOroPremium
.ho-card::after{

  content:"";

  position:absolute;

  inset:0;

  background:
    linear-gradient(
      to top,
      rgba(35,24,16,.68),
      rgba(35,24,16,0)
      55%
    );

  pointer-events:none;
}

#historiasOroPremium
.ho-label{

  position:absolute;

  z-index:2;

  left:18px;

  bottom:18px;

  color:white;

  font-size:9px;

  font-weight:700;

  letter-spacing:2px;

  text-transform:uppercase;

}


/* ==========================
   LIGHTBOX
========================== */

#hoLightbox{

  position:fixed;

  inset:0;

  z-index:999999;

  display:none;

  align-items:center;

  justify-content:center;

  background:
    rgba(25,19,14,.94);

  backdrop-filter:
    blur(15px);

  -webkit-backdrop-filter:
    blur(15px);

  padding:30px;

}

#hoLightbox.active{
  display:flex;
}

#hoLightboxImage{

  max-width:88vw;

  max-height:86vh;

  width:auto;

  height:auto;

  object-fit:contain;

  border-radius:18px;

  box-shadow:
    0 35px 100px
    rgba(0,0,0,.55);

}


/* BOTONES */

#hoLightbox
.ho-close,
#hoLightbox
.ho-prev,
#hoLightbox
.ho-next{

  position:absolute;

  width:48px;

  height:48px;

  display:flex;

  align-items:center;

  justify-content:center;

  border-radius:50%;

  border:
    1px solid
    rgba(255,255,255,.35);

  background:
    rgba(255,255,255,.08);

  color:white;

  cursor:pointer;

  font-size:28px;

  z-index:3;

}

#hoLightbox .ho-close{

  top:24px;

  right:28px;

}

#hoLightbox .ho-prev{

  left:25px;

  top:50%;

  transform:
    translateY(-50%);

}

#hoLightbox .ho-next{

  right:25px;

  top:50%;

  transform:
    translateY(-50%);

}


/* ==========================
   TABLET
========================== */

@media(max-width:1100px){

  #historiasOroPremium
  .ho-gallery{

    grid-template-columns:
      repeat(3,1fr);

  }

}


/* ==========================
   CELULAR
========================== */

@media(max-width:600px){

  #historiasOroPremium
  .ho-gallery{

    display:flex;

    width:100%;

    overflow-x:auto;

    gap:12px;

    scroll-snap-type:
      x mandatory;

    scrollbar-width:none;

    padding:
      0 16px 12px;

  }

  #historiasOroPremium
  .ho-gallery::-webkit-scrollbar{

    display:none;

  }

  #historiasOroPremium
  .ho-card{

    flex:
      0 0 88vw;

    height:470px;

    border-radius:24px;

    scroll-snap-align:center;

  }

  #hoLightbox{

    padding:15px;

  }

  #hoLightboxImage{

    max-width:94vw;

    max-height:78vh;

  }

  #hoLightbox
  .ho-prev{

    left:9px;

  }

  #hoLightbox
  .ho-next{

    right:9px;

  }

  #hoLightbox
  .ho-close{

    top:12px;

    right:12px;

  }

}

</style>


<div class="ho-gallery"></div>


<div
  id="hoLightbox"
  aria-hidden="true"
>

  <button
    class="ho-close"
    aria-label="Cerrar"
  >
    ×
  </button>

  <button
    class="ho-prev"
    aria-label="Foto anterior"
  >
    ‹
  </button>

  <img
    id="hoLightboxImage"
    src=""
    alt="Historia de Oro"
  >

  <button
    class="ho-next"
    aria-label="Foto siguiente"
  >
    ›
  </button>

</div>

`;

      antiguo.parentNode.insertBefore(
        galeria,
        antiguo
      );


      const gallery =
        galeria.querySelector(
          ".ho-gallery"
        );

      const lightbox =
        galeria.querySelector(
          "#hoLightbox"
        );

      const lightboxImage =
        galeria.querySelector(
          "#hoLightboxImage"
        );

      let actual = 0;


      /* ==========================
         CREAR LAS 6 FOTOS
      ========================== */

      fotos.forEach(
        (foto, index) => {

          const card =
            document.createElement(
              "article"
            );

          card.className =
            "ho-card";

          card.innerHTML = `

<img
  src="${foto.imagen_url}"
  alt="${
    foto.title ||
    "Historia de Oro — Baby Golden Perú"
  }"
>

${
  foto.title
    ? `
      <div class="ho-label">
        ${foto.title}
      </div>
      `
    : ""
}

`;

          card.addEventListener(
            "click",
            function () {

              abrir(index);

            }
          );

          gallery.appendChild(
            card
          );

        }
      );


      /* ==========================
         ABRIR FOTO
      ========================== */

      function abrir(index){

        actual =
          (index + fotos.length)
          % fotos.length;

        lightboxImage.src =
          fotos[actual]
            .imagen_url;

        lightboxImage.alt =
          fotos[actual].title ||
          "Historia de Oro — Baby Golden Perú";

        lightbox.classList.add(
          "active"
        );

        lightbox.setAttribute(
          "aria-hidden",
          "false"
        );

        document.body.style.overflow =
          "hidden";

      }


      /* ==========================
         CERRAR
      ========================== */

      function cerrar(){

        lightbox.classList.remove(
          "active"
        );

        lightbox.setAttribute(
          "aria-hidden",
          "true"
        );

        lightboxImage.src = "";

        document.body.style.overflow =
          "";

      }


      /* ==========================
         SIGUIENTE / ANTERIOR
      ========================== */

      function siguiente(){

        abrir(
          actual + 1
        );

      }

      function anterior(){

        abrir(
          actual - 1
        );

      }


      lightbox
        .querySelector(
          ".ho-close"
        )
        .addEventListener(
          "click",
          cerrar
        );

      lightbox
        .querySelector(
          ".ho-next"
        )
        .addEventListener(
          "click",
          siguiente
        );

      lightbox
        .querySelector(
          ".ho-prev"
        )
        .addEventListener(
          "click",
          anterior
        );


      /* Cerrar haciendo clic fuera */

      lightbox.addEventListener(
        "click",
        function(e){

          if(
            e.target === lightbox
          ){

            cerrar();

          }

        }
      );


      /* Teclado */

      document.addEventListener(
        "keydown",
        function(e){

          if(
            !lightbox
              .classList
              .contains("active")
          ){

            return;

          }

          if(
            e.key === "Escape"
          ){

            cerrar();

          }

          if(
            e.key === "ArrowRight"
          ){

            siguiente();

          }

          if(
            e.key === "ArrowLeft"
          ){

            anterior();

          }

        }
      );


      /* ==========================
         SWIPE EN LIGHTBOX
      ========================== */

      let inicioX = 0;

      lightbox.addEventListener(
        "touchstart",
        function(e){

          inicioX =
            e.changedTouches[0].screenX;

        },
        { passive:true }
      );


      lightbox.addEventListener(
        "touchend",
        function(e){

          const finalX =
            e.changedTouches[0].screenX;

          const diferencia =
            finalX - inicioX;

          if(
            Math.abs(diferencia) < 50
          ){

            return;

          }

          if(diferencia < 0){

            siguiente();

          }else{

            anterior();

          }

        },
        { passive:true }
      );

    }

    catch(error){

      console.warn(
        "Error cargando Historias de Oro:",
        error
      );

    }

  }


  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      cargarHistoriasDeOro
    );

  }else{

    cargarHistoriasDeOro();

  }

})();
