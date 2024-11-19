import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../api/productApi';
import { ProductDetailsInterface } from '../../types/ProductInterfaces';
import styles from './ProductDetails.module.css';
import { showToastifyError, showToastifySuccess  } from '../../config/toastifyConfig';
import { CartContext } from '../../context/cartContext';
import { AuthContext } from '../../context/authContext';
import { CartItem } from '../../types/CartInterfaces';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailsInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addQuantity, setAddQuantity] = useState(1);
  
  const authContext = useContext(AuthContext);
  const { cartItems, addToCart } = useContext(CartContext)!;

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        if (id) {
          const fetchedProduct = await fetchProductById(parseInt(id));
          setProduct(fetchedProduct);
          setSelectedImage(fetchedProduct.images[0]);
        }
      } catch {
        showToastifyError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const cartQuantityForProduct = cartItems.find((item: CartItem) => item.id === product?.id)?.quantity || 0;
  const remainingStock = (product?.stock ?? 0) - cartQuantityForProduct;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setAddQuantity(value > 0 && value <= (product?.stock ?? 0) ? value : 1);
  };

  const handleAddToCart = () => {
    if(remainingStock <= 0) return showToastifyError('Out of stock', 'outOfStock');
    if (addQuantity > remainingStock) {
      showToastifyError('Cannot add more than available stock.', 'moreThenStock');
      return;
    }
    if(!product) return
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 0, 
      thumbnail: product.thumbnail, 
    };
    addToCart(cartItem, addQuantity);
    showToastifySuccess(`${addQuantity} item(s) added to the cart!`);
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (!product) {
    return showToastifyError('Product does not exist');
  }

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div className={styles.productDetailsContainer}>
      <div className={styles.imageSection}>
        <img
          src={selectedImage || product.images[0]}
          alt={product.title}
          className={styles.mainImage}
        />
        <div className={styles.imageCarousel}>
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.title} ${index + 1}`}
              className={styles.carouselImage}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      </div>
      <div className={styles.infoSection}>
        <h1>{product.title}</h1>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
        {product.discountPercentage && (
          <p className={styles.discount}>
            Discount: {product.discountPercentage}%
          </p>
        )}
        <p className={styles.description}>{product.description}</p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>Brand:</strong> {product.brand || 'N/A'}
        </p>
        <p>
          <strong>Rating:</strong> {product.rating}
        </p>
        <p>
          <strong>Stock:</strong> {remainingStock}
        </p>
        {authContext?.user?.username && <div className={styles.cartSection}>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={addQuantity}
            onChange={handleQuantityChange}
            className={styles.quantityInput}
          />
          <button onClick={handleAddToCart} className={styles.addToCartButton}>
            Add to Cart
          </button>
          </div>
        }
      </div>
    </div>
  );
};

export default ProductDetails;
