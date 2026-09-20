import type { Metadata } from "next";
import Link from "next/link";
import InformationPage from "@/components/InformationPage";

export const metadata: Metadata = {
  title: "Cookies | Sushi House",
  description: "Informations sur le cookie de connexion et le stockage du panier dans votre navigateur.",
};

export default function CookiesPage() {
  return (
    <InformationPage current="/cookies" title="Cookies et stockage local" description="Comprendre ce que le site mémorise dans votre navigateur.">
      <section>
        <h2>Votre connexion</h2>
        <p>Un cookie nommé « token » est créé lorsque vous vous connectez. Il permet de reconnaître votre compte et d’accéder aux fonctionnalités réservées aux clients connectés. Sa durée maximale est de 7 jours après la connexion.</p>
      </section>
      <section>
        <h2>Votre panier</h2>
        <p>Le panier est conservé dans le stockage local de votre navigateur, sous le nom « cart ». Il permet de retrouver les articles et quantités lors de votre prochaine visite sur le même navigateur.</p>
        <p>Il est mis à jour lorsque vous modifiez votre panier et vidé après un envoi de commande réussi. Il ne possède pas de date d’expiration automatique.</p>
      </section>
      <section>
        <h2>Votre mode de commande</h2>
        <p>Le choix entre emporter et livraison est mémorisé dans le stockage local sous le nom « orderType ». Il reste enregistré jusqu’à sa modification ou à la suppression des données du site dans votre navigateur.</p>
      </section>
      <section>
        <h2>Publicité et mesure d’audience</h2>
        <p>Aucun outil publicitaire ou de mesure d’audience n’est intégré à la version actuelle de l’application. Cette information devra être actualisée si de nouveaux services sont ajoutés.</p>
      </section>
      <section>
        <h2>Comment supprimer ces données ?</h2>
        <p>Dans les paramètres de confidentialité de votre navigateur, recherchez les données de ce site et supprimez ses cookies et son stockage local. Cette action vous déconnecte et efface le panier et le mode de commande mémorisés dans ce navigateur.</p>
        <p>Bloquer les cookies empêche de rester connecté. Bloquer le stockage local empêche de mémoriser le panier et le mode de commande. La suppression des données du navigateur ne supprime pas votre compte ni vos commandes enregistrées par le restaurant.</p>
        <p>Pour en savoir plus sur ces données, consultez la page <Link href="/privacy">Confidentialité</Link>.</p>
      </section>
    </InformationPage>
  );
}
