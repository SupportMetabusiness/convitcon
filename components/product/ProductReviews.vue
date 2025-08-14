<template>
  <div
    class="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 animate-fade-in-up border border-white/20"
  >
    <div class="flex items-center justify-between mb-6 lg:mb-8">
      <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
        Customer Reviews
      </h3>
      <div class="flex items-center gap-2">
        <div class="flex items-center">
          <FontAwesomeIcon
            v-for="i in 5"
            :key="i"
            :icon="faStar"
            class="w-4 h-4 sm:w-5 sm:h-5"
            :class="i <= 4 ? 'text-yellow-400' : 'text-gray-300'"
          />
        </div>
        <span class="text-lg font-bold text-gray-900">4.8</span>
        <span class="text-sm text-gray-600">(2,847 reviews)</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div class="text-3xl font-bold text-gray-800 mb-1">95%</div>
        <div class="text-sm text-gray-600 font-medium">
          Recommend this product
        </div>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div class="text-3xl font-bold text-gray-800 mb-1">4.8/5</div>
        <div class="text-sm text-gray-600 font-medium">Average rating</div>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div class="text-3xl font-bold text-gray-800 mb-1">2,847</div>
        <div class="text-sm text-gray-600 font-medium">Total reviews</div>
      </div>
    </div>

    <div class="space-y-6">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="border-b border-gray-200 pb-6 last:border-b-0"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              {{ review.name.charAt(0) }}
            </div>
            <div>
              <h4 class="font-bold text-gray-900 text-lg">{{ review.name }}</h4>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex items-center">
                  <FontAwesomeIcon
                    v-for="i in 5"
                    :key="i"
                    :icon="faStar"
                    class="w-4 h-4"
                    :class="
                      i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    "
                  />
                </div>
                <span class="text-sm text-gray-500 font-medium">{{
                  review.date
                }}</span>
              </div>
            </div>
          </div>
          <div
            class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold"
          >
            Verified Purchase
          </div>
        </div>
        <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
        <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <button
            class="flex items-center gap-1 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon :icon="faThumbsUp" class="w-4 h-4" />
            Helpful ({{ review.helpful }})
          </button>
          <button class="hover:text-gray-700 transition-colors">Reply</button>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-200 text-center">
      <button
        class="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Write a Review
      </button>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const reviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    rating: 5,
    date: "2 days ago",
    helpful: 12,
    comment:
      "Amazing quality! The fabric is incredibly soft and the fit is perfect. I've received so many compliments wearing this set. The colors are vibrant and exactly as shown in the pictures. Definitely worth every penny and I'll be ordering more colors soon!",
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    rating: 4,
    date: "1 week ago",
    helpful: 8,
    comment:
      "Great set overall, very comfortable for daily wear. The material feels premium and the stitching is solid. Only minor issue is that it runs slightly large, so consider sizing down. The color is exactly as shown and the shipping was fast.",
  },
  {
    id: 3,
    name: "Emma Thompson",
    rating: 5,
    date: "2 weeks ago",
    helpful: 15,
    comment:
      "Love this outfit! Perfect for summer activities and casual outings. The breathable fabric keeps me cool all day. Customer service was excellent when I had questions about sizing. Fast shipping and excellent packaging. Highly recommend!",
  },
  {
    id: 4,
    name: "David Chen",
    rating: 5,
    date: "3 weeks ago",
    helpful: 6,
    comment:
      "Exceeded my expectations! The quality is outstanding for the price point. Very comfortable and stylish. My wife loved it so much she ordered one for herself. Will definitely be a repeat customer.",
  },
];
</script>
