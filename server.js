const express = require('express');
const next = require('next');
const vhost = require('vhost');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const mainServer = express();
  const adminServer = express();
  const memberServer = express();

  adminServer.get('/', (req, res) => {
    const subdomain = req.vhost[0].split('.')[0]; // 추출된 서브도메인 값
    return app.render(req, res, '/admin', { subdomain });
  });

  adminServer.get('/*', (req, res) => {
    const subdomain = req.vhost[0].split('.')[0]; // 추출된 서브도메인 값
    return app.render(req, res, `/admin${req.path}`, { subdomain });
  });


  adminServer.all('*', (req, res) => {
    return handle(req, res);
  });

  memberServer.get('/', (req, res) => {
    const subdomain = req.vhost[0].split('.')[0]; // 추출된 서브도메인 값
    return app.render(req, res, '/member', { subdomain });
  });

  memberServer.get('/*', (req, res) => {
    const subdomain = req.vhost[0].split('.')[0]; // 추출된 서브도메인 값
    return app.render(req, res, `/member${req.path}`, { subdomain });
  });

  memberServer.all('*', (req, res) => {
    return handle(req, res);
  });

  mainServer.use(vhost('*.lvh.me', (req, res, next) => {
    const subdomain = req.vhost[0].split('.')[0]; // 서브도메인 추출

    if (subdomain === 'admin') {
      return adminServer(req, res, next);
    } else {
      return memberServer(req, res, next);
    }
  }));


  mainServer.listen(port, (err) => {
    if (err) throw err;

    console.log(`> Ready on http://lvh.me:${port}`);
  });
});
