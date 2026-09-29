# AEEBM · Page de liens

Page de liens officielle (alternative sur mesure à Linktree) de l’**Association étudiante de l’École du Barreau de Montréal**.
Esthétique « Dark Luxury / Glassmorphism », code QR de partage, infolettre à double consentement et contenu entièrement piloté par un seul fichier de configuration.

- **Next.js 15** (App Router, React 19) · **TypeScript strict** · **Tailwind CSS v4**
- **framer-motion** (retour tactile, survols, transitions d’état), **lucide-react**, **Radix UI Dialog**, **canvas-confetti**, **qrcode.react**
- Image de partage, favicons, icônes PWA et manifeste générés au build à partir de la configuration et du thème
- Page statique : contenu visible dès le premier affichage, même sans JavaScript

---

## Modifier le contenu en 30 secondes

Tout se trouve dans **`src/config/links.config.ts`**.

| Je veux…                                  | Je modifie…                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Changer l’adresse ou le texte d’un lien   | le `href`, le `title` ou le `subtitle` du lien dans `sections`                     |
| Masquer un lien temporairement            | `hidden: true`                                                                     |
| Afficher un lien ou une pastille un temps | `startsAt` / `endsAt` : `"2026-10-15"` ou `"2026-10-15T18:00"` (heure de Montréal) |
| Ajouter une pastille                      | `badge: { label: "Nouveau", tone: "new" }` (`important`, `deadline`, `info`)       |
| Changer la couleur d’une icône            | `category` : `academique`, `evenements`, `carriere`, `representation`, `services`  |
| Changer d’icône                           | `icon` : un nom de `src/lib/icons.ts` (catalogue : <https://lucide.dev/icons>)     |
| Publier une annonce en haut de page       | `alertBanner` : `enabled: true`, **nouvel `id`**, `message`, `endsAt` facultatif   |
| Mettre un autre lien en vedette           | `spotlight`                                                                        |
| Passer à la nouvelle année                | la constante `COHORTE`                                                             |
| Passer à la charte bordeaux de l’AEEBM    | `theme: "barreau"`                                                                 |

Depuis GitHub : ouvrir le fichier › crayon ✏️ › modifier › **Commit changes**. L’hébergeur (Vercel) redéploie automatiquement.

**Adresses provisoires.** Tant qu’un lien vaut `A_COMPLETER`, sa carte s’affiche avec la mention « Bientôt », n’est pas cliquable et masque une éventuelle pastille « Nouveau » ; un réseau social est grisé ; le lien du bandeau et celui du pied de page sont omis. Chaque build liste ces adresses dans la console.

**Titres.** Les identifiants (`sections[].id`, `alertBanner.id`) n’acceptent que lettres, chiffres et tirets ; l’étiquette du bandeau (`label`) gagne à rester courte (6 caractères environ), car elle sert aussi de pastille repliée.

**Bandeau d’annonce.** Le bouton ✕ replie l’annonce en une pastille (en haut à gauche) qui permet de la rouvrir ; ce choix est mémorisé pour cet `id`. Pour diffuser une nouvelle annonce dépliée à tout le monde, changez l’`id` (lettres, chiffres, tirets).

**Dates.** Une date sans fuseau est lue à l’heure de Montréal (`"2026-10-01"` = 1er octobre, 0 h). Les éléments datés apparaissent et disparaissent seuls, sans redéploiement ; une section dont tous les liens sont hors période disparaît avec eux. Une date inexistante (« 2026-02-30 ») arrête le build avec un message clair.

**Domaine.** `siteUrl` sert de dernier recours. Laissez `siteUrlConfirmed: false` tant que le domaine n’est pas repris : le build avertit si l’URL publique y pointe encore.

### Thèmes

Les couleurs vivent dans `src/config/themes.ts` (source unique : page, image de partage, icônes, manifeste).

- `amethyste` (défaut) : pourpre, indigo et cobalt, Plus Jakarta Sans.
- `barreau` : déclinaison sombre de la charte 2026-2027 : bordeaux Barreau `#681A16` en aplat, neutres chauds, sauge pour « vérifié », grenat réservé aux appels à l’action et au point « à traiter », Cormorant Garamond et Poppins, anneau de l’avatar ouvert comme le cercle de la charte.

Dans les deux thèmes, le monogramme (avatar, favicon, icônes, centre du code QR, image de partage) reste la version officielle sur bordeaux.

---

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production (vérifie TypeScript)
npm run lint
npm run typecheck
```

### Variables d’environnement

Copier `.env.example` en `.env.local` (ou les définir chez l’hébergeur).

| Variable                | Rôle                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | URL publique (code QR, partage, SEO). Sinon : domaine de production Vercel, puis `siteUrl`. |
| `MAILCHIMP_API_KEY`     | Clé d’API Mailchimp (se termine par `-us21`, `-us6`…).                                      |
| `MAILCHIMP_AUDIENCE_ID` | Identifiant de l’audience Mailchimp.                                                        |

Sans Mailchimp, l’inscription est simulée en développement et renvoie un message d’erreur explicite en production (le build l’annonce). Les nouvelles adresses reçoivent un courriel de confirmation (double consentement, LCAP et Loi 25). La réponse est la même pour une adresse nouvelle ou déjà abonnée, pour ne pas révéler qui est inscrit. Sans JavaScript, le formulaire fonctionne aussi (envoi classique, page de confirmation).

#### Réglages Mailchimp à vérifier une fois

- **Langue** : Audience › Signup forms › Form builder › _Translate it_ › langue par défaut **French**. Les inscriptions passant par l’API, « Auto-translate » ne suffit pas.
- Relire en français le courriel de confirmation (_Opt-in confirmation email_), la page de remerciement, le courriel de bienvenue et les pages de désabonnement.
- **Double consentement** : Audience › Settings › _Enable double opt-in_.
- **Coordonnées de l’expéditeur** (pied de chaque envoi) : 445, boulevard Saint-Laurent, bureau 215, Montréal (Québec) H2Y 2Y7.
- **Suivi des ouvertures et des clics** : activé par défaut ; s’il est désactivé pour tous les envois, passer `privacy.emailTracking` à `false` (la politique de confidentialité s’adapte).

#### Protection contre les abus

L’API limite les envois par adresse IP (au mieux, par instance) et refuse les requêtes venant d’autres sites. Pour une protection durable, ajouter une règle _Rate limit_ sur `/api/newsletter` dans Vercel › Firewall.

### Avant la mise en ligne

- [ ] Remplacer les adresses `A_COMPLETER` (réseaux sociaux, Drive, formulaires, billetterie, règlements).
- [ ] Définir l’URL publique (`NEXT_PUBLIC_SITE_URL` ou domaine Vercel) **avant d’imprimer le code QR**.
- [ ] Configurer Mailchimp (variables ci-dessus, langue française).
- [ ] Faire valider la politique de confidentialité (`/confidentialite`), la personne responsable et la liste des fournisseurs (`privacy`).
- [ ] Remplacer `https://www.alumo.ca` par le portail du régime de l’AEEBM.
- [ ] Ajouter l’heure et le lieu de l’AGA au bandeau.

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx              Métadonnées, polices, variables de thème, script de préaffichage, avertissements de build
│   ├── page.tsx                Assemblage de la page + données structurées schema.org
│   ├── globals.css             Système de design (verre, halos, entrée en cascade, catégories, pastilles)
│   ├── confidentialite/        Politique de confidentialité (Loi 25)
│   ├── api/newsletter/         Inscription Mailchimp (statuts, réabonnement, pot de miel, origine)
│   ├── opengraph-image.tsx     Image de partage 1200 × 630 (JPEG) générée au build
│   └── favicon.svg/, favicon.ico/, qr-logo.svg/, icon-*.png/, apple-touch-icon.png/, manifest.ts, robots.ts, sitemap.ts
├── components/
│   ├── BackgroundGlow.tsx      Halos radiaux, cercle ouvert, voile de bruit
│   ├── ProfileHeader.tsx       Avatar à anneau lumineux, nom, pastille, accroche et biographie
│   ├── SocialBar.tsx           Réseaux sociaux
│   ├── SpotlightCard.tsx       Lien vedette
│   ├── LinkCard.tsx            Carte de lien (squircle, titres, chevron animé)
│   ├── NewsletterCard.tsx      Formulaire d’infolettre avec états, annonces et confettis
│   ├── ShareModal.tsx          Bouton de partage (la fenêtre ShareDialog est chargée à la demande)
│   ├── ShareDialog.tsx         Copie du lien, partage direct, code QR téléchargeable
│   ├── AlertBanner.tsx         Bandeau repliable en pastille, mémorisé par identifiant
│   ├── Footer.tsx              Logo officiel et mentions institutionnelles
│   └── brand/                  Monogramme vectoriel, pastille vérifiée, icônes de marques
├── config/
│   ├── links.config.ts         ← CONTENU DE LA PAGE
│   ├── themes.ts               Jetons de design par thème
│   └── types.ts                Schéma typé de la configuration
└── lib/                        Dates et préaffichage, URL, icônes, typographie, monogramme SVG, image de partage
```

### Identité visuelle

- **Monogramme** : sigle AEEBM vectorisé en Cormorant Garamond SemiBold, inscrit dans le cercle ouvert (fiche d’identité 2026-2027, section 10). Variante renforcée pour les favicons.
- **Logo officiel** (`src/assets/brand/aeebm-logo-blanc.png`) : version principale « blanc sur bordeaux » (plaque bordeaux en aplat, zone de protection respectée), affichée à 120 px, au-dessus du minimum de 110 px.
- **Cercle ouvert** : motif d’arrière-plan qui sort de la page par un angle, affiché sur grand écran, toujours tenu à l’écart de la colonne de texte et absent des pages intérieures.

### Accessibilité et performance

- WCAG 2.2 AA : contrastes, focus visibles, lien d’évitement, libellés et annonces ARIA, liens externes signalés, fenêtre modale Radix, cibles tactiles.
- Toutes les animations sont finies (page immobile en moins de 5 s) et neutralisées par « réduire les animations ».
- Entrée en cascade en CSS : aucun contenu n’attend le JavaScript ; fenêtre de partage et code QR chargés à la demande (avec repli si le chargement échoue).
- `100dvh`, zones sûres iOS et `viewport-fit=cover` pour les navigateurs intégrés (Instagram, LinkedIn).
