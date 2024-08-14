<template>
  <div class="submission-form">
    <h2>Create a New Submission</h2>
    <form @submit.prevent="handleSubmission">
      <label for="locationName">Location Name:</label>
      <input type="text" v-model="newSubmission.locationName" id="locationName" placeholder="Type location" /><br />

      <label for="countryPreference">Country Preference:</label>
      <select v-model="newSubmission.countryPreference" id="countryPreference">
        <option value="">Select a Country</option>
        <option v-for="country in countries" :key="country.code" :value="country.name">{{ country.name }}</option>
      </select><br />

      <label for="travelingWithKids">Traveling with Kids:</label>
      <input type="checkbox" v-model="newSubmission.travelingWithKids" id="travelingWithKids" /><br />

      <label for="activityPreference">Activity Preference:</label>
      <select v-model="newSubmission.activityPreference" id="activityPreference">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select><br />

      <label for="interestFocus">Interest Focus:</label>
      <select v-model="newSubmission.interestFocus" id="interestFocus">
        <option value="culture">Culture</option>
        <option value="nature">Nature</option>
        <option value="both">Both</option>
      </select><br />

      <label for="budgetLevel">Budget Level:</label>
      <select v-model="newSubmission.budgetLevel" id="budgetLevel">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select><br />

      <label for="travelStyle">Travel Style:</label>
      <select v-model="newSubmission.travelStyle" id="travelStyle">
        <option value="family-friendly">Family-friendly</option>
        <option value="luxury">Luxury</option>
        <option value="budget">Budget</option>
        <option value="moderate">Moderate</option>
      </select><br />

      <label for="tripDuration">Trip Duration:</label>
      <select v-model="newSubmission.tripDuration" id="tripDuration">
        <option value="short">Short</option>
        <option value="medium">Medium</option>
        <option value="long">Long</option>
      </select><br /><br />

      <label for="seasonPreference">Season Preference:</label>
      <select v-model="newSubmission.seasonPreference" id="seasonPreference">
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
        <option value="autumn">Autumn</option>
        <option value="winter">Winter</option>
      </select><br /><br />

      <label for="specialConsiderations">Special Considerations:</label>
      <textarea v-model="newSubmission.specialConsiderations" id="specialConsiderations"></textarea><br />

      <div class="rating-container">
        <label for="submitterScore">Submitter Score:</label>
        <input type="number" v-model.number="newSubmission.rating.submitterScore" min="1" max="5" :readonly="newSubmission.submittedBy.uid === user?.uid" id="submitterScore" />
        <br />
      </div>

      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useSubmitStore } from '@/stores/submitStore';
import { useErrorStore } from '@/stores/errorStore';
import countries from '../assets/countries.json'; 

const userStore = useUserStore();
const submitStore = useSubmitStore();
const errorStore = useErrorStore();

const user = computed(() => userStore.currentUser);
const newSubmission = ref({
  activityPreference: '',
  budgetLevel: '',
  countryPreference: '',
  interestFocus: '',
  locationName: '',
  ratedBy: { uid: null, displayName: "dummy" },
  rating: { submitterScore: 0, raterScore: 0, score: 0 },
  seasonPreference: '',
  specialConsiderations: '',
  status: 'pending',
  submittedBy: { uid: null, displayName: "dummy" },
  travelStyle: '',
  travelingWithKids: false,
  tripDuration: '',
});
const showForm = ref(false);

const validateSubmission = () => {
  if (!newSubmission.value.locationName) {
    alert("Please fill out the location name.");
    return false;
  }
  if (!newSubmission.value.rating.submitterScore) {
    alert("Please fill out your rating.");
    return false;
  }
  if (!user.value) {
    console.log("User not available");
    return false;
  }
  return true;
};

const handleSubmission = async () => {
  if (!validateSubmission()) return;
  try {
    newSubmission.value.submittedBy = { uid: user.value.uid, displayName: user.value.displayName };
    const submissionId = await submitStore.addSubmission(newSubmission.value);
    if (submissionId) {
      resetForm();
      await submitStore.fetchSubmissions();
    } else {
      errorStore.showError('An error occurred: Failed to return submission ID from Firestore.');
      throw new Error('Failed to return submission ID from Firestore.');
    }
  } catch (error) {
    console.error("Failed to submit:", error);
    errorStore.showError('An error occurred: ' + error.message);
  }
};

const resetForm = () => {
  showForm.value = false;
  newSubmission.value = {
    activityPreference: '',
    budgetLevel: '',
    countryPreference: '',
    interestFocus: '',
    locationName: '',
    ratedBy: { uid: null, displayName: "dummy" },
    rating: { submitterScore: 0, raterScore: 0, averageScore: 0 },
    seasonPreference: '',
    specialConsiderations: '',
    status: 'pending',
    submittedBy: { uid: null, displayName: "dummy" },
    travelStyle: '',
    travelingWithKids: false,
    tripDuration: '',
  };
};
</script>
