fetch('/downloads/downloadlist.json').then(res=>res.json()).then(downloadList=>{

    const body = document.querySelector('body')
    const wrapper = document.createElement("div")
    wrapper.classList.add('wrapper')

    Object.entries(downloadList).forEach(([category, elements]) => {
        const categorySection = document.createElement("section")

        const categoryInput = document.createElement("input")
        const categoryLabel = document.createElement("label")
        const categoryWrapper = document.createElement("div")
        categoryWrapper.classList.add("elwrapper")
        categoryInput.type = "checkbox"
        categoryInput.id = category
        categoryLabel.innerText = category
        categoryLabel.htmlFor = category
        categorySection.appendChild(categoryInput)
        categorySection.appendChild(categoryLabel)
        categorySection.appendChild(categoryWrapper)

        Object.entries(elements).forEach(([element, data]) => {
            const elementDiv = document.createElement("div")
            const elementInput = document.createElement("input")
            const elementImg = document.createElement("img")
            const elementLabel = document.createElement("label")

            const elementInfoDiv = document.createElement("div")
            const elementLink = document.createElement("a")
            // const elementDesc = document.createElement("p")

            const name = data['name']

            elementInput.type = "checkbox"
            elementInput.id = name
            elementImg.src = data['img']
            elementLabel.appendChild(elementImg)
            elementLabel.innerText = name
            elementLabel.htmlFor = name

            elementLink.href = data['href']
            elementLink.target = "_blank"
            elementLink.innerText = "Download"
            // elementDesc.innerText = data['desc']

            elementDiv.appendChild(elementInput)
            // elementDiv.appendChild(elementImg)
            elementDiv.appendChild(elementLabel)
            // elementInfoDiv.appendChild(elementDesc)
            elementInfoDiv.appendChild(elementLink)
            // elementDiv.appendChild(elementLink)
            elementDiv.appendChild(elementInfoDiv)

            elementDiv.classList.add('entry')
            categoryWrapper.appendChild(elementDiv)
        });

        categorySection.classList.add('category')
        wrapper.appendChild(categorySection)
    });
    body.appendChild(wrapper)
})