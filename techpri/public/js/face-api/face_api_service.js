// ここで対応するHTMLに書かれているパーツを、パーツのidから探して取得しています。
const video = document.getElementById("video");
var stream;
var creatingImage = true;

var emotion = document.getElementById("emotion").className;

// もし加工の種類を増やしたのなら、HTMLのcanvasを増やし、この配列を長くすることで処理が動くようになります。
// 画像を用いた加工は、メンターさんに聞きながら自分で増やしてくださいね。
var canvasArray = [
  document.getElementById("canvas1"),
  document.getElementById("canvas2"),
  document.getElementById("canvas3"),
];

var message = document.getElementById("message");
var emotionValue = document.getElementById("emotionValue");

const inputFile1 = document.getElementById("photo1");
const inputFile2 = document.getElementById("photo2");
const inputFile3 = document.getElementById("photo3");

const form = document.getElementById("takePhotoForm");

// フォントを読み込んでいます。
const fontFace = new FontFace(
  "mini-wakuwaku-maru",
  "url(/font/mini-wakuwaku-maru.otf)"
);

window.onload = function () {
  // 顔や表情を検出するface-apiを読み込んでいます。
  Promise.all([
    faceapi.loadSsdMobilenetv1Model("/js/face-api/weights"),
    faceapi.loadFaceLandmarkModel("/js/face-api/weights"),
    faceapi.loadFaceRecognitionModel("/js/face-api/weights"),
    faceapi.loadFaceExpressionModel("/js/face-api/weights"),
  ]).then(() => {
    console.log("finished reading faceAPI");
  });

  // カメラにアクセスし、リアルタイムに画像を表示する設定をします。
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then(async function (stream) {
      stream = stream;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
      // 読み込まれたすぐ後に、カメラ画面をフェードインさせます。
      setTimeout(function () {
        cameraViewFadeIn();
      }, 100);
    })
    .catch((e) => {
      console.log(e);
    });

  // フォントを読み込み始めます。
  fontFace.load();

  // 検出する表情がサーバーで設定されていないなら、えがおを設定します。
  if (emotion == "" || emotion == null) {
    emotion = "happy";
  }
};

// これが呼び出されるとformが送信されます。
// 逆に、これが呼び出されるまでformが送信されないような仕組みになっています。
function submitForm() {
  creatingImage = false;
  form.submit();
}

// script.jsで呼び出している関数です。さつえいボタンが押された後の処理が書かれています。
function takePhoto() {
  // カウントダウンを表示します。
  countdown();

  // カウントダウンが終わる3秒後に、videoに表示されている画像をcanvasに映し取っています。
  setTimeout(function () {
    var contextCanvas1 = canvasArray[0].getContext("2d");
    var contextCanvas2 = canvasArray[1].getContext("2d");
    var contextCanvas3 = canvasArray[2].getContext("2d");
    var w = video.clientWidth;
    var h = video.clientHeight;
    canvasArray[0].setAttribute("width", w);
    canvasArray[0].setAttribute("height", h);
    canvasArray[1].setAttribute("width", w);
    canvasArray[1].setAttribute("height", h);
    canvasArray[2].setAttribute("width", w);
    canvasArray[2].setAttribute("height", h);

    contextCanvas1.translate(w, 0);
    contextCanvas1.scale(-1, 1);
    contextCanvas2.translate(w, 0);
    contextCanvas2.scale(-1, 1);
    contextCanvas3.translate(w, 0);
    contextCanvas3.scale(-1, 1);

    contextCanvas1.drawImage(video, 0, 0, w, h);
    contextCanvas2.drawImage(video, 0, 0, w, h);
    contextCanvas3.drawImage(video, 0, 0, w, h);

    contextCanvas1.translate(w, 0);
    contextCanvas1.scale(-1, 1);
    contextCanvas2.translate(w, 0);
    contextCanvas2.scale(-1, 1);
    contextCanvas3.translate(w, 0);
    contextCanvas3.scale(-1, 1);

    // face-apiを用いて顔や表情を検出します。
    detectFace();
  }, 3000);
}

// カウントダウンのアニメーションを表示します。
function countdown() {
  var timer = document.getElementById("timer");
  var timerBackground = document.getElementById("timer-background");

  // timerとその背景を表示します。
  timer.style.display = "inline-block";
  timerBackground.style.display = "flex";

  // 秒数をずらしながらtimerのテキストを変更しています。
  timer.innerText = "3";
  timer.animate([{ opacity: "1" }, { opacity: "0" }], { duration: 1500 });

  setTimeout(function () {
    timer.innerText = "2";
    timer.animate([{ opacity: "1" }, { opacity: "0" }], { duration: 1500 });
  }, 1000);

  setTimeout(function () {
    timer.innerText = "1";
    timer.animate([{ opacity: "1" }, { opacity: "0" }], { duration: 1500 });
  }, 2000);

  setTimeout(function () {
    timer.innerText = "処理中…";
    timer.style.opacity = 1;
  }, 3000);
}

// face-apiを用いて顔や表情を検出します。また、ここで画像の加工も行なっています。
async function detectFace() {
  // この時点ではcanvasArrayの中に入っているcanvasは全て同じ画像なので、一番最初の要素を代表として利用し、face-apiに読み込ませています。
  const faceData = await faceapi
    .detectAllFaces(canvasArray[0])
    .withFaceLandmarks()
    .withFaceExpressions();

  // faceDataには検出された顔のデータが人数分入っています。
  // これの長さが0だったら検出された顔がないということなので、no_face画面に行きます。
  if (!faceData.length) {
    noFace();
    return;
  }

  // 感情の判定に用いる数値は、全員の感情の平均値としています。
  // もしこれを、全員の中の最大値や最小値にしたい場合、下に用意してある「maxEmotionOf」、「minEmotionOf」を用いてくださいね。
  let _emotionValue = averageEmotionOf(faceData);

  // ここでは0.2という値を境界にしています。製作者の勘ですので、変えてみるのも面白いかもしれませんね。
  if (_emotionValue < 0.2) {
    lessEmotion(_emotionValue);
    return;
  }

  // ここまでくれば、顔も検出されて感情も足りているので、結果はsuccessとなります。これをmessageに付与し、formを通じてサーバーに送信しています。
  message.value = "success";

  // canvasのcontextを配列にまとめます。
  const contextArray = [
    canvasArray[0].getContext("2d"),
    canvasArray[1].getContext("2d"),
    canvasArray[2].getContext("2d"),
  ];

  // サーバーから送られてきた画像をここに持たせています。
  // JavaScriptに画像を読み込む方法はいくつかありますが、こうするとHTMLから簡単に画像を変更することができます。
  const material = document.getElementById("material");

  // ここでは上と別の方法で画像を取得しています。
  const cheekImage = await loadImage("/img/materials/hoppe2.png");
  const nekomimiLeftImage = await loadImage("/img/materials/mimi_left.png");
  const nekomimiRightImage = await loadImage("/img/materials/mimi_right.png");
  const nekohanaImage = await loadImage("/img/materials/hana.png");

  // 画像を白くするために使う値です。これを大きくするとより白くなります。
  const gamma = 1.5;

  contextArray.forEach(function (context) {
    // contextに文字を記入する際のフォントを設定します。
    context.font = "25px mini-wakuwaku-maru";
    context.textAlign = "center";
    context.strokeStyle = "#FFF";
    context.lineWidth = 7;
    context.fillStyle = "#FF53B0";

    // 画像をgamma値を用いて白くします。
    var src = context.getImageData(0, 0, canvasArray[0].width, canvasArray[0].height);
    var dst = context.createImageData(canvasArray[0].width, canvasArray[0].height);

    for (var i = 0; i < src.data.length; i = i + 4) {
      dst.data[i] = ~~(255 * Math.pow(src.data[i] / 255, 1 / gamma));
      dst.data[i + 1] = ~~(255 * Math.pow(src.data[i + 1] / 255, 1 / gamma));
      dst.data[i + 2] = ~~(255 * Math.pow(src.data[i + 2] / 255, 1 / gamma));
      dst.data[i + 3] = src.data[i + 3];
    }

    // 変更したデータをcontextに反映します。
    context.putImageData(dst, 0, 0);
  });

  // 検出された顔それぞれに対して加工をしていきます。
  for (let i = 0; i < faceData.length; i++) {
    // 顔の特徴的な点の座標を取得します。
    const chin = faceData[i].landmarks.positions[8];
    const leftCheek = faceData[i].landmarks.positions[1];
    const rightCheek = faceData[i].landmarks.positions[15];
    const noseTop = faceData[i].landmarks.positions[30];
    const leftEye = faceData[i].landmarks.positions[36];
    const rightEye = faceData[i].landmarks.positions[45];
    const leftEyebrow = faceData[i].landmarks.positions[19];
    const rightEyebrow = faceData[i].landmarks.positions[24];

    // 顔の横幅を計算しています。
    const faceWidth = Math.sqrt(Math.pow(rightCheek.x - leftCheek.x, 2) + Math.pow(rightCheek.y - leftCheek.y, 2));
    // 顔の傾きを計算しています。
    const faceLean = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

    // 文字を書き込みます。
    contextArray.forEach(function (context) {
      context.save();

      // あご先に移動し、顔の傾きだけ座標を傾けます。
      context.translate(chin.x, chin.y);
      context.rotate(faceLean);

      // 2回に分けて文字を書き込み、ふちどりを追加しています。
      context.strokeText(emotionText(faceData[i]), 0, 35);
      context.fillText(emotionText(faceData[i]), 0, 35);

      context.restore();
    });

    // 1つ目のcanvasに対して加工を行います。
    var context = contextArray[0];
    // materialから取得した画像を右頬に貼り付けます。
    const iconSize = faceWidth * 0.3;
    context.save();

    context.translate(rightCheek.x, rightCheek.y);
    context.rotate(faceLean);

    // 移動した座標を元に、画像を右頬に貼り付けます。
    context.drawImage(material, -iconSize / 2 - 10, -5, iconSize, iconSize);

    context.restore();

    // 2つ目のcanvasに対して加工を行います。
    context = contextArray[1];
    // 両頬にcheekImageを貼り付けます。
    const cheekImageWidth = faceWidth * 0.4;
    const cheekImageHeight = faceWidth * 0.3;
    context.save();

    context.translate(leftCheek.x, leftCheek.y);
    context.rotate(faceLean);

    context.drawImage(cheekImage, -10, -5, cheekImageWidth, cheekImageHeight);

    context.translate(rightCheek.x - leftCheek.x, 0);

    context.drawImage(cheekImage, -cheekImageWidth + 10, -5, cheekImageWidth, cheekImageHeight);

    context.restore();

    // 3つ目のcanvasに対して加工を行います。
    context = contextArray[2];
    // ねこみみ、ねこはなを貼り付けます。
    const nekomimi_size = faceWidth * 0.33;
    const nekohana_size = faceWidth;
    context.save();

    context.translate(leftEyebrow.x, leftEyebrow.y);
    context.rotate(faceLean);

    context.drawImage(nekomimiLeftImage, -(nekomimi_size), -70, nekomimi_size, nekomimi_size);

    context.translate(rightEyebrow.x - leftEyebrow.x, 0);

    context.drawImage(nekomimiRightImage, 0, -70, nekomimi_size, nekomimi_size);

    context.restore();

    context.save();

    context.translate(noseTop.x, noseTop.y);
    context.rotate(faceLean);

    context.drawImage(nekohanaImage, -(nekohana_size / 2), -20, nekohana_size, 40);

    context.restore();
  }

  // formに加工した画像のデータを受け渡します。
  inputFile1.value = canvasArray[0].toDataURL("image/jpeg");
  inputFile2.value = canvasArray[1].toDataURL("image/jpeg");
  inputFile3.value = canvasArray[2].toDataURL("image/jpeg");

  // 全ての処理が終わってから、formを動かします。
  submitForm();
}

// 顔が検出されなかった場合の処理です。
function noFace() {
  // messageをno faceにして、サーバーに顔が検出されなかったことを知らせます。
  message.value = "no face";

  submitForm();
}

// 感情が足りなかった場合の処理です。
function lessEmotion(value) {
  // messageをless emotionにして、サーバーに感情が足りなかったことを知らせます。
  message.value = "less emotion";
  // 表示する感情の値は、四捨五入で整数にしています。
  emotionValue.value = Math.round(value_convert(value) * 100);

  submitForm();
}

// 全員の感情の平均値を計算します。
function averageEmotionOf(faceData) {
  var average = 0;

  for (let i = 0; i < faceData.length; i++) {
    average += value_convert(faceData[i]["expressions"][emotion]) / faceData.length;
  }

  return average;
}

// 全員の感情の中で最小の値を計算します。
function minEmotionOf(faceData) {
  return Math.min(...faceData.map((data) => value_convert(data["expressions"][emotion])));
}

// 全員の感情の中で最大の値を計算します。
function maxEmotionOf(faceData) {
  return Math.max(...faceData.map((data) => value_convert(data["expressions"][emotion])));
}

// face-apiから得られた感情の数値をいい感じに調節します。
function value_convert(x) {
  return Math.max(x / 2, 10 * x - 9.2, 3000 * x - 2999);
}

// 指定された感情に対し、あご先に貼り付ける文章中の感情の名前を提供します。
function expressionName() {
  switch (emotion) {
    case "angry":
      return "いかり";
    case "disgusted":
      return "うんざり";
    case "fearful":
      return "きょうふ";
    case "happy":
      return "えがお";
    case "neutral":
      return "まがお";
    case "sad":
      return "かなしみ";
    case "surprised":
      return "おどろき";
    default:
      return "";
  }
}

// あご先に貼り付ける文章を作ります。
// こっちでは数値を切り捨てにしています。めざせ100％！
function emotionText(faceData) {
  const emotionValue = Math.floor(value_convert(faceData["expressions"][emotion]) * 100);

  // ${}の中に変数や関数を書くことで、その値を文字列中に取り込むことができます。
  return `${expressionName()} ${emotionValue}%`;
}

// 画像を読み込むための関数です。
async function loadImage(imgUrl) {
  var img = null;
  var promise = new Promise(function (resolve) {
    img = new Image();
    img.onload = function () {
      resolve();
    };
    img.src = imgUrl;
  });
  await promise;
  return img;
}
