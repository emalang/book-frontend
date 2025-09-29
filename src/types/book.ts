export type Book = {
    id: number;
    title: string;
    author: string;
    year?: number;
    pages?: number;
    genres?: string[] | string;
    publisher?: string;
    language?: string;
    image_url?: string;
};
