const express = require("express");
const sha256 = require('js-sha256');
require('dotenv').config();

const app = express();
app.disable("x-powered-by");

const { Deta } = require('deta');
const deta = Deta(process.env.DETA_API_KEY);
const db = deta.Base('authBase');

const port = 3000;
const site = `http://localhost:${port}`;

app.use(express.urlencoded({ extended: false}));
app.use(express.json())

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
      const { username, email }  = req.body;
      let password = sha256(req.body.password);
      let passwordconf = sha256(req.body.passwordconf);
      const passConfed = (passwordconf == password) ? true:false;
      if (passConfed === true) {
        const data = { key: username, email, password };
        const user = await db.get(username)
        if (user) {
          res.status(202)
          const userPromise = await db.put(data);
          const userCheck = await db.get(username)
          if (userCheck) {
            res.status(201)
          } else {
            await res.status(503).render("signup.ejs", { error = "Service not available" });
          }
        } else {
          await res.status(503).render("signup.ejs", { error = "Service not available" });
        }
      } else {
        await res.render("signup.ejs", { error = "Passwords not matching" });
      }
  });
} catch (error) {}

try {
  app.post("/login", async (req, res) => {
      let username = req.body.username;
      let password = sha256(req.body.password.toString());
  });
} catch (error) {}  

app.listen(port, () => console.info(`App available on ${site}`));
