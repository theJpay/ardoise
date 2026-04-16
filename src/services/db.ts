import Dexie from "dexie";

import type { Note, Settings } from "@entities";
import type { EntityTable } from "dexie";

const db = new Dexie("ArdoiseDB") as Dexie & {
    notes: EntityTable<Note, "id">;
    settings: EntityTable<Settings, "id">;
};

db.version(2).stores({
    notes: "id, title, updatedAt, deletedAt",
    settings: "id"
});

export default db;
