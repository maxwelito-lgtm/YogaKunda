// Allège les grosses photos de public/images : copie en WebP (2000 px max, qualité 82)
// et met à jour les références dans le code. Les originaux sont mis de côté, jamais supprimés.
//
//   node scripts/optimiser-images.mjs --essai    -> affiche ce qui serait fait, ne touche à rien
//   node scripts/optimiser-images.mjs            -> fait le travail
//
// Pour revenir en arrière : remettre les originaux depuis le dossier de sauvegarde
// et faire « git checkout . » dans le projet.
import fs from "node:fs";
import path from "node:path";

const essai = process.argv.includes("--essai");
const racine = process.cwd();
const dossier = path.join(racine, "public", "images");
const sauvegarde = path.join(racine, "..", "yoga-images-originales");
const SEUIL = 500 * 1024; // on ne touche qu'aux fichiers de plus de 500 Ko
const LARGEUR_MAX = 2000;
const QUALITE = 82;
const GARDER = new Set(["yoga-nature.png", "logo-shantalam.png"]); // image de partage et logo : inchangés

const ko = (n) => `${Math.round(n / 1024)} Ko`;

const fichiers = fs
  .readdirSync(dossier)
  .filter((f) => /\.(png|jpe?g)$/i.test(f) && !GARDER.has(f))
  .filter((f) => fs.statSync(path.join(dossier, f)).size > SEUIL);

if (!fichiers.length) {
  console.log("Aucune image à alléger.");
  process.exit(0);
}

let sharp;
if (!essai) {
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("Le module « sharp » est introuvable. Lancez d'abord : npm install");
    process.exit(1);
  }
  fs.mkdirSync(sauvegarde, { recursive: true });
}

// Fichiers de code où chercher les références
const dossiersCode = ["app", "components", "data", "lib"].map((d) => path.join(racine, d));
function listerCode(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return listerCode(p);
    return /\.(tsx?|css|json)$/.test(e.name) ? [p] : [];
  });
}
const code = dossiersCode.flatMap(listerCode).concat(path.join(racine, "site.config.ts"));

let avant = 0;
let apres = 0;
const renommes = [];

for (const f of fichiers) {
  const source = path.join(dossier, f);
  const nom = f.replace(/\.(png|jpe?g)$/i, "");
  const cible = path.join(dossier, `${nom}.webp`);
  const tailleAvant = fs.statSync(source).size;
  avant += tailleAvant;

  if (essai) {
    console.log(`À alléger : ${f} (${ko(tailleAvant)})`);
    continue;
  }

  await sharp(source)
    .rotate()
    .resize({ width: LARGEUR_MAX, withoutEnlargement: true })
    .webp({ quality: QUALITE })
    .toFile(cible);

  const tailleApres = fs.statSync(cible).size;
  apres += tailleApres;
  fs.copyFileSync(source, path.join(sauvegarde, f));
  fs.unlinkSync(source);
  renommes.push([f, `${nom}.webp`]);
  console.log(`${f} : ${ko(tailleAvant)} -> ${nom}.webp : ${ko(tailleApres)}`);
}

if (!essai) {
  let modifies = 0;
  for (const fichier of code) {
    let texte = fs.readFileSync(fichier, "utf8");
    const origine = texte;
    for (const [ancien, nouveau] of renommes) {
      texte = texte.split(`/images/${ancien}`).join(`/images/${nouveau}`);
    }
    if (texte !== origine) {
      fs.writeFileSync(fichier, texte);
      modifies++;
      console.log(`Références mises à jour : ${path.relative(racine, fichier)}`);
    }
  }
  console.log(`\nTotal : ${ko(avant)} -> ${ko(apres)}. ${modifies} fichier(s) de code modifié(s).`);
  console.log(`Originaux conservés dans : ${path.resolve(sauvegarde)}`);
} else {
  console.log(`\n${fichiers.length} image(s), ${ko(avant)} au total. Rien n'a été modifié (mode essai).`);
}
