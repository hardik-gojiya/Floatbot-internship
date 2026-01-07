// method 1
function mySetTimeout(callback, delay) {
  const start = Date.now();

  while (Date.now() - start < delay) {}

  callback();
}

// mySetTimeout(() => {
//   console.log("Executed after 2 seconds");
// }, 2000);

// method 2

function mySetTimeout2(callback, delay) {
  const start = Date.now();

  const intervalId = setInterval(() => {
    const elapsedTime = Date.now() - start;

    if (elapsedTime >= delay) {
      clearInterval(intervalId);
      callback();
    }
  }, 10);
}

mySetTimeout2(() => {
  console.log("Executed after 2 seconds");
}, 2000);
