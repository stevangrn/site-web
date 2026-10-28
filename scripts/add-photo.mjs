#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const options = {
    title: null,
    description: null,
    imageUrl: null,
    category: null,
    file: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--title') {
      options.title = argv[i + 1] ?? null;
      i += 1;
    } else if (arg === '--description') {
      options.description = argv[i + 1] ?? null;
      i += 1;
    } else if (arg === '--link' || arg === '--image-url') {
      options.imageUrl = argv[i + 1] ?? null;
      i += 1;
    } else if (arg === '--category') {
      options.category = argv[i + 1] ?? null;
      i += 1;
    } else if (arg === '--file') {
      options.file = argv[i + 1] ?? null;
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: npm run add:photo -- [options]');
      console.log('Options:');
      console.log('  --title "Titre"');
      console.log('  --description "Description"');
      console.log('  --link "https://..."');
      console.log('  --category portraits|sports|evenements|nature');
      console.log('  --file path/to/content.ts');
      process.exit(0);
    }
  }

  return options;
}

function toTsString(value) {
  return JSON.stringify(value);
}

// Taille de l'image en pixels, demandée à Cloudinary (fl_getinfo). Elle sert
// à réserver la place de la photo dans la page avant son chargement. Sans
// connexion, ou pour une image qui n'est pas sur Cloudinary, la photo est
// ajoutée sans taille (le site fonctionne quand même).
async function fetchImageSize(url) {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return null;
  try {
    const response = await fetch(url.replace('/upload/', '/upload/fl_getinfo/'));
    if (!response.ok) return null;
    const info = await response.json();
    const { width, height } = info.input ?? {};
    return Number.isInteger(width) && Number.isInteger(height) ? { width, height } : null;
  } catch {
    return null;
  }
}

async function main() {
  const options = parseArgs(process.argv);
  const rl = readline.createInterface({ input, output });

  const ask = async (message, fallback = null) => {
    const answer = await rl.question(`${message}${fallback ? ` [${fallback}]` : ''}: `);
    const trimmed = answer.trim();
    return trimmed || fallback || '';
  };

  try {
    const targetFile = options.file
      ? path.resolve(process.cwd(), options.file)
      : path.resolve(__dirname, '..', 'src', 'data', 'content.ts');

    const content = await fs.readFile(targetFile, 'utf8');
    const categories = [...content.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);

    if (categories.length === 0) {
      throw new Error('Aucune catégorie n’a été trouvée dans le fichier de contenu.');
    }

    const title = options.title || (await ask('Titre'));
    const description = options.description || (await ask('Description'));
    const imageUrl = options.imageUrl || (await ask('Lien de l’image'));
    const category = options.category || (await ask(`Catégorie (${categories.join(', ')})`));

    if (!categories.includes(category)) {
      throw new Error(`Catégorie inconnue: ${category}. Choisis parmi: ${categories.join(', ')}`);
    }

    const photoMatches = [...content.matchAll(/id:\s*'photo-(\d+)'/g)].map((match) => Number(match[1]));
    const orderMatches = [...content.matchAll(/display_order:\s*(\d+)/g)].map((match) => Number(match[1]));
    const nextPhotoNumber = (photoMatches.length > 0 ? Math.max(...photoMatches) : 0) + 1;
    const nextDisplayOrder = (orderMatches.length > 0 ? Math.max(...orderMatches) : 0) + 1;

    // Fins de ligne du fichier (Windows "\r\n" ou Unix "\n"), pour ne pas
    // mélanger les deux en ajoutant la photo.
    const eol = content.includes('\r\n') ? '\r\n' : '\n';

    const size = await fetchImageSize(imageUrl);

    const newEntry = [
      '  {',
      `    id: 'photo-${nextPhotoNumber}',`,
      `    title: ${toTsString(title)},`,
      `    description: ${toTsString(description)},`,
      `    image_url: ${toTsString(imageUrl)},`,
      ...(size ? [`    width: ${size.width},`, `    height: ${size.height},`] : []),
      `    category_id: catId('${category}'),`,
      "    featured: false, //en vedette sur la page d'acceuil",
      '    featured_home: false, // true = cette photo apparaît dans les travaux en vedette',
      '    hero: false, // true = cette photo sera affichée en héros',
      `    display_order: ${nextDisplayOrder},`,
      '    created_at: new Date().toISOString(),',
      '  },',
    ].join(eol);

    // La photo doit aller à la fin de la liste "photos" : on cherche donc la
    // fin de liste ("];") qui suit "export const photos". L'ancienne version
    // prenait la première fin de liste du fichier, qui est celle des
    // catégories, et y ajoutait la photo par erreur.
    const photosStart = content.indexOf('export const photos');
    if (photosStart === -1) {
      throw new Error('Impossible de trouver la liste "photos" dans le fichier de contenu.');
    }
    const closingMatch = /\r?\n\];/.exec(content.slice(photosStart));
    if (!closingMatch) {
      throw new Error('Impossible d’insérer la nouvelle photo. La fin de la liste "photos" n’a pas été trouvée.');
    }
    const insertAt = photosStart + closingMatch.index;
    const updatedContent = `${content.slice(0, insertAt)}${eol}${newEntry}${content.slice(insertAt)}`;

    await fs.writeFile(targetFile, updatedContent, 'utf8');

    console.log(`Nouvelle photo ajoutée dans ${path.relative(process.cwd(), targetFile)}.`);
    console.log(`- id: photo-${nextPhotoNumber}`);
    console.log(`- catégorie: ${category}`);
    console.log(size ? `- taille: ${size.width} x ${size.height} px` : '- taille: inconnue (image hors Cloudinary ou pas de connexion)');
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main();
