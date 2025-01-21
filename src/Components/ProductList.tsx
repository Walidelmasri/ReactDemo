type ContentAreaProps = {
  itemList: Product[];
  addToBasket: (product: Product) => void;
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  rating: number;
  image_link: string;
};

export const ProductList = (props: ContentAreaProps) => {
  const { itemList, addToBasket } = props;

  const handleAddToBasket = (product: Product) => {
    addToBasket(product);
  };

  return (
    <div id="productList">
      {itemList.map((item) => {
        return (
          <div key={item.id} className="product">
            <div className="product-top-bar">
              <h2>{item.name}</h2>
              <p> £{item.price.toFixed(2)} ({item.rating}/5)</p>
            </div>
            <img src={"./src/Assets/Product_Images/" + item.image_link} alt={item.name} />
            {item.quantity > 0 ? (
              <button onClick={() => handleAddToBasket(item)}>Add to basket</button>
            ) : (
              <button disabled>Out of stock</button>
            )}
          </div>
        );
      })}
    </div>
  );
};
