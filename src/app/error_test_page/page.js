// /app/hello/page.js

export default function HelloPage() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          height: "100vh", // Full viewport height
          backgroundColor: "#ffffff", // White background
          margin: 0, // Remove default margin
        }}
      >
        <h1
          style={{
            fontSize: "6rem", // Large font size
            fontWeight: "bold", // Bold text
            color: "#000000", // Black text
            margin: 0, // Remove default margin
          }}
        >
          An Error happened bro
        </h1>
      </div>
    );
  }