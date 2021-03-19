const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
})=>{
    // const root = document.querySelector('.autocomplete');
    root.innerHTML = `
    <label><b> Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
    `;
    const input = root.querySelector('.input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    //debounce function 

    const onInput = async (e) =>{
        const items = await fetchData(e.target.value);
        
        if(!items.length){
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = '';  
        dropdown.classList.add('is-active');
        
        for(let item of items){

        const option = document.createElement('a');
        // const imgSrc = movieName.Poster === 'N/A' ? '' : movieName.Poster;
        option.classList.add('dropdown-item');
        option.innerHTML = renderOption(item);
        option.addEventListener('click',()=>{
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);
            onOptionSelect(item);
        });


        resultsWrapper.appendChild(option); 

        }
        
    }

    // const onInput = (e)=>{
    //     if(timeOutId){
    //         clearTimeout(timeOutId);
    //     }
    //     timeOutId = setTimeout(()=>{
    //         fetchData(e.target.value);
    //     },1000);
        
        
    // }

    input.addEventListener('input',debounce(onInput,500));

    document.addEventListener('click',(e)=>{
        if(!root.contains(e.target)){
            dropdown.classList.remove('is-active');
        }
    });
}