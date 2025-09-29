import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks } from './api';
import type { Book } from "./types/book";

import Hero from './components/books/Hero';
import DetailsCard from './components/books/DetailsCard';
import HorizontalRail from './components/books/HorizontalRail';
import BookCard from './components/books/BookCard';

const BooksAxios: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageParam = searchParams.get('page');
    const perPageParam = searchParams.get('perPage');

    const page =
        Number.isFinite(Number(pageParam)) && Number(pageParam) > 0
            ? Number(pageParam)
            : 1;

    const perPageRaw = Number(perPageParam);
    const perPage =
        Number.isFinite(perPageRaw) && perPageRaw > 0 ? perPageRaw : 5;

    const q = (searchParams.get('q') ?? '').trim();
    const [qInput, setQInput] = useState(q);

    const [books, setBooks] = useState<Book[]>([]);
    const [active, setActive] = useState<Book | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const visibleBooks = useMemo(() => books.slice(0, perPage), [books, perPage]);

    async function loadBooks(
        currentPage: number,
        currentPerPage: number,
        currentQ: string = q
    ) {
        try {
            setLoading(true);
            setError(null);

            const json = await getBooks(
                currentPage,
                currentPerPage,
                currentQ || undefined
            );

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

    useEffect(() => {
        setQInput(q);
    }, [q]);

    useEffect(() => {
        setActive(visibleBooks[0] ?? null);
    }, [page, perPage, q, books, visibleBooks]);


    const setParams = (
        nextPage: number,
        nextPerPage: number,
        nextQ = q
    ) => {
        const safePage = Math.max(1, Math.floor(nextPage) || 1);
        const safePer = Math.max(1, Math.floor(nextPerPage) || 1);

        const params: Record<string, string> = {
            page: String(safePage),
            perPage: String(safePer),
        };

        const trimmed = (nextQ ?? '').trim();
        if (trimmed) params.q = trimmed;

        setSearchParams(params);
    };

    if (loading)
        return (
            <div className="space-y-4 px-4 sm:px-6 lg:px-10">
                <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-white/10" />
                <div className="h-[360px] w-full animate-pulse rounded-3xl bg-white/10" />
                <div className="mt-2 flex gap-4">
                    {Array.from({ length: perPage }).map((_, i) => (
                        <div key={i} className="h-[260px] w-[180px] animate-pulse rounded-2xl bg-white/10" />
                    ))}
                </div>
            </div>
        );

    if (error) return <p className="px-4 sm:px-6 lg:px-10 text-red-300">{error}</p>;

    return (
        <div className="space-y-4 px-4 sm:px-6 lg:px-10">
            <form
                onSubmit={(e) => { e.preventDefault(); setParams(1, perPage, qInput); }}
                className="mb-2 flex flex-wrap items-center gap-2"
            >
                <input
                    type="search"
                    placeholder="Search…"
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    className="w-full max-w-md rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 shadow-sm backdrop-blur focus:ring-2 focus:ring-blue-400/60"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-2 text-white shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-indigo-700"
                >
                    Search
                </button>
                {q && (
                    <button
                        type="button"
                        onClick={() => { setQInput(''); setParams(1, perPage, ''); }}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
                    >
                        Clear
                    </button>
                )}
            </form>

            <Hero book={active} />
            <DetailsCard book={active} />

            <HorizontalRail title={`All books (showing ${visibleBooks.length})`}>
                {visibleBooks.map((b) => (
                    <BookCard key={b.id} book={b} onSelect={setActive} />
                ))}
                {visibleBooks.length === 0 && (
                    <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-center text-sm text-white/70">
                        No books found.
                    </div>
                )}
            </HorizontalRail>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setParams(page - 1, perPage)}
                        disabled={page <= 1}
                        className="rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 text-white disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-white/70">Page {page}</span>
                    <button
                        onClick={() => setParams(page + 1, perPage)}
                        disabled={visibleBooks.length < perPage}
                        className="rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    Per page:{' '}
                    <select
                        value={perPage}
                        onChange={(e) => setParams(1, Number(e.target.value))}
                        className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-white backdrop-blur"
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
