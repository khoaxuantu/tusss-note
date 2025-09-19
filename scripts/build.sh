#!/bin/sh

cd app

nue build -p

cd ..

rm -rf .dist/prod

mkdir -p .dist/prod

mv app/.dist/prod .dist
