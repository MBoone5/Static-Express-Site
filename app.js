// imports
const express = require('express');
const url = require('url');

// creating the app
const app = express();

// ================= app data ===================
const { projects } = require('./data/data.json');

// ======  templating  =======
app.set('views', './views');
app.set('view engine', 'pug');

// ============ static content ==========
app.use('/static', express.static('public'));

// =============== routes =====================
// index
app.get('/', (req, res) => {
  res.render('index', { projects: projects });
});
// about
app.get('/about', (req, res) => {
  res.render('about');
});
// projects
app.get('/projects/:id', (req, res) => {
  res.locals.project = projects.filter(proj => proj.id === req.params.id)[0];
  res.render('project');
});
// error route
app.get('/error', (req, res) => {
  res.locals.message = req.query.message;
  res.locals.status = req.query.status;
  res.locals.stack = req.query.stack;
  res.render('error');
});

// ========= error handling ==============
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.redirect(url.format({
    pathname: '/error',
    query: {
      'message': err.message,
      'status': err.status,
      'stack': err.stack
    }
  }));
});

// ======= dev server ===============
app.listen(3000, () => console.log('Running locally on port 3000'));