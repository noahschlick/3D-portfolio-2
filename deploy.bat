@echo off
echo Building project...
npm run build

echo Copying static assets...
xcopy "static\js\*.js" "dist\js\" /Y 2>nul || echo No JS files to copy
xcopy "static\css\*.css" "dist\css\" /Y 2>nul || echo No CSS files to copy
xcopy "static\assets\*" "dist\assets\" /E /Y

echo Deploying to Vercel...
vercel --prod

echo Deployment complete!