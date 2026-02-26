import { Prisma } from "@prisma/client";
import type { LeadStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";

const PAGE_SIZE = 20;

const listLeads = async (params: { page: number; q?: string; status?: LeadStatus }) => {
  const { page, q, status } = params;
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.LeadWhereInput = {};
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
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE
    })
  ]);

  return { items, page, pageSize: PAGE_SIZE, total };
};

const getLeadById = async (id: string) => {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { id: true, name: true, email: true } } }
      }
    }
  });

  if (!lead) {
    throw new AppError("NOT_FOUND", "Lead not found", 404);
  }

  return lead;
};

const createLead = async (data: {
  name: string;
  email: string;
  company: string;
  phone?: string;
  source: string;
  message: string;
  status?: LeadStatus;
}) => prisma.lead.create({ data });

const createPublicLead = async (data: {
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
}) =>
  createLead({
    ...data,
    source: "CONTACT_FORM",
    status: "NEW"
  });

const updateLead = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    company: string;
    phone: string | null;
    source: string;
    message: string;
    status: LeadStatus;
  }>
) => {
  try {
    return await prisma.lead.update({ where: { id }, data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new AppError("NOT_FOUND", "Lead not found", 404);
    }
    throw error;
  }
};

const addLeadNote = async (leadId: string, userId: string | undefined, body: string) => {
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    throw new AppError("NOT_FOUND", "Lead not found", 404);
  }

  return prisma.leadNote.create({
    data: {
      leadId,
      body,
      createdByUserId: userId
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } }
    }
  });
};

export const leadService = {
  listLeads,
  getLeadById,
  createLead,
  createPublicLead,
  updateLead,
  addLeadNote
};
