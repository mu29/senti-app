#!/bin/bash

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
BUILD_NUMBER=$(echo $PACKAGE_VERSION | awk -F . '{ printf "%d%02d%02d", $1, $2, $3 }')

sed -i '' 's/\(versionName \).*/\1"'"$PACKAGE_VERSION"'"/g' ./android/app/build.gradle
sed -i '' 's/\(versionCode \).*/\1'"$BUILD_NUMBER"'/g' ./android/app/build.gradle

cd android

./gradlew clean
./gradlew bundleRelease

open ./app/build/outputs/bundle/release
