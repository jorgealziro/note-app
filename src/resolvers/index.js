const Query = require('./query');
const Mutation = require('./mutation');
import Note from './note';
import User from './user';
const {GraphQLDateTime} = require('graphql-iso-date');

module.exports = {
    Query,
    Mutation,
    Note,
    User,
    DateTime: GraphQLDateTime
};

