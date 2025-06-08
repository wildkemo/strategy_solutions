import React from "react";
import styles from "./LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.logoContainer}>
          <div className={styles.logoAnimation}>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
            <div className={styles.logoCircle}></div>
          </div>
        </div>
        <h2 className={styles.loadingText}>Loading...</h2>
        <div className={styles.loadingBar}>
          <div className={styles.loadingBarFill}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
