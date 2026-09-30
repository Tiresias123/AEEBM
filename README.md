# AEEBM · Page de liens

Page de liens officielle (alternative sur mesure à Linktree) de l’**Association étudiante de l’École du Barreau de Montréal**.
Direction artistique de la charte 2026-2027 (papier blanc cassé grainé, encre et titres bordeaux), sceau guilloché, infolettre à double consentement et contenu entièrement piloté par un seul fichier de configuration.

- **Next.js 15** (App Router, React 19) · **TypeScript strict** · **Tailwind CSS v4**
- **framer-motion** (retour tactile, survols, transitions d’état), **lucide-react**, **canvas-confetti**
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
| Annoncer le prochain événement            | `alertBanner` : `label`, `message`, `date`, `endsAt` (masqué seul après)           |
| Mettre un autre lien en vedette           | `spotlight`                                                                        |
| Changer la mise en page d’une section     | `layout` : `"list"`, `"bento"` (grande carte + tuiles), `"tiles"`, `"group"`       |
| Mettre un lien en avant                   | `highlight: true` (carte soulignée de bordeaux)                                    |
| Changer l’inscription du sceau            | `association.seal` : `top` (arc supérieur) et `bottom` (arc inférieur)             |
| Changer les icônes des piliers de la bio  | `association.bioIcons` : une icône par segment de `bio` (séparés par « • »)        |
| Afficher la date d’un événement annoncé   | `alertBanner.date` : `"2026-09-30"` (vignette « 30 sept. » à gauche du message)    |
| Passer à la nouvelle année                | la constante `COHORTE`                                                             |
| Changer de thème                          | `theme: "ivoire"` (papier, par défaut), `"bordeaux"` (sombre) ou `"amethyste"`     |

Depuis GitHub : ouvrir le fichier › crayon ✏️ › modifier › **Commit changes**. L’hébergeur (Vercel) redéploie automatiquement.

**Adresses provisoires.** Tant qu’un lien vaut `A_COMPLETER`, sa carte s’affiche avec la mention « Bientôt », n’est pas cliquable et masque une éventuelle pastille « Nouveau » ; un réseau social est grisé ; le lien du bandeau et celui du pied de page sont omis. Chaque build liste ces adresses dans la console.

**Titres.** Les identifiants (`sections[].id`) n’acceptent que lettres, chiffres et tirets ; l’étiquette du bandeau (`label`) gagne à rester courte (« AGA », « 5 à 7 », « Gala »).

**Prochain événement.** Le bandeau du haut présente toujours le prochain événement public de l’Association : étiquette (`label`), message, vignette de date (`date`) et lien facultatif. Il ne se ferme pas et disparaît seul après `endsAt` : il suffit alors d’y inscrire l’événement suivant (à terme, automatiquement : voir « Évolution prévue »).

**Dates.** Une date sans fuseau est lue à l’heure de Montréal (`"2026-10-01"` = 1er octobre, 0 h). Les éléments datés apparaissent et disparaissent seuls, sans redéploiement ; une section dont tous les liens sont hors période disparaît avec eux. Une date inexistante (« 2026-02-30 ») arrête le build avec un message clair.

**Domaine.** `siteUrl` sert de dernier recours. Laissez `siteUrlConfirmed: false` tant que le domaine n’est pas repris : le build avertit si l’URL publique y pointe encore.

### Thèmes

Les couleurs vivent dans `src/config/themes.ts` (source unique : page, image de partage, icônes, manifeste).

- `ivoire` (défaut) : la charte 2026-2027 sur papier. Support blanc cassé à beige, légèrement grainé, posé sur un fond bordeaux sombre (grand écran) ; encre bordeaux-noir, texte secondaire en pierre ; titres de section, accroche et lien vedette en bordeaux Barreau ; bulles d’information blanches à filet chaud et ombre douce ; icônes de la couleur de leur catégorie sur tuile rosée ; sauge foncée pour « vérifié ».
- `bordeaux` : direction artistique de la charte 2026-2027 en version sombre. Bordeaux Barreau `#681A16` et ses nuances (bordeaux clair, grenat, cuir, bordeaux profond, bois de rose) pour le lien vedette, les halos et les icônes ; ivoire, rosé et brume pour le texte ; sauge réservée à « vérifié » ; grenat réservé aux appels à l’action et au point « à traiter » ; Cormorant Garamond et Poppins ; anneau de l’avatar ouvert comme le cercle de la charte.
- `amethyste` : pourpre, indigo et cobalt, Plus Jakarta Sans. En y passant, inverser aussi les valeurs `preload` des polices dans `src/app/layout.tsx`.

Dans tous les thèmes, le monogramme (sceau, favicon, icônes, image de partage) reste la version officielle sur bordeaux.

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
| `NEXT_PUBLIC_SITE_URL`  | URL publique (image de partage, SEO). Sinon : domaine de production Vercel, puis `siteUrl`. |
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
- [ ] Définir l’URL publique (`NEXT_PUBLIC_SITE_URL` ou domaine Vercel) avant de diffuser le lien (affiches, réseaux).
- [ ] Configurer Mailchimp (variables ci-dessus, langue française).
- [ ] Faire valider la politique de confidentialité (`/confidentialite`), la personne responsable et la liste des fournisseurs (`privacy`). Elle n’est plus liée depuis la page (ni infolettre ni pied de page) : la Loi 25 demande de publier sur le site une politique de confidentialité dès que des renseignements personnels y sont recueillis (adresses courriel de l’infolettre). Pour rétablir les liens : `privacyLink` dans `newsletter` et une entrée dans `association.legalLinks`.
- [ ] Remplacer `https://www.alumo.ca` par le portail du régime de l’AEEBM.
- [ ] Ajouter l’heure et le lieu de l’AGA au bandeau.

### Formulaire « Signaler une situation »

Le script `outils/formulaire-signalement.gs` crée en un clic le formulaire Google complet (parcours anonyme ou avec suivi, nature de la situation, description, démarches, attentes, urgence, consentement, avis de confidentialité) et sa feuille de réponses.

1. Depuis le compte Google de l’Association : <https://script.google.com> › Nouveau projet › coller le script.
2. Valider le bloc `CONFIG` (délai de réponse, durée de conservation), puis exécuter `creerFormulaireSignalement` et autoriser l’accès.
3. Récupérer le lien court affiché dans le journal (`forms.gle/…`) et le mettre dans le `href` de « Signaler une situation ».
4. Dans Google Forms : thème bordeaux (`#681A16`) et logo en en-tête ; Réponses › ⋮ › notifications par courriel ; partager la feuille de réponses seulement avec les personnes chargées du suivi.

Le formulaire accepte un nombre illimité de réponses, sans connexion à un compte Google.

### Évolution prévue : prochain événement depuis Google Agenda

Objectif : que le bandeau affiche seul le prochain événement public de l’AEEBM, sans modifier le code.

1. Créer (ou choisir) un agenda Google de l’Association réservé aux événements publics, et le rendre public : Paramètres de l’agenda › Autorisations d’accès › « Rendre disponible publiquement ».
2. Copier son **adresse publique au format iCal** (Paramètres › Intégrer l’agenda) et l’ajouter chez l’hébergeur (variable prévue : `GOOGLE_CALENDAR_ICS_URL`).
3. Le site lira cet agenda côté serveur et le relira toutes les heures : titre de l’événement → message, date → vignette, lien de la description → bouton. Si l’agenda est vide ou injoignable, le bandeau de `links.config.ts` reste affiché.

Aucune clé d’API n’est nécessaire pour un agenda public. À implémenter : lecture iCal dans `getPageModel` (`src/lib/site.ts`), point d’entrée unique du bandeau.

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
│   └── favicon.svg/, favicon.ico/, icon-*.png/, apple-touch-icon.png/, manifest.ts, robots.ts, sitemap.ts
├── components/
│   ├── BackgroundGlow.tsx      Halos radiaux, voile de bruit
│   ├── ProfileHeader.tsx       Sceau et ondes, nom, pastille, accroche et piliers de la bio
│   ├── SocialBar.tsx           Réseaux sociaux
│   ├── SpotlightCard.tsx       Lien vedette
│   ├── LinkCard.tsx            Carte de lien (tuile d’icône, titres, chevron animé)
│   ├── NewsletterCard.tsx      Formulaire d’infolettre avec états, annonces et confettis
│   ├── AlertBanner.tsx         Bandeau du prochain événement (vignette de date)
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
- **Sceau** : le monogramme au centre d’un sceau vectoriel calculé au rendu (`src/lib/seal.ts`) : bande guillochée (quatre sinusoïdes polaires entrelacées, comme la gravure des diplômes), inscription circulaire et deux filets, tous interrompus dans l’axe horizontal (cercle ouvert de la charte) où se posent deux losanges. Autour, les « ondes du cercle ouvert » : arcs concentriques très fins, estompés sous le sceau. Les tracés se dessinent à l’arrivée (animation CSS finie, désactivée par « réduire les animations »).
- **Sections** : titre en petites capitales suivi d’un filet, chacune avec sa mise en page (grande carte et tuiles, tuiles compactes, bloc groupé) pour rompre la monotonie ; trois niveaux de relief (cartes, tuiles en relief à biseau lumineux, carte mise en avant soulignée de bordeaux) ; icône en filigrane sur la grande carte ; infolettre en carton d’invitation à double filet.
- **Cercle ouvert** : repris en ornement entre deux filets (sous les réseaux sociaux et au-dessus du pied de page).
- **Support** : surface éclairée par le haut et légèrement grainée comme un papier vergé (blanc cassé dans `ivoire`, bordeaux fumé dans `bordeaux`) ; plein écran sur téléphone, carte à double filet (bordure et filet intérieur) dès 640 px. Teinte réglable dans `themes.ts` (`panel`).
- **Titres** : sigle, titres de section et infolettre en Cormorant Garamond ; texte courant en Poppins (charte, section 12).

### Accessibilité et performance

- WCAG 2.2 AA : contrastes, focus visibles, lien d’évitement, libellés et annonces ARIA, liens externes signalés, cibles tactiles.
- Animations limitées à l’apparition des blocs (page immobile en moins de 2 s) et neutralisées par « réduire les animations ». Aucun flou recalculé au défilement.
- Entrée en cascade en CSS : aucun contenu n’attend le JavaScript.
- `100dvh`, zones sûres iOS et `viewport-fit=cover` pour les navigateurs intégrés (Instagram, LinkedIn).
