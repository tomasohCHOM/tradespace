import type React from 'react';

type Props = {
  children: React.ReactNode;
};

export const PageContent: React.FC<Props> = ({ children }) => {
  return (
    <main className="pt-18 px-4 md:px-8 flex flex-col max-w-7xl mx-auto w-full gap-8">
      {children}
    </main>
  );
};
