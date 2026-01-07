function readFileMock(path, callback) {
  const fakeFileSystem = {
    "/data/user.txt": "User data here",
    "/data/info.txt": "Some info here",
  };

  setTimeout(() => {
    if (!fakeFileSystem[path]) {
      callback(new Error("File Not Found"), null);
    }
    return;
  });

  callback(null, fakeFileSystem[path]);
}

readFileMock("/data/user.txt", (error, data) => {
  if (error) {
    console.log("Error:", error.message);
    return;
  }
  console.log("Data:", data);
});
