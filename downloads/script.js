fetch('/downloads/downloadlist.json').then(res=>res.json()).then(downloadList=>{

    const body = document.querySelector('body')

    Object.entries(downloadList).forEach(([category, elements]) => {
        const categorySection = document.createElement("section")
        const categoryLink = document.createElement("a")
        categoryLink.href = "#" + category
        categorySection.appendChild(categoryLink)

        Object.entries(elements).forEach(([element, data]) => {
            const elementDiv = document.createElement("div")
            const elementLink = document.createElement("a")
            const elementDesc = document.createElement("p")

            elementDiv.innerText = data['name']
            elementDesc.innerText = data['desc']
            categoryLink.href = "#" + data['href']

            elementDiv.appendChild(elementLink)
            elementDiv.appendChild(elementDesc)
            categorySection.appendChild(elementDiv)
        });

        body.appendChild(categorySection)
    });
})