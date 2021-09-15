const express = require('express');
const app = express();
app.disable("x-powered-by");

const port = 3000;
const site = `http://localhost:${port}`

app.use(express.static('public'))
app.use('/src', express.static(`${__dirname}/public/src`))
app.use('/views', express.static(`${__dirname}/public/views`))
app.use('/js', express.static(`${__dirname}/public/src/js`))
app.use('/css', express.static(`${__dirname}/public/src/css`))

app.set('views', './public/views')
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    await res.render(`index`)
});

app.get('/auth/login', async (req, res) => {
    await res.render('login')
});

app.get('/auth/signup', async (req, res) => {
    await res.render('signup')
});

app.listen(port, () => console.info(`App available on ${site}`))