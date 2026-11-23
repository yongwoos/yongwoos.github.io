document.querySelectorAll(".section-tags").forEach((container) => {
  if (container.querySelector("a")) {
    return;
  }

  const queries = container.textContent
    .split(/\r?\n/)
    .map((query) => query.trim())
    .filter(Boolean);
  const links = queries.map((query) => {
    const link = document.createElement("a");
    link.className = "section-tag";
    link.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `#${query}`;
    return link;
  });

  container.replaceChildren(...links);
});
