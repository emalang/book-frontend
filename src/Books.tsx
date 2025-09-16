import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks } from './api';

type Book = { id: number; title: string; author: string };

const BooksAxios: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageParam = searchParams.get('page');
    const perPageParam = searchParams.get('perPage');

    const page = Number.isFinite(Number(pageParam)) && Number(pageParam) > 0 ? Number(pageParam) : 1;
    const perPageRaw = Number(perPageParam);
    const perPage = Number.isFinite(perPageRaw) && perPageRaw > 0 ? perPageRaw : 5;

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadBooks(currentPage: number, currentPerPage: number) {
        try {
            setLoading(true);
            setError(null);
            const json = await getBooks(currentPage, currentPerPage);
            let items: Book[] = [];
            if (Array.isArray(json)) {
                items = json as Book[];
            } else if (json && Array.isArray((json as any).data)) {
                items = (json as any).data as Book[];
            } else if (json && Array.isArray((json as any).items)) {
                items = (json as any).items as Book[];
            } else {
                items = [];
            }
            setBooks(items);
        } catch (e: any) {
            setError(e.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBooks(page, perPage);
    }, [page, perPage]);

    const setParams = (nextPage: number, nextPerPage: number) => {
        const safePage = Math.max(1, Math.floor(nextPage) || 1);
        const safePer = Math.max(1, Math.floor(nextPerPage) || 1);
        setSearchParams({ page: String(safePage), perPage: String(safePer) });
    };

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                    onClick={() => setParams(page - 1, perPage)}
                    disabled={page <= 1}
                >
                    Prev
                </button>

                <span>Page {page}</span>

                <button onClick={() => setParams(page + 1, perPage)}>Next</button>

                <label style={{ marginLeft: 12 }}>
                    Per page:{' '}
                    <select
                        value={perPage}
                        onChange={(e) => setParams(1, Number(e.target.value))} // reset na page=1
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </label>
            </div>

            <ul style={{ marginTop: 12 }}>
                {books.map((b) => (
                    <li key={b.id}>
                        {b.title} — {b.author}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BooksAxios;