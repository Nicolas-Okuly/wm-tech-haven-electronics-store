let products;
async function loadProducts() { products = await (await fetch("/wm-tech-haven-electronics-store/products.json")).json(); }

/**
 * 
 * @param {Object[]} displayProducts Array of products to display
 */
function renderProducts(displayProducts) {
    const container = document.getElementById("productsContainer");
    const productCount = document.getElementById("productCount");

    productCount.innerHTML = displayProducts.length;

    let html = '';
    displayProducts.forEach(item => {
        html += `
            <div class="product-card">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="price">$${item.price}</p>
                <p class="rating">${item.rating}/5</p>
                <p class="stock">Stock: ${item.stock}</p>
                <p class="description">${item.description}</p>
            </div>
        `
    });

    container.innerHTML = html;
}

/**
 * 
 * @param {Object[]} prods 
 * @param {String} searchTerm 
 * @returns {Object[]}
 */
function searchProducts(prods, searchTerm) {
    if (!searchTerm) return prods;

    searchTerm = searchTerm.toLowerCase().trim();
    const searchWords = searchTerm.split(' ').filter(word => word.length > 0);

    return prods.filter(product => {
        const productText = [
            product.name,
            product.description,
            product.category,
            product.brand
        ].join(' ').toLowerCase();

        return searchWords.every(word => productText.includes(word));
    });
}

/**
 * 
 * @param {Object[]} prods 
 * @param {String} category
 * @returns {Object[]} 
 */
function searchCategory(prods, category) {
    if (!category) return prods;
    return prods.filter(product => product.category === category);
}

/**
 * 
 * @param {Object[]} prods 
 * @param {String} brand
 * @returns {Object[]} 
 */
function searchBrand(prods, brand) {
    if (!brand) return prods;
    return prods.filter(product => product.brand === brand);
}

function applyFilters() {
    let filtered = products;

    const searchTerm = document.getElementById("searchInput").value;
    filtered = searchProducts(filtered, searchTerm);

    const category = document.getElementById("categorySelect").value;
    filtered = searchCategory(filtered, category);

    const brand = document.getElementById("brandSelect").value;
    filtered = searchBrand(filtered, brand);

    const sortBy = document.getElementById("sortSelect").value;
    if(sortBy =='priceLow') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy == 'priceHigh') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy == 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy == 'name') {
        filtered.sort((a,b) => a.name.localeCompare(b.name));
    }

    renderProducts(filtered);
}

document.getElementById("searchInput").addEventListener("keyup", applyFilters);
document.getElementById("categorySelect").addEventListener("change", applyFilters);
document.getElementById("brandSelect").addEventListener("change", applyFilters);
document.getElementById("sortSelect").addEventListener("change", applyFilters);

async function main() {
    await loadProducts();
    renderProducts(products);
}

main()
