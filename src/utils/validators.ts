export const isEmpty = (text: string) => (text.trim() === "" ? true : false);

export const isEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isNumber = (value: string) => /^\d$/.test(value);
