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

async function loadTheme() {
  const html = document.documentElement;
  const favicon = document.getElementById("favicon");

  html.classList.remove("light", "dark");

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    html.classList.add("dark");
    favicon.href = "favicon-dark.ico";
  } else {
    html.classList.add("light");
    favicon.href = "favicon-light.ico";
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  // Load theme
  await loadTheme();
  
  // Load material components library
  const material = await import("https://esm.run/@material/web/all.js").catch(console.error);
  
  // Replace custom components dynamically if not an iframe
  await replaceComponents();
});
