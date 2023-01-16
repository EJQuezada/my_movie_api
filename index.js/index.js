const express = require ("express");
const app = express();

//returns a welcome message
app.get("/", (req, res) => {
    res.send("Welcome to MyFlix!");
});

//List of top 10 movies

let top10Movies = [
    {
        title: 'The Goonies',
        director: 'Richard Donner',
        stars: 'Sean Astin', 'Josh Brolin', 'Jeff Cohen',
        genres: 'Adventure', 'Comedy', 'Family',
    },

    {
        title: 'Como agua para chocolate',
        director: 'Alfonso Arau',
        stars: 'Marco Leonardi', 'Lumi Cavazos', 'Regina Torne',
        genres: 'Drama', 'Romance',
    },

    {
        title: 'La vita e bella',
        director: 'Roberto Benigni',
        stars: 'Roberto Benigni', 'Nicoletta Braschi', 'Giorgio Cantarini',
        genres: 'Comedy', 'Drama', 'Romance',
    },

    {
        title: 'Citizen Kane',
        director: 'Orson Welles',
        stars: 'Orson Welles', 'Joseph Cotten', 'Dorothy Comingore',
        genres: 'Drama', 'Mystery',
    },

    {
        title: 'Big Fish',
        director: 'Tim Burton',
        stars: 'Ewan McGregor', 'Billy Crudup', 'Albert Finney'
        genres: 'Adventure', 'Drama', 'Fantasy',
    },

    {
        title: 'Encanto',
        director: 'Jared Bush', 'Byron Howard', 'Charise Castro Smith',
        stars: 'Stephanie Beatriz', 'Maria Cecilia Botero', 'John Leguizamo', 'Wilmer Valerrama',
        genres: 'Animation', 'Comedy', 'Family',
    },

    {
        title: 'Mrs. Doubtfire',
        director: 'Chris Columbus',
        stars: 'Robin Williams', 'Sally Fields', 'Pierce Brosnan',
        genres: 'Comedy', 'Drama',
    },

    {
        title: 'Coco',
        director: 'Lee Unkrich', 'Adrian Molina',
        stars: 'Anthony Gonzalez', 'Gael Garcia Bernal',
        genres: 'Animation', 'Adventure', 'Comedy',
    },

    {
        title: 'Star Wars: Episode IV - A new hope',
        director: 'George Lucas',
        stars: 'Mark Hamill', 'Harrison Ford', 'Carrie Fisher',
        genres: 'Action', 'Adventure', 'Fantasy',
    },

    {
        title: 'Ferris Buller\'s Day Off',
        director: 'John Hughes',
        stars: 'Matthew Broderick', 'Alan Ruck', 'Mia Sara',
        genres: 'Comedy',
    },
];