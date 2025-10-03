<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import send from '../../assets/icons/send.svg'
import search from '../../assets/icons/search.svg'
import { getUserByName } from '../../services/userService';
// import { sendMessage } from '../../services/messageService';
import { createOrGetDM } from '../../services/conversationService';
import { getMessages, sendMessage } from '../../services/messageService';

const usersFilterList = ref([]);
const showUserList = ref(false)
const hasFilterUsers = ref(false);
const userChatList = ref(false);
const chatPage = ref(false);
const receiverDetail = ref(null);
const searchUserName = ref('')
const textMessage = ref('');

// NEW: conversation + messages state
const conversationId = ref(null);
const messages = ref([]);
const loadingMessages = ref(false);
const hasMore = ref(true);   // for pagination (load older)
const pageLimit = 30;
const getUsersList = async (val) => {

    try {

        const res = await getUserByName(val);
        usersFilterList.value = res.data?.data ?? [];
    } catch (error) {
        usersFilterList.value = [];
    }

}

watch(searchUserName, getUsersList);

const goToChat = async (user) => {
  chatPage.value = true;
  usersFilterList.value = [];
  receiverDetail.value = user;

  console.log(user.id)

  const response = await createOrGetDM(user.id);
    console.log(response)
  conversationId.value = response?.data?._id;

  messages.value = [];
  hasMore.value = true;
  await loadLatestMessages();

  await nextTick();
  scrollToBottom();
};
const loadLatestMessages = async () => {
  if (!conversationId.value) return;
  loadingMessages.value = true;
  try {
    const res = await getMessages(conversationId.value, { limit: pageLimit });

    const list = res.data .data?? [];
    messages.value = list;
    console.log(messages)         
    hasMore.value = list.length === pageLimit;
  } finally {
    loadingMessages.value = false;
  }
};

const loadOlder = async () => {
  if (!conversationId.value || !hasMore.value || loadingMessages.value) return;
  loadingMessages.value = true;
  try {
    const oldest = messages.value[0];
    const before = oldest ? new Date(oldest.createdAt).toISOString() : undefined;

    await getMessages(conversationId.value, { limit: pageLimit, before });

    const older = res.data?.data ?? [];
    hasMore.value = older.length === pageLimit;
    messages.value = [...older, ...messages.value];
  } finally {
    loadingMessages.value = false;
  }
};

const messageSubmit = async () => {
  const text = textMessage.value?.trim();
  if (!text || !conversationId.value) return; 

  const tempId = `tmp_${Date.now()}`;
  const me = 'you'; 
  const optimistic = { _id: tempId, conversationId: conversationId.value, senderId: me, text, createdAt: new Date().toISOString() };
  messages.value.push(optimistic);

  textMessage.value = '';

  try {
    console.log("shbdvgcfqwdhgqwhbnjdqwhvxnqw")

    const res = await sendMessage({ conversationId: conversationId.value, text });
    const saved = res.data?.data;
    console.log(res)
    const idx = messages.value.findIndex(m => m._id === tempId);
    if (idx !== -1) messages.value[idx] = saved;
  } catch (e) {
    const idx = messages.value.findIndex(m => m._id === tempId);
    if (idx !== -1) messages.value.splice(idx, 1);
  } finally {
    await nextTick();
    scrollToBottom();
  }
};

let listEl = null;
const setListRef = (el) => { listEl = el; };
const scrollToBottom = () => {
  if (!listEl) return;
  listEl.scrollTop = listEl.scrollHeight;
};


</script>

<template>
    <DashboardLayout>
      <div class="bg-white p-2 shadow h-[calc(100vh-120px)] mt-3 flex flex-col min-h-0">
        <!-- Search (hidden when in chat) -->
        <div :class="chatPage ? 'hidden' : 'relative max-w-[256px] flex items-center mb-4 ml-2'">
          <input type="text" placeholder="Search User Name..." class="border rounded-2xl pl-8 py-2" v-model="searchUserName" />
          <img :src="search" alt="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
        </div>
  
        <!-- Filtered users -->
        <div v-for="user in usersFilterList" :key="user.id" class="flex p-2 gap-2 items-center">
          <img src="../../assets/defualtUser.jpeg" class="rounded-full w-10 h-10 border-2" />
          <div class="flex-1 border rounded-sm cursor-pointer truncate" @click="goToChat(user)">
            <div class="px-2 text-sm font-medium truncate">{{ user.name }}</div>
            <div class="px-2 text-xs text-gray-500 truncate">( {{ user.role }} )</div>
          </div>
        </div>
  
        <!-- Chat page -->
        <div v-if="chatPage" class="flex flex-col h-full min-h-0">
          <!-- sticky header -->
          <div class="sticky top-0 z-20 bg-white/90 backdrop-blur border px-3 py-2 rounded-md">
            <div class="flex items-center gap-2">
              <img src="../../assets/defualtUser.jpeg" class="rounded-full w-10 h-10 border-2" />
              <div class="text-sm">
                <div class="font-medium truncate">{{ receiverDetail?.name }}</div>
                <div class="text-gray-500">( {{ receiverDetail?.role }} )</div>
              </div>
            </div>
          </div>
  
          <!-- messages scroller -->
          <div
            class="flex-1 overflow-y-auto px-3 py-3 space-y-3"
            ref="setListRef"
            @scroll.passive="(e) => { if (e.target.scrollTop < 60) loadOlder(); }"
          >
            <div v-for="m in messages" :key="m._id" class="p-3 bg-indigo-200 rounded-xl shadow break-words">
              {{ m.text }}
              <div class="text-end text-xs font-semibold">{{ new Date(m.createdAt).toLocaleTimeString() }}</div>
            </div>
          </div>
  
          <!-- composer -->
          <div class="flex items-center gap-2 border rounded-2xl px-3 py-2">
            <input
              type="text"
              class="flex-1 border-none outline-none"
              placeholder="Enter your message"
              v-model="textMessage"
              @keyup.enter="messageSubmit"
            />
            <img :src="send" alt="send" class="w-6 h-6 cursor-pointer" @click="messageSubmit" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  </template>
  