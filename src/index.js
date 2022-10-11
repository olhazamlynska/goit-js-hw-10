import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

function handleSearch(event) {
  resetMarkup();

  const counrtyName = event.target.value.trim().toLowerCase();

  if (counrtyName === '') {
    return;
  }

  fetchCountries(counrtyName)
    .then(countries => createMarkup(countries))
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      console.log(error);
    });
}

function createMarkup(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length > 1) {
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
        <ul class="country-list">
      <li class="country-item">Capitel: <span class="country-value">${capital}</span></li>
      <li class="country-item">Population: <span class="country-value">${population}</span></li>
      <li class="country-item">Languages: <span class="country-value">${Object.values(
        languages
      )}</span></li></ul>
    `;
      })
      .join('');

    refs.countryInfo.innerHTML = markup;
  }
}

function resetMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
