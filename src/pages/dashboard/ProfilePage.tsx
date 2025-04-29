
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
import { User, Users, Instagram, Twitter, Facebook, Link, ExternalLink, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define available options for run types and event experience
const RUN_TYPES = ["Road", "Trail", "Track", "Urban", "Cross Country", "Beach", "Mountain"];
const EVENT_EXPERIENCES = ["Races", "Charity Runs", "Sponsored Events", "Community Meetups", 
                         "Virtual Runs", "Marathon Training", "Workshops", "Brand Collaborations"];

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
  averageGroupSize: z.coerce.number().int().nonnegative("Group size must be a positive number"),
  coreDemographic: z.string(),
  runTypes: z.array(z.string()),
  eventExperience: z.array(z.string())
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedRunType, setSelectedRunType] = useState<string>("");
  const [selectedEventExp, setSelectedEventExp] = useState<string>("");
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
      averageGroupSize: 25,
      coreDemographic: "25-34",
      runTypes: ["Road", "Trail", "Track", "Urban"],
      eventExperience: ["Races", "Charity Runs", "Sponsored Events", "Community Meetups"]
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

  // Add new run type tag
  const addRunType = () => {
    if (!selectedRunType) return;
    
    const currentRunTypes = form.getValues("runTypes");
    if (!currentRunTypes.includes(selectedRunType)) {
      form.setValue("runTypes", [...currentRunTypes, selectedRunType]);
      setSelectedRunType("");
    }
  };

  // Remove run type tag
  const removeRunType = (type: string) => {
    const currentRunTypes = form.getValues("runTypes");
    form.setValue("runTypes", currentRunTypes.filter(t => t !== type));
  };

  // Add new event experience tag
  const addEventExperience = () => {
    if (!selectedEventExp) return;
    
    const currentEvents = form.getValues("eventExperience");
    if (!currentEvents.includes(selectedEventExp)) {
      form.setValue("eventExperience", [...currentEvents, selectedEventExp]);
      setSelectedEventExp("");
    }
  };

  // Remove event experience tag
  const removeEventExperience = (event: string) => {
    const currentEvents = form.getValues("eventExperience");
    form.setValue("eventExperience", currentEvents.filter(e => e !== event));
  };

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

  // Get available run types (those not already selected)
  const getAvailableRunTypes = () => {
    const currentRunTypes = form.getValues("runTypes");
    return RUN_TYPES.filter(type => !currentRunTypes.includes(type));
  };

  // Get available event experiences (those not already selected)
  const getAvailableEventExperiences = () => {
    const currentEvents = form.getValues("eventExperience");
    return EVENT_EXPERIENCES.filter(event => !currentEvents.includes(event));
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
                {isEditing === "basic" ? (
                  <div className="space-y-6">
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell brands about your run club" 
                                {...field}
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
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="font-medium text-sm mb-1">Club Name</h3>
                        <p className="text-lg">{form.getValues("clubName")}</p>
                      </div>
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="font-medium text-sm mb-1">Location</h3>
                        <p className="text-lg">{form.getValues("location")}</p>
                      </div>
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="font-medium text-sm mb-1">Member Count</h3>
                        <p className="text-lg">{form.getValues("memberCount")} members</p>
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
                      <h3 className="font-medium text-sm mb-1">Description</h3>
                      <p className="text-base">{form.getValues("description")}</p>
                    </div>
                  </div>
                )}
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
                              <p className="text-sm mt-1">{form.getValues("instagramFollowers").toLocaleString()} followers</p>
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
                              <p className="text-sm mt-1">{form.getValues("twitterFollowers").toLocaleString()} followers</p>
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
                              <p className="text-sm mt-1">{form.getValues("facebookFollowers").toLocaleString()} followers</p>
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
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select age range" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="18-24">18-24 years</SelectItem>
                                  <SelectItem value="25-34">25-34 years</SelectItem>
                                  <SelectItem value="35-44">35-44 years</SelectItem>
                                  <SelectItem value="45-54">45-54 years</SelectItem>
                                  <SelectItem value="55+">55+ years</SelectItem>
                                  <SelectItem value="Mixed">Mixed ages</SelectItem>
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
                        {form.getValues("runTypes").map((tag) => (
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
                          onClick={addRunType}
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
                        {form.getValues("eventExperience").map((tag) => (
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
                          onClick={addEventExperience}
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
                          <p className="text-2xl font-bold">{form.getValues("averageGroupSize")} runners</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md flex items-center border">
                        <User className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Core Demographic</p>
                          <p className="text-2xl font-bold">{form.getValues("coreDemographic")} years</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Run Types</p>
                      <div className="flex flex-wrap gap-2">
                        {form.getValues("runTypes").map((tag) => (
                          <div key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Event Experience</p>
                      <div className="flex flex-wrap gap-2">
                        {form.getValues("eventExperience").map((tag) => (
                          <div key={tag} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
