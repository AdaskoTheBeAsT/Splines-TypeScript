xcopy .\LICENSE .\dist\libs\splines\ /Y
xcopy .\README.md .\dist\libs\splines\ /Y
cd dist/libs/splines
npm publish --tag=latest --access public
