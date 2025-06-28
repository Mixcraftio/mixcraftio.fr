async function loadContent(file, target, article, marked, renderMathInElement) {
    try {
        const isLocal = target === "local" || file === "welcome.md";
        const baseURL = isLocal ? "/guides/" : "https://download.mixcraftio.fr/public/guides/";
        
        const response = await fetch(baseURL + file);
        if (!response.ok) throw new Error("Failed to load file");
        const contentType = response.headers.get("Content-Type") || "";

        if (contentType.startsWith("text/") && contentType.includes("markdown")) {
            const markdownText = await response.text();
            const markdownContent = marked.parse(markdownText);
            article.innerHTML = markdownContent;

            if (!article.classList.contains('katex-rendered')) {
                renderMathInElement(article, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "\\[", right: "\\]", display: true },
                        { left: "$", right: "$", display: false },
                        { left: "\\(", right: "\\)", display: false }
                    ]
                });
                article.classList.add('katex-rendered');
            }

            const markdownDir = file.substring(0, file.lastIndexOf("/"));
            adjustImagePaths(article, baseURL+markdownDir+"/");
        } else if (contentType.startsWith("text/")) {
            const text = await response.text();
            article.innerHTML = text;
        } else if (contentType.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = baseURL + file;
            img.alt = file;
            img.style.margin = "0";
            img.style.width = "100%";
            article.innerHTML = "";
            article.appendChild(img);
        } else if (contentType.startsWith("video/")) {
            const video = document.createElement("video");
            video.src = baseURL + file;
            video.controls = true;
            video.style.maxWidth = "100%";
            article.innerHTML = "";
            article.appendChild(video);
        } else if (contentType.startsWith("audio/")) {
            const audio = document.createElement("audio");
            audio.src = baseURL + file;
            audio.controls = true;
            article.innerHTML = "";
            article.appendChild(audio);
        } else {
            article.innerHTML = `<p>Unsupported file type: <code>${contentType}</code></p>`;
        }
    } catch (error) {
        console.error(error);
        article.innerHTML = "<p>Error loading file.</p>";
    }
}

function adjustImagePaths(container, basePath) {
    const images = container.querySelectorAll("img");
    images.forEach(img => {
        const src = img.getAttribute("src");
        if (src && !/^(https?:)?\/\//i.test(src)) {
            img.src = basePath + img.getAttribute("src");
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    // Load js libraries
    const marked = await import("https://cdn.jsdelivr.net/npm/marked@latest/+esm").catch(console.error);
    const katex = await import("https://cdn.jsdelivr.net/npm/katex@latest/+esm").catch(console.error);
    const { default:renderMathInElement } = await import("https://cdn.jsdelivr.net/npm/katex@latest/dist/contrib/auto-render.mjs").catch(console.error);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css';  // The URL of the CSS file
    document.head.appendChild(link);

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    const url = new URL(window.location.href);
    url.hash = "";
    canonical.href = url.toString();
    document.head.appendChild(canonical);

    // Add markdown 
    const article = document.querySelector('article[markdown]'); // Select all articles with the 'data-markdown' attribute
    // Get the file query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const file = params.get("file") || "welcome.md";
    const target = params.get("target");

    // Generate breadcrumb navigation
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb-nav';
    
    // Add 📂 guides ?file=links.md
    const welcomeLink = document.createElement('a');
    welcomeLink.href = "/guides/?file=links.md";
    welcomeLink.textContent = "📂 guides";
    breadcrumb.appendChild(welcomeLink);
    breadcrumb.appendChild(document.createTextNode(" / "));

    // Build the rest
    const parts = file.split('/');
    let pathSoFar = "";
    parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const span = document.createElement(isLast ? 'span' : 'a');

        pathSoFar += part + "/";

        if (!isLast) {
            const Path = pathSoFar + part + ".md";
            const base = "/guides/?file=" + Path.split('/').map(encodeURIComponent).join('/');
            const showTarget = file === "welcome.md" ? "&target=" + target : "";
            span.href = base + showTarget;
        }

        span.textContent = decodeURIComponent(part);
        breadcrumb.appendChild(span);

        if (!isLast) {
            breadcrumb.appendChild(document.createTextNode(" / "));
        }
    });

    article.parentNode.insertBefore(breadcrumb, article);

    loadContent(file, target, article, marked, renderMathInElement);
});


// Iframe
if (window.self !== window.top) {
    let previousHeight = null;

    function sendHeight() {
        const height = document.body.scrollHeight;
        if (height !== previousHeight) {
            window.parent.postMessage({ height }, "*");
            previousHeight = height;
        }
    }

    function setupObserver() {
        const observer = new ResizeObserver(sendHeight);
        observer.observe(document.documentElement);
    }

    document.addEventListener("DOMContentLoaded", setupObserver);
}