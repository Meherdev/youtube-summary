export function getOrCreateDeviceId(): string {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = crypto.randomUUID(); // Or use nanoid if you prefer
      localStorage.setItem("device_id", id);
    }
    return id;
}

