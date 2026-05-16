import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/authMiddleware';

export const createLead = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, status, source } = req.body;

  try {
    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      createdBy: req.user?._id,
    });

    res.status(201).json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.source) {
      query.source = req.query.source;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    let sortOption: any = { createdAt: -1 }; // Default: Latest
    if (req.query.sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (req.query.sort === 'latest') {
      sortOption = { createdAt: -1 };
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.name = req.body.name || lead.name;
      lead.email = req.body.email || lead.email;
      lead.status = req.body.status || lead.status;
      lead.source = req.body.source || lead.source;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await lead.deleteOne();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};
