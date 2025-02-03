
import { Request, Response } from "express";
import { AuthErrors, ServerErrors } from "@src/constants/errors";
import { logger } from "@src/logger";
import { addJournalEntry, getJournalEntries } from "@src/services/journal";
import { cache } from "@src/index";
import { TradeJournalEntrySchema } from "@src/constants/schemas";


export async function addEntry(req: Request, res: Response) {
    try {
      const userId = req.jwtPayload?.email ;
      const {entry} = req.body;
      if(!userId) return res.status(400).json({ message: AuthErrors.INVALID_USER_ID});
  
      const validatedEntry = TradeJournalEntrySchema.safeParse({...(entry||{}), userId});
      if(!validatedEntry.success)return res.status(400).json({ message: validatedEntry.error});
  
      await addJournalEntry(validatedEntry.data);
      return res.status(200).json({ message: 'Entry saved successfully'}); 
    } catch (error: any) {
      logger.error({message: `Error in addJournalEntryController`, details: error.message});
      return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
    }
}

export async function getEntries(req: Request, res: Response) {
    const userId = req.jwtPayload?.email;
    if(!userId) return res.status(400).json({ message: AuthErrors.INVALID_USER_ID});
    try {
      const {page, perPage } = req.query;
      const cacheKey = `journal:${userId}${page}${perPage}`;
      const cachedData = await cache.get(cacheKey);
      if (cachedData) return res.status(200).json({ data: cachedData });
  
      const journalEntriesResults = await getJournalEntries(userId as string, page as string, perPage as string);
      await cache.set(cacheKey, journalEntriesResults);
      return res.status(200).json({ data: journalEntriesResults });
    } catch (error: any) {
      logger.error({ message: `Error in getEntries`, details: error.message, userId });
      if(error.message === ServerErrors.NO_DOCS_FOUND){
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
    }
  }