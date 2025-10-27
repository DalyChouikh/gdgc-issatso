-- Script to create first super_admin user
-- Run this in Supabase SQL Editor AFTER creating your first user via signup

-- Step 1: Find your user ID (replace the email with your actual email)
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Step 2: Update the user to be a super_admin (replace YOUR_USER_ID with the actual UUID)
-- UPDATE public.users 
-- SET role = 'super_admin', 
--     full_name = 'Your Name',
--     is_active = true
-- WHERE id = 'YOUR_USER_ID';

-- OR use this one-liner (replace the email):
UPDATE public.users 
SET role = 'super_admin', 
    is_active = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com' LIMIT 1);

-- Verify the update
SELECT u.id, u.email, u.full_name, u.role, u.is_active
FROM public.users u
WHERE u.role = 'super_admin';
