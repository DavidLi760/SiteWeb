import Menu from "./Menu"

export default function Navbar() {
  return (
    <div className="flex flex-row justify-between items-center sm:h-[100px] h-[60px] px-4 bg-[#716969]">
      
      <img src="/SushiHouse.png" className="h-full" />

      <div className="flex gap-12">
        <p className="hidden">Accueil</p>
        <Menu />
        <p className="hidden">A propos</p>
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