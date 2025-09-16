import axios from 'axios';

const api = axios.create({ baseURL: '/', withCredentials: true });

export async function getBooks(page: number, perPage: number, q?: string) {
    console.log('Axios: calling /books', { page, perPage, q });
    try {
        const res = await api.get('/books', { params: { page, perPage, ...(q ? { q } : {}) } });
        console.log('Axios response:', res);
        return res.data;
    } catch (err) {
        console.error('Axios error:', err);
        throw err;
    }
}