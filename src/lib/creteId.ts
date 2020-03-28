let id: number = parseInt(window.localStorage.getItem("_idMax") || "0") || 0;

function createId() {
  id++;
  window.localStorage.setItem("_idMax", id.toString());
  return id;
}

export default createId;
