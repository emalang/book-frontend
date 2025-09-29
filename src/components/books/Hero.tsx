import type { Book } from '../../types/book';
import { posterFor } from '../../utils/images';


export default function Hero({ book }: { book: Book | null }) {
    if (!book) return null;
    const bg = posterFor(book);
    return (
        <div className='relative mt-6 overflow-hidden rounded-3xl shadow-2xl'>
            <img src={bg} alt={book.title} className='h-[360px] w-full object-cover' />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">{book.title}</h1>
                <p className="mt-2 text-white/80">
                    <span className="opacity-80">Author:</span> {book.author}
                    {book.year ? <span className="opacity-70"> • {book.year}</span> : null}
                </p>
            </div>
        </div>
    );
}