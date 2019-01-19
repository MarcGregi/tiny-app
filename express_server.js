// function to generate random 6 digit short url
function generateRandomString() {
let totalCharcters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
let newString = '';

  for (let i = 0; i <= 6; i ++){
    newString += totalCharcters[Math.floor(Math.random() * totalCharcters.length)];
  }
    return (newString);
}

generateRandomString();


const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
const PORT = 3001; // default port 8080
const bcrypt = require('bcrypt');
app.use(cookieParser());

app.set("view engine", "ejs");

// (core function that returns specific user id short urls)
function forUsersOnlyUrl (id) {
  var SearchUrlDatabase = {};
    for (let newShorterUrl in urlDatabase) {
      if (urlDatabase[newShorterUrl].id === id) {
        SearchUrlDatabase = urlDatabase[newShorterUrl];
      }
    }
          return SearchUrlDatabase;
};

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));


// (user registration database)
var userDatabase = {

  "1": {
    id: "1",
    email: "user1@gmail.com",
    password: "$2b$10$wG9gE7JCt0YtsXhWpR7.HOewJV1Klo.HQynq7P8r.CaE0QMPNqeya"
  },
 "2": {
    id: "2",
    email: "user2@gmail.com",
    password: "$2b$10$wG9gE7JCt0YtsXhWpR7.HOewJV1Klo.HQynq7P8r.CaE0QMPNqeya"
  }
};

// (url database)
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls/new", (req, res) => {

   // (if no user is detected - redirect to register page)
   if (req.session.user_id === undefined){
    res.redirect('/register');
      return;
  }

  let templateVars = { username: req.session["user_id"]};
  res.render("urls_new", templateVars);

});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// (functionality that creates a new small link for the long link.)
app.post("/urls", (req, res) => {


  let newShorterUrl = generateRandomString();
  urlDatabase[newShorterUrl] = req.body.longURL;
  res.redirect(`urls/${newShorterUrl}`);

});

app.get("/urls", (req, res) => {

   // (if no user is detected - redirect to register page)
   if (req.session.user_id === undefined){
    res.redirect('/register');
      return;
  }

  user = userDatabase[req.cookies.user_id]

  let templateVars = { urls: forUsersOnlyUrl(req.cookies.user_id), user: user  };
  res.render("urls_index", templateVars);
});

app.get("/u/:shorterUrl", (req, res) => {

    // (if no user is detected - redirect to register page)
    if (req.cookies.user_id === undefined){
    res.redirect('/register');
      return;
  }

  let longerUrl = urlDatabase[request.params.shorterUrl];
  res.redirect(longerUrl);
});

app.post("/urls/:id/delete", function (req, res) {
  var shorterUrl = req.params.id;
  delete urlDatabase[shorterUrl];
  res.redirect('/urls');
});

app.get("/", (req, res) => {

  // (We want to direct new web visitors to the register page if no cookie id is detected)
   if(req.session.user_id === undefined){
      res.redirect('/register');
  } else {
      res.redirect('/urls');
  }

});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {

    if(req.session.user_id === undefined){
      res.redirect('/register');
  } else {
      res.redirect('/urls');
  }

  let templateVars = {
    shorterUrl: req.params.id,
    longerUrl: urlDatabase[req.params.id],
    user: req.session["user_id"]
  };
      res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.updatelongerUrl;
});

// (GET request for the login page)
app.get('/login', (req, res) => {

  let templateVars = {
    urls: urlDatabase,
    user: userDatabase[req.cookies.user_id]
    };
  res.render('urls_login', templateVars);
});

// (Login page functionality. Checking user email & password against the database).
app.post('/login', function(req, res) {


for (let user in userDatabase){
    if (userDatabase[user].email === req.body.email) {
      if (bcrypt.compareSync(req.body.password, userDatabase[user].NewHashedUserPassword)) {
        req.session('user_id', userDatabase[user].id);
        res.redirect('/urls');
        return;

      }
    }
  }
           return (res.status(403).send("Incorrect User."));
});

// (Logout clearing cookie data)
app.post("/logout", function(req, res) {
  req.clearCookie("user_id");
  res.redirect("/urls");
});


app.get('/register', (req, res) => {

  let templateVars = {
    urls: urlDatabase,
    user: userDatabase[req.cookies.user_id]
    };

res.render('urls_register', templateVars);
});

// (Register page functionality. Creating new users email & password in the database).
app.post('/register', (req, res) => {


  let newUserID = generateRandomString();
  let newUserEmail = req.body.email;
  let NewHashedUserPassword = bcrypt.hashSync(req.body.password, 10);



  if (newUserEmail === null || NewHashedUserPassword === null) {
    res.status(400).send("You have not filled in forms correctly");
      return;
  }

  for (let user in userDatabase){
    if (userDatabase[user].email === newUserEmail){
      res.status(400).send("You are already registered");
        return;
    }
  }

    userDatabase[newUserID] = {
      id: '' ,
      email: '',
      password: ''};

  userDatabase[newUserID].id = newUserID;

  userDatabase[newUserID].email = newUserEmail;

  userDatabase[newUserID].password = NewHashedUserPassword

  console.log("This should be the new hashed password ", NewHashedUserPassword);
  req.session.user_id = newUserID;
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


