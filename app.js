const express = require("express");
const sha256 = require('js-sha256');
const dotenv = require('dotenv').config();

const app = express();
app.disable("x-powered-by");

const port = 3000;
const site = `http://localhost:${port}`;

app.use(express.urlencoded({ extended: false}));

app.use(express.static("public"));
app.use("/views", express.static(`${__dirname}/public/views`));
app.use("/src", express.static(`${__dirname}/public/src`));
app.use("/js", express.static(`${__dirname}/public/src/js`));
app.use("/css", express.static(`${__dirname}/public/src/css`));

app.set("views", "./public/views");
app.set("view engine", "ejs");

try {
  app.get("/", async (req, res) => {
    await res.render(`index.ejs`);
  });
} catch (error) {}

try {
  app.get("/login", async (req, res) => {
    await res.render("login.ejs");
  });
} catch (error) {}

try {
  app.get("/signup", async (req, res) => {
    await res.render("signup.ejs");
  });
} catch (error) {}

try {
  app.get("/timer", async (req, res) => {
    await res.render("timer.ejs");
  });
} catch (error) {}

try {
  app.post("/signup", async (req, res) => {
      let username = req.body.username;
      let email = req.body.email;
      let password = sha256(req.body.password);
      let passwordconf = sha256(req.body.passwordconf);
      let passConfed = (passwordconf == password) ? true:false;
      

  });
} catch (error) {}

try {
  app.post("/login", async (req, res) => {
      let username = req.body.username;
      let password = sha256(req.body.password.toString());
  });
} catch (error) {}

app.listen(port, () => console.info(`App available on ${site}`));
