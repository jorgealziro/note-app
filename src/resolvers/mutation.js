import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {AuthenticationError, ForbiddenError} from 'apollo-server-express';
import gravatar from '../utils/gravatar';
import mongoose from 'mongoose';
require('dotenv').config();

export async function newNote(parent, args, {models, user}) {
    if (!user) {
        throw new AuthenticationError('You must be signed in to create a note');
    }

    return await models.Note.create({
        content: args.content,
        author: mongoose.Types.ObjectId(user.id)
    });
}
export async function deleteNote(parent, {id}, {models, user}) {
    if (!user){
        throw new AuthenticationError('You must be signed in to delete a note');
    }
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id){
        throw new ForbiddenError("You don't have permissions to delete the note");
    }

    try {
        await note.remove();
        return true;
    } catch (err) {
        return false;
    }
}
export async function updateNote(parent, {content, id},{models, user}) {
    if (!user){
        throw new AuthenticationError('You must be signed in to update a note');
    }

    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id){
        throw new ForbiddenError("You don't have permissions to update the note");
    }

    return await models.Note.findOneAndUpdate(
        {
            _id: id,
        },
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    );
}
export async function signUp(parent, {username, email, password}, {models}){
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar(email);
    try {
        const user = await models.User.create({
            username,
            email,
            avatar,
            password: hashed
        });
        return jwt.sign({id: user._id}, process.env.JWT_SECRET);
    } catch (err) {
        console.log(err);
        throw new Error('Error creating account');
    }
}
export async function signIn(parent, {username, email, password}, {models}){
    if (email) {
        email = email.trim().toLowerCase();
    }
    const user = await models.User.findOne({
        $or: [{email},{username}]
    });
    if (!user) {
        throw new AuthenticationError('Error signing in');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new AuthenticationError('Error signing in');
    }

    return jwt.sign({id: user._id}, process.env.JWT_SECRET);
}
export async function toggleFavorite(parent, {id}, {models, user}){
    if (!user) {
        throw new AuthenticationError();
    }
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);
    if (hasUser >= 0){
        return await models.Note.findByIdAndUpdate(
            id,
            {
                $pull: {
                    favoritedBy: mongoose.Types.ObjectId(user.id)
                },
                $inc: {
                    favoriteCount: -1
                }
            },
            {
                new: true
            }
        );
    } else {
        return await models.Note.findByIdAndUpdate(
            id,
            {
                $push: {
                    favoritedBy: mongoose.Types.ObjectId(user.id)
                },
                $inc: {
                    favoriteCount: 1
                }
            },
            {
                new: true
            }
        );
    }
}