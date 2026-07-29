// // public/sw.js
// self.addEventListener('install', () => self.skipWaiting());
// self.addEventListener('activate', () => self.clients.claim());

// // Intercept POST /frontdoor with form-data (multipart or x-www-form-urlencoded)
// self.addEventListener('fetch', (event) => {
//   const req = event.request;
//   const url = new URL(req.url);

//   if (req.method === 'POST' && url.pathname === '/frontdoor') {
//     event.respondWith(handleFrontdoor(req));
//   }
// });

// async function handleFrontdoor(request) {
//   try {
//     const fd = await request.formData();

//     // Map incoming field names → your existing login payload
//     // Primary (your code): in_UserId, in_password
//     // Aliases (optional): userName/username/USER → in_UserId, password/pass → in_password
//     const in_UserId =
//       fd.get('in_UserId') ??
//       fd.get('userName') ??
//       fd.get('username') ??
//       fd.get('USER') ?? '';

//     const in_password =
//       fd.get('in_password') ??
//       fd.get('password') ??
//       fd.get('pass') ?? '';

//     if (!in_UserId || !in_password) {
//       return new Response('in_UserId and in_password are required', { status: 400 });
//     }

//     // Encode payload into hash (not sent to server logs)
//     const payload = { in_UserId, in_password };
//     const json = encodeURIComponent(JSON.stringify(payload));
//     const b64 = btoa(json);

//     // Redirect to the finisher page that calls your existing login API
//     const redirectUrl = `/silent-form-login.html#b64=${b64}`;
//     return Response.redirect(redirectUrl, 303);
//   } catch {
//     return new Response('Bad form-data', { status: 400 });
//   }
// }
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.pathname !== '/frontdoor') return;

  if (req.method === 'OPTIONS') {
    // CORS preflight
    event.respondWith(corsPreflight(req));
  } else if (req.method === 'POST') {
    event.respondWith(handleFrontdoorPOST(req));
  } else if (req.method === 'GET') {
    event.respondWith(handleFrontdoorGET(url));
  }
});

function corsHeaders(origin) {
  // echo the origin (or use '*') – don’t set allow-credentials if you use '*'
  const o = origin || '*';
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-requested-with',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
}

async function corsPreflight(request) {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

function redirectResponse(location, origin) {
  // 303 + CORS headers so XHR callers don’t get “Network Error”
  return new Response(null, {
    status: 303,
    headers: {
      'Location': location,
      ...corsHeaders(origin),
    },
  });
}

async function handleFrontdoorPOST(request) {
  try {
    const origin = request.headers.get('origin');
    const fd = await request.formData();

    const in_UserId =
      fd.get('in_UserId') ?? fd.get('userName') ?? fd.get('username') ?? fd.get('USER') ?? '';
    const in_password =
      fd.get('in_password') ?? fd.get('password') ?? fd.get('pass') ?? '';

    if (!in_UserId || !in_password) {
      return new Response('in_UserId and in_password are required', {
        status: 400,
        headers: corsHeaders(origin),
      });
    }

    const payload = { in_UserId, in_password };
    const b64 = btoa(encodeURIComponent(JSON.stringify(payload)));
    const redirectUrl = `/silent-form-login.html#b64=${b64}`;
    return redirectResponse(redirectUrl, origin);
  } catch {
    return new Response('Bad form-data', { status: 400, headers: corsHeaders(request.headers.get('origin')) });
  }
}

function handleFrontdoorGET(url) {
  const origin = null; // GET from same origin nav; CORS not needed for the tiny help page
  const in_UserId = url.searchParams.get('in_UserId') || url.searchParams.get('userName') || '';
  const in_password = url.searchParams.get('in_password') || url.searchParams.get('password') || '';
  if (!in_UserId || !in_password) {
    const html = `
      <!doctype html><meta charset="utf-8">
      <title>Frontdoor</title>
      <body style="font-family:system-ui;margin:2rem">
        <h3>Frontdoor</h3>
        <p>Use either:</p>
        <ul>
          <li><code>/frontdoor?in_UserId=USER&in_password=PASS</code> (GET)</li>
          <li>or POST form-data to <code>/frontdoor</code></li>
        </ul>
      </body>`;
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
  }
  const payload = { in_UserId, in_password };
  const b64 = btoa(encodeURIComponent(JSON.stringify(payload)));
  return redirectResponse(`/silent-form-login.html#b64=${b64}`, origin);
}
