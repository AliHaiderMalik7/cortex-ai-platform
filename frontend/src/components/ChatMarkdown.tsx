import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        code: ({ children }) => (
          <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
        ),
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="mb-2 overflow-x-auto last:mb-0">
            <table className="min-w-full border-collapse text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b border-current/20">{children}</thead>,
        tr: ({ children }) => <tr className="border-b border-current/10 last:border-0">{children}</tr>,
        th: ({ children }) => <th className="px-3 py-1.5 font-semibold">{children}</th>,
        td: ({ children }) => <td className="px-3 py-1.5 align-top">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
