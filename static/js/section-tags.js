document.querySelectorAll(".section-tags").forEach((container) => {
  if (container.querySelector("a")) {
    return;
  }

  const queries = container.textContent.trim().split(/\s+/).filter(Boolean);
  const links = queries.map((query) => {
    const link = document.createElement("a");
    link.className = "section-tag";
    link.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `#${query}`;
    return link;
  });

  container.replaceChildren(...links);
});
