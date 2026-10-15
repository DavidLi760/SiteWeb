# Sushi House

Application web full stack de restaurant japonais. Elle permet de consulter une carte, préparer un panier, créer un compte et transmettre une commande au restaurant par email, avec une copie au client.

Le projet réunit une interface React, un serveur Next.js exécuté avec Node.js, une base PostgreSQL et un service SMTP. Il ne réalise aucun paiement en ligne.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Commandes disponibles](#commandes-disponibles)
- [Architecture](#architecture)
- [Parcours de commande](#parcours-de-commande)
- [Comptes et authentification](#comptes-et-authentification)
- [Base de données](#base-de-données)
- [Pages et API](#pages-et-api)
- [Tests et vérifications](#tests-et-vérifications)
- [Personnalisation](#personnalisation)
- [Dépannage](#dépannage)
- [Limites actuelles](#limites-actuelles)

## Fonctionnalités

- Carte organisée en catégories : sushi, maki et california.
- Fiche produit dans une fenêtre modale, avec choix de la quantité.
- Panier persistant dans le navigateur : ajout, modification et suppression d’articles.
- Choix entre commande à emporter et livraison, avec adresse pour la livraison.
- Inscription et confirmation de l’adresse email.
- Connexion avec une session conservée dans un cookie.
- Récupération et réinitialisation du mot de passe par email.
- Enregistrement des commandes et envoi de deux emails : restaurant et client.
- Historique des 50 dernières commandes du compte connecté.
- Pages de présentation, mentions légales, confidentialité et stockage local.
- Mise en page responsive et dialogues natifs avec fermeture par Échap et restauration du focus.

## Technologies

| Technologie | Rôle dans le projet |
| --- | --- |
| TypeScript 5 | Typage du code de l’interface et du serveur |
| React 19 | Composants, états et interactions dans le navigateur |
| Next.js 16, App Router | Pages, rendu serveur, navigation et routes API |
| Node.js | Exécution du serveur et des scripts ; ce n’est pas un langage distinct de JavaScript/TypeScript |
| Tailwind CSS 4 | Styles utilitaires et responsive |
| PostgreSQL et `pg` | Stockage des comptes et commandes, avec requêtes SQL directes |
| `bcrypt` | Hachage et vérification des mots de passe |
| `jsonwebtoken` | Création et vérification des jetons de session JWT |
| Nodemailer | Envoi des emails via SMTP |
| `node:crypto` | Création de références et jetons aléatoires, empreintes SHA-256 |
| `tsx` et `node:test` | Exécution des scripts TypeScript et des tests |
| ESLint | Analyse statique du code |
| Font Awesome et Inter | Icônes et police de l’interface |

Le backend fait partie de l’application Next.js : il n’y a pas de serveur Express séparé ni d’ORM.

## Installation

### 1. Prérequis

- Node.js compatible avec la version installée de Next.js : minimum déclaré `20.9.0`. Les vérifications précédentes du projet ont été effectuées avec Node.js `24.21.0`.
- npm.
- Une instance PostgreSQL accessible et une base dédiée existante.
- Un compte SMTP capable d’envoyer des emails pour tester les parcours complets.

### 2. Installer les dépendances

Depuis la racine du dépôt :

```sh
cd restaurant-app
npm ci
```

Toutes les commandes suivantes sont à exécuter depuis `restaurant-app/`.

### 3. Configurer les variables d’environnement

Créer un fichier `.env.local` dans `restaurant-app/`. Exemple à adapter, avec des valeurs fictives :

```dotenv
DATABASE_URL=postgresql://sushi_user:mot_de_passe_local@localhost:5432/sushi_house
JWT_SECRET=remplacer_par_un_secret_aleatoire_long
NEXT_PUBLIC_URL=http://localhost:3000

SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=restaurant@example.com
SMTP_PASSWORD=remplacer_par_le_mot_de_passe_smtp
ORDER_EMAIL=commandes@example.com
```

| Variable | Utilisation |
| --- | --- |
| `DATABASE_URL` | Chaîne de connexion à PostgreSQL |
| `JWT_SECRET` | Secret de signature des sessions ; sa modification invalide les jetons existants |
| `NEXT_PUBLIC_URL` | URL complète du site utilisée pour construire les liens envoyés par email |
| `SMTP_HOST` | Hôte du serveur SMTP |
| `SMTP_PORT` | Port SMTP ; `465` par défaut |
| `SMTP_USER` | Identifiant SMTP, également utilisé comme adresse d’expédition |
| `SMTP_PASSWORD` | Mot de passe ou mot de passe d’application SMTP |
| `ORDER_EMAIL` | Adresse du restaurant destinataire des commandes |

Le port `465` active TLS dès la connexion dans la configuration actuelle. Pour un autre port, le transport utilise `secure: false` et les possibilités de négociation du serveur SMTP. Le fournisseur doit accepter l’adresse d’expédition utilisée.

Un secret peut être généré localement avec Node.js :

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

`.env.local` est ignoré par Git. Ne pas publier de véritables identifiants dans le dépôt ou le README. Redémarrer le serveur après une modification de configuration.

### 4. Initialiser la base de données

Créer au préalable la base référencée par `DATABASE_URL`, avec un utilisateur autorisé à créer les tables et index. Puis lancer :

```sh
npm run db:init
```

Le script `scripts/init-db.ts` crée les tables `users` et `orders`, les index associés et les colonnes de récupération de compte. Il utilise `IF NOT EXISTS` pour les éléments qu’il initialise et peut être relancé sur le schéma attendu. Il ne crée pas la base PostgreSQL elle-même et ne constitue pas un système complet de migrations.

Les produits ne sont pas insérés en base : le catalogue provient de `data/menu.ts`.

### 5. Démarrer en développement

```sh
npm run dev
```

Ouvrir http://localhost:3000. Si le port ou l’URL change, adapter aussi `NEXT_PUBLIC_URL` pour les liens envoyés par email.

### 6. Exécuter la version de production

```sh
npm run build
npm start
```

L’hébergement doit prendre en charge un serveur Node.js, les routes API, PostgreSQL et les connexions SMTP. Une simple exportation de fichiers statiques ne couvre pas ces fonctionnalités. Configurer les variables d’environnement du serveur et utiliser l’URL publique du site pour les liens email.

La compilation utilise `next/font/google` pour Inter ; elle peut nécessiter un accès réseau pour récupérer la police.

## Commandes disponibles

| Commande | Effet |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement |
| `npm run db:init` | Initialise le schéma de données |
| `npm run lint` | Exécute ESLint |
| `npx tsc --noEmit` | Vérifie les types sans générer de JavaScript |
| `npm test` | Exécute les fichiers `lib/*.test.ts` |
| `npm run build` | Compile la version de production |
| `npm start` | Démarre la version déjà compilée |

## Architecture

```text
restaurant-app/
├── app/
│   ├── page.tsx                 # Accueil, bannière et carte
│   ├── layout.tsx               # Structure commune, navigation et pied de page
│   ├── globals.css              # Tailwind, couleurs et police globale
│   ├── @auth/                   # Routes parallèles et interceptées des dialogues de compte
│   ├── api/                     # Routes HTTP exécutées côté serveur
│   ├── account/                 # Connexion ou historique du compte
│   ├── cart/                    # Panier et formulaire de commande
│   ├── signup/                  # Inscription
│   ├── forgot-password/         # Demande de récupération du compte
│   ├── reset-password/          # Nouveau mot de passe à partir du jeton
│   └── about/, legal/, privacy/, cookies/
├── components/                  # Composants de présentation et d’interaction
├── data/
│   ├── menu.ts                  # Catalogue, type Food et index des produits
│   └── restaurant.ts            # Coordonnées, horaires et liens d’information
├── lib/                         # Logique métier, stockage, validation et services
├── public/                      # Images et autres fichiers statiques
├── scripts/init-db.ts           # Initialisation PostgreSQL
├── package.json                 # Dépendances et commandes
└── README.md
```

### Interface et logique métier

| Fichier ou groupe | Responsabilité |
| --- | --- |
| `Shop`, `Category`, `FoodCard` | Affichage du catalogue et sélection des produits |
| `QuantitySelector`, `OrderTypeSelector` | Contrôles partagés de quantité et de mode de commande |
| `Dialog`, `AuthModal`, `AuthCard` | Dialogue natif, navigation de fermeture et présentation des formulaires de compte |
| `FormField`, `SubmitButton` | Champs et boutons communs aux formulaires |
| `LoginForm`, `PasswordRecoveryForm` | Connexion et récupération de compte |
| `OrderHistory` | Lecture et rendu serveur de l’historique |
| `lib/cart.ts` | Lecture d’un panier sauvegardé et règles de modification des quantités |
| `lib/local-store.ts` | Accès au stockage local et abonnements aux changements |
| `lib/use-cart.ts`, `lib/use-order-type.ts` | Liaison du stockage local à React avec `useSyncExternalStore` |
| `lib/orders.ts` | Validation de la commande et calcul des prix depuis le catalogue |
| `lib/order-email.ts` | Construction du message et envoi aux deux destinataires |
| `lib/auth.ts` | Lecture du cookie et validation de la session |
| `lib/password-reset.ts` | Création et empreinte des jetons de récupération |
| `lib/validation.ts`, `lib/delivery-address.ts` | Validation des données reçues |
| `lib/money.ts` | Conversion en centimes et affichage monétaire français |
| `lib/db.ts`, `lib/mail.ts` | Connexion PostgreSQL et transport SMTP |

Les fichiers contenant `"use client"` gèrent les interactions et les API du navigateur. Les routes API et les composants serveur accèdent aux services privés. Le navigateur ne se connecte directement ni à PostgreSQL ni au serveur SMTP.

Le dossier `app/@auth` permet de présenter les écrans de compte en modales lors de certaines navigations internes. Les pages restent également accessibles par leur URL directe.

## Parcours de commande

1. Le visiteur consulte les produits définis dans `data/menu.ts`.
2. Il choisit un article et une quantité entre 1 et 99.
3. Le panier est sauvegardé sous la clé `cart` de `localStorage`. L’ajout d’un même produit fusionne les quantités, dans la limite de 99.
4. Le mode de commande est mémorisé sous la clé `orderType` : `takeaway` ou `delivery`.
5. Dans le panier, une adresse est requise pour la livraison. Le client doit se connecter avec un compte vérifié avant l’envoi.
6. Le navigateur transmet le mode de commande, l’adresse éventuelle et les couples `id`/`quantity` à `POST /api/orders`.
7. Le serveur vérifie la session, l’origine si l’en-tête est présent, les produits, les quantités et l’adresse. Il refuse les produits inconnus et les doublons d’articles dans la requête.
8. Les noms et prix sont récupérés depuis le catalogue serveur. Les prix envoyés par le navigateur ne font pas autorité. Les calculs de commande sont effectués en centimes.
9. La commande est enregistrée dans PostgreSQL avec une référence UUID et un statut email initial `pending`.
10. Deux emails sont envoyés en parallèle. Le statut passe à `sent` si les deux envois sont acceptés par SMTP, sinon à `incomplete` si la mise à jour aboutit.
11. Le panier est vidé uniquement après une réponse HTTP réussie. L’historique présente les commandes enregistrées et l’état de l’envoi.

Un échec d’envoi ne supprime pas la commande enregistrée. En cas d’envoi incomplet ou de réponse incertaine, vérifier auprès du restaurant avant de renvoyer la commande pour éviter un doublon.

`sent` indique une acceptation par le serveur SMTP, pas une garantie de réception dans la boîte du destinataire ni une validation manuelle du restaurant. Si le traitement s’interrompt après l’insertion, une commande peut rester `pending`.

## Comptes et authentification

### Inscription et confirmation

L’inscription enregistre le prénom, le nom, l’email, le téléphone et un mot de passe haché avec bcrypt, avec un facteur de coût de 12. Le mot de passe doit contenir au moins 8 caractères et ne pas dépasser 72 octets UTF-8.

Un jeton aléatoire de confirmation est associé au compte et envoyé par email. L’ouverture de `/api/verify?token=...` confirme le compte et consomme le jeton dans une seule requête SQL. La connexion est refusée tant que l’email n’est pas vérifié.

### Connexion

Après vérification des identifiants, le serveur crée un JWT valable 7 jours et le place dans un cookie `token` :

- `HttpOnly` empêche l’accès au cookie depuis le JavaScript du navigateur.
- `SameSite=Lax` limite certains envois du cookie entre sites.
- `Secure` est activé en production ; le site doit alors être servi en HTTPS.

`getSession()` vérifie la signature avec HS256, la structure du jeton, l’existence du compte et sa version de mot de passe. La session contient l’identifiant, le prénom et l’email ; elle ne contient pas le mot de passe.

### Mot de passe oublié

La demande renvoie un message public identique pour un compte existant ou inconnu. Pour un compte existant, une nouvelle demande est autorisée après une minute. Ce délai est géré en base par compte ; il ne remplace pas une limitation globale des requêtes.

Le lien de récupération est valable 30 minutes. Seule l’empreinte SHA-256 du jeton est enregistrée. La réinitialisation vérifie son expiration et le consomme lors de la modification du mot de passe. Elle augmente aussi `password_version`, ce qui invalide les anciennes sessions lors de leur prochaine vérification, et efface le cookie de la réponse courante.

## Base de données

### Table `users`

| Champs | Description |
| --- | --- |
| `id` | Identifiant entier auto-incrémenté |
| `email` | Adresse unique, jusqu’à 255 caractères |
| `firstname`, `lastname`, `phone` | Coordonnées du client |
| `password_hash` | Hachage bcrypt du mot de passe |
| `email_verified`, `verification_token` | Confirmation du compte |
| `reset_token_hash`, `reset_token_expires_at` | Empreinte et expiration du jeton de récupération |
| `reset_requested_at` | Date utilisée pour le délai entre deux demandes |
| `password_version` | Version comparée à celle du JWT pour invalider les anciennes sessions |
| `created_at`, `updated_at` | Dates stockées pour le compte |

### Table `orders`

| Champ | Description |
| --- | --- |
| `id` | Référence UUID de la commande |
| `user_id` | Clé étrangère vers `users.id` |
| `order_type` | `takeaway` ou `delivery` |
| `items` | Tableau JSONB : identifiant, nom, quantité et prix unitaire en centimes |
| `total_cents` | Total entier en centimes, non négatif |
| `delivery_address` | Adresse JSONB, ou `NULL` pour une commande à emporter |
| `email_status` | `pending`, `sent` ou `incomplete` |
| `created_at` | Date de création de la commande |

L’historique conserve les noms et prix enregistrés lors de la commande : un changement ultérieur du catalogue ne réécrit pas ces données. Un index sur `(user_id, created_at DESC)` facilite la lecture de l’historique. L’affichage est limité à 50 commandes ; ce n’est pas une règle de suppression des commandes plus anciennes.

## Pages et API

### Pages

| URL | Usage |
| --- | --- |
| `/` | Carte du restaurant |
| `/about` | Présentation et coordonnées |
| `/cart` | Panier, mode de commande et livraison |
| `/signup` | Inscription |
| `/account` | Connexion ou historique selon la session |
| `/forgot-password` | Demande d’un lien de récupération |
| `/reset-password?token=...` | Choix du nouveau mot de passe |
| `/legal`, `/privacy`, `/cookies` | Informations sur le site et ses données |

### Routes API

Les routes POST reçoivent du JSON. Les réponses d’erreur utilisent généralement `message`, sauf la vérification d’email qui utilise `error`.

| Méthode | URL | Données attendues | Résultat principal |
| --- | --- | --- | --- |
| POST | `/api/register` | `email`, `firstname`, `lastname`, `phone`, `password` | Création du compte et email de confirmation ; HTTP 201 |
| GET | `/api/verify?token=...` | Jeton dans l’URL | Confirmation puis redirection vers `/account` |
| POST | `/api/login` | `email`, `password` | Cookie de session et informations du compte |
| GET | `/api/auth/me` | Cookie de session | `loggedIn: true` avec `user`, ou HTTP 401 et `loggedIn: false` |
| POST | `/api/forgot-password` | `email` | Message de demande de récupération |
| POST | `/api/reset-password` | `token`, `password` | Mise à jour du mot de passe et invalidation des anciennes sessions |
| POST | `/api/orders` | `orderType`, `items`, adresse éventuelle | Enregistrement et emails ; cookie valide requis |

Exemple du corps d’une commande en livraison :

```json
{
  "orderType": "delivery",
  "items": [
    { "id": 1, "quantity": 2 },
    { "id": 7, "quantity": 1 }
  ],
  "deliveryAddress": {
    "street": "1 rue Exemple",
    "postalCode": "75001",
    "city": "Paris",
    "details": "Deuxième étage"
  }
}
```

Pour une commande à emporter, utiliser `"orderType": "takeaway"` et omettre l’adresse. Le serveur accepte au maximum 200 caractères pour la rue, 20 pour le code postal, 100 pour la ville et 300 pour le complément. Le complément est facultatif ; les champs sont nettoyés des espaces en début et fin et les caractères de contrôle sont refusés.

La route de commande distingue notamment les données invalides (400), l’absence de session ou de compte vérifié (401), une origine refusée (403), une configuration email manquante (503) et un envoi incomplet ou non confirmé (502).

## Tests et vérifications

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Pour chercher également les variables et paramètres inutilisés :

```sh
npx tsc --noEmit --noUnusedLocals --noUnusedParameters
```

Les tests actuels couvrent :

- les paniers corrompus, les produits inconnus et les quantités invalides ;
- la fusion des articles et les limites de quantité sans mutation du panier d’origine ;
- les requêtes de commande mal formées et les prix falsifiés côté client ;
- la validation des adresses et la distinction livraison/emporter ;
- le contenu des emails et les acceptations, rejets ou erreurs SMTP simulés ;
- la génération et le format des jetons de récupération ;
- les limites de mot de passe, y compris les caractères Unicode.

Ces tests utilisent des données locales et des simulations SMTP. Ils n’envoient pas d’emails et ne nécessitent pas de connexion PostgreSQL. Ils ne couvrent pas tous les parcours navigateur ni les échanges réels avec la base et le fournisseur d’emails.

### Vérification manuelle de bout en bout

1. Créer un compte avec une adresse email accessible.
2. Ouvrir le lien de confirmation et se connecter.
3. Ajouter plusieurs produits, modifier les quantités et recharger la page pour vérifier la persistance.
4. Envoyer une commande à emporter et vérifier les deux emails ainsi que l’historique.
5. Refaire le parcours en livraison avec une adresse complète.
6. Demander une réinitialisation, changer le mot de passe et vérifier que l’ancien ne permet plus la connexion.
7. Vérifier la navigation clavier, les dialogues et le rendu sur petit écran.

Les essais de commande de cette liste enregistrent de vraies commandes et envoient des emails avec la configuration utilisée. Employer un environnement et des destinataires de test.

## Personnalisation

| Modification | Fichier ou dossier |
| --- | --- |
| Produits, catégories, descriptions et prix | `data/menu.ts` |
| Coordonnées et horaires | `data/restaurant.ts` |
| Images du catalogue et du restaurant | `public/` |
| Couleurs et police globale | `app/globals.css` et `app/layout.tsx` |
| Présentation des cartes | `components/FoodCard.tsx` et `components/Category.tsx` |
| Navigation et pied de page | `components/Navbar.tsx` et `components/Footer.tsx` |
| Texte des emails de commande | `lib/order-email.ts` |
| Emails d’inscription et de récupération | Routes correspondantes dans `app/api/` |
| Informations de présentation et notices | `app/about/`, `app/legal/`, `app/privacy/`, `app/cookies/` |

Conserver des identifiants numériques uniques et stables pour les produits. Le stockage du panier et la validation serveur s’appuient sur ces identifiants. Les prix du catalogue sont exprimés en euros, puis convertis en centimes pour les commandes.

## Dépannage

| Symptôme | Points à vérifier |
| --- | --- |
| Connexion PostgreSQL impossible | Service lancé, base existante, `DATABASE_URL`, droits et accès réseau |
| Table ou colonne manquante | Exécuter `npm run db:init` sur la base configurée |
| Inscription ou récupération indisponible | `NEXT_PUBLIC_URL`, configuration SMTP et journaux du serveur |
| Email non reçu | Dossier indésirables, identifiants SMTP, expéditeur autorisé et acceptation du fournisseur |
| Lien email vers la mauvaise adresse | `NEXT_PUBLIC_URL` doit correspondre au site réellement accessible |
| Connexion refusée après inscription | Confirmer l’email ; la création du compte ne le vérifie pas automatiquement |
| Session perdue | Expiration, changement de `JWT_SECRET`, réinitialisation du mot de passe ou accès à la base |
| Panier non mémorisé | Autorisation du stockage local dans le navigateur |
| Commande non confirmée | Consulter l’historique et contacter le restaurant avant tout nouvel envoi |
| Compilation bloquée sur Inter | Vérifier l’accès réseau nécessaire à la récupération de la police |

Un compte peut avoir été créé même si l’email de confirmation échoue ensuite : il n’existe pas encore d’interface de renvoi de cet email.

## Limites actuelles

- Aucun paiement en ligne, espace d’administration, gestion de stock ou suivi de préparation/livraison.
- Pas de frais de livraison, de contrôle de zone desservie ou de validation géographique de l’adresse.
- Catalogue géré dans le code, sans interface d’édition.
- Pas de bouton ou de route de déconnexion dédié dans l’état actuel du projet.
- Pas de renvoi de confirmation d’inscription ni d’expiration stockée pour ce jeton de confirmation.
- Pas de clé d’idempotence pour les commandes, de file d’attente email ou de nouvelle tentative automatique après échec.
- Pas de limitation globale des tentatives de connexion et d’inscription.
- Pas de suite de tests de bout en bout ni de validation complète d’accessibilité.
- Initialisation SQL simple, sans historique de migrations.
- Certaines informations légales et de confidentialité restent à compléter par l’exploitant.

Les contrôles automatisés facilitent les évolutions mais ne constituent pas, seuls, une validation de mise en production. Une utilisation réelle nécessite aussi de vérifier les parcours, les services externes, l’hébergement et la configuration du restaurant.
