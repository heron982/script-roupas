import fs from "fs";
import path, { basename } from "path";

// Configurações
const SOURCE_DIR = "/home/heron982/Área de trabalho/teste"; // <- pasta de origem
const DEST_DIR = "/home/heron982/Área de trabalho/output_test"; // <- pasta de destino

// Lista de categorias
// Lista de categorias (todas em minúsculo)
const CATEGORIES = [
  "accs",
  "berd",
  "decl",
  "ears",
  "eyes",
  "facepaint",
  "feet",
  "hair",
  "hand",
  "head",
  "jnin",
  "lowr",
  "rwrist",
  "task",
  "tattoo",
  "teef",
  "uppr",
  "tat",
];

const models = [".ydd", ".ytd", ".ymt", ".yft"];

// Cria pasta destino se não existir
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

// Lista arquivos na origem
const files = fs.readdirSync(SOURCE_DIR);

for (const filename of files) {
  const filepath = path.join(SOURCE_DIR, filename);

  if (!fs.lstatSync(filepath).isFile()) continue;

  // Nome-base (se houver ^)
  let baseName = "";

  const extension = models.find((ext) => filename.includes(ext));

  //retiramos a extensão.
  baseName = filename.split(extension)[0];

  console.log("base name", baseName);

  const category = CATEGORIES.find((cat) => baseName.includes(cat));

  if (baseName.includes("^")) {
    baseName = baseName.split("^")[0];
  } else if (category) {
    baseName = baseName.split(category)[0];
  }

  // Gênero
  let gender = null;
  if (baseName.includes("mp_m")) {
    gender = "masculino";
  } else if (baseName.includes("mp_f")) {
    gender = "feminino";
  }

  // Define pasta final
  let folderPath = "";

  console.log("baseName folderPath", baseName);

  if (gender) {
    folderPath = path.join(DEST_DIR, baseName, gender);
  } else {
    folderPath = path.join(DEST_DIR, baseName);
  }

  //seperar por numero dentro da pasta do arquivo e mover o respectivo ytd e ydd para a pasta

  const roupaNumero = filename.match(/_(\d+)/g);

  console.log("roupaNumero", roupaNumero ? roupaNumero[1] : null);

  folderPath = category
    ? path.join(folderPath, category)
    : path.join(folderPath);

  folderPath =
    roupaNumero && roupaNumero[1]
      ? path.join(folderPath, roupaNumero[1])
      : path.join(folderPath);

  // Cria pasta final se não existir
  fs.mkdirSync(folderPath, { recursive: true });

  // Move arquivo
  fs.copyFileSync(filepath, path.join(folderPath, filename));

  console.log(`Arquivo ${filename} movido para ${folderPath}`);
}

console.log("✅ Arquivos organizados por nome, gênero e categorias!");
