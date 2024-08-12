import { User } from "../mongo/models/user";
import { addDoc } from "../mongo/utils/add";
import { AddDocResponse } from "../types";
import { generateReferralCode } from "./referrals";

export async function createUser(user: {name?: string, email: string}): Promise<AddDocResponse> {
  const referralCode = generateReferralCode();
  const userDoc = { ...user, referralCode };
  return addDoc(User, userDoc);
}
