import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: string;
  role: string;
};

const mobileFeatures: FeatureItem[] = [
  {
    title: 'Cảnh báo tức thời',
    description:
      'Bảo vệ sức khỏe bằng cách thông báo ngay lập tức về thời tiết khắc nghiệt, AQI vượt ngưỡng và cảnh báo thiên tai khẩn cấp.',
    role: 'Tiện ích cá nhân hóa',
  },
  {
    title: 'Báo cáo sự cố từ cộng đồng',
    description: 'Cho phép người dùng gửi báo cáo sự cố (ngập, sạt lở) kèm ảnh và vị trí GPS.',
    role: 'Đóng góp Dữ liệu nguồn mở',
  },
  {
    title: 'Bản đồ trực quan',
    description:
      'Xem vị trí trạm quan sát, vùng ô nhiễm và vị trí/số lượng thiên tai theo thời gian thực.',
    role: 'Khai thác LOD',
  },
];

const webFeatures: FeatureItem[] = [
  {
    title: 'Giám sát LOD thời gian thực',
    description: 'Theo dõi biểu đồ AQI, nhiệt độ, mưa, gió và bản đồ cảm biến trực tiếp.',
    role: 'Khả năng tương tác',
  },
  {
    title: 'Phản ứng khẩn cấp',
    description: 'Công cụ tạo cảnh báo diện rộng nhanh chóng đến cư dân đã được khoanh vùng.',
    role: 'Số hóa phản ứng',
  },
  {
    title: 'Quản lý sự cố tập trung',
    description: 'Xem, phê duyệt và quản lý danh sách sự cố/thiên tai do người dân gửi.',
    role: 'Hợp nhất dữ liệu',
  },
];

function FeatureCard({ title, description, role }: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureContent}>
        <Heading as="h4" className={styles.featureTitle}>
          {title}
        </Heading>
        <p className={styles.featureDescription}>{description}</p>
        <span className={styles.featureRole}>Vai trò: {role}</span>
      </div>
    </div>
  );
}

export default function ProductFeatures(): ReactNode {
  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Các tính năng chính của sản phẩm
          </Heading>
        </div>

        {/* Mobile App Section */}
        <div className={styles.productSection}>
          <div className={styles.productGrid}>
            <div className={styles.mockupContainer}>
              <img
                src={useBaseUrl('/img/home-1-app.jpg')}
                alt="Smart ForeCast Mobile App UI"
                className={styles.mockupImage}
                loading="lazy"
              />
              <img
                src={useBaseUrl('/img/home-2-app.jpg')}
                alt="Smart ForeCast Mobile App UI"
                className={styles.mockupImage}
                loading="lazy"
              />
              <img
                src={useBaseUrl('/img/map-alert-1-app.jpg')}
                alt="Smart ForeCast Mobile App UI"
                className={styles.mockupImage}
                loading="lazy"
              />
            </div>
            <div className={styles.productContent}>
              <span className={styles.productBadge}>Mobile App (Dành cho Người dùng)</span>

              <div className={styles.featureList}>
                {mobileFeatures.map((feature, idx) => (
                  <FeatureCard key={idx} {...feature} />
                ))}
              </div>

              <div className={styles.ctaContainer}>
                <Link className="button button--primary button--lg" to="#mobile-download">
                  📥 Tải Ứng dụng
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Web Dashboard Section */}
        <div className={styles.productSection}>
          <div className={`${styles.productGrid} ${styles.reversed}`}>
            <div className={styles.productContent}>
              <span className={`${styles.productBadge} ${styles.badgeIndigo}`}>
                Web Dashboard (Dành cho Quản trị viên)
              </span>

              <div className={styles.featureList}>
                {webFeatures.map((feature, idx) => (
                  <FeatureCard key={idx} {...feature} />
                ))}
              </div>

              <div className={styles.ctaContainer}>
                <Link
                  className="button button--outline button--secondary button--lg"
                  href="https://github.com/NEU-DataVerse/Smart-Forecast"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ⭐ Đóng góp cho Hệ thống
                </Link>
              </div>
            </div>
            <div className={styles.mockupContainer}>
              <img
                src={useBaseUrl('/img/dashboard-web.png')}
                alt="Smart ForeCast Web Dashboard UI"
                className={styles.webMockupImage}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
