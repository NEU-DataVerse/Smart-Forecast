import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Smart Forecast',
  tagline: 'Nền tảng dự báo thời tiết và cảnh báo môi trường thông minh',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://NEU-DataVerse.github.io',
  baseUrl: '/Smart-Forecast/',

  organizationName: 'NEU-DataVerse',
  projectName: 'Smart-Forecast',

  trailingSlash: false,
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeConfigs: {
      vi: {
        label: 'Tiếng Việt',
        htmlLang: 'vi-VN',
      },
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/NEU-DataVerse/Smart-Forecast/tree/main/docs-site/',
        },
        blog: false, // Tắt blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/smart-forecast-social.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Smart Forecast',
      logo: {
        alt: 'Smart Forecast Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Tài liệu',
        },
        {
          href: 'https://github.com/NEU-DataVerse/Smart-Forecast',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Tài liệu',
          items: [
            {
              label: 'Giới thiệu',
              to: '/docs/',
            },
            {
              label: 'Bắt đầu',
              to: '/docs/getting-started',
            },
            {
              label: 'API Documentation',
              to: '/docs/api',
            },
          ],
        },
        {
          title: 'Phát triển',
          items: [
            {
              label: 'Kiến trúc',
              to: '/docs/architecture',
            },
            {
              label: 'Triển khai',
              to: '/docs/deployment',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/troubleshooting',
            },
          ],
        },
        {
          title: 'Cộng đồng',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/NEU-DataVerse/Smart-Forecast',
            },
            {
              label: 'Issues',
              href: 'https://github.com/NEU-DataVerse/Smart-Forecast/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/NEU-DataVerse/Smart-Forecast/discussions',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NEU DataVerse - OLP'2025. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
