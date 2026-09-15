import Image from "next/image";
import OrderTypeSelector from "@/components/OrderTypeSelector";
import Shop from "../components/Shop";

export default function Home() {
  return (
    <main>
      <Image width={1600} height={600} alt="Salle du restaurant Sushi House" id="lobby-img" src="/lobby.png" className="w-full h-40 sm:h-60 md:h-80 object-cover"/>
      <OrderTypeSelector />
      <Shop />
    </main>
  );
}