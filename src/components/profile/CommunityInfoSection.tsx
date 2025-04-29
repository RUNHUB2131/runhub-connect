
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Loader2, User, Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/schemas/profileFormSchema";
import { DEMOGRAPHIC_OPTIONS, RUN_TYPES, EVENT_EXPERIENCES } from "@/lib/constants";

interface CommunityInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
  isEditing: string | null;
  isLoading: boolean;
  selectedRunType: string;
  selectedEventExp: string;
  toggleEditSection: (section: string | null) => void;
  setSelectedRunType: (value: string) => void;
  setSelectedEventExp: (value: string) => void;
  addRunType: (type: string) => boolean | void;
  removeRunType: (type: string) => void;
  addEventExperience: (event: string) => boolean | void;
  removeEventExperience: (event: string) => void;
}

const CommunityInfoSection: React.FC<CommunityInfoSectionProps> = ({
  form,
  isEditing,
  isLoading,
  selectedRunType,
  selectedEventExp,
  toggleEditSection,
  setSelectedRunType,
  setSelectedEventExp,
  addRunType,
  removeRunType,
  addEventExperience,
  removeEventExperience
}) => {
  // Initialize empty arrays for runTypes and eventExperience if they're undefined
  const runTypes = form.watch("runTypes") || [];
  const eventExperience = form.watch("eventExperience") || [];

  // Get available run types (those not already selected)
  const getAvailableRunTypes = () => {
    const currentRunTypes = form.getValues("runTypes") || [];
    return RUN_TYPES.filter(type => !currentRunTypes.includes(type));
  };

  // Get available event experiences (those not already selected)
  const getAvailableEventExperiences = () => {
    const currentEvents = form.getValues("eventExperience") || [];
    return EVENT_EXPERIENCES.filter(event => !currentEvents.includes(event));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Community Information</CardTitle>
          <CardDescription>Share details about your community demographics</CardDescription>
        </div>
        {isEditing === "community" ? (
          <div className="space-x-2">
            <Button variant="ghost" type="button" onClick={() => toggleEditSection(null)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => toggleEditSection("community")}>Edit</Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing === "community" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="averageGroupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Group Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coreDemographic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Core Demographic</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEMOGRAPHIC_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Run Types</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {runTypes.map((tag) => (
                  <div key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeRunType(tag)}
                      className="ml-1 text-blue-800 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <Select
                  value={selectedRunType}
                  onValueChange={setSelectedRunType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select run type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableRunTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (selectedRunType) {
                      addRunType(selectedRunType);
                    }
                  }}
                  type="button"
                  disabled={!selectedRunType}
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Event Experience</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {eventExperience.map((tag) => (
                  <div key={tag} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeEventExperience(tag)}
                      className="ml-1 text-orange-800 hover:text-orange-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <Select
                  value={selectedEventExp}
                  onValueChange={setSelectedEventExp}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableEventExperiences().map(event => (
                      <SelectItem key={event} value={event}>{event}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (selectedEventExp) {
                      addEventExperience(selectedEventExp);
                    }
                  }}
                  type="button"
                  disabled={!selectedEventExp}
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-md flex items-center border">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium">Average Group Size</p>
                  <p className="text-2xl font-bold">{form.getValues("averageGroupSize") || 0} runners</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-md flex items-center border">
                <User className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium">Core Demographic</p>
                  <p className="text-2xl font-bold">{form.getValues("coreDemographic") || "Not specified"} years</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Run Types</p>
              <div className="flex flex-wrap gap-2">
                {runTypes.length > 0 ? runTypes.map((tag) => (
                  <div key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">No run types specified</p>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Event Experience</p>
              <div className="flex flex-wrap gap-2">
                {eventExperience.length > 0 ? eventExperience.map((tag) => (
                  <div key={tag} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">No event experience specified</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityInfoSection;
