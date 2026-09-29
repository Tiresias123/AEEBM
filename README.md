# AEEBM · Page de liens

Page de liens officielle (alternative sur mesure à Linktree) de l’**Association étudiante de l’École du Barreau de Montréal**.
Esthétique « Dark Luxury / Glassmorphism », animations fluides, code QR de partage, infolettre et contenu entièrement piloté par un seul fichier de configuration.

- **Next.js 15** (App Router, React 19) · **TypeScript strict** · **Tailwind CSS v4**
- **framer-motion** (entrées en cascade, retour tactile), **lucide-react**, **Radix UI Dialog**, **canvas-confetti**, **qrcode.react**
- Image OpenGraph, favicon SVG, icônes PWA et manifeste générés au build à partir de la configuration et du thème

---

## Modifier le contenu en 30 secondes

Tout se trouve dans **`src/config/links.config.ts`**. Aucune autre modification n’est nécessaire.

| Je veux…                                   | Je modifie…                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| Changer l’adresse ou le texte d’un lien    | le `href`, le `title` ou le `subtitle` du lien dans `sections`                      |
| Masquer un lien temporairement             | `hidden: true`                                                                      |
| Ajouter une pastille « Nouveau »           | `badge: { label: "Nouveau", tone: "new" }` (`important`, `deadline`, `info`)        |
| Changer la couleur d’une icône             | `category` : `academique`, `evenements`, `carriere`, `representation`, `services`  |
| Changer d’icône                            | `icon` : un nom de `src/lib/icons.ts` (catalogue : <https://lucide.dev/icons>)       |
| Publier une annonce en haut de page        | `alertBanner` : `enabled: true`, **nouvel `id`**, `message`, `endsAt` facultatif     |
| Mettre un autre lien en vedette            | `spotlight`                                                                          |
| Passer à la charte bordeaux de l’AEEBM     | `theme: "barreau"` (et retirer `spotlight.gradient` pour reprendre le bordeaux)      |

Depuis GitHub : ouvrir le fichier › crayon ✏️ › modifier › **Commit changes**. L’hébergeur (Vercel) redéploie automatiquement.

> Les adresses encore provisoires valent `A_COMPLETER`. Chaque build les liste dans la console tant qu’elles n’ont pas été remplacées.

### Bandeau d’annonce

Une personne qui ferme le bandeau ne le revoit plus **pour cet `id`**. Pour diffuser une nouvelle annonce à tout le monde, changez l’`id` (p. ex. `"soiree-2026-12-05"`). `startsAt` et `endsAt` (format ISO, heure de Montréal : `"2026-10-01T00:00:00-04:00"`) bornent la diffusion automatiquement.

### Thèmes

Les couleurs vivent dans `src/config/themes.ts` (source unique : page, image de partage, icônes, manifeste).

- `amethyste` (défaut) : pourpre, indigo et cobalt, Plus Jakarta Sans.
- `barreau` : déclinaison sombre de la charte 2026-2027 : bordeaux Barreau `#681A16` en aplat, neutres chauds, sauge pour « vérifié », grenat réservé aux appels à l’action, Cormorant Garamond et Poppins, monogramme « avatar rond » sur bordeaux.

---

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production (vérifie TypeScript)
npm run lint
npm run typecheck
```

### Variables d’environnement (facultatives)

Copier `.env.example` en `.env.local`.

| Variable                 | Rôle                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | URL publique (code QR, partage, SEO). Sinon : domaine Vercel de production, puis `siteUrl`. |
| `MAILCHIMP_API_KEY`      | Clé d’API Mailchimp (se termine par `-us21`, `-us6`…).                                 |
| `MAILCHIMP_AUDIENCE_ID`  | Identifiant de l’audience Mailchimp.                                                   |

Sans Mailchimp, l’inscription à l’infolettre est simulée en développement et renvoie une erreur explicite en production. Les nouvelles inscriptions reçoivent un courriel de confirmation (double consentement, LCAP et Loi 25).

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx              Métadonnées, polices, variables de thème, viewport 100dvh
│   ├── page.tsx                Assemblage de la page + données structurées schema.org
│   ├── globals.css             Système de design (verre, halos, animations, catégories)
│   ├── api/newsletter/         Inscription Mailchimp (validation, pot de miel)
│   ├── opengraph-image.tsx     Image de partage 1200 × 630 générée au build
│   ├── favicon.svg/            Favicon vectoriel (monogramme)
│   ├── icon-*.png/, apple-touch-icon.png/, manifest.ts, robots.ts, sitemap.ts
├── components/
│   ├── BackgroundGlow.tsx      Halos radiaux, cercle ouvert, voile de bruit
│   ├── ProfileHeader.tsx       Avatar à anneau lumineux, nom, pastille, biographie
│   ├── SocialBar.tsx           Réseaux sociaux
│   ├── SpotlightCard.tsx       Lien vedette
│   ├── LinkCard.tsx            Carte de lien (squircle, titres, chevron animé)
│   ├── NewsletterCard.tsx      Formulaire d’infolettre avec états et confettis
│   ├── ShareModal.tsx          Partage, copie du lien, code QR téléchargeable
│   ├── AlertBanner.tsx         Bandeau rétractable, mémorisé par identifiant
│   ├── Footer.tsx              Logo officiel et mentions institutionnelles
│   └── brand/                  Monogramme vectoriel, pastille vérifiée, icônes de marques
├── config/
│   ├── links.config.ts         ← CONTENU DE LA PAGE
│   ├── themes.ts               Jetons de design par thème
│   └── types.ts                Schéma typé de la configuration
└── lib/                        Utilitaires (icônes, confettis, URL, monogramme SVG)
```

### Identité visuelle

- **Monogramme** : sigle AEEBM vectorisé en Cormorant Garamond SemiBold, inscrit dans le cercle ouvert, conformément à la section 10 de la fiche d’identité 2026-2027 (avatar, favicon, code QR).
- **Logo officiel** (`public/brand/aeebm-logo-blanc.png`) : version blanche sur fond transparent, extraite de la fiche d’identité, affichée au-dessus de la taille minimale de 110 px.
- **Cercle ouvert** : motif d’arrière-plan sortant de la page par l’angle, affiché seulement sur grand écran pour ne jamais passer derrière le texte.

### Accessibilité et performance

- Contrastes AA, focus visibles, libellés ARIA, liens externes annoncés, fenêtre modale accessible (Radix).
- Respect de « réduire les animations » (CSS et framer-motion).
- Page statique (SSG), animations chargées à la demande (`LazyMotion`), confettis et code QR chargés au besoin.
- `100dvh`, zones sûres iOS et `viewport-fit=cover` pour les navigateurs intégrés (Instagram, LinkedIn).
