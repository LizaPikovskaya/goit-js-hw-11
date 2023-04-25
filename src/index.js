import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkup';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const buttonOnLoad = document.querySelector('.load-more');
const lastMessage = document.querySelector('.end-message');
let currentPage = 1;
let queryParam = null;

form.addEventListener('submit', onSearchForm);
buttonOnLoad.addEventListener('click', onLoadMore);

function onLoadMore() {
  currentPage += 1;
  getImages(queryParam, currentPage);
}

function onSearchForm(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  buttonOnLoad.hidden = true;
  queryParam = evt.currentTarget.elements.searchQuery.value;

  getImages(queryParam)
    .then(response => {
      const dataArray = response.data.hits;
      gallery.innerHTML = createMarkup(dataArray);
      if (dataArray.length) buttonOnLoad.hidden = false;
      if (!dataArray.length) throw new Error('not found');
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
    });
}

async function getImages(queryParam, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY_API = '35736305-5d79b99fc6e7e7bd6a57f0349';
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY_API}&q=${queryParam}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

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
