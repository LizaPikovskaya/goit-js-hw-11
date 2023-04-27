
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function openImageModal() {
  const galleryItems = document.querySelectorAll('.gallery a');
  const lightbox = new SimpleLightbox(galleryItems);
  lightbox.on('show.simplelightbox', function () {
    const { defaultOptions } = lightbox;
    defaultOptions.captionDelay = 250;
  });
}
export function refreshImageModal() {
  const galleryItems = document.querySelectorAll('.gallery a');
  const lightbox = new SimpleLightbox(galleryItems);
  lightbox.refresh();
}
export function closeImageModal() {
  const lightbox = document.querySelector('.sl-wrapper');
  const backdrop = document.querySelector('.sl-overlay');
  lightbox.classList.remove('sl-open');
  backdrop.classList.remove('sl-show');
}