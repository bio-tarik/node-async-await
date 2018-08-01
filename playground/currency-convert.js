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

const convertCurrencyPromise = (from, to, amount) => {
  let convertedAmount;

  return getExchangeRatePromise(from, to)
    .then((rate) => {
      convertedAmount = (amount * rate).toFixed(2);

      return getCountriesPromise(to);
    })
    .then((countries) => {
      console.log(countries);
      return `${amount} ${from} is worth ${convertedAmount} ${to}.
You can spend these in the following countries: ${countries.join(', ')}`;
    });
};

// Using async-await
const getExchangeRate = async (from, to) => {
  try {
    const url = `http://data.fixer.io/api/latest?access_key=${fixerApiKey}`;
    const res = await axios.get(url);

    const euro = 1 / res.data.rates[from];
    const rate = euro * res.data.rates[to];

    if (Number.isNaN(Number(rate))) {
      throw new Error();
    }

    return rate;
  } catch (e) {
    throw new Error(`Unable to get exchange rate for ${from} and ${to}.`);
  }
};

const getCountries = async (currencyCode) => {
  try {
    const url = `http://restcountries.eu/rest/v2/currency/${currencyCode}`;
    const res = await axios.get(url);

    return res.data.map(country => country.name);
  } catch (e) {
    throw new Error(`Unable to get countries that use ${currencyCode}.`);
  }
};

const convertCurrency = async (from, to, amount) => {
  const rate = await getExchangeRate(from, to);
  const countries = await getCountries(to);
  const convertedAmount = (amount * rate).toFixed(2);

  return `${amount} ${from} is worth ${convertedAmount} ${to}.
You can spend these in the following countries: ${countries.join(', ')}`;
};

convertCurrencyPromise('USD', 'CAD', 20).then((msg) => {
  console.log(msg);
});

convertCurrency('USD', 'EUR', 20).then((msg) => {
  console.log(msg);
}).catch(e => console.log(e.message));
