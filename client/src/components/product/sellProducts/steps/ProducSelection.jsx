import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai"; // Cart icons
import { BsCartCheckFill } from "react-icons/bs";
import Search from "../../../search/Search";
import {
  getProducts,
  selectIsLoading,
} from "../../../../redux/slice/productSlice";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../../../redux/slice/filterSlice";
import ReactPaginate from "react-paginate";
import "./ProductSelection.scss";

function ProductSelection({ cart, setCart }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const products = useSelector((state) => state.product.products);
  const filteredProducts = useSelector(selectFilteredPoducts);

  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [dispatch, products, search]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, filteredProducts, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  const toggleCart = (product) => {
    if (product.quantity <= 0) return; // Prevent adding faded rows
    const isInCart = cart.some((item) => item._id === product._id);
    if (isInCart) {
      setCart(cart.filter((item) => item._id !== product._id));
    } else {
      const quantity = quantities[product._id] || 1;
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));

    // Update quantity in cart if product is already in the cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  if (isLoading) return <div>Loading...</div>;



  return (
    <div className="product-selection">
      <div className="--flex-between --flex-dir-column">
        <span>
          <h3>Select Products</h3>
        </span>
        <span className="product-search">
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </span>
      </div>

      {/* Product Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product, index) => {
            const isInCart = cart.some((item) => item._id === product._id);
            const isFaded = product.quantity <= 0;
            return (
              <tr key={product._id} className={isFaded ? "faded-row" : ""}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>
                  <div className="quantity-controls">
                    <input
                      type="number"
                      min="1"
                      value={quantities[product._id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          product._id,
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                    <span
                      className="cart-icon"
                      onClick={() => toggleCart(product)}
                      style={{ cursor: isFaded ? "not-allowed" : "pointer" }}
                    >
                      {isInCart ? (
                        <BsCartCheckFill color="green" size={24} />
                      ) : (
                        <AiOutlineShoppingCart
                          color={isFaded ? "lightgray" : "gray"}
                          size={24}
                        />
                      )}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Prev"
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />

      {/* Cart Summary */}
      <div className="cart-summary">
        <h4>Cart Summary</h4>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cart.map((item) => (
                <li key={item._id}>
                  {item.name} - Quantity: {item.quantity} - $
                  {item.price * item.quantity} <br />
                  <strong>Category: </strong> {item.category}
                </li>
              ))}
            </ul>

          </>
        )}
      </div>
    </div>
  );
}

export default ProductSelection;
