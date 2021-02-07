var path = require('path');
var express = require('express');
let morgan = require('morgan');
const app = express();
const axios = require('axios');
const favicon = require('serve-favicon');

app.use(morgan('dev'));

if (app.get('env') == 'development') {
  console.log("asdf");
  let livereload = require('easy-livereload');
  var file_type_map = {
    ejs: 'html',
    css: 'css'
  };

  var file_type_regex = new RegExp('\\.(' + Object.keys(file_type_map).join('|') + ')$');
  app.use(livereload({     
    watchDirs: [
      path.join(__dirname, 'public/styles/css/cyber'),
      path.join(__dirname, 'public/styles/css/simple-dark'),
      path.join(__dirname, 'views/cyber'),
      path.join(__dirname, 'views/simple-dark'),
      path.join(__dirname, 'public/js/cyber'),
      path.join(__dirname, 'public/js/simple-dark'),
    ],
    checkFunc: function(file) {
      return file_type_regex.test(file);
    },
    renameFunc: function(file) {
      return file.replace(file_type_regex, function(extention) {
        return '.' + file_type_map[extention.slice(1)];
      });
    },
    port : process.env.LIVERELOAD_PORT || 35729,
  }));
}

const mediumURL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@s.kang919'

const themes = {
  "simple-dark": 'simple-dark',
  cyber: 'cyber',
};

const default_theme = 'cyber';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const theme = req.query.theme ? req.query.theme : default_theme;
  let cards;
  axios.get(mediumURL)
    .then((data) => {
      cards = data.data.items;
      res.render(`${themes[theme]}/index`, {cards});
    }).catch((err) => {
      cards = [];
      res.render(`${themes[theme]}/index`, {cards});
    });
});


app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Port ${process.env.PORT || 8000}`);
  }
});