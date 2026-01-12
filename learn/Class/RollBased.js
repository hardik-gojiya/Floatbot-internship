class AccessControl {
  constructor() {
    this.roles = new Map();
  }

  registerRole(role) {
    this.roles.set(role.name, role);
  }

  canAccess(user, action, resource) {
    const role = this.roles.get(user);
    if (!role) return false;

    return role.getPermissions.some((p) => p.matches(action, resource));
  }
}

class Permission {
  constructor(action, resource) {
    this.action = action;
    this.resource = resource;
  }

  matches(action, resource) {
    return this.action === action && this.resource === resource;
  }
}

class Role {
  constructor(name) {
    this.name = name;
    this.permissions = [];
  }

  addPermissions(permission) {
    this.permissions.push(permission);
  }
  getPermissions() {
    return this.permissions;
  }
}

const readPost = new Permission("read", "post");
const editPost = new Permission("edit", "post");

const admin = new Role("admin");
admin.addPermissions(readPost);
admin.addPermissions(editPost);

const user = new Role("user");
user.addPermissions(readPost);

const ac = new AccessControl();
ac.registerRole(admin);
ac.registerRole(user);

const adminUser = { role: "admin" };
const normalUser = { role: "user" };

console.log(ac.canAccess(adminUser, "edit", "post"));
console.log(ac.canAccess(normalUser, "edit", "post"));
console.log(ac.canAccess(normalUser, "read", "post"));
