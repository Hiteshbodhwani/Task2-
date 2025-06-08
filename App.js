// First i made a container where all the products will be there 
const productBox = document.getElementById("productContainer");
let allItems = [];

// i made a function that fetches date from API
async function getProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=15");
    const result = await response.json();
    allItems = result.products;
    showProducts(allItems);
  } catch (error) {
    console.log("Failed to fetch products", error);
  }
}

// Then i made a function that help us to show the products 
// on screen i shows details of the products
function showProducts(productList) {
  productBox.innerHTML = "";

  for (let i = 0; i < productList.length; i++) {
    let product = productList[i];
    let card = document.createElement("div");
    card.className = "product-card";

    let discountPrice = (
      product.price - (product.price * product.discountPercentage) / 100
    ).toFixed(2);

    card.innerHTML = `
      <img src="${product.thumbnail}" />
      <h4>${product.title}</h4>
      <p><del>Rs.${product.price}</del> <strong>Rs. ${discountPrice}</strong></p>
      <p>${"⭐".repeat(Math.round(product.rating))}</p>
      <button onclick="showOrHideDescription(this)">Show Description</button>
      <div style="display:none;">${product.description}</div>
    `;

    productBox.appendChild(card);
  }
}

// this function helps with the description like if u want to see 
// the description or hide it
function showOrHideDescription(button) {
  const descBox = button.nextElementSibling;
  if (descBox.style.display === "none") {
    descBox.style.display = "block";
    button.textContent = "Hide Description";
  } else {
    descBox.style.display = "none";
    button.textContent = "Show Description";
  }
}

// thus function will sort the product based on rating and price
function sortItems(orderType) {
  let newList = [...allItems];

  if (orderType === "low-high") {
    newList.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (orderType === "high-low") {
    newList.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (orderType === "rating") {
    newList.sort(function (a, b) {
      return b.rating - a.rating;
    });
  }

  showProducts(newList);
}

// this function handles the search bar based on the value
async function searchItems() {
  try {
    const searchText = document.getElementById("searchInput").value;
    const response = await fetch(`https://dummyjson.com/products/search?q=${searchText}`);
    const result = await response.json();
    showProducts(result.products);
  } catch (error) {
    console.log("Search failed", error);
  }
}

// it clears the text written in searchBox and displays all the 
// data again as if it gets back to normal
function clearSearchBox() {
  document.getElementById("searchInput").value = "";
  showProducts(allItems);
}

// in this radio buttons are there through which we can 
// get the date based on categories
// as on Api few categories are empty so it won't display anything
async function getCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    const categories = await response.json();
    const catBox = document.getElementById("categoriesContainer");
    catBox.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {
      let catName = typeof categories[i] === "string" ? categories[i] : categories[i].name;

      let radioBtn = document.createElement("input");
      radioBtn.type = "radio";
      radioBtn.name = "category";
      radioBtn.value = catName;
      radioBtn.onclick = function () {
        loadByCategory(catName);
      };

      catBox.appendChild(radioBtn);
      catBox.appendChild(document.createTextNode(" " + catName));
      catBox.appendChild(document.createElement("br"));
    }
  } catch (error) {
    console.log("Failed to load categories", error);
  }
}

//this function will help to display products based on category 
// that we have selected above
async function loadByCategory(cat) {
  try {
    const response = await fetch(`https://dummyjson.com/products/category/${cat}`);
    const result = await response.json();
    showProducts(result.products);
  } catch (error) {
    console.log("Category load failed", error);
  }
}

// this button will clear all the categories 
// and display all the products that were below 
function clearAllCategories() {
  document.getElementById("categoriesContainer").innerHTML = "";
  showProducts(allItems);
}

// we'll have to run both these functions 
// one will display all the products on screen 
// second will display on the basis of category 
getProducts();
getCategories();


