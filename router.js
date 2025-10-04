// Rutas soportadas:
// #/catalog?query=&cat=&sort=
// #/event/ID
// #/cart
// #/favorites
function parseHash() {
  const raw = location.hash.slice(1);       // e.g., "catalog?query=x"
  if (!raw) return { path: "catalog", params: {} };
  const [path, query] = raw.split("?");
  const params = {};
  if (query) {
    for (const kv of query.split("&")) {
      const [k, v] = kv.split("=");
      params[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
    }
  }
  return { path, params };
}

function navigate(path, params = {}) {
  const q = Object.keys(params).length
    ? "?" + Object.entries(params).map(([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      ).join("&")
    : "";
  location.hash = `${path}${q}`;
}

function handleRouting() {
  const { path, params } = parseHash();
  if (path.startsWith("event/")) {
    const id = path.split("/")[1];
    renderDetail(id);
  } else if (path === "cart") {
    renderCart();
  } else if (path === "favorites") {
    renderFavorites();
  } else {
    renderCatalog(params);
  }
}

window.addEventListener("hashchange", handleRouting);

// Exponer helpers globales que usa app.js
window._router = { parseHash, navigate };
