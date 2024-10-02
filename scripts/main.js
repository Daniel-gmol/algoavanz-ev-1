let isFile1Uploaded = false;
let isFile2Uploaded = false;

function validateFile(file) {
  if (!file) return false;
  const fileName = file.name;
  const fileExtension = fileName.split(".").pop().toLowerCase();

  if (fileExtension !== "txt") {
    alert("Please upload a .txt file");
    return false;
  }

  console.log("File uploaded successfully");
  return true;
}

function showText(file, textAreaId) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    document.getElementById(textAreaId).textContent = text;
  };

  reader.onerror = function (e) {
    alert("File error");
  };

  reader.readAsText(file);
}

function handleFileUpload(event, textAreaId) {
  const file = event.target.files[0];

  if (!validateFile(file)) return;

  showText(file, textAreaId);

  if (event.target.id === "upload-text-file-1") {
    isFile1Uploaded = true;
  } else if (event.target.id === "upload-text-file-2") {
    isFile2Uploaded = true;
  }

  checkUploadStatus();
}

function checkUploadStatus() {
  const submitButton = document.getElementById("similarity-button");
  if (isFile1Uploaded && isFile2Uploaded) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }

  const palindromeButton = document.getElementById("palindrome-button");
  const searchButton = document.getElementById("search-button");
  const forwardButton = document.getElementById("forward-button");
  const backwardButton = document.getElementById("backward-button");
  if (isFile1Uploaded) {
    palindromeButton.disabled = false;
    searchButton.disabled = false;
    forwardButton.disabled = false;
    backwardButton.disabled = false;
  }
}

document
  .getElementById("upload-text-file-1")
  .addEventListener("change", function (event) {
    handleFileUpload(event, "display-text-file-1");
  });

document
  .getElementById("upload-text-file-2")
  .addEventListener("change", function (event) {
    handleFileUpload(event, "display-text-file-2");
  });

function cleanTextArea(textAreaId) {
  const textArea = document.getElementById(textAreaId);
  const cleanText = textArea.innerText;
  textArea.textContent = cleanText;
}
  }
}

function selectRandom(text) {
    const words = text.split(" ");
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function highlightRandom(){
    cleanTextArea("display-text-file-1");
    const textArea = document.getElementById("display-text-file-1");
    const textContent = textArea.textContent;
    const randomWord = selectRandom(textContent);
    const startIndex = textContent.indexOf(randomWord);
    const endIndex = startIndex + randomWord.length;
    const highlightedText =
      textContent.substring(0, startIndex) +
      "<mark style='background-color: #FFFFF'>" +
      randomWord +
      "</mark>" +
      textContent.substring(endIndex);
    textArea.innerHTML = highlightedText;
}

