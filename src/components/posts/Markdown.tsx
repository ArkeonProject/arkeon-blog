import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function Markdown({ content }: { content: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-img:rounded-xl prose-img:my-4 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  )
}