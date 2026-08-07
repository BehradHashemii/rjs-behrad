import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import mockData from "../data/mockData.json";

// --- ARTICLES ---
export async function getArticlesFromFirestore() {
  try {
    const articlesCol = collection(db, "articles");
    const snapshot = await getDocs(articlesCol);
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      return list;
    }

    // Seed initial articles if collection is empty
    if (mockData.articles && mockData.articles.length > 0) {
      const seeded = [];
      for (const item of mockData.articles) {
        const itemDoc = doc(articlesCol, String(item.id));
        const data = {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(itemDoc, data, { merge: true });
        seeded.push({ id: String(item.id), ...item });
      }
      return seeded;
    }
    return [];
  } catch (error) {
    console.warn(
      "Firestore getArticles warning, falling back to local dataset:",
      error,
    );
    return mockData.articles || [];
  }
}

export async function addArticleToFirestore(articleData) {
  try {
    const articlesCol = collection(db, "articles");
    const docRef = await addDoc(articlesCol, {
      ...articleData,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("fa-IR"),
    });
    return { id: docRef.id, ...articleData };
  } catch (error) {
    console.error("Error adding article to Firestore:", error);
    throw error;
  }
}

export async function updateArticleInFirestore(id, updatedData) {
  try {
    const docRef = doc(db, "articles", String(id));
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
    return { id, ...updatedData };
  } catch (error) {
    console.error("Error updating article in Firestore:", error);
    throw error;
  }
}

export async function deleteArticleFromFirestore(id) {
  try {
    const docRef = doc(db, "articles", String(id));
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting article from Firestore:", error);
    throw error;
  }
}

// --- PORTFOLIOS ---
export async function getPortfoliosFromFirestore() {
  try {
    const portfoliosCol = collection(db, "portfolios");
    const snapshot = await getDocs(portfoliosCol);
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      return list;
    }

    // Seed initial portfolios if collection is empty
    if (mockData.portfolios && mockData.portfolios.length > 0) {
      const seeded = [];
      for (const item of mockData.portfolios) {
        const itemDoc = doc(portfoliosCol, String(item.id));
        const data = {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(itemDoc, data, { merge: true });
        seeded.push({ id: String(item.id), ...item });
      }
      return seeded;
    }
    return [];
  } catch (error) {
    console.warn(
      "Firestore getPortfolios warning, falling back to local dataset:",
      error,
    );
    return mockData.portfolios || [];
  }
}

export async function addPortfolioToFirestore(portfolioData) {
  try {
    const portfoliosCol = collection(db, "portfolios");
    const docRef = await addDoc(portfoliosCol, {
      ...portfolioData,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("fa-IR"),
    });
    return { id: docRef.id, ...portfolioData };
  } catch (error) {
    console.error("Error adding portfolio to Firestore:", error);
    throw error;
  }
}

export async function updatePortfolioInFirestore(id, updatedData) {
  try {
    const docRef = doc(db, "portfolios", String(id));
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
    return { id, ...updatedData };
  } catch (error) {
    console.error("Error updating portfolio in Firestore:", error);
    throw error;
  }
}

export async function deletePortfolioFromFirestore(id) {
  try {
    const docRef = doc(db, "portfolios", String(id));
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting portfolio from Firestore:", error);
    throw error;
  }
}

// --- CONTACT MESSAGES ---
export async function sendContactMessageToFirestore(messageData) {
  try {
    const messagesCol = collection(db, "contact_messages");
    const docRef = await addDoc(messagesCol, {
      ...messageData,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("fa-IR"),
      status: "unread",
    });
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error("Error saving contact message to Firestore:", error);
    throw error;
  }
}

export async function getContactMessagesFromFirestore() {
  try {
    const messagesCol = collection(db, "contact_messages");
    const snapshot = await getDocs(messagesCol);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Error fetching contact messages from Firestore:", error);
    return [];
  }
}

// --- USER TICKETS ---
export async function getUserTicketsFromFirestore(userId) {
  try {
    const ticketsCol = collection(db, "tickets");
    let q;
    if (userId) {
      q = query(ticketsCol, where("userId", "==", userId));
    } else {
      q = ticketsCol;
    }
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    return [];
  } catch (error) {
    console.warn("Error fetching tickets from Firestore:", error);
    return [];
  }
}

export async function addTicketToFirestore(userId, ticketData) {
  try {
    const ticketsCol = collection(db, "tickets");
    const docRef = await addDoc(ticketsCol, {
      ...ticketData,
      userId,
      ticketCode: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "در حال بررسی",
      date: new Date().toLocaleDateString("fa-IR"),
      createdAt: new Date().toISOString(),
      messages: [
        {
          sender: "user",
          text: ticketData.description,
          time: `${new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })} - ${new Date().toLocaleDateString("fa-IR")}`,
        },
      ],
    });
    return { id: docRef.id, ...ticketData };
  } catch (error) {
    console.error("Error creating ticket in Firestore:", error);
    throw error;
  }
}

export async function addMessageToTicketInFirestore(
  ticketId,
  messageText,
  sender = "user",
) {
  try {
    const ticketDoc = doc(db, "tickets", ticketId);
    const snapshot = await getDoc(ticketDoc);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const newMessages = [
        ...(data.messages || []),
        {
          sender,
          text: messageText,
          time: `${new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })} - ${new Date().toLocaleDateString("fa-IR")}`,
        },
      ];
      await updateDoc(ticketDoc, {
        messages: newMessages,
        updatedAt: new Date().toISOString(),
      });
      return newMessages;
    }
  } catch (error) {
    console.error("Error adding message to ticket in Firestore:", error);
    throw error;
  }
}

// --- USER ORDERS ---
export async function getUserOrdersFromFirestore(userId) {
  try {
    const ordersCol = collection(db, "orders");
    let q;
    if (userId) {
      q = query(ordersCol, where("userId", "==", userId));
    } else {
      q = ordersCol;
    }
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    return [];
  } catch (error) {
    console.warn("Error fetching orders from Firestore:", error);
    return [];
  }
}

export async function addOrderToFirestore(userId, orderData) {
  try {
    const ordersCol = collection(db, "orders");
    const docRef = await addDoc(ordersCol, {
      ...orderData,
      userId,
      orderCode: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      status: "در حال بررسی کارشناس",
      date: new Date().toLocaleDateString("fa-IR"),
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error("Error adding order to Firestore:", error);
    throw error;
  }
}

export async function getAllTicketsFromFirestore() {
  try {
    const ticketsCol = collection(db, "tickets");
    const snapshot = await getDocs(ticketsCol);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Error fetching all tickets:", error);
    return [];
  }
}

export async function updateTicketStatusInFirestore(ticketId, status) {
  try {
    const ticketDoc = doc(db, "tickets", ticketId);
    await updateDoc(ticketDoc, { status, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
}

export async function getAllOrdersFromFirestore() {
  try {
    const ordersCol = collection(db, "orders");
    const snapshot = await getDocs(ordersCol);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Error fetching all orders:", error);
    return [];
  }
}

export async function updateOrderStatusInFirestore(orderId, status) {
  try {
    const orderDoc = doc(db, "orders", orderId);
    await updateDoc(orderDoc, { status, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function deleteContactMessageFromFirestore(id) {
  try {
    const docRef = doc(db, "contact_messages", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting contact message:", error);
    throw error;
  }
}

// --- USER PROFILE IN FIRESTORE ---
export async function getUserProfileFromFirestore(userId) {
  try {
    const userDoc = doc(db, "users", userId);
    const snapshot = await getDoc(userDoc);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.warn("Error fetching user profile from Firestore:", error);
    return null;
  }
}

export async function saveUserProfileToFirestore(userId, profileData) {
  try {
    const userDoc = doc(db, "users", userId);
    await setDoc(
      userDoc,
      {
        ...profileData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error saving user profile to Firestore:", error);
  }
}
