import { Link } from "react-router-dom";
import type { PostListItem } from "../../types/post";
import PostCard from "./PostCard";

interface PostListProps {
  posts: PostListItem[];
  className?: string;
}

export default function PostList({ posts, className = "" }: PostListProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`.trim()}>
      {posts.map((post, idx) => (
        <div
          key={post.id}
          className="animate-reveal"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <Link
            to={`/post/${post.slug}`}
            className="block h-full"
            aria-label={post.title}
          >
            <PostCard post={post} />
          </Link>
        </div>
      ))}
    </div>
  );
}
