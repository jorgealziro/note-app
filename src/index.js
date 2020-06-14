import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const resolvers = require('./resolvers');
const models = require('./models');
const db = require('./db');
const typeDefs = require('./schema');
const port = process.env.port || 4000;
const DB_HOST = process.env.DB_HOST;

const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error('Session Invalid');
        }
    }
};


const app = express();
db.connect(DB_HOST);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers.authorization;
        const user = getUser(token);
        console.log(user)
        return { models, user };
    }
});
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req, res) => res.send('Hello World'));
app.listen({port}, () =>
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
    );