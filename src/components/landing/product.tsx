import type React from 'react';

export const Product: React.FC = () => {
  return (
    <div className="text-center grid gap-6">
      <h2 className="text-2xl md:text-3xl font-bold">
        A Tradespace for Everything.
      </h2>
      <img
        src="/tradespace.png"
        alt="Tradespace example"
        className="border-border border rounded-2xl shadow-xl"
      />
    </div>
  );
};
