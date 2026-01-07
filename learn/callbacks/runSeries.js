function runSeries(tasks, finalCallback) {
  const results = [];
  let index = 0;

  function nextTask() {
    if (tasks.length === index) {
      finalCallback(null, results);
      return;
    }

    tasks[index]((err, data) => {
      if (err) {
        finalCallback(err);
        return;
      }
      results.push(data);
      index++;
      nextTask();
    });
  }
  nextTask();
}

runSeries(
  [
    (cb) => setTimeout(() => cb(null, 1), 1000),
    (cb) => setTimeout(() => cb(null, 2), 500),
  ],
  (error, results) => {
    if (error) {
      console.log("Error:", error);
      return;
    }
    console.log(results);
  }
);
