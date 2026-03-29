const memberService = require('../services/memberService');

const getAllMembers = async (req, res, next) => {
  try {
    const members = await memberService.getAllMembers();
    res.json(members);
  } catch (err) { next(err); }
};

const assignMember = async (req, res, next) => {
  try {
    const { id: cardId } = req.params;
    const { memberId } = req.body;
    await memberService.assignMemberToCard(cardId, memberId);
    res.json({ success: true, cardId, memberId });
  } catch (err) { next(err); }
};

const unassignMember = async (req, res, next) => {
  try {
    const { id: cardId, memberId } = req.params;
    await memberService.unassignMemberFromCard(cardId, memberId);
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getAllMembers, assignMember, unassignMember };
