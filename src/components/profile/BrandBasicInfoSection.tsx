
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { BrandProfileFormValues } from "@/schemas/brandProfileFormSchema";

interface BrandBasicInfoSectionProps {
  form: UseFormReturn<BrandProfileFormValues>;
  isEditing: string | null;
  isLoading: boolean;
  toggleEditSection: (section: string | null) => void;
}

const BrandBasicInfoSection: React.FC<BrandBasicInfoSectionProps> = ({
  form,
  isEditing,
  isLoading,
  toggleEditSection
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Your brand's essential details</CardDescription>
        </div>
        {isEditing === "basic" ? (
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
          <Button variant="outline" onClick={() => toggleEditSection("basic")}>Edit</Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing === "basic" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your company name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City, State" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your industry" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell run clubs about your brand" 
                        {...field}
                        className="min-h-[100px]" 
                      />
                    </FormControl>
                    <FormDescription>
                      Highlight what makes your brand special (max 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium text-sm mb-1">Company Name</h3>
                <p className="text-lg">{form.getValues("companyName") || "-"}</p>
              </div>
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium text-sm mb-1">Location</h3>
                <p className="text-lg">{form.getValues("location") || "-"}</p>
              </div>
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium text-sm mb-1">Industry</h3>
                <p className="text-lg">{form.getValues("industry") || "-"}</p>
              </div>
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium text-sm mb-1">Website</h3>
                {form.getValues("website") ? (
                  <a 
                    href={form.getValues("website")} 
                    className="text-lg text-blue-600 hover:underline flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {form.getValues("website")}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="text-lg">-</p>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium text-sm mb-1">Company Description</h3>
              <p className="text-base">{form.getValues("description") || "-"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandBasicInfoSection;
