import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function HeroSection(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={clsx('container', styles.heroContent)}>
        <div className={styles.heroText}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot}></span>
            Dự án Nguồn mở vì cộng đồng
          </div>

          <Heading as="h1" className={styles.heroTitle}>
            Dự án Nguồn mở <span className={styles.heroHighlight}>Smart Forecast</span>
            <br />
            Nền tảng Đô thị thông minh
          </Heading>

          <p className={styles.heroTagline}>
            Nền tảng Nguồn mở áp dụng Dữ liệu mở liên kết (LOD) để chuyển đổi số, cung cấp Giao diện
            Quản trị phản ứng khẩn cấp (Web) và cảnh báo tức thời cho Người dân (Mobile App).
          </p>
        </div>
      </div>

      <div className={styles.heroBannerContainer}>
        <img
          src={useBaseUrl('/img/banner.png')}
          alt="Smart Forecast Banner"
          className={styles.heroBannerImage}
        />
      </div>
    </header>
  );
}
