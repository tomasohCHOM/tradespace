import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPosts } from '@/static/forumData';
import { ForumCard } from '@/components/forums/ForumCard';

export const Route = createFileRoute('/_auth/tradespaces/$tradespaceId/forums')(
  { component: ForumsView },
);

export default function ForumsView() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl mb-2">Forums</h2>
        <Button className="gap-2">
          <Plus className="size-4" />
          New Post
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="discussion">Discussions</TabsTrigger>
          <TabsTrigger value="question">Questions</TabsTrigger>
          <TabsTrigger value="story">Stories</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-4">
        <Select defaultValue="recent">
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

      <div className="space-y-4">
        {mockPosts.map((post) => (
          <ForumCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" size="lg">
          Load More Posts
        </Button>
      </div>
    </div>
  );
}
