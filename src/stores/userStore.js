import { defineStore } from "pinia";
import { auth, googleProvider, signInWithPopup, db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  query,
  updateDoc,
  Timestamp,
  arrayRemove,
} from "firebase/firestore";
import { useErrorStore } from "./errorStore";
import router from "../router";

export const useUserStore = defineStore({
  id: "userStore",
  state: () => ({
    user: null,
    linkedUsers: [],
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    currentUser(state) {
      return state.user;
    },
    currentLinkedUsers(state) {
      return state.linkedUsers;
    },
    userDisplayName(state) {
      return state.user ? state.user.displayName : "";
    },
  },
  actions: {
    setUser(user) {
      console.log("Setting user:", user);
      this.user = user;
    },
    clearUser() {
      this.user = null;
      this.linkedUsers = [];
    },
    async login() {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const userRef = doc(db, "users", result.user.uid);

        const userDoc = await getDoc(userRef);
        const userData = {
          uid: result.user.uid,
          displayName: result.user.displayName || "No Name",
          email: result.user.email || "No Email",
          photoURL: result.user.photoURL || "default-url",
          lastLoginAt: Timestamp.now(),
        };

        if (!userDoc.exists()) {
          userData.createdAt = Timestamp.now();
        }

        await setDoc(userRef, userData, { merge: true });
        this.setUser(userData);
        // router.push({ name: "login" });
      } catch (error) {
        const errorStore = useErrorStore();
        errorStore.showError(
          "An error occurred during login: " + error.message
        );
      }
    },
    async logout() {
      try {
        await auth.signOut();
        this.clearUser();
        router.push({ name: "login" });
      } catch (error) {
        const errorStore = useErrorStore();
        errorStore.showError(
          "An error occurred during logout: " + error.message
        );
      }
    },
    async fetchUser() {
      return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            this.setUser(user);
            resolve(user);
          } else {
            this.clearUser();
            resolve(null);
          }
        }, reject);
      });
    },
    setLinkedUsers(linkedUsers) {
      this.linkedUsers = linkedUsers;
    },
    addLinkedUser(user) {
      const index = this.linkedUsers.findIndex((u) => u.uid === user.uid);
      if (index !== -1) {
        this.linkedUsers.splice(index, 1, user);
      } else {
        this.linkedUsers.push(user);
      }
    },
    addLinkedUserRequest(request) {
      this.linkedUsers.push(request);
    },
    updateLinkedRequestStatus({ uid, status }) {
      const userIndex = this.linkedUsers.findIndex(
        (user) => user.requestedBy.uid === uid
      );
      if (userIndex !== -1) {
        this.linkedUsers[userIndex].status = status;
      }
    },
    async deleteLinkedUser(linkedUserId) {
      const errorStore = useErrorStore();
      try {
        const userDocRef = doc(db, "linkedUsers", auth.currentUser.uid);
        await updateDoc(userDocRef, {
          linkedUsers: arrayRemove({ uid: linkedUserId }),
        });
        this.linkedUsers = this.linkedUsers.filter(
          (user) => user.uid !== linkedUserId
        );
      } catch (error) {
        errorStore.showError(
          "An error occurred deleting linked user: " + error.message
        );
      }
    },

    async fetchLinkedUsers() {
      if (!this.user) return [];
      try {
        const q = query(collection(db, "linkedUsers"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          this.addLinkedUser(doc.data());
        });
      } catch (error) {
        const errorStore = useErrorStore();
        errorStore.showError(
          "An error occurred fetching linked Users: " + error.message
        );
      }
    },
  },
});
