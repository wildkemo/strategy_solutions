"use client";
import React, { useEffect, useState } from "react";
import styles from "./Services.module.css";
import Link from "next/link";

// Define static services
const staticServices = [
  {
    id: 1,
    title: "Data Management Solutions",
    description:
      "Comprehensive data management solutions to help you organize, analyze, and leverage your data effectively for better business decisions.",
    features: [
      "Data Analytics",
      "Data Warehousing",
      "Data Integration",
      "Data Governance",
    ],
    category: "Data",
    icon: "box1",
  },
  {
    id: 2,
    title: "Cloud & Virtualization",
    description:
      "Advanced cloud and virtualization services to optimize your IT infrastructure and enhance business scalability.",
    features: [
      "Cloud Migration",
      "Virtual Infrastructure",
      "Cloud Security",
      "Hybrid Cloud Solutions",
    ],
    category: "Cloud",
    icon: "box2",
  },
  {
    id: 3,
    title: "Oracle Database Technologies",
    description:
      "Expert Oracle database solutions to ensure optimal performance, security, and reliability of your database systems.",
    features: [
      "Database Administration",
      "Performance Tuning",
      "Database Migration",
      "Oracle Cloud Solutions",
    ],
    category: "Database",
    icon: "box3",
  },
  {
    id: 4,
    title: "Hardware Infrastructure",
    description:
      "Robust hardware infrastructure solutions to support your business operations with maximum efficiency and reliability.",
    features: [
      "Network Setup",
      "Server Management",
      "Storage Solutions",
      "Infrastructure Optimization",
    ],
    category: "Hardware",
    icon: "box4",
  },
  {
    id: 5,
    title: "Cyber Security Services",
    description:
      "Comprehensive cybersecurity solutions to protect your business from evolving threats and ensure data security.",
    features: [
      "Security Assessment",
      "Threat Protection",
      "Compliance Management",
      "Security Monitoring",
    ],
    category: "Security",
    icon: "box1",
  },
  {
    id: 6,
    title: "Business Continuity",
    description:
      "Strategic business continuity solutions to ensure your operations remain resilient in the face of disruptions.",
    features: [
      "Disaster Recovery",
      "Business Impact Analysis",
      "Continuity Planning",
      "Risk Management",
    ],
    category: "Continuity",
    icon: "box2",
  },
  {
    id: 7,
    title: "ERP Solutions",
    description:
      "Tailored ERP solutions to streamline your business processes and improve operational efficiency.",
    features: [
      "ERP Implementation",
      "System Integration",
      "Process Automation",
      "ERP Customization",
    ],
    category: "ERP",
    icon: "box3",
  },
  {
    id: 8,
    title: "Project Management",
    description:
      "Professional project management services to ensure successful delivery of your IT initiatives.",
    features: [
      "Project Planning",
      "Resource Management",
      "Risk Assessment",
      "Quality Assurance",
    ],
    category: "Project",
    icon: "box4",
  },
  {
    id: 9,
    title: "Fusion Middleware Technologies",
    description:
      "Advanced Fusion Middleware solutions to enhance your application integration and development capabilities.",
    features: [
      "Integration Solutions",
      "Application Development",
      "API Management",
      "Service-Oriented Architecture",
    ],
    category: "Middleware",
    icon: "box1",
  },
  {
    id: 10,
    title: "Outsourcing & Support",
    description:
      "Comprehensive outsourcing and support services to help you focus on your core business while we handle your IT needs.",
    features: [
      "Managed Services",
      "Technical Support",
      "Help Desk Services",
      "IT Staff Augmentation",
    ],
    category: "Support",
    icon: "box2",
  },
];

const getSlug = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// Map static service titles to their custom slugs
const staticSlugMap = {
  "Data Management Solutions": "data-management",
  "Cloud & Virtualization": "cloud-virtualization",
  "Oracle Database Technologies": "oracle-database",
  "Hardware Infrastructure": "hardware-infrastructure",
  "Cyber Security Services": "cyber-security",
  "Business Continuity": "business-continuity",
  "ERP Solutions": "erp-solutions",
  "Project Management": "project-management",
  "Fusion Middleware Technologies": "fusion-middleware",
  "Outsourcing & Support": "outsourcing",
};

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const storedServices = localStorage.getItem("services");
    let dynamicServices = [];
    if (storedServices) {
      dynamicServices = JSON.parse(storedServices);
    }
    // Merge static and dynamic, avoiding duplicates by title
    const allServices = [
      ...staticServices,
      ...dynamicServices.filter(
        (ds) => !staticServices.some((ss) => ss.title === ds.title)
      ),
    ];
    setServices(allServices);
  }, []);

  return (
    <div className={styles.servicesContainer}>
      <div className={styles.servicesContent}>
        <h1 className={styles.servicesTitle}>Our Services</h1>
        <div className={styles.servicesGrid}>
          {services.length === 0 ? (
            <div className={styles.noServices}>
              No services available. Please add some from the admin dashboard.
            </div>
          ) : (
            // Group services into rows of 5
            services
              .reduce((rows, service, idx) => {
                if (idx % 5 === 0) rows.push([]);
                rows[rows.length - 1].push(service);
                return rows;
              }, [])
              .map((row, rowIdx) => (
                <div className={styles.firstRow} key={rowIdx}>
                  {row.map((service) => {
                    const isStatic = staticServices.some(
                      (ss) => ss.title === service.title
                    );
                    const slug = getSlug(service.title);
                    const linkHref = isStatic
                      ? `/services/${staticSlugMap[service.title]}`
                      : `/services/${slug}`;
                    return (
                      <div
                        className={styles.boxWrapper}
                        key={service.id + service.title}
                      >
                        <Link href={linkHref} className={styles.serviceLink}>
                          <div
                            className={`${styles.serviceBox} ${
                              styles[service.icon]
                            }`}
                          >
                            <h2>{service.title}</h2>
                            <ul>
                              {service.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        </Link>
                        <p className={styles.explanation}>
                          {service.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))
          )}
        </div>

        <div className={styles.footerCta}>
          <h2 className={styles.footerTitle}>
            Ready to Transform Your Business?
          </h2>
          <p className={styles.footerSubtitle}>
            Let's discuss how we can help you achieve your goals
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/request-service" className={styles.requestButton}>
              Request a Service
            </Link>
            <Link href="/contact" className={styles.contactButton}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
