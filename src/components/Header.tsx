import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="mb-8 pt-6">
      <h1 className="text-shapr-blue font-black text-3xl tracking-tight mb-0 leading-none">
        Shapr3D
      </h1>
      <h2 className="text-white font-black text-5xl uppercase tracking-tighter leading-tight">
        ADVERT GENERATOR
      </h2>
      <p className="text-gray-400 mt-2 font-medium">
        Generate tailored, high-performance job descriptions instantly.
      </p>
    </header>
  );
};