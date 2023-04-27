import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkup';
import { getImages } from './js/fetchImages';
import { openImageModal, refreshImageModal, closeModal} from './js/SimpleLightBox';
import scrollBy from './js/smoothScroll';
import { refs } from './js/refs';


let currentPage = 1;
let queryParam = null;

refs.form.addEventListener('submit', onSearchForm);
refs.buttonOnLoad.addEventListener('click', onLoadMore);
refs.galleryEl.addEventListener('click', evt => {
  evt.preventDefault();
});

function onLoadMore() {
  currentPage += 1;
  renderImagesOnLoadMore(queryParam, currentPage);
}

function onSearchForm(evt) {
  evt.preventDefault();
  queryParam = evt.currentTarget.elements.searchQuery.value;
  refs.galleryEl.innerHTML = '';
  refs.buttonOnLoad.classList.add('is-hidden');
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
      refs.buttonOnLoad.classList.add('is-hidden');
      refs.lastMessage.textContent = `Hooray! We found ${response.data.totalHits} images.`;
    }
    refs.galleryEl.insertAdjacentHTML('beforeend', createMarkup(dataArray));
    openImageModal();
    scrollBy();
    refreshImageModal();
  } catch (error) {
    console.log(error);
  }
}



async function renderImagesBySubmit() {
  try {
    const response = await getImages(queryParam);
    const dataArray = response.data.hits;
    refs.galleryEl.innerHTML = createMarkup(dataArray);
    scrollBy()
    if (!dataArray.length) throw new Error('not found');
    if (dataArray.length)
      Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    if (dataArray.length >= 40) {
      refs.buttonOnLoad.classList.remove('is-hidden');
    } else {
      refs.lastMessage.textContent = `Hooray! We found ${response.data.totalHits} images.`;
    }
    openImageModal();
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.galleryEl.innerHTML = '';
  }
}

 const closeButton = document.querySelector('.close-button');
 closeButton.addEventListener('click', () => {
   closeModal();
 });


