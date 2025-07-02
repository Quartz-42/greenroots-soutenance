import { sanitizeInput } from "./function";

// Validation du code postal français
export const isValidZipCode = (zipCode: string): boolean => {
  return /^[0-9]{5}$/.test(zipCode);
};

// Validation du nom/prénom (lettres, espaces, tirets, apostrophes)
export const isValidName = (name: string): boolean => {
  return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name) && name.length <= 50;
};

// Validation de l'adresse
export const isValidAddress = (address: string): boolean => {
  return address.trim().length >= 5 && address.length <= 120;
};

export const validateForm = (
  firstName: string,
  lastName: string,
  address: string,
  city: string,
  zipCode: string,
  setErrors: any
) => {
  const newErrors: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    zipCode?: string;
  } = {};

  if (!firstName) {
    newErrors.firstName = "Le prénom est requis";
  } else if (!isValidName(sanitizeInput(firstName))) {
    newErrors.firstName = "Prénom invalide";
  }

  if (!lastName) {
    newErrors.lastName = "Le nom est requis";
  } else if (!isValidName(sanitizeInput(lastName))) {
    newErrors.lastName = "Nom invalide";
  }

  if (!address) {
    newErrors.address = "L'adresse est requise";
  } else if (!isValidAddress(sanitizeInput(address))) {
    newErrors.address = "Adresse invalide (min 5, max 120 caractères)";
  }

  if (!city) {
    newErrors.city = "La ville est requise";
  } else if (!isValidName(sanitizeInput(city))) {
    newErrors.city = "Nom de ville invalide";
  }

  if (!zipCode) {
    newErrors.zipCode = "Le code postal est requis";
  } else if (!isValidZipCode(sanitizeInput(zipCode))) {
    newErrors.zipCode = "Code postal invalide (format: 12345)";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
