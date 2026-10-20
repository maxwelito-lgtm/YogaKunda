import Stripe from "stripe";

const cle = process.env.STRIPE_SECRET_KEY;
if (!cle) {
  console.error("STRIPE_SECRET_KEY est absente de .env.local");
  process.exit(1);
}
if (!cle.startsWith("sk_test_") && !process.argv.includes("--live")) {
  console.error("Ce script ne tourne qu'en mode test (clé sk_test_). Arrêt.");
  process.exit(1);
}

const stripe = new Stripe(cle);

const CATALOGUE = [
  {
    produit: "Abonnement espace en ligne",
    description: "Cours en direct, replays, podcasts et Yoga Nidra.",
    prix: [
      { cle: "abonnement_mensuel", nom: "Mensuel", montant: 2000, intervalle: "month" },
      { cle: "abonnement_annuel", nom: "Annuel", montant: 20400, intervalle: "year" },
    ],
  },
  {
    produit: "Kundalini Yoga (cours collectif)",
    description: "Cours collectif en présentiel.",
    prix: [
      { cle: "kundalini_cours", nom: "Un cours", montant: 1500 },
      { cle: "kundalini_trim_1", nom: "Trimestre, 1 cours par semaine", montant: 16200 },
      { cle: "kundalini_trim_2", nom: "Trimestre, 2 cours par semaine", montant: 32400 },
    ],
  },
  {
    produit: "Atelier Tantra Yoga (lundi, 2 h)",
    description: "Atelier collectif en présentiel.",
    prix: [
      { cle: "tantra_cours", nom: "Un atelier", montant: 2000 },
      { cle: "tantra_trim", nom: "Trimestre", montant: 21600 },
    ],
  },
  {
    produit: "Atelier Kundalini (samedi, 3 h)",
    description: "Atelier collectif en présentiel.",
    prix: [
      { cle: "atelier_cours", nom: "Un atelier", montant: 3000 },
      { cle: "atelier_trim", nom: "Trimestre", montant: 32400 },
    ],
  },
  {
    produit: "Séance personnalisée / coaching",
    description: "Sur rendez-vous, fixé avec Chantal après le paiement.",
    prix: [{ cle: "perso", nom: "Séance", montant: 6000 }],
  },
  {
    produit: "Thérapie holistique",
    description: "Sur rendez-vous, fixé avec Chantal après le paiement.",
    prix: [{ cle: "therapie", nom: "Séance", montant: 6000 }],
  },
];

async function trouverProduit(nom) {
  const liste = await stripe.products.list({ active: true, limit: 100 });
  return liste.data.find((p) => p.name === nom);
}

for (const bloc of CATALOGUE) {
  let produit = await trouverProduit(bloc.produit);
  if (!produit) {
    produit = await stripe.products.create({
      name: bloc.produit,
      description: bloc.description,
    });
    console.log(`Produit créé : ${bloc.produit}`);
  } else {
    console.log(`Produit déjà présent : ${bloc.produit}`);
  }

  for (const p of bloc.prix) {
    const existants = await stripe.prices.list({
      lookup_keys: [p.cle],
      active: true,
      limit: 1,
    });
    if (existants.data.length > 0) {
      console.log(`   déjà présent : ${p.cle} (${existants.data[0].id})`);
      continue;
    }
    const prix = await stripe.prices.create({
      product: produit.id,
      currency: "eur",
      unit_amount: p.montant,
      nickname: p.nom,
      lookup_key: p.cle,
      ...(p.intervalle ? { recurring: { interval: p.intervalle } } : {}),
    });
    console.log(`   créé : ${p.cle} · ${p.montant / 100} € (${prix.id})`);
  }
}

console.log("\nTerminé. Vérifie la liste dans Stripe : Catalogue de produits.");