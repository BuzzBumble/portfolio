var path = require('path');
let morgan = require('morgan');
var express = require('express');
let fs = require('fs');
const app = express();
const axios = require('axios');
const favicon = require('serve-favicon');
const queries = require('./queries');

if (app.get('env') == 'development') {
  require('dotenv').config();

  let livereload = require('easy-livereload');
  var file_type_map = {
    ejs: 'html',
    css: 'css'
  };

  var file_type_regex = new RegExp('\\.(' + Object.keys(file_type_map).join('|') + ')$');
  app.use(livereload({     
    watchDirs: [
      path.join(__dirname, 'public/styles/css'),
      path.join(__dirname, 'views/pixel'),
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

const pool = require('./db');

app.use(morgan('dev'));

const mediumURL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@s.kang919'

const themes = {
  "simple-dark": 'simple-dark',
  pixel: 'pixel',
};

const default_theme = 'simple-dark';

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

//app.disable("X-Powered-By");
app.get(['/COMP4537/labs/4/writeFile','/COMP4537/labs/4/writeFile/*?'],
  async (req, res) => {
    let text = req.query.text;
    const file = req.params[0] || 'file.txt';
    if (!text) {
      res.status(400).send("<h3>You need to add the 'text' query to the URL.\n" +
      "Example: '/writeFile?text=Hello'</h3>");
      return;
    }
    try {
      fs.writeFileSync(file, text + '\n', {encoding: 'utf8', flag: 'a+'});
    } catch (err) {
      if (err.code == 'ENOENT') {
        res.status(404).send (`${err}\n File ${file} not found.`);
        return;
      }
      res.status(404).send(`${err}\nCould not write to file: ${file}`);
      return;
    }
    res.status(200).send(`Text Written to ${file}: "${text}"`);
  }
);

app.get(['/COMP4537/labs/4/readFile', '/COMP4537/labs/4/readFile/*?'],
  async (req, res) => {
    const file = req.params[0];
    if (!file) {
      res.setHeader('Content-Type', 'text/html')
      res.status(404).send("<h3>This path should be followed by a file name.\n" + 
        "Try <a href=\"/COMP4537/labs/4/readFile/file.txt\">" +
        "/COMP4537/labs/4/readFile/file.txt</a>");
      return;
    }
    let text;
    try {
      text = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
      text = text.split('\n');
      text = text.join('<br/>');
    } catch (err) {
      if (err.code == 'ENOENT') {
        res.status(404).send (`${err}\n File ${file} not found.`);
        return;
      }
      res.status(404).send(`${err}\n File ${file} could not be read.`);
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(text);
  }
);

app.get('/COMP4537/quizapi/questions', (req, res) => {
  pool.query(queries.getQuestions, (err, data) => {
    if (err) {
      throw err;
    }
    res.json(data.rows);
  });
  // Respond with all questions
});

app.post('/COMP4537/quizapi/questions', (req, res) => {
  // Add a question
});

app.put('/COMP4537/quizapi/questions/:id', (req, res) => {
  // Update a question
});


app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Port ${process.env.PORT || 8000}`);
  }
});
