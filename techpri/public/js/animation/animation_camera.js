// ここで対応するHTMLに書かれているパーツを、パーツのidから探して取得しています。
var loadingMessage = document.getElementById("loading");
var content = document.getElementById("content");

// カメラの画面がふわっと出てくるようにしています。
function cameraViewFadeIn() {
  // 最初にローダーを消しています。
  loadingMessage.animate([{ opacity: "1" }, { opacity: "0" }], { duration: 400 });
  
  // ローダーのアニメーションが終わる1秒後から、カメラをふわっと表示するアニメーションを開始しています。
  setTimeout(function () {
    loadingMessage.style.display = "none";
    content.style.display = "block";
    content.animate([{ opacity: "0" }, { opacity: "1" }], { duration: 1500 });
    content.style.opacity = 1;
  }, 400);
}
