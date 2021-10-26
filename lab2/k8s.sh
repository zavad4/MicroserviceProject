#!/bin/bash

kubectl delete -f ./k8s/api_service/istio.config.yml
kubectl delete -f ./k8s/dbc_service/istio.config.yml
kubectl delete -f ./k8s/root_service/istio.config.yml

kubectl delete -f ./k8s/api_service/deployment.config.yml
kubectl delete -f ./k8s/api_service/service.config.yml
kubectl delete -f ./k8s/api_service/circuitBreaker.config.yml

kubectl delete -f ./k8s/dbc_service/deployment.config.yml
kubectl delete -f ./k8s/dbc_service/service.config.yml

kubectl delete -f ./k8s/root_service/deployment.config.yml
kubectl delete -f ./k8s/root_service/service.config.yml

kubectl delete -f ./k8s/config.ingress.yml

############################################################

kubectl apply -f ./k8s/api_service/deployment.config.yml
kubectl apply -f ./k8s/api_service/service.config.yml
kubectl apply -f ./k8s/api_service/circuitBreaker.config.yml

kubectl apply -f ./k8s/dbc_service/deployment.config.yml
kubectl apply -f ./k8s/dbc_service/service.config.yml

kubectl apply -f ./k8s/root_service/deployment.config.yml
kubectl apply -f ./k8s/root_service/service.config.yml

kubectl apply -f ./k8s/config.ingress.yml

kubectl apply -f ./k8s/api_service/istio.config.yml
kubectl apply -f ./k8s/dbc_service/istio.config.yml
# kubectl apply -f ./k8s/root_service/istio.config.yml

