'use client';

import Navbar from '@/components/Navbar';
import Credits from '@/components/Credits';

export default function TextTo3D() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <Credits />
      {/* ... rest of the component ... */}
    </div>
  );
} 