//importing express package
const express = require ('express'),
//declaring the variable 'app' and attached all functionalities of express to it
    app = express(),
    bodyParser = require ('body-parser'),
    uuid = require ('uuid');


app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Julia",
        favoriteMovies: ["Coco"]
    },
    {
        id: 2, 
        name: "Edgar",
        favoriteMovies: ["La vita e Bella"]
    },
]

let movies = [
    {
        "Title":"The Princess Bride",
        "Description":"While home sick in bed, a young boy's grandfather reads him the story of a farmboy-turned-pirate who encounters numerous obstacles, enemies and allies in his quest to be reunited with his true love.",
        "Release":"1987",
        "Genre": {
            "Name":"Action",
            "Description":"Action film is a film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases. Action films tend to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero."
        },
        "Director":{
            "Name":"Rob Reiner",
            "Bio":"When Rob graduated high school, his parents advised him to participate in Summer Theatre. Reiner got a job as apprentice in Bucks County Playhouse in Pennsylvania. He went to be further educated at UCLA Film School. Reiner felt he still wasn't successful even having a recurring role on one of the biggest shows in the country, All in the family. Reiner began his directing career with the Oscar-nominated films This Is Spinal Tap, Stand By Me, and The Princess Bride.","Birth":1947.0
        },
        "Featured":false
    },
    {
        "Title":"E.T. The Extraterrestrial",
        "Description":"After a gentle alien becomes stranded on Earth, he is discovered and befriended by a 10-year-old boy named Elliott. Bringing him into his suburban California house, Elliott introduces E.T., as he is dubbed, to his brother, Michael, and sister, Gertie, and they decide to keep his existence a secret. Soon, however, he falls ill, resulting in government intervention and a dire situation for both him and Elliott.",
        "Release":"1982",
        "Genre": {
            "Name":"Adventure",
            "Description":"Adventure film is where characters leaving their home or place of comfort and going to fulfill a goal, embarking on travels, quests, treasure hunts, heroic journeys; and explorations or searches for the unknown."
        },
        "Director":{
            "Name":"Steven Spielberg",
            "Bio":"Steven was born in Cincinnati, Ohio and raised in a Russian Jewish immigrant household. Spielberg briefly attended CSU Long Beach but dropped out to pursue his entertainment career. He began directing productions in 1961, but only gained stardom status in 1975 with the production of JAWS, and then again in 1977 with Close Encounters of the Third Kind. Spielberg help revolutionize with this film the concept of product placement.","Birth":1946.0
        },
        "Featured":false
    },
    {
        "Title":"La Vita e' Bella",
        "Description":"When an open-minded Jewish waiter and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son from the dangers around their camp.",
        "Release":"1997",
        "Genre": {
            "Name":"Comedy Drama",
            "Description":"Dramedy is a hybrid genre of the comedy and drama. It features the comedic elements that were present in the comedy, but also has some elements of drama."
        },
        "Director":{
            "Name":"Roberto Benigni",
            "Bio":"Roberto Benigni was born on October 27, 1952 in Manciano La Misericordia, Castiglion Fiorentino, Tuscany, Italy. He is an actor and writer, known for Life Is Beautiful (1997), The Tiger and the Snow (2005) and Down by Law (1986). He has been married to Nicoletta Braschi since December 26, 1991.","Birth":1952.0
        },
        "Featured":false
    },
    {
        "Title":"Star Wars",
        "Description":"Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
        "Release":"1977",
        "Genre": {
            "Name":"Fantasy",
            "Description":"Films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap."
        },
        "Director":{
            "Name":"George Lucas",
            "Bio":"George Walton Lucas, Jr. was raised on a walnut ranch in Modesto, California. Although he dreamed through High School to become a drag racing star but an accident made him change his view on life. He attended Modesto Junior College before attending USC film school where he made several short films that resulted in awards at film festivals. He eventually formed his own production company, Lucasfilm Ltd. From there he began writing the screenplay for Star Wars which was inspired from the Flash Gordon and Planet of the Apes films.","Birth":1944.0
        },
        "Featured":false
    },
];

//CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

//UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }

})

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`$(movieName) has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }

})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies= user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieName} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }

})

//READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

//READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }

})

//READ
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
      
})

//READ
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
      
})

app.listen(8080, () => console.log("listening on 8080"))

/*
//importing morgan package
const morgan = require ('morgan');

//static files in response to request
app.use(express.static('public'));
app.use(morgan("common"));

//returns a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
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
app.use(express.static('public/documentation.html'));
app.use(morgan('common'));
*/

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

