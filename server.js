const express = require('express');
const data = require('./src/data.json');
const objToXml = require('./src/util');
const covid19ImpactEstimator = require('./src/estimator');

const app = express();
const endpoint = '/api/v1/on-covid-19';

app.get(endpoint, (req, res) => {
  const json = covid19ImpactEstimator(data);
  res.json(json);
});

// send response in JSON format
app.get(`${endpoint}/json`, (req, res) => {
  const json = covid19ImpactEstimator(data);
  res.json(json);
});

// send response in XML format
app.get(`${endpoint}/xml`, (req, res) => {
  const json = covid19ImpactEstimator(data);
  const xml = objToXml(json);
  res.set('Content-Type', 'text/xml').send(xml);
});

const listener = app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Your app is listening on port ${listener.address().port}`);
});
