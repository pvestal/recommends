<template>
    <div>
      <h3 v-if="user">{{ user.displayName }} - Submissions - <button @click="toggleForm" class="toggle-button">{{ showForm ? 'Hide Form' : 'Create Submission' }}</button></h3>
      <div v-else>
        <h3>Submissions</h3>
        <p>Please log in to edit/create submissions.</p>
      </div>

      <SubmissionForm v-if="showForm" />
      <SubmissionList />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import SubmissionForm from './SubmissionForm.vue';
  import SubmissionList from './SubmissionList.vue';
  
  const userStore = useUserStore();
  const user = computed(() => userStore.currentUser);
  const showForm = ref(false);
  
  const toggleForm = () => {
    showForm.value = !showForm.value;
  };

  </script>
  
  <style scoped>
  .submission-card {
      position: relative;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      /* Add space between cards */
  }
  
  .score-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: var(--score-color, #4285F4);
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.9em;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .score-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  }
  
  @keyframes fadeIn {
      to {
          opacity: 1;
      }
  }
  
  .submission-card h2 {
      margin-top: 0;
  }
  
  .submission-card p {
      margin: 10px 0;
  }
  
  .button-container {
      display: flex;
      justify-content: space-between;
  }
  
  .edit-link,
  .delete-button {
      display: inline-block;
      padding: 10px 0;
      background-color: #4285F4;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      width: 48%;
  }
  
  .delete-button {
      background-color: #e74c3c;
      border: none;
  }
  
  .delete-button:hover {
      background-color: #c0392b;
  }
  
  .edit-link:hover {
      background-color: #357ae8;
  }
  
  .toggle-button {
      display: inline-block;
      background-color: #4285F4;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      width: auto;
  }
  
  .toggle-button:hover {
      background-color: #357ae8;
  }
  
  .submission-form {
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
  }
  
  input[type="text"],
  textarea,
  select {
      margin-bottom: 10px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 100%;
      /* Make inputs full width */
  }
  
  input[type="submit"] {
      padding: 10px;
      border: none;
      border-radius: 5px;
      background-color: #4285F4;
      color: white;
      cursor: pointer;
      width: 100%;
  }
  
  input[type="submit"]:hover {
      background-color: #357ae8;
  }
  
  .filter-section {
      display: flex;
      flex-direction: column;
      padding: 20px;
      background-color: #f4f4f4;
      border-radius: 8px;
  }
  
  .filter-section label {
      font-weight: bold;
      margin-bottom: 5px;
      color: #333;
  }
  
  .filter-section select {
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: white;
      width: 100%;
      /* Full width for better mobile usability */
  }
  
  /* Media query for mobile screens */
  @media (max-width: 768px) {
  
      .submission-form,
      .submission-card,
      .filter-section {
          padding: 10px;
      }
  
      .toggle-button,
      .edit-link,
      .delete-button,
      input[type="submit"] {
          width: 100%;
          /* Full width buttons */
      }
  
      .button-container {
          flex-direction: column;
      }
  }
  </style>
  