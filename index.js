const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/MyFlixDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//return JSON object when at /movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
    
});

//CREATE allows new users to register

app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
       .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else { 
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email, 
                        Birthday: req.body.Birthday
                    })
                    .then((user) =>{res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//Get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//Get a user by username
app.get('/users/:Username', (req, res) => {
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

app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
        {
            Username: req.body.Username,
            Password: req.body.Password, 
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true }, //This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(error);
            res.status(500).send('Error: ' + error);
        } else {
            res.json(updatedUser);
        }
    });
});

//Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req. params.MovieID}
    },
    { new: true }, //This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error: ' + error);
        } else {
            res.json(updatedUser);
        }
    });
});

//Delete a user by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username})
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

app.listen(8080, () => console.log("listening on 8080"))