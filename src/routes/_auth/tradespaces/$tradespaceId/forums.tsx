import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ForumCard } from '@/components/forums/ForumCard';
import { NewPostDialog } from '@/components/forums/NewPostDialog';
import { useForumPosts } from '@/hooks/useForumPosts';

export const Route = createFileRoute('/_auth/tradespaces/$tradespaceId/forums')(
  { component: ForumsView },
);

type CategoryFilter = 'all' | 'discussion' | 'question' | 'story';
type SortOption = 'recent' | 'popular' | 'trending' | 'unanswered';

export default function ForumsView() {
  const { tradespaceId } = Route.useParams();
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const { posts, loading, error } = useForumPosts(
    tradespaceId,
    categoryFilter,
    sortOption,
  );

  return (
    <>
      <NewPostDialog
        open={showNewPostModal}
        onOpenChange={setShowNewPostModal}
        tradespaceId={tradespaceId}
      />

      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl mb-2">Forums</h2>
          <Button className="gap-2" onClick={() => setShowNewPostModal(true)}>
            <Plus className="size-4" />
            New Post
          </Button>
        </div>

      <Tabs
        value={categoryFilter}
        onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
      >
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="discussion">Discussions</TabsTrigger>
          <TabsTrigger value="question">Questions</TabsTrigger>
          <TabsTrigger value="story">Stories</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-4">
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="unanswered">Unanswered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading posts...
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-destructive">
          Error loading posts: {error.message}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No posts yet. Be the first to create one!
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <ForumCard key={post.id} post={post} />
          ))}
        </div>
      )}
      </div>
    </>
  );
}
