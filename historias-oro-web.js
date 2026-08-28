/* BABY GOLDEN PERÚ
   HISTORIAS DE ORO
   Galería premium — 12 fotos
*/

(function () {
  "use strict";

  const SB_URL =
    "https://cxgcmrpqqaachnfavplh.supabase.co";

  const SB_KEY =
    "sb_publishable_6ZXdTZFUqYZUR-4aGU9VSQ_X8rtNtxY";

  const STORY_SLOTS = [
    "historia_1",
    "historia_2",
    "historia_3",
    "historia_4",
    "historia_5",
    "historia_6",
    "historia_7",
    "historia_8",
    "historia_9",
    "historia_10",
    "historia_11",
    "historia_12"
  ];

  async function cargarHistoriasDeOro() {

    try {

      if (!window.supabase) return;

      /* =====================================
         CONEXIÓN CON SUPABASE
      ===================================== */

      if (
        !document.querySelector(
          'link[data-bgp-supabase-preconnect]'
        )
      ) {

        const preconnect =
          document.createElement("link");

        preconnect.rel = "preconnect";
        preconnect.href = SB_URL;
        preconnect.dataset.bgpSupabasePreconnect = "true";

        document.head.appendChild(
          preconnect
        );

      }

      const sb =
        window.supabase.createClient(
          SB_URL,
          SB_KEY
        );


      /* =====================================
         LEER LAS 12 FOTOS DE SUPABASE
      ===================================== */

      const { data, error } =
        await sb
          .from("site_gallery")
          .select(
            "id,slot,imagen_url,title,caption,orden,activo,published"
          )
          .in("slot", STORY_SLOTS)
          .eq("activo", true)
          .eq("published", true)
          .order("orden", {
            ascending: true
          });


      if (error) {

        console.warn(
          "Historias de Oro:",
          error.message
        );

        return;

      }


      /* =====================================
         SOLO FOTOS CON IMAGEN
      ===================================== */

      const fotos =
        (data || [])
          .filter(function (foto) {

            return (
              foto.imagen_url &&
              String(foto.imagen_url).trim() !== ""
            );

          })
          .sort(function (a, b) {

            return (
              Number(a.orden || 0) -
              Number(b.orden || 0)
            );

          })
          .slice(0, 12);


      if (!fotos.length) return;


      /* =====================================
         ENCONTRAR CARRUSEL ANTIGUO
      ===================================== */

      const antiguo =
        document.querySelector(
          ".stories-carousel"
        );


      if (!antiguo) return;


      antiguo.style.display = "none";


      /* =====================================
         ELIMINAR GALERÍA ANTERIOR
      ===================================== */

      const anterior =
        document.getElementById(
          "historiasOroPremium"
        );


      if (anterior) {

        anterior.remove();

      }


      /* =====================================
         CREAR GALERÍA
      ===================================== */

      const galeria =
        document.createElement("section");

      galeria.id =
        "historiasOroPremium";


      galeria.innerHTML = `

<style>

/* =====================================
   GALERÍA DESKTOP
===================================== */

#historiasOroPremium{

  width:100%;
  margin:0;
  padding:0;

}

#historiasOroPremium
.ho-gallery{

  width:100%;

  display:grid;

  grid-template-columns:
    repeat(6, minmax(0, 1fr));

  gap:12px;

}


/* =====================================
   TARJETAS
===================================== */

#historiasOroPremium
.ho-card{

  position:relative;

  width:100%;

  height:390px;

  overflow:hidden;

  border-radius:22px;

  background:#e8ddce;

  cursor:pointer;

}

#historiasOroPremium
.ho-card img{

  width:100%;

  height:100%;

  display:block;

  object-fit:cover;

  transition:
    transform .6s ease;

  content-visibility:auto;

}

#historiasOroPremium
.ho-card:hover img{

  transform:scale(1.05);

}


/* =====================================
   DEGRADADO
===================================== */

#historiasOroPremium
.ho-card::after{

  content:"";

  position:absolute;

  inset:0;

  background:
    linear-gradient(
      to top,
      rgba(30,21,14,.72),
      rgba(30,21,14,0)
      55%
    );

  pointer-events:none;

}


/* =====================================
   TEXTO
===================================== */

#historiasOroPremium
.ho-label{

  position:absolute;

  z-index:2;

  left:18px;

  right:12px;

  bottom:18px;

  color:#fff;

  font-size:9px;

  font-weight:700;

  letter-spacing:2px;

  text-transform:uppercase;

}


/* =====================================
   LIGHTBOX
===================================== */

#hoLightbox{

  position:fixed;

  inset:0;

  z-index:999999;

  display:none;

  align-items:center;

  justify-content:center;

  padding:30px;

  background:
    rgba(20,15,11,.95);

  backdrop-filter:
    blur(16px);

  -webkit-backdrop-filter:
    blur(16px);

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


/* =====================================
   BOTONES
===================================== */

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

  color:#fff;

  cursor:pointer;

  font-size:28px;

  z-index:5;

}

#hoLightbox
.ho-close{

  top:24px;
  right:28px;

}

#hoLightbox
.ho-prev{

  left:25px;
  top:50%;

  transform:
    translateY(-50%);

}

#hoLightbox
.ho-next{

  right:25px;
  top:50%;

  transform:
    translateY(-50%);

}


/* =====================================
   TABLET
===================================== */

@media(max-width:1100px){

  #historiasOroPremium
  .ho-gallery{

    grid-template-columns:
      repeat(3, 1fr);

  }

}


/* =====================================
   CELULAR
===================================== */

@media(max-width:600px){

  #historiasOroPremium
  .ho-gallery{

    display:flex;

    width:100%;

    overflow-x:auto;

    gap:12px;

    padding:
      0 16px 12px;

    scroll-snap-type:
      x mandatory;

    scrollbar-width:none;

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

    left:8px;

  }


  #hoLightbox
  .ho-next{

    right:8px;

  }


  #hoLightbox
  .ho-close{

    top:12px;
    right:12px;

  }

}

</style>


<!-- GALERÍA -->

<div class="ho-gallery"></div>


<!-- VISOR GRANDE -->

<div
  id="hoLightbox"
  aria-hidden="true"
>

  <button
    class="ho-close"
    type="button"
    aria-label="Cerrar"
  >
    ×
  </button>


  <button
    class="ho-prev"
    type="button"
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
    type="button"
    aria-label="Foto siguiente"
  >
    ›
  </button>

</div>

`;


      /* =====================================
         INSERTAR GALERÍA
      ===================================== */

      antiguo.parentNode.insertBefore(
        galeria,
        antiguo
      );


      /* =====================================
         ELEMENTOS
      ===================================== */

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


      /* =====================================
         CREAR URL DE MINIATURA
      ===================================== */

      function crearMiniaturaSupabase(
        url,
        width,
        quality
      ) {

        try {

          const parsed =
            new URL(url);

          const marker =
            "/storage/v1/object/public/";

          const posicion =
            parsed.pathname.indexOf(
              marker
            );


          if (posicion === -1) {

            return url;

          }


          const ruta =
            parsed.pathname.substring(
              posicion + marker.length
            );


          return (
            parsed.origin +
            "/storage/v1/render/image/public/" +
            ruta +
            "?width=" +
            encodeURIComponent(width) +
            "&quality=" +
            encodeURIComponent(quality)
          );

        }
        catch(error) {

          return url;

        }

      }


      /* =====================================
         CREAR LAS 12 FOTOS
      ===================================== */

      fotos.forEach(
        function (foto, index) {

          const card =
            document.createElement(
              "article"
            );


          card.className =
            "ho-card";


          const titulo =
            foto.title ||
            foto.caption ||
            "Historias de Oro";


          /*
            La tarjeta utiliza una versión
            optimizada de la imagen.

            La imagen original solamente
            se utiliza cuando el usuario
            abre el visor.
          */

          const imagenOriginal =
            String(
              foto.imagen_url
            ).trim();


          const imagenMiniatura =
            crearMiniaturaSupabase(
              imagenOriginal,
              800,
              70
            );


          card.innerHTML = `

<img
  src="${imagenMiniatura}"
  data-full-src="${imagenOriginal}"
  alt="${titulo}"
  loading="lazy"
  decoding="async"
  width="800"
  height="800"
>

<div class="ho-label">
  ${titulo}
</div>

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


      /* =====================================
         ABRIR FOTO
      ===================================== */

      function abrir(index) {

        actual =
          (index + fotos.length)
          % fotos.length;


        /*
          IMPORTANTE:
          aquí usamos la imagen original
          para conservar máxima calidad
          en el visor.
        */

        lightboxImage.src =
          String(
            fotos[actual]
              .imagen_url
          ).trim();


        lightboxImage.alt =
          fotos[actual].title ||
          fotos[actual].caption ||
          "Historia de Oro — Baby Golden Perú";


        lightboxImage.loading =
          "eager";


        lightboxImage.decoding =
          "async";


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


      /* =====================================
         CERRAR
      ===================================== */

      function cerrar() {

        lightbox.classList.remove(
          "active"
        );


        lightbox.setAttribute(
          "aria-hidden",
          "true"
        );


        lightboxImage.src =
          "";


        document.body.style.overflow =
          "";

      }


      /* =====================================
         SIGUIENTE
      ===================================== */

      function siguiente() {

        abrir(
          actual + 1
        );

      }


      /* =====================================
         ANTERIOR
      ===================================== */

      function anterior() {

        abrir(
          actual - 1
        );

      }


      /* =====================================
         BOTONES
      ===================================== */

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


      /* =====================================
         CLIC FUERA
      ===================================== */

      lightbox.addEventListener(
        "click",
        function(e) {

          if (
            e.target === lightbox
          ) {

            cerrar();

          }

        }
      );


      /* =====================================
         TECLADO
      ===================================== */

      document.addEventListener(
        "keydown",
        function(e) {

          if (
            !lightbox
              .classList
              .contains("active")
          ) {

            return;

          }


          if (
            e.key === "Escape"
          ) {

            cerrar();

          }


          if (
            e.key === "ArrowRight"
          ) {

            siguiente();

          }


          if (
            e.key === "ArrowLeft"
          ) {

            anterior();

          }

        }
      );


      /* =====================================
         SWIPE EN CELULAR
      ===================================== */

      let inicioX = 0;


      lightbox.addEventListener(
        "touchstart",
        function(e) {

          inicioX =
            e.changedTouches[0]
              .screenX;

        },
        {
          passive:true
        }
      );


      lightbox.addEventListener(
        "touchend",
        function(e) {

          const finalX =
            e.changedTouches[0]
              .screenX;


          const diferencia =
            finalX - inicioX;


          if (
            Math.abs(diferencia) < 50
          ) {

            return;

          }


          if (
            diferencia < 0
          ) {

            siguiente();

          }
          else {

            anterior();

          }

        },
        {
          passive:true
        }
      );


    }
    catch(error) {

      console.warn(
        "Error cargando Historias de Oro:",
        error
      );

    }

  }


  /* =====================================
     INICIAR
  ===================================== */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      cargarHistoriasDeOro
    );

  }
  else {

    cargarHistoriasDeOro();

  }

})();
