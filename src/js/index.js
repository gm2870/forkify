// Global app controller
// https://www.food2fork.com/api/search
// 1b71bac192094f76fa22af4a95983e6f
import Search from './models/Search';
/** Global state of the app
 *  search object
 *  current recipe object
 *  shopping list object
 *  liked recepies
 */
const state = {};
const controlSearch = async () => {
    // 1) get query from the view
    const query = 'pizza';
    if(query){
        // 2) new search object and add to state
        state.search = new Search(query);
        // 3) prepare UI for results

        // 4) search for recepies
        await state.search.getResults();
        // 5) render results to UI
    }
}


document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});