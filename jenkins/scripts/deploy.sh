pid=$(lsof -ti:38091)
echo $pid
pm2 list
if [ -n "$pid" ]; then 
# sudo kill -9 $pid
# echo "kill ${pid} process" 
# npm start
pm2 restart portalfree
else
# npm start
pm2 start "npm run dev -- -H 192.168.10.112 -- -p 38091" --name portalfree
fi