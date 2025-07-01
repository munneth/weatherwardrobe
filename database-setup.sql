-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

DROP POLICY IF EXISTS "Users can view own wardrobe items" ON public.wardrobe_items;
DROP POLICY IF EXISTS "Users can insert own wardrobe items" ON public.wardrobe_items;
DROP POLICY IF EXISTS "Users can update own wardrobe items" ON public.wardrobe_items;
DROP POLICY IF EXISTS "Users can delete own wardrobe items" ON public.wardrobe_items;

DROP POLICY IF EXISTS "Users can view own outfits" ON public.outfits;
DROP POLICY IF EXISTS "Users can insert own outfits" ON public.outfits;
DROP POLICY IF EXISTS "Users can update own outfits" ON public.outfits;
DROP POLICY IF EXISTS "Users can delete own outfits" ON public.outfits;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Firebase UID
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wardrobe_items table
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory')) NOT NULL,
    color TEXT NOT NULL,
    material TEXT NOT NULL,
    season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter', 'all')),
    weather_condition TEXT CHECK (weather_condition IN ('sunny', 'rainy', 'snowy', 'cloudy', 'all')),
    min_temp INTEGER,
    max_temp INTEGER,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outfits table
CREATE TABLE IF NOT EXISTS public.outfits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    items UUID[] NOT NULL, -- Array of wardrobe_item IDs
    season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter', 'all')) NOT NULL,
    weather_condition TEXT CHECK (weather_condition IN ('sunny', 'rainy', 'snowy', 'cloudy', 'all')) NOT NULL,
    min_temp INTEGER NOT NULL,
    max_temp INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

-- Note: users table RLS is disabled since we're using Firebase auth

-- Create RLS policies for wardrobe_items table
CREATE POLICY "Users can view own wardrobe items" ON public.wardrobe_items
    FOR SELECT USING (true); -- Allow all selects for now

CREATE POLICY "Users can insert own wardrobe items" ON public.wardrobe_items
    FOR INSERT WITH CHECK (true); -- Allow all inserts for now

CREATE POLICY "Users can update own wardrobe items" ON public.wardrobe_items
    FOR UPDATE USING (true); -- Allow all updates for now

CREATE POLICY "Users can delete own wardrobe items" ON public.wardrobe_items
    FOR DELETE USING (true); -- Allow all deletes for now

-- Create RLS policies for outfits table
CREATE POLICY "Users can view own outfits" ON public.outfits
    FOR SELECT USING (true); -- Allow all selects for now

CREATE POLICY "Users can insert own outfits" ON public.outfits
    FOR INSERT WITH CHECK (true); -- Allow all inserts for now

CREATE POLICY "Users can update own outfits" ON public.outfits
    FOR UPDATE USING (true); -- Allow all updates for now

CREATE POLICY "Users can delete own outfits" ON public.outfits
    FOR DELETE USING (true); -- Allow all deletes for now

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON public.wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_category ON public.wardrobe_items(category);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_season ON public.wardrobe_items(season);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_weather ON public.wardrobe_items(weather_condition);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON public.outfits(user_id); 