/**
 * 読み込み先：index.erb
 * 用途：非同期での post '/:id/like' を行う
 */

var postId;
var xmlHttpRequest;

function postToLikeMethod() {
  // クリックされたiタグ(ハートの要素)
  const heartIcon = this;

  // 親要素が持つpost-idを取得
  postId = heartIcon.parentNode.dataset.id;

  // iタグにアニメーション用のクラスを付与する
  heartIcon.classList.add("liked");
  heartIcon.classList.add("fa-solid");
  // 0.4s後にアニメーション用のクラスを取り除く(連続でアニメーションさせるため)
  setTimeout(function() {
    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.remove("liked");
  }, 200);
    
  // 送信するためのパスを指定
  const url = "/" + postId + "/like";
  // XMLHttpRequestを行うための準備
  xmlHttpRequest = new XMLHttpRequest();
  // onreadystatechangeが変更したとき(status 200が返ってきたとき)に、行う処理の関数を指定する
  xmlHttpRequest.onreadystatechange = receive;
  // postするための準備
  xmlHttpRequest.open("POST", url, true);
  xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlHttpRequest.send("method=post");
}

function receive() {
  // 送信成功したとき
  if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
    // 文字列をJSONとしてパースする
    var response = JSON.parse(xmlHttpRequest.responseText);
    // 返ってきた値(いいね数)を表示するためにspanのテキストを変更する
    var selectedPostLikeNumber = document.querySelector('button[data-id="' + postId + '"] span');
    selectedPostLikeNumber.innerHTML = response.like;
  }
}

// ページの読み込みが完了した時
window.addEventListener("load", function() {
  // 各post-likeクラス内のiタグを全ての投稿分取得する(クリックするハートの要素)
  const postLikeElements = document.querySelectorAll(".post-like i");
  // NodeListをArrayに変換
  const postLikeArray = Array.from(postLikeElements);
  // 非同期通信させるため、各iタグにクリックしたときのeventListenerを追加する
  postLikeArray.forEach(function(postLikeElement) {
    // クリックしたときの処理として、postToLikeMethodを指定する
    postLikeElement.addEventListener("click", postToLikeMethod, false);
  });
}, false);
