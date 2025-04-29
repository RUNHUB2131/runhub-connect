
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { BrandProfileFormValues } from "@/schemas/brandProfileFormSchema";

interface BrandDetailsSectionProps {
  form: UseFormReturn<BrandProfileFormValues>;
  isEditing: string | null;
  isLoading: boolean;
  selectedTargetAudience: string;
  selectedPreviousSponsorship: string;
  toggleEditSection: (section: string | null) => void;
  setSelectedTargetAudience: (value: string) => void;
  setSelectedPreviousSponsorship: (value: string) => void;
  addTargetAudience: (tag: string) => void;
  removeTargetAudience: (index: number) => void;
  addPreviousSponsorship: (tag: string) => void;
  removePreviousSponsorship: (index: number) => void;
}

const BrandDetailsSection: React.FC<BrandDetailsSectionProps> = ({
  form,
  isEditing,
  isLoading,
  selectedTargetAudience,
  selectedPreviousSponsorship,
  toggleEditSection,
  setSelectedTargetAudience,
  setSelectedPreviousSponsorship,
  addTargetAudience,
  removeTargetAudience,
  addPreviousSponsorship,
  removePreviousSponsorship
}) => {
  const handleAddTargetAudience = () => {
    if (selectedTargetAudience.trim()) {
      addTargetAudience(selectedTargetAudience.trim());
      setSelectedTargetAudience("");
    }
  };

  const handleAddPreviousSponsorship = () => {
    if (selectedPreviousSponsorship.trim()) {
      addPreviousSponsorship(selectedPreviousSponsorship.trim());
      setSelectedPreviousSponsorship("");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Brand Details</CardTitle>
          <CardDescription>More about your brand and its history</CardDescription>
        </div>
        {isEditing === "details" ? (
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
          <Button variant="outline" onClick={() => toggleEditSection("details")}>Edit</Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing === "details" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Founded</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Year founded" 
                        {...field}
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1001+">1001+ employees</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Target Audience */}
            <div>
              <FormLabel>Target Audience</FormLabel>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={selectedTargetAudience}
                  onChange={(e) => setSelectedTargetAudience(e.target.value)}
                  placeholder="Add target audience"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTargetAudience();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleAddTargetAudience}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.getValues("targetAudience")?.map((audience, index) => (
                  <Badge key={index} className="gap-1 pl-3 pr-2">
                    {audience}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 hover:bg-transparent" 
                      onClick={() => removeTargetAudience(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </div>
            
            {/* Previous Sponsorship */}
            <div>
              <FormLabel>Previous Sponsorship Experience</FormLabel>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={selectedPreviousSponsorship}
                  onChange={(e) => setSelectedPreviousSponsorship(e.target.value)}
                  placeholder="Add previous sponsorships"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPreviousSponsorship();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleAddPreviousSponsorship}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.getValues("previousSponsorship")?.map((sponsorship, index) => (
                  <Badge key={index} className="gap-1 pl-3 pr-2">
                    {sponsorship}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 hover:bg-transparent" 
                      onClick={() => removePreviousSponsorship(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium text-sm mb-1">Year Founded</h3>
                <p className="text-lg">{form.getValues("foundedYear") || "-"}</p>
              </div>
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium text-sm mb-1">Company Size</h3>
                <p className="text-lg">{form.getValues("companySize") || "-"}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium text-sm mb-2">Target Audience</h3>
              {form.getValues("targetAudience")?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.getValues("targetAudience").map((audience, index) => (
                    <Badge key={index} variant="secondary">
                      {audience}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No target audience specified</p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium text-sm mb-2">Previous Sponsorship Experience</h3>
              {form.getValues("previousSponsorship")?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.getValues("previousSponsorship").map((sponsorship, index) => (
                    <Badge key={index} variant="secondary">
                      {sponsorship}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No previous sponsorships</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandDetailsSection;
