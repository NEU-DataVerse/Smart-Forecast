import type { ReactNode } from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type TechItem = {
  name: string;
  icon: string;
  color: string;
  url: string;
};

const techStack: TechItem[] = [
  {
    name: 'NestJS',
    icon: 'https://cdn.simpleicons.org/nestjs/E0234E',
    color: '#E0234E',
    url: 'https://nestjs.com/',
  },
  {
    name: 'Next.js',
    icon: 'https://cdn.simpleicons.org/nextdotjs/000000',
    color: '#000000',
    url: 'https://nextjs.org/',
  },
  {
    name: 'Expo',
    icon: 'https://cdn.simpleicons.org/expo/000020',
    color: '#000020',
    url: 'https://expo.dev/',
  },
  {
    name: 'PostgreSQL',
    icon: 'https://cdn.simpleicons.org/postgresql/4169E1',
    color: '#4169E1',
    url: 'https://www.postgresql.org/',
  },
  {
    name: 'MongoDB',
    icon: 'https://cdn.simpleicons.org/mongodb/47A248',
    color: '#47A248',
    url: 'https://www.mongodb.com/',
  },
  {
    name: 'Firebase',
    icon: 'https://cdn.simpleicons.org/firebase/DD2C00',
    color: '#DD2C00',
    url: 'https://firebase.google.com/',
  },
  {
    name: 'Docker',
    icon: 'https://cdn.simpleicons.org/docker/2496ED',
    color: '#2496ED',
    url: 'https://www.docker.com/',
  },
  {
    name: 'TypeScript',
    icon: 'https://cdn.simpleicons.org/typescript/3178C6',
    color: '#3178C6',
    url: 'https://www.typescriptlang.org/',
  },
];

export default function TechStack(): ReactNode {
  return (
    <section className={styles.techSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Công nghệ sử dụng
          </Heading>
          <p className={styles.sectionSubtitle}>
            Xây dựng trên nền tảng công nghệ hiện đại và mạnh mẽ
          </p>
        </div>

        <div className={styles.techGrid}>
          {techStack.map((tech, index) => (
            <a
              key={index}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.techCard}
            >
              <img src={tech.icon} alt={tech.name} className={styles.techIcon} loading="lazy" />
              <span className={styles.techName}>{tech.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
