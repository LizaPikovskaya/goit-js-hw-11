import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkup';
import { getImages } from './js/fetchImages';
import {
  openImageModal,
  refreshImageModal,
  closeModal,
} from './js/simpleLightBox';
import scrollBy from './js/smoothScroll';

const form = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonOnLoad = document.querySelector('.load-more');
const lastMessage = document.querySelector('.last-message');
const closeButton = document.querySelector('.close-button');


let currentPage = 1;
let queryParam = null;

form.addEventListener('submit', onSearchForm);
buttonOnLoad.addEventListener('click', onLoadMore);
galleryEl.addEventListener('click', evt => {
  evt.preventDefault();
});
closeButton.addEventListener('click', () => {
  closeModal();
});

function onLoadMore() {
  currentPage += 1;
  renderImagesOnLoadMore(queryParam, currentPage);
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
  renderImagesBySubmit(queryParam);
}

async function renderImagesOnLoadMore() {
  try {
    const response = await getImages(queryParam, currentPage);
    const dataArray = response.data.hits;
    if (currentPage * 40 > response.data.totalHits) {
      buttonOnLoad.classList.add('is-hidden');
      lastMessage.textContent = `Hooray! We found ${response.data.totalHits} images.`;
    }
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(dataArray));
        scrollBy();

    const newGalleryItems = galleryEl.querySelectorAll('.gallery a');
    newGalleryItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        lightbox.open(item.href);
      });
    });
    refreshImageModal();
  } catch (error) {
    console.log(error);
  }
}


async function renderImagesBySubmit() {
  try {
    const response = await getImages(queryParam);
    const dataArray = response.data.hits;
    galleryEl.innerHTML = createMarkup(dataArray);
    if (!dataArray.length) throw new Error('not found');
    if (dataArray.length)
      Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    if (dataArray.length >= 40) {
      buttonOnLoad.classList.remove('is-hidden');
    } else {
      lastMessage.textContent = `Hooray! We found ${response.data.totalHits} images.`;
    }
    openImageModal();
        scrollBy();

  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    galleryEl.innerHTML = '';
  }
}

