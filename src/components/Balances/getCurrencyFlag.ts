export const getCurrencyFlag = (currency: string): string => {
  const flags: Record<string, string> = {
    INR: '🇮🇳',
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
  };

  return flags[currency] || '💱';
};
