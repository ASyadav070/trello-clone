const memberRepository = require('../repositories/memberRepository');

const getAllMembers = () => memberRepository.findAll();
const assignMemberToCard = (cardId, memberId) => memberRepository.attachToCard(cardId, memberId);
const unassignMemberFromCard = (cardId, memberId) => memberRepository.removeFromCard(cardId, memberId);

module.exports = { getAllMembers, assignMemberToCard, unassignMemberFromCard };
