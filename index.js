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
      dropDownMenu.classList.replace("show-menu", "hide-menu");
      btnActive = false;
    } else {
      menuIcon.classList.add("menu__icon-active");
      for (let index = 0; index < menuBars.length; index++) {
        menuBars[index].classList.add("span-active");
      }
      dropDownMenu.classList.replace("hide-menu", "show-menu");
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
          });
          filterDisplay.appendChild(newFilter);
          newFilter.appendChild(newFilterText);
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
  searchBar.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
      ingredientList.push(searchBar.value);
      searchBar.value = "";
      console.log(ingredientList);
    }
  });
});
async function fetchData() {
  const foodDisplay = document.getElementById("recipeDisplay");
  const appId = "cd6a87b1";
  const appKey = "63d58ed004536094bcb086991363deb1";
  const from = 0;
  const to = 48;
  const foodItems = document.querySelectorAll(".placeholder-box");
  for (let index = 0; index < foodItems.length; index++) {
    foodDisplay.removeChild(foodItems[index]);
  }
  try {
    const foodBoxs = [];
    const query = ingredientList.join(",");
    let healthPreference = filters[0];
    const response = await fetch(`https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${appId}&app_key=${appKey}${healthPreference ? `&health=${healthPreference}` : ""}&from=${from}&to=${to}`);
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
        recipeIngredients.textContent = data.hits[index].recipe.ingredients[i].food;
        recipeIngredients.classList.add('listIngredient');
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