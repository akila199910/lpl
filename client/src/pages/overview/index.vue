<script setup>
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import { getOverview } from '../../services/overviewService';
import { ref, onMounted, watch } from 'vue'

const players = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(4)
const selectedRole = ref('')
const selectedRating = ref('')


const setLimitBasedOnScreen = () => {
  const width = window.innerWidth;

  if (width < 640) {
    limit.value = 3; // mobile
  } else if (width < 1024) {
    limit.value = 9; // tablet
  } else if (width < 1280) {
    limit.value = 12; // desktop
  } else {
    limit.value = 16; // large screens
  }
}

const fetchPlayers = async () => {
  try {
    const response = await getOverview(currentPage.value, limit.value, selectedRole.value, selectedRating.value)

    const res = response.data;
    if (res.success) {
      players.value = res.data.players
      console.log(res.data.players)
      totalPages.value = res.data.totalPages
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  setLimitBasedOnScreen()
  fetchPlayers()

  window.addEventListener('resize', () => {
    setLimitBasedOnScreen()
    currentPage.value = 1
    fetchPlayers()
  })
})

// watch(currentPage, fetchPlayers)
watch([selectedRole, selectedRating, currentPage], () => {

  fetchPlayers()
})

</script>


<template>
  <DashboardLayout>
    <div class="flex flex-col px-4 p-2 static">

      <div class="flex flex-col gap-2 mb-4 items-center mx-auto sm:flex-row sm:gap-6 sm:mb-8">

        <div>
          <select v-model="selectedRating" class="px-6 border rounded-sm py-1 font-semibold ">
            <option value="" class="px-3 border rounded-sm py-1 font-semibold "> All Rating</option>
            <option value="50000" class="px-3 border rounded-sm py-1 font-semibold ">Rating 5</option>
            <option value="40000" class="px-3 border rounded-sm py-1 font-semibold ">Rating 4</option>
            <option value="30000" class="px-3 border rounded-sm py-1 font-semibold ">Rating 3</option>
            <option value="20000" class="px-3 border rounded-sm py-1 font-semibold ">Rating 2</option>
            <option value="10000" class="px-3 border rounded-sm py-1 font-semibold ">Rating 1</option>
          </select>
        </div>

        <div>
          <select v-model="selectedRole" class="px-3 border rounded-sm py-1 font-semibold ">
            <option value="" class="px-3 border rounded-sm py-1 font-semibold ">All Role</option>
            <option value="Batsman" class="px-3 border rounded-sm py-1 font-semibold ">Batsman</option>
            <option value="Bowler" class="px-3 border rounded-sm py-1 font-semibold ">Bowler</option>
            <option value="AllRounder" class="px-3 border rounded-sm py-1 font-semibold ">All Rounder</option>
            <option value="Wicketkeeper" class="px-3 border rounded-sm py-1 font-semibold ">Wicketkeeper</option>
          </select>
        </div>

      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto gap-4">
        <div v-for="player in players" :key="player.id"
          class="bg-white rounded-lg shadow p-2  mx-auto grid grid-cols-12 gap-x-2 max-w-3xs">
          <div class="col-span-5">
            <img src="../../assets/defualtUser.jpeg" alt="">
          </div>
          <div class="col-span-7 text-xs ">
            <div class="font-bold text-wrap break-words">{{ player.name }}</div>
            <div class="font-semibold text-wrap break-words">{{ player.role }}</div>
            <div class="font-semibold text-wrap break-words">{{ player.country }}</div>
            <div class="font-normal text-wrap break-words">Average <span class="font-semibold pl-4"
                v-if="player.role !== 'Bowler'"> {{ player.batting_average }}</span> </div>
            <div class="font-normal text-wrap break-words">Strick Rate<span class="font-semibold pl-2"
                v-if="player.role !== 'Bowler'"> {{ player.batting_strike_rate }}</span> </div>
            <div class="font-normal text-wrap break-words">Base Price<span class="font-semibold pl-2"> {{
              player.base_price }}</span></div>
          </div>
          <div class="text-3xl">
            <span v-if="player.base_price === 10000">*</span>
            <span v-else-if="player.base_price === 20000">**</span>
            <span v-else-if="player.base_price === 30000">***</span>
            <span v-else-if="player.base_price === 40000">****</span>
            <span v-else-if="player.base_price === 50000">*****</span>
          </div>
        </div>
      </div>

      <div class="fixed bottom-0 z-50   flex justify-center items-center gap-2 bg-white border-t shadow">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border rounded">
          Prev
        </button>

        <span>Page {{ currentPage }} of {{ totalPages }}</span>

        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded">
          Next
        </button>
      </div>
    </div>


    <!-- Pagination Footer -->

  </DashboardLayout>
</template>