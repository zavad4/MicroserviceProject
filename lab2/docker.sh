#!/bin/bash

sudo docker rmi la7rodectus/api:latest
sudo docker rmi la7rodectus/dbc:latest
sudo docker rmi la7rodectus/root-service:latest

docker build -t la7rodectus/api:latest -f services/api_service/Dockerfile . --no-cache
docker build -t la7rodectus/dbc:latest -f services/dbc_service/Dockerfile . --no-cache
docker build -t la7rodectus/root-service:latest -f services/root_service/Dockerfile . --no-cache

sudo docker push la7rodectus/api:latest
sudo docker push la7rodectus/dbc:latest
sudo docker push la7rodectus/root-service:latest
