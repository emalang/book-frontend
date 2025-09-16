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

    const q = (searchParams.get('q') ?? '').trim();
    const [qInput, setQInput] = useState(q);

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadBooks(currentPage: number, currentPerPage: number, currentQ: string = q) {
        try {
            setLoading(true);
            setError(null);
            const json = await getBooks(currentPage, currentPerPage, currentQ || undefined);
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
        loadBooks(page, perPage, q);
    }, [page, perPage, q]);

    const setParams = (nextPage: number, nextPerPage: number, nextQ = q) => {
        const safePage = Math.max(1, Math.floor(nextPage) || 1);
        const safePer = Math.max(1, Math.floor(nextPerPage) || 1);
        const params: Record<string, string> = { page: String(safePage), perPage: String(safePer) };
        const trimmed = (nextQ ?? '').trim();
        if (trimmed) params.q = trimmed;
        setSearchParams(params);
    };

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setParams(1, perPage, qInput);
                }}
                style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-start', marginBottom: 12 }}
            >
                <input
                    type="search"
                    placeholder="Search…"
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                />
                <button type="submit">Search</button>
                {q && (
                    <button
                        type="button"
                        onClick={() => {
                            setQInput('');
                            setParams(1, perPage, '');
                        }}
                    >
                        Clear
                    </button>
                )}
            </form>

            <ul style={{ marginTop: 12, listStyleType: 'none', padding: 0, textAlign: 'start' }}>
                {books.map((b) => (
                    <li key={b.id}>
                        {b.title} — {b.author}
                    </li>
                ))}
            </ul>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                <button
                    onClick={() => setParams(page - 1, perPage)}
                    disabled={page <= 1}
                >
                    Prev
                </button>

                <span>Page {page}</span>

                <button
                    onClick={() => setParams(page + 1, perPage)}
                    disabled={books.length < perPage}
                >
                    Next
                </button>

                <label style={{ marginLeft: 12 }}>
                    Per page:{' '}
                    <select
                        value={perPage}
                        onChange={(e) => setParams(1, Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default BooksAxios;