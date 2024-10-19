// #region Text-Upload-Logic
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

  if (!validateFile(file)) {
    event.target.value = "";
    return;
  }

  //make visible the uploaded text
  showText(file, textAreaId);

  if (event.target.id === "upload-text-file-1") {
    isFile1Uploaded = true;
  } else if (event.target.id === "upload-text-file-2") {
    isFile2Uploaded = true;
  }

  //Enable/Disable Button on text uploads
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
// #endregion

// #region Auxiliar-Functions
function cleanTextArea(textAreaId) {
  const textArea = document.getElementById(textAreaId);
  const cleanText = textArea.innerText; //gets text without html modifications e.g. highlights
  textArea.textContent = cleanText;
}
// #endregion

// #region SIMILARITY

document
  .getElementById("similarity-button")
  .addEventListener("click", findSimilarity2);

function findSimilarity() {
  const textArea1 = document.getElementById("display-text-file-1");
  const textArea2 = document.getElementById("display-text-file-2");
  const textContent1 = textArea1.textContent.trim();
  const textContent2 = textArea2.textContent.trim();

  const n = textContent1.length;
  const m = textContent2.length;

  // Create DP table with (n+1)x(m+1) dimensions
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(""));

  // Fill DP table to find the longest common subsequence
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      //console.log("j:", j);
      //console.log("textContent1[i - 1]:", textContent1[i - 1]);
      if (textContent1[i - 1] === textContent2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + textContent1[i - 1]; // Concatenate the matching character
        //console.log("dp[i][j]:", dp[i][j]);
      } else {
        dp[i][j] =
          dp[i - 1][j].length > dp[i][j - 1].length
            ? dp[i - 1][j]
            : dp[i][j - 1];
      }
    }
  }

  // The longest common subsequence is in dp[n][m]
  const longestCommonSubsequence = dp[n][m];
  console.log("longestCommonSubsequence:", longestCommonSubsequence);
  console.log(dp[n][m]);

  // Find start index of LCS in textContent1
  const startIndex1 = textContent1.indexOf(longestCommonSubsequence);
  const endIndex1 = startIndex1 + longestCommonSubsequence.length;

  // Find start index of LCS in textContent2
  const startIndex2 = textContent2.indexOf(longestCommonSubsequence);
  const endIndex2 = startIndex2 + longestCommonSubsequence.length;

  // Highlight the LCS in textContent1
  console.log("textContent1:", textContent1);
  const highlightedText1 =
    textContent1.substring(0, startIndex1) +
    "<mark class='highlight highlight-blue'>" +
    longestCommonSubsequence +
    "</mark>" +
    textContent1.substring(endIndex1);

  // Update the textarea with highlighted text
  textArea1.innerHTML = highlightedText1;

  console.log("textContent2:", textContent2);
  const highlightedText2 =
    textContent2.substring(0, startIndex2) +
    "<mark class='highlight highlight-blue'>" +
    longestCommonSubsequence +
    "</mark>" +
    textContent2.substring(endIndex2);

  textArea2.innerHTML = highlightedText2;
}

function findSimilarity2() {
  const textArea1 = document.getElementById("display-text-file-1");
  const textArea2 = document.getElementById("display-text-file-2");
  const textContent1 = textArea1.textContent.trim();
  const textContent2 = textArea2.textContent.trim();

  const n = textContent1.length;
  const m = textContent2.length;

  let maxLength = 0;
  let endIndex1 = 0;
  let endIndex2 = 0;

  // Create DP table with (n+1)x(m+1) dimensions
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  // Fill DP table to find the longest common subsequence
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (textContent1[i - 1] === textContent2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > maxLength) {
          maxLength = dp[i][j];
          endIndex1 = i;
          endIndex2 = j;
        }
      } else {
        dp[i][j] = 0;
      }
    }
  }

  let longestCommonSubstring1 = textContent1.slice(
    endIndex1 - maxLength,
    endIndex1
  );
  let longestCommonSubstring2 = textContent2.slice(
    endIndex2 - maxLength,
    endIndex2
  );

  // Highlight the LCS in textContent1
  const highlightedText1 =
    textContent1.substring(0, endIndex1 - maxLength) +
    "<mark class='highlight highlight-blue'>" +
    longestCommonSubstring1  +
    "</mark>" +
    textContent1.substring(endIndex1);

  // Update the textarea with highlighted text
  textArea1.innerHTML = highlightedText1;

  const highlightedText2 =
    textContent2.substring(0, endIndex2 - maxLength) +
    "<mark class='highlight highlight-blue'>" +
    longestCommonSubstring2 +
    "</mark>" +
    textContent2.substring(endIndex2);

  textArea2.innerHTML = highlightedText2;
}

// #endregion

// #region PALINDROMES
function highlightPalindrome() {
  cleanTextArea("display-text-file-1");
  cleanTextArea("display-text-file-2");

  const textArea = document.getElementById("display-text-file-1");
  const text = textArea.textContent;

  const longestPalindrome = findLongestPalindrome(text);

  const startIndex = text.indexOf(longestPalindrome); //TODO: replace by Z or kmp
  // TODO: create for loop to find all end indices associated to all start indices and then highlight
  const endIndex = startIndex + longestPalindrome.length;
  const highlightedText =
    text.substring(0, startIndex) +
    "<mark class='highlight'>" +
    longestPalindrome +
    "</mark>" +
    text.substring(endIndex);

  textArea.innerHTML = highlightedText;
}

document
  .getElementById("palindrome-button")
  .addEventListener("click", highlightPalindrome);

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
// #endregion

// #region SEARCH
function pi_arr(P) {
  const m = P.length;
  let pi = new Array(m).fill(0);
  let k = 0;
  for (let q = 1; q < m; q++) {
    while (k > 0 && P[k] != P[q]) {
      k = pi[k - 1];
    }
    if (P[k] == P[q]) {
      k++;
    }
    pi[q] = k;
  }
  for (let i = 0; i < m; i++) {
    //console.log(pi[i]);
  }
  return pi;
}

function kmp(T, P) {
  const n = T.length;
  const m = P.length;
  let pos = new Array();
  let pi = pi_arr(P);
  let q = 0;
  for (let i = 0; i < n; i++) {
    while (q > 0 && P[q] != T[i]) {
      q = pi[q - 1];
    }
    if (P[q] == T[i]) {
      q++;
    }
    if (q == m) {
      //console.log("Pattern occurs with shift " + (i - m + 1));
      pos.push(i - m + 1);
      q = pi[q - 1];
    }
  }
  return pos;
}

let matches = [];
let currentIndex = -1;
function highlightSearch() {
  cleanTextArea("display-text-file-1");
  cleanTextArea("display-text-file-2");

  const textArea = document.getElementById("display-text-file-1");
  const text = textArea.textContent;

  const pattern = document.getElementById("search-input").value;
  const plen = pattern.length;

  const positions = kmp(text, pattern);
  matches = positions;
  currentIndex = positions.length > 0 ? 0 : -1;

  let lastPos = 0;
  let highlightedText = "";
  for (const pos of positions) {
    highlightedText += text.substring(lastPos, pos);
    highlightedText +=
      "<mark class='highlight highlight-yellow'>" +
      text.substring(pos, pos + plen) +
      "</mark>";
    lastPos = pos + plen;
  }
  highlightedText += text.substring(lastPos);
  textArea.innerHTML = highlightedText;

  selectCurrentMatch();
}

function selectCurrentMatch() {
  const textArea = document.getElementById("display-text-file-1");

  const markElements = textArea.getElementsByTagName("mark");

  for (const mark of markElements) {
    mark.classList.remove("current-highlight");
  }

  const matchesLen = matches.length;
  const marksLen = markElements.length;
  if (marksLen < matchesLen || marksLen > matchesLen || marksLen === 0) {
    return;
  }

  if (
    markElements[currentIndex].classList.value != "highlight highlight-yellow"
  ) {
    return;
  }

  if (currentIndex >= 0 && currentIndex < matches.length) {
    markElements[currentIndex].classList.add("current-highlight");
  }
}

function moveForward() {
  if (currentIndex < matches.length - 1) {
    currentIndex++;
    selectCurrentMatch();
    updateButtonStates();
  }
}

function moveBackward() {
  if (currentIndex > 0) {
    currentIndex--;
    selectCurrentMatch();
    updateButtonStates();
  }
}

function updateButtonStates() {
  document.getElementById("forward-button").disabled =
    currentIndex >= matches.length - 1;
  document.getElementById("backward-button").disabled = currentIndex <= 0;
}

document
  .getElementById("search-input")
  .addEventListener("keydown", function (event) {
    const searchButton = document.getElementById("search-button");
    if (event.key === "Enter") {
      event.preventDefault();

      searchButton.click();
    }
  });

document
  .getElementById("search-button")
  .addEventListener("click", highlightSearch);

document
  .getElementById("forward-button")
  .addEventListener("click", moveForward);
document
  .getElementById("backward-button")
  .addEventListener("click", moveBackward);
// #endregion

// #region TRIES

// Declaring the autocomplete textbox and its functionality
document
  .getElementById("autocomplete-input")
  .addEventListener("input", autocomplete);

// Defining Trie data structure
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

// Defining the Trie class that uses the TrieNode class for creating and connecting nodes
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Function to insert a word into the trie
  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // Function to get all words with the given prefix
  autocomplete(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return this.findAllWordsFromNode(node, prefix);
  }

  findAllWordsFromNode(node, prefix) {
    let words = [];
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    for (let char in node.children) {
      words = words.concat(
        this.findAllWordsFromNode(node.children[char], prefix + char)
      );
    }
    return words;
  }
}

function autocomplete() {
  // We get the text from the first upoaded file
  const textArea = document.getElementById("display-text-file-1");
  const textContent = textArea.textContent;

  // Create a new trie
  const trie = new Trie();

  // Insert all words into the trie
  const words = textContent.split(/\s+/);
  for (let word of words) {
    //clean word to only allow unicode letters and numbers
    const cleanWord = word.replace(/[^\p{L}\p{N}]/gu, "");

    if (cleanWord) {
      trie.insert(cleanWord);
    }
  }

  // Clear the suggestion list
  const suggestionList = document.getElementById("suggestions-list");
  suggestionList.innerHTML = "";

  // Get the prefix to autocomplete
  const prefix = document.getElementById("autocomplete-input").value;

  // If the prefix is empty, return
  if (prefix === "") {
    return;
  }

  // Call the autocomplete function to get suggestions
  const suggestions = trie.autocomplete(prefix);

  // Display suggestions
  suggestions.forEach((suggestion) => {
    const suggestionItem = document.createElement("li");
    suggestionItem.classList.add("suggestion-element");
    suggestionItem.textContent = suggestion;
    suggestionItem.addEventListener("click", function () {
      document.getElementById("autocomplete-input").value = suggestion;
      suggestionList.innerHTML = "";
    });
    suggestionList.appendChild(suggestionItem);
  });
}
// #endregion
