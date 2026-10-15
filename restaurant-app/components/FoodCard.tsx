import Image from "next/image";
import type { Food } from "@/data/menu";
import { formatMoney, toCents } from "@/lib/money";

type FoodCardProps = Pick<Food, "name" | "description" | "image" | "price">;

export default function FoodCard({ name, description, price, image }: FoodCardProps) {
  return (
    <span className="flex h-full w-full flex-col rounded bg-white p-4 shadow-lg transition-shadow group-hover:shadow-xl motion-reduce:transition-none">
      <Image
        width={600}
        height={400}
        sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, 50vw"
        alt=""
        src={image}
        className="h-30 w-full rounded object-contain sm:h-40"
      />
      <span className="mt-2 block break-words font-bold">{name}</span>
      <span className="mt-1 block break-words text-sm text-gray-600">{description}</span>
      <span className="mt-auto block pt-2 text-gray-600">{formatMoney(toCents(price))}</span>
    </span>
  );
}
