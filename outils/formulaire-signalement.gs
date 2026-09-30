/**
 * AEEBM · Création du formulaire Google « Signaler une situation »
 *
 * Mode d’emploi (une seule fois, depuis le compte Google de l’Association, p. ex. aeebm.contact@gmail.com,
 * pour que le formulaire survive aux changements d’exécutif) :
 *   1. Ouvrir https://script.google.com › « Nouveau projet ».
 *   2. Remplacer le contenu par ce fichier, puis vérifier le bloc CONFIG ci-dessous (⚠️ à valider).
 *   3. Choisir la fonction « creerFormulaireSignalement » › « Exécuter » › autoriser l’accès (Forms, Sheets).
 *   4. Le journal d’exécution affiche : le lien court à partager, le lien de modification et la feuille de réponses.
 *   5. Dans Google Forms : personnaliser le thème (couleur #681A16, en-tête avec le logo) et activer
 *      Réponses › ⋮ › « Recevoir des notifications par e-mail pour les nouvelles réponses ».
 *   6. Transmettre le lien court (forms.gle/…) pour le brancher sur la carte « Signaler une situation ».
 *
 * Réutilisable par tous : aucune connexion Google exigée, nombre de réponses illimité, lien « Envoyer une autre
 * réponse » après l’envoi. Pas de question « Importer un fichier » : elle obligerait à se connecter à Google.
 */

const CONFIG = {
  titre: "Signaler une situation — AEEBM",
  responsable: "la vice-présidence aux affaires académiques",
  courriel: "aeebm.contact@gmail.com",
  delaiReponse: "cinq jours ouvrables", // ⚠️ À confirmer par l’exécutif
  conservation: "pendant le mandat de l’exécutif en cours, puis détruits", // ⚠️ À valider (Loi 25)
  feuilleReponses: "Signalements — AEEBM (réponses, accès restreint)",
};

function creerFormulaireSignalement() {
  const form = FormApp.create(CONFIG.titre);

  form.setDescription(
    [
      "Ce formulaire permet de signaler à l’AEEBM une plainte ou une préoccupation liée à votre parcours au Centre de " +
        "Montréal de l’École du Barreau : évaluation, enseignement, accommodement, organisation, climat d’études.",
      `Il est reçu par ${CONFIG.responsable}, qui en assure le suivi avec discrétion. Vous pouvez le remplir de façon ` +
        "anonyme ; sans coordonnées, nous ne pourrons toutefois pas vous répondre.",
      "Protection des renseignements personnels : les renseignements fournis servent uniquement au traitement de votre " +
        "signalement. Seules les personnes de l’exécutif chargées du dossier y ont accès ; ils sont conservés " +
        `${CONFIG.conservation}. Questions : ${CONFIG.courriel}.`,
      "En cas d’urgence ou de danger immédiat, composez le 911.",
    ].join("\n\n"),
  );

  // Réutilisable par tous, sans compte Google ; aucune réponse visible des autres répondants.
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setPublishingSummary(false);
  form.setShowLinkToRespondAgain(true);
  form.setProgressBar(true);
  form.setConfirmationMessage(
    `Merci. Votre signalement a bien été transmis à ${CONFIG.responsable} de l’AEEBM. ` +
      `Si vous avez laissé vos coordonnées, nous vous répondrons dans un délai d’environ ${CONFIG.delaiReponse}. ` +
      `Pour toute question : ${CONFIG.courriel}.`,
  );

  /* ─────────────── Page 1 : suivi ou anonymat ─────────────── */
  const suivi = form
    .addMultipleChoiceItem()
    .setTitle("Souhaitez-vous que l’AEEBM vous recontacte ?")
    .setHelpText("Un suivi personnalisé suppose de nous laisser vos coordonnées à l’étape suivante.")
    .setRequired(true);

  /* ─────────────── Page 2 : coordonnées (seulement si suivi) ─────────────── */
  const pageCoordonnees = form
    .addPageBreakItem()
    .setTitle("Vos coordonnées")
    .setHelpText("Elles ne servent qu’à vous répondre au sujet de ce signalement.");

  form.addTextItem().setTitle("Nom et prénom").setRequired(true);
  form
    .addTextItem()
    .setTitle("Adresse courriel")
    .setValidation(
      FormApp.createTextValidation().requireTextIsEmail().setHelpText("Veuillez saisir une adresse courriel valide.").build(),
    )
    .setRequired(true);
  form.addTextItem().setTitle("Téléphone (facultatif)");
  form
    .addMultipleChoiceItem()
    .setTitle("Moyen de contact préféré")
    .setChoiceValues(["Courriel", "Téléphone"])
    .setRequired(true);

  /* ─────────────── Page 3 : la situation ─────────────── */
  const pageSituation = form
    .addPageBreakItem()
    .setTitle("La situation")
    .setHelpText(
      "Pour une situation de harcèlement, de discrimination ou de violence à caractère sexuel, vous pouvez aussi " +
        "vous adresser directement aux ressources prévues par l’École du Barreau.",
    );

  form
    .addMultipleChoiceItem()
    .setTitle("Nature de la situation")
    .setChoiceValues([
      "Évaluation ou examen (déroulement, correction, révision de note)",
      "Enseignement ou encadrement",
      "Accommodement ou besoins particuliers",
      "Organisation, horaire ou communication de l’École",
      "Harcèlement, discrimination ou comportement inapproprié",
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addTextItem().setTitle("Cours, examen ou activité concernés (facultatif)");
  form.addDateItem().setTitle("Date des faits, même approximative (facultatif)");

  form
    .addParagraphTextItem()
    .setTitle("Décrivez la situation")
    .setHelpText(
      "Exposez les faits de façon factuelle : ce qui s’est passé, quand et dans quel contexte. " +
        "Évitez de nommer d’autres personnes si ce n’est pas nécessaire.",
    )
    .setRequired(true);

  form
    .addParagraphTextItem()
    .setTitle("Démarches déjà entreprises (facultatif)")
    .setHelpText("Par exemple : échange avec une personne formatrice, demande de révision, courriel à l’École.");

  form
    .addCheckboxItem()
    .setTitle("Qu’attendez-vous de l’AEEBM ? (facultatif)")
    .setChoiceValues([
      "Être informé·e de mes droits et des recours possibles",
      "Être accompagné·e dans une démarche auprès de l’École",
      "Que l’AEEBM porte la situation auprès de la direction",
      "Signaler une situation qui touche plusieurs personnes",
    ])
    .showOtherOption(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Degré d’urgence")
    .setChoiceValues([
      "Pas urgent",
      "À traiter rapidement",
      "Urgent : échéance proche (examen, date limite de révision, etc.)",
    ])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Avez-vous des documents à l’appui ? (facultatif)")
    .setHelpText("Ne les joignez pas ici : nous vous les demanderons par courriel si nécessaire.")
    .setChoiceValues(["Oui, je peux les transmettre sur demande", "Non"]);

  /* ─────────────── Page 4 : confirmation ─────────────── */
  form.addPageBreakItem().setTitle("Confirmation");
  form
    .addCheckboxItem()
    .setTitle("Consentement")
    .setChoiceValues([
      "Je confirme que les renseignements fournis sont exacts à ma connaissance et j’accepte que l’AEEBM " +
        "les utilise pour traiter mon signalement.",
    ])
    .setRequired(true);

  // Parcours : « Oui » passe par les coordonnées ; « Non » va directement à la situation (anonyme).
  suivi.setChoices([
    suivi.createChoice("Oui, je souhaite un suivi", pageCoordonnees),
    suivi.createChoice("Non, je fais un signalement anonyme", pageSituation),
  ]);

  // Réponses dans une feuille Google (à partager seulement avec les personnes chargées du suivi).
  const feuille = SpreadsheetApp.create(CONFIG.feuilleReponses);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, feuille.getId());

  const lienCourt = form.shortenFormUrl(form.getPublishedUrl());
  Logger.log("Lien à partager (carte « Signaler une situation ») : " + lienCourt);
  Logger.log("Modifier le formulaire : " + form.getEditUrl());
  Logger.log("Feuille des réponses : " + feuille.getUrl());
}
