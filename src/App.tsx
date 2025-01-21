import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

type BasketItem = {
  product: Product;
  quantity: number;
};

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortOption, setSortOption] = useState<string>('AtoZ');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  // ===== Hooks =====
  useEffect(() => updateSearchedProducts(), [searchTerm, sortOption, inStockOnly]);

  // ===== Basket management =====
  function showBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'block';
    }
  }

  function hideBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'none';
    }
  }

  // ===== Search =====
  function updateSearchedProducts() {
    let sortedProducts = itemList.slice(); 
    
    if (sortOption === 'AtoZ') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'ZtoA') {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === '£LtoH') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === '£HtoL') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === '*LtoH') {
      sortedProducts.sort((a, b) => a.rating - b.rating);
    } else if (sortOption === '*HtoL') {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    }
    
    if (inStockOnly) {
      sortedProducts = sortedProducts.filter(product => product.quantity > 0);
    }

    setSearchedProducts(sortedProducts.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }

  const getSearchCount = () => {
    if (searchTerm === '') {
      const number = searchedProducts.length;
      return `${number} Products`; // Return null if search term is empty
    } else if (searchedProducts.length === 0) {
      return "No search results found";
    } else {
      const number = searchedProducts.length;
      return number === 1 ? `${number} Result` : `${number} Results`;
    }
  }
  const addToBasket = (product: Product) => {
    const existingItemIndex = basket.findIndex(item => item.product.id === product.id);
    if (existingItemIndex !== -1) {
      const updatedBasket = [...basket];
      updatedBasket[existingItemIndex].quantity++;
      setBasket(updatedBasket);
    } else {
      setBasket(prevBasket => [...prevBasket, { product, quantity: 1 }]);
    }
  }
  const removeFromBasket = (product: Product) => {
    const existingItemIndex = basket.findIndex(item => item.product.id === product.id);
    if (existingItemIndex !== -1) {
      const updatedBasket = [...basket];
      updatedBasket[existingItemIndex].quantity--;
      if (updatedBasket[existingItemIndex].quantity === 0) {
        updatedBasket.splice(existingItemIndex, 1); // Remove the item if quantity becomes 0
      }
      setBasket(updatedBasket);
    }
  }
  const getTotalCost = () => {
    return basket.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  }

 return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png" alt="Logo" />
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/assets/shopping-basket.png" alt="Shopping Basket" />
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          {basket.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <div>
              {basket.map((item) => (
                <div key={item.product.name} className="shopping-row">
                  <div className="shopping-information">
                    <p>{`${item.product.name} (£${item.product.price.toFixed(2)}) - ${item.quantity}`}</p>
                  </div>
                  <button onClick={() => removeFromBasket(item.product)}>Remove</button>
                </div>
              ))}
              <p>Total: £{getTotalCost()}</p>
            </div>
          )}        </div>
      </div>
      <div id="search-bar">
        <input type="text" placeholder="Search..." onChange={changeEventObject => setSearchTerm(changeEventObject.target.value)} />
        <div id="control-area">
          <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input id="inStock" type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">{getSearchCount()}</p>

      <ProductList itemList={searchedProducts} addToBasket={addToBasket} />
    </div>
  );
}

export default App
