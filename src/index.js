import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '38497169-7bd98392067bf2a90cc1b3ff8';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const searchQuery = document.querySelector('[name="searchQuery"]');
const scrollUp = document.querySelector('.scroll-up');
scrollUp.hidden = true;
const debug = document.querySelector('.debug');

const COUNT_IN_PAGE = 40;
let page = 1;
let max_pages = page;

const option = {
  captions: true,
  captionDelay: 250,
  captionSelector: 'img',
  captionPosition: 'bottom',
  captionsData: 'alt',
};

const lightbox = new SimpleLightbox('.gallery a', option);

form.addEventListener('submit', evt => {
  evt.preventDefault();
  removeChildren(gallery);
  page = 1;
  if (searchQuery.value.trim().length == 0) {
    Notiflix.Notify.failure('The search field must be filled.');
    return;
  }
  getImages()
    .then(responce => render(responce.data))
    .catch(error => Notiflix.Notify.failure(`Something went wrong: ${error.code} ${error.message}`));
});

const render = items => {
  max_pages = Math.ceil(items.totalHits / COUNT_IN_PAGE);
  if (items.hits.length == 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  Notiflix.Notify.success(`Hooray! We found ${items.totalHits} images.`);

  if (items.totalHits > 0) {
    const markup = items.hits
      .map(item => {
        return `  <a class="photo-card" href="${item.largeImageURL}">
                    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
                    <div class="info">
                      <p class="info-item">
                        <b>Likes</b>
                        ${item.likes}
                      </p>
                      <p class="info-item">
                        <b>Views</b>
                        ${item.views}
                      </p>
                      <p class="info-item">
                        <b>Comments</b>
                        ${item.comments}
                      </p>
                      <p class="info-item">
                        <b>Downloads</b>
                        ${item.downloads}
                      </p>
                    </div>
                  </a>`;
      })
      .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
  }
};

const removeChildren = container => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

document.addEventListener('scroll', event => {
  // var scrollHeight = Math.max(
  //   document.body.scrollHeight,
  //   document.documentElement.scrollHeight,
  //   document.body.offsetHeight,
  //   document.documentElement.offsetHeight,
  //   document.body.clientHeight,
  //   document.documentElement.clientHeight
  // );
  // var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // debug.textContent = `scrollHeight=${scrollHeight}, scrollTop=${scrollTop}, clientHeight=${document.documentElement.clientHeight}`;
  // if (scrollTop + document.documentElement.clientHeight + 1 >= scrollHeight) {
  //   if (max_pages > page) {
  //     page++;
  //     getImages()
  //       .then(responce => render(responce.data))
  //       .catch(error => Notiflix.Notify.failure(`Something went wrong: ${error.code} ${error.message}`));
  //   } else {
  //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  //   }
  // }

  // if (
  //   Math.ceil(document.documentElement.scrollTop + document.documentElement.clientHeight) >=
  //   Math.floor(document.documentElement.getBoundingClientRect().height)
  // ) {
  //   if (max_pages > page) {
  //     page++;
  //     getImages()
  //       .then(responce => render(responce.data))
  //       .catch(error => Notiflix.Notify.failure(`Something went wrong: ${error.code} ${error.message}`));
  //   } else {
  //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  //   }
  // }

  // if (document.documentElement.clientHeight === Math.floor(document.documentElement.getBoundingClientRect().bottom)) {
  //   if (max_pages > page) {
  //     page++;
  //     getImages()
  //       .then(responce => render(responce.data))
  //       .catch(error => Notiflix.Notify.failure(`Something went wrong: ${error.code} ${error.message}`));
  //   } else {
  //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  //   }
  // }

  // debug.textContent = `scrollTop=${document.documentElement.scrollTop}, clientHeight=${document.documentElement.clientHeight}, scrollHeight=${document.documentElement.scrollHeight}`;

  // debug.textContent = `getBoundingClientRect().bottom=${Math.floor(
  //   document.documentElement.getBoundingClientRect().bottom
  // )}, clientHeight=${document.documentElement.clientHeight}`;

  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;

  if (height - screenHeight - scrolled < 100) {
    if (max_pages > page) {
      page++;
      getImages()
        .then(responce => render(responce.data))
        .catch(error => Notiflix.Notify.failure(`Something went wrong: ${error.code} ${error.message}`));
    } else {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  }

  debug.textContent = `height=${height}, screenHeight=${screenHeight}, scrolled=${scrolled}, scrollTop=${document.documentElement.scrollTop}`;

  if (document.documentElement.clientHeight < document.documentElement.scrollTop) {
    scrollUp.hidden = false;
  } else {
    scrollUp.hidden = true;
  }
});

scrollUp.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

const getImages = async () => {
  const paramsObj = {
    key: API_KEY,
    q: searchQuery.value.trim(),
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: COUNT_IN_PAGE,
    page: page,
  };
  const params = new URLSearchParams(paramsObj);
  return await axios.get(`https://pixabay.com/api/?${params}`);
};
