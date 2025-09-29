import './App.css';
import BooksAxios from './Books';

export default function App() {
  return (
    <div className="min-h-screen w-full text-white bg-slate-950 relative overflow-x-hidden overflow-y-scroll [scrollbar-gutter:stable] ">
      <div
        className="pointer-events-none absolute inset-0
        bg-[radial-gradient(800px_circle_at_0%_0%,rgba(56,189,248,0.12),transparent_40%),
             radial-gradient(900px_circle_at_100%_0%,rgba(34,197,94,0.10),transparent_40%),
             radial-gradient(1000px_circle_at_50%_100%,rgba(168,85,247,0.10),transparent_40%)]"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]
        bg-[linear-gradient(to_right,s#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
        bg-[size:24px_24px]"
      />
      <header className="relative z-10 sticky top-0 border-b border-white/10 bg-slate-900/40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-300 via-emerald-300 to-fuchsia-300 bg-clip-text text-transparent">
            Book Library
          </h1>
        </div>
      </header>
      <main className="relative z-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-6">
          <BooksAxios />
        </div>
      </main>
    </div>
  );
}
