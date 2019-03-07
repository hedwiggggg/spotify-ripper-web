class Clients {
  constructor() {
    this.clients = new Map();
  }

  add(ws, data) {
    const client = this.clients.get(ws);
    if (client) {
      this.clients.set(ws, {
        ...client,
        ...data
      });
    } else {
      this.clients.set(ws, data);
    }
  }

  get(ws) {
    return this.clients.get(ws);
  }

  delete(ws) {
    this.clients.delete(ws);
  }
}

module.exports = new Clients()