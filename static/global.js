
function replaceComponents() {
    document.querySelectorAll('component').forEach(component => {
        $(component).load("/components/"+ component.id + "/" + component.id+".html")
        $.getScript("/components/"+ component.id + "/" + component.id+".js")
    })
}


$.ajax({ type: "GET",
    url: "/static/imports.html",
    success : function(text){
        $('head').append(text)
        replaceComponents()
    }
})

window.onload = function(){
    $('head').append('<script src="https://cdn.jsdelivr.net/npm/less"></script>')
    setTimeout(() => {
        less.refreshStyles()
      }, 1000);
}
