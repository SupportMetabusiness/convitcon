import { ref, computed } from 'vue';

interface Product {
    id: string | number;
    name: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    image?: string;
    currency?: string;
    isVariantPricing?: boolean;
}

interface CartItem {
    id: string | number;
    name: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    color: string;
    size: string;
    quantity: number;
    image: string;
    itemKey: string;
    currency: string;
    isVariantPricing?: boolean; // Flag to indicate if salePrice is total for all quantity
    productId?: string | number; // Store original product ID for redirect
}

const cartItems = ref<CartItem[]>([]);

if (process.client) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cartItems.value = JSON.parse(savedCart);
        } catch {
            cartItems.value = [];
        }
    }
}

const saveCart = () => {
    if (process.client) {
        localStorage.setItem('cart', JSON.stringify(cartItems.value));
    }
};

export const useCart = () => {
    const generateItemKey = (productId: string | number, color: string, size: string): string => {
        return `${productId}-${color}-${size}`;
    };

    const addToCart = (product: Product, selectedColor: string, selectedSize: string, quantity: number): void => {
        if (!product || !selectedColor || !selectedSize || quantity <= 0) {
            console.error('Invalid product data or quantity');
            return;
        }

        const itemKey = generateItemKey(product.id, selectedColor, selectedSize);
        const existingItemIndex = cartItems.value.findIndex((item) => generateItemKey(item.id, item.color, item.size) === itemKey);

        if (existingItemIndex !== -1) {
            cartItems.value[existingItemIndex].quantity += quantity;
        } else {
            const newItem: CartItem = {
                id: product.id,
                name: product.name || '',
                originalPrice: product.originalPrice || 0,
                salePrice: product.salePrice || 0,
                discount: product.discount || 0,
                color: selectedColor,
                size: selectedSize,
                quantity: quantity,
                image: product.image ?? '/img/cotton_short.webp',
                itemKey,
                currency: product.currency || 'USD',
                isVariantPricing: product.isVariantPricing || false,
                productId: product.id
            };
            cartItems.value.push(newItem);
        }

        saveCart();
    };

    const removeFromCart = (itemKey: string): void => {
        // Find the item being removed to get its productId
        const itemToRemove = cartItems.value.find((item) => item.itemKey === itemKey);
        const productId = itemToRemove?.productId;

        cartItems.value = cartItems.value.filter((item) => item.itemKey !== itemKey);
        saveCart();

        if (process.client && cartItems.value.length === 0) {
            const router = useRouter();
            // Redirect to the original product page if available, otherwise go to home
            if (productId) {
                router.push(`/product/${productId}`);
            } else {
                router.push('/');
            }
        }
    };

    const updateQuantity = (itemKey: string, newQuantity: number): void => {
        if (newQuantity <= 0) {
            removeFromCart(itemKey);
            return;
        }

        const item = cartItems.value.find((item) => item.itemKey === itemKey);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
        }
    };

    const clearCart = (): void => {
        cartItems.value = [];
        saveCart();
    };

    const getItemByKey = (itemKey: string): CartItem | undefined => {
        return cartItems.value.find((item) => item.itemKey === itemKey);
    };

    const isInCart = (productId: string | number, color: string, size: string): boolean => {
        const itemKey = generateItemKey(productId, color, size);
        return cartItems.value.some((item) => item.itemKey === itemKey);
    };

    const getCartItemQuantity = (productId: string | number, color: string, size: string): number => {
        const itemKey = generateItemKey(productId, color, size);
        const item = cartItems.value.find((item) => item.itemKey === itemKey);
        return item ? item.quantity : 0;
    };

    const subtotal = computed(() => {
        return cartItems.value.reduce((total, item) => {
            if (item.isVariantPricing) {
                // For variants, salePrice is already the total for all quantity
                return total + (item.salePrice || 0);
            } else {
                // For regular items, multiply by quantity
                return total + (item.salePrice || 0) * (item.quantity || 1);
            }
        }, 0);
    });

    const tax = computed(() => {
        return 0; // Tax miễn phí
    });

    const shipping = computed(() => {
        return 0; // Shipping miễn phí
    });

    const total = computed(() => {
        return subtotal.value + tax.value + shipping.value;
    });

    const itemCount = computed(() => {
        return cartItems.value.reduce((count, item) => count + item.quantity, 0);
    });

    const isEmpty = computed(() => {
        return cartItems.value.length === 0;
    });

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemByKey,
        isInCart,
        getCartItemQuantity,
        subtotal,
        tax,
        shipping,
        total,
        itemCount,
        isEmpty
    };
};
