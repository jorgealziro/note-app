export async function newNote(parent, args, {models}) {
    return await models.Note.create({
        content: args.content,
        author: 'Michael Scott'
    });
}
export async function deleteNote(parent, {id}, {models}) {
    try {
        await models.Note.findOneAndRemove({ _id: id});
        return true;
    } catch (err) {
        return false;
    }
}