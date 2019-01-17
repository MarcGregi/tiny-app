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
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080
app.use(express.static('public'));
app.use(cookieParser());

app.set("view engine", "ejs");


// user registration database
var userDatabase = {

  "1": {
    id: "1",
    email: "user1@gmail.com",
    password: "purple-monkey-dinosaur"
  },
 "2": {
    id: "2",
    email: "user2@gmail.com",
    password: "dishwasher-funk"
  }
};

// url database
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.post("/urls", (req, res) => {
  let newShorterUrl = generateRandomString();
  urlDatabase[newShorterUrl] = req.body.longURL;
  res.redirect(`urls/${newShorterUrl}`);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});


app.post("/urls/:id/delete", function (req, res) {
  var shorterUrl = req.params.id;
  delete urlDatabase[shorterUrl];
  res.redirect('/urls');
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shorterUrl: req.params.id,
    longerUrl: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.updatelongerUrl;
});

app.post("/login", function(req, res){
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", function(req, res) {
  res.clearCookie("username");
  res.redirect("/urls");
});

// http get for register page
app.get("/register", (req, res) => {
res.render("urls_register");
})


// creating a registration handler
app.post('/register', (req, res) => {

  let newUserID = generateRandomString();
  let newUserEmail = req.body.email;
  let newUserPassword = req.body.password;

  if (newUserID === '' || newUserEmail === '') {
    res.status(400).send("You have not filled in forms correctly");
    return;
  }

  for (let user in userDatabase){
    if (userDatabase[user].email === newUserEmail){
      res.status(400).send("You are already already registered");
      return;
    }
  }

  userDatabase[newUserID] = { id: '' ,
   email: '',
   password: ''};

  userDatabase[newUserID].id = newUserID;
  userDatabase[newUserID].email = newUserEmail;
  userDatabase[newUserID].password = newUserPassword;

  console.log(userDatabase);

  res.cookie('user_id', newUserID);
  res.redirect('/urls');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


