<template>
  <div>
    <div v-for="submission in AllSubmissions" :key="submission.id" class="submission-card">
      <div><strong>Id: </strong> {{ submission.id }}</div>
      <div><strong>Location Name: </strong> {{ submission.locationName }}</div>
      <div><strong>Country: </strong> {{ submission.countryPreference }}</div>
      <div><strong>Status: </strong> {{ submission.status }}</div>

      <div v-if="submission.rating?.raterScore">
        <strong>Rater Scored: </strong>{{ submission.rating.raterScore }}
      </div>

      <div v-if="submission.rating?.submitterScore">
        <strong>Submitter Scored: </strong>{{ submission.rating.submitterScore }}
      </div>

      <div v-if="submission.rating?.averageScore" class="score-badge">
        Average Score: {{ submission.rating.averageScore }}
      </div>

      <div>
        <strong>Submitted By:</strong> {{ submission.submittedBy?.displayName || 'Unknown' }}
      </div>
      <div>
        <strong>Last Modified:</strong> {{ formatTimestamp(submission.lastModified) }}
      </div>

      <div class="actions">
        <!-- Edit Button for Submissions by Current User -->
        <router-link v-if="submission.submittedBy?.uid === currentUser?.uid"
          :to="{ name: 'EditSubmission', params: { id: submission.id } }" class="action-link">
          <span class="material-symbols-outlined">edit</span>
          Edit
        </router-link>

        <!-- Review Button for Submissions by Other Users -->
        <router-link v-if="submission.submittedBy?.uid !== currentUser?.uid && currentUser !== null"
          :to="{ name: 'EditSubmission', params: { id: submission.id } }" class="review-link">
          <span class="material-symbols-outlined">visibility</span>
          Review
        </router-link>

        <!-- Delete Button, Only for Submissions by Current User -->
        <button v-if="submission.submittedBy?.uid === currentUser?.uid"
          @click="confirmDelete(submission.id, currentUser?.uid)" class="delete-button">
          <span class="material-symbols-outlined">delete</span>
          Delete
        </button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { computed, onMounted } from 'vue';
import { useSubmitStore } from '@/stores/submitStore';
import { useUserStore } from '@/stores/userStore';

const submitStore = useSubmitStore();
const userStore = useUserStore();

const AllSubmissions = computed(() => submitStore.submissions);
const currentUser = computed(() => userStore.currentUser);

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString();
};

const confirmDelete = (submissionId, userId) => {
  if (confirm('Are you sure you want to delete this submission?')) {
    submitStore.deleteSubmission(submissionId, userId);
  }
}

onMounted(async () => {
    await submitStore.fetchSubmissions()
  
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600&display=swap');

.submission-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;
  border-radius: 5px;
}

.score-badge {
  font-weight: bold;
  background-color: #6dd463;
  border-radius: 3px;
  display: inline-block;
}

.actions {
  display: flex;
  flex-direction: column;
  /* Stack buttons vertically */
  position: absolute;
  bottom: 15px;
  right: 15px;
  /* Align the entire action block to the right */
}

.action-link,
.review-link,
.delete-button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  /* Adds space between the buttons */
}

/* Styles for the Edit Button */
.action-link {
  background-color: #4285F4;
  text-align: center;
}

.action-link:hover {
  background-color: #357ae8;
}

/* Styles for the Review Button */
.review-link {
  background-color: #34A853;
  text-align: center;
}

.review-link:hover {
  background-color: #2C8A42;
}

/* Styles for the Delete Button */
.delete-button {
  background-color: red;
  text-align: center;
}

.delete-button:hover {
  background-color: darkred;
}

.material-symbols-outlined {
  font-size: 24px;
  margin-bottom: 5px;
  /* Adds space between the icon and the text */
}
</style>
