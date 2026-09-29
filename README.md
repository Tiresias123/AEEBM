# AEEBM · Page de liens

Page de liens officielle (alternative sur mesure à Linktree) de l’**Association étudiante de l’École du Barreau de Montréal**.
Direction artistique bordeaux de la charte 2026-2027 (verre fumé sur fond sombre), code QR de partage, infolettre à double consentement et contenu entièrement piloté par un seul fichier de configuration.

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
| Changer de thème                          | `theme: "bordeaux"` (charte, par défaut) ou `theme: "amethyste"`                   |

Depuis GitHub : ouvrir le fichier › crayon ✏️ › modifier › **Commit changes**. L’hébergeur (Vercel) redéploie automatiquement.

**Adresses provisoires.** Tant qu’un lien vaut `A_COMPLETER`, sa carte s’affiche avec la mention « Bientôt », n’est pas cliquable et masque une éventuelle pastille « Nouveau » ; un réseau social est grisé ; le lien du bandeau et celui du pied de page sont omis. Chaque build liste ces adresses dans la console.

**Titres.** Les identifiants (`sections[].id`, `alertBanner.id`) n’acceptent que lettres, chiffres et tirets ; l’étiquette du bandeau (`label`) gagne à rester courte (6 caractères environ), car elle sert aussi de pastille repliée.

**Bandeau d’annonce.** Le bouton ✕ replie l’annonce en une pastille (en haut à gauche) qui permet de la rouvrir ; ce choix est mémorisé pour cet `id`. Pour diffuser une nouvelle annonce dépliée à tout le monde, changez l’`id` (lettres, chiffres, tirets).

**Dates.** Une date sans fuseau est lue à l’heure de Montréal (`"2026-10-01"` = 1er octobre, 0 h). Les éléments datés apparaissent et disparaissent seuls, sans redéploiement ; une section dont tous les liens sont hors période disparaît avec eux. Une date inexistante (« 2026-02-30 ») arrête le build avec un message clair.

**Domaine.** `siteUrl` sert de dernier recours. Laissez `siteUrlConfirmed: false` tant que le domaine n’est pas repris : le build avertit si l’URL publique y pointe encore.

### Thèmes

Les couleurs vivent dans `src/config/themes.ts` (source unique : page, image de partage, icônes, manifeste).

- `bordeaux` (défaut) : direction artistique de la charte 2026-2027 en version sombre. Bordeaux Barreau `#681A16` et ses nuances (bordeaux clair, grenat, cuir, bordeaux profond, bois de rose) pour le lien vedette, les halos et les icônes ; ivoire, rosé et brume pour le texte ; sauge réservée à « vérifié » ; grenat réservé aux appels à l’action et au point « à traiter » ; Cormorant Garamond et Poppins ; anneau de l’avatar ouvert comme le cercle de la charte.
- `amethyste` : pourpre, indigo et cobalt, Plus Jakarta Sans. En y passant, inverser aussi les valeurs `preload` des polices dans `src/app/layout.tsx`.

Dans les deux thèmes, le monogramme (avatar, favicon, icônes, centre du code QR, image de partage) reste la version officielle sur bordeaux.

---

## Voir le site en ligne

GitHub conserve le code et affiche ce fichier explicatif : il n’exécute pas le site. Pour l’afficher, on relie le dépôt à Vercel (compte gratuit, aucune installation) :

1. Aller sur <https://vercel.com/signup> et choisir **Continue with GitHub**.
2. **Add New… › Project**, puis **Import** à côté du dépôt `aeebm`. S’il n’apparaît pas : **Adjust GitHub App Permissions** et autoriser ce dépôt.
3. Ne rien changer (Next.js est détecté seul) et cliquer sur **Deploy**. Après une ou deux minutes, Vercel donne l’adresse du site (`….vercel.app`).
4. Sur GitHub, l’adresse apparaît ensuite dans **Deployments** (colonne de droite du dépôt). Pour l’afficher en haut du dépôt : roue dentée ⚙️ à côté de **About › Website**.

Chaque modification enregistrée sur GitHub redéploie le site automatiquement. L’infolettre ne fonctionne en ligne qu’une fois `MAILCHIMP_API_KEY` et `MAILCHIMP_AUDIENCE_ID` ajoutées dans Vercel › Settings › Environment Variables (puis **Redeploy**).

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
│   ├── BackgroundGlow.tsx      Halos radiaux, voile de bruit
│   ├── ProfileHeader.tsx       Avatar à anneau ouvert, nom, pastille, accroche et biographie
│   ├── SocialBar.tsx           Réseaux sociaux
│   ├── SpotlightCard.tsx       Lien vedette
│   ├── LinkCard.tsx            Carte de lien (tuile d’icône, titres, chevron animé)
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
- **Cercle ouvert** : anneau de l’avatar, interrompu dans l’axe du sigle, repris en ornement entre deux filets (sous les réseaux sociaux et au-dessus du pied de page).
- **Support** : surface bordeaux fumé, éclairée par le haut et légèrement grainée comme un papier vergé ; plein écran sur téléphone, carte à double filet (bordure et filet intérieur) dès 640 px. Teinte réglable dans `themes.ts` (`panel`).
- **Titres** : sigle, titres de section, infolettre et fenêtre de partage en Cormorant Garamond ; texte courant en Poppins (charte, section 12).

### Accessibilité et performance

- WCAG 2.2 AA : contrastes, focus visibles, lien d’évitement, libellés et annonces ARIA, liens externes signalés, fenêtre modale Radix, cibles tactiles.
- Animations limitées à l’apparition des blocs (page immobile en moins de 2 s) et neutralisées par « réduire les animations ». Aucun flou recalculé au défilement.
- Entrée en cascade en CSS : aucun contenu n’attend le JavaScript ; fenêtre de partage et code QR chargés à la demande (avec repli si le chargement échoue).
- `100dvh`, zones sûres iOS et `viewport-fit=cover` pour les navigateurs intégrés (Instagram, LinkedIn).
