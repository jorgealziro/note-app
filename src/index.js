import express from 'express';
import {ApolloServer} from 'apollo-server-express';
require('dotenv').config();

const resolvers = require('./resolvers');
const models = require('./models');
const db = require('./db');
const typeDefs = require('./schema');
const port = process.env.port || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();
db.connect(DB_HOST);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        return { models };
    }
});
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req, res) => res.send('Hello World'));
app.listen({port}, () =>
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
    );