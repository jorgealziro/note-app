export async function newNote(parent, args, {models}) {
    return await models.Note.create({
        content: args.content,
        author: 'Michael Scott'
    });
}
