class AuthService {
  static login(user) {
    user.isLoggedIn = true;
    return "Login success";
  }

  static logout(user) {
    user.isLoggedIn = false;
    return "Logout success";
  }

}

const userObj = { name: "Ravi", isLoggedIn: false };
console.log(AuthService.login(userObj));
