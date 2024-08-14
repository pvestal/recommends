<template>
  <div>
    <h1>Login</h1>
    <div v-if="errorStore.errorVisible">
      <div class="error-message">{{ errorStore.errorMessage }}</div>
    </div>
    <div v-if="!userStore.isAuthenticated">
      <button @click="handleLogin">Login</button>
    </div>
    <div v-else>
      <p>Welcome, {{ userStore.userDisplayName }}</p>
      <img v-if="user" :src="user.photoURL" class="avatar" />
      <br />
      <button v-if="user" @click="handleLogout">Logout</button>
      <p>Last Login: {{ formatTimestamp(user.lastLoginAt) }}</p>
      <p v-if="submissions">There are {{ submissions.length }} <router-link to="/submissions">submissions</router-link>.
      </p>

      <!-- <LinkedUsersComponent v-if="user" :linkedUsers="linkedUsers" :user="user"
        @handleParentChangeLinkStatus="handleParentChangeLinkStatus" :watchedProp="status" /> -->

      <!-- Toggle Button -->
      <button @click="toggleUserDetails">
        {{ showUserDetails ? 'Hide User Details' : 'Show User Details' }}
      </button>

      <UserDetails v-if="user && showUserDetails" :user="user" />
    </div>
  </div>
</template>
    
<script setup>
import { useErrorStore } from '@/stores/errorStore';
import { useUserStore } from '@/stores/userStore';
import { useSubmitStore } from '@/stores/submitStore';

import { ref, onMounted, computed, watch } from 'vue';

import UserDetails from '../components/UserDetailsComponent.vue'
// import LinkedUsersComponent from '../components/LinkedUsersComponent.vue';

const errorStore = useErrorStore();
const userStore = useUserStore();
const submitStore = useSubmitStore();
const status = ref('');
const showUserDetails = ref(false);

const user = computed(() => userStore.currentUser || null);
const linkedUsers = computed(() => userStore.linkedUsers);
const submissions = computed(() => submitStore.AllSubmissions);

const handleLogin = async () => {
  try {
    await userStore.login();
  } catch (error) {
    console.error(error);
    errorStore.showError('Login failed. Please try again.');
  }
};

const handleLogout = async () => {
  try {
    await userStore.logout();
    console.log('logged out');
  } catch (error) {
    console.error(error);
    errorStore.showError('Logout failed. Please try again.');
  }
};

const fetchUser = async () => {
  await userStore.fetchUser();
};

const fetchLinkedUsers = async () => {
  await userStore.fetchLinkedUsers();
};

const fetchSubmissions = async () => {
  await submitStore.fetchSubmissions();
};

// const handleParentChangeLinkStatus = (payload) => {
//   if (payload) {
//     userStore.changeLinkStatus(payload);
//   } else {
//     console.error("Invalid parameters for handleParentChangeLinkStatus");
//   }
// };

const formatTimestamp = (timestamp) => {
  // if (!timestamp || !timestamp.seconds) {
  //   return 'Invalid Date';
  // }

  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString();
};


const toggleUserDetails = () => {
  showUserDetails.value = !showUserDetails.value;
};

const currentStatus = computed(() => {
  const linkedUser = linkedUsers.value.find(user => user.id === status.value);
  return linkedUser ? linkedUser.status : 'changed';
});

watch(currentStatus, (newValue, oldValue) => {
  console.log(`State changed from ${oldValue} to ${newValue}`);
});

onMounted(async () => {
  await fetchUser();
  if (user.value) {
    await fetchLinkedUsers();
    await fetchSubmissions();
  }
});
</script>
    
<style scoped>
h1 {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #357ae8;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}

.avatar {
  border-radius: 50%;
}
</style>
  