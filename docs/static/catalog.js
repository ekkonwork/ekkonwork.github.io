(() => {
  const grid = document.querySelector("#catalog-grid");
  const input = document.querySelector("#search");
  const status = document.querySelector("#search-status");
  const more = document.querySelector("#load-more");
  if (!grid || !input || !status || !more) return;

  let assets = [];
  let matches = [];
  let visible = 48;

  function createCard(asset) {
    const article = document.createElement("article");
    article.className = "asset-card";
    const link = document.createElement("a");
    link.href = asset.path;
    const image = document.createElement("img");
    image.src = asset.image;
    image.alt = asset.title;
    image.loading = "lazy";
    image.width = 1000;
    image.height = 667;
    const title = document.createElement("span");
    title.textContent = asset.title;
    link.append(image, title);
    article.append(link);
    return article;
  }

  function render() {
    grid.replaceChildren(...matches.slice(0, visible).map(createCard));
    const shown = Math.min(visible, matches.length);
    status.textContent = matches.length
      ? `Showing ${shown.toLocaleString()} of ${matches.length.toLocaleString()} images`
      : "No matching images. Try a broader subject.";
    more.hidden = shown >= matches.length;
  }

  function filter() {
    const query = input.value.trim().toLocaleLowerCase();
    visible = 48;
    matches = query
      ? assets.filter((asset) => `${asset.title} ${asset.id} ${asset.keywords.join(" ")}`.toLocaleLowerCase().includes(query))
      : assets;
    const url = new URL(window.location.href);
    query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
    history.replaceState(null, "", url);
    render();
  }

  input.disabled = true;
  more.disabled = true;
  status.textContent = "Loading the full catalog";

  fetch("/search-index.json")
    .then((response) => {
      if (!response.ok) throw new Error("Catalog request failed");
      return response.json();
    })
    .then((data) => {
      assets = data;
      matches = assets;
      input.disabled = false;
      more.disabled = false;
      const initialQuery = new URL(window.location.href).searchParams.get("q") || "";
      input.value = initialQuery;
      filter();
    })
    .catch(() => {
      status.textContent = "The full catalog could not load. The latest images remain available below.";
      more.hidden = true;
    });

  input.addEventListener("input", filter);
  more.addEventListener("click", () => {
    visible += 48;
    render();
  });
})();
