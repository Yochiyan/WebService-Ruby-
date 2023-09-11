/**
 * 読み込み先：index.erb
 * 用途：各投稿の空文字のlocationを非表示にする
 */

// ページの読み込みが完了した時
window.addEventListener("load", function() {
    // 各投稿のlocationを取得する
    const postLocationElements = document.querySelectorAll(".post-location");
    // NodeListをArrayに変換
    const postLocationArray = Array.from(postLocationElements);
    // 各投稿のlocationの文字数を確認して、空文字の場合は非表示にする
    postLocationArray.forEach(function(postLocationElement) {
        if(postLocationElement.children[1].innerHTML.length == 0){
            postLocationElement.style.opacity = 0;
        }
    });
});