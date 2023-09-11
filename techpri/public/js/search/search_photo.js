// けんさくボタンが押されたら、保存されている写真にIDが一致するものがあるかを検索します。
const searchPhoto = () => {
  const id = document.getElementById("inputID").value;

  // もしIDを入力する欄になにも書かれていなければ、うまく検索ができないのでメッセージを表示して処理を終わらせます。
  if (id == null || id == "") {
    const message = document.getElementById("message");

    message.innerText = "IDを入力してね！";

    return;
  }

  // ここでサーバーとの通信を行い、写真が存在するかの検索結果を取得しています。
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.response == "exist") {
        // もし存在すれば、画像のページに移動します。s
        location.href = `/photo/${id}`;
      } else {
        // 存在しなければ、メッセージを表示します。
        const message = document.getElementById("message");

        message.innerText = "対象のIDは見つかりませんでした";
      }
    }
  };

  // リクエスト、つまり通信を送っています。
  request.open("GET", `/search_photo/${id}`);
  request.send();
};
