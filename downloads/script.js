const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

fetch('/downloads/downloadlist.json').then(res=>res.json()).then(downloadList=>{

    const main = document.querySelector('section#main')
    const wrapper = document.createElement('div')
    wrapper.id = "wrapper"

    fetch('/components/download/card.html')
    .then(res=>{
        return res.text()
    }).then(html=>{
        var parser = new DOMParser()
        var cardTemplate = parser.parseFromString(html, 'text/html')


        const catWrapper = document.createElement('md-tabs')
        const mapCat = {
            0:"Emulators",
            1:"Games",
            2:"ISOs",
            3:"Utilities"
        }

        catWrapper.addEventListener('change', (event) => {
            ActiveCat = document.querySelector('.'+mapCat[event.target.activeTabIndex])
            ActiveCat.classList.toggle('active')
            try {
                previousActiveCat.classList.toggle('active')
                previousActiveCat = ActiveCat
            } catch (error) {
                document.querySelector('.Emulators').classList.toggle('active')
                previousActiveCat = ActiveCat
            }
        })

        Object.entries(downloadList).forEach(([category, elements]) => {
            const cat = document.createElement('md-primary-tab')
            cat.setAttribute("inline-icon", "")
            const icon = document.createElement('span')

            const map = {
                "Emulators":"videogame_asset",
                "Games":"games",
                "ISOs":"album",
                "Utilities":"widgets"
            }

            cat.innerHTML += category
            cat.id = category
            icon.className = "material-symbols-outlined"
            icon.slot = "icon"
            icon.innerHTML += map[category]
            cat.appendChild(icon)

            catWrapper.appendChild(cat)

            const listWrapper = document.createElement('md-list')
            listWrapper.className = category
            if (category=="Emulators") {
                listWrapper.className += " active"
            }


            Object.entries(elements).forEach(([element, data]) => {
                const card = cardTemplate.cloneNode(true)

                const name = data['name']
                const item = card.querySelector('md-list-item')
                const divHead = card.querySelector('div[slot="headline"]')
                const divDesc = card.querySelector('div[slot="supporting-text"]')
                const img = card.querySelector('img')

                if (isValidUrl(data['href'])) {
                    item.href = data['href']
                    item.target = "_blank"
                } else {
                    item.href = "https://download.mixcraftio.mywire.org/"+data['href']
                }
                divHead.innerHTML += name
                divDesc.innerHTML += data['desc']
                img.src = data['img']

                listWrapper.appendChild(card.querySelector('md-list-item'))
            })

            wrapper.appendChild(listWrapper)
        })
        wrapper.prepend(catWrapper)


    })

    main.appendChild(wrapper)
})