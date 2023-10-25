#! /bin/bash
# Bash script to upload production repo to evennode

BCyan='\033[1;36m'
EndColor='\033[0m'

# compile 
echo -e "\n${BCyan}Compiling...${EndColor}\n"
npm run build
git add dist -f

# create new database
echo -e "\n${BCyan}Creating database...${EndColor}\n"
npm run inst 5 5
git add database -f

# clear unnecessary files
git rm --cached -r src 
git rm --cached -r public

# push
git commit -m "[[update evennode]]"
echo -e "\n${BCyan}Uploading to evennode...${EndColor}\n" 
git push -f evennode main

# restore
git reset --soft HEAD~1
git restore --staged dist database src public 

echo -e "\n${BCyan}Success !!${EndColor}\n"