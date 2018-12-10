# Cloud Foundry Tester #

## setup

Creat user for scripts to run on cf as administrator for your instance, this is just an example script: change as needed.
```
cf create-org "gtestorg"
cf create-space -o "gtestorg" "gtestspace"
cf create-user "gtestuser" "M0n1tor@ng"
cf set-org-role "gtestuser" "gtestorg" OrgManager
cf set-space-role "gtestuser" "gtestorg" "gtestspace" SpaceManager
```

Create environment variables on machine for cf login. Needs to be a a user with admin permissions.
```
export CFENDPOINT="https://<point to your endpoint>"
export CFUSERNAME=""
export CFPASSWORD=""
export CFORG="gtestorg"
export CFSPACE="gtestspace"
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_DEFAULT_REGION=""
export AWS_S3_BUCKET=""
```



