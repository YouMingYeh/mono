/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface MarkdownProps {
  children: string;
  pure?: boolean;
}

interface CodeBlockProps {
  inline: boolean;
  className?: string;
  children: React.ReactNode;
}

// Extracted CodeBlock component for better organization
const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');

  if (!inline && match) {
    return (
      <pre
        className={cn(
          className,
          'bg-muted relative mt-2 w-full max-w-[80dvw] rounded-lg p-3 text-sm md:max-w-[500px]'
        )}
        {...props}
      >
        <button
          className="bg-background absolute right-2 top-2 rounded-md border p-1 text-xs"
          onClick={() => {
            const content = String(children) || '';
            navigator.clipboard.writeText(content);
            toast('複製成功');
          }}
        >
          複製
        </button>
        <div className="overflow-x-scroll">
          <code className={match[1]}>{children}</code>
        </div>
      </pre>
    );
  }

  return (
    <code className={cn(className, 'bg-muted rounded-md px-1 py-0.5 text-sm')} {...props}>
      {children}
    </code>
  );
};

// Create our markdown components configuration
const createMarkdownComponents = (): Components => ({
  code: ({ inline = false, className, children, ...props }) => (
    <CodeBlock inline={inline} className={className} {...props}>
      {children}
    </CodeBlock>
  ),

  ol: ({ children, ...props }) => (
    <ol className="ml-4 list-outside list-decimal" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li className="py-1" {...props}>
      {children}
    </li>
  ),

  ul: ({ children, ...props }) => (
    <ul className="ml-4 list-outside list-disc" {...props}>
      {children}
    </ul>
  ),

  strong: ({ children, ...props }) => (
    <span className="font-semibold" {...props}>
      {children}
    </span>
  ),

  a: ({ children, href, ...props }) => (
    <Link
      className="text-blue-500 hover:underline"
      target="_blank"
      rel="noreferrer"
      href={href || '#'}
      {...props}
    >
      {children}
    </Link>
  ),

  // Heading components with consistent styling pattern
  h1: ({ children, ...props }) => (
    <h1 className="mb-2 mt-6 text-3xl font-semibold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-2 mt-6 text-2xl font-semibold" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mb-2 mt-6 text-lg font-semibold" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="mb-2 mt-6 text-base font-semibold" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="mb-2 mt-6 text-sm font-semibold" {...props}>
      {children}
    </h6>
  ),

  // Using a component for softbreak to ensure proper typing
  softbreak: () => <br />
});

/**
 * Renders markdown content with customized styling
 *
 * @param children - The markdown string to render
 * @param pure - If true, uses default React Markdown styling instead of custom components
 */
const NonMemoizedMarkdown: React.FC<MarkdownProps> = ({ children, pure = false }) => {
  // Replace HTML line breaks with newlines for proper markdown parsing
  const parsedContent = children.replace(/<br\s*\/?>/g, '\n').replace(/~/g, '-');

  // Common plugins for both pure and styled versions
  const plugins = [remarkGfm, remarkBreaks];

  return pure ? (
    <ReactMarkdown remarkPlugins={plugins}>{parsedContent}</ReactMarkdown>
  ) : (
    <ReactMarkdown remarkPlugins={plugins} components={createMarkdownComponents()}>
      {parsedContent}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps: MarkdownProps, nextProps: MarkdownProps) => prevProps.children === nextProps.children
);

// Add displayName for better debugging
Markdown.displayName = 'Markdown';
