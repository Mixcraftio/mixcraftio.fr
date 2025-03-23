async function loadMarkdown(file, article, target, marked, renderMathInElement) {
    try {
        const isLocal = target === "local" || file === "welcome.md";
        const baseURL = isLocal ? "/guides/" : "https://download.mixcraftio.mywire.org/public/guides/";

        const response = await fetch(baseURL + file);
        if (!response.ok) throw new Error("Failed to load markdown file");

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

            // Mark the article as rendered
            article.classList.add('katex-rendered');
        }

        const markdownDir = file.substring(0, file.lastIndexOf("/"));
        adjustImagePaths(article, baseURL+markdownDir+"/");
    } catch (error) {
        console.error(error);
        article.innerHTML = "<p>Error loading markdown.</p>";
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


    // Add markdown 
    const article = document.querySelector('article[markdown]'); // Select all articles with the 'data-markdown' attribute
    // Get the file query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const mardownFile = params.get("file") || "welcome.md";
    const target = params.get("target");

    loadMarkdown(mardownFile, article, target, marked, renderMathInElement);
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