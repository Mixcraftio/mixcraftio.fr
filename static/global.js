
function replaceImports() {
    fetch('/static/imports.html')
    .then(res=>res.text())
    .then(html=>document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend',html))
}

function replaceComponents() {
    document.querySelectorAll('component').forEach(component => {
        fetch('/components/'+component.id+'.html')
        .then(res=>res.text())
        .then(html=>component.insertAdjacentHTML('afterbegin',html))
    })
    if (fetch('/components/'+component.id+'.js')) {
        .then(res=>res.text())
        .then(js=>eval(js))
    }
}

function includeLESS() {
    var exists = document.getElementById("LESS-script")
    var script = document.createElement( "script" )
    script.src = "https://cdn.jsdelivr.net/npm/less"
    script.id = "LESS-script"
    if (exists){
        exists.replaceWith(script)
    } else {
        document.getElementsByTagName("head")[0].appendChild(script)
    }
}

replaceImports()
replaceComponents()
includeLESS()
setTimeout(() => {
    includeLESS()
}, 100);
