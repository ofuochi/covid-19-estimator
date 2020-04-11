const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const data = require('./src/data.json');
const objToXml = require('./src/util');
const covid19ImpactEstimator = require('./src/estimator');

const app = express();
const endpoint = '/api/v1/on-covid-19';
const filePath = path.join(__dirname, 'audit.log');
const accessLogStream = fs.createWriteStream(filePath, { flags: 'a' });

app.use(
  morgan(':method :url :status :response-time ms', {
    stream: accessLogStream
  })
);
app.get(endpoint, (req, res) => {
  const json = covid19ImpactEstimator(data);
  res.json(json);
});

// get response in JSON format
app.get(`${endpoint}/json`, (req, res) => {
  const json = covid19ImpactEstimator(data);
  res.status(200).json(json);
});

// get response in XML format
app.get(`${endpoint}/xml`, (req, res) => {
  const json = covid19ImpactEstimator(data);
  const xml = objToXml(json);
  res.header('Content-Type', 'text/xml').status(200).send(xml);
});

// get logs
app.get(`${endpoint}/logs`, (req, res) => {
  fs.readFile(filePath, { encoding: 'utf-8' }, (err, text) => {
    if (!err) {
      res.header('Content-Type', 'text/plain').status(200).send(text);
    } else {
      res.status(500).send('Could not get logs');
    }
  });
});

const listener = app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log(`Your app is listening on port ${listener.address().port}`);
});
