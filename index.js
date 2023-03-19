const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const uuid = require('uuid');
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

// Connect to mongo Atlas
mongoose.connect(process.env.CONNECTION_URI, {connectTimeoutMS: 30000});

// This is to connect to your local MongoDB server
// mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true });

// homepage text response when at /
app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html',)
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
                    .then((user) =>{res.status(200).json(user) })
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
 app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username})
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
}); 

//UPDATE username of a specific user
app.put('/users/:Username', 
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains no alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
], passport.authenticate('jwt', { session: false }), (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()});
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
        {
            Username: req.body.Username,
            Password: hashedPassword, 
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

//DELETE a movie from user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
   Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $pull: { FavoriteMovies: req.params.MovieID }
        },
        { new: true }, 
        (error, updatedUser) =>{
            if (error) {
                console.error(error);
                res.status(500).send('Error: ' + error);
            } else {
                res.json(updatedUser);
            }
        });
});

//READ Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
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
            res.status(200).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//GET a movie by title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.status(200).json(movie);
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
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//GET genre by name
app.get('/movies/genre/:genreName', (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
        .then((movie) => {
            res.status(200).json(movie.Genre);
        })
        .catch((error) => {
            console.error(error); 
            res.status(500).send('Error: ' + error);
        });
});

//GET movie by Director
app.get('/movies/directors/:directorName', (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
        .then((movie) => {
            res.status(200).json(movie.Director);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//Handling Errors
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Oh, something went wrong! Please try again later.');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('listening on Port!! ' + port);
});
