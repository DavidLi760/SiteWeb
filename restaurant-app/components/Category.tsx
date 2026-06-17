type CategoryProps = {
  title: string;
  children: React.ReactNode;
};

export default function Category({ title, children }: CategoryProps) {
  return (
    <section className="mt-8">
      <h2 className="text-5xl font-bold mb-4 text-center">{title}</h2>

      <div className="flex gap-4 flex-wrap justify-start mx-auto max-w-5xl">
        {children}
      </div>
    </section>
  );
}