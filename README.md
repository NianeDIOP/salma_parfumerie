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
│   ├── boutique/ · favoris/      Onglets de la version mobile
│   ├── quiz/                    Quiz « Ma Signature »
│   └── panier/                  Panier → livraison → paiement → confirmation (maquette 4)
├── components/                  Hero, motion design, cartes produit, panier, recherche…
└── lib/                         Catalogue, recherche tolérante aux fautes
```

## Feuille de route (formule Prestige)

- [x] Fondations : design system, accueil, catalogue, fiche produit, recherche, panier, quiz, tunnel de commande (paiement simulé)
- [x] Motion design : hero aux couleurs de chaque parfum, révélations d'images, familles olfactives, transitions de pages, curseur signature (défilement natif, sans blocage)
- [ ] Flacons 3D (Three.js / React Three Fiber)
- [ ] Back-office : tableau de bord, commandes, paiements, stocks, clients, livraisons (maquette 5)
- [ ] Base de données PostgreSQL + API e-commerce
- [ ] Paiements réels : agrégateur Mobile Money (Wave, Orange Money, Free Money) + cartes
- [ ] Compte client (connexion par SMS), Cercle SALMA, avis vérifiés, coffrets personnalisés
- [ ] Notifications SMS / WhatsApp / e-mail, application livreur
- [x] Version mobile façon application : barre d'onglets en bas, barre du haut avec retour, rangées défilantes, barre d'achat fixe, favoris, site installable (PWA)
- [ ] Multilingue FR / EN / wolof, multi-devises, notifications push
- [ ] Applications natives iOS & Android, live shopping, espace pro
