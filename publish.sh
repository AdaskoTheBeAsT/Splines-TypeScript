/bin/cp -rf ./LICENSE ./dist/libs/splines/
/bin/cp -rf ./README.md ./dist/libs/splines/
cd dist/libs/splines
npm publish --tag=latest --access public
