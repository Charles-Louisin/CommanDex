'use client';

import { useEffect, useState } from 'react';
import { useMenu } from '@/hooks/useMenu';
import { useTableStore } from '@/store/table.store';
import { useCartStore } from '@/store/cart.store';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import { Product, Category } from '@/types/menu';
import { ShoppingCart, Search, Star, Clock, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';
import ReactPaginate from 'react-paginate';

export default function MenuPage() {
  const { restaurantId, tableId } = useTableStore();
  const { data: menuData, isLoading, error } = useMenu(restaurantId || 'rest_001');
  const { addItem } = useCartStore();
  const { t } = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9; // 3 columns × 3 rows

  // All hooks must be called before any early returns
  useEffect(() => {
    if (!restaurantId || !tableId) {
      toast.warning(t('menu.scanQRCode'));
    }
  }, [restaurantId, tableId, t]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory, searchQuery]);

  // Early returns after all hooks
  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error loading menu</div>;
  if (!menuData) return <div>No menu data available</div>;

  const { restaurant, categories, products } = menuData;

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination calculations
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl || null,
    });
    toast.success(t('menu.itemAddedToOrder', { productName: product.name }));
  };

  return (
    <div className="space-y-6">
      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-primary">{restaurant?.name}</h1>
        {restaurant?.description && (
          <p className="text-text-muted mt-2">
            {restaurant.description === 'Premium dining experience' 
              ? t('menu.premiumDiningExperience')
              : restaurant.description}
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        <input
          type="text"
          placeholder={t('menu.searchMenu')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            !selectedCategory
              ? 'bg-primary text-white'
              : 'bg-white text-text-primary border border-border hover:border-primary'
          }`}
        >
          {t('menu.allCategories')}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-white text-text-primary border border-border hover:border-primary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => {
          const category = categories.find((cat) => cat.id === product.categoryId);
          const discountedPrice = product.discount
            ? product.price * (1 - product.discount / 100)
            : null;
          const stockStatus = product.available
            ? t('menu.inStock', { stock: product.stock || 0 })
            : t('menu.outOfStock');

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Image Section */}
              {product.imageUrl && (
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Discount Badge */}
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{product.discount}%
                    </div>
                  )}
                  {/* Wishlist Icon */}
                  <button className="absolute top-3 left-3 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm">
                    <Heart size={18} className="text-gray-400" />
                  </button>
                </div>
              )}

              {/* Content Section */}
              <div className="p-5">
                {/* Category and Stock Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-yellow-500 uppercase">
                    {category?.name || 'FOOD'}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      product.available ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {stockStatus}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-bold text-primary mb-2">{product.name}</h3>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-text-muted mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= Math.round(product.rating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">
                      ({product.rating.toFixed(1)})
                    </span>
                    {product.reviewCount && (
                      <span className="text-xs text-text-muted">
                        • {product.reviewCount} {t('menu.reviews')}
                      </span>
                    )}
                  </div>
                )}

                {/* Preparation Time */}
                {product.preparationTime && (
                  <div className="flex items-center gap-1 mb-4 text-xs text-text-muted">
                    <Clock size={14} />
                    <span>{product.preparationTime} {t('menu.minutes')}</span>
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex flex-col">
                    {discountedPrice ? (
                      <>
                        <span className="text-xs text-text-muted line-through">
                          {formatPriceWithCurrency(product.price, restaurant?.currency || 'FCFA')}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {formatPriceWithCurrency(Math.round(discountedPrice), restaurant?.currency || 'FCFA')}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {formatPriceWithCurrency(product.price, restaurant?.currency || 'FCFA')}
                      </span>
                    )}
                  </div>
                  {product.available ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                    >
                      <ShoppingCart size={18} />
                      {t('menu.placeOrder')}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
                    >
                      {t('menu.outOfStock')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">{t('menu.noProductsFound')}</p>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<ChevronRight size={20} />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel={<ChevronLeft size={20} />}
            renderOnZeroPageCount={null}
            containerClassName="flex items-center gap-2"
            pageClassName="px-3 py-2 rounded-lg border border-border hover:bg-primary-50 hover:border-primary transition-colors"
            pageLinkClassName="text-text-primary font-medium"
            activeClassName="bg-primary text-white border-primary"
            activeLinkClassName="text-white"
            previousClassName="px-3 py-2 rounded-lg border border-border hover:bg-primary-50 hover:border-primary transition-colors"
            previousLinkClassName="text-text-primary flex items-center"
            nextClassName="px-3 py-2 rounded-lg border border-border hover:bg-primary-50 hover:border-primary transition-colors"
            nextLinkClassName="text-text-primary flex items-center"
            breakClassName="px-3 py-2 text-text-muted"
            disabledClassName="opacity-50 cursor-not-allowed"
            disabledLinkClassName="cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
}

