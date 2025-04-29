
import { useCallback } from 'react';
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/schemas/profileFormSchema";
import { BrandProfileFormValues } from "@/schemas/brandProfileFormSchema";

type FormValues = ProfileFormValues | BrandProfileFormValues;

export function useTagManagement(form: UseFormReturn<FormValues>) {
  // Generic function to add an item to any array field in the form
  const addArrayItem = useCallback((fieldName: string, item: string) => {
    if (!item) return false;
    
    const currentItems = form.getValues(fieldName as any) as string[] || [];
    if (!currentItems.includes(item)) {
      form.setValue(fieldName as any, [...currentItems, item], { shouldDirty: true });
      return true;
    }
    return false;
  }, [form]);

  // Generic function to remove an item by index from any array field in the form
  const removeArrayItem = useCallback((fieldName: string, index: number) => {
    const currentItems = form.getValues(fieldName as any) as string[] || [];
    const newItems = [...currentItems];
    newItems.splice(index, 1);
    form.setValue(fieldName as any, newItems, { shouldDirty: true });
  }, [form]);

  // Run club specific functions
  const addRunType = useCallback((selectedRunType: string) => {
    if (!selectedRunType) return false;
    
    const currentRunTypes = form.getValues("runTypes" as any) as string[] || [];
    if (!currentRunTypes.includes(selectedRunType)) {
      form.setValue("runTypes" as any, [...currentRunTypes, selectedRunType], { shouldDirty: true });
      return true;
    }
    return false;
  }, [form]);

  const removeRunType = useCallback((type: string) => {
    const currentRunTypes = form.getValues("runTypes" as any) as string[] || [];
    // Immediately update the form value
    form.setValue(
      "runTypes" as any, 
      currentRunTypes.filter(t => t !== type),
      { shouldDirty: true }
    );
  }, [form]);

  const addEventExperience = useCallback((selectedEventExp: string) => {
    if (!selectedEventExp) return false;
    
    const currentEvents = form.getValues("eventExperience" as any) as string[] || [];
    if (!currentEvents.includes(selectedEventExp)) {
      form.setValue("eventExperience" as any, [...currentEvents, selectedEventExp], { shouldDirty: true });
      return true;
    }
    return false;
  }, [form]);

  const removeEventExperience = useCallback((event: string) => {
    const currentEvents = form.getValues("eventExperience" as any) as string[] || [];
    // Immediately update the form value
    form.setValue(
      "eventExperience" as any, 
      currentEvents.filter(e => e !== event),
      { shouldDirty: true }
    );
  }, [form]);

  return {
    addArrayItem,
    removeArrayItem,
    addRunType,
    removeRunType,
    addEventExperience,
    removeEventExperience
  };
}
