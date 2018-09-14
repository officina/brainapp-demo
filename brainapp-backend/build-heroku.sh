#!/bin/bash
if [ $# -eq 0 ]
    then
        echo "Usage: build-heroku.sh <version name> es. build-heroku.sh 1.0.0"
	exit 1
fi
./gradlew -Pprod bootRepackage -x test
heroku deploy:jar --jar build/libs/*$1.war --app brainappbackend
heroku logs --tail --app brainappbackend
