
import { useState, useCallback } from 'react';

export function useEditSection() {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Toggle section editing
  const toggleEditSection = useCallback((section: string | null) => {
    setIsEditing(section);
  }, []);

  return {
    isEditing,
    toggleEditSection
  };
}
