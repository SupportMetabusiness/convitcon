<template>
    <div class="bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <!-- Left side - Building Image -->
                <div class="relative">
                    <img src="https://maisonaureale.com/wp-content/uploads/2022/01/photo_2025-07-18_01-08-15-768x512.jpg" alt="Maison Aureale Building" class="w-full h-80 lg:h-96 object-cover rounded-lg shadow-lg" />
                    <!-- Building signs overlay -->
                    <div class="absolute top-4 left-4 bg-yellow-600 text-white px-4 py-2 rounded font-bold">MAISON AUREALE</div>
                    <div class="absolute bottom-4 left-4 space-y-2">
                        <div class="bg-gray-800 text-white px-3 py-1 rounded text-sm font-semibold">BRICOLAGE</div>
                        <div class="bg-gray-800 text-white px-3 py-1 rounded text-sm font-semibold">JARDIN</div>
                        <div class="bg-gray-800 text-white px-3 py-1 rounded text-sm font-semibold">SALLE DE BAIN & CARRELAGE</div>
                    </div>
                </div>

                <!-- Right side - Business Information -->
                <div class="space-y-6">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">MAISON-AUREALE</h2>

                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">HORAIRES D'OUVERTURE :</h3>
                                <div class="text-gray-600 space-y-1">
                                    <p>Ouvert du lundi au samedi de 7 h à 19 h.</p>
                                    <p>Ouvert le dimanche de 8 h à 13 h.</p>
                                </div>
                            </div>

                            <div>
                                <p class="text-gray-800 font-semibold mb-3">COMMANDER EN LIGNE ET PROFITER DE LA LIVRAISON GRATUITE</p>
                                <button class="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded transition-colors duration-200">DÉCOUVREZ NOS PRODUITS</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Services Section -->
            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Service 1 -->
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <div class="bg-black text-white py-2 px-4 rounded mb-4">
                        <span class="font-bold text-lg">LIVRAISON</span>
                        <div class="text-yellow-400 font-bold text-xl">À DOMICILE</div>
                    </div>
                    <p class="text-sm text-gray-600">Service de livraison rapide et fiable</p>
                </div>

                <!-- Service 2 -->
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <div class="bg-black text-white py-2 px-4 rounded mb-4">
                        <span class="font-bold text-lg">INSTALLATION</span>
                        <div class="text-yellow-400 font-bold text-xl">AVEC</div>
                        <div class="text-blue-400 font-bold">needhelp</div>
                    </div>
                    <p class="text-sm text-gray-600">Installation professionnelle</p>
                </div>

                <!-- Service 3 -->
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <div class="bg-black text-white py-2 px-4 rounded mb-4">
                        <span class="font-bold text-lg">CONDUITE 2 H</span>
                        <div class="text-yellow-400 font-bold text-xl">⚡ RENDEZ-VOUS</div>
                    </div>
                    <p class="text-sm text-gray-600">Rendez-vous rapide en 2 heures</p>
                </div>

                <!-- Service 4 -->
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <div class="bg-black text-white py-2 px-4 rounded mb-4">
                        <span class="font-bold text-lg">LOCATION DE</span>
                        <div class="text-yellow-400 font-bold text-xl">FOURGONNETTES</div>
                    </div>
                    <p class="text-sm text-gray-600">Location de véhicules utilitaires</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Component logic can be added here if needed
</script>

<style scoped>
/* Additional styles if needed */
</style>
