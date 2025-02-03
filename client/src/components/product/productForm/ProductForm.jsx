import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../cards/Card";
import "./ProductForm.scss";

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveProduct,
}) => {
  return (
    <div className="add-product">
      <Card cardClass="card">
        <form onSubmit={saveProduct}>


          {/* Name and Category */}
          <div className="form-row">
            <div className="form-col">
              <label>Product Name:</label>
              <input
                type="text"
                placeholder="Product name"
                name="name"
                value={product?.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-col">
              <label>Product Category:</label>
              <input
                type="text"
                placeholder="Product category"
                name="category"
                value={product?.category}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="form-row">
            <div className="form-col">
              <label>Product Price:</label>
              <input
                type="text"
                placeholder="Product price"
                name="price"
                value={product?.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-col">
              <label>Product Quantity:</label>
              <input
                type="text"
                placeholder="Product quantity"
                name="quantity"
                value={product?.quantity}
                onChange={handleInputChange}
              />
            </div>
          </div>
                    {/* Image Upload */}
                    <div className="form-group">
            <label>Product Image</label>
            <code className="--color-dark">
              Supported Formats: jpg, jpeg, png
            </code>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="product" />
              </div>
            ) : (
              <p>No image set for this product.</p>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Product Description:</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={ProductForm.modules}
              formats={ProductForm.formats}
            />
          </div>

          {/* Submit Button */}
          <div className="form-group --my">
            <button type="submit" className="--btn --btn-primary">
              Save Product
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};

ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm;
