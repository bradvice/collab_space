const express = require("express");
const sha256 = require('js-sha256');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(helmet());

const { Deta } = require('deta');
const deta = Deta(process.env.DETA_API_KEY);
const db = deta.Base('authBase');

const port = 3000;
const site = `http://localhost:${port}`;

app.use(express.urlencoded({ extended: true}));
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SIGNATURE)) // FIXME: Make Cookie Signature env variable bit more secure lol

app.use(express.static("public"));
app.use("/views", express.static(`${__dirname}/public/views`));
app.use("/src", express.static(`${__dirname}/public/images`));
app.use("/src", express.static(`${__dirname}/public/src`));
app.use("/js", express.static(`${__dirname}/public/src/js`));
app.use("/css", express.static(`${__dirname}/public/src/css`));

app.set("views", "./public/views");
app.set("view engine", "ejs");

function makeKey(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

// TODO: Check access token on page load
// TODO: Delete expired Tokens from list
let authorizedTokens = {}

try {
  app.get("/", async (req, res) => {
    //check if user is authed, if not, render normal
    if (req.signedCookies.username) {
      // Handles edge case for page loads after server restarts, where cookies haven't been timed out
      if (authorizedTokens === {}) {
        res.clearCookie('sessionToken')
        res.clearCookie('username')
        await res.render(`index.ejs`, { loggedIn: "Home" });
      } else {
      await res.render(`index.ejs`, { loggedIn: req.signedCookies.username });
      }
    } else {
      await res.render(`index.ejs`, { loggedIn: "Home" });
    }
  });
} catch (error) {}

try {
  app.get("/login", async (req, res) => {
    //check if user is authed, if not, render normal
    if (req.signedCookies.username) {
      // Handles edge case for page loads after server restarts, where cookies haven't been timed out
      if (authorizedTokens === {}) {
        res.clearCookie('sessionToken')
        res.clearCookie('username')
        await res.render("login.ejs", { error: "", loggedIn: "Home" });
      } else {
      await res.render("login.ejs", { error: "You are already logged in", loggedIn: req.signedCookies.username });
      }
    } else {
      await res.render("login.ejs", { error: "", loggedIn: "Home" });
    }
  });
} catch (error) {}

try {
  app.get("/signup", async (req, res) => {
    //check if user is authed, if not, render normal
    if (req.signedCookies.username) {
      // Handles edge case for page loads after server restarts, where cookies haven't been timed out
      if (authorizedTokens === {}) {
        res.clearCookie('sessionToken')
        res.clearCookie('username')
        await res.render(`signup.ejs`, { error: "", loggedIn: "Home" });
      } else {
      await res.render(`signup.ejs`, { error: "You already have a logged in account", loggedIn: req.signedCookies.username });
      }
    } else {
      await res.render(`signup.ejs`, { error: "", loggedIn: "Home" });
    }});
} catch (error) {}

try {
  app.get("/timer", async (req, res) => {
    //check if user is authed, if not, render normal
    if (req.signedCookies.username) {
      // Handles edge case for page loads after server restarts, where cookies haven't been timed out
      if (authorizedTokens === {}) {
        res.clearCookie('sessionToken')
        res.clearCookie('username')
        await res.render(`timer.ejs`, { loggedIn: 'Home' });
      } else {
      await res.render(`timer.ejs`, { loggedIn: req.signedCookies.username });
      }
    } else {
      await res.render(`timer.ejs`, { loggedIn: "Home" });
    }
  });
} catch (error) {}

try {
  app.get("/balls", async (req, res) => {
    //check if user is authed, if not, render normal
    if (req.signedCookies.username) {
      // Handles edge case for page loads after server restarts, where cookies haven't been timed out
      if (authorizedTokens === {}) {
        res.clearCookie('sessionToken')
        res.clearCookie('username')
        await res.render(`balls.ejs`, { loggedIn: 'Home' });
      } else {
      await res.render(`balls.ejs`, { loggedIn: req.signedCookies.username });
      }
      console.log(req.signedCookies);
    } else {
      await res.render(`balls.ejs`, { loggedIn: "Home" });
    }
  });
} catch (error) {}

try {
  app.get("/calendar", async (req, res) => {
    //check if user is authed, if not, render normal
    if (req.signedCookies.username) {
      // Handles edge case for page loads after server restarts, where cookies haven't been timed out
      if (authorizedTokens === {}) {
        res.clearCookie('sessionToken')
        res.clearCookie('username')
        await res.render(`calendar.ejs`, { loggedIn: 'Home' });
      } else {
      await res.render(`calendar.ejs`, { loggedIn: req.signedCookies.username });
      }
      console.log(req.signedCookies);
    } else {
      await res.render(`calendar.ejs`, { loggedIn: "Home" });
    }
  });
} catch (error) {}

try {
  app.post("/signup", async (req, res) => {
    //check if user is authed,if yes, redirect to index, if not, render normal
    if (!req.signedCookies.sessionToken){
    // get user info from signup form
      const { username, email }  = req.body;
      let password = sha256(req.body.password);
      let passwordconf = sha256(req.body.passwordconf);
    // check if passwords match
      const passConfed = (passwordconf === password) ? true:false;
    // if passwords are equal, send data to database 
      if (passConfed === true) {
        const data = { key: username, email, password };
        //check if the user already exists
        const user = await db.get(username)
        //if new user, store user data and confirm upload
        if (!user) {
          res.status(202)
          const userPromise = await db.put(data);
          const userCheck = await db.get(username)
          if (userCheck) {
            res.status(201).redirect("/");
          } else {
            await res.status(503).render("signup.ejs", { error: "Service not available", loggedIn: "Home" });
          }
        } else {
          await res.status(503).render("signup.ejs", { error: "You already have an account", loggedIn: "Home" });
        }
      } else {
        await res.render("signup.ejs", { error: "Passwords not matching", loggedIn: "Home" });
      }
    } else {
      // Handles edge case for page loads after server restarts, where cookies haven't been timed out
      if (authorizedTokens === {}) {
        res.clearCookie('sessionToken')
        res.clearCookie('username')
        await res.render("signup.ejs", { error: "", loggedIn: "Home" });
      } else {
      await res.render("signup.ejs", { error: "You are already logged in", loggedIn: req.signedCookies.username });
      }
    }
  });
} catch (error) {}


try {
  app.post("/login", async (req, res) => {
    // TODO: Get data from remember me button and set cookie expiration accordingly
    if (!req.signedCookies.sessionToken){    
      // get data from login form
      const { username } = req.body;;
      const user = await db.get(username)
      if (user === null) {
        await res.render("login.ejs", { error: "Wrong Username or Password", loggedIn: "Home" });
      }
      const password = sha256(req.body.password.toString()); // FIXME: Perform Input Validation + add a Salt
      const cloudPassword = user.password;
      // compare password in database with login password
      const passConfed = (cloudPassword === password) ? true:false;
      // if passwords match, create access token and store in res.local
      // send res to index for authentification
      if (passConfed) {
        const sessionToken = makeKey(40);
        // FIXME: Add the <secure> flag to cookies
        // FIXME: Add browser checks for browsers with tight cookie security
        res.cookie('sessionToken', sessionToken, {httpOnly: true, signed: true, expires: new Date(Date.now() + 900_000_000)});
        res.cookie('username', username, {httpOnly: true, signed: true, expires: new Date(Date.now() + 900_000_000)});
        authorizedTokens[username] = {sessionToken, expires: new Date(Date.now() + 900_000)};
        console.log(authorizedTokens[username])
        res.status(201).redirect("/");
      } else {
        await res.render("login.ejs", { error: "Wrong Username or Password", loggedIn: "Home" });
      }
    } else {
      // Handles edge case for page loads after server restarts, where cookies haven't been timed out
      if (authorizedTokens === {}) {
        res.clearCookie('sessionToken')
        res.clearCookie('username')
        await res.render("login.ejs", { error: "", loggedIn: "Home" });
      } else {
      await res.render("login.ejs", { error: "You are already logged in", loggedIn: req.signedCookies.username });
      }}
  })} catch (error) {}  

app.listen(port, () => console.info(`App available on ${site}`));
