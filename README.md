# TATAMI — application mobile native

Application React Native avec Expo, destinée à iOS et Android. L'interface est
composée de composants natifs (`View`, `Text`, `TextInput`, `Pressable`) : ce
n'est pas un site web ni une PWA.

## Lancer sur un téléphone

```bash
npm install
npm start
```

Installez **Expo Go** sur le téléphone, puis scannez le QR code affiché dans le
terminal. Le téléphone et l'ordinateur doivent être sur le même réseau.

Pour ouvrir un simulateur déjà installé :

```bash
npm run ios
npm run android
```

Pour produire des applications natives installables, configurez les identifiants
iOS/Android dans `app.json`, puis utilisez EAS Build.

## Structure

```text
App.js
app.json
src/
├── components/
│   └── BrandMark.jsx
├── context/
├── hooks/
├── screens/
│   └── LoginScreen.jsx
└── theme/
    └── tokens.js
```

Les couleurs et rayons du design system sont centralisés dans `src/theme/tokens.js`.
Tailwind CSS ne s'applique pas directement aux vues natives ; l'écran utilise
`StyleSheet` React Native. Les actions de connexion, inscription et récupération
du mot de passe restent à relier à l'API Django.

## Vérification

- `npm run lint` : vérification statique.
- `npm run check` : vérification de la configuration Expo.
- `npx expo export --platform ios --platform android` : compilation des bundles.

## Sprint 5 — médias

Après connexion, choisir le rôle STAFF puis le quatrième onglet MÉDIAS.
La miniature d’un fichier ouvre la visionneuse photo ou vidéo.
Les écrans sont dans `src/screens/AddMediaScreen.js` et
`src/screens/MediaViewerScreen.js`; `MediaDemoScreen.js` reste un composant de test isolé, non affiché dans l’application.
Les composants visuels communs sont dans `src/components/media/MediaUI.js`.

- Import réel de la galerie via Expo ImagePicker, recherche des élèves,
  sélection groupe / plusieurs / un seul, exclusion des élèves sans consentement.
- Envoi simulé avec progression, retrait de fichiers et conservation de la sélection
  lors d’un aller-retour dans la visionneuse. Aucun serveur n’est appelé.
- Lecteur Expo Video : lecture/pause, ±10 s, vitesse, son, plein écran et positionnement.
- Album : navigation par flèches ou balayage, miniatures et agrandissement.
  Le pincement dans l’agrandissement utilise le zoom natif ScrollView sur iOS.
- Partage système et enregistrement dans la photothèque sur iOS/Android.
  Sur le Web, le téléchargement ouvre le fichier pour l’enregistrer manuellement.
- Favoris et retrait des médias limités à la session de visionnage.

Les données de `src/data/mediaDemo.js` sont illustratives : l’album répète une
photo de démonstration et les clips utilisent une vidéo publique de test.
Remplacer ces URL et leurs métadonnées par les médias autorisés du club.
Les captures mentionnées dans le brief n’étaient pas jointes : les styles suivent
la description textuelle (couleurs, polices et rayons de 4 px).

Pour la production, relier l’envoi à l’API, faire valider les droits et consentements
côté serveur, et fournir des URL de téléchargement autorisées. Les restrictions
locales de cette démo ne constituent pas un contrôle d’accès serveur.

Vérification manuelle sur téléphone : importer une photo et une vidéo, essayer les
3 modes de destinataires, rechercher un élève, prévisualiser puis revenir, envoyer,
avancer/reculer la vidéo, changer de média, partager, enregistrer et refuser une
permission. Vérifier également le retour système et les grandes tailles de texte.

## Défraiement (E24) et liste d’attente (E25)

- STAFF → PROFIL → MON DÉFRAIEMENT : navigation mensuelle, période en cours
  (novembre 2026), validée (octobre 2026) et vide pour les autres mois ; détail
  extensible des séances et formulaire de signalement local.
- ADULTE ou PARENT → PLANNING → séance « COMPLET • LISTE D’ATTENTE » →
  s’inscrire sur liste d’attente. « TESTER » simule une proposition pendant 15 minutes.
  Le panneau « ÉTATS DE TEST », présent uniquement en développement, permet
  d’essayer une expiration en 5 secondes. La date limite reste conservée à la
  fermeture/réouverture de la liste depuis le même détail de séance.
- Le refus, le départ de la liste, l’expiration et la confirmation sont gérés
  localement. Le retour au planning ou un redémarrage réinitialise ces données.
  Pour un parent, la confirmation conduit au choix existant des participants.
- Aucun SMS, push, réservation ni signalement n’est envoyé à un serveur.
  L’API devra fournir le rang, la proposition, sa date limite, les participants
  concernés et valider atomiquement la confirmation. Le délai de 15 minutes
  provient de la maquette et reste à valider avec le club.
- Calcul : durée en minutes × 12 €/h. La maquette affiche 213 € pour 16,75 h ;
  le montant cohérent est 201 €. Les 15 lignes de novembre totalisent 16,75 h.
  Les dates sont illustratives ; les noms des jours sont calculés.

Fichiers : `CompensationScreen.js`, `WaitlistScreen.js`, `useWaitlist.js`,
`compensationDemo.js`, `sessionRules.mjs`.
