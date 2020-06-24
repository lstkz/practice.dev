// import * as React from 'react';

// export function useRoute() {
//   const [pathname, setPathname] = React.useState(location.pathname);
//   const onChange = () => {
//     setPathname(location.pathname);
//   };

//   React.useEffect(() => {
//     window.addEventListener('popstate', onChange);
//     return () => {
//       window.removeEventListener('popstate', onChange);
//     };
//   }, []);

//   const push = React.useCallback((newPathname: string) => {
//     console.log('push', newPathname);
//     setPathname(newPathname);
//     history.pushState(null, '', newPathname);
//   }, []);

//   return {
//     pathname,
//     push,
//   };
// }
