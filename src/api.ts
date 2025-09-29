import axios from 'axios';

const api = axios.create({ baseURL: '/', withCredentials: true });

export async function getBooks(
  page: number,
  perPage: number,
  q?: string,
  categoryId?: number,
) {
  console.log('Axios: calling /books', { page, perPage, q, categoryId });
  try {
    const res = await api.get('/books', {
      params: {
        page,
        perPage,
        ...(q ? { q } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
    });
    console.log('Axios response:', res);
    return res.data;
  } catch (err) {
    console.error('Axios error:', err);
    throw err;
  }
}
