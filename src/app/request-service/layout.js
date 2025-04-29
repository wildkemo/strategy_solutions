export const metadata = {
  title: "Request a Service - Strategy Solutions",
  description:
    "Request a service from Strategy Solutions. We offer a wide range of services to help your business grow.",
};

export default function RequestServiceLayout({ children }) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
