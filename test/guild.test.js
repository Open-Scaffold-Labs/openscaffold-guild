import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGuildPricePool,
  createZeroTollReferralMesh,
  calculateStewardSplit,
  estimateMainStreetTakeBack,
} from '../src/index.js';

test('1. k-Anonymous Wholesale Price Pool protects privacy below 5 shops and catches supplier overcharges at >= 5 shops', () => {
  const pool = createGuildPricePool({ minContributors: 5 });

  const samplePrices = [1180, 1200, 1190, 1220];
  samplePrices.forEach((cents, idx) => {
    pool.submitAnonymizedInvoiceLine({
      tenantId: `shop_${idx + 1}`,
      zipCode: '70001',
      canonicalSku: 'usda_choice_ribeye_lb',
      unitName: 'lb',
      unitPriceCents: cents,
    });
  });

  const premature = pool.auditSupplierPrice({
    zipCode: '70001',
    canonicalSku: 'usda_choice_ribeye_lb',
    myUnitPriceCents: 1460,
    myAnnualUnits: 2400,
  });
  assert.equal(premature.kAnonymityMet, false);

  pool.submitAnonymizedInvoiceLine({
    tenantId: 'shop_5',
    zipCode: '70002',
    canonicalSku: 'usda_choice_ribeye_lb',
    unitName: 'lb',
    unitPriceCents: 1460,
  });

  const audit = pool.auditSupplierPrice({
    zipCode: '70001',
    canonicalSku: 'usda_choice_ribeye_lb',
    myUnitPriceCents: 1460,
    myAnnualUnits: 2400,
  });
  assert.equal(audit.kAnonymityMet, true);
  assert.equal(audit.p25Cents, 1190);
  assert.equal(audit.alertTriggered, true);
  assert.equal(audit.annualRecoverableCents, (1460 - 1190) * 2400);
});

test('2. Zero-Toll Local A2A Referral Mesh routes HOA work to local landscaper at 0% lead/platform fee', () => {
  const mesh = createZeroTollReferralMesh();

  mesh.registerMember({
    memberId: 'hoa_oakwood',
    businessName: 'Oakwood Hills HOA',
    vertical: 'open-hoa',
    zipCode: '70001',
    a2aAgentCardUrl: 'urn:osl:a2a:oakwood-hoa',
  });

  mesh.registerMember({
    memberId: 'land_native',
    businessName: 'Native Ridge Landscapes',
    vertical: 'open-landscape-architect',
    zipCode: '70002',
    a2aAgentCardUrl: 'urn:osl:a2a:native-ridge',
    specialties: ['drought_tolerant', 'hoa_commons'],
  });

  const peers = mesh.findLocalPeers({
    zipCode: '70001',
    targetVertical: 'open-landscape-architect',
    specialty: 'hoa_commons',
  });
  assert.equal(peers.length, 1);

  const ref = mesh.issueZeroTollReferral({
    fromMemberId: 'hoa_oakwood',
    toMemberId: 'land_native',
    scopeSummary: 'Fire-safe defensible space redesign for common slope',
    estimatedJobCents: 1850000,
  });
  assert.equal(ref.leadFeeCents, 0);
  assert.equal(ref.platformCommissionBps, 0);
  assert.equal(ref.directMerchantSettlement, true);
});

test('3. Steward Revenue Split & Main Street Take-Back quantify sustainable OSL + collaborator & SMB gains', () => {
  const split = calculateStewardSplit({ activeMemberShops: 1000 });
  assert.equal(split.grossMembershipCents, 14900000);
  assert.equal(split.collaboratorPayoutCents, 5215000);
  assert.equal(split.infrastructureReserveCents + split.mainStreetCommonsCents, 9685000);

  const impact = estimateMainStreetTakeBack({
    monthlyMarketplaceOrderVolumeCents: 1200000,
    marketplaceCommissionBps: 2500,
    directShiftRatio: 0.5,
    missedCallsPerWeek: 6,
    conversionRate: 0.35,
    averageTicketCents: 5500,
    legacyMonthlySaasAndVoiceCents: 65000,
    annualGuildPurchasingSavingsCents: 450000,
  });
  assert.equal(impact.marketplaceTollsSavedCents, 1800000);
  assert.ok(impact.totalAnnualProfitReturnedCents > 3500000);
  assert.ok(impact.roiMultiple > 90);
});
