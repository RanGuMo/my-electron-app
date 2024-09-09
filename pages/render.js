// 可以不用写const btn = document.getElementById('btn')
btn.addEventListener("click", () => {
  console.log(myNodeVersion.version);
  document.body.innerHTML += `<h2>${myNodeVersion.version}</h2>`;
});

const btn2 = document.getElementById("btn2");
const content = document.getElementById("content");
btn2.addEventListener("click", () => {
  console.log(content.value);
  myAPI.saveFile(content.value);
});

const btn3 = document.getElementById("btn3");
btn3.addEventListener("click", async () => {
  let data = await myAPI.readFile();
  document.body.innerHTML += `<h2>${data}</h2>`;
});

window.onload = () => {
  myAPI.getMessage(logMessage);
};

function logMessage(event, str) {
  console.log(event, str);
  alert(str);
}

// 屏幕录制
const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')
const video = document.querySelector("video");
startButton.addEventListener('click', () => {
  navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: {
      width: 320,
      height: 240,
      frameRate: 30
    }
  }).then(stream => {
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }).catch(e => console.log(e))
})

stopButton.addEventListener('click', () => {
  video.pause()
})

