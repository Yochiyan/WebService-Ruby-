// 画面が読み込まれたら、画面のコンテンツを全てふわっと表示しています。
window.onload = function () {
  content.style.display = "block";
  content.animate([{ opacity: "0" }, { opacity: "1" }], { duration: 250 });
  content.style.opacity = 1;
};
