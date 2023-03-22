#!/bin/bash

setRepository(){
    cd $dir
    version=$(node -p "require('./package.json')")
    if [ "$version" == "undefined" ]; then
        echo -e "\033[41;37m $dir can not find package.json \033[0m"
        cd ..
        continue
    fi
    yq -i '.he3.repository = "https://github.com/he3-app/tools.git"' package.json -o=json -I2
    cd ..
}

for dir in $(ls -d */)
do
    if [ "$dir" == "node_modules/" ] || [ "$dir" == "scripts/" ] || [ "$dir" == "@template/" ] || [ "$dir" == "types/" ]; then
        continue
    fi
    setRepository
done