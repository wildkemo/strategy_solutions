"use client";
import styles from "./Contact.module.css";

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <div className={styles.flexRow}>
        <div className={styles.locationCard}>
          <h2 className={styles.locationTitle}>Address</h2>
          <p className={styles.locationText}>
            Egypt
            <br />
            Capital Mall, Unit 27, 5th Settlement, Cairo, Egypt.
          </p>
        </div>
        <div className={styles.mapWrapper}>
          <iframe
            src="https://www.google.com/maps/embed/v1/place?q=Egypt%20%2C%20new%20cairo%20%2C%205th%20settlement%20court%20%2C%20al%20nasr%20mall&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          ></iframe>
        </div>
      </div>
      <footer className={styles.footer}>
      Copyright © 2025 Strategy Solution - All Rights Reserved.
      </footer>
    </div>
  );
}
