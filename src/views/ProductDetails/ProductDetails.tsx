import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../api/productApi';
import { ProductDetailsInterface } from '../../types/ProductInterfaces';
import styles from './ProductDetails.module.css';
import { showToastifyError } from '../../config/toastifyConfig';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailsInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        if (id) {
          const fetchedProduct = await fetchProductById(parseInt(id, 10));
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
          <strong>Stock:</strong> {product.stock}
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
