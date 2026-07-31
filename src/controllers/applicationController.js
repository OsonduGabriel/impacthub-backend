import * as opportunityService from '../services/opportunityService.js';
import * as applicationService from '../services/applicationService.js';

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

export const listApplications = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsForNGO(req.user.id, req.query.opportunityId);
    res.json({ success: true, applications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
export const applyForOpportunity = async (req, res) => {
  try {
    const application = await applicationService.applyForOpportunity(req.user.id, req.body.opportunityId);
    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const acceptApplication = async (req, res) => {
  try {
    const application = await applicationService.acceptApplication(req.user.id, req.params.id);
    res.json({ success: true, application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const application = await applicationService.rejectApplication(req.user.id, req.params.id);
    res.json({ success: true, application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await applicationService.withdrawApplication(req.user.id, req.params.id);
    res.json({ success: true, application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  } 
};