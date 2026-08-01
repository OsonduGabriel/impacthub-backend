import * as opportunityService from '../services/opportunityService.js';

export const createOpportunity = async (req, res) => {
  try {
    const opportunity = await opportunityService.createOpportunity(req.user.id, req.body);
    res.status(201).json({ success: true, opportunity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const listOpportunities = async (req, res) => {
  try {
    const opportunities = await opportunityService.getOpportunities(req.query);
    res.json({ success: true, opportunities });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getOpportunity = async (req, res) => {
  try {
    const opportunity = await opportunityService.getOpportunityById(req.params.id);
    res.json({ success: true, opportunity });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

export const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await opportunityService.updateOpportunity(req.user.id, req.params.id, req.body);
    res.json({ success: true, opportunity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const publishOpportunity = async (req, res) => {
  try {
    const opportunity = await opportunityService.publishOpportunity(req.user.id, req.params.id);
    res.json({ success: true, opportunity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const closeOpportunity = async (req, res) => {
  try {
    const opportunity = await opportunityService.closeOpportunity(req.user.id, req.params.id);
    res.json({ success: true, opportunity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteOpportunity = async (req, res) => {
  try {
    await opportunityService.deleteOpportunity(req.user.id, req.params.id);
    res.json({ success: true, message: 'Opportunity deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
export const archiveOpportunity = async (req, res) => {
  try {
    const opportunity = await opportunityService.archiveOpportunity(req.user.id, req.params.id);
    res.json({ success: true, opportunity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};