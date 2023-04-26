import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkup';
import { getImages } from './js/fetchImages';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonOnLoad = document.querySelector('.load-more');
const lastMessage = document.querySelector('.last-message');

let currentPage = 1;
let queryParam = null;

form.addEventListener('submit', onSearchForm);
buttonOnLoad.addEventListener('click', onLoadMore);
galleryEl.addEventListener('click', (evt) => {evt.preventDefault()})

function onLoadMore() {
  currentPage += 1;
  getImages(queryParam, currentPage)
    .then(response => {
      const dataArray = response.data.hits;
      if (currentPage * 40 > response.data.totalHits) {
        buttonOnLoad.classList.add('is-hidden');
        lastMessage.textContent =`Hooray! We found ${response.data.totalHits} images.`;
      }
      galleryEl.insertAdjacentHTML('beforeend', createMarkup(dataArray));
    })
    .catch(error => console.log(error));
}

function onSearchForm(evt) {
  evt.preventDefault();
  queryParam = evt.currentTarget.elements.searchQuery.value;
  galleryEl.innerHTML = '';
  buttonOnLoad.classList.add('is-hidden');

  if (!queryParam) {
    Notify.warning('Please, fill the field');
    return;
  }
  getImages(queryParam)
    .then(response => {
      const dataArray = response.data.hits;
      galleryEl.innerHTML = createMarkup(dataArray);
      if (!dataArray.length) throw new Error('not found');
      if (dataArray.length) Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
        if (dataArray.length >= 40) {
          buttonOnLoad.classList.remove('is-hidden');
        } else {
          lastMessage.textContent =
            `Hooray! We found ${response.data.totalHits} images.`;
        }
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryEl.innerHTML = '';
    });
}

let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {
  const { defaultOptions } = gallery;
  defaultOptions.captionDelay = 250;
});
























// async function getImages(queryParam, page = 1) {
//   const BASE_URL = 'https://pixabay.com/api/';
//   const KEY_API = '35736305-5d79b99fc6e7e7bd6a57f0349';
//   return await axios.get(
//     `${BASE_URL}?key=${KEY_API}&q=${queryParam}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
//   );
// }

// function onLoadMore() {
//   currentPage += 1;
//   getImages(queryParam, currentPage);
// }

// function onSearchForm(evt) {
//   evt.preventDefault();
//   gallery.innerHTML = '';
//   buttonOnLoad.hidden = true;
//   queryParam = evt.currentTarget.elements.searchQuery.value;
//   getImages(queryParam);
// }

// function getImages(queryParam, page = 1) {
//   const BASE_URL = 'https://pixabay.com/api/';
//   const KEY_API = '35736305-5d79b99fc6e7e7bd6a57f0349';
//   axios
//     .get(
//       `${BASE_URL}?key=${KEY_API}&q=${queryParam}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
//     )
//     .then(response => {
//       const dataArray = response.data.hits;
//       gallery.insertAdjacentHTML('beforeend', createMarkup(dataArray));

//       if (dataArray.length) buttonOnLoad.hidden = false;
//     //   if ((page * 40) > response.data.totalHits) {
//     //       buttonOnLoad.hidden = true;
//     //       lastMessage.textContent = 'Hooray! We found totalHits images.';
//     //   }
//     if (!dataArray.length) throw new Error('Not Found');
//     })
//     .catch(error => {
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//       gallery.innerHTML = '';
//     });
// }

// function createMarkup(array) {
//   return array
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `<div class="photo-card">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" width=400 height=300/>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes </b>${likes}
//     </p>
//     <p class="info-item">
//       <b>Views </b>${views}
//     </p>
//     <p class="info-item">
//       <b>Comments </b>${comments}
//     </p>
//     <p class="info-item">
//       <b>Downloads </b>${downloads}
//     </p>
//   </div>
// </div>`;
//       }
//     )
//     .join('');
// }
