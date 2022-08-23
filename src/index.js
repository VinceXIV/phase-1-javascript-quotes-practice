fetch('http://localhost:3000/quotes?_embed=likes')
.then(result => result.json())
.then(data => {
    const domQuoteList = document.getElementById('quote-list')
    data.forEach(quote =>{
        const domQuoteCard = document.createElement('li')
        domQuoteCard.classList.add('quote-card')
        domQuoteCard.innerHTML = `
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>`

        domQuoteList.append(domQuoteCard)
    })
})