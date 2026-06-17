type FoodCardProps = {
  name: string;
  image: string;
  price: number;
};

export default function FoodCard({ name, price, image }: FoodCardProps) {
  return (
    <div className="p-4 bg-white shadow rounded w-60">
        <img src={image} className="h-60"/>
        <p className="font-bold">{name}</p>
        <p className="text-gray-600">{price} €</p>
    </div>
  );
}