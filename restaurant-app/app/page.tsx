import Navbar from ".././components/Navbar";
import Footer from ".././components/Footer"
import Category from ".././components/Category";
import FoodCard from ".././components/FoodCard";
import { menu } from ".././data/menu"

export default function Home() {
  return (
    <main>
      <Navbar />
      <img id="lobby-img" src="/lobby.png"/>
      <div className="flex gap-4 justify-center bg-gray-500 p-4">
        <button className="px-6 py-3 bg-black text-white rounded">
          Emporter
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded">
          Livraison
        </button>
      </div>
      {menu.map((cat) => (
        <Category key={cat.category} title={cat.category}>
          {cat.items.map((food) => (
            <FoodCard
              key={food.id}
              name={food.name}
              price={food.price}
              image={food.image}
            />
          ))}
        </Category>
      ))}
      <Footer />
    </main>
  );
}