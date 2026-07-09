import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Shop from "../components/Shop";

export default function Home() {
  return (
    <main>
      <Navbar />
      <img id="lobby-img" src="/lobby.png" className="w-full h-40 sm:h-60 md:h-80 object-cover"/>
      <div className="flex gap-4 justify-center bg-gradient-to-r from-[#FFFBFB] to-[#FFFFFF] p-4">
        <button className="px-6 sm:px-16 py-3 border border-black bg-gradient-to-b from-[#68b000] to-[#70e000] text-black rounded">
          Emporter
        </button>
        <button className="px-6 sm:px-16 py-3 border border-black bg-[#FFFBFB] text-black rounded">
          Livraison
        </button>
      </div>
      <Shop />
      <Footer />
    </main>
  );
}