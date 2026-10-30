# Le Camp des Loups — application mobile native

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
