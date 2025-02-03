import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../../redux/slice/authSlice";
import { getProduct } from "../../../redux/slice/productSlice";
import Card from "../../cards/Card";
import { SpinnerImg } from "../../loader/Loader";
import "./ProductDetail.scss";
import DOMPurify from "dompurify";

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { id } = useParams();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      return <span className="--color-success">In Stock</span>;
    }
    return <span className="--color-danger">Out Of Stock</span>;
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  return (
    <div className="product-detail">
      <h3 className="--mt">Product Detail</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {product && (
          <div className="detail">
            <Card cardClass="group">
              {product?.image ? (
                <img
                  src={product.image.filePath}
                  alt={product.image.fileName}
                />
              ) : (
                <p>No image set for this product</p>
              )}
            </Card>
            <h4>Product Availability: {stockStatus(product.quantity)}</h4>
            <hr />
            <h4>
              <span className="badge">Name: </span> &nbsp; {product.name}
            </h4>
            <p>
              <b>&rarr; SKU : </b> {product.sku}
            </p>
            <p>
              <b>&rarr; Category : </b> {product.category}
            </p>
            <p>
              <b>&rarr; Price : </b> {"$"}
              {product.price}
            </p>
            <p>
              <b>&rarr; Quantity in stock : </b> {product.quantity}
            </p>
            <p>
              <b>&rarr; Total Value in stock : </b> {"$"}
              {product.price * product.quantity}
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            ></div>
            <hr />
            <code className="--color-dark">
              Created on: {product.createdAt.toLocaleString("en-US")}
            </code>
            <br />
            <code className="--color-dark">
              Last Updated: {product.updatedAt.toLocaleString("en-US")}
            </code>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;





// import axios from "axios";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Loader from "../../components/loader/Loader";
// import ProductForm from "../../components/product/productForm/ProductForm";
// import {
//   createProduct,
//   selectIsLoading,
// } from "../../redux/slice/productSlice";

// const initialState = {
//   name: "",
//   category: "",
//   quantity: "",
//   price: "",
// };

// const AddProduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(initialState);
//   const [productImage, setProductImage] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [description, setDescription] = useState("");

//   const isLoading = useSelector(selectIsLoading);

//   const { name, category, price, quantity } = product;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProduct({ ...product, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     setProductImage(e.target.files[0]);
//     setImagePreview(URL.createObjectURL(e.target.files[0]));
//   };

//   const generateKSKU = (category) => {
//     const letter = category.slice(0, 3).toUpperCase();
//     const number = Date.now();
//     const sku = letter + "-" + number;
//     return sku;
//   };

//   const saveProduct = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("sku", generateKSKU(category));
//     formData.append("category", category);
//     formData.append("quantity", Number(quantity));
//     formData.append("price", price);
//     formData.append("description", description);
//     formData.append("image", productImage);

//     console.log(...formData);
    


//     await dispatch(createProduct(formData));

//     navigate("/dashboard");
//   };

//   return (
//     <div>
//       {isLoading && <Loader />}
//       <h3 className="--mt --color-dark --text-center" >Add New Product</h3>
//       <ProductForm
//         product={product}
//         productImage={productImage}
//         imagePreview={imagePreview}
//         description={description}
//         setDescription={setDescription}
//         handleInputChange={handleInputChange}
//         handleImageChange={handleImageChange}
//         saveProduct={saveProduct}
//       />
//     </div>
//   );
// };

// export default AddProduct;

