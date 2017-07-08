#!/bin/bash
if [ $# -eq 0 ]
    then
        echo "Usage: build.sh <war name>"
	exit 1
fi
./gradlew -Pprod clean bootRepackage
scp build/libs/$1 officina@10.139.232.201:war
ssh officina@10.139.232.201 sudo cp war/$1 /var/lib/tomcat8/webapps/ROOT.war
