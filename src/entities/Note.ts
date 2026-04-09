export type Note = {
    id: string;
    content: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};
