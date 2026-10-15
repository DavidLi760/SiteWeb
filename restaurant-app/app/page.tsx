import Image from "next/image";
import OrderTypeSelector from "@/components/OrderTypeSelector";
import Shop from "../components/Shop";

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">Sushi House — Notre carte</h1>
      <Image width={1600} height={600} alt="Salle du restaurant Sushi House" id="lobby-img" src="/lobby.png" className="w-full h-40 sm:h-60 md:h-80 object-cover"/>
      <OrderTypeSelector />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Shop />
      </div>
    </main>
  );
}
