<template>
    <footer class="bg-gray-900 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 py-16">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                <!-- Company Info -->
                <div class="md:col-span-1 animate-fade-in-up">
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold mb-3 text-white">maison-aureale</h3>
                        <p class="text-gray-300 text-base leading-relaxed">Découvrez notre sélection de produits de qualité. Commander en ligne et profiter de la livraison gratuite.</p>
                    </div>

                    <div class="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                        <h4 class="font-semibold text-white mb-3 flex items-center gap-2">
                            <FontAwesomeIcon :icon="faClock" class="text-gray-400" />
                            HORAIRES D'OUVERTURE
                        </h4>
                        <div class="text-gray-300 text-sm space-y-1">
                            <p>Ouvert du lundi au samedi de 7 h à 19 h.</p>
                            <p>Ouvert le dimanche de 8 h à 13 h.</p>
                        </div>
                    </div>
                </div>

                <!-- Information Links -->
                <div class="animate-fade-in-delayed">
                    <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div class="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon :icon="faInfoCircle" class="text-gray-300 text-sm" />
                        </div>
                        INFORMATIONS
                    </h3>
                    <ul class="space-y-4">
                        <li>
                            <NuxtLink to="/#" class="group text-gray-300 hover:text-white transition-all duration-300 text-sm flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800">
                                <FontAwesomeIcon :icon="faUndo" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span class="group-hover:translate-x-1 transition-transform">Politique de retour et de remboursement</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/#" class="group text-gray-300 hover:text-white transition-all duration-300 text-sm flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800">
                                <FontAwesomeIcon :icon="faUserShield" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span class="group-hover:translate-x-1 transition-transform">Politique de confidentialité</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/#" class="group text-gray-300 hover:text-white transition-all duration-300 text-sm flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800">
                                <FontAwesomeIcon :icon="faShippingFast" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span class="group-hover:translate-x-1 transition-transform">Politique d'expédition</span>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Contact -->
                <div class="animate-fade-in-up">
                    <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div class="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon :icon="faEnvelope" class="text-gray-300 text-sm" />
                        </div>
                        CONTACT
                    </h3>
                    <div class="space-y-4">
                        <div class="bg-gray-800 rounded-xl p-4 border border-gray-700">
                            <p class="text-gray-300 text-sm mb-3">Si vous avez la moindre question, n'hésitez pas à nous contactez :</p>
                            <div class="space-y-2">
                                <a href="mailto:info@maisonaureale.com" class="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm">
                                    <FontAwesomeIcon :icon="faEnvelope" class="w-4 h-4" />
                                    info@maisonaureale.com
                                </a>
                                <a href="tel:0757826997" class="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm">
                                    <FontAwesomeIcon :icon="faPhone" class="w-4 h-4" />
                                    07 57 82 69 97
                                </a>
                            </div>
                        </div>
                        <div class="text-gray-400 text-xs">
                            <p>Nous sommes joignables du lundi au vendredi, de 9h à 17h.</p>
                            <p>En cas d'absence, laissez un message vocal.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-700 pt-8 text-center">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-gray-400 text-sm">&copy; maison-aureale.com – Tous droits réservés.</p>
                    <div class="flex items-center gap-4 text-sm text-gray-400">
                        <span>Made with</span>
                        <FontAwesomeIcon :icon="faHeart" class="text-red-500 animate-pulse" />
                        <span>in France</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClock, faInfoCircle, faUndo, faShippingFast, faUserShield, faEnvelope, faPhone, faHeart } from '@fortawesome/free-solid-svg-icons';

const currentYear = computed(() => {
    if (process.client) {
        return new Date().getFullYear();
    }
    return 2025;
});
</script>
