fetch('/downloads/downloadlist.json').then(res=>res.json()).then(downloadList=>{

    Object.entries(downloadList).forEach(([category, elements]) => {
        const categoryDiv = document.createElement("div")
        const categoryLink = document.createElement("a")
        categoryLink.href = "#" + category
        categoryDiv.appendChild(categoryLink)

        Object.entries(elements).forEach(([element, data]) => {
            const elementDiv = document.createElement("div")
            const elementLink = document.createElement("a")
            const elementDesc = document.createElement("p")

            elementDiv.innerText = data['name']
            elementDesc.innerText = data['desc']
            categoryLink.href = "#" + data['href']
            
            categoryDiv.appendChild(categoryLink)
        });
    });
})