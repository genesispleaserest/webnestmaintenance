import { asyncHandler } from "../lib/async-handler";
import { quoteService } from "../services/quote-service";

const list = asyncHandler(async (req, res) => {
  const result = await quoteService.listQuotes(
    req.query as unknown as Parameters<typeof quoteService.listQuotes>[0]
  );
  res.json(result);
});

const create = asyncHandler(async (req, res) => {
  const quote = await quoteService.createQuote(req.body);
  res.status(201).json({ quote });
});

const getById = asyncHandler(async (req, res) => {
  const quote = await quoteService.getQuoteById(req.params.id);
  res.json({ quote });
});

const update = asyncHandler(async (req, res) => {
  const quote = await quoteService.updateQuote(req.params.id, req.body);
  res.json({ quote });
});

export const quotesController = { list, create, getById, update };
