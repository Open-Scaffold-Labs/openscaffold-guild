/**
 * @openscaffold/guild — Zero-Toll Local A2A Peer Referral & B2B Clearinghouse
 * Connects local OSL verticals (e.g., OpenHOA -> OpenLandscapeArchitect / OpenServicePro / OpenCPA)
 * directly over A2A with 0% lead-generation fee and 0% transaction commission.
 */

import { randomUUID, createHash } from 'node:crypto';

export function createZeroTollReferralMesh() {
  const members = new Map();
  const referrals = new Map();

  function registerMember({
    memberId,
    businessName,
    vertical,
    zipCode,
    a2aAgentCardUrl,
    stripeAccountId,
    specialties = [],
  }) {
    if (!memberId || !businessName || !vertical || !zipCode || !a2aAgentCardUrl) {
      throw new Error('registerMember requires memberId, businessName, vertical, zipCode, and a2aAgentCardUrl.');
    }
    const record = Object.freeze({
      memberId,
      businessName,
      vertical,
      zipCode: String(zipCode).trim(),
      zip3: String(zipCode).trim().slice(0, 3),
      a2aAgentCardUrl,
      stripeAccountId: stripeAccountId ?? null,
      specialties: [...specialties],
      verifiedMainStreetIndependent: true,
    });
    members.set(memberId, record);
    return record;
  }

  function findLocalPeers({ zipCode, targetVertical, specialty }) {
    const zip3 = String(zipCode).trim().slice(0, 3);
    return [...members.values()].filter((m) => {
      if (m.zip3 !== zip3) return false;
      if (targetVertical && m.vertical !== targetVertical) return false;
      if (specialty && !m.specialties.includes(specialty)) return false;
      return true;
    });
  }

  function issueZeroTollReferral({
    fromMemberId,
    toMemberId,
    scopeSummary,
    estimatedJobCents = 0,
  }) {
    const sender = members.get(fromMemberId);
    const receiver = members.get(toMemberId);
    if (!sender || !receiver) {
      throw new Error('Both sender and receiver must be verified Main Street Guild members.');
    }
    const referralId = `ref_${randomUUID()}`;
    const payload = {
      referralId,
      createdAt: new Date().toISOString(),
      fromMemberId,
      fromBusiness: sender.businessName,
      toMemberId,
      toBusiness: receiver.businessName,
      toA2aEndpoint: receiver.a2aAgentCardUrl,
      scopeSummary,
      estimatedJobCents,
      leadFeeCents: 0,
      platformCommissionBps: 0,
      directMerchantSettlement: true,
    };
    payload.attestationHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    referrals.set(referralId, payload);
    return payload;
  }

  return {
    registerMember,
    findLocalPeers,
    issueZeroTollReferral,
    listReferrals: () => [...referrals.values()],
  };
}
