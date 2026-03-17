import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { encrypt, decrypt } from "../services/dataencryption.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("[DB] connectDB success", conn.connection.host);
  } catch (error) {
    console.log("[DB] connectDB error", error);
    throw error;
  }
};

const encryptTokens = (tokens) => {
  if (!tokens) return tokens;
  const encryptedTokens = { ...tokens };
  if (encryptedTokens.access_token) {
    encryptedTokens.access_token = encrypt(encryptedTokens.access_token);
  }
  if (encryptedTokens.refresh_token) {
    encryptedTokens.refresh_token = encrypt(encryptedTokens.refresh_token);
  }
  return encryptedTokens;
};

const decryptTokens = (tokens) => {
  if (!tokens) return tokens;
  const decryptedTokens = { ...tokens };
  if (decryptedTokens.access_token) {
    decryptedTokens.access_token = decrypt(decryptedTokens.access_token);
  }
  if (decryptedTokens.refresh_token) {
    decryptedTokens.refresh_token = decrypt(decryptedTokens.refresh_token);
  }
  return decryptedTokens;
};

export const saveUserDB = async (data) => {
  if (!data.email) {
    console.error("[DB] saveUserDB: email is required");
    return null;
  }

  try {
    const encryptedTokens = encryptTokens(data.tokens);
    const update = {
      $set: { tokens: encryptedTokens },
    };

    if (data.historyId) {
      update.$set.historyId = data.historyId;
    }

    if (data.watchExpiration) {
      update.$set.watchExpiration = data.watchExpiration;
    }

    const user = await User.findOneAndUpdate({ email: data.email }, update, {
      upsert: true,
      returnDocument: "after",
    });

    if (user && user.tokens) {
      user.tokens = decryptTokens(user.tokens);
    }

    return user;
  } catch (error) {
    console.error("[DB] saveUserDB error", error);
    throw error;
  }
};

export const getUserDB = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (user && user.tokens) {
      user.tokens = decryptTokens(user.tokens);
    }
    return user;
  } catch (error) {
    console.error("[DB] getUserDB error", error);
    throw error;
  }
};

export const deleteUserDB = async (email) => {
  try {
    const user = await User.findOneAndDelete({ email });
    return user;
  } catch (error) {
    console.log("[DB] deleteUserDB error", error);
    throw error;
  }
};

export const updateAccesTokenDB = async (email, accessTokendata) => {
  console.log("[DB] updateAccesTokenDB", email);
  if (!email) {
    console.error("[DB] updateAccesTokenDB: email is required");
    return null;
  }
  try {
    const encryptedTokens = encryptTokens(accessTokendata);
    const user = await User.findOneAndUpdate(
      { email: String(email) },
      { $set: { tokens: encryptedTokens } },
      { returnDocument: "after" },
    );

    if (!user) {
      console.error(
        `[DB] updateAccesTokenDB: User with email ${email} not found`,
      );
      return null;
    }

    if (user && user.tokens) {
      user.tokens = decryptTokens(user.tokens);
    }

    console.log("[DB] updateAccesTokenDB success for", email);
    return user;
  } catch (error) {
    console.error("[DB] updateAccesTokenDB error", error);
    throw error;
  }
};

export const getAccesTokenByMail = async (email) => {
  const user = await User.findOne({ email: String(email) });
  if (!user) {
    console.error(
      `[DB] getAccesTokenByMail: User with email ${email} not found`,
    );
    return null;
  }
  const decryptedTokens = decryptTokens(user.tokens);
  return decryptedTokens.access_token;
};
