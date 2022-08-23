populateDomWithQuotes()


// RENDERING QUOTE ON DOM AND HANDLING WHAT HAPPENS WHEN ONE IS LIKED

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
        

        const domLikeButtons = document.querySelectorAll('.like-button')
        const domDeleteButtons = document.querySelectorAll('.delete-button')

        for(btn of domLikeButtons){
            handleLikeButton(btn)
        }
        for(btn of domDeleteButtons){
            handleDeleteButton(btn)
        }
    })
}

function handleLikeButton(btn){
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

function getQuoteId(quote){
    return quote.id;
}

function createLikeObject(quoteId){
    return {
        "quoteId": parseInt(quoteId),
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

// HANDLING SUBMISSION OF QUOTES
const domNewQuoteForm = document.getElementById('new-quote-form')
domNewQuoteForm.addEventListener('submit', e=>{
    e.preventDefault()
    const quoteObject = createQuoteObject(e.target)

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            "Accept": "application/json"
        },
        body:JSON.stringify(quoteObject)
    })
    .then(result => result.json())
    .then(data => {
        const domQuoteCard = updateDomQuotes(data)
        handleLikeButton(domQuoteCard.querySelector('button.like-button'))
        console.log(domQuoteCard)
    })
})

function createQuoteObject(formData){
    const newQuote = formData.querySelector("#new-quote").value
    const quoteAuthor = formData.querySelector("#author").value

    return {
        "quote": newQuote,
        "author": quoteAuthor
    }
}

function updateDomQuotes(quote){
    const domQuoteList = document.getElementById('quote-list')

    const domQuoteCard = document.createElement('li')
    domQuoteCard.classList.add('quote-card')
    domQuoteCard.innerHTML = `
        <blockquote class="blockquote" id="${quote.id}">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success like-button'>Likes: <span>0</span></button>
        <button class='btn-danger delete-button'>Delete</button>
    </blockquote>`

    domQuoteList.append(domQuoteCard)
    handleDeleteButton(domQuoteCard.querySelector('button.delete-button'))
    return domQuoteCard
}


// HANDLE THE DELETE BUTTON
function handleDeleteButton(btn){
    const quoteId = btn.parentElement.id
    btn.addEventListener('click', e=>{
        console.log('I was clicked!')
        fetch(`http://localhost:3000/quotes/${quoteId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(result => result.json())
        .then(()=>{
            btn.parentElement.parentElement.remove()
        })
    })
}