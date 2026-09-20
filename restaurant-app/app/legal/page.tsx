import type { Metadata } from "next";
import InformationPage from "@/components/InformationPage";

export const metadata: Metadata = {
  title: "Mentions légales | Sushi House",
  description: "Informations sur l’éditeur, l’hébergement et les contacts du site Sushi House.",
};

export default function LegalPage() {
  return (
    <InformationPage current="/legal" title="Mentions légales" description="Les informations relatives à l’éditeur et à l’hébergement du site.">
      <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        Informations en cours de complément : les renseignements signalés ci-dessous doivent être précisés par l’exploitant du restaurant.
      </aside>
      <section>
        <h2>Éditeur du site</h2>
        <dl className="space-y-3 [&_dt]:font-semibold [&_dd]:break-words">
          <div><dt>Enseigne</dt><dd>Sushi House</dd></div>
          <div><dt>Raison sociale et forme juridique</dt><dd>À compléter par l’exploitant.</dd></div>
          <div><dt>Adresse du siège social</dt><dd>À compléter par l’exploitant.</dd></div>
          <div><dt>Immatriculation, capital social et numéro de TVA applicable</dt><dd>À compléter selon le statut de l’exploitant.</dd></div>
          <div><dt>Téléphone</dt><dd><a href="tel:+33182457520">01 82 45 75 20</a></dd></div>
          <div><dt>Adresse email de contact</dt><dd>À compléter par l’exploitant.</dd></div>
          <div><dt>Directeur ou directrice de la publication</dt><dd>À compléter par l’exploitant.</dd></div>
        </dl>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>Nom ou raison sociale, adresse et téléphone de l’hébergeur : à compléter lors du choix de l’hébergement du site.</p>
      </section>
      <section>
        <h2>Utilisation du site</h2>
        <p>Le site permet de consulter la carte, de préparer un panier et d’envoyer une commande au restaurant après connexion. Aucun paiement en ligne n’est effectué sur ce site.</p>
        <p>Pour toute question sur un produit ou une commande, contactez le restaurant au <a href="tel:+33182457520">01 82 45 75 20</a>.</p>
      </section>
      <section>
        <h2>Informations de référence</h2>
        <p>Consultez les <a href="https://entreprendre.service-public.gouv.fr/vosdroits/F37351">mentions obligatoires présentées par Service Public</a>.</p>
      </section>
    </InformationPage>
  );
}
