import axios from 'axios';
class Search {
    constructor(query){
        this.query = query;
    }
    async getResults() {
        const proxy = 'http://cors-anywhere.herokuapp.com/';
        //proxy is not needed!.
        try{
            const key = '1b71bac192094f76fa22af4a95983e6f';
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            console.log(this.result);
        }catch(error){
            alert(error);
        }
    
    }
};

export default Search;