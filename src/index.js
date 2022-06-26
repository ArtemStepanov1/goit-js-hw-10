import './css/styles.css';
import Notiflix from 'notiflix';
import API from './fetchCountries';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const ref = {
  inputEL: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

ref.inputEL.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
	const name = e.target.value.trim();
  if (!name.length) {
    ref.countryList.innerHTML = '';
  }
  if (name.length) {
    API.fetchCountries(name).then(renderListCountry).catch(onFetchError);
  }
}

function renderListCountry(countries) {
  if (countries.length > 10) {
    ref.countryList.innerHTML = '';
    ref.countryInfo.innerHTML = '';
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }

  if (countries.length === 1) {
    const markup = countries
      .map(country => {
        const { flags, name, population, capital, languages } = country;
        return `<div >
				<img width="100"  src="${flags.svg}" alt="${name}">
				<h2>${name.common}</h2>
			</div>
			<div>
				<p class="country-text"><span>Capital:</span> ${capital}</p>
				<p class="country-text"><span>Population:</span> ${population}</p>
				<p class="country-text"><span>Languages:</span> ${Object.values(languages)}
				</p>
			</div>`;
      })
      .join(' ');
    ref.countryList.innerHTML = '';
    return (ref.countryInfo.innerHTML = markup);
  }
  
  const markup = countries
    .map(country => {
      const { flags, name } = country;
      return `<li>
		<img width="50"  src="${flags.svg}" alt="${name}">
		${name.common}
		</li>`;
    })
    .join(' ');
  ref.countryInfo.innerHTML = '';
  ref.countryList.innerHTML = markup;
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  ref.countryList.innerHTML = '';
  ref.countryInfo.innerHTML = '';
}