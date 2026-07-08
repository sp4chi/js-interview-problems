// Given N async task, implement a system that executes K tasks at a time (concurrent execution), K < N and once any one of the K tasks finishes it excutes the next N - K tasks until all tasks are complete.
// input is an array of promises

// const promises = [
//   async (resolve, reject) => {
//     setTimeout(() => {
//       console.log();
//     }, 1000);
//   },
// ];
class TaskExecutor {
  maxConcurrent;
  activeTasks;
  queue;
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.activeTasks = 0;
    this.queue = [];
  }

  async runTask({ task, resolve, reject }) {
    this.activeTasks++;
    try {
      const result = await task();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this.activeTasks--;
      // if queue not empty, pop a task and execute it
      const nextTask = this.queue.shift();
      if (nextTask) {
        this.runTask(nextTask);
      }
    }
  }
  // submit() - this function will submit tasks
  submit(task) {
    // 1. create new promise
    // 2. pack the promise
    return new Promise((resolve, reject) => {
      // pack
      const taskObj = { task, resolve, reject };

      if (this.activeTasks < this.maxConcurrent) {
        // start executing
        this.runTask(taskObj);

        // when any running task finishes
        // this.activeTask--
        // pop task from queue and run a new task
        // newtask = this.queue.shift()
        // this.activeTasks--;
        // return await task()
        // this.activeTasks++
      } else {
        this.queue.push(taskObj);
      }
    });
  }
}
// Ex - task
const createTask = (name, delay) => {
  return () => {
    return new Promise((resolve, reject) => {
      console.log(`${name} starting`);
      setTimeout(() => {
        console.log(`${name} finished.`);
        resolve(`${name} complete`);
      }, delay);
    });
  };
};

const taskA = createTask('A', 10000); // async function use await
const taskB = createTask('B', 2000);
const taskC = createTask('C', 1000);
const taskD = createTask('D', 6000);

// desired output - taskC, taskB, taskD, taskA
const executor = new TaskExecutor();
const tasks = [taskA, taskB, taskC, taskD];
tasks.forEach((task) => executor.submit(task));
