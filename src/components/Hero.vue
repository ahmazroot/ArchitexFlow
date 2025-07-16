<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import Button from "./ui/button/Button.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="px-6 lg:px-12 py-12 lg:py-20">
    <div class="grid lg:grid-cols-3 gap-12 items-center max-w-7xl mx-auto">
      <!-- Left Content (2/3) -->
      <div class="space-y-8 col-span-3 lg:col-span-2">
        <!-- Main Heading -->
        <div class="space-y-4">
          <h1 class="text-5xl lg:text-7xl font-bold text-black leading-tight">
            INNOVATION
            <span
              class="text-orange-500 animate-spin inline-flex items-center justify-center w-6 h-6 rounded-full border border-orange-400 shadow-md transform origin-center"
            >
              I
            </span>

            SHAPES
          </h1>
          <h2
            class="text-5xl lg:text-7xl font-bold text-black italic leading-tight"
          >
            DESIGN
          </h2>
        </div>

        <!-- Description -->
        <p class="text-gray-600 text-lg leading-relaxed max-w-xs lg:max-w-md">
          Innovation isn’t just part of the process — it's the foundation. We
          shape every design with forward-thinking ideas, blending form,
          function, and technology to craft experiences that inspire and endure.
        </p>

        <div class="flex items-center gap-4">
          <router-link :to="{ name: 'Draw' }">
            <Button
              class="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-none hover:cursor-pointer font-medium"
            >
              Get Started
              <ArrowUpRight class="w-4 h-4 ml-2" />
            </Button>
          </router-link>
        </div>
      </div>

      <!-- Right Content (1/3) -->
      <div className="relative flex justify-center items-center">
        <div className="relative w-80 h-80">
          <div className="absolute inset-0 transform rotate-90">
            <div
              className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 transform rotate-45 rounded-3xl shadow-2xl"
            >
              <div
                className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white to-gray-200 rounded-tl-3xl"
              ></div>
              <div
                className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-gray-100 to-gray-300 rounded-tr-3xl"
              ></div>
              <div
                className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-gray-300 to-gray-400 rounded-bl-3xl"
              ></div>
              <div
                className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-gray-400 to-gray-500 rounded-br-3xl"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
