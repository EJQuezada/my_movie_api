//importing express package
const express = require ("express");
//importing morgan package
const morgan = require ("morgan");
//declaring the variable 'app' and attached all functionalities of express to it
const app = express();

//static files in response to request
app.use(express.static("public"));
app.use(morgan("common"));

//returns a welcome message
app.get("/", (req, res) => {
    res.send("Welcome to MyFlix!");
});

//GET documentation.html
app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// GET top movies requests
app.get('/movies', (req, res) => {
    res.json(top10Movies);
});

//listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

//ERROR Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

//returns documentation.html via express.static
app.use(express.static('public/documentation.html'))

//List of top 10 movies

let top10Movies = [
    {
        title: 'The Goonies',
        release: '1985',
    },

    {
        title: 'Como agua para chocolate',
        release: '1992',
    },

    {
        title: 'La vita e bella',
        release: '1997',
    },

    {
        title: 'Citizen Kane',
        release: '1941',
    },

    {
        title: 'Big Fish',
        release: '2003',
    },

    {
        title: 'Encanto',
        release: '2021',
    },

    {
        title: 'Mrs. Doubtfire',
        release: '1993',
    },

    {
        title: 'Coco',
        release: '2017',
    },

    {
        title: 'Star Wars: Episode IV - A new hope',
        release: '1977',
    },

    {
        title: 'Ferris Buller\'s Day Off',
        release: '1986',
    },
];

// GET requests
app.get('/movies', (req, res) => {
    res.json(top10Movies)
})