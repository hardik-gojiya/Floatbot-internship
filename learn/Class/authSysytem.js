class User {
  #password;
  constructor(username, password) {
    this.username = username;
    this.#password = password;
  }

  login(password) {
    if (this.#password !== password) {
      return "Login unSuccessfull";
    }
    return "Login Successfull";
  }

  changePassword(oldPass, newPass) {
    if (this.#password !== oldPass) {
      return "Enter valid password";
    }
    this.#password = newPass;
    return "Password Changes Succesfull";
  }
}

const myUser = new User("dev_mind", "secret123");

console.log(myUser.login("wrong_pass"));
console.log(myUser.changePassword("secret123", "new_safe_pass"));
