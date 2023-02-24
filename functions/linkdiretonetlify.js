async function handleRequest(request) {
  let upstream_domain = "w3s.link";
  let upstream_path = "/ipfs/";
  
  let response = null;  
  let url = new URL(request.url);
  let url_host = url.host;
  let url_hostname = url.hostname;
  let method = request.method;
  let request_headers = request.headers;
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
      body: request.body,
      redirect: 'manual'
  });

  let response_headers = original_response.headers;
  let new_response_headers = new Headers(response_headers);
  // used for debugging
  new_response_headers.set('st-cloudflare-hit', 'true');

  let status = original_response.status;

  return new Response(original_response.body, {
      status,
      headers: new_response_headers
  });
}

module.exports = { handleRequest };
