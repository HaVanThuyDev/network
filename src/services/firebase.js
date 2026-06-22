import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCng2UuGP5SFNH5DU7_cpMrZ48jpuUa0Vo",
  authDomain: "network-70d9d.firebaseapp.com",
  projectId: "network-70d9d",
  storageBucket: "network-70d9d.firebasestorage.app",
  messagingSenderId: "91087049112",
  appId: "1:91087049112:web:89034a1c27f1999f715bed",
  measurementId: "G-694E2KW78R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const MEDIA_DOC_REF = doc(db, "app_data", "media");

/**
 * Fetch media list from Firestore
 * @returns {Promise<Array|null>} Array of media items or null if not found/error
 */
export const fetchMediaListFromFirebase = async () => {
  try {
    const docSnap = await getDoc(MEDIA_DOC_REF);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (Array.isArray(data.items)) {
        return data.items;
      }
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Firebase:", error);
    return null;
  }
};

/**
 * Save media list to Firestore
 * @param {Array} mediaList List of media items to save
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const saveMediaListToFirebase = async (mediaList) => {
  try {
    if (!Array.isArray(mediaList)) {
      throw new Error("Dữ liệu lưu trữ phải là một mảng.");
    }
    await setDoc(MEDIA_DOC_REF, {
      items: mediaList,
      updatedAt: Date.now()
    });
    return true;
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu lên Firebase:", error);
    return false;
  }
};
