# Architecture du site — Racines & Lotus

Ce document est la référence à garder ouverte dans VS Code pendant qu'on
construit le site page par page. Il décrit l'arborescence cible, ce que
fait chaque page, quels composants elle utilise, quelles données elle
touche, et dans quel ordre on construit.

---

## 1. Arborescence cible (une fois tout construit)

```
yoga-site/
├── app/
│   ├── layout.tsx                 # Layout racine (polices, <html>)
│   ├── globals.css
│   ├── page.tsx                   # / — Accueil                    [FAIT]
│   ├── yoga/
│   │   └── page.tsx                # /yoga                          [FAIT]
│   ├── mon-espace/
│   │   ├── page.tsx                 # /mon-espace (protégée)
│   │   ├── en-ligne/page.tsx        # cours en direct/replay
│   │   └── relaxations/page.tsx     # bibliothèque audio
│   ├── therapie-holistique/
│   │   └── page.tsx
│   ├── nous-rencontrer/
│   │   └── page.tsx                 # coquille vide pour l'instant
│   ├── mantras/
│   │   ├── page.tsx                 # liste boutique
│   │   └── [slug]/page.tsx          # fiche morceau
│   ├── admin/
│   │   ├── layout.tsx                # protection + nav admin
│   │   ├── page.tsx                  # liste articles
│   │   ├── nouveau/page.tsx
│   │   └── [id]/page.tsx             # édition
│   ├── connexion/page.tsx
│   ├── inscription/page.tsx
│   ├── panier/page.tsx
│   └── api/
│       ├── stripe/webhook/route.ts
│       ├── paypal/webhook/route.ts
│       ├── contact/route.ts          # formulaire thérapie → Resend
│       └── reservations/route.ts
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                                              [FAIT]
│   │   └── Footer.tsx                                              [FAIT]
│   ├── home/
│   │   ├── Hero.tsx                                                [FAIT]
│   │   ├── EventBanner.tsx                                         [FAIT]
│   │   ├── ActivityCards.tsx                                       [FAIT]
│   │   ├── LocationSection.tsx                                     [FAIT]
│   │   ├── MantrasBanner.tsx                                       [FAIT]
│   │   └── EngagementSection.tsx                                   [FAIT]
│   ├── yoga/                                                        [FAIT]
│   │   ├── YogaHero.tsx
│   │   ├── DisciplinePresentation.tsx   # Kundalini / Tantra
│   │   ├── TarifsCards.tsx              # cartes, jamais de tableau
│   │   ├── PlanningSection.tsx          # cartes par jour
│   │   ├── MaterielSection.tsx
│   │   ├── DerouleSeance.tsx
│   │   └── InscriptionSection.tsx
│   ├── espace/
│   │   └── SpaceCard.tsx                # les 2 grandes cartes
│   ├── mantras/
│   │   ├── MantraCard.tsx
│   │   ├── AudioPlayer.tsx              # lecteur custom
│   │   └── AlbumBundle.tsx
│   ├── therapie/
│   │   └── ContactForm.tsx
│   ├── admin/
│   │   ├── ArticleForm.tsx
│   │   ├── ArticleList.tsx
│   │   └── RichTextEditor.tsx
│   └── ui/                              # briques génériques réutilisables
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Modal.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # client navigateur
│   │   ├── server.ts                    # client serveur (Server Components)
│   │   └── admin.ts                     # client service_role (webhooks)
│   ├── stripe.ts
│   ├── paypal.ts
│   └── resend.ts
│
├── types/
│   └── database.ts                      # types générés depuis Supabase
│
├── site.config.ts                                                   [FAIT]
├── middleware.ts                        # protection routes /mon-espace, /admin
└── supabase/
    └── schema.sql                       # les 9 tables du prompt initial
```

**Convention Server / Client Components (App Router) :**
Par défaut chaque `page.tsx` est un *Server Component* — il peut appeler
Supabase directement côté serveur (`lib/supabase/server.ts`) sans exposer de
clé. On ajoute `"use client"` seulement quand il faut de l'interactivité
(formulaire, lecteur audio, menu burger — comme `Header.tsx` déjà fait).

---

## 2. Détail page par page

### `/` — Accueil — **fait**
- Composants : `Header`, `Hero`, `EventBanner`, `ActivityCards`,
  `LocationSection`, `MantrasBanner`, `EngagementSection`, `Footer`.
- Données : aucune pour l'instant (tout est statique) ; plus tard,
  `EventBanner` pourra lire une table `evenements` si besoin.
- Protection : aucune, page publique.

### `/yoga` — **fait**
- Composants : `YogaHero`, `DisciplinePresentation` (Kundalini + Tantra),
  `TarifsCards`, `PlanningSection`, `MaterielSection`, `DerouleSeance`,
  `InscriptionSection`.
- Données : tarifs et planning sont des constantes TypeScript en dur dans
  les composants (pas de table Supabase) — ça change rarement et évite une
  requête pour du contenu quasi-statique. La table `courses` sert plutôt à
  la réservation de créneaux (`/mon-espace`).
- Point d'attention responsive : **jamais de tableau** — tarifs et
  planning sont directement construits en grille de cartes
  (`grid-cols-1` mobile → `md:grid-cols-2/3`), donc pas de scroll
  horizontal à gérer.
- À valider avec la cliente : les vrais textes de présentation Kundalini
  /Tantra (actuellement reformulés à partir des captures de référence),
  et le nom exact du lieu.

### `/mon-espace` — protégée
- Middleware vérifie la session Supabase ; redirige vers `/connexion` si
  absent, et vers une page « abonnement requis » si le statut
  `subscriptions.statut` n'est pas `essai` ou `actif`.
- Composants : deux `SpaceCard` (« Yoga en ligne » / « Relaxations audio »).
- Sous-pages `en-ligne` et `relaxations` : contenu réellement protégé
  (vidéos, fichiers Supabase Storage avec URL signée).

### `/therapie-holistique`
- Composants : bloc modalités (statique), `ContactForm` (Client Component,
  soumet vers `app/api/contact/route.ts` qui appelle Resend).
- Pas de paiement ici — juste prise de contact par email, conforme au
  prompt initial.

### `/nous-rencontrer`
- Coquille : `Header` + `Footer` + un `<main>` vide avec un message
  « Page en construction ». Ne bloque pas le reste.

### `/mantras`
- Liste : grille de `MantraCard`. Chaque carte affiche pochette, extrait,
  prix, bouton achat.
- Fiche `[slug]` : `AudioPlayer` (preview avant achat, lecture complète
  après), `AlbumBundle` si le morceau fait partie d'un album.
- Après achat (Stripe/PayPal validé côté webhook) : génération d'une URL
  signée Supabase Storage, envoyée par email et accessible depuis
  `/mon-espace` ou `/mantras/mes-achats`.

### `/admin` — protégée (compte propriétaire uniquement)
- `layout.tsx` du dossier vérifie le rôle admin (ex. colonne `role` sur
  `users` ou table séparée `admins`).
- CRUD articles via `ArticleForm` + `RichTextEditor` (gras/italique/liens
  seulement, pas d'éditeur complexe).
- Pensé mobile en priorité : formulaire pleine largeur, boutons ≥44px.

---

## 3. Organisation des données (rappel du schéma, mappé aux pages)

| Table            | Alimente quelle(s) page(s)                     |
|-------------------|------------------------------------------------|
| `subscriptions`    | `/mon-espace` (contrôle d'accès), `/admin`     |
| `courses`          | `/yoga` (planning), réservation                |
| `bookings`         | réservation de créneaux présentiel             |
| `articles`         | `/admin`, futur blog/actu sur l'accueil         |
| `mantras`          | `/mantras`                                      |
| `albums`           | `/mantras`                                      |
| `orders`           | `/panier`, webhooks Stripe/PayPal, `/admin`     |

---

## 4. Ordre de construction proposé (VS Code, en local)

1. ✅ Accueil (fait) — valider visuellement, ajuster couleurs/textes.
2. ✅ `/yoga` (fait) — page 100% statique, aucune dépendance Supabase.
3. `/therapie-holistique` — statique + un formulaire (prembattre la
   logique Resend avant de la complexifier avec l'auth).
4. `/nous-rencontrer` — coquille, 5 minutes.
5. Authentification Supabase + `middleware.ts` — nécessaire avant
   `/mon-espace` et `/admin`.
6. `/mon-espace` (protégée, sans paiement pour l'instant, juste l'accès).
7. `/mantras` — la partie la plus riche en interactivité (lecteur audio).
8. Paiement Stripe + PayPal, essai gratuit, webhooks, `orders`.
9. Réservation de créneaux avec gestion de capacité.
10. `/admin` — CRUD articles.
11. Emails transactionnels (Resend) sur tous les points de contact.
12. Tests parcours complet + responsive mobile réel.

Cet ordre suit celui du prompt initial, en insérant `/yoga` et
`/therapie-holistique` tôt car elles sont statiques et rapides à valider
avant d'attaquer l'auth et le paiement, qui sont les parties les plus
lourdes.

---

## 5. Convention de nommage

- Fichiers composants : `PascalCase.tsx`.
- Un composant = un fichier, sauf sous-composants purement internes (ex.
  les icônes dans `Header.tsx` et `Footer.tsx`, gardées locales car non
  réutilisées ailleurs).
- Dossiers `components/<page>/` pour les composants spécifiques à une
  page, `components/ui/` pour ce qui est réutilisé partout (bouton, carte
  générique, modal).
- Couleurs/typographie : jamais de valeur hex en dur dans un composant —
  toujours via les classes Tailwind définies dans `tailwind.config.ts`.
