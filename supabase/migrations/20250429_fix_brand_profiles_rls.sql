
-- First, let's enable Row Level Security on the brand_profiles table if it's not already enabled
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- Now let's create RLS policies for the brand_profiles table
-- 1. Allow users to view their own profile
CREATE POLICY "Users can view their own brand profile"
ON public.brand_profiles
FOR SELECT
USING (auth.uid() = id);

-- 2. Allow users to insert their own profile
CREATE POLICY "Users can insert their own brand profile"
ON public.brand_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 3. Allow users to update their own profile
CREATE POLICY "Users can update their own brand profile"
ON public.brand_profiles
FOR UPDATE
USING (auth.uid() = id);

-- 4. Allow users to delete their own profile
CREATE POLICY "Users can delete their own brand profile"
ON public.brand_profiles
FOR DELETE
USING (auth.uid() = id);
