// Global app controller
// https://www.food2fork.com/api/search
// 1b71bac192094f76fa22af4a95983e6f
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchview';
import {elements , renderLoader, clearLoader} from './views/base';

/** Global state of the app
 *  search object
 *  current recipe object
 *  shopping list object
 *  liked recipes
 */
const state = {};
const controlSearch = async () => {
    // 1) get query from the view
    const query = searchView.getInput();
    if(query){
        // 2) new search object and add to state
        state.search = new Search(query);

        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
            // 4) search for recipes
            await state.search.getResults();

            // 5) render results to UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(error){
            alert(error);
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});

/*
** Recipe controller
*/
const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    if(id){
        // prepare UI for changes

        // create new recipe object
        state.recipe = new Recipe();
        try{
            // get recipe data
            await state.recipe.getRecipe();
            // state.recipe.parseIngredients();         
            // calculate servings and time
            console.log(state.recipe);

            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // render recipe
            console.log(state.recipe);
        }catch(error){
            alert(error);
        }
    }
}

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));