type CategoryProps = {
  title: string;
  id: string;
  children: React.ReactNode;
};

export default function Category({ title, id, children }: CategoryProps) {
  return (
    <section id={id} className="mt-8 scroll-mt-24">
      <h2 className="text-5xl font-bold mb-4 text-center">{title}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mx-auto max-w-5xl">
        {children}
      </div>
    </section>
  );
}