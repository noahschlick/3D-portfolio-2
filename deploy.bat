@echo off
echo Building project...
npm run build

echo Copying static assets...
xcopy "static\js\*.js" "dist\js\" /Y > nul
xcopy "static\css\*.css" "dist\css\" /Y > nul  
xcopy "static\assets\*" "dist\assets\" /E /Y > nul

echo Deploying to Vercel...
vercel --prod

echo Deployment complete!