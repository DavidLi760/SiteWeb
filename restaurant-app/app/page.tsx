export default function Home() {
  return (
    <main>
      <Navbar />
      <img id="lobby-img" src="/lobby.png"/>
      <div className="flex gap-4 justify-center mt-6">
        <button className="px-6 py-3 bg-black text-white rounded">
          Emporter
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded">
          Livraison
        </button>
      </div>
    </main>
  );
}

export function Navbar() {
  return (
    <div className="flex justify-between items-center h-[100px] px-4 bg-[#716969]">
      
      <img src="/SushiHouse.png" className="h-full" />

      <div className="flex gap-12">
        <p>Accueil</p>
        <p>Menu</p>
        <p>A propos</p>
      </div>

      <div className="flex gap-12 relative">
        <p>
          Compte <i className="fa-solid fa-user text-2xl"></i>
        </p>

        <p className="relative">
          Panier{" "}
          <i className="fa-solid fa-bag-shopping text-2xl"></i>

          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            0
          </span>
        </p>
      </div>

    </div>
  );
}