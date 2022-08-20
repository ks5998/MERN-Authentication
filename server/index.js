require('dotenv').config();
const session = require('express-session')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const MongoDBStore = require('connect-mongodb-session')(session)
const loginRouter = require('./routes/loginRoutes')

const app = express();
const MAX_AGE = 1000 * 60 * 60 * 3 // 3 hrs
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

//setting up connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
    uri: process.env.DB_URI,
    collection: 'usersSession'
});

app.use(session({
    secret: 'a1s2d3z4x5c6',
    name: 'session-id',
    store: mongoDBstore,
    cookie: {
        maxAge: MAX_AGE,
        sameSite: false,
        secure: false
    },
    resave: true,
    saveUninitialized: false
}))

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', loginRouter);

app.listen(port, () => {
    console.log(`server started on port: ${port}`);
})

module.exports = app; 