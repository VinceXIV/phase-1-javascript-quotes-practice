populateDomWithQuotes()


function populateDomWithQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(result => result.json())
    .then(data => {
        const domQuoteList = document.getElementById('quote-list')
        data.forEach(quote =>{
            const domQuoteCard = document.createElement('li')
            domQuoteCard.classList.add('quote-card')
            domQuoteCard.innerHTML = `
                <blockquote class="blockquote" id="${quote.id}">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success like-button'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger delete-button'>Delete</button>
            </blockquote>`
    
            domQuoteList.append(domQuoteCard)
        }) 
        
        handleLikeButtons()
    })
}

function handleLikeButtons(){
    const domLikeButtons = document.querySelectorAll('.like-button')

    for(btn of domLikeButtons){
        btn.addEventListener('click', e => {
            const quoteId = getQuoteId(e.target.parentElement)
            const newLikeObject = createLikeObject(quoteId)

            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newLikeObject)
            })
            .then(result => result.json())
            .then(data => updateDomNoOfLikes(data))
        })
    }
}

function getQuoteId(quote){
    return quote.id;
}

function createLikeObject(quoteId){
    return {
        "quoteId": quoteId,
        "createdAt":  (new Date()).getTime()
    }
}

function updateDomNoOfLikes(data){
    const domQuotes = Array.from(document.getElementsByClassName('blockquote'))
    
    const domQuoteToChange = domQuotes.find(quote =>{
        return quote.id == data.quoteId
    })
    
    // following lines of codes are for updating the number of likes (adding 1)
    const currentNoOfLikes = parseInt(domQuoteToChange.querySelector('button.like-button span').textContent)
    const updatedNoOfLikes = currentNoOfLikes + 1
    domQuoteToChange.querySelector('button.like-button span').textContent = updatedNoOfLikes
}