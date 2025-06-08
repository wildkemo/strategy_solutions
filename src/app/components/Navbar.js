"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
    if (pathname.startsWith("/services")) {
      setScrolled(false);
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_current_user.php",
          // "http://localhost/www/oop_project/php_backend/app/Controllers/get_current_user.php",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        if (userData.length !== 0) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserOrders = async () => {
    if (!user) return;

    setIsOrdersLoading(true);
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/get_user_orders.php",
        // "http://localhost/www/oop_project/php_backend/app/Controllers/get_user_orders.php",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const ordersData = await response.json();
      if (ordersData.length !== 0) {
        setOrders(ordersData);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/logout.php",
        // "http://localhost/www/oop_project/php_backend/app/Controllers/logout.php",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setOrders([]);
      setSidebarOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Error during logout:", err);
      setError(err.message);
    }
  };

  // Fetch orders when sidebar opens
  useEffect(() => {
    if (sidebarOpen && user) {
      fetchUserOrders();
    }
  }, [sidebarOpen, user]);

  const isSolidNavbarPage =
    pathname.startsWith("/services") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/request-service") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/my-orders") ||
    pathname.startsWith("/register");
  const navbarClass = isSolidNavbarPage
    ? `${styles.navbar} ${styles.scrolled}`
    : hasMounted
    ? `${styles.navbar} ${scrolled ? styles.scrolled : ""}`
    : styles.navbar;

  if (!hasMounted) {
    return null;
  }

  return (
    <nav className={navbarClass}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img
            src="/images/WhatsApp_Image_2025-06-08_at_20.37.40_9716fb98-removebg-preview.png"
            alt="Strategy Solutions Logo"
            className={styles.logoImage}
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.menuIcon}></span>
        </button>

        {/* Overlay for mobile sidebar */}
        {isMenuOpen && (
          <div className={styles.overlay} onClick={toggleMenu}></div>
        )}

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
          {!isLoading && user && (
            <Link href="/request-service" className={styles.navLink}>
              Request Service
            </Link>
          )}
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
        </div>

        {!isLoading && user && (
          <div className={styles.profileWrapper}>
            <button
              className={styles.profileIcon}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open profile sidebar"
            >
              <img
                src="/images/user profile.avif"
                alt="Profile"
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            </button>
          </div>
        )}

        {isLoading && (
          <div className={styles.profileWrapper}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        >
          <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
            {user && (
              <>
                <div className={styles.userInfo}>
                  <h2>{user.name}</h2>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>

                <div className={styles.ordersSection}>
                  <h3>Recent Orders</h3>
                  {isOrdersLoading ? (
                    <div className={styles.loadingSpinner}></div>
                  ) : orders.length > 0 ? (
                    <div className={styles.ordersList}>
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className={styles.orderItem}>
                          <span className={styles.orderService}>
                            {order.service_type}
                          </span>
                          <span className={styles.orderStatus}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noOrders}>No orders found</p>
                  )}
                </div>

                <button
                  className={styles.sidebarBtn}
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push("/my-orders");
                  }}
                >
                  View All Orders
                </button>
                <button
                  className={styles.sidebarBtn}
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push("/profile");
                  }}
                >
                  Manage My Profile
                </button>
                <button
                  className={styles.sidebarBtn}
                  style={{ background: "#d63031", marginTop: "2rem" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
