import { User, Building2 } from 'lucide-react';

export function TypeSelector({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Website</h1>
        <p className="text-gray-600">Build and preview for free. Pay only when you publish.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <button
          onClick={() => onSelect('personal')}
          className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-lg transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
            <User className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal</h2>
          <p className="text-gray-500 text-center text-sm">
            Portfolio, resume, or personal brand page
          </p>
        </button>

        <button
          onClick={() => onSelect('brand')}
          className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-lg transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
            <Building2 className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Brand / Business</h2>
          <p className="text-gray-500 text-center text-sm">
            Company, shop, or service business page
          </p>
        </button>
      </div>
    </div>
  );
}
