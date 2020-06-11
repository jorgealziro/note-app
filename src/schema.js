import {gql} from 'apollo-server-express';

module.exports = gql`
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
        deleteNote(id: ID!): Boolean!
        updateNote(id: ID!, content: String!): Note!
    }
    `;
