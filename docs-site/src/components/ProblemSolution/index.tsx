import type { ReactNode } from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function ProblemSolution(): ReactNode {
  return (
    <section id="about" className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Vấn đề & Giải pháp
          </Heading>
          <p className={styles.sectionSubtitle}>
            Chuyển đổi quy trình cảnh báo và quản lý sự cố môi trường thành quy trình số hóa, theo
            thời gian thực.
          </p>
        </div>

        {/* Problem Section */}
        <div className={styles.gridContainer}>
          <Heading as="h3" className={styles.gridTitle}>
            Thách thức hiện tại
          </Heading>

          <div className={styles.cardGrid}>
            {/* User Problem */}
            <div className={styles.problemCard}>
              <div className={styles.cardHeader}>
                <Heading as="h4" className={styles.cardTitle}>
                  Người dùng
                </Heading>
              </div>
              <p className={styles.cardText}>
                <strong>Vấn đề:</strong> Thiếu thông tin kịp thời và cá nhân hóa về rủi ro môi
                trường trong khu vực sinh sống.
              </p>
              <p className={styles.cardHighlight}>
                <strong>Hậu quả:</strong> Phản ứng bị động, không được cảnh báo kịp thời dẫn đến
                thiệt hại về người và của.
              </p>
            </div>

            {/* Admin Problem */}
            <div className={styles.problemCard}>
              <div className={styles.cardHeader}>
                <Heading as="h4" className={styles.cardTitle}>
                  Quản trị viên
                </Heading>
              </div>
              <p className={styles.cardText}>
                <strong>Vấn đề:</strong> Phản ứng chậm, thiếu dữ liệu đồng bộ do hệ thống giám sát
                phân mảnh và dữ liệu không theo tiêu chuẩn Mở liên kết (LOD).
              </p>
              <p className={styles.cardHighlight}>
                <strong>Hậu quả:</strong> Quản lý thủ công, thiếu công cụ phân tích chiến lược hiệu
                quả.
              </p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className={styles.gridContainer}>
          <Heading as="h3" className={styles.gridTitle}>
            Smart ForeCast: Cầu nối số hóa
          </Heading>

          <div className={styles.cardGrid}>
            {/* User Solution */}
            <div className={styles.solutionCard}>
              <div className={styles.cardHeader}>
                <Heading as="h4" className={styles.cardTitle}>
                  Người dùng
                </Heading>
              </div>
              <p className={styles.cardText}>
                <strong>Chức năng cốt lõi:</strong> Cảnh báo thông minh và phản hồi cộng đồng (Gửi
                báo cáo sự cố kèm GPS/ảnh).
              </p>
              <p className={styles.cardSuccess}>
                <strong>Lợi ích chuyển đổi số:</strong> Người dân được bảo vệ chủ động, góp phần tạo
                ra Dữ liệu nguồn mở cho Chính phủ.
              </p>
            </div>

            {/* Admin Solution */}
            <div className={styles.solutionCard}>
              <div className={styles.cardHeader}>
                <Heading as="h4" className={styles.cardTitle}>
                  Quản trị viên
                </Heading>
              </div>
              <p className={styles.cardText}>
                <strong>Chức năng cốt lõi:</strong> Giám sát LOD thời gian thực và công cụ tạo cảnh
                báo diện rộng phản ứng khẩn cấp.
              </p>
              <p className={styles.cardSuccess}>
                <strong>Lợi ích chuyển đổi số:</strong> Ra quyết định dựa trên dữ liệu, tối ưu hóa
                quy trình phản ứng, đạt mục tiêu <strong>minh bạch</strong> và{' '}
                <strong>hiệu quả</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
