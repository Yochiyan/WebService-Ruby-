/**
 * 読み込み先：index.erb
 * 用途：captionが見切れている投稿に対して、「続きを読む」を追加する
 */

// ページの読み込みが完了した時
window.addEventListener("load", function() {
  // post-captionクラスを持つタグを全ての投稿分取得する
  const postCaptionElements = document.querySelectorAll(".post-caption");
  // NodeListをArrayに変換
  const postCaptionElementsArray = Array.from(postCaptionElements);
  // captionが見切れている投稿に対して、続きを読むための要素を追加する
  postCaptionElementsArray.forEach(function(postCaptionElement) {
    if(postCaptionElement.offsetWidth >= 380){
      const expandElement = document.createElement("p");
      expandElement.classList.add("expand");
      expandElement.innerHTML = "続きを読む";
      postCaptionElement.after(expandElement);
      // 「続きを読む」がクリックされたときの処理として、expandCaptionを指定する
      expandElement.addEventListener("click", expandCaption);
    }
  });
});

function expandCaption() {
  // クリックされた「続きを読む」要素にclickedクラスを付与する
  this.classList.add("clicked");
  // 「続きを読む」要素と同じ階層のpost-captionクラスを持つ要素にもclickedクラスを付与する
  const postCaptionElement = this.previousElementSibling
  postCaptionElement.classList.add("clicked");
}
