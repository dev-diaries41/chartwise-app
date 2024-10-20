'use server'

import { addDoc } from "@/app//lib/mongo/add";
import { getDocs } from "@/app//lib/mongo/get";
import { AddDocResponse, FindOneAndUpdateResponse, GetDocsResponse, TradeJournalEntry } from "@/app/types";
import TradeJournalModel from "@/app/models/journal"
import dbConnect from "../db";
import { RequestErrors } from "@/app/constants/errors";
import { findOneAndUpdateDoc } from "../mongo/update";

export async function addJournalEntry(entry: TradeJournalEntry): Promise<AddDocResponse>{
    await dbConnect();
    const result = await addDoc(TradeJournalModel, entry);
    return result;
}

export async function updateJournalEntry(userId: string, newEntry: TradeJournalEntry): Promise<FindOneAndUpdateResponse<TradeJournalEntry>>{
  await dbConnect();
  const result = await findOneAndUpdateDoc(TradeJournalModel, {userId, entryId: newEntry.entryId}, newEntry);
  return result;
}

export async function getJournalEntries(userId: string, page: number| string, perPage: number| string): Promise<GetDocsResponse<TradeJournalEntry>|null> {
  await dbConnect();
  try {
    const result = await getDocs<TradeJournalEntry>(TradeJournalModel, { userId}, page, perPage);
    if (!result.success || !result.data) throw new Error(result.message);
    return result;
  } catch (error: any) {
    console.error("Error in getJournalEntries: ", error.message);
    if(error.message === RequestErrors.NO_DOCS_FOUND){
      return null
    }
    throw error;
  }
}