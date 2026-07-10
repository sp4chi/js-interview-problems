// Problem - Given N async tasks, design a task executor that executes only 3 tasks concurrently at a time.

class TaskExecutor {
  maxConcurrent;
  activeTask;
  queue;

  constructor(maxConcurrent = 3) {
    // default task = 3
    this.maxConcurrent = maxConcurrent;
    this.activeTask = 0;
    this.queue = [];
  }

  submit(task) {
    return new Promise((resolve, reject) => {
      const taskObj = { task, resolve, reject };
      if (this.activeTask < this.maxConcurrent) {
        this.runTask(taskObj);
      } else {
        this.queue.push(taskObj);
      }
    });
  }

  async runTask({ task, resolve, reject }) {
    this.activeTask++;
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.activeTask--;
      const nextTask = this.queue.shift();
      if (nextTask) {
        await this.runTask(nextTask);
      }
    }
  }
}

const createTask = (name, delay) => {
  return () => {
    return new Promise((resolve, reject) => {
      console.log(`Task ${name} running.`);
      setTimeout(() => {
        console.log(`Task ${name} finished.`);
        resolve(`Task ${name} complete`);
      }, delay);
    });
  };
};

const taskA = createTask('A', 4000);
const taskB = createTask('B', 2000);
const taskC = createTask('C', 1000);
const taskD = createTask('D', 6000);

const promises = [
  taskA,
  taskB,
  taskC,
  taskD,
  createTask('E', 1000),
  createTask('F', 1000),
  createTask('G', 1000),
  createTask('H', 1000),
  createTask('I', 1000),
  createTask('J', 1000),
  createTask('K', 1000),
  createTask('L', 1000),
];
const execute = new TaskExecutor();
const all = await Promise.all(promises.map((task) => execute.submit(task)));
all.forEach((el) => console.log(el));
