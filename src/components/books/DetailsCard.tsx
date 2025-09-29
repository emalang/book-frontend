import type { Book } from '../../types/book';
import { normalizeGenres } from '../../utils/images';

export default function DetailsCard({ book }: { book: Book | null }) {
  if (!book) return null;
  const genres = normalizeGenres(book.genres);
  return (
    <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur-md">
      <h3 className="mb-3 text-lg font-semibold">Details</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Detail label="Author" value={book.author} />
        <Detail label="Publisher" value={book.publisher} />
        <Detail label="Year" value={book.year} />
        <Detail label="Pages" value={book.pages} />
        <Detail label="Language" value={book.language} />
        <div className="text-center">
          <div className="text-sm font-medium text-white/80">Genres</div>
          {genres.length ? (
            <div className="mt-1 flex flex-wrap justify-center gap-2">
              {genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs text-white">
                  {g}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-1 text-sm text-white/60">—</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="text-sm font-medium text-white/70">{label}</div>
      <div className="mt-1 text-sm text-white">{value ?? '-'}</div>
    </div>
  );
}
