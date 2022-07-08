import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEls = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const searchQuery = event.target.value.trim();
  if (searchQuery === '') {
    countryListEls.innerHTML = '';
    return;
  }
  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length > 1 && data.length < 10) {
        renderCountries(data);
        return;
      }
      renderCountry(data);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountries(countries) {
  const markup = countries
    .map(country => {
      return `<li class="flex">
            <img height='15px' width='20px' src='${country.flags.svg}' />
          <p>${country.name.official}</p>
        </li>`;
    })
    .join('');
  countryListEls.innerHTML = markup;
}

function renderCountry(country) {
  const markup = country
    .map(country => {
      return `<li>
            <div class="flex"><img height='25px' width='30px' src='${
              country.flags.svg
            }' />
          <h1>${country.name.official}</h1></div>
          <div><p><b>Capital</b>: ${country.capital}</p>
          <p><b>Population</b>: ${country.population}</p>
          <p><b>Languages</b>: ${Object.values(country.languages)}</p></div>
        </li>`;
    })
    .join('');
  countryListEls.innerHTML = markup;
}
