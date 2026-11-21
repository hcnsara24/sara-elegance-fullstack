import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../data/products";
import { fetchProducts, createProduct, deleteProduct } from "../api/productService";
import { addToCart } from "../store/cartSlice";
import { toggleFavorite, selectFavoriteIds } from "../store/favoritesSlice";

const icons = { Clothes: "👗", Accessories: "💍", Shoes: "👠" };

// Props: values and setter functions come from the parent
export function Filters({ search, setSearch, category, setCategory, sort, setSort }) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search a product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chips">
        {categories.map((c) => (
          <button
            key={c}
            className={c === category ? "chip active" : "chip"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="default">Sort by</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>
  );
}

export function ProductCard({ product, onSelect, onChanged }) {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavoriteIds);
  const isFavorite = favorites.includes(product.id);
  const isLoggedIn = !!localStorage.getItem("token");

  // Local state: image failed to load?
  const [imgError, setImgError] = useState(false);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
      onChanged();
    } catch {
      alert("Could not delete product. Please try again.");
    }
  };

  return (
    <article className="card" onClick={() => onSelect(product)}>
      <div className="card-img">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="placeholder">{icons[product.category]}</div>
        )}

        {discount && <span className="discount">-{discount}%</span>}

        <button
          className={isFavorite ? "fav active" : "fav"}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleFavorite(product.id));
          }}
          aria-label="Add to favorites"
        >
          ♥
        </button>
      </div>

      <div className="card-body">
        <p className="card-cat">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="card-desc">{product.description}</p>

        <div className="price-row">
          <span className="price">{product.price.toLocaleString()} DA</span>
          {product.oldPrice && (
            <span className="old-price">
              {product.oldPrice.toLocaleString()} DA
            </span>
          )}
        </div>

        <span className="view-link">View details →</span>

        <button
          className="add-btn"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(addToCart(product));
          }}
        >
          Add to cart
        </button>

        {isLoggedIn && (
          <button className="remove" style={{ marginTop: "8px" }} onClick={handleDelete}>
            Delete product
          </button>
        )}
      </div>
    </article>
  );
}

export function ProductList({ onSelect }) {
  // Products fetched from the backend
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state for the UI filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  // Local state for the "Add product" form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Clothes",
    imageUrl: "",
    stock: "",
  });
  const isLoggedIn = !!localStorage.getItem("token");

  const reload = () => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((res) => {
        // Normalize MongoDB's _id/imageUrl to the id/image fields used everywhere else
        const normalized = res.data.map((p) => ({
          ...p,
          id: p._id,
          image: p.imageUrl,
        }));
        setProducts(normalized);
      })
      .catch(() => setError("Could not load products. Please check your connection."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      });
      setShowAddForm(false);
      setNewProduct({ name: "", description: "", price: "", category: "Clothes", imageUrl: "", stock: "" });
      reload();
    } catch (err) {
      alert(err.response?.data?.message || "Could not create product.");
    }
  };

  let visible = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "low") visible = [...visible].sort((a, b) => a.price - b.price);
  if (sort === "high") visible = [...visible].sort((a, b) => b.price - a.price);
  if (sort === "name")
    visible = [...visible].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section id="shop" className="shop">
      <h2>Our Collection</h2>
      <Filters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
      />

      {isLoggedIn && (
        <div style={{ marginBottom: "24px" }}>
	<button className="add-btn" onClick={() => setShowAddForm(!showAddForm)} style={{ width: "auto", padding:"10px 24px" }}>
            {showAddForm ? "Cancel" : "+ Add product"}
          </button>
          {showAddForm && (
            <form
              onSubmit={handleAddSubmit}
              style={{ display: "grid", gap: "10px", maxWidth: "400px", marginTop: "14px" }}
            >
              <input
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <input
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option>Clothes</option>
                <option>Accessories</option>
                <option>Shoes</option>
              </select>
              <input
                placeholder="Image URL"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
              />
              <button type="submit" className="add-btn">
                Create
              </button>
            </form>
          )}
        </div>
      )}

      {loading && <p className="empty">Loading products...</p>}
      {error && <p className="empty">{error}</p>}

      {!loading && !error && visible.length === 0 && (
        <p className="empty">No product found.</p>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelect} onChanged={reload} />
          ))}
        </div>
      )}
    </section>
  );
}
