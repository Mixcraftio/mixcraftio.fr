function observeIframeHeight(iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const updateHeight = () => {
        iframe.style.height = doc.documentElement.offsetHeight + 'px';
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(doc.documentElement);

    updateHeight();
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("iframe").forEach(iframe => {
        iframe.addEventListener("load", () => {
            observeIframeHeight(iframe);
        });
    });
});
