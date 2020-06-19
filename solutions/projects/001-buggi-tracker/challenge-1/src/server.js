const ParcelProxyServer = require('parcel-proxy-server');

// configure the proxy server
const server = new ParcelProxyServer({
  entryPoint: '../index.html',
  parcelOptions: {},
  proxies: {
    // add proxies here
    '/api': {
      target: 'http://localhost:4001',
    },
  },
});

// the underlying parcel bundler is exposed on the server
// and can be used if needed
server.bundler.on('buildEnd', () => {
  console.log('Build completed!');
});

// start up the server
server.listen(8080, () => {
  console.log('Parcel proxy server has started');
});
