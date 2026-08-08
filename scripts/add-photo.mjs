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

    const newEntry = `  {
    id: 'photo-${nextPhotoNumber}',
    title: ${toTsString(title)},
    description: ${toTsString(description)},
    image_url: ${toTsString(imageUrl)},
    category_id: catId('${category}'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: ${nextDisplayOrder},
    created_at: new Date().toISOString(),
  },`;

    const updatedContent = content.replace(/\n\];/, `\n${newEntry}\n];`);

    if (updatedContent === content) {
      throw new Error('Impossible d’insérer la nouvelle photo. Le format du tableau n’a pas été trouvé.');
    }

    await fs.writeFile(targetFile, updatedContent, 'utf8');

    console.log(`Nouvelle photo ajoutée dans ${path.relative(process.cwd(), targetFile)}.`);
    console.log(`- id: photo-${nextPhotoNumber}`);
    console.log(`- catégorie: ${category}`);
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main();
