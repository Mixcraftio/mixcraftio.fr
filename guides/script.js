async function loadMarkdown(file, article, marked) {
    try {
        const response = await fetch("/guides/" + file);
        if (!response.ok) throw new Error("Failed to load markdown file");

        const markdownText = await response.text();
        const markdownContent = marked.parse(markdownText);
        article.innerHTML = markdownContent;
    } catch (error) {
        console.error(error);
        article.innerHTML = "<p>Error loading markdown.</p>";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Load markedjs library
    const marked = await import("https://esm.run/marked").catch(console.error);

    // Add markdown 
    const article = document.querySelector('article[markdown]'); // Select all articles with the 'data-markdown' attribute
    // Get the file query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const mardownFile = params.get("file");
    if (mardownFile) {
        loadMarkdown(mardownFile, article, marked);
    } else {
        loadMarkdown("welcome.md", article, marked);
    }
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