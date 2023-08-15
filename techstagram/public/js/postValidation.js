/**
 * 読み込み先：newpost.erb
 * 用途：新規投稿するときのバリデーションを行う
 */

// ページの読み込みが完了した時
window.addEventListener("load", function() {
  const userNameElement = document.getElementsByName("user_name")[0];
  const captionElement = document.getElementsByName("caption")[0];
  const locationElement = document.getElementsByName("location")[0];
  const fileInputElement = document.getElementById('file-input');

  const shareButton = document.querySelector("#share");
  shareButton.disabled = true;

  // 最大入力長を指定
  userNameElement.setAttribute('maxlength', '15');
  captionElement.setAttribute('maxlength', '2200');
  locationElement.setAttribute('maxlength', '35');

  // 文字を表示するpタグを追加
  if(userNameElement.nextElementSibling == null){
    const inputArray = [userNameElement, captionElement, locationElement];
    for(var i = 0; i < inputArray.length; i++){
      const numberOfCharactersElement = document.createElement("p");
      numberOfCharactersElement.innerHTML = `0/${inputArray[i].getAttribute("maxlength")}`;
      const parentNode = inputArray[i].parentNode;
      parentNode.append(numberOfCharactersElement);
    }
  }

  // 初期呼び出しで、すでに入力されている文字をカウントする
  checkSharable()

  // 入力タイミングでのイベント発火
  userNameElement.addEventListener('input', checkSharable);
  captionElement.addEventListener('input', checkSharable);
  locationElement.addEventListener('input', checkSharable);
  fileInputElement.addEventListener('input', checkSharable);
  
  // 画像の有無を確かめるバリデーション
  function checkImageInput() {
    if (fileInputElement == undefined) {
      return true
    }
    
    return (fileInputElement.value.length > 0 || document.querySelector('.edit-img') != null)
  }

  // シェアするためのバリデーション
  function checkSharable() {
    userNameElement.nextElementSibling.innerHTML = `${userNameElement.value.length}/15`;
    captionElement.nextElementSibling.innerHTML = `${captionElement.value.length}/2,220`;
    locationElement.nextElementSibling.innerHTML = `${locationElement.value.length}/35`;
    
    // inputの入力文字数と選択されている画像の有無からシェアできるかを判定する
    if(userNameElement.value.length > 0 && checkImageInput()){
      shareButton.style.color = "#1789EE";
      shareButton.disabled = false;
    } else {
      shareButton.style.color = "#B5B5B5";
      shareButton.disabled = true;
    }
  }
}, false);
