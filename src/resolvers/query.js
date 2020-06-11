export async function notes(parent, args, {models}) {
    return await models.Note.find();
}
export async function note(parent, args, {models}) {
    return await models.Note.findById(args.id);
}

