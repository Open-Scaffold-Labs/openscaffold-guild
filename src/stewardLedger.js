/**
 * @openscaffold/guild — Collaborator Steward Split & Main Street Margin Take-Back Engine
 * Ensures Open Scaffold Labs is financially rock-solid and pays fair recurring revenue share
 * to vertical collaborators while charging Main Street 0% commissions and $0 seat fees.
 */

export function calculateStewardSplit({
  activeMemberShops,
  membershipAnnualCents = 14900,
  collaboratorShareBps = 3500,
  infrastructureReserveBps = 4500,
  mainStreetCommonsBps = 2000,
}) {
  if (collaboratorShareBps + infrastructureReserveBps + mainStreetCommonsBps !== 10000) {
    throw new Error('Steward revenue-share basis points must total 10000 (100%).');
  }
  const grossMembershipCents = Math.round(activeMemberShops * membershipAnnualCents);
  const collaboratorPayoutCents = Math.round((grossMembershipCents * collaboratorShareBps) / 10000);
  const infrastructureReserveCents = Math.round((grossMembershipCents * infrastructureReserveBps) / 10000);
  const mainStreetCommonsCents =
    grossMembershipCents - collaboratorPayoutCents - infrastructureReserveCents;

  return {
    activeMemberShops,
    membershipAnnualCents,
    grossMembershipCents,
    collaboratorPayoutCents,
    infrastructureReserveCents,
    mainStreetCommonsCents,
    perShopCollaboratorCents: Math.round((membershipAnnualCents * collaboratorShareBps) / 10000),
  };
}

/**
 * Quantifies exact annual net profit returned to an independent Main Street business
 * by switching from Big Tech marketplace tollbooths + per-seat SaaS to Open Scaffold Labs.
 */
export function estimateMainStreetTakeBack({
  monthlyMarketplaceOrderVolumeCents = 0,
  marketplaceCommissionBps = 2500, // e.g., 25% DoorDash / UberEats / Thumbtack cut
  directShiftRatio = 0.5, // Share of orders/leads shifted to direct 0%-fee A2A + Voice + ACP
  missedCallsPerWeek = 8,
  conversionRate = 0.35,
  averageTicketCents = 6500,
  legacyMonthlySaasAndVoiceCents = 65000, // e.g., $650/mo POS + per-seat + AI add-on fees
  oslAnnualMembershipCents = 14900,
  estimatedMonthlyVoiceComputeCents = 1800, // Wholesale Rung 0 + Rung 1 pass-through (~$18/mo)
  annualGuildPurchasingSavingsCents = 0,
}) {
  const annualMarketplaceVolumeCents = monthlyMarketplaceOrderVolumeCents * 12;
  const shiftedDirectVolumeCents = Math.round(annualMarketplaceVolumeCents * directShiftRatio);
  const marketplaceTollsSavedCents = Math.round(
    (shiftedDirectVolumeCents * marketplaceCommissionBps) / 10000
  );

  const recoveredOrdersPerYear = missedCallsPerWeek * 52 * conversionRate;
  const missedCallRevenueRecoveredCents = Math.round(recoveredOrdersPerYear * averageTicketCents);

  const legacyAnnualSoftwareCents = legacyMonthlySaasAndVoiceCents * 12;
  const oslTotalAnnualCostCents = oslAnnualMembershipCents + estimatedMonthlyVoiceComputeCents * 12;
  const netSoftwareSavingsCents = Math.max(0, legacyAnnualSoftwareCents - oslTotalAnnualCostCents);

  const totalAnnualProfitReturnedCents =
    marketplaceTollsSavedCents +
    missedCallRevenueRecoveredCents +
    netSoftwareSavingsCents +
    annualGuildPurchasingSavingsCents;

  return {
    marketplaceTollsSavedCents,
    missedCallRevenueRecoveredCents,
    netSoftwareSavingsCents,
    annualGuildPurchasingSavingsCents,
    oslTotalAnnualCostCents,
    totalAnnualProfitReturnedCents,
    roiMultiple:
      oslTotalAnnualCostCents > 0
        ? Number((totalAnnualProfitReturnedCents / oslTotalAnnualCostCents).toFixed(1))
        : 0,
  };
}
