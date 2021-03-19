// const fetchData = async (searchValue) =>{
//     const response = await axios.get('http://www.omdbapi.com/',{
//         params:{
//             apikey: 'd9835cc5',
//             s: searchValue
//         }
//     });

   
//     if(response.data.Error){
//        return [];
//     }

//      return  response.data.Search;
// };

const autoCompleteConfig = {
    renderOption(movieName){
        const imgSrc = movieName.Poster === 'N/A' ? '' : movieName.Poster;
        return `
        <img src="${imgSrc}"/>
        ${movieName.Title}(${movieName.Year})
        `;
    },

    inputValue(movieName){
        return movieName.Title;
    },
    async fetchData(searchValue){
        const response = await axios.get('http://www.omdbapi.com/',{
            params:{
                apikey: 'd9835cc5',
                s: searchValue
            }
        });
    
       
        if(response.data.Error){
           return [];
        }
    
         return  response.data.Search;
    } 
}

createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#left-autocomplete'),
    onOptionSelect(movieName){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movieName,document.querySelector('#left-summary'),'left');
    }
})


createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#right-autocomplete'),
    onOptionSelect(movieName){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movieName,document.querySelector('#right-summary'),'right');
    }
})



let leftMovie;
let rightMovie;
const onMovieSelect = async (movieName,summaryElement,side) => {
    const response = await axios.get('http://www.omdbapi.com/',{
        params:{
            apikey: 'd9835cc5',
            i: movieName.imdbID
        }
    });
    // console.log(response.data);
    summaryElement.innerHTML = movieTemplate(response.data);
    
    if(side === 'left'){
        leftMovie = response.data;
    }else{
        rightMovie = response.data;
    }

    if(leftMovie && rightMovie){
        runComparsion(); 
    }
};

const runComparsion = ()=>{
    const leftSideStatus = document.querySelectorAll('#left-summary .notification');
    const rightSideStatus = document.querySelectorAll('#right-summary .notification');

    leftSideStatus.forEach((leftStat,index)=>{
        const rightStat = rightSideStatus[index];
        
        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }else{
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }

    })
};

const movieTemplate = (movieDetail)=>{
    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,'')
        );
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    

    const awards = movieDetail.Awards.split(' ').reduce((prev,word)=>{
        const value = parseInt(word);

        if(isNaN(value)){
            return prev;
        }else{
            return prev + value;
        }
    },0);
    
    

   return `
   <article class="media">
    <figure class="media-left">
        <p class="image">
        <img src="${movieDetail.Poster}"/>
        </p> 
    </figure>
   <div class="media-content">
     <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <h5>Released Date: ${movieDetail.Released}</h5>
        
        <p>${movieDetail.Plot}</p>
     </div>
   </div>
   </article>

   <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
   </article>

    <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metaScore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
   </article>


    <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
    </article>


   `;
}
