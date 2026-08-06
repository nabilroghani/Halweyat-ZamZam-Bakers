/**
 * Dynamic Size & Variation Price Calculator for Halwiyat Zamzam Bakers
 * Automatically calculates exact adjusted prices based on selected Size, Weight, or Portion.
 */

export const calculateOptionPrice = (product, selectedOption) => {
  if (!product) return 0;
  const basePrice = Number(product.price) || 0;
  if (!selectedOption) return basePrice;

  // 1. Check if product has explicit variants array with prices
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const matched = product.variants.find(v => 
      v.size === selectedOption || v.name === selectedOption || selectedOption.includes(v.size)
    );
    if (matched && matched.price) return Number(matched.price);
  }

  // 2. Check if selectedOption string has explicit price formatted e.g. "Small - Rs. 650" or "Large (Rs. 1800)"
  const priceMatch = selectedOption.match(/(?:Rs\.?|PKR)\s*(\d+)/i);
  if (priceMatch && priceMatch[1]) {
    return Number(priceMatch[1]);
  }

  const optLower = selectedOption.toLowerCase().trim();
  const category = (product.category || '').toLowerCase();

  // 3. Weight / Pound Ratio Pricing (Cakes, Sweets, Nimko)
  if (optLower.includes('0.5 kg') || optLower.includes('half kg') || optLower.includes('500g') || optLower.includes('0.5 lb') || optLower.includes('1 pound') || optLower.includes('1 lb')) {
    if (category.includes('cakes')) {
      // If base cake price is for 2 Lbs, 1 Lb is half price
      return Math.round(basePrice * 0.5);
    }
    return Math.round(basePrice * 0.5);
  }

  if (optLower.includes('1 kg') || optLower.includes('1.0 kg') || optLower.includes('2 pounds') || optLower.includes('2 lbs') || optLower.includes('2 lb')) {
    return basePrice; // Base price standard
  }

  if (optLower.includes('1.5 kg') || optLower.includes('3 pounds') || optLower.includes('3 lbs')) {
    return Math.round(basePrice * 1.5);
  }

  if (optLower.includes('2 kg') || optLower.includes('2.0 kg') || optLower.includes('4 pounds') || optLower.includes('4 lbs')) {
    return Math.round(basePrice * 2.0);
  }

  if (optLower.includes('3 kg') || optLower.includes('5 pounds') || optLower.includes('5 lbs')) {
    return Math.round(basePrice * 3.0);
  }

  if (optLower.includes('5 kg')) {
    return Math.round(basePrice * 5.0);
  }

  // 4. Fast Food / Pizza / Drink Size Variations
  if (optLower.includes('small') || optLower.includes('personal') || optLower.includes('single') || optLower.includes('half')) {
    return Math.round(basePrice * 0.65);
  }

  if (optLower.includes('medium') || optLower.includes('regular') || optLower.includes('standard')) {
    return basePrice;
  }

  if (optLower.includes('large') || optLower.includes('jumbo') || optLower.includes('double') || optLower.includes('full')) {
    return Math.round(basePrice * 1.55);
  }

  if (optLower.includes('family') || optLower.includes('party') || optLower.includes('xl')) {
    return Math.round(basePrice * 2.2);
  }

  // Fallback to base price
  return basePrice;
};
