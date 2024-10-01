function validateFile(event) {
  const file = event.target.files[0];
  if (file) {
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    if (fileExtension !== "txt") {
      alert("Please upload a .txt file");
      event.target.value = "";
    } else {
      console.log("File uploaded successfully");
    }
  }
}

function showText(event, textArea) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      document.getElementById(textArea).textContent = text;
    };
    reader.readAsText(file);
  }
}

document.getElementById("upload-text-file-1").addEventListener("change", validateFile);
document.getElementById("upload-text-file-2").addEventListener("change", validateFile);

document.getElementById("upload-text-file-1").addEventListener("change", function (event) {
  showText(event, "display-text-file-1");
});
document.getElementById("upload-text-file-2").addEventListener("change", function (event) {
  showText(event, "display-text-file-2");
});
