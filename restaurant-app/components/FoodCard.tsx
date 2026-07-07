type FoodCardProps = {
  name: string;
  image: string;
  price: number;
};

export default function FoodCard({ name, price, image }: FoodCardProps) {
  return (
    <div className="p-4 cursor-pointer bg-white shadow-lg hover:shadow-xl rounded w-40 sm:w-60">
        <img src={image} className="w-full h-30 sm:h-40 object-cover rounded"/>
        <p className="font-bold truncate">{name}</p>
        <p className="text-gray-600">{price} €</p>
    </div>
  );
}