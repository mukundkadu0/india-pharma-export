export type CountryCode = 'US' | 'CA' | 'UK' | 'EU' | 'AE' | 'AU' | 'SG' | 'OTHER';
export type CommerceStatus = 'DTC_AND_BULK' | 'BULK_ONLY' | 'NOT_AVAILABLE' | 'REQUEST_REVIEW';
export type Eligibility = 'AVAILABLE' | 'BULK_ONLY' | 'RESTRICTED' | 'NOT_AVAILABLE' | 'REVIEW_REQUIRED';
export type PriceStatus = 'COMPETITIVE' | 'PREMIUM' | 'BULK_ONLY' | 'NEEDS_REVIEW';

export const countries: { code: CountryCode; name: string; currency: string }[] = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
  { code: 'EU', name: 'European Union', currency: 'EUR' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'OTHER', name: 'Other', currency: 'USD' },
];

export const consumerCategories = [
  { id: 'vitamins', name: 'Vitamins' },
  { id: 'minerals', name: 'Minerals' },
  { id: 'herbal', name: 'Herbal Supplements' },
  { id: 'ayurveda', name: 'Ayurveda' },
  { id: 'nutraceuticals', name: 'Nutraceuticals' },
  { id: 'sports', name: 'Sports Nutrition' },
  { id: 'protein', name: 'Protein' },
  { id: 'wellness', name: 'Wellness' },
  { id: 'digestive', name: 'Digestive Health' },
  { id: 'beauty', name: 'Beauty & Personal Wellness' },
] as const;

type PricingInput = {
  indiaCost?: number;
  packagingCost?: number;
  exportHandlingCost?: number;
  shippingCostEstimate?: number;
  paymentFeePercent?: number;
  paymentFixedFee?: number;
  targetMarginPercent?: number;
  usComparablePrice?: number;
  usComparableUrl?: string;
  targetDiscountPercent?: number;
  retailPriceUsd?: number;
  comparePriceUsd?: number;
};

type ProductLike = {
  prescriptionStatus?: string;
  commerceStatus?: CommerceStatus;
  pricing?: PricingInput;
  images?: unknown[];
  countryEligibility?: Partial<Record<CountryCode, Eligibility>>;
};

/** Rx/H1/X can never be sold direct, whatever the data says. */
export function isPrescription(prescriptionStatus?: string) {
  return prescriptionStatus === 'rx' || prescriptionStatus === 'h1' || prescriptionStatus === 'x';
}

export function computePricing(p: PricingInput | undefined) {
  const required = [p?.indiaCost, p?.packagingCost, p?.exportHandlingCost, p?.shippingCostEstimate, p?.targetMarginPercent];
  if (!p || required.some((v) => typeof v !== 'number')) {
    return { status: 'NEEDS_REVIEW' as PriceStatus, sustainable: null, landed: null };
  }

  const landed = p.indiaCost! + p.packagingCost! + p.exportHandlingCost! + p.shippingCostEstimate!;
  const feePercent = p.paymentFeePercent ?? 0;
  const breakeven = (landed + (p.paymentFixedFee ?? 0)) / (1 - feePercent / 100);
  const sustainable = breakeven / (1 - p.targetMarginPercent! / 100);

  if (typeof p.usComparablePrice !== 'number') {
    return { status: 'NEEDS_REVIEW' as PriceStatus, sustainable, landed };
  }
  const target = p.usComparablePrice * (1 - (p.targetDiscountPercent ?? 0) / 100);
  const status: PriceStatus = sustainable <= target ? 'COMPETITIVE' : sustainable <= p.usComparablePrice ? 'PREMIUM' : 'BULK_ONLY';
  return { status, sustainable, landed };
}

/** A compare-at price renders only when a real, cited US comparison exists. */
export function comparePrice(p: PricingInput | undefined) {
  if (!p?.comparePriceUsd || !p.usComparablePrice || !p.usComparableUrl) return null;
  if (!p.retailPriceUsd || p.comparePriceUsd <= p.retailPriceUsd) return null;
  return { was: p.comparePriceUsd, url: p.usComparableUrl };
}

export type Cta = 'BUY_NOW' | 'ADD_TO_CART' | 'BUY_IN_BULK' | 'CHECK_AVAILABILITY' | 'CONTACT_US';

export function resolveCommerce(product: ProductLike, country: CountryCode) {
  const declared: CommerceStatus = product.commerceStatus ?? 'BULK_ONLY';
  const sellable =
    !isPrescription(product.prescriptionStatus) &&
    declared === 'DTC_AND_BULK' &&
    typeof product.pricing?.retailPriceUsd === 'number' &&
    (product.images?.length ?? 0) > 0;

  const eligibility: Eligibility = product.countryEligibility?.[country] ?? 'REVIEW_REQUIRED';

  if (declared === 'REQUEST_REVIEW') return { ctas: ['CONTACT_US'] as Cta[], eligibility, reason: 'This product needs a review before we can quote it.' };
  if (declared === 'NOT_AVAILABLE') return { ctas: ['CHECK_AVAILABILITY'] as Cta[], eligibility, reason: 'Not currently available.' };

  if (sellable && eligibility === 'AVAILABLE') {
    return { ctas: ['BUY_NOW', 'ADD_TO_CART', 'BUY_IN_BULK'] as Cta[], eligibility, reason: null };
  }
  if (eligibility === 'RESTRICTED' || eligibility === 'NOT_AVAILABLE') {
    return { ctas: ['CHECK_AVAILABILITY'] as Cta[], eligibility, reason: 'Not available for direct purchase in this destination.' };
  }

  const reason = isPrescription(product.prescriptionStatus)
    ? 'Prescription product — supplied to licensed buyers on a bulk order only.'
    : eligibility === 'REVIEW_REQUIRED'
      ? 'Direct purchase in this destination has not been confirmed yet — available for bulk sourcing.'
      : 'Available for bulk sourcing.';
  return { ctas: ['BUY_IN_BULK'] as Cta[], eligibility, reason };
}
