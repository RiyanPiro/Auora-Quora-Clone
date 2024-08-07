// Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');

// Set up the server
const url = 'mongodb://localhost:27017';
const dbName = 'quora';
const client = new MongoClient(url);

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));

// Send the documents from 'questions' collection
app.get('/getQuestionData', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);

        const questionsCollection = db.collection('questions');
        const questions = await questionsCollection.find({}).toArray();
        res.json(questions);

        await client.close();
    }
    catch (err) {
        console.error('Error retrieving questions:', err);
        res.status(500).send('Error retrieving questions');
    }
});

// Save the submitted question data in the 'questions' collection
app.post('/saveQuestionData', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);

        // Create a new document with question, date, and username
        let newQuestion = {
            question: req.body.question,
            date: req.body.date,
            username: req.body.username
        };

        // Insert the new document into the 'questions' collection
        let r = await db.collection('questions').insertOne(newQuestion);

        res.status(200).send('Question data saved');
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send('Error saving question data');
    }
});

// Save the submitted answer data in the question's answer data array
app.post('/saveAnswerData', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('questions');

        const questionID = req.body.questionID;
        const answer = req.body.answer;
        const date = req.body.date;
        const username = req.body.username;

        // Create new answer data object
        const newAnswerData = {
            answer: answer,
            date: date,
            username: username
        };

        // Find the document with the given questionID
        const query = { _id: new ObjectId(questionID) };
        const existingDocument = await collection.findOne(query);

        if (!existingDocument) {
            return res.status(404).send('Question not found');
        }
        // Update the answerdata field by pushing the new answer data
        await collection.updateOne(
            { _id: new ObjectId(questionID) },
            { $push: { answerdata: newAnswerData } }
        );

        res.status(200).send('Answer data saved');
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send('Error saving answer data');
    }
});

// Send the answer data from the question's answer data array to client
app.post('/getAnswerData', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('questions');

        const questionID = req.body.questionID;

        // Find the document with the given questionID
        const query = { _id: new ObjectId(questionID) };
        const existingDocument = await collection.findOne(query);

        if (!existingDocument) {
            return res.status(404).send('Question not found');
        }

        res.status(200).json(existingDocument.answerdata);
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send('Error retrieving answer data');
    }
});

// Start the server
app.listen(3000, () => console.log('Server is running on http://localhost:3000'));