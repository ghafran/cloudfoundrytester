app="gt"

# login to cf
cf login -a $CFENDPOINT -u $CFUSERNAME -p $CFPASSWORD -o $CFORG -s $CFSPACE

# get app info
cf app $app