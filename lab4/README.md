# Lab 4
Додамо систему управління конфігураціями та перенесемо туди конфігурації з нашого додатку. Будемо використовувати систему Hashicorp Vault. Спочатку запускаємо відповідний docker-контейнер:
```
$ docker run --name vault -p 8200:8200 vault:1.7.3
```
У логах знаходимо токен та вводимо його за http://localhost:8200, де у нас розміщений vault, щоб зайти у систему. 

Після цього створюємо Policy для секретного доступу (у нас - "secret/data/mysql/appservice"). Потім потрапляємо всередину контейнера за допомогою 
```$ docker exec -it vault /bin/sh```
Вводимо змінні оточення, щоб потім використати у додатку: 
```
export VAULT_ADDR=http://localhost:8200
export VAULT_TOKEN=<ROOT TOKEN>
```
Реалізуємо retry/timeout, для цього будемо використовувати Istio. 
Нам знадобиться VirtualService - це додатковий проксі,який стоїть перед сервісом на який робиться запит. Саме там ми визначаємо конфігурацію, яка буде перенаправляти трафік з "нездорового" Pod на здоровий. Створюємо відпоідні файли, в яких задаємо налаштування retry/timeout (адреса перенаправлення, кількість спроб та виділених на це секунд, код помилок, які розглядаємо та ін):
* для  some-api-service [istio.config.yaml](https://github.com/zavad4/MicroserviceProject/blob/main/lab2/k8s/api_service/istio.config.yml)
* для  dbc-service [istio.config.yaml](https://github.com/zavad4/MicroserviceProject/blob/main/lab2/k8s/dbc_service/istio.config.yml)
* для  root-service [istio.config.yaml](https://github.com/zavad4/MicroserviceProject/blob/main/lab2/k8s/root_service/istio.config.yml)


Отже, якщо протягом 10 секунд (interval) відбудеться 5 помилок з кодом 5xx (consecutive5xxErrors), Pod буде виключено з балансера навантаження, на 30 секунд (baseEjectionTime) за умови, що як мінімум 20% запущених Pod (100% - maxEjectionPercent) залишиться працювати.

Застосовуємо і перевіряємо нашу систему. Надсилаємо 100 запитів і переконуємось, що вона працює коректно. Оскільки нездоровий Pod не викликається, то запити займають зовсім мало часу.
