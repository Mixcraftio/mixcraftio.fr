async function replaceComponents() {
  if (window.self !== window.top && !window.location.pathname.startsWith('/errors/')) return;

  const components = document.querySelectorAll('component');

  await Promise.all([...components].map(async (component) => {
      const [html, script] = await Promise.all([
          fetch(`/components/${component.id}/${component.id}.html`).then(res => res.text()),
          fetch(`/components/${component.id}/${component.id}.js`).catch(() => null)
      ]);

      component.insertAdjacentHTML('beforeend', html);

      if (script) {
          const js_script = document.createElement('script');
          js_script.src = `/components/${component.id}/${component.id}.js`;
          component.appendChild(js_script);
      }
  }));
}

async function addImports() {
  fetch("/static/imports.html")
      .then(res => res.text())
      .then(html => document.head.insertAdjacentHTML('beforeend', html));
}

document.addEventListener("DOMContentLoaded", async () => {
  // Load material components library
  const material = await import("https://esm.run/@material/web/all.js").catch(console.error);

  // Fetch imports.html and insert it
  await addImports();

  // Replace custom components dynamically if not an iframe
  await replaceComponents();
});
