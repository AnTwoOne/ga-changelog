const link = document.querySelector("a");

document.querySelector("select").addEventListener("change", function (e) {
  link.href = `/api/rss.xml?categories=${e.target.value}`;
});