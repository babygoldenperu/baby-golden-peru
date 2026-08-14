/* BABY GOLDEN PERÚ — Historias de Oro
   Conecta las fotos del panel con el carrusel de la web.
   No modifica Baby Golden ID ni Golden Benefits.
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
              "historia_4"
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

      (data || []).forEach(item => {

        const numero =
          Number(
            String(item.slot)
              .replace("historia_", "")
          );

        const imagen =
          document.getElementById(
            "storyPhoto" + numero
          );

        if (!imagen || !item.imagen_url)
          return;

        imagen.src =
          item.imagen_url;

        imagen.alt =
          item.title ||
          "Historia de Oro — Baby Golden Perú";

        const slide =
          imagen.closest(".story-slide");

        const etiqueta =
          slide
            ? slide.querySelector(
                ".story-slide-label"
              )
            : null;

        if (
          etiqueta &&
          item.title
        ) {
          etiqueta.textContent =
            item.title.toUpperCase();
        }

      });

    } catch (error) {

      console.warn(
        "Error cargando Historias de Oro:",
        error
      );

    }

  }

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      cargarHistoriasDeOro
    );

  } else {

    cargarHistoriasDeOro();

  }

})();
