
function replaceComponents() {
    document.querySelectorAll('component').forEach(component => {
        fetch("/components/"+ component.id + "/" + component.id+".html")
        .then(res=>{
            return res.text()
        }).then(html=>{
            component.innerHTML += html;
        })

        js_script = document.createElement('script')
        js_script.src = "/components/"+ component.id + "/" + component.id+".js"
        component.appendChild(js_script)
    })
}


js_script = document.createElement('script')
js_script.type = "module"
js_script.src = "https://esm.run/@material/web/all.js"
document.querySelector("head").appendChild(js_script)

fetch("/static/imports.html")
.then(res=>{
    return res.text()
}).then(html=>{
    document.querySelector("head").innerHTML += html
}).then(()=>{
    if(document.readyState === 'ready' || document.readyState === 'complete') {
        replaceComponents();
      } else {
        document.onreadystatechange = function () {
          if (document.readyState == "complete") {
            replaceComponents();
          }
        }
      }
    // replaceComponents()
})