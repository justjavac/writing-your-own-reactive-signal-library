import { html } from "https://deno.land/x/html@v1.2.0/mod.ts";
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

async function handler(req: Request) {
  if (req.url.endsWith(".mjs")) {
    return new Response(await Deno.readTextFile("./signal.mjs"), {
      headers: { "content-type": "text/javascript; charset=utf-8" },
    });
  }

  const body = html`
    <button style="padding: 4px 20px">-</button>
    <script type="module">
      import { createSignal, createEffect } from "./signal.mjs";
      const button = document.querySelector("button");
      const [count, setCount] = createSignal(0);
      createEffect(() => {
        button.textContent = count();
      });
      button.addEventListener("click", () => {
        setCount(count() + 1);
      });
    </script>
  `;
  return new Response(body, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

serve(handler);
