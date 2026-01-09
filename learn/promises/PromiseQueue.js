class PromiseQueue {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.tryRun();
    });
  }
  tryRun() {
    if (this.limit <= this.running) return;
    if (this.queue.length === 0) return;

    const { task, resolve, reject } = this.queue.shift();
    this.running++;

    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.running--;
        this.tryRun();
      });
  }
}


const queue = new PromiseQueue(2);

const createTask = (id, delay) => () =>
  new Promise(res => {
    console.log(`Start ${id}`);
    setTimeout(() => {
      console.log(`End ${id}`);
      res(id);
    }, delay);
  });

queue.addTask(createTask(1, 1000));
queue.addTask(createTask(2, 500));
queue.addTask(createTask(3, 300));
queue.addTask(createTask(4, 400));

