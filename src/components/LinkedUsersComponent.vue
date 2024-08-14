<template>
  <div>
    <h2>Linked Users</h2>
    <ul>
      <li v-for="user in linkedUsers" :key="user.uid">
        <p>{{ user.displayName }} ({{ user.email }})</p>
        <button @click="changeLinkStatus(user.uid, 'approved')">Approve</button>
        <button @click="changeLinkStatus(user.uid, 'rejected')">Reject</button>
        <button @click="deleteLinkedUser(user.uid)">Remove</button>
      </li>
    </ul>
    <div v-if="!linkedUsers.length">
      <p>No linked users available.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useErrorStore } from '@/stores/errorStore';

const userStore = useUserStore();
const errorStore = useErrorStore();

const linkedUsers = computed(() => userStore.linkedUsers);

const changeLinkStatus = async (uid, status) => {
  try {
    await userStore.changeLinkStatus({ uid, status });
  } catch (error) {
    console.error('Error changing link status:', error);
    errorStore.showError('Error changing link status: ', error)
  }
};

const deleteLinkedUser = async (linkedUserId) => {
  try {
    await userStore.deleteLinkedUser(linkedUserId);
  } catch (error) {
    console.error('Error deleting linked user:', error);
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button {
  margin-right: 5px;
  padding: 5px 10px;
  background-color: #4285F4;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #357ae8;
}

button.delete {
  background-color: #e74c3c;
}

button.delete:hover {
  background-color: #c0392b;
}
</style>
