function runParallel(tasks, finalCallBack) {
  const results = [];
  let index = 0;
  let hasErr = false;

  tasks.forEach((task, i) => {
    task((err, data) => {
      if (hasErr) {
        return;
      }
      if (err) {
        hasErr = true;
        finalCallBack(err);
        return;
      }
      results[i] = data;
      index++;

      if (tasks.length === index) {
        finalCallBack(null, results);
      }
    });
  });
}

runParallel(
  [
    (cb) => setTimeout(() => cb(null, "A"), 1000),
    (cb) => setTimeout(() => cb(null, "B"), 200),
    (cb) => setTimeout(() => cb(null, "C"), 500),
  ],
  (error, results) => {
    if (error) {
      console.log("Error:", error);
      return;
    }
    console.log(results);
  }
);


runParallel(
  [
    (cb) => setTimeout(() => cb(null, 1), 500),
    (cb) => setTimeout(() => cb(new Error("Failed")), 200),
    (cb) => setTimeout(() => cb(null, 3), 1000),
  ],
  (error, results) => {
    if (error) {
      console.log("Error:", error.message);
      return;
    }
    console.log(results);
  }
);
