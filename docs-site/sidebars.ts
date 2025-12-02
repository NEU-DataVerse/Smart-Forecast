import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Smart Forecast Documentation Sidebar
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    'getting-started',
    {
      type: 'category',
      label: 'Kiến trúc & Thiết kế',
      items: ['architecture', 'data-model'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Triển khai & Vận hành',
      items: ['deployment', 'env', 'troubleshooting'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Phát triển',
      items: ['dev-guide', 'api'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Hướng dẫn sử dụng',
      items: ['user-guide', 'demo'],
      collapsed: false,
    },
    'open-source',
  ],
};

export default sidebars;
