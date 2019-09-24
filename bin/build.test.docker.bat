docker build -t atomicswaps -f docker/test.Dockerfile .
docker run -it -v %cd%:/app atomicswaps
