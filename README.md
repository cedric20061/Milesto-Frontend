# Front-End Milesto

Ce projet représente le front-end de l'application **Milesto**, une interface utilisateur conçue pour interagir avec le back-end. Le front-end est développé avec **React** et **TypeScript**, et utilise **Vite** pour un développement rapide.

---

## 🚀 Fonctionnalités
- Interface utilisateur responsive et moderne.
- Intégration avec l'API back-end.
- Gestion des états via **Context API**.
- Utilisation de **Tailwind CSS** pour le style.

---

## 🛠️ Technologies utilisées
- **React** avec TypeScript
- **Vite** (outil de développement)
- **Tailwind CSS** (pour le style)
- **Fetch API** (pour les requêtes HTTP)

---

## 📦 Installation et démarrage

### Prérequis
- **Node.js** v16+ installé
- **npm** ou **yarn** installé

### Étapes d'installation
1. Clone ce dépôt :
   ```bash
   git clone https://github.com/ton-utilisateur/milesto-frontend.git
   cd milesto-frontend
   ```

2. Installe les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure les variables d'environnement dans un fichier `.env` à la racine :
   ```env
   VITE_API_URL=https://milesto-backend.vercel.app
   ```

4. Démarre le serveur de développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Accède à l'application via :
   ```
   http://localhost:5173
   ```

---

## 🌐 Déploiement

### Hébergement sur Vercel
1. Connecte le projet à [Vercel](https://vercel.com).
2. Ajoute les variables d'environnement dans les **Settings** de Vercel :
   ```
   VITE_API_URL=https://milesto-backend.vercel.app
   ```
3. Déploie en cliquant sur **Deploy**.

---

## 📁 Structure du projet

```plaintext
src/
├── assets/         # Images, fichiers statiques
├── components/     # Composants réutilisables
├── context/        # Context API pour la gestion de l'état global
├── pages/          # Pages principales de l'application
├── hooks/          # Custom React Hooks
├── styles/         # Fichiers CSS/Tailwind
├── utils/          # Fonctions utilitaires
└── main.tsx        # Point d'entrée principal
```

---

## 📜 Scripts disponibles

- **`npm run dev`** : Lance le serveur de développement.
- **`npm run build`** : Génère les fichiers de production.
- **`npm run preview`** : Prévisualise les fichiers de production.

---

## 🐛 Débogage
Pour les erreurs ou bugs :
1. Vérifie les logs dans la console du navigateur.
2. Assure-toi que l'API backend est accessible depuis `VITE_API_URL`.
3. Consulte les logs sur Vercel si déployé.

---

## 👨‍💻 Contributeurs
- **Cédric GUIDI**
- **Webcrafters**

---

