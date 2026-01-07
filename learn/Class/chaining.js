class QueryBuilder {
  constructor() {
    this.query = {};
  }

  select(...fields) {
    this.query.select = fields;
    return this;
  }

  where(key, value) {
    this.query.select = { [key]: value };
    return this;
  }

  limit(count) {
    this.query.limit = count;
    console.log(this);
    return this;
  }

  execute() {
    return this.query;
  }
}

const q = new QueryBuilder()
  .select("name", "email")
  .where("role", "admin")
  .limit(5)
  .execute();

console.log(q);
