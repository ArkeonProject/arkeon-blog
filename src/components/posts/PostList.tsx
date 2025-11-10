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
    <div className={`grid md:grid-cols-2 gap-10 ${className}`.trim()}>
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.slug}`}
          className="block rounded-2xl shadow-md shadow-[#007EAD]/20 hover:shadow-[#00aaff]/50 transition-shadow duration-300"
          aria-label={post.title}
        >
          <PostCard post={post} />
        </Link>
      ))}
    </div>
  );
}
