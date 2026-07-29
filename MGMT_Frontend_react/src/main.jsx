// //main.jsx
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { LanguageProvider } from './Context/LanguageProvider.jsx';
// import { AuthProvider } from './Context/AuthContext.jsx';
// import { LoaderProvider } from './Context/LoaderContext.jsx';
// import Spinner from './Components/Spinner/Spinner.jsx';
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//       <LoaderProvider>
//     <AuthProvider>
//           <LanguageProvider> 
//           <Spinner />
//     <App />
//     </LanguageProvider>
//     </AuthProvider>
//     </LoaderProvider>
//   </StrictMode>,
// )


// // --- Service Worker registration (frontend-only frontdoor) ---
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/sw.js', { scope: '/' })
//       .then(reg => {
//         console.log('[SW] registered', reg);
//         if (navigator.serviceWorker.controller) {
//           console.log('[SW] controller:', navigator.serviceWorker.controller.state);
//         } else {
//           console.log('[SW] no controller yet (reload once)');
//         }
//       })
//       .catch(err => console.error('[SW] registration failed:', err));
//   });
// }
// // --- End Service Worker registration ---


// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './Context/LanguageProvider.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
import { LoaderProvider } from './Context/LoaderContext.jsx';
import Spinner from './Components/Spinner/Spinner.jsx';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// ✅ add this import
import FrontdoorGate from './FrontdoorLogin.jsx';

// If the app is opened with silent-login credentials in the URL (either as
// ?in_UserId & ?in_password or ?user & ?pass), ensure the router navigates to
// /welcome so `FrontdoorLogin` runs and performs the automatic login. We use
// history.replaceState so this happens without a hard reload.
(() => {
  try {
    const rawSearch = window.location.search || '';
    let qsString = rawSearch;
    // also accept query inside hash (e.g. single-page hash routes)
    if (!qsString && window.location.hash) {
      const i = window.location.hash.indexOf('?');
      if (i >= 0) qsString = window.location.hash.substring(i);
    }
    const usp = new URLSearchParams(qsString.startsWith('?') ? qsString.slice(1) : qsString);
    const hasUser = usp.get('in_UserId') || usp.get('user');
    const hasPass = usp.get('in_password') || usp.get('pass');
    if (hasUser && hasPass && !window.location.pathname.startsWith('/welcome')) {
      const newPath = '/welcome' + (rawSearch || window.location.hash || '');
      // replace the current entry with /welcome so router renders FrontdoorLogin
      window.history.replaceState({}, '', newPath);
      console.log('Redirected to', newPath, 'to perform silent login');
    }
  } catch (e) {
    console.warn('Error while preparing silent login redirect:', e);
  }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoaderProvider>
      <AuthProvider>
        <LanguageProvider>
          <Spinner />
          <App />
        </LanguageProvider>
      </AuthProvider>
    </LoaderProvider>
  </StrictMode>,
)
// // --- Service Worker registration (frontend-only frontdoor) ---
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/sw.js', { scope: '/' })
//       .then(reg => {
//         console.log('[SW] registered', reg);
//         if (navigator.serviceWorker.controller) {
//           console.log('[SW] controller:', navigator.serviceWorker.controller.state);
//         } else {
//           console.log('[SW] no controller yet (reload once)');
//         }
//       })
//       .catch(err => console.error('[SW] registration failed:', err));
//   });
// }
// // --- End Service Worker registration ---
