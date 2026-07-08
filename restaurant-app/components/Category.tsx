type CategoryProps = {
  title: string;
  id: string;
  children: React.ReactNode;
};

export default function Category({ title, id, children }: CategoryProps) {
  return (
    <section id={id} className="mt-8 scroll-mt-24 bg-gradient-to-r from-[#FFFBFB] to-[#FFFFFF]">
      <h2 className="text-5xl font-bold mb-4 text-center">{title}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {children}
      </div>
    </section>
  );
}