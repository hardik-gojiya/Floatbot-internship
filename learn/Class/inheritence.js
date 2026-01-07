class Employee {
  constructor(name, baseSalary) {
    this.name = name;
    this.baseSalary = baseSalary;
  }

  calculateSalary() {
    return this.baseSalary;
  }
}

class Developer extends Employee {
  calculateSalary() {
    return this.baseSalary + 40000;
  }
}

class Manager extends Employee {
  calculateSalary() {
    return this.baseSalary + 50000;
  }
}

const dev = new Developer("Amit", 50000);
console.log(dev.calculateSalary());
