import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product details.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      alert("Product deleted successfully");
      navigate("/");
    } catch (e) {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  const imageSrc = `data:${product.imageType};base64,${product.imageDate}`;

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Product Details</h2>
        <div>
          <Link className="btn btn-outline-primary me-2" to={`/product/form-edit/${id}`}>
            Edit Product
          </Link>
          <button onClick={deleteProduct} className="btn btn-outline-danger">
            Delete Product
          </button>
        </div>
      </div>

      {/* Product Card */}
      <div className="card shadow-lg p-4 border-0 rounded-4">
        <div className="row g-4">
          {/* Left: Product Image */}
          <div className="col-md-5 text-center">
            <img
              src={imageSrc}
              alt={product.name}
              className="img-fluid rounded-3 border"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </div>

          {/* Right: Product Details */}
          <div className="col-md-7">
            <h3 className="mb-3 text-dark">{product.name}</h3>
            <p className="text-secondary">{product.desc}</p>
            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Brand</strong>
                <span>{product.brand}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Category</strong>
                <span>{product.category}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Price</strong>
                <span className="text-success">${product.price}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Available</strong>
                <span className={product.available ? "text-success" : "text-danger"}>
                  {product.available ? "Yes" : "No"}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Quantity</strong>
                <span>{product.quantity}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Release Date</strong>
                <span>{new Date(product.releaseDate).toLocaleDateString()}</span>
              </li>
            </ul>
            <div className="d-grid">
              <button
                className={`btn ${
                  product.available ? "btn-primary" : "btn-secondary"
                }`}
                disabled={!product.available}
              >
                {product.available ? "Buy Now" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-outline-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Product;
