"use client";

export default function RequestServiceLayout({ children }) {
  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      width: '100%'
    }}>
      {children}
    </div>
  );
} 