require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const loginRouter = require('./routes/loginRoutes')

const app = express();
const port = process.env.PORT || 5001

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) throw err;
    console.log('mongoDB connected');
});

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', loginRouter);

app.listen(port, () => {
    console.log(`server started on port: ${port}`);
})

module.exports = app;