import React from 'react';
import styles from './title.module.css';

export function Title({ children }: React.PropsWithChildren) {
  return <div className={styles.title}>{children}</div>;
}
