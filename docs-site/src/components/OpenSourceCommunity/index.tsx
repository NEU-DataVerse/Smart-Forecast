import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type TechBadgeProps = {
  icon: string;
  name: string;
  role: string;
};

const techItems: TechBadgeProps[] = [
  {
    icon: '📱',
    name: 'Expo React Native',
    role: 'Giao diện người dùng, Notifications',
  },
  {
    icon: '🖥️',
    name: 'Next.js, TypeScript',
    role: 'Dashboard Quản lý, Trực quan hóa',
  },
  {
    icon: '⚙️',
    name: 'NestJS, TypeScript',
    role: 'Xử lý logic nghiệp vụ, Incident Management',
  },
  {
    icon: '🌐',
    name: 'FIWARE Orion-LD',
    role: 'Quản lý Dữ liệu Ngữ cảnh (Context Data)',
  },
];

type PrincipleProps = {
  title: string;
  description: string;
};

const principles: PrincipleProps[] = [
  {
    title: 'Minh bạch',
    description:
      'Mã nguồn mở giúp mọi người hiểu rõ cách dữ liệu được xử lý và cách hệ thống đưa ra cảnh báo, từ đó xây dựng lòng tin vào công nghệ.',
  },
  {
    title: 'Sự tham gia của Cộng đồng',
    description:
      'Khuyến khích các nhà phát triển và chuyên gia cùng nhau cải tiến tính năng, độ chính xác của mô hình dự báo và độ tin cậy của hệ thống.',
  },
  {
    title: 'Tính Bền vững',
    description:
      'Đảm bảo dự án không phụ thuộc vào một tổ chức duy nhất, dễ dàng tích hợp và mở rộng cho các khu vực hoặc ứng dụng khác trong tương lai.',
  },
];

function TechBadge({ icon, name, role }: TechBadgeProps) {
  return (
    <div className={styles.techBadge}>
      <div className={styles.techIcon}>{icon}</div>
      <div className={styles.techContent}>
        <Heading as="h4" className={styles.techName}>
          {name}
        </Heading>
        <p className={styles.techRole}>Vai trò: {role}</p>
      </div>
    </div>
  );
}

function PrincipleCard({ title, description }: PrincipleProps) {
  return (
    <div className={styles.principleCard}>
      <Heading as="h4" className={styles.principleTitle}>
        {title}
      </Heading>
      <p className={styles.principleDescription}>{description}</p>
    </div>
  );
}

export default function OpenSourceCommunity(): ReactNode {
  return (
    <section id="opensource" className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Nguồn mở & Cộng đồng
          </Heading>
        </div>

        <div className={styles.subsection}>
          <Heading as="h3" className={styles.subsectionTitle}>
            Triết lý phát triển nguồn mở
          </Heading>
          <div className={styles.principleGrid}>
            {principles.map((principle, idx) => (
              <PrincipleCard key={idx} {...principle} />
            ))}
          </div>
        </div>

        <div className={styles.twoColumnGrid}>
          <div className={styles.infoCard}>
            <Heading as="h3" className={styles.infoTitle}>
              Chứng thực & Đảm bảo
            </Heading>
            <ul className={styles.infoList}>
              <li>
                <strong>FIWARE:</strong> Đảm bảo khả năng tương tác mạnh mẽ với các hệ thống Smart
                City khác.
              </li>
              <li>
                <strong>Firebase Cloud Messaging (FCM):</strong> Đảm bảo việc gửi thông báo tức
                thời, đáng tin cậy.
              </li>
              <li>
                <strong>Docker:</strong> Đảm bảo môi trường phát triển nhất quán và triển khai ổn
                định trên bất kỳ máy chủ nào.
              </li>
              <li>
                <strong>Giấy phép MIT (MIT License):</strong> Cho phép sử dụng, sao chép, chỉnh sửa
                và phân phối mã nguồn một cách tự do.
              </li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <Heading as="h3" className={styles.infoTitle}>
              Cách thức tham gia và cộng tác
            </Heading>
            <p className={styles.infoText}>Chúng tôi chào đón mọi cấp độ đóng góp:</p>
            <ul className={styles.infoList}>
              <li>
                <strong>Bắt đầu đóng góp:</strong> Truy cập trang tài liệu (Docs) của chúng tôi để
                xem hướng dẫn chi tiết về quy trình làm việc và cách gửi Pull Request đầu tiên.
              </li>
              <li>
                <strong>Kênh giao tiếp chính:</strong> Sử dụng GitHub Issues để báo cáo lỗi hoặc đề
                xuất tính năng mới trực tiếp, đảm bảo tính minh bạch trong quản lý dự án.
              </li>
            </ul>
            <div className={styles.ctaContainer}>
              <Link
                className="button button--primary button--lg"
                href="https://github.com/NEU-DataVerse/Smart-Forecast"
                target="_blank"
                rel="noopener noreferrer"
              >
                ⭐ Bắt đầu đóng góp trên GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
