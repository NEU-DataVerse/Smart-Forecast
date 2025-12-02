import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function HeroSection(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={styles.hero}>
      <div className={styles.heroBackground}>
        <img
          src={useBaseUrl('/img/banner.png')}
          alt="Smart Forecast Banner"
          className={styles.heroBannerImage}
        />
        <div className={styles.heroOverlay} />
      </div>

      <div className={clsx('container', styles.heroContent)}>
        <div className={styles.heroText}>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroTagline}>{siteConfig.tagline}</p>
          <p className={styles.heroSlogan}>"Khi dữ liệu mở trở thành cảnh báo sớm cho cộng đồng"</p>

          <div className={styles.heroButtons}>
            <Link className="button button--primary button--lg" to="/docs">
              Bắt đầu khám phá
            </Link>
            <Link
              className="button button--outline button--secondary button--lg"
              href="https://github.com/NEU-DataVerse/Smart-Forecast"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⭐ GitHub
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
