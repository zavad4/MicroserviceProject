# Lab 1
Розгорнемо сервіси для двох серверів, які повертають нам стрічку "hello from service". Для цього нами було створено [dockerfile](https://github.com/zavad4/MicroserviceProject/blob/main/lab1/service_1/Dockerfile). У нас він складається з одного етапа, оскільки сервер не має залежностей. У іншому випадку (наприклад, якщо проект має залежність sql), dockerfile буде складатись з різних етапів:
```
FROM node:14 AS build

WORKDIR /usr/src/
COPY . .
COPY ./project/package*.json ./project/
WORKDIR /usr/src/project
RUN npm install

FROM node:14 AS final
WORKDIR /usr/src/
COPY --from=build /usr/src/project .
EXPOSE 8080
CMD ["npm", "run", "start"]
```
Таким чином, ми зменшуємо вагу образу, використовуючи данні попередніх етапів.

Для створення самого image виконуємо таку команду  

```
$ sudo docker build -t la7rodectus/service_1:latest ./service_1/
```
і в результаті отримуємо ось такі образи. 
```
REPOSITORY                 TAG       IMAGE ID       CREATED          SIZE
la7rodectus/service_2      latest    7b49be2c36ed   30 minutes ago   944MB
la7rodectus/service_1      latest    97bd720a93a6   42 minutes ago   944MB
```
Надсилаємо наші образи на docker.io за допомогою команди 
```
$ sudo docker push la7rodectus/service_1:latest
```

Тепер переходимо до безпосередньої роботи з нашим кластером Kubernetes.
Створюємо файл [service-1.deployment.yml](https://github.com/zavad4/MicroserviceProject/blob/main/lab1/service-1.deployment.yml) і для отримання  deployment виконуємо команду 
```
$ kubectl apply -f service-1.deployment.yml
```

Виконуємо аналогічні дії для другого сервіса.
Після цього запускаємо команду і бачимо, що у нас створилося 2 поди: 
```
$ kubectl get po

NAME                                READY   STATUS    RESTARTS   AGE
service-1-deploy-847d8fbb84-zpjpg   1/1     Running   0          3m23s
service-2-deploy-7cfcd6594c-hdcwh   1/1     Running   0          7s
```

Виконуємо команду і перевіряємо наші deployment:
```
$ kubectl get deployments

NAME               READY   UP-TO-DATE   AVAILABLE   AGE
service-1-deploy   1/1     1            1           44m
service-2-deploy   1/1     1            1           40m
```

Тепер потрібно створити самі сервіси. Для цього формуємо файл [config.service-1.yml](https://github.com/zavad4/MicroserviceProject/blob/main/lab1/config.service-1.yml)  і виконуємо команду 
```
$ kubectl apply -f config.service-1.yml
```
Аналогічно для service-2.

Перевіряємо за допомогою команди 
```
$ kubectl get svc

NAME                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes          ClusterIP   10.96.0.1        <none>        443/TCP    21h
service-1-service   ClusterIP   10.106.250.130   <none>        8080/TCP   39m
service-2-service   ClusterIP   10.99.202.178    <none>        8080/TCP   38m
```

Тепер залишилось налаштувати доступ до додатку за допомогою Ingress. Для цього створюємо файл [config.ingress.yml](https://github.com/zavad4/MicroserviceProject/blob/main/lab1/config.ingress.yml)
і виконуємо команду 
```
$ kubectl apply -f config.ingress.yml
```

Після цього ми можемо звернутись до нашого клієнта такими командами:
```
$ curl $(minikube ip)/api/service-1
$ curl $(minikube ip)/api/service-2
```
і бачимо, що сервери надсилають нам відповідь:
```
Hello from service 1
Hello from service 2
```
