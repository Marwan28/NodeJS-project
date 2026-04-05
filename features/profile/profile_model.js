import db from "../../config/firebase-config.js";

// GET profile by user ID
export const getProfileByUserId = async (userId) => {
    const snapshot = await db.collection("profiles")
        .where("userId", "==", userId)
        .limit(1)
        .get();
    
    if(snapshot.empty){
        return null;
    }
    
    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data()
    };
};

// CREATE profile
export const createProfile = async (userId, data) => {
    const profileData = {
        userId: userId,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        country: data.country || null,
        phone: data.phone || null,
        paymentMethods: data.paymentMethods || [],
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    
    const doc = await db.collection("profiles").add(profileData);
    
    return {
        id: doc.id,
        ...profileData
    };
};

// UPDATE profile
export const updateProfile = async (profileId, data) => {
    await db.collection("profiles").doc(profileId).update({
        ...data,
        updatedAt: Date.now()
    });
    
    const doc = await db.collection("profiles").doc(profileId).get();
    return {
        id: doc.id,
        ...doc.data()
    };
};

// ADD payment method
export const addPaymentMethod = async (profileId, paymentMethod) => {
    const doc = await db.collection("profiles").doc(profileId).get();
    const profile = doc.data();
    
    const paymentMethods = profile.paymentMethods || [];
    paymentMethods.push({
        id: Date.now().toString(),
        ...paymentMethod,
        createdAt: Date.now()
    });
    
    await db.collection("profiles").doc(profileId).update({
        paymentMethods: paymentMethods,
        updatedAt: Date.now()
    });
    
    return paymentMethods;
};

// REMOVE payment method
export const removePaymentMethod = async (profileId, paymentMethodId) => {
    const doc = await db.collection("profiles").doc(profileId).get();
    const profile = doc.data();
    
    const paymentMethods = profile.paymentMethods.filter(pm => pm.id !== paymentMethodId);
    
    await db.collection("profiles").doc(profileId).update({
        paymentMethods: paymentMethods,
        updatedAt: Date.now()
    });
    
    return paymentMethods;
};
