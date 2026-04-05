import db from "../../config/firebase-config.js";

// GET all users
export const getUsers = async () => {
    const snapshot = await db.collection("users").get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// GET user by ID
export const getUserById = async (id) => {
    const doc = await db.collection("users").doc(id).get();
    
    if(!doc.exists){
        return null;
    }
    
    return {
        id: doc.id,
        ...doc.data()
    };
};

// GET user by email
export const getUserByEmail = async (email) => {
    const snapshot = await db.collection("users")
        .where("email", "==", email)
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

// GET user by phone
export const getUserByPhone = async (phone) => {
    const snapshot = await db.collection("users")
        .where("phone", "==", phone)
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

// CREATE user
export const createUser = async (data) => {
    const userData = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        password: data.password,
        age: data.age || null,
        role: data.role || "customer",
        isConfirmed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    
    const doc = await db.collection("users").add(userData);
    
    return {
        id: doc.id,
        ...userData
    };
};

// UPDATE user
export const updateUser = async (id, data) => {
    await db.collection("users").doc(id).update({
        ...data,
        updatedAt: Date.now()
    });
    return await getUserById(id);
};

// DELETE user
export const deleteUser = async (id) => {
    await db.collection("users").doc(id).delete();
};
