const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongooseValidator = require('mongoose-unique-validator');
const _ = require('lodash');
const app = express();
const port = 3000;
const dir = __dirname + '/';
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting up mongoDB
mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost:27017/artchitectsDB", { useNewUrlParser: true, useUnifiedTopology: true });

const usrSchema = new mongoose.Schema({
    name: String,
    mailID: String,
    msg: String
});

const User = new mongoose.model('User', usrSchema);

const newsLetterSchema = new mongoose.Schema({
    mailID: {
        type: String,
        index: true,
        unique: true
    }
});

newsLetterSchema.plugin(mongooseValidator);

const Subscriber = new mongoose.model('Subscriber', newsLetterSchema);


// setting mongodb ends here




// routes
app.get('/', (req, res) => {
    res.sendFile(dir + 'index.html');

})

app.get('/pricing', (req, res) => {
    res.sendFile(dir + 'pricing.html');
});

app.get('/pricingService', (req, res) => {
    res.redirect('http://localhost:3000/#service');
})

app.get('/history', (req, res) => {
    res.sendFile(dir + 'history.html');
});

app.get('/historyService', (req, res) => {
    res.redirect('http://localhost:3000/#service');
});

app.post('/register', (req, res) => {
    User.find({ mailID: req.body.umail }, (err, data) => {
        if (err) { console.log(err); }
        else {
            if (data === null) {
                console.log("Duplicate data found");
                console.log(data);
            } else {
                const usr = new User({
                    name: _.trim(req.body.uname),
                    mailID: _.trim(req.body.umail),
                    msg: _.trim(req.body.umsg)
                });
                usr.save();
                console.log("New data added to DB");
            }
        }
    });
    res.redirect('/');
});

app.post('/newsLetterSignUp', (req, res) => {
    const mail = req.body.subscribedMail;
    const m = new Subscriber({
        mailID: _.trim(mail)
    });
    m.save((e) => {
        if (e) { console.log("duplicate data found"); }
    });
    res.redirect('/');
});

// routs ends here


app.listen(port, (data) => {
    console.log("Server is running on port " + port);
});
