const fs = require('fs');
const axios = require('axios');

const fixerApiKey = fs.readFileSync(`${__dirname}/../apiKey.config`);

if (fixerApiKey === 'API_KEY') {
  throw new Error('You need to configure the fixer API key. Head over to the README file to get to know what that means.');
}

// Using promises
const getExchangeRatePromise = (from, to) => {
  const url = `http://data.fixer.io/api/latest?access_key=${fixerApiKey}`;
  return axios.get(url)
    .then((res) => {
      const euro = 1 / res.data.rates[from];
      const rate = euro * res.data.rates[to];

      return rate;
    });
};

const getCountriesPromise = (currencyCode) => {
  const url = `http://restcountries.eu/rest/v2/currency/${currencyCode}`;
  return axios.get(url)
    .then(res => res.data.map(country => country.name));
};

// Using async-await
const getExchangeRate = async (from, to) => {
  const url = `http://data.fixer.io/api/latest?access_key=${fixerApiKey}`;
  const res = await axios.get(url);

  const euro = 1 / res.data.rates[from];
  const rate = euro * res.data.rates[to];

  return rate;
};

const getCountries = async (currencyCode) => {
  const url = `http://restcountries.eu/rest/v2/currency/${currencyCode}`;
  const res = await axios.get(url);

  return res.data.map(country => country.name);
};

getExchangeRatePromise('USD', 'CAD').then((rate) => {
  console.log(rate);
});

getExchangeRate('USD', 'CAD').then((rate) => {
  console.log(rate);
});

getCountriesPromise('EUR').then((countries) => {
  console.log(countries);
});

getCountries('EUR').then((countries) => {
  console.log(countries);
});
