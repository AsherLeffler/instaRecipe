let filters = [];
let ingredientList = [];
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.display = "block";
  const logoBtn = document.getElementById("logoBtn");
  const menuIcon = document.querySelector(".menu__icon");
  const menuBars = document.querySelectorAll(".bar");
  const dropDownMenu = document.getElementById("drop-menu");
  const filterDisplay = document.querySelector(".filterDisplay");
  const filterInput = document.getElementById("ingredientInput");
  const searchBar = document.getElementById("searchBar");
  let btnActive;
  logoBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  menuIcon.addEventListener("click", () => {
    if (btnActive) {
      menuIcon.classList.remove("menu__icon-active");
      for (let index = 0; index < menuBars.length; index++) {
        menuBars[index].classList.remove("span-active");
      }
      dropDownMenu.classList.remove("show-menu");
      btnActive = false;
    } else {
      menuIcon.classList.add("menu__icon-active");
      for (let index = 0; index < menuBars.length; index++) {
        menuBars[index].classList.add("span-active");
      }
      dropDownMenu.classList.add("show-menu");
      btnActive = true;
    }
  });
  const validHealthPreferences = [
    "alcohol-free",
    "celery-free",
    "crustacean-free",
    "dairy-free",
    "egg-free",
    "fish-free",
    "gluten-free",
    "keto-friendly",
    "kidney-friendly",
    "kosher",
    "low-potassium",
    "lupine-free",
    "mustard-free",
    "no-oil-added",
    "low-sugar",
    "paleo",
    "peanut-free",
    "pescatarian",
    "pork-free",
    "red-meat-free",
    "sesame-free",
    "shellfish-free",
    "soy-free",
    "sugar-conscious",
    "tree-nut-free",
    "vegan",
    "vegetarian",
    "wheat-free",
  ];
  filterInput.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
      filterInput.value = filterInput.value.trim().toLowerCase();
      if (filterInput.value.includes(" ")) {
        filterInput.value = filterInput.value.replace(/ /g, "-");
      }
      if (validHealthPreferences.includes(filterInput.value)) {
        filterInput.value = filterInput.value.trim().toLowerCase();
        const existingFilters = document.querySelectorAll(".filter");
        for (let index = 0; index < existingFilters.length; index++) {
          filterDisplay.removeChild(existingFilters[index]);
        }
        filters.push(filterInput.value);
        filters.forEach((element) => {
          const newFilter = document.createElement("div");
          const newFilterText = document.createElement("p");
          newFilterText.textContent = `${
            element.charAt(0).toUpperCase() + element.slice(1)
          }`;
          newFilter.classList.add("filter");
          newFilterText.classList.add("filterText");
          newFilter.addEventListener("click", () => {
            const filterIndex = filters.indexOf(element);
            if (filterIndex > -1) {
              filters.splice(filterIndex, 1);
            }
            filterDisplay.removeChild(newFilter);
            adjustFilterDisplayHeight();
          });
          filterDisplay.appendChild(newFilter);
          newFilter.appendChild(newFilterText);
          adjustFilterDisplayHeight();
        });
        document.getElementById("ingredientInput").value = "";
      } else {
        document.getElementById("ingredientInput").value =
          "Health Preference Not Valid";
        document.getElementById("ingredientInput").style.color = "red";
        document.getElementById("ingredientInput").style.fontWeight = "bolder";
        document
          .getElementById("ingredientInput")
          .setAttribute("readonly", true);
        setTimeout(() => {
          document.getElementById("ingredientInput").value = "";
          document.getElementById("ingredientInput").style.color = "black";
          document.getElementById("ingredientInput").style.fontWeight =
            "normal";
          document
            .getElementById("ingredientInput")
            .removeAttribute("readonly");
        }, 1500);
      }
    }
  });
  function adjustFilterDisplayHeight() {
    filterDisplay.style.height =
      filterDisplay.children.length > 0 ? "auto" : "20px";
  }
  searchBar.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
      ingredientList.push(searchBar.value);
      searchBar.value = "";
      console.log(ingredientList);
      fetchData();
    }
  });
  const supportBtn = document.querySelector(".supportBtn");
  const supportDisplay = document.getElementById("supportDisplay");
  supportBtn.addEventListener("click", () => {
    supportBtn.classList.add("supportBtn-hide");
    setTimeout(() => {
      supportDisplay.classList.add("supportDisplay-show");
    }, 300);
  });
  const exitBtn = document.getElementById("exitBtn");
  exitBtn.addEventListener("click", () => {
    supportDisplay.classList.remove("supportDisplay-show");
    setTimeout(() => {
      supportBtn.classList.remove("supportBtn-hide");
    }, 600);
  });
});
async function fetchData() {
  const foodDisplay = document.getElementById("recipeDisplay");
  const appId = "cd6a87b1";
  const appKey = "63d58ed004536094bcb086991363deb1";
  const from = 0;
  const to = 60;
  const foodItems = document.querySelectorAll(".placeholder-box");
  for (let index = 0; index < foodItems.length; index++) {
    foodDisplay.removeChild(foodItems[index]);
  }
  try {
    const foodBoxs = [];
    const query = ingredientList.join(",");
    let healthPreference = filters[0];
    const response = await fetch(
      `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}${
        healthPreference ? `&health=${healthPreference}` : ""
      }&from=${from}&to=${to}`
    );
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();
    for (let index = 0; index < data.hits.length; index++) {
      foodBoxs.push(data.hits[index].recipe);
      const foodItem = document.createElement("div");
      const foodName = document.createElement("h1");
      const foodImg = document.createElement("img");
      const recipeIngredientsList = document.createElement("ul");
      const foodRecipeUrl = document.createElement("a");
      const br = document.createElement("br");
      foodName.textContent = `${data.hits[index].recipe.label}`;
      foodImg.setAttribute("src", data.hits[index].recipe.image);
      foodImg.setAttribute("alt", `Image of ${data.hits[index].recipe.label}`);
      foodRecipeUrl.setAttribute("href", data.hits[index].recipe.url);
      foodRecipeUrl.textContent = "Recipe";
      foodRecipeUrl.classList.add("recipe-url");
      foodImg.classList.add("foodImg");
      foodItem.classList.add("placeholder-box");
      foodName.classList.add("foodName");
      recipeIngredientsList.classList.add("ingredientsList");
      foodDisplay.appendChild(foodItem);
      foodItem.appendChild(foodName);
      foodItem.appendChild(foodImg);
      foodItem.appendChild(recipeIngredientsList);
      for (let i = 0; i < data.hits[index].recipe.ingredients.length; i++) {
        const recipeIngredients = document.createElement("li");
        recipeIngredients.textContent =
          data.hits[index].recipe.ingredients[i].food;
        recipeIngredients.classList.add("listIngredient");
        recipeIngredientsList.appendChild(recipeIngredients);
      }
      foodItem.appendChild(br);
      foodItem.appendChild(foodRecipeUrl);
    }
    console.log(foodBoxs);
    document.getElementById("searchBar").value = "";
    ingredientList = [];
  } catch (error) {
    console.error(error);
  }
}
function formSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("msgForm");
  const formCont = document.getElementById("formCont");
  const formData = new FormData(form);
  fetch("https://formspree.io/f/mdknglzj", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        formCont.removeChild(form);
        const formSubmitTitle = document.createElement("h2");
        const formSubmitDiv = document.createElement("div");
        const formSubmitImg = document.createElement("img");
        formSubmitTitle.textContent = "Thank You! We will reply shortly.";
        formSubmitImg.setAttribute("src", "/images/formSubmit.png");
        formSubmitTitle.classList.add("formSubmitTitle");
        formSubmitImg.classList.add("formSubmitImg");
        formSubmitDiv.classList.add("formSubmitDiv");
        formCont.appendChild(formSubmitDiv);
        formSubmitDiv.appendChild(formSubmitTitle);
        formSubmitDiv.appendChild(formSubmitImg);
      } else {
        alert("There was a problem with the form submission.");
      }
    })
    .catch((error) => {
      console.error("Form submission error:", error);
      alert("There was a problem with the form submission.");
    });
}

function updateMsg() {
  const msgType = document.getElementById("msg-type");
  const selectedValue = msgType.options[msgType.selectedIndex].text;
  const response =
    selectedValue == "Help"
      ? "Please describe your issue"
      : "Please enter your suggestion";
  const labelElement = document.getElementById("msgType");
  labelElement.textContent = response + ":";
}
