import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Giám sát AQI realtime',
    emoji: '🌡️',
    description: (
      <>
        Theo dõi chất lượng không khí (AQI, PM2.5, PM10) và dữ liệu thời tiết theo thời gian thực từ
        các trạm quan trắc trên toàn thành phố.
      </>
    ),
  },
  {
    title: 'Cảnh báo thiên tai thông minh',
    emoji: '⚠️',
    description: (
      <>
        Nhận cảnh báo sớm về các hiện tượng thời tiết cực đoan, ngập úng, cháy rừng và ô nhiễm môi
        trường qua push notification.
      </>
    ),
  },
  {
    title: 'Báo cáo sự cố từ cộng đồng',
    emoji: '📝',
    description: (
      <>
        Người dân có thể báo cáo sự cố môi trường với ảnh và vị trí GPS, giúp chính quyền phản ứng
        nhanh và hiệu quả hơn.
      </>
    ),
  },
];

function Feature({ title, emoji, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureEmoji}>{emoji}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            ✨ Tính năng nổi bật
          </Heading>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
