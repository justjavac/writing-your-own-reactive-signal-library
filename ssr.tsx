/** @jsx h */

import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { h, renderToString } from "./jsx.ts";

function Counter() {
  return <button style="padding: 4px 20px">0</button>;
}

async function handler(req: Request) {
  if (req.url.endsWith(".mjs")) {
    return new Response(await Deno.readTextFile("./signal.mjs"), {
      headers: { "content-type": "text/javascript; charset=utf-8" },
    });
  }

  const page = (
    <body>
      <h1>Writing Your Own Reactive Signal Library</h1>
      <button style="padding: 4px 20px">-</button>
      <script type="module">
        {`
          import { createSignal, createEffect } from "./signal.mjs";
          const button = document.querySelector("button");
          const [count, setCount] = createSignal(0);
          createEffect(() => {
            button.textContent = count();
          });
          button.addEventListener("click", () => {
            setCount(count() + 1);
          });
      `}
      </script>
    </body>
  );
  const html = renderToString(page);
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

serve(handler);
