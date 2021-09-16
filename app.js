const express = require('express');
const app = express();
app.disable("x-powered-by");

const port = 3000;
const site = `http://localhost:${port}`

app.use(express.static('public'))
app.use('/views', express.static(`${__dirname}/public/views`))
app.use('/src', express.static(`${__dirname}/public/src`))
app.use('/js', express.static(`${__dirname}/public/src/js`))
app.use('/css', express.static(`${__dirname}/public/src/css`))

app.set('views', './public/views')
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    await res.render(`index`)
});

app.get('/login', async (req, res) => {
    await res.render('login')
});

app.get('/signup', async (req, res) => {
    await res.render('signup')
});

app.post('/signup', async (req, res) => {
    console.log(req.body)
});

app.post('/login', async (req, res) => {
});

app.listen(port, () => console.info(`App available on ${site}`))