import { asyncHandler } from "../lib/async-handler";
import { leadService } from "../services/lead-service";

const list = asyncHandler(async (req, res) => {
  const result = await leadService.listLeads(
    req.query as unknown as Parameters<typeof leadService.listLeads>[0]
  );
  res.json(result);
});

const create = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.body);
  res.status(201).json({ lead });
});

const getById = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id);
  res.json({ lead });
});

const update = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.id, req.body);
  res.json({ lead });
});

const addNote = asyncHandler(async (req, res) => {
  const note = await leadService.addLeadNote(req.params.id, req.session.userId, req.body.body);
  res.status(201).json({ note });
});

export const leadsController = { list, create, getById, update, addNote };
