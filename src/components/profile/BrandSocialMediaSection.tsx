
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { BrandProfileFormValues } from "@/schemas/brandProfileFormSchema";

interface BrandSocialMediaSectionProps {
  form: UseFormReturn<BrandProfileFormValues>;
  isEditing: string | null;
  isLoading: boolean;
  toggleEditSection: (section: string | null) => void;
}

const BrandSocialMediaSection: React.FC<BrandSocialMediaSectionProps> = ({
  form,
  isEditing,
  isLoading,
  toggleEditSection
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Connect your brand's social presence</CardDescription>
        </div>
        {isEditing === "social" ? (
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
          <Button variant="outline" onClick={() => toggleEditSection("social")}>Edit</Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing === "social" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="linkedinHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Linkedin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        {...field} 
                        placeholder="LinkedIn profile" 
                        className="pl-10" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitterHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Twitter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        {...field} 
                        placeholder="Twitter handle" 
                        className="pl-10" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagramHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Instagram className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        {...field} 
                        placeholder="Instagram handle" 
                        className="pl-10" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebookPage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Facebook className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        {...field} 
                        placeholder="Facebook page" 
                        className="pl-10" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-md border">
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-sm">LinkedIn</h3>
                  <p className="text-base">{form.getValues("linkedinHandle") || "-"}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <div className="flex items-center gap-3">
                <Twitter className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="font-medium text-sm">Twitter</h3>
                  <p className="text-base">{form.getValues("twitterHandle") || "-"}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-pink-500" />
                <div>
                  <h3 className="font-medium text-sm">Instagram</h3>
                  <p className="text-base">{form.getValues("instagramHandle") || "-"}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-sm">Facebook</h3>
                  <p className="text-base">{form.getValues("facebookPage") || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandSocialMediaSection;
