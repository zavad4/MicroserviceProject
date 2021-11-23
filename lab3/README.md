# Lab 3

Підключимо базу даних в наш додаток (будемо використовувати MySql), отже в нас ускладнюється логіка додатку, тому створюємо [MySql сервіс](https://github.com/zavad4/MicroserviceProject/tree/main/lab3/k8s/mysql_service). Для цього нам знадобиться сутності для зв'язку БД та додатку: PersistentVolume(реалізує зв'язок диску з кластером), PersistentVolumeClaim(реалізує зв'язок Pod диск з PersistentVolume). Поведінку цих сутностей опишемо у відповідних конфіг-файлах:
* [pv](https://github.com/zavad4/MicroserviceProject/blob/main/lab3/k8s/kafka/pv.config.yml),
* [pvc](https://github.com/zavad4/MicroserviceProject/blob/main/lab3/k8s/kafka/pvc.config.yml). 

Ми виділили для нашого сховища 1гб пам'яті та встановили режим доступy ReadWriteOnce. Це дозволяє нам зберігати дані в зовнішньому сховищі.

Налаштуємо message broker повідомлень, тобто технологію, що забезпечує зв'язок між декількома сервісами для обміну інформацією між ними. Ми використовуємо [kafka](https://github.com/zavad4/MicroserviceProject/blob/main/lab3/k8s/kafka/kafka.yml) з [zookeeper](https://github.com/zavad4/MicroserviceProject/blob/main/lab3/k8s/kafka/zookeeper.yml). Її принцип роботи полягає в тому, що producer надсилає в чергу дані, які обробляються далі в consumer, зокрема kafka гарантує стійку послідовність передачі данних і ці дані видаляються з черги лише після того як consumer їх обробить.Таким чином ми не втрачаємо точність, але зменшуємо обсяг даних, які потрібно зберігати в певний момент часу. Також це дозволяє декільком consumer підключатись до одного producer.

Ми ускладнили логіку додатку - додали notification у вигляді повідомлень на електронну пошту. Обмін повідомлень між сервісами відбувається таким чином: у __root-service__ є producer, який приймає адресу пошти з нашого запита і за допомогою message broker передає ці дані api сервісу. __some_api-service__ в свою чергу:

1 За допомогою consumer приймає необхідну адресу та на неї надсилає лист notification

2 За допомогою producer надсилає запит до dbc-сервісу для додання адреси до бази даних

__dbc-service__ за допомогою consumer приймає адресу та перевіряє чи вона вже існує в базі даних, якщо немає, додає її.
