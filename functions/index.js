const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  let upstream_domain = "player.odycdn.com";
  let upstream_path = "/speech/";
  
  let url = new URL(event.path);
  let url_host = url.host;
  let url_hostname = url.hostname;
  let method = event.httpMethod;
  let request_headers = event.headers;
  let new_request_headers = new Headers(request_headers);
  
  url.protocol = 'https:';
  url.host = upstream_domain;

  if (url.pathname == '/') {
      url.pathname = upstream_path;
  } else {
      url.pathname = upstream_path + url.pathname;
  }

  new_request_headers.set('Host', url_host);
  new_request_headers.set('Referer', 'https://' + url_hostname);
  let original_response = await fetch(url.href, {
      method: method,
      headers: new_request_headers,
      body: event.body,
      redirect: 'manual'
  });

  let response_headers = original_response.headers;
  let new_response_headers = new Headers(response_headers);
  // used for debugging
  new_response_headers.set('st-netlify-hit', 'true');

  let status = original_response.status;

  return {
    statusCode: status,
    headers: new_response_headers,
    body: await original_response.buffer(),
  };
};
