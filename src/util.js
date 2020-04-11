const toXml = (obj) => {
  let xml = '';
  Object.keys(obj).forEach((k) => {
    xml += `<${k}>`;
    if (typeof obj[k] === 'object') {
      xml += toXml(obj[k]);
    } else {
      xml += obj[k];
    }
    xml += `</${k}>`;
  });
  return xml.replace(/<\/?[0-9]{1,}>/g, '');
};
const objToXml = (obj) => `<root>${toXml(obj)}</root>`;

module.exports = objToXml;
