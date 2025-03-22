window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data.height !== "number") return;
    
    const iframe = document.querySelector("iframe");
    if (iframe) {
        iframe.style.height = event.data.height + "px";
    }
});
