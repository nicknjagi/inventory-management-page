const searchForm = document.getElementById('search-form')
const categoryBtn = document.getElementById('category-btn')
const quantityBtn = document.getElementById('quantity-btn')
const priceBtn = document.getElementById('price-btn')
const categoryOptions = document.getElementById('category-options')
const quantityOptions = document.getElementById('quantity-options')
const priceOptions = document.getElementById('price-options')

searchForm.addEventListener('submit', (e)=> {
  e.preventDefault()
})

categoryBtn.addEventListener('click',() => {
  categoryOptions.classList.toggle('show-options')
})

quantityBtn.addEventListener('click',() => {
  quantityOptions.classList.toggle('show-options')
})

priceBtn.addEventListener('click',() => {
  priceOptions.classList.toggle('show-options')
})

