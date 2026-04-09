import Dexie from "dexie";

import type { Note } from "@entities";
import type { EntityTable } from "dexie";

const db = new Dexie("ArdoiseDB") as Dexie & {
    notes: EntityTable<Note, "id">;
};

db.version(1).stores({
    notes: "id, title, updatedAt, deletedAt"
});

export default db;
