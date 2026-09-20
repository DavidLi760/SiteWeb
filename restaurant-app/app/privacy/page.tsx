import type { Metadata } from "next";
import Link from "next/link";
import InformationPage from "@/components/InformationPage";

export const metadata: Metadata = {
  title: "Confidentialité | Sushi House",
  description: "Comprendre l’utilisation des données de votre compte et de vos commandes chez Sushi House.",
};

export default function PrivacyPage() {
  return (
    <InformationPage current="/privacy" title="Confidentialité" description="Les données utilisées pour votre compte, vos commandes et votre navigation.">
      <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        Cette notice décrit le fonctionnement actuel du site. L’identité du responsable, les bases légales, les prestataires et les durées de conservation restent à compléter et à valider par l’exploitant.
      </aside>
      <section>
        <h2>Qui contacter ?</h2>
        <p>Le site est exploité sous l’enseigne Sushi House. Les coordonnées légales de l’exploitant sont à compléter dans les <Link href="/legal">mentions légales</Link>, ainsi que le contact dédié aux données personnelles.</p>
        <p>Vous pouvez joindre le restaurant au <a href="tel:+33182457520">01 82 45 75 20</a> pour être orienté vers la personne chargée de votre demande.</p>
      </section>
      <section>
        <h2>Quelles données sont utilisées ?</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Compte : prénom, nom, email, téléphone et mot de passe enregistré sous forme de hash.</li>
          <li>Vérification et récupération du compte : statut de vérification, liens temporaires de réinitialisation et informations de session.</li>
          <li>Commandes : articles, quantités, prix, date, référence, mode de commande et état d’envoi des emails.</li>
          <li>Livraison : rue, code postal, ville et complément d’adresse fourni.</li>
        </ul>
        <p>Ces informations servent à gérer votre compte, sécuriser son accès et transmettre vos commandes. Les champs obligatoires sont nécessaires aux fonctionnalités concernées. Aucune donnée de carte bancaire n’est demandée.</p>
      </section>
      <section>
        <h2>Finalités et bases légales</h2>
        <p>La gestion du compte et le traitement des commandes répondent à votre demande de service. L’exploitant doit préciser les bases légales retenues pour ces usages et pour la sécurisation du compte avant de finaliser cette notice.</p>
      </section>
      <section>
        <h2>Destinataires des données</h2>
        <p>Les commandes et les coordonnées nécessaires à leur traitement sont envoyées au restaurant par email. Une copie est envoyée à l’adresse email du client. Le stockage des comptes et commandes et l’envoi des emails impliquent les prestataires techniques du site.</p>
        <p>Leur identité, les lieux de traitement et les éventuels transferts hors de l’Espace économique européen, ainsi que leurs garanties, restent à préciser par l’exploitant.</p>
      </section>
      <section>
        <h2>Durées de conservation</h2>
        <p>La session de connexion expire au bout de 7 jours. Un lien de réinitialisation est valable 30 minutes et ne peut être utilisé qu’une fois.</p>
        <p>Les durées de conservation des comptes, commandes, emails et sauvegardes restent à définir par l’exploitant. L’affichage des 50 dernières commandes dans votre compte ne signifie pas que les commandes plus anciennes sont supprimées.</p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>Selon les conditions applicables, vous pouvez demander l’accès, la rectification ou l’effacement de vos données, la limitation du traitement, vous y opposer ou demander leur portabilité. Lorsqu’un traitement repose sur votre consentement, vous pouvez le retirer.</p>
        <p>Vous pouvez consulter les <a href="https://www.cnil.fr/fr/respecter-les-droits-des-personnes">informations de la CNIL sur vos droits</a> et lui adresser une réclamation.</p>
      </section>
      <section>
        <h2>Stockage dans votre navigateur</h2>
        <p>La page <Link href="/cookies">Cookies</Link> explique comment sont conservés votre connexion, votre panier et votre choix entre livraison et emporter.</p>
      </section>
    </InformationPage>
  );
}
