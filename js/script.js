let currentPage = 1;
let pageTotal = 0;

document.querySelector('button').addEventListener('click', async () => {
    currentPage = 1;
    let images = await getImages();
    
    updateUI(images);
    showButtons();
    pageCounter();
});

document.querySelector('input').addEventListener('keyup', async () => {


    if(event.keyCode == 13){
        currentPage = 1;
        let images = await getImages();
    
        updateUI(images);       
        showButtons();
        pageCounter();
    }
});


document.querySelector('a#next').addEventListener('click', async () => {

    currentPage++;

    let images = await getImages();
    
    updateUI(images);
    showButtons();
    pageCounter();
})

document.querySelector('a#previous').addEventListener('click', async () => {

    currentPage--;

    let images = await getImages();
    
    updateUI(images);
    showButtons();
    pageCounter();
})

document.querySelector(`header h1`).addEventListener(`click`, () => {
    refresh();
})

async function getImages(){

    const apiKey = '2af54aca22ccb9c902078adc64b47907';
    let method = 'flickr.photos.search';
    let text = document.querySelector(`input`).value;
    const baseUrl = 'https://api.flickr.com/services/rest';
    let perPage = document.querySelector(`#pictures`).value;
    console.log(perPage);
    let url = `${baseUrl}?api_key=${apiKey}&method=${method}&text=${text}&page=${currentPage}&per_page=${perPage}&sort=relevance&format=json&nojsoncallback=1`;

    if(text == ""){ 
        refresh();
    }

    try {
        
        let resp = await fetch(url);
        let data = await resp.json();
        console.log(data);
        return await data;
        
    }

    catch(err) {
        console.error(err);
    }

}

function imgUrl(img, size){
    let imgSize = 'z';
    if(size == 'thumb') { imgSize = 'q' }
    if(size == 'large') { imgSize = 'b' }

    let url = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_${imgSize}.jpg`

    return url;
}

function updateUI(data){

    let main = document.querySelector('main');
    main.innerHTML = '';
    
    data.photos.photo.forEach(img => {

        if(img.farm !== 0) {

            let el = document.createElement('img');
            el.setAttribute('src', imgUrl(img, 'thumb'));
            el.setAttribute('alt', img.title);
            el.addEventListener(`click`, () => {

                showLightbox(imgUrl(img, 'large'));

            })


            main.appendChild(el);
            
            pageTotal = data.photos.pages;
            return pageTotal;
        }
  
    });
    document.querySelector(`body`).classList.add(`fill`);

}

function showLightbox(url){

    let el = document.querySelector('#overlay figure img');

    el.setAttribute('src', url);

    document.querySelector('#overlay').classList.add('show');
    document.querySelector(`header`).style.display="none";

    document.querySelector(`#overlay`).addEventListener(`click`, () => {
        document.querySelector('#overlay').classList.remove('show');
        document.querySelector(`header`).style.display="flex";
    });

}

function showButtons(){
    if(currentPage == 1){
        document.querySelector(`#previous`).style.visibility=`hidden`;
    }
    else{
        document.querySelector(`#previous`).style.visibility=`visible`;
    }
    if(currentPage == pageTotal){
        document.querySelector(`#next`).style.visibility=`hidden`;
    }
    else{
        document.querySelector(`#next`).style.visibility=`visible`;
    }
}

function pageCounter(){
    document.querySelector(`#counter`).innerHTML = ``;
    document.querySelector(`#counter`).innerHTML = `Page ${currentPage} of ${pageTotal}`;
}

function refresh(){
    document.querySelector(`main`).innerHTML = "";
    document.querySelector(`input`).value="";
    currentPage = 1;
    pageTotal = 1;
    showButtons();
    document.querySelector(`#counter`).innerHTML = ``;
    document.querySelector(`body`).classList.remove(`fill`);
}