#!/bin/bash

kubectl delete -f ./k8s/mysql_service/service.config.yml
kubectl delete -f ./k8s/mysql_service/deployment.config.yml
kubectl delete -f ./k8s/mysql_service/pvc.config.yml
kubectl delete -f ./k8s/mysql_service/pv.config.yml


kubectl apply -f ./k8s/mysql_service/pv.config.yml
kubectl apply -f ./k8s/mysql_service/pvc.config.yml
kubectl apply -f ./k8s/mysql_service/deployment.config.yml
kubectl apply -f ./k8s/mysql_service/service.config.yml
