xcopy .\LICENSE .\dist\libs\splines\ /Y
xcopy .\README.md .\dist\libs\splines\ /Y
node .\tools\scripts\cleanPackage.mjs
cd dist/libs/splines
REM npm publish --tag=latest --access public
