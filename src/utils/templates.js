const TEMPLATES_KEY = 'position-templates';

export const getTemplates = () => {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const saveTemplate = (name, position) => {
  const templates = getTemplates();
  const { id: _, ...positionData } = position;
  const template = {
    id: crypto.randomUUID(),
    name,
    position: positionData,
    createdAt: Date.now(),
  };
  templates.push(template);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  return template;
};

export const deleteTemplate = (id) => {
  const remaining = getTemplates().filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(remaining));
};
