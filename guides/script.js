async function loadMarkdown(file, article, target, marked) {
    try {
        const isLocal = target === "local" || file === "welcome.md";
        const baseURL = isLocal ? "/guides/" : "https://download.mixcraftio.mywire.org/public/guides/";

        const response = await fetch(baseURL + file);
        if (!response.ok) throw new Error("Failed to load markdown file");

        const markdownText = await response.text();
        const markdownContent = await marked.parse(markdownText);
        article.innerHTML = markdownContent;

        const markdownDir = file.substring(0, file.lastIndexOf("/"));
        adjustImagePaths(article, baseURL+markdownDir);
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
    // Load markedjs library
    const marked = await import("https://esm.run/marked").catch(console.error);

    // Add markdown 
    const article = document.querySelector('article[markdown]'); // Select all articles with the 'data-markdown' attribute
    // Get the file query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const mardownFile = params.get("file") || "welcome.md";
    const target = params.get("target");

    loadMarkdown(mardownFile, article, target, marked);
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