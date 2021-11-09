const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'kafka-client',
  brokers: ['kafka:9092']
});

class KafkaWrapped {
  constructor() {
    this.executors = {};
    this.consumer = kafka.consumer({ groupId: (Math.random() + 1).toString(36).substring(7) });
    this.producer = kafka.producer();
  }

  async init() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  startConsumer() {
    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (this.executors[topic]) {
          for (const executor of this.executors[topic]) {
            await executor(message);
          }
        } 
      },
    });
  }

  async subscribe(args) {
    await this.consumer.subscribe(args);
  }

  async addExecutor(topic, cb) {
    if (Array.isArray(this.executors[topic])) this.executors[topic].push(cb);
    else this.executors[topic] = Array.of(cb);     
  }

  send(topic, values) {
    this.producer.send({
      topic,
      messages: Array.isArray(values) ? values : [values],
    });
  }

}

// await consumer.subscribe({ topic: 'email-topic', fromBeginning: true })

module.exports = new KafkaWrapped();

