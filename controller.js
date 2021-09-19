class Controller {

    constructor(recipes, ingredients, appliances, ustensils) {
        recipes = this.recipes,
        ingredients = this.ingredients,
        appliances = this.appliances,
        ustensils = this.ustensils;
    }

    renderMainPage() {
        let view = new ViewMainPage();
        let recipes = Model.getRecipes();
        let ingredients = Model.getIngredients();
        let appliances = Model.getAppliances();
        let ustensils = Model.getUstensils();
        view.renderRecipesPage(recipes, ingredients, appliances, ustensils);
    }
}