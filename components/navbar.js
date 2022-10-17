var urlpath = window.location.pathname
var activetabset = setInterval(() => {
var activetab = document.querySelector("[href='/"+urlpath.split("/")[1]+"']")
    if (activetab) {
        activetab.classList.add("active")
        clearInterval(activetabset)
    }
}, 100);