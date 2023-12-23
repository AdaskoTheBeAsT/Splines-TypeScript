import { readFileSync, writeFileSync, renameSync, copyFileSync, unlinkSync } from 'fs';

try {
  const distDir = './dist/libs/splines';
  const srcDir = './../../../libs/splines';

  process.chdir(distDir);

  // Rename package.json to package.temp.json
  renameSync('package.json', 'package.temp.json');

  // Copy package.json from source to dist
  copyFileSync(`${srcDir}/package.json`, 'package.json');

  // Read the temp and new package.json files
  const tempJson = JSON.parse(readFileSync('package.temp.json').toString());
  const newJson = JSON.parse(readFileSync('package.json').toString());

  // Copy "exports", "module", "main" from temp to new package.json
  ['exports', 'module', 'main'].forEach(key => {
    if (tempJson[key]) {
      newJson[key] = tempJson[key];
    }
  });

  // Write the updated package.json
  writeFileSync('package.json', JSON.stringify(newJson, null, 2));

  // Remove the temporary package.temp.json file
  unlinkSync('package.temp.json');

} catch (e) {
  console.error(`Error occurred: ${e.message}`);
}
