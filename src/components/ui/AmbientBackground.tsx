import React from "react";

export function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Teal Ambient Blob */}
      <div className="absolute -top-[10%] left-[15%] w-[480px] h-[480px] rounded-full bg-green/15 blur-[120px] animate-blob-1" />

      {/* Coral Ambient Blob */}
      <div className="absolute top-[40%] right-[10%] w-[520px] h-[520px] rounded-full bg-coral/12 blur-[130px] animate-blob-2" />

      {/* Secondary Void Deepening Mesh */}
      <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] rounded-full bg-green/10 blur-[140px] animate-blob-1" />
    </div>
  );
}
