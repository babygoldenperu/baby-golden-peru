(function(){
"use strict";

function start(){

  const panel = document.getElementById("panelView");
  const sb = window.supabaseClient;

  if(!panel || !sb || panel.classList.contains("hidden")){
    return setTimeout(start,500);
  }

  if(document.getElementById("historiasOroAdmin")) return;

  const modulo = document.createElement("section");

  modulo.id = "historiasOroAdmin";
  modulo.className = "card";

  const HISTORIAS = Array.from(
    {length:12},
    (_,i)=>i+1
  );

  modulo.innerHTML = `
<style>

#historiasOroAdmin{
  margin-top:28px;
}

#historiasOroAdmin .ho-k{
  color:#b78324;
  font-size:11px;
  font-weight:700;
  letter-spacing:2.5px;
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
  margin:8px 0 22px;
}

#historiasOroAdmin .ho-g{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
}

#historiasOroAdmin .ho-i{
  border:1px solid #e7dfd4;
  border-radius:16px;
  padding:14px;
  background:#fffdf9;
}

#historiasOroAdmin .ho-n{
  font-size:10px;
  font-weight:700;
  letter-spacing:1.5px;
  color:#b78324;
  margin-bottom:8px;
}

#historiasOroAdmin .ho-p{
  width:100%;
  aspect-ratio:1;
  border-radius:12px;
  overflow:hidden;
  background:#f1ece4;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:10px;
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

#historiasOroAdmin input[type=file],
#historiasOroAdmin input[type=text],
#historiasOroAdmin textarea{
  width:100%;
  box-sizing:border-box;
  font-size:11px;
}

#historiasOroAdmin input[type=text]{
  margin-top:8px;
  border:1px solid #ded6cb;
  border-radius:9px;
  padding:9px 10px;
}

#historiasOroAdmin textarea{
  margin-top:8px;
  border:1px solid #ded6cb;
  border-radius:9px;
  padding:9px 10px;
  resize:vertical;
  min-height:70px;
  font-family:inherit;
  line-height:1.4;
}

#historiasOroAdmin .ho-a{
  display:flex;
  gap:10px;
  margin-top:20px;
  flex-wrap:wrap;
}

#historiasOroAdmin button{
  border:0;
  border-radius:999px;
  padding:11px 18px;
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
  margin-top:12px;
  padding:10px;
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
    grid-template-columns:repeat(2,1fr);
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
Administra hasta 12 fotografías, títulos y breves descripciones que aparecerán en la web.
</div>

<div class="ho-g">

${HISTORIAS.map(n=>`

<div class="ho-i">

  <div class="ho-n">
    FOTO ${String(n).padStart(2,"0")}
  </div>

  <div class="ho-p" id="hoP${n}">
    <div class="ho-e">
      Sin fotografía
    </div>
  </div>

  <input
    id="hoF${n}"
    type="file"
    accept="image/jpeg,image/png,image/webp"
  >

  <input
    id="hoT${n}"
    type="text"
    maxlength="120"
    placeholder="Título de la historia"
  >

  <textarea
    id="hoD${n}"
    maxlength="1000"
    placeholder="Breve descripción que aparecerá al abrir la foto..."
  ></textarea>

</div>

`).join("")}

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

  panel.appendChild(modulo);


  /* =========================================================
     MENSAJES
  ========================================================= */

  function msg(text,ok){

    const caja =
      document.getElementById("hoMsg");

    if(!caja) return;

    caja.textContent =
      text;

    caja.className =
      "ho-msg " +
      (ok ? "ok" : "err");

  }


  /* =========================================================
     VALIDAR FOTOS
  ========================================================= */

  function validarArchivo(file){

    if(!file) return true;

    if(
      ![
        "image/jpeg",
        "image/png",
        "image/webp"
      ].includes(file.type)
    ){

      msg(
        "La foto debe ser JPG, PNG o WEBP.",
        false
      );

      return false;

    }

    if(
      file.size >
      8 * 1024 * 1024
    ){

      msg(
        "La foto no puede pesar más de 8 MB.",
        false
      );

      return false;

    }

    return true;

  }


  /* =========================================================
     PREVISUALIZACIÓN
  ========================================================= */

  HISTORIAS.forEach(n=>{

    const input =
      document.getElementById("hoF"+n);

    if(!input) return;

    input.addEventListener(
      "change",
      function(){

        const file =
          this.files &&
          this.files[0];

        if(!file) return;

        if(
          !validarArchivo(file)
        ){

          this.value="";

          return;

        }

        const reader =
          new FileReader();

        reader.onload =
          function(e){

            document
              .getElementById("hoP"+n)
              .innerHTML =
              `
              <img
                src="${e.target.result}"
                alt="Vista previa"
              >
              `;

          };

        reader.readAsDataURL(file);

      }
    );

  });


  /* =========================================================
     CARGAR DATOS EXISTENTES
  ========================================================= */

  async function load(){

    try{

      const resultado =
        await sb
          .from("site_gallery")
          .select(
            "slot,title,caption,imagen_url,orden,published"
          )
          .in(
            "slot",
            HISTORIAS.map(
              n=>"historia_"+n
            )
          )
          .order(
            "orden",
            {
              ascending:true
            }
          );

      if(resultado.error)
        throw resultado.error;


      (resultado.data || [])
        .forEach(item=>{

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

          if(
            !numero ||
            numero < 1 ||
            numero > 12
          ){
            return;
          }


          const preview =
            document.getElementById(
              "hoP"+numero
            );

          const titulo =
            document.getElementById(
              "hoT"+numero
            );

          const descripcion =
            document.getElementById(
              "hoD"+numero
            );


          if(
            preview &&
            item.imagen_url
          ){

            preview.innerHTML =
              `
              <img
                src="${item.imagen_url}"
                alt="Historia de Oro"
              >
              `;

          }


          if(titulo){

            titulo.value =
              item.title || "";

          }


          if(descripcion){

            descripcion.value =
              item.caption || "";

          }

        });


    }catch(error){

      console.error(error);

      msg(
        "No se pudieron cargar las Historias de Oro: " +
        (
          error.message ||
          "error"
        ),
        false
      );

    }

  }


  /* =========================================================
     SUBIR FOTO
  ========================================================= */

  async function upload(
    file,
    numero
  ){

    const extension =
      file.name
        .split(".")
        .pop()
        .toLowerCase();


    const path =
      `historias/${Date.now()}-${numero}-${Math.random().toString(36).slice(2)}.${extension}`;


    const resultado =
      await sb.storage
        .from("web-public")
        .upload(
          path,
          file,
          {
            cacheControl:"31536000",
            upsert:false,
            contentType:file.type
          }
        );


    if(resultado.error){

      throw resultado.error;

    }


    return sb.storage
      .from("web-public")
      .getPublicUrl(path)
      .data
      .publicUrl;

  }


  /* =========================================================
     GUARDAR TODO
  ========================================================= */

  async function save(){

    const boton =
      document.getElementById(
        "hoSave"
      );


    boton.disabled =
      true;

    boton.textContent =
      "GUARDANDO...";


    try{

      for(
        const numero of HISTORIAS
      ){

        const archivo =
          document
            .getElementById(
              "hoF"+numero
            )
            .files[0];


        const titulo =
          document
            .getElementById(
              "hoT"+numero
            )
            .value
            .trim();


        const descripcion =
          document
            .getElementById(
              "hoD"+numero
            )
            .value
            .trim();


        let imagenUrl =
          null;


        /* ---------------------------------
           Si seleccionó una nueva foto
        --------------------------------- */

        if(archivo){

          imagenUrl =
            await upload(
              archivo,
              numero
            );

        }


        /* ---------------------------------
           Si no seleccionó foto,
           conservar la existente
        --------------------------------- */

        else{

          const existente =
            await sb
              .from("site_gallery")
              .select(
                "imagen_url"
              )
              .eq(
                "slot",
                "historia_"+numero
              )
              .maybeSingle();


          if(existente.error){

            throw existente.error;

          }


          imagenUrl =
            existente
              .data
              ?.imagen_url ||
            null;

        }


        /*
          Si todavía no existe foto
          y tampoco se seleccionó una nueva,
          no creamos una fila vacía.
        */

        if(!imagenUrl){

          continue;

        }


        /* ---------------------------------
           Guardar en Supabase
        --------------------------------- */

        const guardado =
          await sb
            .from("site_gallery")
            .upsert(

              {

                slot:
                  "historia_"+numero,

                title:
                  titulo || null,

                caption:
                  descripcion || null,

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


        if(guardado.error){

          throw guardado.error;

        }

      }


      /* ---------------------------------
         Limpiar inputs de archivos
      --------------------------------- */

      HISTORIAS
        .forEach(n=>{

          const input =
            document.getElementById(
              "hoF"+n
            );

          if(input){

            input.value="";

          }

        });


      msg(
        "Las 12 Historias de Oro se guardaron correctamente.",
        true
      );


      await load();


    }catch(error){

      console.error(error);

      msg(
        "No se pudieron guardar los cambios: " +
        (
          error.message ||
          "error"
        ),
        false
      );


    }finally{

      boton.disabled =
        false;

      boton.textContent =
        "GUARDAR FOTOS";

    }

  }


  /* =========================================================
     BOTONES
  ========================================================= */

  document
    .getElementById("hoSave")
    .addEventListener(
      "click",
      save
    );


  document
    .getElementById("hoRefresh")
    .addEventListener(
      "click",
      load
    );


  /* =========================================================
     INICIAR
  ========================================================= */

  load();

}

start();

})();
