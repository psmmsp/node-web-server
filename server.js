/*
multiple ways to render data on the page using express
we can also render html.
*/

const express = require('express');

/*
this is another middleware, where we can use hbs and render templates
hbs will help you pass the variables that will be dynamic
*/
const hbs = require('hbs');


const fs = require('fs');

// this was added for host the app on heroku
const port = process.env.PORT || 3000;

var app = express();
// below is how we use partial, this when we have repeating html/hbs then we can make them as files and use them to render in the other html / hbs page, This is inside partials folder. Fox exapmple the footer and header is a partials

// below is how we set the view engine for using hbs
app.set('view engine', 'hbs');

// this is how we add partials using hbs
hbs.registerPartials(__dirname + '/views/partials');


// this is how we add some middle where, this is to use help.html from public folder without having a app.get for help.html we can access the help.html with this URL "http://localhost:3000/help.html"
// this below line is moved to line with STATIC MIDDLEWARE
// app.use(express.static(__dirname + '/public'));

app.use((req,res,next) => {
  var now = new Date().toString();
  // console.log(`${now}: ${req.method} ${req.url}`);
  var log = `${now}: ${req.method}: ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('unable to append file');
    }
  });
  // the only way to continue after this function then we will have to use next() method inside this function
  next();
});

// this got commented so that the application runs completely 
// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'Maintenance page',
//     welcomemessage: 'Checking! Will be back soon'
//   });
//   next();
// });

//** STATIC MIDDLEWARE: this becasue we will not to show the maintenance page when we visit http://localhost:3000/help.html
 app.use(express.static(__dirname + '/public'));

// this is how we create a helper to get the Date using hbs
// this method can be directly called from hbs or html pageTitle
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

// below is a second helper to capotalize text
hbs.registerHelper('screamIt', (screamtext) => {
  return screamtext.toUpperCase();
});


app.get('/', (req, res) => {
  // below is one way to render
  // res.send('<h1>Hello express</h1>');

  // this below is another way to render
  // res.send({
  //   name:"Pradeep",
  //   likes:[
  //     'biking',
  //     'cycling'
  //   ]
  // });

  // below is a way to render using hbs
  res.render('home.hbs', {
    pageTitle: 'home page',
    welcomemessage: 'welcome to my website'
    // below was commented after adding the registerHelper method
    // currentYear: new Date().getFullYear()
  });
});

app.get('/about', (req, res) => {
  // res.send('About page');
  res.render('about.hbs', {
    pageTitle: 'About page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`port running at ${port}`);
});
