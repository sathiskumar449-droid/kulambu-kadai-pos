# Deployment Checklist

## Pre-Deployment Checklist

### ✅ Development Environment
- [ ] All dependencies installed (`npm install`)
- [ ] Application runs locally without errors (`npm run dev`)
- [ ] All pages load correctly
- [ ] No console errors in browser

### ✅ Supabase Setup
- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] Sample data loaded
- [ ] API credentials obtained (URL + anon key)
- [ ] Environment variables configured in `.env`
- [ ] Realtime enabled in Supabase settings

### ✅ Functionality Testing
- [ ] Dashboard loads with correct data
- [ ] Can place orders from POS screen
- [ ] Cart calculations are correct
- [ ] Orders save to database
- [ ] Stock automatically deducts after order
- [ ] Stock page shows correct quantities
- [ ] Can add/edit/delete menu items
- [ ] Menu changes reflect in POS immediately
- [ ] Reports generate correctly
- [ ] Charts display data properly
- [ ] CSV export works

### ✅ Responsive Design Testing
- [ ] Test on mobile phone (iOS/Android)
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Bottom navigation works on mobile
- [ ] Sidebar works on desktop
- [ ] All buttons are clickable
- [ ] Forms are usable on mobile

### ✅ Data Validation
- [ ] Cannot place empty orders
- [ ] Negative quantities prevented
- [ ] Price validation works
- [ ] Required fields enforced
- [ ] Delete confirmations working

## Deployment to Vercel

### Step 1: Prepare Code
```bash
# Build the project locally to check for errors
npm run build

# Test the production build
npm run preview
```

### Step 2: Git Setup
```bash
git init
git add .
git commit -m "Initial deployment"
```

### Step 3: Push to GitHub
```bash
# Create new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/kulambu-kadai-pos.git
git branch -M main
git push -u origin main
```

### Step 4: Vercel Deployment
1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **New Project**
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

7. Click **Deploy**
8. Wait for deployment to complete
9. Test your live site!

## Post-Deployment Checklist

### ✅ Production Testing
- [ ] Open production URL
- [ ] Test all pages load
- [ ] Place a test order
- [ ] Check stock updates
- [ ] Verify reports work
- [ ] Test on real mobile device
- [ ] Check loading speeds
- [ ] Verify realtime updates work

### ✅ Configuration
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Environment variables secured
- [ ] `.env` file NOT committed to Git

### ✅ Supabase Production Settings
- [ ] Enable connection pooling if needed
- [ ] Set up database backups
- [ ] Monitor usage/limits
- [ ] Review RLS policies for security
- [ ] Consider upgrading plan if needed

### ✅ Documentation
- [ ] README.md updated with live URL
- [ ] Staff training completed
- [ ] Menu items configured
- [ ] Stock quantities set correctly
- [ ] Admin access documented

## Monitoring & Maintenance

### Daily
- [ ] Check if system is accessible
- [ ] Verify orders are being saved
- [ ] Check stock levels

### Weekly
- [ ] Review error logs in Vercel dashboard
- [ ] Check Supabase database usage
- [ ] Backup important data
- [ ] Review sales reports

### Monthly
- [ ] Update dependencies if needed
- [ ] Review and optimize database queries
- [ ] Check storage usage
- [ ] Analyze user patterns

## Security Recommendations

### Before Going Live
1. **Add Authentication**
   - Enable Supabase Auth
   - Create admin user
   - Protect sensitive operations

2. **Update RLS Policies**
   ```sql
   -- Example: Restrict delete to authenticated users
   CREATE POLICY "Allow delete for authenticated users only"
   ON menu_items FOR DELETE
   USING (auth.role() = 'authenticated');
   ```

3. **Environment Variables**
   - Never commit `.env` to version control
   - Use different Supabase projects for dev/prod
   - Rotate API keys regularly

4. **Rate Limiting**
   - Configure rate limiting in Supabase
   - Monitor API usage
   - Set up alerts for unusual activity

## Rollback Plan

If something goes wrong:

### Vercel Rollback
1. Go to Vercel dashboard
2. Select your project
3. Go to Deployments
4. Click on previous working deployment
5. Click **Promote to Production**

### Database Rollback
1. Go to Supabase dashboard
2. Use SQL Editor to restore from backup
3. Or restore from point-in-time recovery (Pro plan)

## Performance Optimization

- [ ] Enable Vercel Edge caching
- [ ] Optimize images if added later
- [ ] Use connection pooling in Supabase
- [ ] Monitor slow queries
- [ ] Consider CDN for static assets

## Support Contacts

- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- React Community: https://react.dev/community

## Estimated Costs

### Free Tier Limits
- **Vercel**: 
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Commercial use allowed

- **Supabase**:
  - 500 MB database
  - 1 GB file storage
  - 2 GB bandwidth
  - 50,000 monthly active users

### When to Upgrade
- Vercel: If bandwidth exceeds 100 GB
- Supabase: If database size > 500 MB or need more concurrent connections

## Final Notes

✅ **Backup Strategy**: Set up automatic daily backups in Supabase

✅ **Monitoring**: Set up uptime monitoring (e.g., UptimeRobot)

✅ **Analytics**: Consider adding Google Analytics or Plausible

✅ **Updates**: Check for security updates monthly

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Production URL**: _______________

**Notes**: 
_________________________________________________
_________________________________________________
_________________________________________________
