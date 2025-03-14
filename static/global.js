async function replaceComponents() {
  const components = document.querySelectorAll('component');

  await Promise.all([...components].map(async (component) => {
      const [html, script] = await Promise.all([
          fetch(`/components/${component.id}/${component.id}.html`).then(res => res.text()),
          fetch(`/components/${component.id}/${component.id}.js`).catch(() => null) // Handle missing scripts gracefully
      ]);

      component.insertAdjacentHTML('beforeend', html);

      if (script) {
          const js_script = document.createElement('script');
          js_script.src = `/components/${component.id}/${component.id}.js`;
          component.appendChild(js_script);
      }
  }));
}

document.addEventListener("DOMContentLoaded", async () => {
  // Load external material library
  import("https://esm.run/@material/web/all.js").catch(console.error);

  // Fetch imports.html and insert it
  await fetch("/static/imports.html")
      .then(res => res.text())
      .then(html => document.head.insertAdjacentHTML('beforeend', html));

  // Replace custom components dynamically
  await replaceComponents();
});
