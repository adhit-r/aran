// @ts-check
// Note: type annotations JSDoc Light syntax are valid TypeScript and JavaScript.
// Soon, this file will be type-checked by Typescript. See https://docusaurus.io/docs/typescript-support

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Aran API Sentinel',
  tagline: 'API Security, Governance, Catalog, and Discovery',
  favicon: 'img/favicon.ico', // Assuming a favicon will be added later

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'your-org', // Usually your GitHub org/user name.
  projectName: 'aran-api-sentinel-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false, // Disable the blog
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   // editUrl:
        //   //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg', // Assuming a social card image will be added later
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Aran API Sentinel',
        // logo: { // Logo can be added once available
        //   alt: 'Aran API Sentinel Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar', // Matches the sidebar export in sidebars.js
            position: 'left',
            label: 'Documentation',
          },
          {to: '/product', label: 'Product', position: 'left'}, // Placeholder for product pages link
          // {
          //   href: 'https://github.com/your-org/your-repo', // Link to project repo
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Getting Started',
                to: '/docs/getting-started/installation',
              },
            ],
          },
          {
            title: 'Community', // Placeholder
            items: [
              // {
              //   label: 'Stack Overflow',
              //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              // },
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/docusaurus',
              // },
              // {
              //   label: 'Twitter',
              //   href: 'https://twitter.com/docusaurus',
              // },
            ],
          },
          {
            title: 'More', // Placeholder
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog', // If blog is enabled
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/your-org/your-repo', // Replace with actual repo
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Your Company, Inc. Built with Docusaurus.`,
      },
      // prism: { // Code highlighting theme
      //   theme: lightCodeTheme,
      //   darkTheme: darkCodeTheme,
      // },
    }),
};

module.exports = config;
