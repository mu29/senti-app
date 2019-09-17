#!/bin/bash
# sh upload-covers.sh [커버 이미지 폴더] [Firebase 프로젝트 이름]

node tinify-cover.js $1

gsutil -m cp $1/* gs://$2.appspot.com/covers
