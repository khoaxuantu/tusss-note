#!/bin/sh

cd app

rm -rf .dist/dev

nue build

nue serve
