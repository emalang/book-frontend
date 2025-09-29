import { posterFor } from '../../utils/images';
import type { Book } from '../../types/book';

export default function BookCard({
  book,
  onSelect,
}: {
  book: Book;
  onSelect: (b: Book) => void;
}) {
  const img = posterFor(book);
  return (
    <button
      onClick={() => onSelect(book)}
      className="snap-start w-[180px] shrink-0 overflow-hidden rounded-2xl shadow hover:scale-[1.02] transition"
      title={book.title}
      aria-label={`Open ${book.title}`}>
      <div className="relative h-[260px]">
        <img
          src={img}
          alt={book.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 text-left text-sm font-medium text-white line-clamp-2">
          {book.title}
        </div>
      </div>
    </button>
  );
}
