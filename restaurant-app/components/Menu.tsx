import { menu } from "../data/menu";

export default function Menu() {
  return (
    <div className="relative inline-block group">
      <button className="rounded text-white hover:bg-blue-700">
        Menu
      </button>

      <div className="absolute left-0 top-full hidden w-48 rounded border bg-white shadow-lg group-hover:block">
        {menu.map((category) => (
          <a
            key={category.category}
            href={`#${category.category}`}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {category.category}
          </a>
        ))}
      </div>
    </div>
  );
}