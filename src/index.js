import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '38497169-7bd98392067bf2a90cc1b3ff8';
// axios.defaults.baseURL = 'https://pixabay.com';
axios.defaults.headers.common['key'] = API_KEY;
axios.defaults.headers.common['q'] = 'cat';
axios.defaults.headers.common['image_type'] = 'photo';
axios.defaults.headers.common['orientation'] = 'horizontal';
axios.defaults.headers.common['safesearch'] = true;

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const searchQuery = document.querySelector('[name="searchQuery"]');
const scrollUp = document.querySelector('.scroll-up');
scrollUp.hidden = true;

const COUNT_IN_PAGE = 40;
let page = 1;
let max_pages = page;
let cardRect = 0;

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
  // console.log(searchQuery.value);
  getImage()
    .then(responce => render(responce))
    .catch(error => console.log(error));
});

function getImage() {
  return fetch(
    `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery.value.trim()}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${COUNT_IN_PAGE}&page=${page}`
  ).then(response => {
    // console.log(response);
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

const render = items => {
  console.log(items);
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
                    <img src="${item.previewURL}" alt="${item.tags}" loading="lazy" />
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
  console.log('scroll');

  if (document.documentElement.clientHeight === Math.floor(document.documentElement.getBoundingClientRect().bottom)) {
    if (max_pages > page) {
      page++;
      getImage()
        .then(responce => render(responce))
        .catch(error => console.log(error));
    } else {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  }

  if (document.documentElement.clientHeight < document.documentElement.scrollTop) {
    scrollUp.hidden = false;
  } else {
    scrollUp.hidden = true;
  }
});

scrollUp.addEventListener('click', evt => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// document.addEventListener('scrollend', event => {
//   console.log(`Document scrollend event fired!`);
// });

// const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

// window.scrollBy(0, window.innerHeight);

// fetch(
//   `https://api.thecatapi.com/v1/breeds?key=${API_KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true`
// ).then(response => {
//   console.log(response);
//   if (!response.ok) {
//     throw response;
//   }
//   return response.json();
// });

// const axiosOption = {
//   // mode: 'cors',
//   // withCredentials: true,
//   // withCredentials: false,
//   // method: 'get',
//   // method: 'HEAD',
//   // baseURL: 'https://pixabay.com',
//   // mode: 'no-cors',
//   mode: 'no-cors',
//   // method: 'GET',

//   // mode: 'cors', // same-origin, no-cors
//   // credentials: 'same-origin', // omit, include
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
//     'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
//     // 'Access-Control-Allow-Origin': '*',
//     // 'Content-Type': 'application/json',
//     // 'Access-Control-Allow-Origin': '*',
//     // 'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
//     // 'Content-Type': 'application/json',
//     // 'Access-Control-Allow-Origin': '*',
//     // Accept: 'application/json',
//     // 'Content-Type': 'application/json',
//     // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//     key: API_KEY,
//     q: 'cat',
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//   },
//   // withCredentials: true,
//   // credentials: 'same-origin',
//   // withCredentials: true,
//   // credentials: 'same-origin',
//   // withCredentials: true,
//   // crossdomain: true,
// };

// // const instance = axios.create();
// // axios.options

// axios
//   .get('https://pixabay.com/api', axiosOption)
//   .then(function (response) {
//     // handle success
//     console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   });

// axios
//   .get('https://pixabay.com/api/', { crossdomain: true })
//   .then(function (response) {
//     // handle success
//     console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .finally(function () {
//     // always executed
//   });
