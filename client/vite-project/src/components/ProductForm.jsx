import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {
  const params = useParams();
  const [product, setProduct] = useState({
    name: "",
    desc: "",
    brand: "",
    price: "",
    category: "",
    available: false,
    quantity: "",
    releaseDate: "",
    imageFile: null,
  }); 
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (file && file.size > 2 * 1024 * 1024) {
      alert("The selected image exceeds the maximum size of 2MB.");
      return;
    }

    setProduct({ ...product, imageFile: file });
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    
    const formData = new FormData();
    formData.append(
      "product",
      JSON.stringify({
        id:productId,
        name: product.name,
        desc: product.desc,
        brand: product.brand,
        price: product.price,
        category: product.category,
        available: product.available,
        quantity: product.quantity,
        releaseDate: product.releaseDate,
      })
    );

    if (product.imageFile) {
      formData.append("imageFile", product.imageFile);
    }

    try {
      await axios.post("http://localhost:8080/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setProduct({
        name: "",
        desc: "",
        brand: "",
        price: "",
        category: "",
        available: false,
        quantity: "",
        releaseDate: "",
        imageFile: null,
      });
      setImagePreview(null);
      if(productId)
      navigate(`/product/${productId}`)
      else
      navigate('/');
    } catch (err) {
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const productId = params.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${productId}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        if(!productId)
        setError("Failed to fetch product details.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add/Edit Product</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div className="alert alert-success">Product saved successfully!</div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="desc"
            value={product.desc}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            type="text"
            className="form-control"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="available"
            checked={product.available}
            onChange={handleChange}
          />
          <label className="form-check-label">Available</label>
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Release Date</label>
          <input
            type="date"
            className="form-control"
            name="releaseDate"
            value={product.releaseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail"
                style={{ maxWidth: "200px" }}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
