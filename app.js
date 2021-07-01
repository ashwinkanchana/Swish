const express = require('express')
const chalk = require('chalk')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
//Setup env variables
dotenv.config({ path: './config/.env' });

const app = express()
app.use(express.json())
app.use(cors())


//Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


//api routes
app.use('/api/store', require('./routes/store'))
app.use('/api/product', require('./routes/product'))


//Handle errors
app.use((req, res, next) => {
    res.status(404).json({ error: [`Invalid request`] });
});





const port = process.env.PORT || 3000
app.listen(port, async () => {
    console.log(chalk.blue(`Alive on http://localhost:${port}`))
})

