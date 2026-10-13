# SALMA Fragrance · boutique en ligne

Plateforme de vente en ligne de SALMA Fragrance (Dakar), d'après la proposition LAS COM, **formule Prestige**.

## Démarrer en local (une seule fois)

Prérequis : [Node.js 20+](https://nodejs.org) et [Git](https://git-scm.com).

```bash
git clone https://github.com/NianeDIOP/salma_parfumerie.git
cd salma_parfumerie
git checkout claude/confident-cannon-sddp7m
npm install
```

## Travailler au quotidien : synchronisation automatique

```bash
npm run dev:sync
```

Ouvrez ensuite **http://localhost:3000**. Laissez cette commande tourner :

- le site s'affiche en local ;
- toutes les 20 secondes, les nouveaux commits poussés sur GitHub sont récupérés automatiquement ;
- la page du navigateur se met à jour toute seule, sans rien faire ;
- si de nouvelles dépendances sont ajoutées, `npm install` est lancé et le serveur redémarre.

Vos propres modifications locales non commitées sont préservées (mises de côté puis réappliquées).

Options : `SYNC_INTERVAL=10 npm run dev:sync` (vérifie toutes les 10 s), `PORT=4000 npm run dev:sync`.

> Sur Windows (PowerShell) : `$env:SYNC_INTERVAL=10; npm run dev:sync`

### Proposer un changement

- **Le plus simple** : décrivez le changement à Claude dans la session ; il le code, le pousse sur GitHub, et il apparaît tout seul en local.
- **Vous-même** : modifiez le code, puis `git add -A && git commit -m "..." && git push`.

## Administration (gestion de tout le site)

Ouvrez **http://localhost:3000/admin**.

- Premier accès : `admin@salma.sn` / `salma2026`, **à changer immédiatement** (Paramètres › Sécurité).
- Seuls les administrateurs enregistrés (Paramètres › Administrateurs) peuvent se connecter.

| Espace | Ce qu'on y gère |
| --- | --- |
| Tableau de bord | Chiffre d'affaires, commandes, panier moyen, ventes sur 14 jours, moyens de paiement, alertes stock, meilleures ventes |
| Commandes | Toutes les ventes (site, boutique, WhatsApp), filtres, processus en attente → payée → préparation → livraison → livrée (ou annulation / remboursement avec remise en stock), livreur, notes, contact client |
| Nouvelle vente | Saisie d'une vente en boutique ou d'une commande WhatsApp |
| Clients | Fichier client construit à partir des commandes, export CSV |
| Codes promo | Pourcentage ou montant, minimum d'achat, activation |
| Produits | Création, modification, duplication, brouillon / en ligne, photos (envoi depuis l'ordinateur), contenances, prix, stock, profil olfactif, couleurs du produit |
| Stocks & prix | Tableau de tous les prix et stocks, ajustement de prix en masse |
| Univers | Catégories du site : nom, texte, photo, couleurs, ordre |
| Page d'accueil | Sections ajoutables, réordonnables, masquables et modifiables (hero, rangées de produits, familles, images, textes, réassurance…) |
| Apparence | Logo, couleurs du site, police, effets, menu de l'en-tête, pied de page, libellés de la barre mobile |
| Pages | Livraison, FAQ, contact, CGV et toute nouvelle page (`/pages/…`) |
| Livraison & paiement | Zones, délais, frais, livraison offerte, moyens de paiement, échantillon offert |
| Thème de l'admin | 8 modèles (Salma Crème, Nuit, Ardoise, Bissap, Émeraude, Luxe doré, Minimal, Lavande) avec aperçu en direct, puis couleurs, arrondis et police personnalisables |
| Paramètres | Coordonnées, WhatsApp, référencement Google, administrateurs, mot de passe |

### Données

- Tout est enregistré dans `data/salma-db.json` (créé au premier lancement à partir du catalogue de départ). Les images envoyées sont dans `data/uploads/`.
- Le dossier `data/` n'est **pas** envoyé sur GitHub : vos données locales ne sont jamais écrasées par la synchronisation. Pour une sauvegarde, copiez ce dossier.
- En production : définir `SALMA_SECRET` (clé de signature des sessions) et, si besoin, `SALMA_DATA_DIR` (dossier de données sur un disque persistant). Le module `src/lib/db.ts` pourra être remplacé par PostgreSQL sans toucher au reste.

## Commandes

| Commande           | Rôle                                              |
| ------------------ | ------------------------------------------------- |
| `npm run dev:sync` | Site local + synchronisation automatique GitHub   |
| `npm run dev`      | Site local seul                                   |
| `npm run build`    | Build de production (vérifie aussi les types)     |
| `npm run lint`     | Vérification du code                              |

## Technique

- **Next.js 16** (App Router, rendu serveur et statique), **React 19**, **TypeScript**
- **Tailwind CSS 4**, design system SALMA dans `src/app/globals.css` (rouge bissap, bleu nuit, rose poudré, crème)
- **Motion** (animations et transitions de pages), défilement natif du navigateur
- Catalogue de démonstration dans `src/lib/catalogue.ts` : chaque produit a ses photos et sa couleur de thème (`theme`), qui pilote les fonds et transitions
- Photos : [Unsplash](https://unsplash.com/license) (licence libre, usage commercial autorisé), chargées depuis leur CDN. Les prix, stocks et la sélection de marques sont indicatifs : à remplacer par le catalogue réel de SALMA et ses packshots officiels

```
src/
├── app/
│   ├── page.tsx                 Accueil (maquette 1)
│   ├── [univers]/page.tsx       Catalogue avec filtres (maquette 2)
│   ├── [univers]/[slug]/        Fiche produit (maquette 3)
│   ├── (site)/                  Site public (accueil, univers, fiches, boutique, favoris, panier, pages, suivi de commande)
│   ├── admin/                   Administration protégée
│   ├── boutique/ · favoris/      Onglets de la version mobile
│   ├── quiz/                    Quiz « Ma Signature »
│   └── panier/                  Panier → livraison → paiement → confirmation (maquette 4)
├── components/                  Hero, motion design, cartes produit, panier, recherche…
└── lib/                         Base de données, sessions admin, actions serveur, catalogue, recherche
```

## Feuille de route (formule Prestige)

- [x] Fondations : design system, accueil, catalogue, fiche produit, recherche, panier, quiz, tunnel de commande (paiement simulé)
- [x] Motion design : hero aux couleurs de chaque parfum, révélations d'images, familles olfactives, transitions de pages, curseur signature (défilement natif, sans blocage)
- [ ] Flacons 3D (Three.js / React Three Fiber)
- [x] Back-office complet réservé à l'admin : tableau de bord, commandes et processus jusqu'à la livraison, ventes boutique / WhatsApp, produits, stocks et prix, univers, clients, codes promo, livraison, paiements
- [x] Gestion de tout le site public : accueil par sections, couleurs, police, logo, en-tête, pied de page, barre mobile, pages, référencement
- [ ] Base PostgreSQL (la base actuelle est un fichier JSON local)
- [ ] Paiements réels : agrégateur Mobile Money (Wave, Orange Money, Free Money) + cartes
- [ ] Compte client (connexion par SMS), Cercle SALMA, avis vérifiés, coffrets personnalisés
- [ ] Notifications SMS / WhatsApp / e-mail, application livreur
- [x] Version mobile façon application : barre d'onglets en bas, barre du haut avec retour, rangées défilantes, barre d'achat fixe, favoris, site installable (PWA)
- [ ] Multilingue FR / EN / wolof, multi-devises, notifications push
- [ ] Applications natives iOS & Android, live shopping, espace pro
