import * as ngoService from '../services/ngoService.js';

export const registerNGO = async (req, res) => {
  try {
    const ngo = await ngoService.createNGO(req.user.id, req.body);
    res.status(201).json({ success: true, ngo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getMyNGO = async (req, res) => {
  try {
    const ngo = await ngoService.getNGOByUserId(req.user.id);
    res.json({ success: true, ngo });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

export const updateMyNGO = async (req, res) => {
  try {
    const ngo = await ngoService.updateNGO(req.user.id, req.body);
    res.json({ success: true, ngo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const verifyNGO = async (req, res) => {
  try {
    const { ngoId, decision } = req.body;
    const ngo = await ngoService.verifyNGO(ngoId, decision);
    res.json({ success: true, ngo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};