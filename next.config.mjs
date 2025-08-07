import { createMDX } from 'fumadocs-mdx/next';
import { defineDocs } from 'fumadocs-mdx/config';

const docs = defineDocs({
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
});

const withMDX = createMDX({
  configs: [docs],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default withMDX(nextConfig); 