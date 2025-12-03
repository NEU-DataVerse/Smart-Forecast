import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HeroSection from '@site/src/components/HeroSection';
import ProblemSolution from '@site/src/components/ProblemSolution';
import ProductFeatures from '@site/src/components/ProductFeatures';
import ScreenshotCarousel from '@site/src/components/ScreenshotCarousel';
import OpenSourceCommunity from '@site/src/components/OpenSourceCommunity';
import TechStack from '@site/src/components/TechStack';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Trang chủ"
      description="Nền tảng dự báo thời tiết và cảnh báo môi trường thông minh - Giám sát AQI, cảnh báo thiên tai, báo cáo sự cố từ cộng đồng"
    >
      <HeroSection />
      <main>
        <ProblemSolution />
        <ProductFeatures />
        <ScreenshotCarousel />
        <OpenSourceCommunity />
        <TechStack />
      </main>
    </Layout>
  );
}
