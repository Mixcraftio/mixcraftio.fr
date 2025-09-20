
// --------- Helper functions ---------
const isValidUrl = (urlString) => {
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + 
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
        '((\\d{1,3}\\.){3}\\d{1,3}))' + 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$','i'
    ); 
    return !!urlPattern.test(urlString);
};

async function fetchDownloadCardTemplate() {
    const res = await fetch('/components/download/card.html');
    const html = await res.text();
    return new DOMParser().parseFromString(html, 'text/html');
}

async function fetchPublicDownloadList() {
    const res = await fetch('https://download.aztek-web.fr/public/publicDownloadList.json');
    return await res.json();
}

async function fetchPrivateDownloadList() {
    const usernameField = document.querySelector('md-outlined-text-field[name="Username"]');
    const passwordField = document.querySelector('md-outlined-text-field[name="Password"]');
    
    // Retrieve credentials from form (username and password)
    const username = usernameField.value;
    const password = passwordField.value;

    // Encode credentials into base64 format
    const credentials = btoa(username + ":" + password);

    // Set up the request headers with Basic Auth
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + credentials);

    // Fetch with credentials
    try {
        const response = await fetch('https://download.aztek-web.fr/privateDownloadList.json', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        });
        return await response.json();
    } catch (error) {
        usernameField.setAttribute('error', '');
        passwordField.setAttribute('error', '');
        throw error
    }
}

async function showForm() {
    document.querySelector('#credForm').style.display = "flex";
    document.querySelector('#credFormBackground').style.display = "block";
}
async function hideForm() {
    document.querySelector('#credForm').style.display = "none";
    document.querySelector('#credFormBackground').style.display = "none";
}
// ------------------------------------


async function createCategoryWrapper() {
    const catWrapper = document.createElement('md-tabs');

    // Add event listener for tab switching
    catWrapper.addEventListener('change', (event) => {
        const previousActiveTab = document.querySelector('md-list.active');
        previousActiveTab.classList.remove('active');
        const newActiveTab = document.querySelector(`.${catWrapper.activeTab.id}`);
        newActiveTab.classList.add('active')
    });

    return catWrapper;
}

async function populateCategoryTabs(downloadList, catWrapper) {
    // Category icon mapping
    const iconMap = {
        "Emulators": "videogame_asset",
        "Games": "games",
        "ISOs": "album",
        "Utilities": "widgets"
    };
    
    // Create and append tabs dynamically for each category
    Object.keys(downloadList).forEach(category => {
        if (!catWrapper.querySelector(`md-primary-tab#${category}`)) {
            const cat = document.createElement('md-primary-tab');
            cat.setAttribute("inline-icon", "");
            cat.innerHTML = category;
            cat.id = category;

            const icon = document.createElement('span');
            icon.className = "material-symbols-outlined";
            icon.slot = "icon";
            icon.innerHTML = iconMap[category] || "category"; // Default icon fallback
            cat.appendChild(icon);

            catWrapper.appendChild(cat);
        }
    });
}

async function createDownloadCards(downloadList, cardDOM, wrapper) {
    Object.entries(downloadList).forEach(([category, elements]) => {
        let listWrapper;
        if (!wrapper.querySelector(`md-list.${category}`)) {
            // Create category list
            listWrapper = document.createElement('md-list');
            listWrapper.classList.add(category);
            if (category === "ISOs") listWrapper.classList.add("active");
            wrapper.appendChild(listWrapper);
        } else {
            listWrapper = wrapper.querySelector(`md-list.${category}`);
        }

        // Populate cards within each category
        Object.entries(elements).forEach(([element, data]) => {
            const card = cardDOM.cloneNode(true);
            const item = card.querySelector('md-list-item');
            const divHead = card.querySelector('div[slot="headline"]');
            const divDesc = card.querySelector('div[slot="supporting-text"]');
            const img = card.querySelector('img');
            const divVersion = card.querySelector('div[slot="trailing-supporting-text"]');

            // Set download link
            item.href = isValidUrl(data.href) ? data.href : `https://download.aztek-web.fr/${data.href}`;
            item.target = "_blank";

            // Set card details
            divHead.innerHTML = data.name;
            divDesc.innerHTML = data.desc;
            img.src = `https://download.aztek-web.fr/public/${data.img}`;
            divVersion.innerHTML = data.version;

            // Append card to category list
            listWrapper.appendChild(item);
        });
    });
}

async function loadDownloads() {
    const main = document.querySelector('section#main');

    const wrapper = document.createElement('div');
    wrapper.id = "wrapper";

    // Fetch download list
    const publicDownloadList = await fetchPublicDownloadList();

    // Load category tabs
    const catWrapper = await createCategoryWrapper();
    await populateCategoryTabs(publicDownloadList, catWrapper);
    wrapper.prepend(catWrapper);

    // Fetch the card template
    const cardDOM = await fetchDownloadCardTemplate();

    // Create and append download cards for each category
    await createDownloadCards(publicDownloadList, cardDOM, wrapper);

    main.appendChild(wrapper);
}

async function addPrivateDownloads() {
    // Fetch download list
    try {
        const privateDownloadList = await fetchPrivateDownloadList();

        // Load category tabs
        const catWrapper = document.querySelector('md-tabs');
        await populateCategoryTabs(privateDownloadList, catWrapper);

        // Fetch the card template
        const cardDOM = await fetchDownloadCardTemplate();

        // Create and append download cards for each category
        await createDownloadCards(privateDownloadList, cardDOM, wrapper);

        // Delete FAB and Form
        document.querySelector('#showFormButton').remove()
        document.querySelector('#credFormBackground').remove()
        document.querySelector('#credForm').remove()
    } catch (error) {}
}

// Start download list loading
document.addEventListener("DOMContentLoaded", () => {
    loadDownloads();
});
