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
  grid-template-columns:repeat(4,1fr);
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
}

#historiasOroAdmin .ho-e{
  color:#9b9389;
  font-size:11px;
  text-align:center;
}

#historiasOroAdmin input[type=file],
#historiasOroAdmin input[type=text]{
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
Sube hasta 6 Goldens y fotos grupales que aparecerán en la web.
</div>

<div class="ho-g">

${[1,2,3,4,5,6].map(n=>`

<div class="ho-i">

<div class="ho-n">
FOTO 0${n}
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
placeholder="Título opcional"
>

</div>

`).join("")}

</div>

<div class="ho-a">

<button
class="ho-save"
id="hoSave"
>
GUARDAR FOTOS
</button>

<button
class="ho-refresh"
id="hoRefresh"
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

  const mensaje = (texto,ok) => {

    const caja = document.getElementById("hoMsg");

    caja.textContent = texto;

    caja.className =
      "ho-msg " +
      (ok ? "ok" : "err");

  };


  /* VISTA PREVIA */

  [1,2,3,4].forEach(n => {

    document
      .getElementById("hoF"+n)
      .addEventListener("change",function(){

        const archivo = this.files[0];

        if(!archivo) return;

        if(
          ![
            "image/jpeg",
            "image/png",
            "image/webp"
          ].includes(archivo.type)
          ||
          archivo.size > 8 * 1024 * 1024
        ){

          mensaje(
            "La foto debe ser JPG, PNG o WEBP y pesar máximo 8 MB.",
            false
          );

          this.value="";

          return;
        }

        const lector = new FileReader();

        lector.onload = function(e){

          document
            .getElementById("hoP"+n)
            .innerHTML =
            `<img src="${e.target.result}" alt="Vista previa">`;

        };

        lector.readAsDataURL(archivo);

      });

  });


  /* CARGAR FOTOS EXISTENTES */

  async function cargarFotos(){

    const resultado =
      await sb
      .from("site_gallery")
      .select(
        "slot,title,imagen_url"
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
      .order("slot");

    if(resultado.error){

      mensaje(
        resultado.error.message,
        false
      );

      return;
    }

    (resultado.data || []).forEach(item => {

      const numero =
        Number(
          item.slot.replace(
            "historia_",
            ""
          )
        );

      if(!numero) return;

      if(item.imagen_url){

        document
        .getElementById(
          "hoP"+numero
        )
        .innerHTML =
        `<img src="${item.imagen_url}" alt="Historia de Oro">`;

      }

      document
      .getElementById(
        "hoT"+numero
      )
      .value =
      item.title || "";

    });

  }


  /* SUBIR FOTO */

  async function subirFoto(
    archivo,
    numero
  ){

    const extension =
      archivo.name
      .split(".")
      .pop()
      .toLowerCase();

    const nombre =
      `historias/${Date.now()}-${numero}-${Math.random().toString(36).slice(2)}.${extension}`;

    const subida =
      await sb.storage
      .from("web-public")
      .upload(
        nombre,
        archivo,
        {
          cacheControl:"31536000",
          upsert:false,
          contentType:archivo.type
        }
      );

    if(subida.error)
      throw subida.error;

    return sb.storage
      .from("web-public")
      .getPublicUrl(nombre)
      .data
      .publicUrl;

  }


  /* GUARDAR */

  async function guardar(){

    const boton =
      document.getElementById("hoSave");

    boton.disabled=true;

    boton.textContent=
      "GUARDANDO...";

    try{

     for(
  const numero of [1,2,3,4,5,6]
)

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

        let url=null;


        if(archivo){

          url =
            await subirFoto(
              archivo,
              numero
            );

        }else{

          const existente =
            await sb
            .from("site_gallery")
            .select("imagen_url")
            .eq(
              "slot",
              "historia_"+numero
            )
            .maybeSingle();

          if(existente.error)
            throw existente.error;

          url =
            existente.data
            ?.imagen_url || null;

        }


        if(!url) continue;


        const guardado =
          await sb
          .from("site_gallery")
          .upsert({

            slot:
              "historia_"+numero,

            title:
              titulo || null,

            caption:
              titulo || null,

            imagen_url:
              url,

            orden:
              numero,

            activo:
              true,

            published:
              true,

            updated_at:
              new Date().toISOString()

          },{
            onConflict:"slot"
          });


        if(guardado.error)
          throw guardado.error;

      }


      [1,2,3,4,5,6].forEach(n=>{

        document
        .getElementById(
          "hoF"+n
        )
        .value="";

      });


      mensaje(
        "Fotos de Historias de Oro guardadas correctamente.",
        true
      );

      await cargarFotos();


    }catch(error){

      console.error(error);

      mensaje(
        "No se pudieron guardar las fotos: " +
        (error.message || "error"),
        false
      );

    }finally{

      boton.disabled=false;

      boton.textContent=
        "GUARDAR FOTOS";

    }

  }


  document
  .getElementById("hoSave")
  .addEventListener(
    "click",
    guardar
  );


  document
  .getElementById("hoRefresh")
  .addEventListener(
    "click",
    cargarFotos
  );


  cargarFotos();

}

start();

})();
