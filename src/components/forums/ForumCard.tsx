import { Eye, MessageSquare, Pin, ThumbsUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import type { ForumPost } from '@/types/forums';
import type React from 'react';

type Props = {
  post: ForumPost;
};

export const ForumCard: React.FC<Props> = ({ post }) => {
  return (
    <Card
      key={post.id}
      className="p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <Avatar className="size-10">
          <AvatarFallback>{post.authorInitials}</AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            {post.isPinned && (
              <Pin className="size-4 text-primary mt-1 shrink-0" />
            )}
            <h3 className="flex-1">{post.title}</h3>
            <Badge variant="secondary">{post.category}</Badge>
          </div>

          <p className="text-muted-foreground mb-3 line-clamp-2">
            {post.content}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span>Posted by {post.author}</span>
            <span>•</span>
            <span>{post.timestamp}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ThumbsUp className="size-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="size-4" />
                <span>{post.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="size-4" />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
