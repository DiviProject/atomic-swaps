#!/bin/bash
docker build -t atomicswaps -f docker/test.Dockerfile .
docker run -it -v $PWD:/app atomicswaps