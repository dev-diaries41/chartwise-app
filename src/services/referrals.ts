import { getDoc, getDocs } from "@src/mongo/utils/get";
import { AddDocResponse, FindOneAndUpdateResponse, GetDocsResponse, IReferral, IUser } from "@src/types";
import { addDoc } from "@src/mongo/utils/add";
import { findOneAndUpdateDoc } from "@src/mongo/utils/update";
import { User } from "@src/mongo/models/user";
import { Referrals } from "@src/mongo/models/referral";
import crypto from 'crypto';

// DEV ONLY
const referralUrlPath = 'urlPath';

function generateReferralCode(): string {
    return crypto.randomUUID(); // Generates a UUID
}

function generateReferralLink(referralCode: string): string {
    return `${referralUrlPath}/${referralCode}`;
}

async function createReferral(referrerCode: string, refereeId: string): Promise<AddDocResponse> {
    const referrerResponse = await getDoc(User, { referralCode: referrerCode });
    const refereeResponse = await getDoc(User, { _id: refereeId });

    if (!referrerResponse.success || !refereeResponse.success || !referrerResponse.data || !refereeResponse.data) {
        throw new Error('Invalid referrer or referee');
    }

    const referrer = referrerResponse.data;
    const referee = refereeResponse.data;

    const referralDoc = {
        referrer: referrer._id,
        referee: referee._id,
        status: 'pending'
    };

    const referralResponse = await addDoc(Referrals, referralDoc);

    if (referralResponse.success) {
        await findOneAndUpdateDoc(User, { _id: referrer._id }, { $push: { referredUsers: referee?._id } });
        await findOneAndUpdateDoc(User, { _id: referee?._id }, { referredBy: referrer._id });
    }

    return referralResponse;
}

async function completeReferral(referralId: string): Promise<FindOneAndUpdateResponse<IReferral>> {
    return findOneAndUpdateDoc(Referrals, { _id: referralId }, { status: 'completed' });
}

async function getReferralStatus(referralId: string): Promise<string> {
    const referralResponse = await getDoc(Referrals, { _id: referralId });

    if (!referralResponse.success || !referralResponse.data) {
        throw new Error('Referral not found');
    }
    return referralResponse.data.status;
}

async function getUserReferrals(userId: string): Promise<GetDocsResponse<IUser>> {
    const userResponse = await getDoc(User, { _id: userId });

    if (!userResponse.success || !userResponse.data) {
        throw new Error('User not found');
    }

    const referredUsersResponse = await getDocs(User, { _id: { $in: userResponse.data.referredUsers } });

    if (!referredUsersResponse.success) {
        throw new Error('No referred users found');
    }

    return referredUsersResponse;
}

export {
    generateReferralCode,
    generateReferralLink,
    createReferral,
    completeReferral,
    getReferralStatus,
    getUserReferrals
};
