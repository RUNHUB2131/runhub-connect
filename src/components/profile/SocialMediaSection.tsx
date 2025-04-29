
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Instagram, Twitter, Facebook } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/schemas/profileFormSchema";

interface SocialMediaSectionProps {
  form: UseFormReturn<ProfileFormValues>;
  isEditing: string | null;
  isLoading: boolean;
  toggleEditSection: (section: string | null) => void;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  form,
  isEditing,
  isLoading,
  toggleEditSection
}) => {
  // Format social media URL
  const formatSocialUrl = (platform: string, handle: string) => {
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${handle}`;
      case 'twitter':
        return `https://twitter.com/${handle}`;
      case 'facebook':
        return `https://facebook.com/${handle}`;
      default:
        return '';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Connect your social accounts and share your following</CardDescription>
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center w-full sm:w-1/2">
                <Instagram className="h-5 w-5 text-pink-500 mr-2" />
                <FormField
                  control={form.control}
                  name="instagramHandle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input 
                          placeholder="Instagram handle" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="instagramFollowers"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormControl>
                      <Input 
                        placeholder="Follower count" 
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
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center w-full sm:w-1/2">
                <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                <FormField
                  control={form.control}
                  name="twitterHandle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input 
                          placeholder="Twitter handle" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="twitterFollowers"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormControl>
                      <Input 
                        placeholder="Follower count" 
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
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center w-full sm:w-1/2">
                <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                <FormField
                  control={form.control}
                  name="facebookPage"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input 
                          placeholder="Facebook page" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="facebookFollowers"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormControl>
                      <Input 
                        placeholder="Follower count" 
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
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-md flex items-start gap-3 border">
                <Instagram className="h-5 w-5 text-pink-500 mt-1" />
                <div>
                  <h3 className="font-medium text-sm mb-1">Instagram</h3>
                  {form.getValues("instagramHandle") ? (
                    <>
                      <a 
                        href={formatSocialUrl("instagram", form.getValues("instagramHandle"))} 
                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        @{form.getValues("instagramHandle")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <p className="text-sm mt-1">{(form.getValues("instagramFollowers") || 0).toLocaleString()} followers</p>
                    </>
                  ) : (
                    <p className="text-base">Not connected</p>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-md flex items-start gap-3 border">
                <Twitter className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-medium text-sm mb-1">Twitter</h3>
                  {form.getValues("twitterHandle") ? (
                    <>
                      <a 
                        href={formatSocialUrl("twitter", form.getValues("twitterHandle"))} 
                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        @{form.getValues("twitterHandle")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <p className="text-sm mt-1">{(form.getValues("twitterFollowers") || 0).toLocaleString()} followers</p>
                    </>
                  ) : (
                    <p className="text-base">Not connected</p>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-md flex items-start gap-3 border">
                <Facebook className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-sm mb-1">Facebook</h3>
                  {form.getValues("facebookPage") ? (
                    <>
                      <a 
                        href={formatSocialUrl("facebook", form.getValues("facebookPage"))} 
                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {form.getValues("facebookPage")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <p className="text-sm mt-1">{(form.getValues("facebookFollowers") || 0).toLocaleString()} followers</p>
                    </>
                  ) : (
                    <p className="text-base">Not connected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
