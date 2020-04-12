const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const jsonxml = require('jsontoxml');
const validator = require('express-joi-validation').createValidator({});

const schema = require('./src/validations/covidInputSchema');
const covid19ImpactEstimator = require('./src/estimator');

const app = express();
const endpoint = '/api/v1/on-covid-19';
const filePath = path.join(__dirname, 'audit.log');
const accessLogStream = fs.createWriteStream(filePath, { flags: 'a' });

app.use(helmet());
app.use(
  morgan(':method :url :status :response-time ms', {
    stream: accessLogStream
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get response in JSON format
app.post(endpoint, validator.body(schema), (req, res) => {
  const json = covid19ImpactEstimator(req.body);
  res.status(200).json(json);
});

// get response in JSON format
app.post(`${endpoint}/json`, validator.body(schema), (req, res) => {
  const json = covid19ImpactEstimator(req.body);
  res.status(200).json(json);
});

// get response in XML format
app.post(`${endpoint}/xml`, validator.body(schema), (req, res) => {
  const json = covid19ImpactEstimator(req.body);

  const xml = `<?xml version="1.0" encoding="UTF-8"?><root>${jsonxml(
    json
  )}</root>`;
  res.header('Content-Type', 'text/xml').status(200).send(xml);
});

// get logs
app.get(`${endpoint}/logs`, (_, res) => {
  fs.readFile(filePath, { encoding: 'utf-8' }, (err, text) => {
    if (!err) {
      res.header('Content-Type', 'text/plain').status(200).send(text);
    } else {
      res.status(500).send('Could not get logs');
    }
  });
});

const listener = app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Your app is listening on port ${listener.address().port}`);
});
