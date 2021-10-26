# Lab 2
Ускладнимо логіку нашого додатку. Маємо наступні сервіси: 

__dbc-service__  - має одну точку входу ```/api/dbc-service/makeDBCall```, що повертає об'єкт з даними типу { data: 'some data from DB', err : null};

__some-api-service__ - тут будемо емулювати нездорову поведінку , частина запитів буде проходити як і раніше, частина матиме затримку 10 секунд. Сервіс має дві точки входу ```/api/some-api-service/addBank``` та ```/api/some-api-service/crash```, саме вона "ламає" Pod після чого запити /api/some-api-service матимуть затримку 10 секунд. 

__root-service__ - сервіс, який робить запити на 2 попередні сервіси, та повертає результат

Для того, щоб зібрати контейнери для всіх необхідних сервісів ми створили два скрипти [docker.sh](https://github.com/zavad4/MicroserviceProject/blob/main/lab2/docker.sh) і [k8s.sh](https://github.com/zavad4/MicroserviceProject/blob/main/lab2/k8s.sh) і потім виконували  
```
$ sh lab2/docker.sh
$ sh lab2/k8s.sh
```
Для того, щоб перевірити роботу додатку ми робимо 100 запитів з root-service до двох інших і ще 100 всередині some-api-service, при цьому виводимо середній час запитів та кількість відмов.

Зараз ми маємо три запущених сервіси, які швидко та коректно відповідають на запити. Для емуляції нездорового Pod виконуємо запит ```/api/some-api-service/crash``` . Тепер запити виконуються значно довше.

Реалізуємо retry/timeout, для цього будемо використовувати Istio. 
Нам знадобиться VirtualService - це додатковий проксі,який стоїть перед сервісом на який робиться запит. Саме там ми визначаємо конфігурацію, яка буде перенаправляти трафік з "нездорового" Pod на здоровий. Створюємо відпоідні файли, в яких задаємо налаштування retry/timeout (адреса перенаправлення, кількість спроб та виділених на це секунд, код помилок, які розглядаємо та ін):
* для  some-api-service [istio.config.yaml](https://github.com/zavad4/MicroserviceProject/blob/main/lab2/k8s/api_service/istio.config.yml)
* для  dbc-service [istio.config.yaml](https://github.com/zavad4/MicroserviceProject/blob/main/lab2/k8s/dbc_service/istio.config.yml)
* для  root-service [istio.config.yaml](https://github.com/zavad4/MicroserviceProject/blob/main/lab2/k8s/root_service/istio.config.yml)

Після "ламаємо" Pod і бачимо, що перенаправлення справді відбувається і середній час запиту зменшується, адже повторний запит надсилається вже на здоровий Pod.

Далі для покращення доступності та роботи додатку застосуємо патерн circuit breaker. Він передбачає, шо запити перестануть надсилатись, якщо Pod працює нестабільно.

Задаємо налаштування:
```apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: some-api-destination
spec:
  host: some-api-service
  trafficPolicy:
    outlierDetection:
      consecutive5xxErrors: 5 
      interval: 10s
      baseEjectionTime: 30s
      maxEjectionPercent: 80
```
Отже, якщо протягом 10 секунд (interval) відбудеться 5 помилок з кодом 5xx (consecutive5xxErrors), Pod буде виключено з балансера навантаження, на 30 секунд (baseEjectionTime) за умови, що як мінімум 20% запущених Pod (100% - maxEjectionPercent) залишиться працювати.

Застосовуємо і перевіряємо нашу систему. Надсилаємо 100 запитів і переконуємось, що вона працює коректно. Оскільки нездоровий Pod не викликається, то запити займають зовсім мало часу.
