
import './App.css'
import BooksAxios from './Books';

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                    <h1 className="text-lg font-semibold">📚 Book Library</h1>
                    <span className="text-sm text-gray-500">demo</span>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6">
                <BooksAxios />
            </main>
        </div>
    );
}
