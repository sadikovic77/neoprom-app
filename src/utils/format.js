import { ELEMENT_TYPES } from '../elementTypes';

export const fmt = (num, currency) => {
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
  return `${formatted} ${currency}`;
};

export const getElementName = (type, lang) => {
  const t = ELEMENT_TYPES.find(e => e.id === type);
  return t ? (lang === 'de' ? t.nameDe : t.name) : type;
};
