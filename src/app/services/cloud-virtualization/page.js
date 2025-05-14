import React from "react";
import Image from "next/image";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";

const CloudVirtualization = () => (
  <div className={styles.serviceDetailContainer}>
    <div className={styles.serviceDetailContent}>
      <div className={styles.textContent}>
        <h1 className={styles.serviceTitle}>Cloud & Virtualization</h1>
        <h2 className={styles.serviceSubtitle}>WHAT WE DO</h2>
        <div className={styles.cloudIntroSection}>
          <p className={styles.serviceDescription}>
            We provide cloud computing and virtualization solutions services
            that help businesses scale up efficiently. This technology provided
            by our experts pays off to your business by saving time, effort, and
            a significant amount of space.
          </p>
          <div className={styles.cloudImageWrapper}>
            <Image
              src="/images/cloud and vertualization 3.png"
              alt="Cloud and Virtualization"
              width={340}
              height={210}
              className={styles.cloudImage}
              priority
            />
          </div>
        </div>
        <div className={styles.cloudColumnsSection}>
          <div className={styles.cloudColumn}>
            <div className={styles.cloudColumnHeader}>
              <span className={styles.cloudColumnBar}></span>
              <span>WHAT WE DO</span>
            </div>
            <ul className={styles.cloudList}>
              <li>
                Run workshops to explore the key aspects of your needs and
                standards with particular focus on
                <ul>
                  <li>security and networking</li>
                  <li>Cloud integration</li>
                  <li>Environment segmentation and segregation</li>
                  <li>Federation and SSO</li>
                </ul>
              </li>
              <li>Revise and finalize your capacity planning</li>
              <li>Detailed design of your future state on Cloud platform</li>
              <li>
                Migration from existing solution (if exists) to new cloud
                solution
              </li>
            </ul>
          </div>
          <div className={styles.cloudColumn}>
            <div className={styles.cloudColumnHeader}>
              <span className={styles.cloudColumnBar}></span>
              <span>WHAT YOU GET</span>
            </div>
            <ul className={styles.cloudList}>
              <li>
                Detailed architecture design related proposed cloud solution.
              </li>
              <li>Capacity planning output</li>
              <li>Deployed, tested and validated cloud solution</li>
            </ul>
          </div>
          <div className={styles.cloudColumn}>
            <div className={styles.cloudColumnHeader}>
              <span className={styles.cloudColumnBar}></span>
              <span>BUSINESS OUTCOMES</span>
            </div>
            <ul className={styles.cloudList}>
              <li>
                Designed and implemented cloud solution to maximize security,
                scalability and performances
              </li>
              <li>
                Confirm the preliminary capacity plan defined to optimize
                capacity and growth strategy
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <Link href="/request-service" className={styles.requestButton}>
            Request a Service
          </Link>
          <Link href="/services" className={styles.contactButton}>
            Back to Services
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default CloudVirtualization;
