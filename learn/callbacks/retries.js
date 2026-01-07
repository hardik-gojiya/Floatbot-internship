function retry(fn, retries, callback) {
  let attempt = 0;

  function execute() {
    fn((err, data) => {
      if (!err) {
        callback(null, data);
        return;
      }

      if (retries === 0) {
        callback(err);
      }

      setTimeout(() => {
        retries--;
        attempt++;
        execute();
      }, 500);
    });
  }
  execute();
}

function unstableTask(cb) {
  const success = Math.random() > 0.6;
  setTimeout(() => {
    if (success) cb(null, "Success!");
    else cb(new Error("Temporary failure"));
  }, 200);
}

retry(unstableTask, 3, (err, result) => {
  if (err) {
    console.log("Final Error:", err.message);
    return;
  }
  console.log("Result:", result);
});
