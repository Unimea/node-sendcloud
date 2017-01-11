const request = require('./request');

function attrToArr(str) {
  switch(toString.call(str)) {
    case '[object String]':
      return [str];
    case '[object Array]':
      return str;
    case '[object Object]':
      return Object.keys(str).map(s => {
        return [str[s]];
      });
    default:
      return [str];
  }
}

module.exports = function (params, options) {
  options = options || {};
  // Check params.
  util.assert(params, ['apiUser', 'apiKey', 'from'], true);

  const send = request({
    url_email: options.url_email,
    url_template_email: options.url_template_email,
  });
  return {
    sendEmail(email, subject, html) {
      if (Array.isArray(email)) {
        email = email.join(';');
      }
      const data = Object.assign({}, params, {
        to      : email,
        from    : params.from,
        subject : subject || params.subject,
        html    : html || params.html || params.plain,
      });
      return send('sendEmail', data).then(data => {
        return data;
      });
    },
    sendByTemplate(email, tmplName, subject, args) {
      const data = Object.assign({}, params, {
        from               : params.from,
        subject            : subject || params.subject,
        templateInvokeName : tmplName || params.templateInvokeName,
        xsmtpapi           : JSON.stringify({
          to  : attrToArr(email),
          sub : attrToArr(args),
        }),
      });
      return send('sendEmailByTemplate', data).then(data => {
        return data;
      });
    }
  };
}
