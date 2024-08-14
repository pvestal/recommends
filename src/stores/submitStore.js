import { defineStore } from "pinia";
import { collection, query, where, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useUserStore } from "./userStore";
import { useErrorStore } from "./errorStore";

export const useSubmitStore = defineStore({
  id: "submitStore",
  state: () => ({
    submissions: [],
  }),
  getters: {
    AllSubmissions(state) {
      return state.submissions || [];
    },
  },
  actions: {
    setSubmissions(submissions) {
      this.submissions = submissions;
    },
    addLocalSubmission(submission) {
      this.submissions.push(submission);
    },
    updateSubmission(updatedSubmission) {
      const index = this.submissions.findIndex(
        (submission) => submission.id === updatedSubmission.id
      );
      if (index !== -1) {
        this.submissions.splice(index, 1, updatedSubmission);
      }
    },
    removeSubmission(id) {
      // Find the index of the submission with the matching ID
      const index = this.submissions.findIndex(submission => submission.id === id);
    
      // If the submission is found, remove it from the array
      if (index !== -1) {
        this.submissions.splice(index, 1);
      }
    },
    async fetchSubmissions() {
      try {
        const querySnapshot = await getDocs(collection(db, "submissions"));
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.setSubmissions(documents);
      } catch (error) {
        const errorStore = useErrorStore();
        errorStore.showError("An error occurred fetching submissions: " + error.message);
      }
    },
    async addSubmission(submissionData) {
      const userStore = useUserStore();
      await userStore.fetchLinkedUsers();

      if (!submissionData.submittedBy.uid || !submissionData.rating.submitterScore) {
        throw new Error("No authenticated user found or uid or submitterScore fields are incomplete.");
      }

      const visibleTo = userStore.linkedUsers.map((user) => user);

      const newSubmission = {
        ...submissionData,
        visibleTo,
        createdAt: Timestamp.now(),
        lastModified: Timestamp.now(),
      };

      try {
        // Add the document to Firestore and capture the ID returned by Firestore
        const docRef = await addDoc(collection(db, "submissions"), newSubmission);

        // Update the local state with the new submission including the Firestore document ID
        this.addLocalSubmission({ id: docRef.id, ...newSubmission });

        return docRef.id;
      } catch (error) {
        const errorStore = useErrorStore();
        errorStore.showError("An error occurred adding submission: " + error.message);
        throw error;
      }
    },
    async updateSubmission(updatedSubmission) {
      try {
        if (!auth.currentUser) throw new Error("No authenticated user available");

        const submissionDocRef = doc(db, "submissions", updatedSubmission.id);
        const isSubmitter = auth.currentUser.uid === updatedSubmission.submittedBy.uid;

        if (isSubmitter) {
          await updateDoc(submissionDocRef, {
            ...updatedSubmission,
            "rating.submitterScore": updatedSubmission.rating.submitterScore,
            lastModified: Timestamp.now(),
          });
        } else {
          await updateDoc(submissionDocRef, {
            ...updatedSubmission,
            ratedBy: updatedSubmission.ratedBy,
            "rating.raterScore": updatedSubmission.rating.raterScore,
            lastModified: Timestamp.now(),
            status: "reviewed",
          });
        }

        const updatedDoc = await getDoc(submissionDocRef);
        const data = updatedDoc.data();
        const averageScore = this.calculateAverage(data.rating.submitterScore, data.rating.raterScore);

        await updateDoc(submissionDocRef, {
          "rating.averageScore": averageScore,
        });

        this.updateSubmission({ ...data, id: updatedDoc.id });
      } catch (error) {
        const errorStore = useErrorStore();
        errorStore.showError("An error occurred updating submission: " + error.message);
      }
    },
    async deleteSubmission(id, uid) {
      try {
        if (auth.currentUser && auth.currentUser.uid === uid) {
          // Create a query to find the document where submittedBy.uid matches the provided uid
          const q = query(
            collection(db, "submissions"),
            where("submittedBy.uid", "==", uid)
          );
    
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const matchingDoc = querySnapshot.docs.find(doc => doc.id === id);
    
            if (matchingDoc) {
              const docRef = matchingDoc.ref;
              
              // Delete the document
              await deleteDoc(docRef);
    
              // Remove the submission from local state
              this.removeSubmission(id);
            } else {
              console.log("No matching document found for deletion.");
            }
          } else {
            console.log("No matching document found for deletion.");
          }
        } else {
          console.log("User is not authorized to delete this submission.");
        }
      } catch (error) {
        const errorStore = useErrorStore();
        errorStore.showError("An error occurred deleting submission: " + error.message);
      }
    },
    calculateAverage(submitterScore, raterScore) {
      submitterScore = submitterScore || 0;
      raterScore = raterScore || 0;
      return submitterScore > 0 && raterScore > 0
        ? (submitterScore + raterScore) / 2
        : Math.max(submitterScore, raterScore);
    },
  },
});
