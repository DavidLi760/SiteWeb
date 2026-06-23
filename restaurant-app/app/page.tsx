import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Shop from "../components/Shop";

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
      <Shop />
      <Footer />
    </main>
  );
}