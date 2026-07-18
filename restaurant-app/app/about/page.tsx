import Navbar from "../.././components/Navbar";
import Footer from "../.././components/Footer"

export default function Home() {
    return (
    <main>
        <div className="w-full bg-white shadow-lg rounded-xl p-8 text-center">
        
        <h1 className="text-3xl font-bold mb-4">
          À propos de Sushi House 🍣
        </h1>

        <p className="text-gray-600 mb-4">
          Bienvenue chez Sushi House, un restaurant passionné par la cuisine japonaise authentique.
          Nous préparons chaque plat avec des ingrédients frais et de qualité.
        </p>

        <p className="text-gray-600 mb-4">
          Notre mission est de vous offrir une expérience culinaire simple, rapide et délicieuse,
          directement inspirée du Japon.
        </p>

        <p className="text-gray-600">
          Merci de votre visite et bon appétit ! 🍱
        </p>

      </div>
    </main>
    );
}