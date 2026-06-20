import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-20 mt-20">
      <div className="flex justify-between">
        <p>© 2026 Sushi House</p>
        <div className="flex flex-col">
          <p>SUSHI HOUSE</p>
          <p>RESTAURANT JAPONAIS</p>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <Link href="/legal">Mentions légales</Link>
            <Link href="/privacy">Confidentialité (RGPD)</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
          <div className="flex flex-col">
            <p>Contactez Nous</p>
            <p>01 82 45 75 20</p>
            <p>6/7j 10h-14h30</p>
            <p>et 18h-22h30</p>
          </div>
          <div className="flex flex-col">
            <p>Moyen de Paiement</p>
            <p>Espece</p>
            <p>Carte bancaire</p>
            <p>Ticket restaurant</p>
          </div>
        </div>
      </div>
    </footer>
  );
}