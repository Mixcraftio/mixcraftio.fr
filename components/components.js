
function replaceComponents() {
    document.querySelectorAll('component').forEach(component => {
        fetch('/components/'+component.id+'.html')
        .then(res=>res.text())
        .then(html=>component.insertAdjacentHTML('afterbegin',html))
    })
}

function includeLESS() {
    var script = document.createElement( "script" )
    script.src = "https://cdn.jsdelivr.net/npm/less"
    document.getElementsByTagName("head")[0].appendChild(script)
}

replaceComponents()
includeLESS()
