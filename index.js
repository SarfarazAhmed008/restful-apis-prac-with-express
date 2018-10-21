const express = require('express');
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));

app.use(logger);

const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'},
];
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body); // result.error
    if(error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id : courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Can not find the given ID...');
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //find the given id
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Can not find the given ID...');
    
    //validating given values..here in req.body
    const {error} = validateCourse(req.body); // result.error
    if(error) return res.status(400).send(error.details[0].message);

    //everything fine so update given id course object
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Can not find the given ID...');
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000; // for setting env port ..go to terminal and type -> set PORT=5000
app.listen(port, () => console.log(`Listening from the port ${port}...`));