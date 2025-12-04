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

const screenshotData: Screenshot[] = [
  {
    src: '/img/dashboard-web.png',
    alt: 'Dashboard',
    caption: 'Dashboard tổng quan - Theo dõi realtime các chỉ số môi trường',
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
    src: '/img/station-web.png',
    alt: 'Stations',
    caption: 'Trạm quan trắc - Quản lý mạng lưới trạm đo môi trường',
  },
];

export default function ScreenshotCarousel(): ReactNode {
  const screenshots = screenshotData.map((item) => ({
    ...item,
    src: useBaseUrl(item.src),
  }));

  return (
    <section className={styles.screenshotSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Giao diện ứng dụng
          </Heading>
          <p className={styles.sectionSubtitle}>Khám phá các tính năng qua giao diện trực quan</p>
        </div>

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
            {screenshots.map((screenshot, index) => (
              <SwiperSlide key={index} className={styles.slide}>
                <div className={styles.slideContent}>
                  <img
                    src={screenshot.src}
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
    </section>
  );
}
