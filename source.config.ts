import { defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    // MDX compilation options
    mdx: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    // Frontmatter validation schema
    schema: {
      title: 'string',
      description: 'string?',
      image: 'string?',
      tags: 'string[]?',
    },
  },
  meta: {
    // Meta collection options
    schema: {
      title: 'string',
      description: 'string?',
      pages: 'string[]',
    },
  },
}); 