/* =========================================================
   BABY GOLDEN PERÚ
   HISTORIAS DE ORO — PANEL DE ADMINISTRACIÓN
   6 FOTOS
========================================================= */

(function () {

  "use strict";


  /* =======================================================
     INICIO
  ======================================================= */

  function start() {

    const panel =
      document.getElementById("panelView");

    const sb =
      window.supabaseClient;


    if (
      !panel ||
      !sb ||
      panel.classList.contains("hidden")
    ) {

      return setTimeout(
        start,
        500
      );

    }


    /* Evitar duplicar el módulo */

    if (
      document.getElementById(
        "historiasOroAdmin"
      )
    ) {

      return;

    }


    crearPanelHistorias(
      panel,
      sb
    );

  }



  /* =======================================================
     CREAR PANEL
  ======================================================= */

  function crearPanelHistorias(
    panel,
    sb
  ) {


    const modulo =
      document.createElement(
        "section"
      );


    modulo.id =
      "historiasOroAdmin";

    modulo.className =
      "card";


    modulo.innerHTML = `

<style>

/* =====================================================
   HISTORIAS DE ORO — ADMIN
===================================================== */

#historiasOroAdmin{
  margin-top:30px;
}

#historiasOroAdmin .ho-k{
  color:#b78324;
  font-size:11px;
  font-weight:700;
  letter-spacing:2.5px;
  margin-bottom:5px;
}

#historiasOroAdmin h2{
  margin:6px 0;
  font-family:Georgia,serif;
  font-weight:500;
  color:#332a22;
}

#historiasOroAdmin .ho-s{
  color:#777;
  font-size:13px;
  margin:8px 0 25px;
}

#historiasOroAdmin .ho-g{
  display:grid;
  grid-template-columns:
    repeat(3,minmax(0,1fr));
  gap:18px;
}

#historiasOroAdmin .ho-i{
  border:1px solid #e7dfd4;
  border-radius:16px;
  padding:15px;
  background:#fffdf9;
}

#historiasOroAdmin .ho-n{
  font-size:10px;
  font-weight:700;
  letter-spacing:1.5px;
  color:#b78324;
  margin-bottom:9px;
}

#historiasOroAdmin .ho-p{
  width:100%;
  aspect-ratio:1;
  border-radius:13px;
  overflow:hidden;
  background:#f1ece4;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:11px;
}

#historiasOroAdmin .ho-p img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

#historiasOroAdmin .ho-e{
  color:#9b9389;
  font-size:11px;
  text-align:center;
}

#historiasOroAdmin input[type=file]{
  width:100%;
  box-sizing:border-box;
  font-size:11px;
  margin-bottom:0;
}

#historiasOroAdmin input[type=text]{
  width:100%;
  box-sizing:border-box;
  margin-top:9px;
  border:1px solid #ded6cb;
  border-radius:9px;
  padding:10px;
  font-size:12px;
}

#historiasOroAdmin .ho-a{
  display:flex;
  gap:10px;
  margin-top:22px;
  flex-wrap:wrap;
}

#historiasOroAdmin button{
  border:0;
  border-radius:999px;
  padding:11px 19px;
  cursor:pointer;
  font-weight:700;
  font-size:11px;
}

#historiasOroAdmin button:disabled{
  opacity:.6;
  cursor:not-allowed;
}

#historiasOroAdmin .ho-save{
  background:#b78324;
  color:#fff;
}

#historiasOroAdmin .ho-refresh{
  background:#eee8df;
  color:#40372f;
}

#historiasOroAdmin .ho-msg{
  display:none;
  margin-top:13px;
  padding:11px;
  border-radius:10px;
  font-size:12px;
}

#historiasOroAdmin .ok{
  display:block;
  background:#edf7ef;
  color:#2d7040;
}

#historiasOroAdmin .err{
  display:block;
  background:#fbecec;
  color:#963d3d;
}

@media(max-width:900px){

  #historiasOroAdmin .ho-g{
    grid-template-columns:
      repeat(2,minmax(0,1fr));
  }

}

@media(max-width:560px){

  #historiasOroAdmin .ho-g{
    grid-template-columns:1fr;
  }

}

</style>


<div class="ho-k">
HISTORIAS DE ORO
</div>


<h2>
Fotos de nuestra familia
</h2>


<div class="ho-s">
Administra las 6 fotografías que aparecerán en la sección Historias de Oro de la web.
</div>


<div class="ho-g">


${[1,2,3,4,5,6].map(function(numero){

  return `

    <div class="ho-i">

      <div class="ho-n">
        FOTO 0${numero}
      </div>

      <div
        class="ho-p"
        id="hoP${numero}"
      >
        <div class="ho-e">
          Sin fotografía
        </div>
      </div>

      <input
        id="hoF${numero}"
        type="file"
        accept="image/jpeg,image/png,image/webp"
      >

      <input
        id="hoT${numero}"
        type="text"
        placeholder="Título opcional"
      >

    </div>

  `;

}).join("")}


</div>


<div class="ho-a">

  <button
    class="ho-save"
    id="hoSave"
    type="button"
  >
    GUARDAR FOTOS
  </button>


  <button
    class="ho-refresh"
    id="hoRefresh"
    type="button"
  >
    ACTUALIZAR
  </button>

</div>


<div
  id="hoMsg"
  class="ho-msg"
></div>

`;


    panel.appendChild(
      modulo
    );



    /* =====================================================
       MENSAJES
    ===================================================== */

    function mensaje(
      texto,
      correcto
    ) {

      const caja =
        document.getElementById(
          "hoMsg"
        );


      if (!caja) return;


      caja.textContent =
        texto;


      caja.className =
        "ho-msg " +
        (
          correcto
            ? "ok"
            : "err"
        );

    }



    /* =====================================================
       VALIDAR FOTO
    ===================================================== */

    function validarArchivo(
      archivo
    ) {

      if (!archivo) {

        return true;

      }


      const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
      ];


      if (
        !formatosPermitidos.includes(
          archivo.type
        )
      ) {

        mensaje(
          "La foto debe ser JPG, PNG o WEBP.",
          false
        );

        return false;

      }


      if (
        archivo.size >
        8 * 1024 * 1024
      ) {

        mensaje(
          "La foto no puede pesar más de 8 MB.",
          false
        );

        return false;

      }


      return true;

    }



    /* =====================================================
       VISTA PREVIA — LAS 6 FOTOS
    ===================================================== */

    [1,2,3,4,5,6].forEach(
      function(numero){

        const input =
          document.getElementById(
            "hoF" + numero
          );


        if (!input) return;


        input.addEventListener(
          "change",
          function(){

            const archivo =
              this.files &&
              this.files[0];


            if (!archivo) return;


            if (
              !validarArchivo(
                archivo
              )
            ) {

              this.value = "";

              return;

            }


            const lector =
              new FileReader();


            lector.onload =
              function(event){

                const contenedor =
                  document.getElementById(
                    "hoP" + numero
                  );


                if (!contenedor) return;


                contenedor.innerHTML = `

                  <img
                    src="${event.target.result}"
                    alt="Vista previa Foto ${numero}"
                  >

                `;

              };


            lector.onerror =
              function(){

                mensaje(
                  "No se pudo leer la imagen.",
                  false
                );

              };


            lector.readAsDataURL(
              archivo
            );

          }
        );

      }
    );



    /* =====================================================
       CARGAR FOTOS EXISTENTES
    ===================================================== */

    async function cargarFotos(){

      try {


        const resultado =
          await sb
            .from("site_gallery")
            .select(
              "slot,title,caption,imagen_url,orden,activo,published"
            )
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
              {
                ascending:true
              }
            );


        if (
          resultado.error
        ) {

          throw resultado.error;

        }


        /* Limpiar primero */

        [1,2,3,4,5,6].forEach(
          function(numero){

            const preview =
              document.getElementById(
                "hoP" + numero
              );

            const titulo =
              document.getElementById(
                "hoT" + numero
              );


            if (preview) {

              preview.innerHTML = `
                <div class="ho-e">
                  Sin fotografía
                </div>
              `;

            }


            if (titulo) {

              titulo.value = "";

            }

          }
        );


        /* Pintar las existentes */

        (resultado.data || [])
          .forEach(
            function(item){

              const numero =
                Number(
                  String(
                    item.slot || ""
                  )
                  .replace(
                    "historia_",
                    ""
                  )
                );


              if (
                !numero ||
                numero < 1 ||
                numero > 6
              ) {

                return;

              }


              const preview =
                document.getElementById(
                  "hoP" + numero
                );


              const titulo =
                document.getElementById(
                  "hoT" + numero
                );


              if (
                preview &&
                item.imagen_url
              ) {

                preview.innerHTML = `

                  <img
                    src="${item.imagen_url}"
                    alt="Historia de Oro ${numero}"
                  >

                `;

              }


              if (titulo) {

                titulo.value =
                  item.title ||
                  item.caption ||
                  "";

              }

            }
          );


      } catch(error){

        console.error(
          "ERROR CARGANDO HISTORIAS:",
          error
        );


        mensaje(
          "No se pudieron cargar las fotos: " +
          (
            error.message ||
            "error desconocido"
          ),
          false
        );

      }

    }



    /* =====================================================
       SUBIR FOTO A SUPABASE STORAGE
    ===================================================== */

    async function subirFoto(
      archivo,
      numero
    ) {


      if (!archivo) {

        return null;

      }


      const extension =
        archivo.name
          .split(".")
          .pop()
          .toLowerCase();


      const nombreArchivo =
        "historias/" +
        Date.now() +
        "-" +
        numero +
        "-" +
        Math.random()
          .toString(36)
          .slice(2) +
        "." +
        extension;


      const subida =
        await sb.storage
          .from("web-public")
          .upload(
            nombreArchivo,
            archivo,
            {
              cacheControl:
                "31536000",

              upsert:false,

              contentType:
                archivo.type
            }
          );


      if (
        subida.error
      ) {

        throw subida.error;

      }


      const publicUrl =
        sb.storage
          .from("web-public")
          .getPublicUrl(
            nombreArchivo
          );


      if (
        !publicUrl ||
        !publicUrl.data ||
        !publicUrl.data.publicUrl
      ) {

        throw new Error(
          "No se pudo obtener la URL pública de la foto."
        );

      }


      return (
        publicUrl
          .data
          .publicUrl
      );

    }



    /* =====================================================
       GUARDAR UNA FOTO
    ===================================================== */

    async function guardarFoto(
      numero
    ) {


      const input =
        document.getElementById(
          "hoF" + numero
        );


      const tituloInput =
        document.getElementById(
          "hoT" + numero
        );


      const archivo =
        input &&
        input.files
          ? input.files[0]
          : null;


      const titulo =
        tituloInput
          ? tituloInput.value.trim()
          : "";


      let imagenUrl = null;


      /* ==========================================
         SI HAY FOTO NUEVA → SUBIRLA
      ========================================== */

      if (archivo) {

        imagenUrl =
          await subirFoto(
            archivo,
            numero
          );

      }


      /* ==========================================
         SI NO HAY FOTO NUEVA → CONSERVAR EXISTENTE
      ========================================== */

      if (!imagenUrl) {

        const existente =
          await sb
            .from("site_gallery")
            .select(
              "imagen_url"
            )
            .eq(
              "slot",
              "historia_" + numero
            )
            .maybeSingle();


        if (
          existente.error
        ) {

          throw existente.error;

        }


        imagenUrl =
          existente.data
            ? existente.data.imagen_url
            : null;

      }


      /* ==========================================
         SI TODAVÍA NO EXISTE FOTO, NO GUARDAR
      ========================================== */

      if (!imagenUrl) {

        return;

      }


      /* ==========================================
         GUARDAR EN SITE_GALLERY
      ========================================== */

      const guardado =
        await sb
          .from("site_gallery")
          .upsert(
            {

              slot:
                "historia_" +
                numero,

              title:
                titulo ||
                null,

              caption:
                titulo ||
                null,

              imagen_url:
                imagenUrl,

              orden:
                numero,

              activo:
                true,

              published:
                true,

              updated_at:
                new Date()
                  .toISOString()

            },
            {
              onConflict:
                "slot"
            }
          );


      if (
        guardado.error
      ) {

        throw guardado.error;

      }

    }



    /* =====================================================
       GUARDAR LAS 6
    ===================================================== */

    async function guardar(){

      const boton =
        document.getElementById(
          "hoSave"
        );


      if (!boton) return;


      boton.disabled =
        true;


      boton.textContent =
        "GUARDANDO...";


      try {


        /*
          Guardamos una por una.
          Las que no tengan foto nueva
          conservan la foto existente.
        */

        for (
          const numero of
          [1,2,3,4,5,6]
        ) {

          await guardarFoto(
            numero
          );

        }


        /*
          Limpiar solamente
          los campos file.
        */

        [1,2,3,4,5,6]
          .forEach(
            function(numero){

              const input =
                document.getElementById(
                  "hoF" + numero
                );


              if (input) {

                input.value =
                  "";

              }

            }
          );


        mensaje(
          "Las 6 Historias de Oro se guardaron correctamente.",
          true
        );


        await cargarFotos();


      } catch(error){


        console.error(
          "ERROR GUARDANDO HISTORIAS:",
          error
        );


        mensaje(
          "No se pudieron guardar las fotos: " +
          (
            error.message ||
            "error desconocido"
          ),
          false
        );


      } finally {


        boton.disabled =
          false;


        boton.textContent =
          "GUARDAR FOTOS";

      }

    }



    /* =====================================================
       BOTONES
    ===================================================== */

    document
      .getElementById(
        "hoSave"
      )
      .addEventListener(
        "click",
        guardar
      );


    document
      .getElementById(
        "hoRefresh"
      )
      .addEventListener(
        "click",
        cargarFotos
      );



    /* =====================================================
       CARGA INICIAL
    ===================================================== */

    cargarFotos();

  }



  /* =======================================================
     ARRANCAR
  ======================================================= */

  start();


})();
