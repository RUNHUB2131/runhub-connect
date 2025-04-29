import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { User, Users, Instagram, Twitter, Facebook, Link } from "lucide-react";

// Define the form schema with validation rules
const profileFormSchema = z.object({
  clubName: z.string().min(2, "Club name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  memberCount: z.coerce.number().int().nonnegative("Member count must be a positive number"),
  description: z.string().max(500, "Description cannot exceed 500 characters"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  instagramHandle: z.string().optional(),
  instagramFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
  twitterHandle: z.string().optional(),
  twitterFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
  facebookPage: z.string().optional(),
  facebookFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { toast } = useToast();

  // Set up form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      clubName: "Sunrise Runners",
      location: "San Francisco, CA",
      memberCount: 45,
      description: "A diverse run club meeting twice weekly for morning and evening runs, welcoming runners of all levels. We organize monthly events and participate in local races.",
      website: "https://sunriserunners.com",
      instagramHandle: "sunrise_runners",
      instagramFollowers: 1200,
      twitterHandle: "sunriserunSF",
      twitterFollowers: 750,
      facebookPage: "Sunrise Runners Club",
      facebookFollowers: 980,
    }
  });

  // Handle section editing toggle
  const toggleEditSection = (section: string | null) => {
    setIsEditing(section);
  };

  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form data submitted:", data);
    // Here we would typically save to the backend
    
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved.",
    });
    
    setIsEditing(null);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Basic Info Section */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your run club's essential details</CardDescription>
                </div>
                {isEditing === "basic" ? (
                  <div className="space-x-2">
                    <Button variant="ghost" onClick={() => toggleEditSection(null)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => toggleEditSection("basic")}>Edit</Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clubName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your run club name" 
                            {...field} 
                            disabled={isEditing !== "basic"}
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
                            disabled={isEditing !== "basic"} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="memberCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member Count</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Number of members" 
                            type="number" 
                            {...field}
                            value={field.value}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            disabled={isEditing !== "basic"} 
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
                            disabled={isEditing !== "basic"} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell brands about your run club" 
                            {...field} 
                            disabled={isEditing !== "basic"} 
                            className="min-h-[100px]" 
                          />
                        </FormControl>
                        <FormDescription>
                          Highlight what makes your community special (max 500 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media Section */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>Connect your social accounts and share your following</CardDescription>
                </div>
                {isEditing === "social" ? (
                  <div className="space-x-2">
                    <Button variant="ghost" onClick={() => toggleEditSection(null)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => toggleEditSection("social")}>Edit</Button>
                )}
              </CardHeader>
              <CardContent>
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
                                disabled={isEditing !== "social"} 
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
                              disabled={isEditing !== "social"} 
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
                                disabled={isEditing !== "social"} 
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
                              disabled={isEditing !== "social"} 
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
                                disabled={isEditing !== "social"} 
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
                              disabled={isEditing !== "social"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Community Section */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Community Information</CardTitle>
                  <CardDescription>Share details about your community demographics</CardDescription>
                </div>
                {isEditing === "community" ? (
                  <div className="space-x-2">
                    <Button variant="ghost" onClick={() => toggleEditSection(null)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => toggleEditSection("community")}>Edit</Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-md flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Average Group Size</p>
                      <p className="text-2xl font-bold">{isEditing === "community" ? 
                        <Input className="mt-1 p-1 h-8 text-lg" defaultValue="25" /> : 
                        "25"} runners</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md flex items-center">
                    <User className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Core Demographic</p>
                      <p className="text-2xl font-bold">{isEditing === "community" ? 
                        <Input className="mt-1 p-1 h-8 text-lg" defaultValue="25-34" /> : 
                        "25-34"} years</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Run Types</p>
                  <div className="flex flex-wrap gap-2">
                    {["Road", "Trail", "Track", "Urban"].map((tag) => (
                      <div key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </div>
                    ))}
                    {isEditing === "community" && (
                      <Button variant="outline" size="sm" className="rounded-full h-7">+ Add</Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Event Experience</p>
                  <div className="flex flex-wrap gap-2">
                    {["Races", "Charity Runs", "Sponsored Events", "Community Meetups"].map((tag) => (
                      <div key={tag} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </div>
                    ))}
                    {isEditing === "community" && (
                      <Button variant="outline" size="sm" className="rounded-full h-7">+ Add</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
