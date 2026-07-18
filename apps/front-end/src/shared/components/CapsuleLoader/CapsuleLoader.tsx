import styles from "./CapsuleLoader.module.css";

type CapsuleLoaderProps = {
  title: string;
  subtitle?: string;
};

function CapsuleLoader({ title, subtitle }: CapsuleLoaderProps) {
  return (
    <div
      className={styles.wrapper}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <div className={styles.panel}>
        <div className={styles.capsules} aria-hidden="true">
          <span className={styles.capsule} />
          <span className={styles.capsule} />
          <span className={styles.capsule} />
        </div>
        <p className={styles.title}>{title}</p>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
    </div>
  );
}

export default CapsuleLoader;
