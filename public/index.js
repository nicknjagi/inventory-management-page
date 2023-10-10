const searchForm = document.getElementById('search-form')
const categoryBtn = document.getElementById('category-btn')
const quantityBtn = document.getElementById('quantity-btn')
const priceBtn = document.getElementById('price-btn')
const categoryOptions = document.getElementById('category-options')
const quantityOptions = document.getElementById('quantity-options')
const priceOptions = document.getElementById('price-options')
const createCategoryBtn = document.getElementById('create-cat-btn')
const addProductBtn = document.getElementById('add-prod-btn')
const createCategoryForm = document.getElementById('create-category-form')
const closeCategoryBtn = document.querySelector('.close-category-form-btn')

searchForm.addEventListener('submit', (e)=> {
  e.preventDefault()
})

createCategoryBtn.addEventListener('click', () => {
  createCategoryForm.classList.add('show-category-form')
})

createCategoryForm.addEventListener('submit', (e) => {
  e.preventDefault()
})

closeCategoryBtn.addEventListener('click', () => {
  createCategoryForm.classList.remove('show-category-form')
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

