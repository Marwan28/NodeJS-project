import { getProfileByUserId, createProfile, updateProfile, addPaymentMethod, removePaymentMethod } from "./profile_model.js";

// GET user profile
export const readProfile = async (req, res) => {
    const userId = req.decoded.id;
    const profile = await getProfileByUserId(userId);
    
    if(!profile){
        return res.status(404).json({message: "profile not found"});
    }
    
    res.json({data: profile});
};

// CREATE user profile
export const addProfile = async (req, res) => {
    const userId = req.decoded.id;
    
    // Check if profile already exists
    const existingProfile = await getProfileByUserId(userId);
    if(existingProfile){
        return res.status(400).json({message: "profile already exists"});
    }
    
    const profile = await createProfile(userId, req.body);
    res.status(201).json({message: "profile created successfully", data: profile});
};

// UPDATE user profile
export const editProfile = async (req, res) => {
    const userId = req.decoded.id;
    const profile = await getProfileByUserId(userId);
    
    if(!profile){
        return res.status(404).json({message: "profile not found"});
    }
    
    const updatedProfile = await updateProfile(profile.id, req.body);
    res.status(200).json({message: "profile updated successfully", data: updatedProfile});
};

// ADD payment method
export const addPayment = async (req, res) => {
    const userId = req.decoded.id;
    const profile = await getProfileByUserId(userId);
    
    if(!profile){
        return res.status(404).json({message: "profile not found"});
    }
    
    const paymentMethods = await addPaymentMethod(profile.id, req.body);
    res.status(201).json({message: "payment method added successfully", data: paymentMethods});
};

// REMOVE payment method
export const removePayment = async (req, res) => {
    const userId = req.decoded.id;
    const paymentMethodId = req.params.paymentId;
    
    const profile = await getProfileByUserId(userId);
    
    if(!profile){
        return res.status(404).json({message: "profile not found"});
    }
    
    const paymentMethods = await removePaymentMethod(profile.id, paymentMethodId);
    res.status(200).json({message: "payment method removed successfully", data: paymentMethods});
};
