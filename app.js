const express = require("express");
const sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.disable("x-powered-by");

const { Deta } = require('deta');
const deta = Deta(process.env.DETA_API_KEY);
const db = deta.Base('authBase');

const port = 3000;
const site = `http://localhost:${port}`;

app.use(express.urlencoded({ extended: true}));
app.use(express.json())

app.use(express.static("public"));
app.use("/views", express.static(`${__dirname}/public/views`));
app.use("/src", express.static(`${__dirname}/public/src`));
app.use("/js", express.static(`${__dirname}/public/src/js`));
app.use("/css", express.static(`${__dirname}/public/src/css`));

app.set("views", "./public/views");
app.set("view engine", "ejs");

function makeKey(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

try {
  app.get("/", async (req, res) => {
    //check if user is authed, if not, render normal
    await res.render(`index.ejs`);
  });
} catch (error) {}

try {
  app.get("/login", async (req, res) => {
    //check if user is authed, if not, render normal
    await res.render("login.ejs", { error: "" });
  });
} catch (error) {}

try {
  app.get("/signup", async (req, res) => {
    //check if user is authed, if not, render normal
    await res.render("signup.ejs", { error: "" });
  });
} catch (error) {}

try {
  app.get("/timer", async (req, res) => {
    //check if user is authed, if not, render normal
    await res.render("timer.ejs");
  });
} catch (error) {}

try {
  app.get("/balls", async (req, res) => {
    //check if user is authed, if not, render normal
    await res.render("balls.ejs");
  });
} catch (error) {}

try {
  app.post("/signup", async (req, res) => {
    //check if user is authed,if yes, redirect to index, if not, render normal
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
        
          console.log(userCheck)
          if (userCheck) {
            res.status(201).redirect("/");
          } else {
            await res.status(503).render("signup.ejs", { error: "Service not available" });
          }
        } else {
          await res.status(503).render("signup.ejs", { error: "You already have an account" });
        }
      } else {
        await res.render("signup.ejs", { error: "Passwords not matching" });
      }
  });
} catch (error) {}

try {
  app.post("/login", async (req, res) => {
      // get data from login form
      const { username } = req.body;
      const user = await db.get(username)
      const password = sha256(req.body.password.toString());
      // compare password in database with login password
      const cloudPassword = user.password;
      const passConfed = (cloudPassword === password) ? true:false;
      // if passwords match, create access token and store in res.local
      // send res to index for authentification
      if (passConfed) {
        const sessionToken = makeKey(30);
        res.locals["sessionToken"] = sessionToken;
        res.status(201).redirect("/");
      } else {
      }
  });
} catch (error) {}  

app.listen(port, () => console.info(`App available on ${site}`));
