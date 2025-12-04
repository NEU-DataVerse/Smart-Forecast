import type { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './styles.module.css';

type Screenshot = {
  src: string;
  alt: string;
  caption: string;
};

type ScreenshotCategory = {
  title: string;
  screenshots: Screenshot[];
};

const screenshotCategories: ScreenshotCategory[] = [
  {
    title: '📱 Ứng dụng di động (Mobile App)',
    screenshots: [
      {
        src: '/img/onboarding-1-app.jpg',
        alt: 'Onboarding 1',
        caption: 'Giới thiệu tính năng theo dõi thời tiết',
      },
      {
        src: '/img/onboarding-2-app.jpg',
        alt: 'Onboarding 2',
        caption: 'Giới thiệu tính năng cảnh báo',
      },
      {
        src: '/img/onboarding-3-app.jpg',
        alt: 'Onboarding 3',
        caption: 'Giới thiệu tính năng báo cáo sự cố',
      },
      {
        src: '/img/login-google-app.jpg',
        alt: 'Đăng nhập Google',
        caption: 'Đăng nhập bằng tài khoản Google',
      },
      {
        src: '/img/home-1-app.jpg',
        alt: 'Trang chủ 1',
        caption: 'Trang chủ - Thông tin thời tiết và AQI',
      },
      {
        src: '/img/home-2-app.jpg',
        alt: 'Trang chủ 2',
        caption: 'Trang chủ - Dự báo và cảnh báo',
      },
      {
        src: '/img/incident-1-app.jpg',
        alt: 'Báo cáo sự cố 1',
        caption: 'Form báo cáo sự cố mới',
      },
      {
        src: '/img/incident-2-app.jpg',
        alt: 'Báo cáo sự cố 2',
        caption: 'Danh sách sự cố đã báo cáo',
      },
      {
        src: '/img/map-alert-1-app.jpg',
        alt: 'Bản đồ cảnh báo 1',
        caption: 'Bản đồ hiển thị vị trí cảnh báo',
      },
      {
        src: '/img/map-alert-2-app.jpg',
        alt: 'Bản đồ cảnh báo 2',
        caption: 'Chi tiết cảnh báo trên bản đồ',
      },
      {
        src: '/img/notification-app.jpg',
        alt: 'Thông báo',
        caption: 'Cài đặt thông báo đẩy',
      },
      {
        src: '/img/profile-app.jpg',
        alt: 'Hồ sơ cá nhân',
        caption: 'Trang hồ sơ cá nhân',
      },
    ],
  },
  {
    title: '🖥️ Dashboard quản trị (Admin Web)',
    screenshots: [
      {
        src: '/img/dashboard-web.png',
        alt: 'Dashboard',
        caption: 'Dashboard tổng quan - Theo dõi realtime các chỉ số môi trường',
      },
      {
        src: '/img/alert-web.png',
        alt: 'Quản lý cảnh báo',
        caption: 'Danh sách cảnh báo với các bộ lọc và tùy chọn sắp xếp',
      },
      {
        src: '/img/chart-web.png',
        alt: 'Charts',
        caption: 'Biểu đồ dữ liệu - Phân tích xu hướng thời tiết và chất lượng không khí',
      },
      {
        src: '/img/map-alert-web.png',
        alt: 'Alert Map',
        caption: 'Bản đồ cảnh báo - Xem vị trí các cảnh báo thiên tai theo thời gian thực',
      },
      {
        src: '/img/incident-web.png',
        alt: 'Incident Management',
        caption: 'Quản lý sự cố - Tiếp nhận và xử lý báo cáo từ cộng đồng',
      },
      {
        src: '/img/map-incident-web.png',
        alt: 'Incident Map',
        caption: 'Bản đồ sự cố - Xem vị trí các sự cố được báo cáo',
      },
      {
        src: '/img/station-web.png',
        alt: 'Stations',
        caption: 'Trạm quan trắc - Quản lý mạng lưới trạm đo môi trường',
      },
      {
        src: '/img/chart-history-web.png',
        alt: 'Lịch sử dữ liệu',
        caption: 'Lịch sử dữ liệu - Xem dữ liệu theo khoảng thời gian',
      },
      {
        src: '/img/compare-station-web.png',
        alt: 'So sánh trạm',
        caption: 'So sánh dữ liệu giữa các trạm quan trắc',
      },
    ],
  },
];

export default function ScreenshotCarousel(): ReactNode {
  return (
    <section className={styles.screenshotSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Giao diện ứng dụng
          </Heading>
          <p className={styles.sectionSubtitle}>Khám phá các tính năng qua giao diện trực quan</p>
        </div>

        {screenshotCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className={styles.categoryContainer}>
            <Heading as="h3" className={styles.categoryTitle}>
              {category.title}
            </Heading>
            <div className={styles.carouselContainer}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop
                className={styles.swiper}
              >
                {category.screenshots.map((screenshot, index) => (
                  <SwiperSlide key={index} className={styles.slide}>
                    <div className={styles.slideContent}>
                      <img
                        src={useBaseUrl(screenshot.src)}
                        alt={screenshot.alt}
                        className={styles.screenshotImage}
                        loading="lazy"
                      />
                      <p className={styles.caption}>{screenshot.caption}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
