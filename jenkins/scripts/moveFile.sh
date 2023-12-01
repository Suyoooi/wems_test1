SHELL_PATH=`pwd -P`
echo $SHELL_PATH

cp -r ./components /home/rnddev/wems/cicd/WEMS-Docker/front
cp -r ./constant /home/rnddev/wems/cicd/WEMS-Docker/front
cp -r ./hook /home/rnddev/wems/cicd/WEMS-Docker/front
cp -r ./pages /home/rnddev/wems/cicd/WEMS-Docker/front
cp -r ./public /home/rnddev/wems/cicd/WEMS-Docker/front
cp -r ./styles /home/rnddev/wems/cicd/WEMS-Docker/front
cp -r ./types /home/rnddev/wems/cicd/WEMS-Docker/front
cp -r ./utils /home/rnddev/wems/cicd/WEMS-Docker/front

cp *.js *.json *.ts /home/rnddev/wems/cicd/WEMS-Docker/front
