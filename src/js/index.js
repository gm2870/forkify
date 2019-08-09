// Global app controller
// https://www.food2fork.com/api/search
// 1b71bac192094f76fa22af4a95983e6f
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchview';
import * as recipeview from './views/recepieview';
import * as listview from './views/listview';
import * as likesview from './views/likesview';

import { elements , renderLoader, clearLoader } from './views/base';

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
    const id = window.location.hash.replace('#', '');
    if(id){
        // prepare UI for changes
        recipeview.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search){
            searchView.highlightSelected(id);
        }
        // recipeView.clearRecipe();
        // create new recipe object
        state.recipe = new Recipe(id);
        try{
            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();         
            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // render recipe
            recipeview.renderRecipe(state.recipe,state.likes.isLiked(id));
        }catch(error){
            alert(error);
        }
    }
}

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));


/*
** List controller
*/
const controlList = () => {
    //create new list if there is none yet
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listview.renderItem(item);
    });
};

// handle delete and update list item events 

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle delete
    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        state.list.deleteItem(id);

        // delete from UI
        listview.deleteItem(id);
        //handle the count update
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id,val);
    }
});

/*
** Like controller
*/
// testing --> to be removed


const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    if(!state.likes.isLiked(currentID)){
        //add like to the state 
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle the like button 
        likesview.toggleLikeBtn(true);

        //add like to UI list 
        likesview.renderLike(newLike);
        //user has liked current recipe
    }else {
        // remove the like
        state.likes.deleteLike(currentID);
        likesview.toggleLikeBtn(false);
        likesview.deleteLike(currentID);
    }
    likesview.toggleLikeMenu(state.likes.getNumLikes());
}

window.addEventListener('load',() => {
    state.likes = new Likes();
    state.likes.readStorage();

    likesview.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesview.renderLike(like));
});

// handling recipe button clicks
elements.recipe.addEventListener('click' , e => {
    if(e.target.matches('.btn-decrease , .btn-decrease *')) {
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeview.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeview.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love,.recipe__love *')) {
        // like controller
        controlLike();
    }
});
