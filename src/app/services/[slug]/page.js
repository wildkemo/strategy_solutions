// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import styles from "../data-management/ServiceDetail.module.css";
// import Link from "next/link";

// // Static services (same as in services/page.js)
// const staticServices = [
//   {
//     id: 1,
//     title: "Data Management Solutions",
//     description:
//       "Comprehensive data management solutions to help you organize, analyze, and leverage your data effectively for better business decisions.",
//     features: [
//       "Data Analytics",
//       "Data Warehousing",
//       "Data Integration",
//       "Data Governance",
//     ],
//     category: "Data",
//     icon: "box1",
//   },
//   {
//     id: 2,
//     title: "Cloud & Virtualization",
//     description:
//       "Advanced cloud and virtualization services to optimize your IT infrastructure and enhance business scalability.",
//     features: [
//       "Cloud Migration",
//       "Virtual Infrastructure",
//       "Cloud Security",
//       "Hybrid Cloud Solutions",
//     ],
//     category: "Cloud",
//     icon: "box2",
//   },
//   {
//     id: 3,
//     title: "Oracle Database Technologies",
//     description:
//       "Expert Oracle database solutions to ensure optimal performance, security, and reliability of your database systems.",
//     features: [
//       "Database Administration",
//       "Performance Tuning",
//       "Database Migration",
//       "Oracle Cloud Solutions",
//     ],
//     category: "Database",
//     icon: "box3",
//   },
//   {
//     id: 4,
//     title: "Hardware Infrastructure",
//     description:
//       "Robust hardware infrastructure solutions to support your business operations with maximum efficiency and reliability.",
//     features: [
//       "Network Setup",
//       "Server Management",
//       "Storage Solutions",
//       "Infrastructure Optimization",
//     ],
//     category: "Hardware",
//     icon: "box4",
//   },
//   {
//     id: 5,
//     title: "Cyber Security Services",
//     description:
//       "Comprehensive cybersecurity solutions to protect your business from evolving threats and ensure data security.",
//     features: [
//       "Security Assessment",
//       "Threat Protection",
//       "Compliance Management",
//       "Security Monitoring",
//     ],
//     category: "Security",
//     icon: "box1",
//   },
//   {
//     id: 6,
//     title: "Business Continuity",
//     description:
//       "Strategic business continuity solutions to ensure your operations remain resilient in the face of disruptions.",
//     features: [
//       "Disaster Recovery",
//       "Business Impact Analysis",
//       "Continuity Planning",
//       "Risk Management",
//     ],
//     category: "Continuity",
//     icon: "box2",
//   },
//   {
//     id: 7,
//     title: "ERP Solutions",
//     description:
//       "Tailored ERP solutions to streamline your business processes and improve operational efficiency.",
//     features: [
//       "ERP Implementation",
//       "System Integration",
//       "Process Automation",
//       "ERP Customization",
//     ],
//     category: "ERP",
//     icon: "box3",
//   },
//   {
//     id: 8,
//     title: "Project Management",
//     description:
//       "Professional project management services to ensure successful delivery of your IT initiatives.",
//     features: [
//       "Project Planning",
//       "Resource Management",
//       "Risk Assessment",
//       "Quality Assurance",
//     ],
//     category: "Project",
//     icon: "box4",
//   },
//   {
//     id: 9,
//     title: "Fusion Middleware Technologies",
//     description:
//       "Advanced Fusion Middleware solutions to enhance your application integration and development capabilities.",
//     features: [
//       "Integration Solutions",
//       "Application Development",
//       "API Management",
//       "Service-Oriented Architecture",
//     ],
//     category: "Middleware",
//     icon: "box1",
//   },
//   {
//     id: 10,
//     title: "Outsourcing & Support",
//     description:
//       "Comprehensive outsourcing and support services to help you focus on your core business while we handle your IT needs.",
//     features: [
//       "Managed Services",
//       "Technical Support",
//       "Help Desk Services",
//       "IT Staff Augmentation",
//     ],
//     category: "Support",
//     icon: "box2",
//   },
// ];

// const getSlug = (title) =>
//   title
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

// export default function ServiceDetailPage() {
//   const params = useParams();
//   const { slug } = params;
//   const [service, setService] = useState(null);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     let found = staticServices.find((s) => getSlug(s.title) === slug);
//     if (!found && typeof window !== "undefined") {
//       const storedServices = localStorage.getItem("services");
//       if (storedServices) {
//         const dynamicServices = JSON.parse(storedServices);
//         found = dynamicServices.find((s) => getSlug(s.title) === slug);
//       }
//     }
//     setService(found || null);
//   }, [slug]);

//   if (!mounted) {
//     return null;
//   }

//   if (!service) {
//     return (
//       <div className={styles.serviceDetailContainer}>
//         <div className={styles.serviceDetailContent}>
//           <h1 className={styles.serviceTitle}>Service Not Found</h1>
//           <Link href="/services" className={styles.requestButton}>
//             Back to Services
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.serviceDetailContainer}>
//       <div className={styles.serviceDetailContent}>
//         <div className={styles.textContent}>
//           <h1 className={styles.serviceTitle}>{service.title}</h1>
//           <p className={styles.serviceDescription}>{service.description}</p>
//           <h2 className={styles.serviceSubtitle}>Features</h2>
//           <ul className={styles.featureList}>
//             {service.features.map((feature, idx) => (
//               <li className={styles.featureItem} key={idx}>
//                 {feature}
//               </li>
//             ))}
//           </ul>
//           <div className={styles.buttonGroup} style={{ marginTop: "2.5rem" }}>
//             <Link href="/request-service" className={styles.requestButton}>
//               Request a Service
//             </Link>
//             <Link href="/services" className={styles.contactButton}>
//               Back to Services
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


















"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../data-management/ServiceDetail.module.css";
import Link from "next/link";

const getSlug = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export default function ServiceDetailPage() {
  const params = useParams();
  const { slug } = params;
  const [service, setService] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    const fetchService = async () => {
      try {
        // Fetch all services from your PHP backend
        const response = await fetch('http://karim/oop_project/php_backend/app/Controllers/get_services.php'); // Adjust this endpoint to match your backend
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const services = await response.json();
        
        // Find the service with matching slug
        const found = services.find((s) => getSlug(s.title) === slug);
        setService(found || null);
      } catch (err) {
        setError(err.message);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.serviceDetailContainer}>
        <div className={styles.serviceDetailContent}>
          <h1 className={styles.serviceTitle}>Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.serviceDetailContainer}>
        <div className={styles.serviceDetailContent}>
          <h1 className={styles.serviceTitle}>Error</h1>
          <p>{error}</p>
          <Link href="/services" className={styles.requestButton}>
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className={styles.serviceDetailContainer}>
        <div className={styles.serviceDetailContent}>
          <h1 className={styles.serviceTitle}>Service Not Found</h1>
          <Link href="/services" className={styles.requestButton}>
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.serviceDetailContainer}>
      <div className={styles.serviceDetailContent}>
        <div className={styles.textContent}>
          <h1 className={styles.serviceTitle}>{service.title}</h1>
          <p className={styles.serviceDescription}>{service.description}</p>
          <h2 className={styles.serviceSubtitle}>Features</h2>
          <ul className={styles.featureList}>
            {service.features.map((feature, idx) => (
              <li className={styles.featureItem} key={idx}>
                {feature}
              </li>
            ))}
          </ul>
          <div className={styles.buttonGroup} style={{ marginTop: "2.5rem" }}>
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
}