"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Strategy Solution
        </Link>

        {/* Mobile menu button */}
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.menuIcon}></span>
        </button>

        {/* Navigation links */}
        <div
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}
        >
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/services" className={styles.navLink}>
            Services
          </Link>
          <Link href="/request-service" className={styles.navLink}>
            Request Service
          </Link>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
