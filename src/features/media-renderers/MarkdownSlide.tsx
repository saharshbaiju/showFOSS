import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { SlideProps } from './types'
import { useSettingsStore } from '@/store/useSettingsStore'
import { readableTextOn } from '@/lib/color'

type MdProps<T extends keyof HTMLElementTagNameMap> = ComponentPropsWithoutRef<T> & {
  children?: ReactNode
}

const components = {
  h1: (p: MdProps<'h1'>) => (
    <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight md:text-7xl" {...p} />
  ),
  h2: (p: MdProps<'h2'>) => (
    <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-5xl" {...p} />
  ),
  h3: (p: MdProps<'h3'>) => <h3 className="mb-3 text-2xl font-semibold md:text-3xl" {...p} />,
  p: (p: MdProps<'p'>) => <p className="mb-4 text-xl leading-relaxed opacity-90 md:text-3xl" {...p} />,
  ul: (p: MdProps<'ul'>) => (
    <ul className="mb-4 space-y-2 text-left text-xl opacity-90 md:text-3xl" {...p} />
  ),
  ol: (p: MdProps<'ol'>) => (
    <ol className="mb-4 list-decimal space-y-2 pl-8 text-left text-xl opacity-90 md:text-3xl" {...p} />
  ),
  li: (p: MdProps<'li'>) => <li className="marker:text-accent" {...p} />,
  a: (p: MdProps<'a'>) => <a className="text-accent underline underline-offset-4" {...p} />,
  strong: (p: MdProps<'strong'>) => <strong className="font-bold" {...p} />,
  em: (p: MdProps<'em'>) => <em className="italic" {...p} />,
  code: (p: MdProps<'code'>) => (
    <code className="font-data rounded-md bg-current/10 px-2 py-0.5 text-[0.85em]" {...p} />
  ),
  blockquote: (p: MdProps<'blockquote'>) => (
    <blockquote className="border-l-4 border-accent pl-5 text-left italic opacity-80" {...p} />
  ),
  hr: () => <hr className="my-6 border-current/20" />,
}

export function MarkdownSlide({ item }: SlideProps) {
  const bg = useSettingsStore((s) => s.theme.presentationBg)
  const text = item.source.kind === 'inline' ? item.source.text : ''
  return (
    <div
      className="flex h-full w-full items-center justify-center overflow-auto px-10 py-12 text-center md:px-20"
      style={{ color: readableTextOn(bg) }}
    >
      <div className="max-w-5xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {text || '# Your announcement\n\nWrite **Markdown** here.'}
        </ReactMarkdown>
      </div>
    </div>
  )
}
