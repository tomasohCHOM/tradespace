import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics' },
  { id: 2, name: 'Clothing', slug: 'clothing' },
  { id: 3, name: 'Accessories', slug: 'accessories' },
];

const dummyThreads = [
  { id: 1, title: 'Best headphones under $100?', replies: 12, lastActive: '2h ago' },
  { id: 2, title: 'Winter jackets discussion', replies: 5, lastActive: '1d ago' },
  { id: 3, title: 'Sneaker releases 2026', replies: 8, lastActive: '3d ago' },
];

const ForumsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].slug);
  const { tradespaceId } = Route.useParams();

  const filteredThreads = dummyThreads; // Later: filter by category

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Category Tabs */}
      <div className="flex gap-4 overflow-x-auto border-b pb-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-3 py-1 rounded ${
              activeCategory === cat.slug
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.map((thread) => (
          <Link
            key={thread.id}
            to="/_auth/tradespaces/$tradespaceId/forums/thread/$threadId"
            params={{ tradespaceId, threadId: thread.id.toString() }}
            className="block p-4 border rounded hover:shadow-md"
          >
            <h3 className="font-semibold">{thread.title}</h3>
            <p className="text-sm text-gray-600">
              {thread.replies} replies • last active {thread.lastActive}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_auth/tradespaces/$tradespaceId/forums')({
  component: ForumsPage,
});