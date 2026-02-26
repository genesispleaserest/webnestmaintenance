import { asyncHandler } from "../lib/async-handler";
import { leadService } from "../services/lead-service";
import { quoteService } from "../services/quote-service";

const contact = asyncHandler(async (req, res) => {
  const lead = await leadService.createPublicLead(req.body);
  res.status(201).json({ leadId: lead.id });
});

const quote = asyncHandler(async (req, res) => {
  const createdQuote = await quoteService.createPublicQuote(req.body);
  res.status(201).json({ quoteId: createdQuote.id });
});

export const publicController = { contact, quote };
