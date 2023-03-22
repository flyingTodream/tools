#!/bin/bash

publishTool(){
    if [[ $dir == batch* ]]; then
        continue
    fi

    cd $dir
    version=$(node -p "require('./package.json').he3.version")
    if [ "$version" == "undefined" ]; then
        echo -e "\033[41;37m $dir can not find package.json or version \033[0m"
        cd ..
        continue
    fi
    id=$(node -p "require('./package.json').he3.id")
    currentVersion=$(curl -s https://admin.test.he3.app/api/v1/hub/tool/$id/currentVersion | jq -r '.currentVersion')
    echo "check " $dir$id" local version: "$version", remote version: "$currentVersion
    if [ "$version" != "$currentVersion" ]; then
        echo -e "\033[42;37m prepare publish $id \033[0m"
        npm install
        npm run publish -- --token=$HE3_TOKEN
    fi
    cd ..
}

publishTools(){
    cd $dir
    version=$(node -p "require('./package.json')")
    if [ "$version" == "undefined" ]; then
        echo -e "\033[41;37m $dir can not find package.json \033[0m"
        cd ..
        continue
    fi
    echo -e "\033[42;37m prepare publish $dir \033[0m"
    npm install
    npm run publish -- --token=$HE3_TOKEN
    cd ..
}

cd node_modules/he3-common && npm install && cd -
for dir in $(ls -d */)
do
    if [ "$dir" == "node_modules/" ] || [ "$dir" == "scripts/" ] || [ "$dir" == "@template/" ] || [ "$dir" == "types/" ]; then
        continue
    fi

    if [[ $dir == batch* ]]; then
        publishTools
    else
        publishTool
    fi
done


