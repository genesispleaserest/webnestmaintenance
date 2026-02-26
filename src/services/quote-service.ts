import { Prisma } from "@prisma/client";
import type { QuoteStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";

const PAGE_SIZE = 20;

const listQuotes = async (params: { page: number; q?: string; status?: QuoteStatus }) => {
  const { page, q, status } = params;
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.QuoteWhereInput = {};
  if (status) {
    where.status = status;
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } }
    ];
  }

  const [total, items] = await prisma.$transaction([
    prisma.quote.count({ where }),
    prisma.quote.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE
    })
  ]);

  return { items, page, pageSize: PAGE_SIZE, total };
};

const getQuoteById = async (id: string) => {
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) {
    throw new AppError("NOT_FOUND", "Quote not found", 404);
  }
  return quote;
};

const createQuote = async (data: {
  name: string;
  email: string;
  company: string;
  budgetRange: string;
  timeline: string;
  service: "DEV" | "DESIGN" | "SECURITY" | "AUTOMATION";
  details: string;
  status?: QuoteStatus;
}) => prisma.quote.create({ data });

const createPublicQuote = async (data: {
  name: string;
  email: string;
  company: string;
  budgetRange: string;
  timeline: string;
  service: "DEV" | "DESIGN" | "SECURITY" | "AUTOMATION";
  details: string;
}) =>
  createQuote({
    ...data,
    status: "NEW"
  });

const updateQuote = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    company: string;
    budgetRange: string;
    timeline: string;
    service: "DEV" | "DESIGN" | "SECURITY" | "AUTOMATION";
    details: string;
    status: QuoteStatus;
  }>
) => {
  try {
    return await prisma.quote.update({ where: { id }, data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new AppError("NOT_FOUND", "Quote not found", 404);
    }
    throw error;
  }
};

export const quoteService = {
  listQuotes,
  getQuoteById,
  createQuote,
  createPublicQuote,
  updateQuote
};
