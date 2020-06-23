export async function notes(parent, args, {models}) {
    return await models.Note.find();
}
export async function note(parent, args, {models}) {
    return await models.Note.findById(args.id);
}
export async function user(parent, {username}, {models}){
    return await models.User.findOne({username});
}
export async function users(parent, args, {models}){
    return await models.User.find({});
}
export async function me(parent, args, {models, user}){
    return await models.User.findById(user.id);
}


