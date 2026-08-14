/* BABY GOLDEN PERÚ — Historias de Oro
   Galería premium de 6 fotos + visor ampliado.
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
          .in(
            "slot",
            [
              "historia_1",
              "historia_2",
              "historia_3",
              "historia_4",
              "historia_5",
              "historia_6"
            ]
          )
          .order(
            "orden",
            { ascending: true }
          );

      if (error) {
        console.warn(
          "Historias de Oro:",
          error.message
        );
        return;
      }

      const fotos =
        (data || [])
          .filter(item => item.imagen_url);

      if (!fotos.length) return;

      const antigua =
        document.querySelector(
          ".stories-carousel"
        );

      if (!antigua) return;

      antigua.style.display = "none";

      let galeria =
        document.getElementById(
          "historiasOroPremium"
        );

      if (galeria) {
        galeria.remove();
      }

      galeria =
        document.createElement("div");

      galeria.id =
        "historiasOroPremium";

      galeria.innerHTML = `

<style>

#historiasOroPremium{
  width:100%;
}

#historiasOroPremium .ho-gallery{

  width:100%;

  display:grid;

  grid-template-columns:
    repeat(6,minmax(0,1fr));

  gap:12px;

}

#historiasOroPremium .ho-card{

  position:relative;

  height:390px;

  overflow:hidden;

  border-radius:20px;

  background:#e8ddce;

  cursor:pointer;

}

#historiasOroPremium .ho-card img{

  width:100%;

  height:100%;

  object-fit:cover;

  display:block;

  transition:
    transform .6s ease;

}

#historiasOroPremium
.ho-card:hover img{

  transform:scale(1.045);

}

#historiasOroPremium
.ho-card::after{

  content:"";

  position:absolute;

  inset:0;

  background:
    linear-gradient(
      to top,
      rgba(25,18,12,.55),
      transparent 45%
    );

  pointer-events:none;

}

#historiasOroPremium .ho-label{

  position:absolute;

  z-index:2;

  left:16px;

  right:12px;

  bottom:16px;

  color:#fff;

  font-size:8px;

  font-weight:700;

  letter-spacing:1.8px;

  text-transform:uppercase;

}


/* LIGHTBOX */

#hoLightbox{

  position:fixed;

  inset:0;

  z-index:99999;

  display:none;

  align-items:center;

  justify-content:center;

  padding:30px;

  background:
    rgba(20,16,12,.94);

  backdrop-filter:blur(16px);

  -webkit-backdrop-filter:blur(16px);

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

  border-radius:16px;

  box-shadow:
    0 35px 100px
    rgba(0,0,0,.5);

}

#hoLightbox
.ho-close,
#hoLightbox
.ho-prev,
#hoLightbox
.ho-next{

  position:absolute;

  width:46px;

  height:46px;

  border:
    1px solid
    rgba(255,255,255,.32);

  border-radius:50%;

  background:
    rgba(255,255,255,.08);

  color:#fff;

  cursor:pointer;

  display:flex;

  align-items:center;

  justify-content:center;

  font-size:27px;

}

#hoLightbox .ho-close{

  top:24px;

  right:26px;

}

#hoLightbox .ho-prev{

  left:24px;

  top:50%;

  transform:
    translateY(-50%);

}

#hoLightbox .ho-next{

  right:24px;

  top:50%;

  transform:
    translateY(-50%);

}


/* TABLET */

@media(max-width:1000px){

  #historiasOroPremium
  .ho-gallery{

    grid-template-columns:
      repeat(3,1fr);

  }

  #historiasOroPremium
  .ho-card{

    height:330px;

  }

}


/* CELULAR */

@media(max-width:600px){

  #historiasOroPremium
  .ho-gallery{

    display:flex;

    overflow-x:auto;

    gap:12px;

    scroll-snap-type:
      x mandatory;

    scrollbar-width:none;

    padding:
      0 18px 8px;

    margin:
      0 -18px;

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

    border-radius:22px;

    scroll-snap-align:center;

  }

  #hoLightbox{

    padding:15px;

  }

  #hoLightboxImage{

    max-width:94vw;

    max-height:78vh;

    border-radius:12px;

  }

  #hoLightbox .ho-prev{

    left:10px;

  }

  #hoLightbox .ho-next{

    right:10px;

  }

  #hoLightbox .ho-close{

    top:15px;

    right:15px;

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
    aria-label="Anterior"
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
    aria-label="Siguiente"
  >
    ›
  </button>

</div>

`;

      antigua.parentNode.insertBefore(
        galeria,
        antigua
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


      fotos.forEach(
        (item,index) => {

          const card =
            document.createElement(
              "article"
            );

          card.className =
            "ho-card";

          card.innerHTML = `

<img
  src="${item.imagen_url}"
  alt="${
    item.title ||
    "Historia de Oro — Baby Golden Perú"
  }"
>

${
  item.title
  ?
  `<div class="ho-label">
    ${item.title}
  </div>`
  :
  ""
}

`;

          card.addEventListener(
            "click",
            () => abrir(index)
          );

          gallery.appendChild(
            card
          );

        }
      );


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


      function cerrar(){

        lightbox.classList.remove(
          "active"
        );

        lightbox.setAttribute(
          "aria-hidden",
          "true"
        );

        document.body.style.overflow =
          "";

      }


      function siguiente(){

        abrir(actual + 1);

      }


      function anterior(){

        abrir(actual - 1);

      }


      lightbox
        .querySelector(".ho-close")
        .onclick = cerrar;

      lightbox
        .querySelector(".ho-next")
        .onclick = siguiente;

      lightbox
        .querySelector(".ho-prev")
        .onclick = anterior;


      lightbox.addEventListener(
        "click",
        e => {

          if(
            e.target === lightbox
          ){

            cerrar();

          }

        }
      );


      document.addEventListener(
        "keydown",
        e => {

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


    } catch(error){

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
