# Racines & Lotus — Page d'accueil (Phase 1)

## Ce qui est fait
- Setup Next.js 14 (App Router) + Tailwind CSS, mobile-first.
- Design system : couleurs, typographie (Fraunces + Inter) dans `tailwind.config.ts`.
- Page d'accueil complète : Header (avec menu burger mobile), Hero, bandeau
  Événements, cartes Activités, section Lieu, bandeau Mantras, section
  Engagement, Footer newsletter.
- Toutes les images sont des placeholders (picsum.photos) — à remplacer par
  vos vraies photos.
- Aucune donnée personnelle du site de référence n'a été reprise (nom,
  logo, téléphone, email sont des valeurs provisoires dans `site.config.ts`).

## Personnaliser
Ouvrez `site.config.ts` : nom du site, ville, email, téléphone, réseaux
sociaux et liens de navigation sont centralisés là.

## Installer et lancer en local
Prérequis : **Node.js 20.9 ou plus récent** (requis par Next.js 16). Vérifiez
avec `node -v` dans un terminal.

Si vous aviez déjà lancé `npm install` avec une version antérieure du
projet, supprimez d'abord `node_modules` et `package-lock.json` avant de
relancer, pour repartir sur des versions propres :
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```
Sinon, simplement :
```bash
npm install
npm run dev
```
Puis ouvrez http://localhost:3000

## Déployer sur Vercel
1. Poussez ce dossier sur un dépôt GitHub.
2. Connectez le dépôt sur vercel.com (plan gratuit).
3. Vercel détecte Next.js automatiquement, aucune config nécessaire.

## Prochaines étapes (suite du plan de développement)
- Pages statiques : Yoga, Thérapie Holistique, Nous rencontrer.
- Schéma Supabase + authentification.
- Paiement Stripe/PayPal, réservations, espace membre, boutique Mantras.
- Panel admin, emails transactionnels (Resend).
