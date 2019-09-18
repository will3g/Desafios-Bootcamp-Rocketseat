import Bee from 'bee-queue';
import SubscriptionMail from '../app/jobs/SubscriptionMail';
//import CancelationMail from '../app/jobs/SubscriptionMail';

import redisConfig from '../config/redis';

// Array de jobs
const jobs = [SubscriptionMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() { // Cria a fila
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) { // Adiciona na fila
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() { // Processa as filas
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();