/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
const DASHBOT_API_KEY = process.env.DASHBOT_API_KEY;
const dashbot = require('dashbot')(DASHBOT_API_KEY).facebook;
const env = require('../env'),
      request = require('request');

function call (path, payload, callback) {
  const access_token = process.env.PAGE_ACCESS_TOKEN || env.PAGE_ACCESS_TOKEN;
  const graph_url = 'https://graph.facebook.com/me';

  if (!path) {
    console.error('No endpoint specified on Messenger send!');
    return;
  } else if (!access_token || !graph_url) {
    console.error('No Page access token or graph API url configured!');
    return;
  }

  const requestData = {
    uri: graph_url + path,
    qs: {'access_token': access_token},
    method: 'POST',
    json: payload,
  }
  request(requestData, (error, response, body) => {
    console.log(body)
    if (!error && response.statusCode === 200) {
      dashbot.logOutgoing(requestData, body)
      console.log('Message sent succesfully');
    } else {
      console.error('Error: ' + error);        
    }
    callback(body);
  });
};

module.exports = {
  call
};