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
const addProductForm = document.getElementById('add-product-form')
const submitBtn = document.getElementById('submit-btn')
const closeAddFormBtn = document.getElementById('close-add-form')
const productsBody = document.getElementById('products-body')
const createBtn = document.getElementById('create-btn')


searchForm.addEventListener('submit', (e)=> {
  e.preventDefault()
})

// shows create category form
createCategoryBtn.addEventListener('click', () => {
  createCategoryForm.classList.add('show-category-form')
})

createCategoryForm.addEventListener('submit', (e) => {
  e.preventDefault()
})

createBtn.addEventListener('click', () => {
  const formData = new FormData(createCategoryForm)
  const values = [...formData.values()]

  if (values.includes('')){
    alert('Please enter a category')
    return
  }
  console.log(formData.get('new-category'))
  postCategory({ name: formData.get('new-category') })
  createCategoryForm.reset()
  alert('Category has been created.')
})

// closes create category form
closeCategoryBtn.addEventListener('click', () => {
  createCategoryForm.classList.remove('show-category-form')
})

// shows add product form
addProductBtn.addEventListener('click',() => {
  addProductForm.classList.add('show-product-form')
})

addProductForm.addEventListener('submit', (e) => {
  e.preventDefault()
})
submitBtn.addEventListener('click', () => {
  const formData = new FormData(addProductForm)
  const values = [...formData.values()]

  if (values.includes('')){
    alert('Please enter all values')
    return
  }
  if (formData.get('category').toLowerCase() == 'choose category'){
    alert('Please pick a category')
    return
  }

  postProduct(Object.fromEntries(formData.entries()))
  addProductForm.reset()
  alert('Item added.')
})

// closes add product form
closeAddFormBtn.addEventListener('click', () => {
  addProductForm.classList.remove('show-product-form')
})

// show and hide filter options
categoryBtn.addEventListener('click',() => {
  categoryOptions.classList.toggle('show-options')
})
quantityBtn.addEventListener('click',() => {
  quantityOptions.classList.toggle('show-options')
})
priceBtn.addEventListener('click',() => {
  priceOptions.classList.toggle('show-options')
})

// display products
function displayProducts(arr,start, end){
  const prodsHtml = arr.map(item => {
    const {id, productName, category, quantity, cost, price} = item
    return `
      <tr>
            <td>${productName}</td>
            <td>${category}</td>
            <td>${quantity}</td>
            <td>$ ${cost}</td>
            <td>$ ${price}</td>
            <td>${quantity > 0 ? 'Active' : 'Inactive'}</td>
            <td>
              <div class="action-btns">
                <button class="edit-btn" aria-label="edit">
                  <img src="assets/images/pencil.svg" alt="pencil icon">
                </button>
                <button class="delete-btn" aria-label="delete">
                  <img src="assets/images/trash.svg" alt="trash icon">
                </button>
              </div>
            </td>
          </tr>
    `
  })
  productsBody.innerHTML = prodsHtml.slice(start, end).join('')
}

// fetch products
function fetchAllProducts(start=0,end=10){
  fetch('http://localhost:3000/items')
  .then(res => res.json())
  .then(data => displayProducts(data,start,end))
}

// add product using POST
function postProduct(obj){
  fetch(`http://localhost:3000/items`,{
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
}

// add category
function postCategory(obj){
  fetch('http://localhost:3000/categories',{
    method:'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(obj)
  })
}

document.addEventListener('DOMContentLoaded', ()=>{
  fetchAllProducts()
})