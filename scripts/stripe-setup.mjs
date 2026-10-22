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
      { cle: "kundalini_trim_1", nom: "Trimestre, 1 cours par semaine", montant: 11000 },
      { cle: "kundalini_trim_2", nom: "Trimestre, 2 cours par semaine", montant: 16500 },
      { cle: "kundalini_annee_1", nom: "Année scolaire, 1 cours par semaine", montant: 30500 },
      { cle: "kundalini_annee_2", nom: "Année scolaire, 2 cours par semaine", montant: 45000 },
    ],
  },
  {
    produit: "Atelier Tantra Yoga (2 h)",
    description: "Atelier collectif en présentiel.",
    prix: [
      { cle: "tantra_cours", nom: "Un atelier", montant: 2000 },
    ],
  },
  {
    produit: "Atelier Kundalini (2 h)",
    description: "Atelier collectif en présentiel.",
    prix: [
      { cle: "atelier_cours", nom: "Un atelier", montant: 3000 },
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
      const ancien = existants.data[0];
      if (ancien.unit_amount === p.montant) {
        console.log(`   déjà présent : ${p.cle} (${ancien.id})`);
        continue;
      }
      // Un prix Stripe ne peut pas être modifié : on en crée un nouveau (il reprend le nom
      // interne), puis on archive l'ancien. Les achats déjà faits ne changent pas.
      const nouveau = await stripe.prices.create({
        product: produit.id,
        currency: "eur",
        unit_amount: p.montant,
        nickname: p.nom,
        lookup_key: p.cle,
        transfer_lookup_key: true,
        ...(p.intervalle ? { recurring: { interval: p.intervalle } } : {}),
      });
      await stripe.prices.update(ancien.id, { active: false });
      console.log(
        `   MIS À JOUR : ${p.cle} · ${ancien.unit_amount / 100} € → ${p.montant / 100} € (${nouveau.id}, ancien ${ancien.id} archivé)`
      );
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