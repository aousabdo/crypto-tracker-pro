// Test JavaScript functionality
console.log("JavaScript is working!");

// Test fetch API
fetch('/api/bitcoin')
  .then(response => response.json())
  .then(data => {
    console.log("API Response:", data);
  })
  .catch(error => {
    console.error("API Error:", error);
  });