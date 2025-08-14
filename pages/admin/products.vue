<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <!-- Danh sách sản phẩm -->
        <div class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 mb-8">
            <div class="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-bold text-gray-900">Danh Sách Sản Phẩm</h3>
                    <p class="text-sm text-gray-600">Quản lý tất cả sản phẩm</p>
                </div>
                <div class="flex items-center space-x-3">
                    <button @click="goToCheckout" class="group bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-pink-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl flex items-center space-x-2 animate-shimmer bg-size-200">
                        <FontAwesomeIcon :icon="faShoppingCart" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>Đến Checkout</span>
                    </button>
                    <button @click="showAddForm" class="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center space-x-2">
                        <FontAwesomeIcon :icon="faPlus" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>Thêm Sản Phẩm</span>
                    </button>
                </div>
            </div>
            <div class="px-6 py-4">
                <div v-if="products.length === 0" class="text-center py-12">
                    <p class="text-gray-500 text-lg">Chưa có sản phẩm nào</p>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="product in products" :key="product.id" class="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div class="relative h-48 overflow-hidden">
                            <img :src="getProductImage(product.images) || '/img/cotton_short.webp'" :alt="product.name" class="w-full h-full object-cover" />
                            <div class="absolute top-2 right-2 flex space-x-2">
                                <a :href="`/product/${product.id}`" target="_blank" class="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg shadow-lg transition-all duration-300" title="Mở trang sản phẩm">
                                    <FontAwesomeIcon :icon="faLink" class="w-4 h-4" />
                                </a>

                                <button @click="editProduct(product)" class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg transition-all duration-300">
                                    <FontAwesomeIcon :icon="faEdit" class="w-4 h-4" />
                                </button>
                                <button @click="deleteProduct(product.id)" class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all duration-300">
                                    <FontAwesomeIcon :icon="faTrash" class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div class="p-4">
                            <h4 class="font-bold text-lg text-gray-900 mb-2">{{ product.name }}</h4>
                            <div class="text-gray-600 text-sm mb-3 line-clamp-2">
                                <div v-if="product.description && product.description.trim()" v-html="product.description.substring(0, 150) + '...'" class="prose prose-sm max-w-none"></div>
                                <div v-else class="text-gray-400 italic">Chưa có mô tả</div>
                            </div>
                            <div class="flex justify-between items-center mb-2">
                                <div class="flex items-center space-x-2">
                                    <span class="text-xl font-bold text-green-600"> ${{ getFinalPrice(product).toFixed(2) }} </span>
                                    <span v-if="product.discount > 0" class="text-sm text-gray-500 line-through"> ${{ product.price.toFixed(2) }} </span>
                                </div>
                                <span v-if="product.discount > 0" class="bg-red-500 text-white px-2 py-1 rounded-full text-xs"> -{{ product.discount }}% </span>
                            </div>
                            <div class="text-sm text-gray-600 space-y-1">
                                <div>
                                    Tồn kho: <span :class="getStockClass(product.stock)">{{ product.stock }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Form thêm/sửa sản phẩm -->
        <div v-if="showForm" class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
            <div class="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-bold text-gray-900">
                        {{ isEditing ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới' }}
                    </h3>
                    <p class="text-sm text-gray-600">
                        {{ isEditing ? 'Cập nhật thông tin sản phẩm' : 'Tạo sản phẩm mới' }}
                    </p>
                </div>
                <div class="flex space-x-3">
                    <button @click="cancelForm" class="group bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center space-x-2">
                        <FontAwesomeIcon :icon="faTimes" class="w-4 h-4" />
                        <span>Hủy</span>
                    </button>
                    <button @click="saveProduct" :disabled="loading" class="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FontAwesomeIcon :icon="faSave" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>{{ loading ? 'Đang lưu...' : isEditing ? 'Cập Nhật' : 'Thêm' }}</span>
                    </button>
                </div>
            </div>
            <div class="px-2 py-3 sm:px-4 sm:py-5 lg:p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">Thông Tin Cơ Bản</h4>

                        <div>
                            <label for="productName" class="block text-sm font-bold text-gray-700 mb-2">Tên Sản Phẩm</label>
                            <input id="productName" v-model="product.name" type="text" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md" />
                        </div>

                        <div>
                            <label for="productDescription" class="block text-sm font-bold text-gray-700 mb-2">Mô Tả</label>

                            <!-- Paste Helper Section -->
                            <div class="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                                <div class="flex items-center mb-3">
                                    <FontAwesomeIcon :icon="faInfoCircle" class="w-5 h-5 text-blue-600 mr-2" />
                                    <h5 class="text-sm font-bold text-blue-800">🚀 Copy/Paste từ Web - Siêu Dễ!</h5>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700">
                                    <div class="space-y-2">
                                        <p class="flex items-start">
                                            <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                                            <span><strong>Vào trang web:</strong> Mở bất kỳ trang sản phẩm nào (Amazon, eBay, Shopee...)</span>
                                        </p>
                                        <p class="flex items-start">
                                            <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                                            <span><strong>Select & Copy:</strong> Chọn phần mô tả + hình ảnh, nhấn Ctrl+C</span>
                                        </p>
                                        <p class="flex items-start">
                                            <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                                            <span><strong>Paste vào đây:</strong> Click vào editor dưới, nhấn Ctrl+V</span>
                                        </p>
                                    </div>
                                    <div class="space-y-2">
                                        <p class="flex items-start">
                                            <span class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                                            <span><strong>Tự động:</strong> Giữ nguyên text, emoji, định dạng</span>
                                        </p>
                                        <p class="flex items-start">
                                            <span class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                                            <span><strong>Hình ảnh:</strong> Tự động download và lưu</span>
                                        </p>
                                        <p class="flex items-start">
                                            <span class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                                            <span><strong>Bảng & List:</strong> Giữ nguyên cấu trúc</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                                    <div class="flex items-center space-x-2">
                                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">💡 Tip</span>
                                        <span class="text-xs text-blue-600">Thử paste từ: Amazon, eBay, Wikipedia, Shopee...</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <button @click="testPasteFromWeb" type="button" class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-all duration-300 flex items-center space-x-1">
                                            <FontAwesomeIcon :icon="faMagic" class="w-3 h-3" />
                                            <span>Test Paste</span>
                                        </button>
                                        <button @click="clearEditor" type="button" class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-all duration-300 flex items-center space-x-1">
                                            <FontAwesomeIcon :icon="faTrash" class="w-3 h-3" />
                                            <span>Xóa tất cả</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="border-2 border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-orange-200 focus-within:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md">
                                <ClientOnly>
                                    <DragonEditor v-model="descriptionContent" @uploadImageEvent="uploadImageEvent" @paste="handlePasteEvent" ref="dragonEditor" :useMenuBar="true" :screenChangePoint="1200" :placeholder="'📝 Nhập mô tả sản phẩm hoặc paste nội dung từ web (Ctrl+V)...'" />
                                </ClientOnly>
                            </div>

                            <!-- Batch Processing Progress Indicator -->
                            <div v-if="batchProcessing.isProcessing" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center space-x-2">
                                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <span class="text-sm font-medium text-blue-800">Xử Lý Nội Dung Lớn</span>
                                    </div>
                                    <span class="text-xs text-blue-600">{{ batchProcessing.progress }}%</span>
                                </div>
                                <div class="w-full bg-blue-200 rounded-full h-2 mb-2">
                                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: batchProcessing.progress + '%' }"></div>
                                </div>
                                <div class="flex items-center justify-between text-xs text-blue-700">
                                    <span>{{ batchProcessing.status }}</span>
                                    <span>{{ batchProcessing.currentChunk }}/{{ batchProcessing.totalChunks }} phần</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <p class="text-xs text-gray-500 flex items-center">
                                    <FontAwesomeIcon :icon="faMagic" class="w-3 h-3 mr-1 text-purple-500" />
                                    Dragon Editor hỗ trợ paste từ web, drag & drop, và nhiều tính năng khác.
                                </p>
                                <div class="flex items-center space-x-2 text-xs">
                                    <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full">{{ getEditorStatus() }}</span>
                                    <span class="text-gray-400">{{ getEditorCharCount() }} ký tự</span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label for="productCurrency" class="block text-sm font-bold text-gray-700 mb-2">Tiền Tệ</label>
                                <select id="productCurrency" v-model="product.currency" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md">
                                    <option value="USD">💵 USD ($)</option>
                                    <option value="EUR">💶 EUR (€)</option>
                                </select>
                            </div>

                            <div>
                                <label for="productPrice" class="block text-sm font-bold text-gray-700 mb-2">Giá ({{ product.currency === 'USD' ? '$' : '€' }})</label>
                                <input id="productPrice" v-model.number="product.price" type="number" step="0.01" min="0" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md" />
                            </div>

                            <div>
                                <label for="productDiscount" class="block text-sm font-bold text-gray-700 mb-2">Giảm Giá (%)</label>
                                <input id="productDiscount" v-model.number="product.discount" type="number" min="0" max="100" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md" />
                            </div>
                        </div>

                        <div>
                            <label for="productStock" class="block text-sm font-bold text-gray-700 mb-2">Số Lượng Tồn Kho</label>
                            <input id="productStock" v-model.number="product.stock" type="number" min="0" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md" />
                        </div>

                        <!-- Product Type Selection -->
                        <div>
                            <label for="productType" class="block text-sm font-bold text-gray-700 mb-2">Loại Sản Phẩm</label>
                            <select id="productType" v-model="product.product_type" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md">
                                <option value="clothing">Quần Áo (Có Size)</option>
                                <option value="home_appliance">Đồ Gia Dụng (Không Size)</option>
                                <option value="electronics">Điện Tử (Không Size)</option>
                                <option value="furniture">Nội Thất (Không Size)</option>
                                <option value="other">Khác (Không Size)</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">Chọn "Quần Áo" nếu sản phẩm cần có size. Các loại khác sẽ không hiển thị phần chọn size.</p>
                        </div>

                        <!-- Choose Size Section - Only show for clothing -->
                        <div v-if="product.product_type === 'clothing'">
                            <label class="block text-sm font-bold text-gray-700 mb-3">Choose Size</label>
                            <div class="space-y-3">
                                <div class="flex flex-wrap gap-3">
                                    <button v-for="size in availableSizes" :key="size" @click="toggleSize(size)" type="button" :class="['px-4 py-2 border-2 rounded-lg font-semibold transition-all duration-300 text-sm', selectedSizes.includes(size) ? 'border-orange-500 bg-orange-500 text-white shadow-lg' : 'border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50']">
                                        {{ size }}
                                    </button>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <input v-model="newSize" type="text" placeholder="Thêm size mới (VD: XXL)" class="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 text-sm" @keyup.enter="addNewSize" />
                                    <button @click="addNewSize" type="button" class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 text-sm flex items-center space-x-2">
                                        <FontAwesomeIcon :icon="faPlus" class="w-3 h-3" />
                                        <span>Thêm</span>
                                    </button>
                                </div>
                                <div v-if="selectedSizes.length > 0" class="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                    <p class="text-sm text-orange-800 font-semibold mb-2">Sizes đã chọn:</p>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="size in selectedSizes" :key="size" class="inline-flex items-center px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                            {{ size }}
                                            <button @click="removeSize(size)" type="button" class="ml-2 hover:bg-orange-600 rounded-full p-1 transition-colors">
                                                <FontAwesomeIcon :icon="faTimes" class="w-2 h-2" />
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 mt-2">Chọn các size có sẵn hoặc thêm size mới. Khách hàng sẽ có thể chọn từ các size này.</p>
                        </div>

                        <!-- Buy More Save More Variants Section -->
                        <div class="mt-8">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <label class="block text-sm font-bold text-gray-700">Buy More Save More</label>
                                    <p class="text-xs text-gray-500 mt-1">Tạo các biến thể giảm giá khi mua nhiều</p>
                                </div>
                                <button @click="addVariant" type="button" class="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center space-x-2">
                                    <FontAwesomeIcon :icon="faPlus" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span>Thêm Biến Thể</span>
                                </button>
                            </div>

                            <div v-if="variantsList.length === 0" class="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <p class="text-gray-500 text-sm">Chưa có biến thể nào. Nhấn "Thêm Biến Thể" để bắt đầu.</p>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="(variant, index) in variantsList" :key="index" class="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-xl border border-orange-200 shadow-sm">
                                    <div class="flex items-center justify-between mb-3">
                                        <h4 class="font-semibold text-gray-800">Biến Thể {{ index + 1 }}</h4>
                                        <button @click="removeVariant(index)" type="button" class="group bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110">
                                            <FontAwesomeIcon :icon="faTrash" class="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-600 mb-1">Số Lượng</label>
                                            <input v-model.number="variant.quantity" type="number" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 text-sm" />
                                        </div>
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-600 mb-1">Giảm Giá (%)</label>
                                            <input v-model.number="variant.discount" type="number" min="0" max="100" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 text-sm" />
                                        </div>
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-600 mb-1">Emoji</label>
                                            <select v-model="variant.emoji" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 text-sm">
                                                <option value="🔥">🔥 Fire</option>
                                                <option value="🎁">🎁 Gift</option>
                                                <option value="⚡">⚡ Lightning</option>
                                                <option value="💎">💎 Diamond</option>
                                                <option value="🌟">🌟 Star</option>
                                                <option value="🎉">🎉 Party</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- Preview -->
                                    <div class="bg-white p-3 rounded-lg border border-gray-200">
                                        <p class="text-xs font-semibold text-gray-600 mb-2">Xem Trước:</p>
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="font-bold text-lg text-gray-900">Buy {{ variant.quantity }} {{ variant.discount }}% OFF {{ variant.emoji }}</p>
                                                <p class="text-sm text-gray-600">
                                                    <span class="font-semibold text-green-600">${{ getVariantPrice(variant).toFixed(2) }}</span>
                                                    <span class="line-through text-gray-400 ml-2">${{ (product.price || 0).toFixed(2) }}</span>
                                                </p>
                                                <p class="text-xs text-orange-600 font-semibold">Save {{ variant.discount }}% - Tiết kiệm ${{ getVariantSavings(variant).toFixed(2) }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">Thông Tin Bổ Sung</h4>

                        <div>
                            <label for="careInstructions" class="block text-sm font-bold text-gray-700 mb-2">Hướng Dẫn Bảo Quản</label>
                            <textarea id="careInstructions" v-model="product.care_instructions" rows="4" placeholder="Nhập hướng dẫn bảo quản..." class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md resize-none"></textarea>
                        </div>

                        <!-- Reviews Section -->
                        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon :icon="faStar" class="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-bold text-gray-900">Reviews</h4>
                                        <p class="text-sm text-gray-600">Quản lý đánh giá sản phẩm</p>
                                    </div>
                                </div>
                                <button @click="addReview" type="button" class="group bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center space-x-2">
                                    <FontAwesomeIcon :icon="faPlus" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span>Thêm Review</span>
                                </button>
                            </div>

                            <div v-if="reviewsList.length === 0" class="text-center py-8 bg-white rounded-lg border border-gray-200">
                                <div class="text-gray-400 mb-2">
                                    <FontAwesomeIcon :icon="faStar" class="w-12 h-12 mx-auto mb-3" />
                                </div>
                                <p class="text-gray-500 font-semibold">Chưa có review nào</p>
                                <p class="text-gray-400 text-sm">Nhấn "Thêm Review" để bắt đầu</p>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="(review, index) in reviewsList" :key="index" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div class="flex items-start justify-between mb-3">
                                        <div class="flex-1">
                                            <div class="flex items-center space-x-3 mb-2">
                                                <input v-model="review.name" type="text" placeholder="Tên người đánh giá" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300" />
                                                <div class="flex items-center space-x-1">
                                                    <span class="text-sm font-semibold text-gray-700">Rating:</span>
                                                    <select v-model="review.rating" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300">
                                                        <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                                        <option value="4">⭐⭐⭐⭐ (4)</option>
                                                        <option value="3">⭐⭐⭐ (3)</option>
                                                        <option value="2">⭐⭐ (2)</option>
                                                        <option value="1">⭐ (1)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <textarea v-model="review.comment" rows="3" placeholder="Nội dung đánh giá..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 resize-none"></textarea>
                                        </div>
                                        <button @click="removeReview(index)" type="button" class="ml-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                                            <FontAwesomeIcon :icon="faTrash" class="w-4 h-4" />
                                        </button>
                                    </div>

                                    <!-- Preview -->
                                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <p class="text-xs font-semibold text-gray-600 mb-2">Xem Trước:</p>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {{ review.name ? review.name.charAt(0).toUpperCase() : 'U' }}
                                            </div>
                                            <div class="flex-1">
                                                <div class="flex items-center space-x-2 mb-1">
                                                    <span class="font-semibold text-gray-900">{{ review.name || 'Người dùng' }}</span>
                                                    <div class="flex items-center">
                                                        <span v-for="i in 5" :key="i" class="text-sm">
                                                            {{ i <= review.rating ? '⭐' : '☆' }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p class="text-gray-700 text-sm">{{ review.comment || 'Chưa có nội dung đánh giá' }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="reviewsList.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-2">
                                        <FontAwesomeIcon :icon="faInfoCircle" class="w-4 h-4 text-blue-600" />
                                        <span class="text-sm font-semibold text-blue-800">Tổng quan:</span>
                                    </div>
                                    <div class="flex items-center space-x-4 text-sm">
                                        <span class="text-blue-700">
                                            <strong>{{ reviewsList.length }}</strong> reviews
                                        </span>
                                        <span class="text-blue-700">
                                            <strong>{{ averageRating.toFixed(1) }}</strong> ⭐ trung bình
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span class="block text-sm font-bold text-gray-700 mb-2">Hình Ảnh Sản Phẩm</span>
                            <div class="space-y-3">
                                <div v-for="(_, index) in imageList" :key="index" class="flex items-center space-x-3">
                                    <input v-model="imageList[index]" type="url" placeholder="https://example.com/image.jpg" class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md" :aria-label="`URL hình ảnh ${index + 1}`" />
                                    <button v-if="index !== 0" @click="removeImage(index)" type="button" class="group bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                                        <FontAwesomeIcon :icon="faTrash" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                </div>
                                <button @click="addImage" type="button" class="w-full px-4 py-3 border-2 border-dashed border-orange-300 hover:border-orange-500 text-orange-600 hover:text-orange-700 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-orange-50 shadow-sm hover:shadow-md">
                                    <FontAwesomeIcon :icon="faPlus" class="w-4 h-4" />
                                    <span class="font-semibold">Thêm hình ảnh</span>
                                </button>
                            </div>
                            <p class="text-xs text-gray-500 mt-2">Nhập URL hình ảnh. Hình ảnh đầu tiên sẽ được dùng làm ảnh chính.</p>
                        </div>

                        <div class="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                            <h4 class="text-sm font-bold text-gray-800 mb-3">Giá Trị Tính Toán</h4>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                    <span class="text-gray-700 font-semibold text-sm">Giá Cuối:</span>
                                    <span class="font-bold text-green-600">{{ currencySymbol }}{{ finalPrice.toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                    <span class="text-gray-700 font-semibold text-sm">Tiền Giảm:</span>
                                    <span class="font-bold text-orange-600">{{ currencySymbol }}{{ discountAmount.toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSave, faPlus, faTrash, faEdit, faTimes, faLink, faShoppingCart, faInfoCircle, faMagic, faStar } from '@fortawesome/free-solid-svg-icons';

definePageMeta({
    layout: 'admin'
});

useHead({
    title: 'Quản Lý Sản Phẩm - Admin'
});

const products = ref([]);
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const product = ref({
    name: '',
    description: '',
    price: 0,
    discount: 0,
    care_instructions: '',
    images: '',
    stock: 0,
    variants: '[]',
    currency: 'USD'
});

const loading = ref(false);
const imageList = ref(['/img/cotton_short.webp']);

// Dragon Editor refs and data
const dragonEditor = ref(null);
const descriptionContent = ref([]);

// Choose Size data
const availableSizes = ref(['S', 'M', 'L', 'XL']);
const selectedSizes = ref([]);
const newSize = ref('');

// Variants data
const variantsList = ref([]);
const { tv } = useLocalization();

// Reviews data
const reviewsList = ref([]);

// Reviews computed properties
const averageRating = computed(() => {
    if (reviewsList.value.length === 0) return 0;
    const total = reviewsList.value.reduce((sum, review) => sum + parseInt(review.rating), 0);
    return total / reviewsList.value.length;
});

const finalPrice = computed(() => {
    const price = product.value.price || 0;
    const discount = product.value.discount || 0;
    return price * (1 - discount / 100);
});

const discountAmount = computed(() => {
    const price = product.value.price || 0;
    const discount = product.value.discount || 0;
    return price * (discount / 100);
});

const currencySymbol = computed(() => {
    return product.value.currency === 'USD' ? '$' : '€';
});

// Currency-based language detection
const { autoSetLanguageFromAdmin } = useCurrencyLanguage();

// Watch currency changes and auto-set language
watch(
    () => product.value.currency,
    async (newCurrency) => {
        if (newCurrency) {
            const { setLanguage } = useLocalization();
            const currencyLanguageMap = {
                USD: { language: 'en', country: 'US' },
                EUR: { language: 'fr', country: 'FR' }
            };

            const languageConfig = currencyLanguageMap[newCurrency];
            if (languageConfig) {
                console.log(`🌍 Auto-setting language to ${languageConfig.language} based on currency ${newCurrency}`);
                await setLanguage(languageConfig.language, languageConfig.country);
            }
        }
    }
);

watch(
    imageList,
    (newValue) => {
        const filteredImages = newValue.filter((img) => img.trim() !== '');
        product.value.images = JSON.stringify(filteredImages);
    },
    { deep: true }
);

watch(
    variantsList,
    (newValue) => {
        product.value.variants = JSON.stringify(newValue);
    },
    { deep: true }
);

onMounted(async () => {
    await loadProducts();
});

const loadProducts = async () => {
    try {
        loading.value = true;
        const response = await $fetch('/api/admin/product');
        products.value = response.data || [];
    } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
    } finally {
        loading.value = false;
    }
};

const showAddForm = () => {
    resetForm();
    showForm.value = true;
    isEditing.value = false;
    editingId.value = null;
};

const editProduct = async (productData) => {
    product.value = {
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        discount: productData.discount || 0,
        care_instructions: productData.care_instructions || '',
        images: productData.images || '[]',
        stock: productData.stock || 0,
        variants: productData.variants || '[]',
        currency: productData.currency || 'USD'
    };

    try {
        const images = JSON.parse(productData.images || '[]');
        imageList.value = images.length > 0 ? images : ['/img/cotton_short.webp'];
    } catch {
        imageList.value = ['/img/cotton_short.webp'];
    }

    try {
        const variants = JSON.parse(productData.variants || '[]');
        variantsList.value = variants;
    } catch {
        variantsList.value = [];
    }

    try {
        const reviews = JSON.parse(productData.reviews || '[]');
        reviewsList.value = reviews;
    } catch {
        reviewsList.value = [];
    }

    // Clear current content first
    descriptionContent.value = [];

    showForm.value = true;
    isEditing.value = true;
    editingId.value = productData.id;

    // Load HTML content into DragonEditor after component is ready
    await nextTick();
    await loadHtmlContentToEditor(productData.description || '');
};

const resetForm = () => {
    product.value = {
        name: '',
        description: '',
        price: 0,
        discount: 0,
        care_instructions: '',
        images: '',
        stock: 0,
        product_type: 'clothing',
        variants: '[]'
    };
    imageList.value = ['/img/cotton_short.webp'];
    descriptionContent.value = [];
    selectedSizes.value = [];
    newSize.value = '';
    variantsList.value = [];
    reviewsList.value = [];
};

const cancelForm = () => {
    showForm.value = false;
    isEditing.value = false;
    editingId.value = null;
    resetForm();
};

// Generate slug from product name
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
};

// Batch Processing for Large Content
const batchProcessing = ref({
    isProcessing: false,
    currentChunk: 0,
    totalChunks: 0,
    progress: 0,
    status: ''
});

// Split large content into manageable chunks
const splitContentIntoChunks = (content, maxChunkSize = 5000) => {
    console.log('📦 DEBUG: Splitting content into chunks, total length:', content.length);

    if (content.length <= maxChunkSize) {
        console.log('✅ DEBUG: Content is small enough, no chunking needed');
        return [content];
    }

    const chunks = [];
    const lines = content.split('\n');
    let currentChunk = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const potentialChunk = currentChunk + (currentChunk ? '\n' : '') + line;

        // If adding this line would exceed chunk size, save current chunk and start new one
        if (potentialChunk.length > maxChunkSize && currentChunk) {
            chunks.push(currentChunk);
            currentChunk = line;
        } else {
            currentChunk = potentialChunk;
        }
    }

    // Add the last chunk if it has content
    if (currentChunk) {
        chunks.push(currentChunk);
    }

    console.log(
        `📦 DEBUG: Split into ${chunks.length} chunks:`,
        chunks.map((c) => c.length)
    );
    return chunks;
};

// Process content chunks sequentially
const processBatchContent = async (content) => {
    console.log('🚀 DEBUG: Starting batch processing for large content');

    try {
        batchProcessing.value.isProcessing = true;
        batchProcessing.value.status = 'Phân tích nội dung...';

        // Detect if content is HTML or plain text
        const isHtmlContent = content.includes('<') && content.includes('>');
        console.log(`📋 DEBUG: Content type: ${isHtmlContent ? 'HTML' : 'Plain Text'}`);

        // Split content into chunks
        const chunks = splitContentIntoChunks(content, 2000); // Smaller chunks for better performance
        batchProcessing.value.totalChunks = chunks.length;
        batchProcessing.value.currentChunk = 0;

        if (chunks.length === 1) {
            console.log('✅ DEBUG: Content is small, processing normally');
            batchProcessing.value.isProcessing = false;

            // Process single chunk normally
            if (isHtmlContent) {
                await processRichPasteContent(content);
            } else {
                await processPlainTextPaste(content);
            }
            return content;
        }

        console.log(`📦 DEBUG: Processing ${chunks.length} chunks sequentially`);

        // Clear current editor content
        if (dragonEditor.value && dragonEditor.value.$el) {
            const editorElement = dragonEditor.value.$el;
            const contentElement = editorElement.querySelector('[contenteditable="true"]');
            if (contentElement) {
                contentElement.innerHTML = '';
            }
        }

        // Process each chunk with delay to prevent browser freeze
        for (let i = 0; i < chunks.length; i++) {
            batchProcessing.value.currentChunk = i + 1;
            batchProcessing.value.progress = Math.round(((i + 1) / chunks.length) * 100);
            batchProcessing.value.status = `Xử lý phần ${i + 1}/${chunks.length}...`;

            console.log(`📦 DEBUG: Processing chunk ${i + 1}/${chunks.length}, length: ${chunks[i].length}`);

            // Process chunk based on content type
            if (isHtmlContent) {
                await processBatchHtmlChunk(chunks[i]);
            } else {
                await processBatchTextChunk(chunks[i]);
            }

            // Small delay to prevent browser freeze and allow UI updates
            await new Promise((resolve) => setTimeout(resolve, 150));
        }

        batchProcessing.value.status = 'Hoàn thành!';
        console.log('✅ DEBUG: Batch processing completed successfully');

        // Small delay before hiding progress
        setTimeout(() => {
            batchProcessing.value.isProcessing = false;
        }, 1000);

        return content;
    } catch (error) {
        console.error('🚨 DEBUG: Error in batch processing:', error);
        batchProcessing.value.status = 'Lỗi xử lý!';
        batchProcessing.value.isProcessing = false;
        throw error;
    }
};

// Process HTML chunk in batch mode
const processBatchHtmlChunk = async (htmlChunk) => {
    try {
        if (dragonEditor.value && dragonEditor.value.$el) {
            const editorElement = dragonEditor.value.$el;
            const contentElement = editorElement.querySelector('[contenteditable="true"]');
            if (contentElement) {
                // Create temporary div to process HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlChunk;

                // Clean up unwanted elements
                await cleanupPastedContent(tempDiv);

                // Process images in this chunk
                await convertUrlsToImages(tempDiv);

                // Append processed content to editor
                const chunkDiv = document.createElement('div');
                chunkDiv.innerHTML = tempDiv.innerHTML;
                contentElement.appendChild(chunkDiv);
            }
        }
    } catch (error) {
        console.error('🚨 DEBUG: Error processing HTML chunk:', error);
    }
};

// Process text chunk in batch mode
const processBatchTextChunk = async (textChunk) => {
    try {
        if (dragonEditor.value && dragonEditor.value.$el) {
            const editorElement = dragonEditor.value.$el;
            const contentElement = editorElement.querySelector('[contenteditable="true"]');
            if (contentElement) {
                // Create div for text chunk
                const chunkDiv = document.createElement('div');

                // Convert text to HTML with line breaks
                const htmlContent = textChunk
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0)
                    .map((line) => `<div>${line}</div>`)
                    .join('');

                chunkDiv.innerHTML = htmlContent;

                // Process URLs to images in this chunk
                await convertUrlsToImages(chunkDiv);

                // Append to editor
                contentElement.appendChild(chunkDiv);
            }
        }
    } catch (error) {
        console.error('🚨 DEBUG: Error processing text chunk:', error);
    }
};

const saveProduct = async () => {
    try {
        loading.value = true;

        const filteredImages = imageList.value.filter((img) => img.trim() !== '');

        // Convert Dragon Editor content to HTML
        // Get content directly from DragonEditor DOM
        let htmlDescription = '';

        try {
            // Method 1: Try DragonEditor exposed methods with image processing
            if (dragonEditor.value && dragonEditor.value.$el) {
                const editorElement = dragonEditor.value.$el;
                console.log('🔍 DEBUG: DragonEditor element:', editorElement);

                // Try multiple selectors to find content
                const selectors = ['.dragon-editor-content', '.editor-content', '[contenteditable="true"]', '.dragon-content', '.content', 'div[contenteditable]'];

                let contentElement = null;
                for (const selector of selectors) {
                    contentElement = editorElement.querySelector(selector);
                    if (contentElement) {
                        console.log(`✅ DEBUG: Found content with selector: ${selector}`);
                        console.log('📄 DEBUG: Content element:', contentElement);
                        console.log('📝 DEBUG: Raw innerHTML:', contentElement.innerHTML);
                        break;
                    }
                }

                if (contentElement) {
                    // Clone the content to avoid modifying original
                    const clonedContent = contentElement.cloneNode(true);

                    // Process images in the cloned content
                    await processImagesInContent(clonedContent);

                    // Convert URLs to images
                    await convertUrlsToImages(clonedContent);

                    htmlDescription = clonedContent.innerHTML || '';
                    console.log('🐉 DEBUG: DragonEditor DOM content with processed images:', htmlDescription);
                } else {
                    console.log('❌ DEBUG: No content element found with any selector');
                    console.log('🔍 DEBUG: Available elements:', editorElement.children);
                }
            }

            // Method 2: Fallback to v-model content
            if (!htmlDescription && descriptionContent.value) {
                htmlDescription = convertDragonContentToHtml(descriptionContent.value);
                console.log('🔄 DEBUG: Converted from v-model:', htmlDescription);
            }

            // Method 3: Last resort - get text content
            if (!htmlDescription && dragonEditor.value && dragonEditor.value.$el) {
                const editorElement = dragonEditor.value.$el;
                const textContent = editorElement.textContent || editorElement.innerText || '';
                if (textContent.trim()) {
                    htmlDescription = `<p>${textContent.trim()}</p>`;
                    console.log('🔤 DEBUG: Text content fallback:', htmlDescription);
                }
            }
        } catch (error) {
            console.log('🚨 DEBUG: Error getting DragonEditor content:', error);
            htmlDescription = convertDragonContentToHtml(descriptionContent.value);
        }

        console.log('🎯 DEBUG: Final HTML description:', htmlDescription);

        const productData = {
            ...product.value,
            description: htmlDescription, // Use converted HTML
            images: JSON.stringify(filteredImages),
            sizes: JSON.stringify(product.value.product_type === 'clothing' ? selectedSizes.value : []),
            product_type: product.value.product_type || 'clothing',
            reviews: JSON.stringify(reviewsList.value)
        };

        if (!isEditing.value && product.value.name) {
            productData.slug = generateSlug(product.value.name);
        }

        if (isEditing.value) {
            productData.id = editingId.value;
            await $fetch('/api/admin/product', {
                method: 'PUT',
                body: productData
            });
            alert('Cập nhật sản phẩm thành công!');
        } else {
            await $fetch('/api/admin/product', {
                method: 'POST',
                body: productData
            });
            alert('Thêm sản phẩm thành công!');
        }

        await loadProducts();
        cancelForm();
    } catch (error) {
        console.error('Chi tiết lỗi:', error);
        alert(`Lỗi khi lưu sản phẩm: ${error.message || error}`);
    } finally {
        loading.value = false;
    }
};

const deleteProduct = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
        loading.value = true;
        await $fetch('/api/admin/product', {
            method: 'DELETE',
            body: { id }
        });
        alert('Xóa sản phẩm thành công!');
        await loadProducts();
    } catch (error) {
        alert('Lỗi khi xóa sản phẩm!');
        console.error('Lỗi:', error);
    } finally {
        loading.value = false;
    }
};

const getProductImage = (imagesJson) => {
    try {
        const images = JSON.parse(imagesJson || '[]');
        return images.length > 0 ? images[0] : null;
    } catch {
        return null;
    }
};

const getFinalPrice = (productData) => {
    const price = productData.price || 0;
    const discount = productData.discount || 0;
    return price * (1 - discount / 100);
};

const getStockClass = (stock) => {
    if (stock === 0) return 'text-red-600 font-bold';
    if (stock < 10) return 'text-yellow-600 font-bold';
    return 'text-green-600 font-bold';
};

// Navigate to checkout page
const goToCheckout = () => {
    navigateTo('/checkout');
};

const addImage = () => {
    imageList.value.push('/img/cotton_short.webp');
};

const removeImage = (index) => {
    if (imageList.value.length > 1) {
        imageList.value.splice(index, 1);
    } else {
        imageList.value[0] = '/img/cotton_short.webp';
    }
};

// Dragon Editor Functions

// Handle paste event to preserve structure and images
const handlePasteEvent = async (event) => {
    console.log('🎯 DEBUG: Paste event triggered');

    try {
        // Prevent default paste behavior
        event.preventDefault();

        // Get clipboard data
        const clipboardData = event.clipboardData || window.clipboardData;

        // Check for different types of clipboard data
        const htmlData = clipboardData.getData('text/html');
        const textData = clipboardData.getData('text/plain');
        const imageData = clipboardData.getData('image/png') || clipboardData.getData('image/jpeg') || clipboardData.getData('image/gif');
        const files = clipboardData.files;

        console.log('📋 DEBUG: Clipboard data types found:');
        console.log('- HTML:', htmlData ? 'Found' : 'None');
        console.log('- Text:', textData ? 'Found' : 'None');
        console.log('- Image data:', imageData ? 'Found' : 'None');
        console.log('- Files:', files?.length || 0, 'files');

        // Handle image files first
        if (files && files.length > 0) {
            console.log('🖼️ DEBUG: Processing image files from clipboard');
            await processImageFiles(files);
            return;
        }

        // Handle image data URLs
        if (imageData) {
            console.log('🖼️ DEBUG: Processing image data from clipboard');
            await processImageData(imageData);
            return;
        }

        // Determine content to process
        const contentToProcess = htmlData && htmlData.trim() ? htmlData : textData;

        if (!contentToProcess || !contentToProcess.trim()) {
            console.log('⚠️ DEBUG: No content to process');
            return;
        }

        // Check if content is large and needs batch processing
        const isLargeContent = contentToProcess.length > 5000;
        console.log(`📊 DEBUG: Content size: ${contentToProcess.length} chars, Large content: ${isLargeContent}`);

        if (isLargeContent) {
            console.log('🚀 DEBUG: Large content detected, using batch processing');
            await processBatchContent(contentToProcess);
        } else {
            console.log('⚡ DEBUG: Small content, using normal processing');
            if (htmlData && htmlData.trim()) {
                // Process rich HTML content
                await processRichPasteContent(htmlData);
            } else if (textData && textData.trim()) {
                // Fallback to plain text
                await processPlainTextPaste(textData);
            }
        }
    } catch (error) {
        console.error('🚨 DEBUG: Paste event error:', error);
        // Let default paste behavior happen if our processing fails
        return true;
    }
};

// Process rich HTML content from paste
const processRichPasteContent = async (htmlContent) => {
    console.log('🎨 DEBUG: Processing rich HTML content');

    try {
        // Create a temporary DOM element to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Clean up unwanted elements and attributes
        await cleanupPastedContent(tempDiv);

        // Process images in the content
        await processImagesInPastedContent(tempDiv);

        // Convert to DragonEditor format and insert
        await insertProcessedContentToEditor(tempDiv);
    } catch (error) {
        console.error('🚨 DEBUG: Rich content processing error:', error);
        throw error;
    }
};

// Test paste functionality with sample content
const testPasteFromWeb = async () => {
    console.log('🧪 DEBUG: Testing paste functionality');

    try {
        // Sample rich content that might be pasted from a website
        const sampleHtml = `
            <div>
                <h2>Sample Product Description</h2>
                <p>This is a <strong>high-quality product</strong> with amazing features:</p>
                <ul>
                    <li>✅ Premium quality materials</li>
                    <li>✅ 100% satisfaction guarantee</li>
                    <li>✅ Fast shipping worldwide</li>
                </ul>
                <p>Check out our <a href="https://example.com">website</a> for more details!</p>
                <img src="https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Sample+Image" alt="Sample Product Image" style="max-width: 100%; height: auto;">
                <p><em>Perfect for everyday use!</em></p>
            </div>
        `;

        console.log('🧪 DEBUG: Processing sample HTML content');
        await processRichPasteContent(sampleHtml);

        // Show success message
        alert('✅ Test paste completed! Sample content has been added to the editor.');
    } catch (error) {
        console.error('🚨 DEBUG: Test paste error:', error);
        alert('❌ Test paste failed. Check console for details.');
    }
};

// Process plain text paste
const processPlainTextPaste = async (textContent) => {
    console.log('📝 DEBUG: Processing plain text content');

    try {
        // Convert plain text to paragraphs
        const paragraphs = textContent.split('\n').filter((line) => line.trim());

        if (dragonEditor.value) {
            for (const paragraph of paragraphs) {
                if (paragraph.trim()) {
                    dragonEditor.value.addBlock({
                        type: 'paragraph',
                        content: paragraph.trim()
                    });
                }
            }
        }
    } catch (error) {
        console.error('🚨 DEBUG: Plain text processing error:', error);
        throw error;
    }
};

// Process images in content to handle external URLs and base64
const processImagesInContent = async (contentElement) => {
    const images = contentElement.querySelectorAll('img');

    for (const img of images) {
        try {
            const src = img.src;
            console.log('🖼️ DEBUG: Processing image:', src);

            // Skip if already processed or is a local URL
            if (src.startsWith('/') || src.startsWith('./') || src.includes('localhost')) {
                console.log('✅ DEBUG: Image is local, skipping:', src);
                continue;
            }

            // Handle base64 images
            if (src.startsWith('data:image/')) {
                console.log('📸 DEBUG: Base64 image found, keeping as-is');
                continue;
            }

            // Handle external URLs - keep original URL for display
            if (src.startsWith('http')) {
                console.log('🌐 DEBUG: External image URL found, keeping original URL:', src);

                // Ensure image has proper attributes for display
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.loading = 'lazy';

                // Add error handling for broken images
                img.onerror = function () {
                    console.log('❌ DEBUG: Image failed to load:', src);
                    this.style.display = 'none';
                };

                console.log('✅ DEBUG: External image processed successfully');
            }
        } catch (error) {
            console.log('🚨 DEBUG: Error processing image:', error);
        }
    }
};

// Cleanup pasted content to remove unwanted elements
const cleanupPastedContent = async (element) => {
    console.log('🧹 DEBUG: Cleaning up pasted content');

    // Remove unwanted elements
    const unwantedSelectors = ['script', 'style', 'meta', 'link', 'title', '.advertisement', '.ads', '.popup', '.modal', '[data-ad]', '[class*="ad-"]', '[id*="ad-"]', '.social-share', '.share-buttons', '.comments', '.sidebar', '.navigation', '.header', '.footer', '.breadcrumb', '.pagination', '.related-posts', 'iframe', 'object', 'embed', 'applet'];

    unwantedSelectors.forEach((selector) => {
        const elements = element.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
    });

    // Clean up attributes but preserve important ones
    const allowedAttributes = ['src', 'alt', 'title', 'href', 'target', 'colspan', 'rowspan', 'style', 'class', 'width', 'height', 'loading', 'crossorigin', 'id', 'name', 'type', 'value', 'placeholder'];

    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
        // Get all attributes
        const attributes = Array.from(el.attributes);

        // Remove unwanted attributes
        attributes.forEach((attr) => {
            if (!allowedAttributes.includes(attr.name.toLowerCase())) {
                el.removeAttribute(attr.name);
            }
        });

        // Clean up style attribute to keep only essential styles
        if (el.style) {
            const style = el.style;
            const allowedStyles = ['color', 'background-color', 'font-weight', 'font-style', 'text-align', 'text-decoration', 'font-size', 'line-height', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom', 'max-width', 'min-width', 'max-height', 'min-height'];

            const styleText = style.cssText;
            const styleRules = styleText.split(';').filter((rule) => rule.trim());
            const cleanedRules = styleRules.filter((rule) => {
                const property = rule.split(':')[0]?.trim().toLowerCase();
                return allowedStyles.some((allowed) => property?.includes(allowed));
            });

            el.style.cssText = cleanedRules.join('; ');
        }

        // Clean up class names to remove unwanted classes
        if (el.className) {
            const classes = el.className.split(' ').filter((cls) => {
                const lowerClass = cls.toLowerCase();
                return !lowerClass.includes('ad') && !lowerClass.includes('popup') && !lowerClass.includes('modal') && !lowerClass.includes('social') && !lowerClass.includes('share') && !lowerClass.includes('comment') && !lowerClass.includes('sidebar') && !lowerClass.includes('navigation') && !lowerClass.includes('breadcrumb') && !lowerClass.includes('pagination');
            });
            el.className = classes.join(' ');
        }
    });

    // Convert common web elements to semantic HTML
    const conversions = [
        { from: 'div[class*="title"]', to: 'h2' },
        { from: 'div[class*="subtitle"]', to: 'h3' },
        { from: 'div[class*="heading"]', to: 'h3' },
        { from: 'div[class*="description"]', to: 'p' },
        { from: 'div[class*="text"]', to: 'p' }
    ];

    conversions.forEach(({ from, to }) => {
        const elements = element.querySelectorAll(from);
        elements.forEach((el) => {
            const newEl = document.createElement(to);
            newEl.innerHTML = el.innerHTML;
            newEl.className = el.className;
            el.parentNode.replaceChild(newEl, el);
        });
    });

    console.log('✅ DEBUG: Content cleanup completed');
};

// Process images in pasted content
const processImagesInPastedContent = async (element) => {
    console.log('🖼️ DEBUG: Processing images in pasted content');

    const images = element.querySelectorAll('img');
    console.log(`📸 DEBUG: Found ${images.length} images to process`);

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const originalSrc = img.src;

        console.log(`🔄 DEBUG: Processing image ${i + 1}/${images.length}: ${originalSrc}`);

        try {
            // Skip if already processed or is a local URL
            if (originalSrc.startsWith('/') || originalSrc.startsWith('./') || originalSrc.includes('localhost')) {
                console.log('✅ DEBUG: Image is local, skipping');
                continue;
            }

            // Handle base64 images
            if (originalSrc.startsWith('data:image/')) {
                console.log('📸 DEBUG: Base64 image found, keeping as-is');
                continue;
            }

            // Handle external URLs - keep original URL for display
            if (originalSrc.startsWith('http')) {
                console.log('🌐 DEBUG: External image URL found, keeping original URL:', originalSrc);

                // Ensure image has proper attributes for display
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.loading = 'lazy';

                // Add error handling for broken images
                img.onerror = function () {
                    console.log('❌ DEBUG: Image failed to load:', originalSrc);
                    this.style.display = 'none';
                };

                console.log('✅ DEBUG: External image processed successfully');
            }
        } catch (error) {
            console.log(`❌ DEBUG: Error processing image ${i + 1}:`, error);
            // Keep original src if processing fails
        }
    }

    console.log('✅ DEBUG: Image processing completed');
};

// Process image files from clipboard
const processImageFiles = async (files) => {
    console.log('🖼️ DEBUG: Processing image files from clipboard');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📸 DEBUG: Processing file ${i + 1}/${files.length}:`, file.name, file.type);

        try {
            // Check if it's an image file
            if (!file.type.startsWith('image/')) {
                console.log('⚠️ DEBUG: File is not an image, skipping:', file.type);
                continue;
            }

            // Create a temporary URL for the file
            const imageUrl = URL.createObjectURL(file);

            // Add image to DragonEditor
            if (dragonEditor.value) {
                dragonEditor.value.addBlock({
                    type: 'image',
                    maxWidth: 800,
                    src: imageUrl,
                    width: 400,
                    height: 300,
                    caption: file.name,
                    classList: []
                });
                console.log('✅ DEBUG: Image added to editor successfully');
            }
        } catch (error) {
            console.error('🚨 DEBUG: Error processing image file:', error);
        }
    }
};

// Process image data from clipboard
const processImageData = async (imageData) => {
    console.log('🖼️ DEBUG: Processing image data from clipboard');

    try {
        // Create a blob from the image data
        const blob = new Blob([imageData], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        // Add image to DragonEditor
        if (dragonEditor.value) {
            dragonEditor.value.addBlock({
                type: 'image',
                maxWidth: 800,
                src: imageUrl,
                width: 400,
                height: 300,
                caption: 'Pasted Image',
                classList: []
            });
            console.log('✅ DEBUG: Image data added to editor successfully');
        }
    } catch (error) {
        console.error('🚨 DEBUG: Error processing image data:', error);
    }
};

// Convert image URLs to actual img tags
const convertUrlsToImages = async (element) => {
    console.log('🖼️ DEBUG: Converting URLs to image tags');

    // Find all text nodes that contain image URLs
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        textNodes.push(node);
    }

    for (const textNode of textNodes) {
        const text = textNode.textContent;

        // Enhanced image URL regex to catch more patterns
        const imageUrlRegex = /https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp|svg|bmp|tiff)(\?[^\s]*)?/gi;
        const matches = text.match(imageUrlRegex);

        if (matches && matches.length > 0) {
            console.log(`🔄 DEBUG: Found ${matches.length} image URLs in text:`, matches);

            let newHTML = text;

            // Replace each URL with img tag
            matches.forEach((url) => {
                // Create a more robust img tag with better styling
                const imgTag = `
                    <img src="${url}"
                         style="max-width: 100%; height: auto; display: block; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                         loading="lazy"
                         alt="Product Image"
                         onerror="this.style.display='none'; console.log('Image failed to load:', this.src);"
                         onload="console.log('Image loaded successfully:', this.src);" />
                `;
                newHTML = newHTML.replace(url, imgTag);
            });

            // Create a new element with the converted HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHTML;

            // Replace the text node with the new elements
            const parent = textNode.parentNode;
            while (tempDiv.firstChild) {
                parent.insertBefore(tempDiv.firstChild, textNode);
            }
            parent.removeChild(textNode);

            console.log('✅ DEBUG: URLs converted to image tags successfully');
        }
    }

    // Also check for base64 image data in text
    const base64Regex = /data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/gi;
    const base64Matches = element.innerHTML.match(base64Regex);

    if (base64Matches && base64Matches.length > 0) {
        console.log(`🔄 DEBUG: Found ${base64Matches.length} base64 images`);

        base64Matches.forEach((base64Data) => {
            const imgTag = `
                <img src="${base64Data}"
                     style="max-width: 100%; height: auto; display: block; margin: 10px 0; border-radius: 8px;"
                     alt="Base64 Image" />
            `;
            element.innerHTML = element.innerHTML.replace(base64Data, imgTag);
        });
    }
};

// Load HTML content into DragonEditor for editing
const loadHtmlContentToEditor = async (htmlContent) => {
    console.log('📝 DEBUG: Loading HTML content to editor for editing');

    if (!htmlContent || htmlContent.trim() === '') {
        console.log('📝 DEBUG: No content to load');
        return;
    }

    try {
        if (!dragonEditor.value) {
            console.log('❌ DEBUG: DragonEditor not available');
            return;
        }

        // Wait a bit more for DragonEditor to be fully ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Try to set HTML content directly
        if (dragonEditor.value.insertHTML) {
            dragonEditor.value.insertHTML(htmlContent);
            console.log('✅ DEBUG: Content loaded using insertHTML');
        } else {
            // Fallback: set innerHTML directly
            const editorElement = dragonEditor.value.$el;
            if (editorElement) {
                const contentElement = editorElement.querySelector('.dragon-editor-content, .editor-content, [contenteditable="true"]');
                if (contentElement) {
                    contentElement.innerHTML = htmlContent;
                    console.log('✅ DEBUG: Content loaded using direct innerHTML');
                }
            }
        }
    } catch (error) {
        console.error('🚨 DEBUG: Error loading content to editor:', error);
    }
};

// Insert processed content to DragonEditor
const insertProcessedContentToEditor = async (element) => {
    console.log('📝 DEBUG: Inserting processed content to editor');

    try {
        if (!dragonEditor.value) {
            console.log('❌ DEBUG: DragonEditor not available');
            return;
        }

        // Convert URLs to images before getting HTML content
        await convertUrlsToImages(element);

        // Get the cleaned HTML content
        const htmlContent = element.innerHTML;
        console.log('📄 DEBUG: Final HTML content length:', htmlContent.length);

        // Process content for better formatting
        const processedContent = await enhanceWebContent(htmlContent);

        // Try to insert as HTML block
        if (dragonEditor.value.insertHTML) {
            dragonEditor.value.insertHTML(processedContent);
            console.log('✅ DEBUG: Content inserted using insertHTML');
        } else if (dragonEditor.value.addBlock) {
            // Fallback: add as HTML block
            dragonEditor.value.addBlock({
                type: 'html',
                content: processedContent
            });
            console.log('✅ DEBUG: Content inserted using addBlock');
        } else {
            // Last resort: try to set innerHTML directly
            const editorElement = dragonEditor.value.$el;
            if (editorElement) {
                const contentElement = editorElement.querySelector('.dragon-editor-content, .editor-content, [contenteditable="true"]');
                if (contentElement) {
                    contentElement.innerHTML += processedContent;
                    console.log('✅ DEBUG: Content inserted using direct innerHTML');
                }
            }
        }
    } catch (error) {
        console.error('🚨 DEBUG: Error inserting content to editor:', error);
        throw error;
    }
};

// Enhance web content for better formatting
const enhanceWebContent = async (htmlContent) => {
    console.log('✨ DEBUG: Enhancing web content');

    let enhancedContent = htmlContent;

    // Add spacing between elements for better readability
    enhancedContent = enhancedContent
        .replace(/<\/p><p>/g, '</p>\n<p>')
        .replace(/<\/div><div>/g, '</div>\n<div>')
        .replace(/<\/h[1-6]><h[1-6]>/g, '</h$1>\n<h$2>');

    // Enhance common web elements
    enhancedContent = enhancedContent
        // Convert common web classes to semantic elements
        .replace(/<div[^>]*class="[^"]*title[^"]*"[^>]*>/gi, '<h2>')
        .replace(/<div[^>]*class="[^"]*subtitle[^"]*"[^>]*>/gi, '<h3>')
        .replace(/<div[^>]*class="[^"]*description[^"]*"[^>]*>/gi, '<p>')

        // Add better styling to lists
        .replace(/<ul>/g, '<ul style="margin: 10px 0; padding-left: 20px;">')
        .replace(/<ol>/g, '<ol style="margin: 10px 0; padding-left: 20px;">')

        // Enhance links
        .replace(/<a([^>]*)>/g, '<a$1 style="color: #3b82f6; text-decoration: underline;">')

        // Add better paragraph spacing
        .replace(/<p>/g, '<p style="margin: 8px 0; line-height: 1.6;">');

    // Add container div for better organization
    enhancedContent = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">${enhancedContent}</div>`;

    console.log('✅ DEBUG: Content enhancement completed');
    return enhancedContent;
};

const uploadImageEvent = async (file) => {
    try {
        // Tạo URL tạm thời cho file
        const imageUrl = URL.createObjectURL(file);

        // Thêm hình ảnh vào Dragon Editor
        if (dragonEditor.value) {
            dragonEditor.value.addBlock({
                type: 'image',
                maxWidth: 800,
                src: imageUrl,
                width: 400,
                height: 300,
                caption: file.name,
                classList: []
            });
        }
    } catch (error) {
        console.error('Lỗi khi upload hình ảnh:', error);
        alert('Lỗi khi upload hình ảnh!');
    }
};

// Choose Size Functions
const toggleSize = (size) => {
    const index = selectedSizes.value.indexOf(size);
    if (index > -1) {
        selectedSizes.value.splice(index, 1);
    } else {
        selectedSizes.value.push(size);
    }
};

const addNewSize = () => {
    if (newSize.value.trim() && !availableSizes.value.includes(newSize.value.trim().toUpperCase())) {
        const sizeToAdd = newSize.value.trim().toUpperCase();
        availableSizes.value.push(sizeToAdd);
        selectedSizes.value.push(sizeToAdd);
        newSize.value = '';
    }
};

const removeSize = (size) => {
    const index = selectedSizes.value.indexOf(size);
    if (index > -1) {
        selectedSizes.value.splice(index, 1);
    }
};

// Clear Editor Function
const clearEditor = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ nội dung mô tả?')) {
        descriptionContent.value = [];
        product.value.description = '';
    }
};

// Reviews Functions
const addReview = () => {
    reviewsList.value.push({
        name: '',
        rating: 5,
        comment: ''
    });
};

const removeReview = (index) => {
    reviewsList.value.splice(index, 1);
};

// Variants Functions
const addVariant = () => {
    variantsList.value.push({
        quantity: 1,
        discount: 10,
        emoji: '🔥'
    });
};

const removeVariant = (index) => {
    variantsList.value.splice(index, 1);
};

const getVariantPrice = (variant) => {
    const basePrice = product.value.price || 0;
    return basePrice * (1 - variant.discount / 100);
};

const getVariantSavings = (variant) => {
    const basePrice = product.value.price || 0;
    return basePrice * (variant.discount / 100);
};

// Get editor status for display
const getEditorStatus = () => {
    if (dragonEditor.value) {
        try {
            const htmlContent = dragonEditor.value.getHTML ? dragonEditor.value.getHTML() : '';
            return htmlContent && htmlContent.trim() ? 'Có nội dung' : 'Trống';
        } catch (error) {
            return descriptionContent.value && descriptionContent.value.length > 0 ? 'Có nội dung' : 'Trống';
        }
    }
    return descriptionContent.value && descriptionContent.value.length > 0 ? 'Có nội dung' : 'Trống';
};

// Get editor character count
const getEditorCharCount = () => {
    if (dragonEditor.value) {
        try {
            const htmlContent = dragonEditor.value.getHTML ? dragonEditor.value.getHTML() : '';
            return htmlContent ? htmlContent.length : 0;
        } catch (error) {
            const converted = convertDragonContentToHtml(descriptionContent.value);
            return converted ? converted.length : 0;
        }
    }
    const converted = convertDragonContentToHtml(descriptionContent.value);
    return converted ? converted.length : 0;
};

// Convert HTML to Dragon Editor content format
const convertHtmlToDragonContent = (html) => {
    if (!html || html.trim() === '') {
        return [];
    }

    // Simple conversion - split by paragraphs and create text blocks
    const lines = html.split(/\n|<br\s*\/?>/i).filter((line) => line.trim());
    return lines
        .map((line) => ({
            type: 'text',
            textContent: line.replace(/<[^>]*>/g, '').trim(),
            classList: []
        }))
        .filter((block) => block.textContent);
};

// Convert Dragon Editor content to HTML
const convertDragonContentToHtml = (content) => {
    if (!content || !Array.isArray(content) || content.length === 0) {
        return '';
    }

    return content
        .map((block) => {
            switch (block.type) {
                case 'text':
                    return `<p>${block.textContent || ''}</p>`;
                case 'heading':
                    return `<h${block.level || 1}>${block.textContent || ''}</h${block.level || 1}>`;
                case 'image':
                    return `<img src="${block.src || ''}" alt="${block.caption || ''}" style="max-width: ${block.maxWidth || 800}px;" />`;
                case 'code':
                    return `<pre><code class="language-${block.language || 'text'}">${block.textContent || ''}</code></pre>`;
                case 'list':
                    const listItems = block.child?.map((item) => `<li>${item.textContent || ''}</li>`).join('') || '';
                    return block.element === 'ol' ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
                default:
                    return `<p>${block.textContent || ''}</p>`;
            }
        })
        .join('');
};
</script>
