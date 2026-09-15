import Image from "next/image";

type FoodCardProps = {
  name: string;
  description: string;
  image: string;
  price: number;
};

export default function FoodCard({ name, description, price, image }: FoodCardProps) {
  return (
    <div className="mt-4 p-4 aspect-[3/2] cursor-pointer bg-white shadow-lg hover:shadow-xl rounded w-full">
        <Image width={600} height={400} alt={name} src={image} className="w-full h-30 sm:h-40 object-contain rounded"/>
        <p className="font-bold truncate">{name}</p>
        <p className="mt-1 text-sm text-gray-600 whitespace-normal break-words">{description}</p>
        <p className="text-gray-600">{price} €</p>
    </div>
  );
}
