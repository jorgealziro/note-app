import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';

let notes = [
    {id: '1', content: 'This is a note', author: 'JEN'},
    {id: '2', content: 'This is another note', author: 'Aniston'},
    {id: '3', content: 'Banana', author: 'Kong'}
];

const typeDefs = gql`
    type Query {
        hello: String!
        notes: [Note!]!
        note(id: ID!): Note!
    }

    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Mutation {
        newNote(content: String!): Note!
    }
    `;
const resolvers = {
    Query: {
        hello: () => 'Hello World',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: 'Michael Scott'
            };
            notes.push(noteValue);
            return noteValue;
        }
    }
};

const app = express();
const port = process.env.port || 4000;

const server = new ApolloServer({ typeDefs, resolvers});
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req, res) => res.send('Hello World'));
app.listen({port}, () =>
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
    );