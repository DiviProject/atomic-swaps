#!/bin/bash
protoc $PWD/src/proto/*.proto --proto_path=$PWD/src/proto --go_out=plugins=grpc:$PWD/src/api --grpc-gateway_out=logtostderr=true:$PWD/src/api --swagger_out=logtostderr=true:$PWD/src/api -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis -I/usr/local/include
