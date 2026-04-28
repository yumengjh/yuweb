import React from "react";
import styles from "./Loading.module.scss";

interface LoadingProps {
  text?: string;
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ text = "LOADING...", fullPage = false }) => {
  return (
    <div className={`${styles.container} ${fullPage ? styles.fullPage : ""}`}>
      <div className={styles.loadingWrapper}>
        <div className={styles.loaderGraphic}>
          <div className={`${styles.l1} ${styles.color1}`} />
          <div className={`${styles.l2} ${styles.color2}`} />
          <div className={`${styles.e1} ${styles.color3} ${styles.animationEffectLight}`} />
          <div className={`${styles.e2} ${styles.color1} ${styles.animationEffectLightD}`} />
          <div className={`${styles.e3} ${styles.animationEffectRot}`}>X</div>
          <div className={`${styles.e4} ${styles.color2} ${styles.animationEffectLight}`} />
          <div className={`${styles.e5} ${styles.color4} ${styles.animationEffectLightD}`} />
          <div className={`${styles.e6} ${styles.animationEffectScale}`}>*</div>
          <div className={`${styles.e7} ${styles.color4}`} />
          <div className={`${styles.e8} ${styles.color3}`} />
        </div>
        {text && <span className={styles.loadingText}>{text}</span>}
      </div>
    </div>
  );
};

export default Loading;
