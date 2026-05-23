const API_BASE = process.env.REACT_APP_API_BASE || "";

function getToken() {
  return localStorage.getItem("hd_token") || "";
}

async function handle(res) {
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (body && body.message) || (typeof body === "string" ? body : "Request gagal");
    throw new Error(message);
  }
  return body;
}

export async function fetchKatalog(query = "") {
  const url = query
    ? `${API_BASE}/api/katalog?cari=${encodeURIComponent(query)}`
    : `${API_BASE}/api/katalog`;
  const res = await fetch(url);
  return handle(res);
}

export async function fetchKatalogById(id) {
  const res = await fetch(`${API_BASE}/api/katalog/${id}`);
  return handle(res);
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handle(res);
}

export async function createProduk(formData) {
  const res = await fetch(`${API_BASE}/api/katalog`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handle(res);
}

export async function updateProduk(id, formData) {
  const res = await fetch(`${API_BASE}/api/katalog/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handle(res);
}

export async function updateStok(id, stok) {
  const res = await fetch(`${API_BASE}/api/katalog/${id}/stok`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ stok }),
  });
  return handle(res);
}

export async function deleteProduk(id) {
  const res = await fetch(`${API_BASE}/api/katalog/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res);
}
