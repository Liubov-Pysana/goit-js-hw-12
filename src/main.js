import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchPhotosByQuery } from './js/pixabay-api.js';
import { createGallery, hideElement, showElement } from './js/render-functions';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const results = document.getElementById('results');
const loadingIndicator = document.getElementById('loading-indicator');
const loadMore = document.getElementById('load-more');
const imagesPerPage = 15;
let currentPage = 1;
let query = '';

const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

function showError(message) {
  iziToast.show({
    message: message,
    position: 'topRight',
    timeout: 2000,
    color: 'red',
  });
}

async function loadImages() {
  showElement(loadingIndicator);
  hideElement(loadMore);

  try {
    const result = await fetchPhotosByQuery(query, currentPage, imagesPerPage);
    console.log(result);
    if (result.total === 0) {
      hideElement(loadingIndicator);
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    results.insertAdjacentHTML('beforeend', createGallery(result.hits));
    lightbox.refresh();

    if (currentPage * imagesPerPage >= result.totalHits) {
      showError("We're sorry, but you've reached the end of search results.");
    } else {
      showElement(loadMore, 'inline-block');
    }
  } catch (error) {
    showError('Sorry, some error occured. Please, try again!');
  }

  hideElement(loadingIndicator);
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  currentPage = 1;
  query = input.value.trim();
  results.innerHTML = '';
  if (query === '') {
    showError('Please, enter the search query!');
    return;
  }
  await loadImages();
});

loadMore.addEventListener('click', async e => {
  currentPage++;
  await loadImages();
  let rect = document.querySelector('#results li').getBoundingClientRect();
  console.log(rect);
  setTimeout(
    () =>
      window.scrollBy({
        top: rect.height * 2,
        left: 0,
        behavior: 'smooth',
      }),
    300
  );
});
