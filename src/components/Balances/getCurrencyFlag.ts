export const getCurrencyFlag = (currency: string): string => {
  const flags: Record<string, string> = {
    INR: '🇮🇳',
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    AUD: '🇦🇺',
    CAD: '🇨🇦',
    CHF: '🇨🇭',
    CNY: '🇨🇳',
    CZK: '🇨🇿',
    DKK: '🇩🇰',
    NZD: '🇳🇿',
    NOK: '🇳🇴',
    SEK: '🇸🇪',
    SGD: '🇸🇬',
    HKD: '🇭🇰',
    ZAR: '🇿🇦',
    MXN: '🇲🇽',
    BRL: '🇧🇷',
    TRY: '🇹🇷',
    KRW: '🇰🇷',
    TWD: '🇹🇼',
    THB: '🇹🇭',
    PLN: '🇵🇱',
    ILS: '🇮🇱',
  };

  return flags[currency] || '💱';
};
