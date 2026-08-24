import db from "./db";

import type { NotesRepository } from "@entities";

const notesRepository: NotesRepository = {
    findVisible: () =>
        db.notes.filter((n) => n.deletedAt === null && n.archivedAt === null).toArray(),

    findArchived: () =>
        db.notes
            .orderBy("archivedAt")
            .reverse()
            .filter((n) => n.deletedAt === null)
            .toArray(),

    findTrashed: () => db.notes.orderBy("deletedAt").reverse().toArray(),

    findById: (id) => db.notes.get(id),

    findByIds: (ids) => db.notes.where("id").anyOf(ids).toArray(),

    findChildrenOf: (parentIds) => db.notes.where("parentId").anyOf(parentIds).toArray(),

    add: async (note) => {
        await db.notes.add(note);
    },

    update: async (id, patch) => {
        const count = await db.notes.update(id, patch);
        return count > 0;
    },

    modifyMany: async (ids, patch) => {
        await db.notes.where("id").anyOf(ids).modify(patch);
    },

    delete: (id) => db.notes.delete(id),

    deleteTrashedBefore: (cutoff) => db.notes.where("deletedAt").below(cutoff).delete(),

    deleteAll: () => db.notes.clear(),

    transaction: (fn) => db.transaction("rw", db.notes, fn)
};

export default notesRepository;
