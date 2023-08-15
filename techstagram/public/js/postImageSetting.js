/**
 * 読み込み先：newpost.erb
 * 用途：画像のドラッグ&ドラッグ、画像のプレビュー表示に関する設定を行う
 */

const fileArea = document.querySelector('#drag-drop-area');
const fileInput = document.querySelector('#file-input');
var dragDropAreaImg, dragDropAreaInfo, preview;

// consoleにおける、nullでのエラー表示を避ける
if(document.querySelector(".add-img") != null){
  dragDropAreaImg = document.querySelector(".add-img");
  dragDropAreaInfo = document.querySelector(".drag-drop-info");
} else if(document.querySelector(".edit-img") != null){
  dragDropAreaImg = document.querySelector(".edit-img");
}

fileArea.addEventListener('dragover', function(evt){
  /* 
    EventListenerの「drop」は「dragover」のデフォルトの挙動が有効になっているときは発生しないため、
    preventDefaultメソッドでデフォルトの挙動をさせないようにしている
  */
  evt.preventDefault();
});

// 画像のドラッグ&ドロップエリアに画像が入れられたときに、プレビューを表示させる
fileArea.addEventListener('drop', function(evt){
  // デフォルトの挙動が有効の場合、Firefoxなどのブラウザでドロップしたときに画像表示に切り替わってしまうこと防ぐ
  evt.preventDefault();
  // dataTransferでドロップされた画像を取得する
  var files = evt.dataTransfer.files;
  fileInput.files = files;
  // プレビューを表示する関数の呼び出し
  photoPreview('onChange',files[0]);
});

// プレビューを表示する関数(f = nullはundefinedを防ぐための初期値代入)
function photoPreview(event, f = null) {
  var file = f;

  // fに値が渡されていなかったときのハンドリング
  if(file === null){
    file = event.target.files[0];
  }

  // ユーザーのコンピューターに保存されているファイルの読み取り
  const reader = new FileReader();

  // 初めはidがpreview-areaのdivタグを生成して、その中に選択したimgを表示させる
  // (→ メンバーに空のdivタグだけ書かせると疑問点が増える可能性があるので、あえてjsで追加するような実装にしている) 
  if(preview == null){
    preview = document.createElement("div");
    preview.setAttribute("id", "preview-area");
  // ２回目以降は、初期に作成したidがpreview-areaのdivタグを使用する
  } else {
    preview = document.querySelector("#preview-area")
  }

  const previewImage = document.querySelector("#preview-image");

  // 2回目にドラッグ&ドロップしたときに前にプレビューしてた画像を取り除く
  if(previewImage != null) {
    preview.removeChild(previewImage);
  }

  // 正常にドロップした画像が読み込まれたとき
  reader.onload = function(event) {
    // 「写真を追加　または、ファイルをドラッグ&ドロップ」のアイコン画像と文字を見えなくする
    if(dragDropAreaImg.classList.contains("add-img")){
      dragDropAreaImg.style.opacity = 0;
      dragDropAreaInfo.style.opacity = 0;
    } else if(dragDropAreaImg.classList.contains("edit-img")) {
      dragDropAreaImg.style.opacity = 0;
    }
    // imgタグを作って、プレビューに表示する
    const img = document.createElement("img");
    img.setAttribute("src", reader.result);
    img.setAttribute("id", "preview-image");
    preview.appendChild(img);
    fileArea.appendChild(preview);
  };

  // ファイル選択された時
  if(fileInput.value.length){
    reader.readAsDataURL(file);
  // ファイル選択でキャンセルされた時
  } else if(dragDropAreaImg.classList.contains("add-img")) {
    dragDropAreaImg.style.opacity = 1;
    dragDropAreaInfo.style.opacity = 1;
  } else if(dragDropAreaImg.classList.contains("edit-img")) {
    dragDropAreaImg.style.opacity = 1;
  }
}
