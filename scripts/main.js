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

function highlightPalindome() {
  cleanTextArea("display-text-file-1");
  const textArea = document.getElementById("display-text-file-1");
  const textContent = textArea.textContent;
  const longestPalindrome = findLongestPalindrome(textContent);
  const startIndex = textContent.indexOf(longestPalindrome); //TODO: replace by Z or kmp
  // TODO: create for loop to find all end indices associated to all start indices and then highlight
  const endIndex = startIndex + longestPalindrome.length;
  const highlightedText =
    textContent.substring(0, startIndex) +
    "<mark style='background-color: #4CE45A'>" +
    longestPalindrome +
    "</mark>" +
    textContent.substring(endIndex);
  textArea.innerHTML = highlightedText;
}

document
  .getElementById("palindrome-button")
  .addEventListener("click", highlightPalindome);

//TODO: review algorithm
//Manacher's Algorithm
function findLongestPalindrome(s) {
  // Transform the string to avoid even/odd length issues
  let t = "#";
  for (let i = 0; i < s.length; i++) {
    t += s[i] + "#";
  }

  const n = t.length;
  const p = new Array(n).fill(0);
  let c = 0,
    r = 0; // current center and right edge

  for (let i = 0; i < n; i++) {
    const mirr = 2 * c - i; // mirror of i with respect to center c

    if (i < r) {
      p[i] = Math.min(r - i, p[mirr]);
    }

    // Expand around center i
    while (
      i + p[i] + 1 < n &&
      i - p[i] - 1 >= 0 &&
      t[i + p[i] + 1] === t[i - p[i] - 1]
    ) {
      p[i]++;
    }

    // Update center and right edge
    if (i + p[i] > r) {
      c = i;
      r = i + p[i];
    }
  }

  // Find the maximum element in p
  let maxLen = 0;
  let centerIndex = 0;
  for (let i = 0; i < n; i++) {
    if (p[i] > maxLen) {
      maxLen = p[i];
      centerIndex = i;
    }
  }

  // Extract the longest palindrome
  const start = (centerIndex - maxLen) / 2;
  return s.substring(start, start + maxLen);
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

//TODO: change to search button, add search functionality and add all the other functionalities
document.getElementById("search-button").addEventListener("click", highlightRandom);
