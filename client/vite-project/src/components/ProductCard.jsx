import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Function to extract the search query from the URL
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || ""; // Default to an empty string if no search query
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const searchQuery = getSearchQuery(); // Extract search query
        const response = await axios.get("http://localhost:8080/api/products/search", {
          params: { keyword: searchQuery }, // Pass search query as a parameter
        });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.search]); // Refetch data when search query changes

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-danger my-5">
        <h5>{error}</h5>
      </div>
    );

  return (
    <div className="container">
      <h2 className="text-center mb-4">Our Products</h2>
      <div className="row">
        {products.map((product, index) => (
          <Link
            to={`/product/${product.id}`}
            className="col-md-4 col-sm-6 mb-4 text-decoration-none"
            key={index}
          >
            <div className="card shadow-sm h-100">
              <div className="card-img-top">
                <img
                  height={200}
                  src={
                    product.imageType && product.imageDate
                      ? `data:${product.imageType};base64,${product.imageDate}`
                      : "https://via.placeholder.com/200?text=No+Image"
                  }
                  className="w-100 object-fit-cover"
                  alt={product.name || "Product Image"}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title text-truncate">
                  {product.name || "Unnamed Product"}
                </h5>
                <p className="card-text text-muted">
                  {product.desc || "No description available."}
                </p>
                <p className="card-text">
                  <strong>Brand:</strong> {product.brand || "N/A"}
                </p>
                <p className="card-text">
                  <strong>Category:</strong> {product.category || "N/A"}
                </p>
                <p className="card-text">
                  <strong>Available:</strong>{" "}
                  {product.available ? "Yes" : "No"}
                </p>
                <p className="card-text">
                  <strong>Quantity:</strong> {product.quantity || 0}
                </p>
                <p className="card-text">
                  <strong>Release Date:</strong>{" "}
                  {product.releaseDate
                    ? new Date(product.releaseDate).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div className="card-footer text-center">
                <button
                  className="btn btn-primary"
                  disabled={!product.available}
                >
                  {product.available ? "Buy Now" : "Out of Stock"}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
