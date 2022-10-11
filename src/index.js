import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
console.log(refs.input);
console.log(refs.list);
console.log(refs.info);

refs.input.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

function handleSearch(event) {
  resetMarkup();

  const counrtyName = event.target.value.trim().toLowerCase();

  if (counrtyName === '') {
    return;
  }

  fetchCountries(counrtyName)
    .then(countries => {
      createMarkup(countries);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      console.log(error);
    });
}

function createMarkup(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (countries.length > 2 && countries.length < 10) {
    const markup = countries
      .map(({ name, flags }) => {
        return /*html*/ `<li class = "countries-item"><img class = "countries-img" src="${flags.svg}" alt="">${name.official}</li>`;
      })
      .join('');

    refs.countryList.innerHTML = markup;
  } else if (countries.length === 1) {
    const markup = countries
      .map(({ name, flags, capital, population, languages }) => {
        return /*html*/ ` <div class="header-info">
      <img class = "header-img" src="${flags.svg}" alt="${
          name.common
        }"><h2 class="header-title">${name.official}</h2></div>
        <ul class="countru-list">
      <li class="countru-item">Capitel: ${capital}</li>
      <li class="countru-item">Population: ${population}</li>
      <li class="countru-item">Languages: ${Object.values(languages)}</li></ul>
    `;
      })
      .join('');
  }
  refs.countryList.innerHTML = markup;
}

function resetMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
