class Model {

    static getRecipes() {
        return recipes;
    }

    static getIngredients() {
        let arrayIngredients = [];
        for(let i = 0; i < recipes.length; i++) {
            let ingredients = recipes[i].ingredients;
            for(let i = 0; i < ingredients.length; i++) {
                arrayIngredients.push(ingredients[i].ingredient);
            }
        }
        let arrayIngredientsFiltered = [...new Set(arrayIngredients)];
        return arrayIngredientsFiltered
    }

    static getAppliances() {
        let arrayAppliances = [];
        for(let i = 0; i < recipes.length; i++) {
            let appliance = recipes[i].appliance;
            for(let i = 0; i < appliance.length; i++) {
                arrayAppliances.push(appliance);
            }
        }
        let arrayAppliancesFiltered = [...new Set(arrayAppliances)];
        return arrayAppliancesFiltered
    }
    
    static getUstensils() {
        let arrayUstensils = [];
        for(let i = 0; i < recipes.length; i++) {
            let ustensils = recipes[i].ustensils;
            for(let i = 0; i < ustensils.length; i++) {
                arrayUstensils.push(ustensils[i]);
            }
        }
        let arrayUstensilsFiltered = [...new Set(arrayUstensils)];
        return arrayUstensilsFiltered
    }
}