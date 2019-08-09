import axios from 'axios';
import {key,proxy} from '../config'
class Search {
    constructor(query){
        this.query = query;
    }
    async getResults() {
        //proxy is not needed!.
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            console.log(res);
        }catch(error){
            alert(error);
        }
    
    }
};

export default Search;