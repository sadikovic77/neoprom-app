const STORAGE_KEY = 'customers';

/*
  {
    id: string (UUID),
    name: string,
    address: string,
    phone: string,
    email: string,
    language: 'bs' | 'de',
    currency: 'KM' | 'EUR',
    vatPayer: boolean,
    notes: string,
    createdAt: number (timestamp),
    updatedAt: number (timestamp)
  }
*/

export const getCustomers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getCustomer = (id) =>
  getCustomers().find(c => c.id === id) ?? null;

export const saveCustomer = (customer) => {
  const customers = getCustomers();
  const now = Date.now();

  const toSave = customer.id
    ? { ...customer, updatedAt: now }
    : { ...customer, id: crypto.randomUUID(), createdAt: now, updatedAt: now };

  const idx = customers.findIndex(c => c.id === toSave.id);
  if (idx >= 0) {
    customers[idx] = toSave;
  } else {
    customers.push(toSave);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  return toSave;
};

export const deleteCustomer = (id) => {
  const customers = getCustomers();
  const idx = customers.findIndex(c => c.id === id);
  if (idx === -1) return false;
  customers.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  return true;
};

export const findCustomerByNameAndAddress = (name, address) => {
  const norm = (s) => (s ?? '').trim().toLowerCase();
  const n = norm(name);
  const a = norm(address);
  return getCustomers().find(c => norm(c.name) === n && norm(c.address) === a) ?? null;
};