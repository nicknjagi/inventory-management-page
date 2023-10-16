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
const editBtn = document.getElementById('edit-btn')
const deleteBtn = document.getElementById('delete-btn')
const clearFilterBtn = document.getElementById('clear-filter')
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')
const loader = document.getElementById('loader')
const pageTracker = document.getElementById('page-tracker')
let currentPage = 1
let totalPages 
let products = []

const url = 'https://inventory-management-api-7wjf.onrender.com'
// const url	= 'http://localhost:3000' /*for dev*/

searchForm.addEventListener('submit', (e)=> {
  e.preventDefault()
  const formData = new FormData(searchForm)
  if (Array.from(formData.values()).includes('')) {
    displayAlert('warn', 'Please enter a word to search')
    return
  }
  const results = products.filter((prod) =>
    prod.productName
      .toLowerCase()
      .includes(formData.get('search').toLowerCase())
  )
  if (results.length > 0){
    displayProducts(results)
    pageTracker.innerText = `1`
    searchForm.reset()
  } else {
    document.querySelector('.products-container').innerHTML = `
      <p id='page-tracker'>No products found. 
        <a href="" onclick="fetchAllProducts()">Home</a>
      </p>
    `
    pageTracker.innerText = ''
  }
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
    displayAlert('warn','Please enter a category')
    return
  }

  postCategory({ name: formData.get('new-category').toLowerCase() })
  createCategoryForm.reset()
  createCategoryForm.classList.remove('show-category-form')
})

// closes create category form
closeCategoryBtn.addEventListener('click', () => {
  createCategoryForm.classList.remove('show-category-form')
})

// shows add product form
addProductBtn.addEventListener('click',() => {
  addProductForm.querySelector('h2').textContent = 'Add product'
  addProductForm.classList.add('show-product-form','add')
  addProductForm.reset()
})

addProductForm.addEventListener('submit', (e) => {
  e.preventDefault()
})

submitBtn.addEventListener('click', () => {
  const formData = new FormData(addProductForm)
  const values = [...formData.values()]

  if (values.includes('')){
    displayAlert('warn','Please enter all values')
    return
  }
  if (formData.get('category').toLowerCase() == 'choose category'){
    displayAlert('warn','Please pick a category')
    return
  }
  if (addProductForm.classList.contains('edit')) return

  postProduct(Object.fromEntries(formData.entries()))
  addProductForm.reset()
  displayAlert('green','Item added.')
  addProductForm.classList.remove('show-product-form', 'add')
  currentPage = 1
  fetchAllProducts()
})

// closes add product form
closeAddFormBtn.addEventListener('click', () => {
  addProductForm.classList.remove('show-product-form','add','edit')
})

// show and hide filter options
categoryBtn.addEventListener('click',() => {
  quantityOptions.classList.remove('show-options')
  priceOptions.classList.remove('show-options')
  categoryOptions.classList.toggle('show-options')
})
quantityBtn.addEventListener('click',() => {
  priceOptions.classList.remove('show-options')
  categoryOptions.classList.remove('show-options')
  quantityOptions.classList.toggle('show-options')
})
priceBtn.addEventListener('click',() => {
  categoryOptions.classList.remove('show-options')
  quantityOptions.classList.remove('show-options')
  priceOptions.classList.toggle('show-options')
})

// filter using category name
function filterCategory(name){
  const catItems = products.filter(prod => prod.category.toLowerCase() == name)
  displayProducts(catItems)
  pageTracker.innerText = '1'
  categoryOptions.classList.toggle('show-options')
  clearFilterBtn.classList.add('show')
}

// remove filter
clearFilterBtn.addEventListener('click',()=>{
  fetchAllProducts()
  clearFilterBtn.classList.remove('show')
})

// display categories
function displayCategories(arr){
  const categoryOptions = document.getElementById('category-options')
  const categoryInputOptions = document.getElementById('category-input')
  categoryInputOptions.innerHTML =
    '<option class="hidden" value="choose category">Choose a category</option>'
  categoryOptions.innerHTML = ''

  arr.forEach(cat => {
    const btn = document.createElement('button')
    btn.textContent = cat.name
    btn.setAttribute('onclick',`filterCategory("${cat.name}")`)
    const catOpt = document.createElement('option')
    catOpt.textContent = cat.name
    catOpt.value = cat.name.toLowerCase()
    categoryOptions.appendChild(btn)
    categoryInputOptions.appendChild(catOpt)
  })
}

// display products
function displayProducts(arr,start, end){
  const prodsHtml = arr.map(item => {
    const {id, productName, category, quantity, cost, price} = item
    return `
      <tr>
        <td>${productName.toLowerCase()}</td>
        <td>PR0${id}</td>
        <td>${category}</td>
        <td>${quantity}</td>
        <td>$ ${cost}</td>
        <td>$ ${price}</td>
        <td>${quantity > 0 ? 'Active' : 'Inactive'}</td>
        <td>
          <div class="action-btns">
            <button class="edit-btn" onclick="editProduct(${id})" aria-label="edit">
              <img src="assets/images/pencil.svg" alt="pencil icon">
            </button>
            <button class="delete-btn" onclick="deleteProduct(${id})" aria-label="delete">
              <img src="assets/images/trash.svg" alt="trash icon">
            </button>
          </div>
        </td>
      </tr>
    `
  })
  productsBody.innerHTML = prodsHtml.slice(start, end).join('')
}

// handle next button click
nextBtn.addEventListener('click', () => {
  if(products.length > 0){
    if (currentPage < totalPages){
      fetchAllProducts(currentPage * 10, (currentPage * 10 + 10))
      currentPage++
    }
  }
})

// handle previous button click
prevBtn.addEventListener('click', () => {
  if(products.length > 0){
    if (currentPage > 1){
      currentPage--
      fetchAllProducts((currentPage * 10 -10), currentPage * 10)
    }
  }
})

function deleteProduct(id){
  const response = prompt('Are you sure you want to delete? (yes/no)')
  if(response == null) return
  if(response.toLowerCase() === 'yes' || response.toLowerCase() === 'y'){
    fetch(`${url}/items/${id}`,{
      method:'DELETE'
    })
    .then(() => {
      currentPage= 1
      fetchAllProducts()
      displayAlert('neutral','Item has been deleted.')
    })
  }
}

function editProduct(id){
  fetch(`${url}/items/${id}`)
  .then(res => res.json())
  .then(data => patchProduct(data))
}

function patchProduct(obj){
  addProductForm.classList.add('show-product-form','edit')
  addProductForm.querySelector('h2').textContent = 'Edit product'
  const {id, productName, category, quantity, cost, price} = obj
  // display current product values
  document.getElementById('category-name').value = productName
  document.getElementById('category-input').value = category.toLowerCase()
  document.getElementById('quantity-input').value = quantity
  document.getElementById('cost-input').value = cost
  document.getElementById('price-input').value = price
 
  // patch the data when edit button is clicked
  document.getElementById('edit-submit-btn').addEventListener('click', ()=>{
    // get the new values of the form
    const formData = new FormData(addProductForm)
    const newObj = Object.fromEntries(formData.entries())
    
    fetch(`${url}/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newObj),
    }).then(() => {
      currentPage = 1
      fetchAllProducts()
      displayAlert('green', 'Changes have been saved')
      addProductForm.classList.remove('show-product-form', 'edit')
    })
  })
}

// get categories
function getCategories() {
  fetch(`${url}/categories`)
  .then(res => res.json())
  .then(data => displayCategories(data))
}

// fetch products
function fetchAllProducts(start=0,end=10){
  // loader.classList.add('show')
  clearFilterBtn.classList.remove('show')
  fetch(`${url}/items`)
  .then(res => res.json())
  .then(data => {
    loader.classList.remove('show')
    displayProducts(data, start, end)
    products = [...data]
    totalPages = Math.ceil(products.length / 10)
    pageTracker.innerText = `${currentPage} of ${totalPages}`
  })
}

// add product using POST
function postProduct(obj){
  fetch(`${url}/items`,{
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  .then(() => fetchAllProducts())
}

// add category
function postCategory(obj){
  fetch(`${url}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
  .then(() =>{
    displayAlert('green', 'Category has been created.')
    getCategories()
  })
}

document.addEventListener('DOMContentLoaded', ()=>{
  fetchAllProducts()
  getCategories()
})

//  displays alerts
function displayAlert(className, message){
  const alertEl = document.getElementById('alert')
  alertEl.classList.add(className)
  alertEl.getElementsByTagName('p')[0].textContent = message
  alertEl.getElementsByTagName('button')[0].addEventListener('click', ()=>{
    alertEl.classList.remove(className)
  })

  setTimeout(()=>{
    alertEl.classList.remove(className)
    alertEl.getElementsByTagName('p')[0].textContent = ''
  }, 2500)
}

