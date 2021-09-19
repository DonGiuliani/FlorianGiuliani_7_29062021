class ViewMainPage extends AbstractView {

    renderRecipesPage(recipes, ingredients, appliances, ustensils) {
        let content = `
        <header id="header">
            <img id="logo" src="Images/logo_les_petits_plats.png" alt="logo les petits plats">
        </header>
        
        <div id="search__bar">
            <input id="search__input" type="search" autocomplete="off" value="" placeholder="Rechercher un ingrédient, appareil, ustensiles ou une recette">
        </div>

        <div id="div__tags">
        </div>

        <nav id="filters">
            <ul class="filter" id="list__ingredients">
                <li id="filter__ingredients">
                    Ingrédients
                    <i class="fas fa-chevron-down"></i>
                </li>
                <div id="search__bar__ingredient" class="filter__search__bar">
                    <input id="search__ingredient" type="search" autocomplete="off" placeholder="Recherche un ingrédient">
                    <i class="fas fa-chevron-up"></i>
                </div>
                <ul id="array__ingredients__filter" class="list">
                    ${this.renderListFilter(ingredients)}
                </ul>
            </ul>

            <ul class="filter" id="list__appliances">
                <li id="filter__appliances">
                    Appareils
                    <i class="fas fa-chevron-down"></i>
                </li>
                <div id="search__bar__appliance" class="filter__search__bar">
                    <input id="search__appliance" type="search" autocomplete="off" placeholder="Recherche un appareil">
                    <i class="fas fa-chevron-up"></i>
                </div>
                <ul id="array__appliances__filter" class="list">
                    ${this.renderListFilter(appliances)}
                </ul>
            </ul>

            <ul class="filter" id="list__ustensils">
                <li id="filter__ustensils">
                    Ustensiles
                    <i class="fas fa-chevron-down"></i>
                </li>
                <div id="search__bar__ustensil" class="filter__search__bar">
                    <input id="search__ustensil" type="search" autocomplete="off" placeholder="Recherche un ustensile">
                    <i class="fas fa-chevron-up"></i>
                </div>
                <ul id="array__ustensils__filter" class="list">
                    ${this.renderListFilter(ustensils)}
                </ul>
            </ul>
        </nav>

        <div id="recipes__list">
            ${this.renderRecipes(recipes)}
        </div>
        `;

        this.display(content);
        this.getValueFromMainSearchBar();
        this.transformFilterIntoSearchBar();
        this.getValueFromFiltersSearchBar(ingredients, appliances, ustensils);
        this.initClickOnFilter(ingredients, appliances, ustensils);
    }

    /*-------------------------------
    Crée une liste de filtres en HTML
    ------------------------------- */
    renderListFilter(filter) {
        let content = ``;
        for(let i = 0; i < filter.length; i++) {
            content += `
            <li id="${filter[i]}" class="submenu" title="${filter[i]}">
                <p>
                    ${filter[i]}
                </p>
            </li>
            `;
        }
        return content;
    }

    hideFilters(dom, arrayFiltered) {
        let childrenDom = dom.children;
        for(let child of childrenDom) {
            if(!arrayFiltered.includes(child.id)) {
                child.style.display = "none";
            } else {
                child.style.display = "flex";
            }
        }
    }

    /*----------------------
    Crée une recette en HTML
    ----------------------*/
    renderRecipes(recipes) {
        let content = ``;
        for(let i = 0; i < recipes.length; i++) {
            let recipe = recipes[i];
            content += `
                <div id="recipe">
                    <div id="image__emplacement">
                    </div>
                    <div id="recipe__header">
                        <h1 class="recipe__title">
                            ${recipe.name}
                        </h1>
                        <p class="recipe__time">
                            <i id="clock__icon" class="far fa-clock"></i>
                            ${recipe.time} min
                        </p>
                    </div>
                    <div id="recipe__body">
                        <p class="recipe__ingredients">
                    `;

                    let ingredients = recipes[i].ingredients;
                    for(let i = 0; i < ingredients.length; i++) {
                        if(ingredients[i].ingredient !== undefined) {
                            content += `
                            ${ingredients[i].ingredient}`;
                        }
                        if(ingredients[i].quantity !== undefined) {
                            content += `: ${ingredients[i].quantity} `;
                        }
                        if(ingredients[i].unit !== undefined) {
                            content += `${ingredients[i].unit}`;
                        }
                        content += `<br />`;
                    }
                    content += `
                        </p>
                        <p class="recipe__description">
                            ${recipe.description.substring(0, 300)} ...
                        </p>
                    </div>
                </div>`;
            }
        return content;
    }

    /*--------------------------------------------------------------------------------------------------------
    Récupère la valeur entrée par l'utilisateur dans la barre de recherche principale et y ajoute un évènement
    --------------------------------------------------------------------------------------------------------*/
    getValueFromMainSearchBar() {
        let mainSearchBar = document.getElementById("search__input");

        mainSearchBar.addEventListener("input", function(event) {
            if(event.target.value.length >= 3) {
                let enteredValue = event.target.value;
                this.renderFilteredRecipesListAlternative(recipes, enteredValue)
            } else if(event.target.value.length == 0) {
                let enteredValue = event.target.value;
                this.renderFilteredRecipesListAlternative(recipes, enteredValue)
            }
        }.bind(this));
    }

    renderFilteredRecipesListAlternative(recipes, enteredValue) {
        let filteredRecipes = [];
        for(let i = 0; i < recipes.length; i++) {
            let recipesName = recipes[i].name;
            let recipesDescription = recipes[i].description;
            let recipesIngredients = recipes[i].ingredients

            if(recipesName.toLowerCase().includes(enteredValue) ||
            recipesDescription.toLowerCase().includes(enteredValue) ||
            recipesIngredients.some(currentArrayIngredients => currentArrayIngredients.ingredient.toLowerCase().includes(enteredValue))
            ) {
                filteredRecipes.push(recipes[i])
            }
        }

        let recipesListDOM = document.getElementById(`recipes__list`);
        recipesListDOM.innerHTML = `${this.renderRecipes(filteredRecipes)}`;
        this.refreshFiltersWithFilteredRecipes(filteredRecipes);

        if(filteredRecipes.length == 0) {
            recipesListDOM.innerHTML = "Aucune recette ne correspond à votre critère… vous pouvez chercher 'tarte aux pommes' , 'poisson' , etc.";
        }
    }

    refreshFiltersWithFilteredRecipes(filteredRecipes) {
        let arrayIngredientsFilter = document.getElementById("array__ingredients__filter");
        let arrayIngredients = [];
        const filteredIngredients = filteredRecipes.filter((recipe) => {
            let currentIngredients = recipe.ingredients;
            for(let currentIngredient of currentIngredients) {
                arrayIngredients.push(currentIngredient.ingredient);
            }
        });
        let arrayIngredientsFiltered = [...new Set(arrayIngredients)];
        this.hideFilters(arrayIngredientsFilter, arrayIngredientsFiltered);

        let arrayAppliancesFilter = document.getElementById("array__appliances__filter");
        let arrayAppliances = [];
        const filteredAppliances = filteredRecipes.filter((recipe) => {
            arrayAppliances.push(recipe.appliance);
        });

        let arrayAppliancesFiltered = [...new Set(arrayAppliances)];
        this.hideFilters(arrayAppliancesFilter, arrayAppliancesFiltered);

        let arrayUstensilsFilter = document.getElementById("array__ustensils__filter");
        let arrayUstensils = [];
        const filteredUstensils = filteredRecipes.filter((recipe) => {
            let currentUstensils = recipe.ustensils;
            for(let currentUstensil of currentUstensils) {
                arrayUstensils.push(currentUstensil);
            }
        });
        let arrayUstensilsFiltered = [...new Set(arrayUstensils)];
        this.hideFilters(arrayUstensilsFilter, arrayUstensilsFiltered);
    }

    /*--------------------------------------------------------------------
    Transforme une div de filtre en barre de recherche de filtre au survol
    --------------------------------------------------------------------*/
    transformFilterIntoSearchBar() {
        /*---------------------------------------------------------------------------
        ----------------------FILTER INGREDIENTS-------------------------------------
        ---------------------------------------------------------------------------*/
        let filterIngredients = document.getElementById("list__ingredients");
        let filterIngredientsTitle = document.getElementById("filter__ingredients");
        let filterIngredientsSearchBar = document.getElementById("search__bar__ingredient");
        let searchBarIngredients = document.getElementById("search__ingredient");

        filterIngredients.addEventListener("mouseenter", function() {
            filterIngredientsTitle.style.display = "none";
            filterIngredientsSearchBar.style.display = "flex";
            searchBarIngredients.style.display = "flex";
        });
        filterIngredients.addEventListener("mouseleave", function() {
            filterIngredientsTitle.style.display = "block";
            filterIngredientsSearchBar.style.display = "none";
        });
        /*---------------------------------------------------------------------------
        ----------------------FILTER APPLIANCES--------------------------------------
        ---------------------------------------------------------------------------*/
        let filterAppliances = document.getElementById("list__appliances");
        let filterAppliancesTitle = document.getElementById("filter__appliances");
        let filterAppliancesSearchBar = document.getElementById("search__bar__appliance");
        let searchBarAppliances = document.getElementById("search__appliance");

        filterAppliances.addEventListener("mouseenter", function() {
            filterAppliancesTitle.style.display = "none";
            filterAppliancesSearchBar.style.display = "flex";
            searchBarAppliances.style.display = "flex";
        });
        filterAppliances.addEventListener("mouseleave", function() {
            filterAppliancesTitle.style.display = "block";
            filterAppliancesSearchBar.style.display = "none";
        });
        /*---------------------------------------------------------------------------
        ----------------------FILTER USTENSILS---------------------------------------
        ---------------------------------------------------------------------------*/
        let filterUstensils = document.getElementById("list__ustensils");
        let filterUstensilsTitle = document.getElementById("filter__ustensils");
        let filterUstensilsSearchBar = document.getElementById("search__bar__ustensil");
        let searchBarUstensils = document.getElementById("search__appliance");

        filterUstensils.addEventListener("mouseenter", function() {
            filterUstensilsTitle.style.display = "none";
            filterUstensilsSearchBar.style.display = "flex";
            searchBarUstensils.style.display = "flex";
        });
        filterUstensils.addEventListener("mouseleave", function() {
            filterUstensilsTitle.style.display = "block";
            filterUstensilsSearchBar.style.display = "none";
        });
    }

    getValueFromFiltersSearchBar(ingredients, appliances, ustensils) {        
        let filterIngredientsSearchBar = document.getElementById("search__ingredient");
        filterIngredientsSearchBar.addEventListener("input", function(event) {
            let enteredValue = event.target.value;
            this.getFilteredIngredientsFilter(ingredients, enteredValue);
        }.bind(this));

        let filterAppliancesSearchBar = document.getElementById("search__appliance");
        filterAppliancesSearchBar.addEventListener("input", function(event) {
            let enteredValue = event.target.value;
            this.getFilteredAppliancesFilter(appliances, enteredValue);
        }.bind(this));

        let filterUstensilsSearchBar = document.getElementById("search__ustensil");
        filterUstensilsSearchBar.addEventListener("input", function(event) {
            let enteredValue = event.target.value;
            this.getFilteredUstensilsFilter(ustensils, enteredValue);
        }.bind(this));
    }

    getFilteredIngredientsFilter(ingredients, enteredValue) {
        const filteredIngredients = ingredients.filter((ingredient) => ingredient.toLowerCase().includes(enteredValue));
        let arrayIngredients = document.getElementById("array__ingredients__filter");
        this.hideFilters(arrayIngredients, filteredIngredients);
    }

    getFilteredAppliancesFilter(appliances, enteredValue) {
        const filteredAppliances = appliances.filter((appliance) => appliance.toLowerCase().includes(enteredValue));
        let arrayAppliances = document.getElementById("array__appliances__filter");
        this.hideFilters(arrayAppliances, filteredAppliances);
    }
    
    getFilteredUstensilsFilter(ustensils, enteredValue) {
        const filteredUstensils = ustensils.filter((ustensil) => ustensil.toLowerCase().includes(enteredValue));
        let arrayUstensils = document.getElementById("array__ustensils__filter");
        this.hideFilters(arrayUstensils, filteredUstensils);
    }

    /*---------------------------------
    Ajoute un évènement sur les filtres
    ---------------------------------*/
    initClickOnFilter(ingredients, appliances, ustensils) {
        this.filtersArray["ingredients"] = [];
        this.filtersArray["appliances"] = [];
        this.filtersArray["ustensils"] = [];

        for(let i = 0; i < ingredients.length; i++) {
            let ingredientFilter = document.getElementById(`${ingredients[i]}`);
            ingredientFilter.addEventListener("click", function() {
                if(!this.filtersArray["ingredients"].includes(ingredients[i])) {
                    this.createNewIngredientTag(ingredients[i]);
                    this.filtersArray["ingredients"].push(ingredients[i]);
                    this.renderRecipesByFilters(recipes, this.filtersArray);
                }
            }.bind(this));
        }

        for(let i = 0; i < appliances.length; i++) {
            let applianceFilter = document.getElementById(`${appliances[i]}`);
            applianceFilter.addEventListener("click", function() {
                if(!this.filtersArray["appliances"].includes(appliances[i])) {
                    this.createNewApplianceTag(appliances[i]);
                    this.filtersArray["appliances"].push(appliances[i]);
                    this.renderRecipesByFilters(recipes, this.filtersArray)
                }
            }.bind(this));
        }

        for(let i = 0; i < ustensils.length; i++) {
            let ustensilFilter = document.getElementById(`${ustensils[i]}`);
            ustensilFilter.addEventListener("click", function() {
                if(!this.filtersArray["ustensils"].includes(ustensils[i])) {
                    this.createNewUstensilTag(ustensils[i]);
                    this.filtersArray["ustensils"].push(ustensils[i]);
                    this.renderRecipesByFilters(recipes, this.filtersArray)
                }
            }.bind(this));
        }
    }

    /*-----------------------------------------------------
    Affiche les recettes filtrées par le tableau de filtres
    -----------------------------------------------------*/
    renderRecipesByFilters(recipes, currentFilters) {
        let recipeList = recipes;

        for(let ingredient of currentFilters["ingredients"]) {
            recipeList = this.filterRecipesByIngredient(recipeList, ingredient);
        }

        for(let appliance of currentFilters["appliances"]) {
            recipeList = this.filterRecipesByAppliance(recipeList, appliance);
        }

        for(let ustensil of currentFilters["ustensils"]) {
            recipeList = this.filterRecipesByUstensil(recipeList, ustensil);
        }

        let recipeListDOM = document.getElementById("recipes__list");
        recipeListDOM.innerHTML = this.renderRecipes(recipeList);

        if(recipeList.length == 0) {
            recipeListDOM.innerHTML = "Aucune recette ne correspond à votre critère… vous pouvez chercher 'tarte aux pommes' , 'poisson' , etc.";
        }
    }

    /*------------------------------------------------------------------
    Filtre les éléments contenus dans le tableau de filtres séléctionnés
    -------------------------------------------------------------------*/
    filterRecipesByIngredient(recipes, ingredient) {
        let listRecipesFilteredByIngredients = [];

        for(let recipe of recipes) {
            let ingredientsRecipesList = recipe.ingredients;
            for(let arrayIngredientRecipe of ingredientsRecipesList) {
                let ingredientRecipe = arrayIngredientRecipe.ingredient;
                if(ingredient == ingredientRecipe) {
                    listRecipesFilteredByIngredients.push(recipe);
                }
            }
        }
        return listRecipesFilteredByIngredients;
    }

    filterRecipesByAppliance(recipes, appliance) {
        let listRecipesFilteredByAppliances = [];

        for(let recipe of recipes) {
            let applianceRecipe = recipe.appliance;
                if(appliance == applianceRecipe) {
                    listRecipesFilteredByAppliances.push(recipe);
                }
        }
        return listRecipesFilteredByAppliances;
    }

    filterRecipesByUstensil(recipes, ustensil) {
        let listRecipesFilteredByUstensils = [];

        for(let recipe of recipes) {
            let ustensilsRecipesList = recipe.ustensils;
            for(let currentUstensil of ustensilsRecipesList) {
                if(ustensil == currentUstensil) {
                    listRecipesFilteredByUstensils.push(recipe);
                }
            }
        }
        return listRecipesFilteredByUstensils;
    }

    /*-----------------------------------------------------------
    Crée une div contenant le tag sur lequel l'utilisateur clique
    -----------------------------------------------------------*/
    createNewIngredientTag(ingredient) {
        let divTags = document.getElementById("div__tags");
        let newTag = document.createElement("div");
        divTags.appendChild(newTag);
        newTag.classList.add("new__ingredient__tag");
        newTag.setAttribute("id", `new__ingredient__tag__${ingredient}`);
        newTag.innerHTML = `
            ${ingredient}
            <i id="cross__tag__${ingredient}" class="far fa-times-circle"></i>`;

        let currentCrossTag = document.getElementById(`cross__tag__${ingredient}`);
        currentCrossTag.addEventListener("click", () => {
            newTag.remove();
            this.removeTagFromFiltersArray(`${ingredient}`);
        });
    }

    createNewApplianceTag(appliance) {
        let divTags = document.getElementById("div__tags");
        let newTag = document.createElement("div");
        divTags.appendChild(newTag);
        newTag.classList.add("new__appliance__tag");
        newTag.setAttribute("id", `new__appliance__tag__${appliance}`);
        newTag.innerHTML = `
            ${appliance}
            <i id="cross__tag__${appliance}" class="far fa-times-circle"></i>`;

        let currentCrossTag = document.getElementById(`cross__tag__${appliance}`);
        currentCrossTag.addEventListener("click", () => {
            newTag.remove();
            this.removeTagFromFiltersArray(`${appliance}`);
        });
    }

    createNewUstensilTag(ustensil) {
        let divTags = document.getElementById("div__tags");
        let newTag = document.createElement("div");
        divTags.appendChild(newTag);
        newTag.classList.add("new__ustensil__tag");
        newTag.setAttribute("id", `new__ustensil__tag__${ustensil}`);
        newTag.innerHTML = `
            ${ustensil}
            <i id="cross__tag__${ustensil}" class="far fa-times-circle"></i>`;

        let currentCrossTag = document.getElementById(`cross__tag__${ustensil}`);
        currentCrossTag.addEventListener("click", () => {
            newTag.remove();
            this.removeTagFromFiltersArray(`${ustensil}`);
        });
    }

    /*----------------------------------------------
    Actualise les recettes si un filtre est supprimé
    ----------------------------------------------*/
    removeTagFromFiltersArray(filter) {
        let filtersArray = this.filtersArray;
        if(filtersArray["ingredients"].includes(filter)) {
            let index = filtersArray["ingredients"].indexOf(filter);
            filtersArray["ingredients"].splice(index, 1)
        } 
        if(filtersArray["appliances"].includes(filter)) {
            let index = filtersArray["appliances"].indexOf(filter);
            filtersArray["appliances"].splice(index, 1)
        } 
        if(filtersArray["ustensils"].includes(filter)) {
            let index = filtersArray["ustensils"].indexOf(filter);
            filtersArray["ustensils"].splice(index, 1)
        };

        this.renderRecipesByFilters(recipes, this.filtersArray);
    }
}