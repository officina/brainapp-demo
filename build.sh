#!/bin/bash
if [ $# -eq 0 ]
    then
        echo "Usage: build.sh <version name> es. build.sh 1.0.0"
	exit 1
fi
./gradlew -Pprod clean bootRepackage
scp build/libs/gatorade-$1.war.original officina@10.139.232.201:war
ssh officina@10.139.232.201 sudo cp war/gatorade-$1.war.original /var/lib/tomcat8/webapps/ROOT.war
