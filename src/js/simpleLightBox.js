import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


let gallery = new SimpleLightbox('.gallery a');

gallery.on('show.simplelightbox', function () {
  // do something…
});



