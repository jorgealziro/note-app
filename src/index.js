import express from 'express';
import {ApolloServer} from 'apollo-server-express';

const models = require('./models');
const db = require('./db');
const typeDefs = require('./schema');

require('dotenv').config();

const port = process.env.port || 4000;
const DB_HOST = process.env.DB_HOST;

const resolvers = {
    Query: {
        hello: () => 'Hello World',
        notes: async () => {
            return await models.Note.find();
        },
        note: async (parent, args) => {
            return models.Note.findById(args.id);
        }
    },
    Mutation: {
        newNote: async (parent, args) => {
            return await models.Note.create({
                content: args.content,
                author: 'Michael Scott'
            });
        }
    }
};

const app = express();
db.connect(DB_HOST);

const server = new ApolloServer({ typeDefs, resolvers});
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req, res) => res.send('Hello World'));
app.listen({port}, () =>
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
    );