class User {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.isLoggedin = false;

    if (!this.email.includes("@")) {
      throw new Error("Invalid email");
    }
    const allowedRole = ["User", "Admin"];
    if (!allowedRole.includes(this.role)) {
      throw new Error("Invalid Role.");
    }
  }

  login() {
    this.isLoggedin = true;
    return `${this.name} is loggedin`;
  }

  logout() {
    this.isLoggedin = false;
    return `${this.name} is loggedout`;
  }

  getProfile() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isLoggedin: this.isLoggedin,
    };
  }
}

const user = new User(1, "Rahul", "rahul@gmail.com", "Admin");
console.log(user.login());
console.log(user.getProfile());
