app="gt"
service="postgresql"
plan="v9.6-dev"
servicename="db1"
gitrepo="https://github.com/ghafran/cf-sample-app-nodejs.git"
gitreponame="cf-sample-app-nodejs"

# login to cf
cf login -a $CFENDPOINT -u $CFUSERNAME -p $CFPASSWORD -o $CFORG -s $CFSPACE

# delete app if exists
cf delete $app -f -r

# delete service if exists
cf delete-service $servicename -f

# pull latest from repo
cd ~/
rm -rf $gitreponame
git clone $gitrepo
cd $gitreponame

# create service
cf create-service $service $plan $servicename

# deploy app
cf push $app --no-start

# bind service
cf bind-service $app $servicename
cf start $app

