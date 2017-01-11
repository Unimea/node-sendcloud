const request = require('./request');
const util = require('./util');

function getSignature(params, apiKey) {
  let str = Object.keys(params).sort().map(s => {
    return `${s}=${params[s]}`;
  }).join('&');
  str = apiKey + '&' + str + '&' + apiKey;
  return util.md5(str);
}

module.exports = function (params, options) {
  options = options || {};
  // Check params.
  util.assert(params, ['apiUser', 'apiKey', 'templateId'], true);

  const send = request({
    url_template_mobile: options.url_template_mobile,
  });
  return {
    sendByTemplate(mobile, args) {
      if (Array.isArray(mobile)) {
        mobile = mobile.join(',');
      } else {
        mobile += '';
      }
      const opt = {
        'smsUser'    : params.apiUser,
        'templateId' : params.templateId,
        'msgType'    : params.msgType || 0,
        'phone'      : mobile,
        'vars'       : JSON.stringify(args),
      };
      const signature = getSignature(opt, params.apiKey);
      const data = Object.assign({}, opt, {
        signature: signature,
      });
      return send('sendMobileByTemplate', data).then(result => result);
    }
  };
}
