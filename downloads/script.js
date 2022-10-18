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
            const elementLink = document.createElement("a")
            const elementDesc = document.createElement("p")

            elementLink.innerText = data['name']
            elementLink.href = data['href']
            elementDesc.innerText = data['desc']

            elementDiv.appendChild(elementLink)
            elementDiv.appendChild(elementDesc)
            elementDiv.classList.add('entry')
            categorySection.appendChild(elementDiv)
        });

        categorySection.classList.add('category')
        categorySection.classList.add('primary-container')
        wrapper.appendChild(categorySection)
    });
    body.appendChild(wrapper)
})