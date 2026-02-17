import { marked } from 'marked';

type MarkdownProps = {
  content: string;
  className?: string;
};

marked.setOptions({
  gfm: true,
  breaks: true,
});

export const Markdown = ({ content, className = '' }: MarkdownProps) => {
  const html = marked.parse(content) as string;

  return (
    <div
      className={`space-y-4 text-pretty text-base leading-relaxed text-[var(--text-secondary)] [&_a]:text-[var(--accent-cyan)] [&_a]:underline [&_a]:underline-offset-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-[var(--text-primary)] [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)] [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--text-primary)] [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
