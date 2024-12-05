import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import ProductCard from "./components/ProductCard";
import Product from "./components/Product";
import ProductForm from "./components/ProductForm";
import reactLogo from "./assets/react.svg"; // React Logo for Navbar
import viteLogo from "/vite.svg"; // Vite Logo for Navbar

function App() {
  const [search, setSearch] = useState(""); // State for search input
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    // Update URL with search query
    const params = new URLSearchParams(location.search);
    if (search) {
      params.set("search", search); // Add search term to URL
    } else {
      params.delete("search"); // Remove search term if input is cleared
    }
    navigate(`/?${params.toString()}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Header with Navigation */}
      <header className="bg-primary text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo Section */}
          <div className="d-flex align-items-center">
            <img src={viteLogo} alt="Vite Logo" height="40" className="me-2" />
            <img src={reactLogo} alt="React Logo" height="40" />
            <h3 className="ms-2 mb-0">Product Showcase</h3>
          </div>

          {/* Navigation Links */}
          <nav className="d-flex align-items-center">
            <Link className="text-white text-decoration-none me-3" to="/">
              Home
            </Link>
            <Link
              className="text-white text-decoration-none me-3"
              to="/product/form"
            >
              Add Product
            </Link>
            {/* Search Bar */}
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-light" onClick={handleSearch}>
                Search
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<ProductCard />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/product/form" element={<ProductForm />} />
          <Route path="/product/form-edit/:id" element={<ProductForm />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-3 mt-5">
        <div className="container text-center">
          <p className="mb-1">&copy; 2024 Product Showcase. All Rights Reserved.</p>
          <p className="mb-0">
            Built with <img src={reactLogo} alt="React" height="20" className="mx-1" /> React and{" "}
            <img src={viteLogo} alt="Vite" height="20" className="mx-1" /> Vite.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
