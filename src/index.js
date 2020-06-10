import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';

const typeDefs = gql`
    type Query {
        hello: String
    }
    `;
const resolvers = {
    Query: {
        hello: () => 'Hello World'
    }
};

const app = express();
const port = process.env.port || 4000;

const server = new ApolloServer({ typeDefs, resolvers});
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req, res) => res.send('Hello World'));
app.listen({port}, () =>
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));