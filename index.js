const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

/* mongoose.connect('mongo "mongodb+srv://cluster0.yj9pr8k.mongodb.net/myFirstDatabase" --username edgarquezada', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    //useCreateIndez: true
}); */

// This si to connect to your local MongoDB server
mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB')

// default text response when at /
app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
});

//CREATE allows new users to register
app.post('/users', 
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Usernamee contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ],  (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
       .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else { 
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email, 
                        Birthday: req.body.Birthday
                    })
                    .then((user) =>{res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//Get a user by username
/* app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username})
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
}); */

//UPDATE username of a specific user
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
        {
            Username: req.body.Username,
            Password: req.body.Password, 
            Email: req.body.Email,
            Birthday: req.body.Birthday,
        },
    },
    { new: true }, //This line makes sure that the updated document is returned
    (error, updatedUser) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error: ' + error);
        } else {
            res.json(updatedUser);
        }
    });
});

//Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req. params.MovieID }
    },
    { new: true }, //This line makes sure that the updated document is returned
    (error, updatedUser) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error: ' + error);
        } else {
            res.json(updatedUser);
        }
    });
});

//Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch ((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


//GET all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//GET a movie by id
app.get('/movies/:id', (req, res) => {
    console.log(req.params.id);
    Movies.findOne({_id: req.params.id})
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('listening on Port!! ' + port);
});