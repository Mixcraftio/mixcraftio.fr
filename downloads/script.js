fetch('/downloads/downloadlist.json').then(res=>res.json()).then(downloadList=>{

    const body = document.querySelector('body')
    const wrapper = document.createElement("div")
    wrapper.classList.add('wrapper')

    Object.entries(downloadList).forEach(([category, elements]) => {
        const categorySection = document.createElement("section")

        const categoryLink = document.createElement("a")
        categoryLink.innerText = category
        categoryLink.href = "#" + category
        categorySection.appendChild(categoryLink)

        Object.entries(elements).forEach(([element, data]) => {
            const elementDiv = document.createElement("div")
            const elementLabel = document.createElement("label")
            const elementInput = document.createElement("input")

            const elementInfoDiv = document.createElement("div")
            const elementLink = document.createElement("a")
            const elementDesc = document.createElement("p")

            const name = data['name']

            elementInput.type = "checkbox"
            elementInput.id = name
            elementLabel.innerText = name
            elementLabel.htmlFor = name

            elementLink.href = data['href']
            elementLink.innerText = "Download"
            elementDesc.innerText = data['desc']

            elementDiv.appendChild(elementInput)
            elementDiv.appendChild(elementLabel)
            elementInfoDiv.appendChild(elementLink)
            elementInfoDiv.appendChild(elementDesc)
            elementDiv.appendChild(elementInfoDiv)
            
            elementDiv.classList.add('entry')
            categorySection.appendChild(elementDiv)
        });

        categorySection.classList.add('category')
        wrapper.appendChild(categorySection)
    });
    body.appendChild(wrapper)
})