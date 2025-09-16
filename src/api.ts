import axios from 'axios';

const api = axios.create({ baseURL: '/', withCredentials: true });

export async function getBooks(page: number, perPage: number) {
    console.log('Axios: calling /books', { page, perPage });
    try {
        const res = await api.get('/books', { params: { page, perPage } });
        console.log('Axios response:', res);
        return res.data;
    } catch (err) {
        console.error('Axios error:', err);
        throw err;
    }
}