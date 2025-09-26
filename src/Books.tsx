import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks } from './api';

type Book = {
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

function normalizeGenres(g: Book['genres']): string[] {
    if (Array.isArray(g)) return g.map(String);
    if (typeof g === 'string') return g.split(',').map(s => s.trim()).filter(Boolean);
    return [];
}

function posterFor(b: Book) {
    return b.image_url || `https://placehold.co/1200x360?text=${encodeURIComponent(b.title)}`;
}

function Hero({ book }: { book: Book | null }) {
    if (!book) return null;
    const bg = posterFor(book);
    return (
        <div className='relative mt-6 overflow-hidden rounded-3xl shadow-lg'>
            <img src={bg} alt={book.title} className='h-[360px] w-full object-cover' />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">{book.title}</h1>
                <p className="mt-2 text-neutral-200">
                    <span className="opacity-80">Author:</span> {book.author}
                    {book.year ? <span className="opacity-60"> • {book.year}</span> : null}
                </p>
            </div>
        </div>
    );
}

function DetailsCard({ book }: { book: Book | null }) {
    if (!book) return null;
    const genres = normalizeGenres(book.genres);
    return (
        <div className="mt-4 rounded-2xl border bg-white p-4 shadow">
            <h3 className="mb-3 text-lg font-semibold">Details</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label="Author" value={book.author} />
                <Detail label="Publisher" value={book.publisher} />
                <Detail label="Year" value={book.year} />
                <Detail label="Pages" value={book.pages} />
                <Detail label="Language" value={book.language} />
                <div className="text-center">
                    <div className="text-sm font-medium text-gray-600">Genres</div>
                    {genres.length ? (
                        <div className="mt-1 flex flex-wrap justify-center gap-2">
                            {genres.map((g) => (
                                <span key={g} className="rounded-full bg-gray-100 px-2 py-1 text-xs">{g}</span>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-1 text-sm text-gray-500">—</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
    return (
        <div>
            <div className='text-sm font-medium text-gray-600'>{label}</div>
            <div className='mt-1 text-sm text-gray-900'>{value ?? '-'}</div>
        </div>
    )
}

function HorizontalRail({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <section className="mt-6">
            <h2 className="mb-3 text-xl font-semibold">{title}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth
                        [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {children}
            </div>
        </section>
    );
}

function BookCard({ book, onSelect }: { book: Book, onSelect: (b: Book) => void }) {
    const img = posterFor(book);
    return (
        <button
            onClick={() => onSelect(book)}
            className="snap-start w-[180px] shrink-0 overflow-hidden rounded-2xl shadow hover:scale-[1.02] transition"
            title={book.title}
            aria-label={`Open ${book.title}`}
        >
            <div className="relative h-[260px]">
                <img src={img} alt={book.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-left text-sm font-medium text-white line-clamp-2">
                    {book.title}
                </div>
            </div>
        </button>
    );
}


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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [active, setActive] = useState<Book | null>(null);
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
            <div className="space-y-3">
                {/* search skeleton */}
                <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-gray-200" />
                {/* hero skeleton */}
                <div className="h-[360px] w-full animate-pulse rounded-3xl bg-gray-200" />
                {/* rail skeleton (horizontal) */}
                <div className="mt-4 flex gap-4">
                    {Array.from({ length: perPage }).map((_, i) => (
                        <div key={i} className="h-[260px] w-[180px] animate-pulse rounded-2xl bg-gray-200" />
                    ))}
                </div>
            </div>
        );

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="space-y-3">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setParams(1, perPage, qInput);
                }}
                className="mb-2 flex items-center gap-2"
            >
                <input
                    type="search"
                    placeholder="Search…"
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                >
                    Search
                </button>
                {q && (
                    <button
                        type="button"
                        onClick={() => {
                            setQInput('');
                            setParams(1, perPage, '');
                        }}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
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
                    <div className="rounded-xl border bg-white p-6 text-center text-sm text-gray-500">
                        No books found.
                    </div>
                )}
            </HorizontalRail>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setParams(page - 1, perPage)}
                        disabled={page <= 1}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                        Prev
                    </button>

                    <span className="text-sm text-gray-600">Page {page}</span>

                    <button
                        onClick={() => setParams(page + 1, perPage)}
                        disabled={books.length < perPage}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                        Next
                    </button>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    Per page:{' '}
                    <select
                        value={perPage}
                        onChange={(e) => setParams(1, Number(e.target.value))}
                        className="rounded-md border px-2 py-1"
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
