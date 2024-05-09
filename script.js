const link = document.querySelector("a");

document.querySelector("select").addEventListener("change", function (e) {
  link.href = `/api/rss.xml?tags=${e.target.value}`;
});