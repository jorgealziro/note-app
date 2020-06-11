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
export async function updateNote(parent, {content, id},{models}) {
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