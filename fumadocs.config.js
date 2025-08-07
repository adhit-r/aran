const { defineDocs } = require('fumadocs-mdx/config');

module.exports = {
  docs: defineDocs({
    dir: 'content/docs',
    docs: {
      mdx: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
      schema: {
        title: 'string',
        description: 'string?',
        image: 'string?',
        tags: 'string[]?',
      },
    },
    meta: {
      schema: {
        title: 'string',
        description: 'string?',
        pages: 'string[]',
      },
    },
  }),
}; 