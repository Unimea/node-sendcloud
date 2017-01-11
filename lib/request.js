const Request = require('superagent');
const CONFIG = require('../config/urls');
const querystring = require('querystring');

module.exports = function(options) {
  const URLS = {
    'sendEmail'            : options.url_email || CONFIG.url_email,
    'sendEmailByTemplate'  : options.url_tmeplate_email || CONFIG.url_tmeplate_email,
    'sendMobileByTemplate' : options.url_template_mobile || CONFIG.url_template_mobile,
  };
  return function (action, data) {
    let send = Request.post(URLS[action]);
    if (['sendMobileByTemplate'].indexOf(action) > -1) {
      send.query(querystring.stringify(data));
    } else {
      send.send(data);
    }
    return new Promise((resolve, reject) => {
      send.end((err, res) => {
        if (err) {
          reject(err);
        } else {
          const body = res.body;
          if (body.statusCode !== 200) {
            const error = new Error(body.message);
            error.status = body.statusCode;
            return reject(error);
          } else {
            return resolve(body);
          }
        }
      });
    });
  }
}
