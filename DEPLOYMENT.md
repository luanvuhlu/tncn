# Deployment Guide for thue.luanvv.com

This guide explains how to deploy your Vietnamese tax calculation website to the subdomain `thue.luanvv.com` using CloudFlare Pages.

## Option 1: CloudFlare Pages (Recommended)

### Prerequisites
- CloudFlare account with `luanvv.com` domain
- GitHub repository access

### Setup Steps

#### 1. CloudFlare Pages Setup
1. Log in to CloudFlare Dashboard
2. Go to **Pages** section
3. Click **Create a project**
4. Select **Connect to Git**
5. Choose your GitHub repository `luanvuhlu/tncn`
6. Configure build settings:
   - **Build command**: Leave empty (static files)
   - **Build output directory**: `public`
   - **Root directory**: Leave empty
7. Click **Save and Deploy**

#### 2. Custom Domain Configuration
1. After successful deployment, go to your Pages project
2. Navigate to **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `thue.luanvv.com`
5. CloudFlare will automatically:
   - Create the DNS CNAME record
   - Provision SSL certificate
   - Set up redirects

#### 3. GitHub Secrets Setup
For the automated deployment workflow, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following secrets:

**CLOUDFLARE_API_TOKEN**:
- Go to CloudFlare Dashboard > My Profile > API Tokens
- Click **Create Token**
- Use **Custom token** template
- Permissions: `Zone:Zone:Read`, `Page:Edit`
- Zone Resources: `Include - Specific zone - luanvv.com`
- Account Resources: `Include - All accounts`

**CLOUDFLARE_ACCOUNT_ID**:
- Found in CloudFlare Dashboard right sidebar under **Account ID**

#### 4. Update Workflow Configuration
Edit `.github/workflows/deploy.yml`:
```yaml
projectName: your-actual-project-name # Replace with your CloudFlare Pages project name
```

## Option 2: Firebase Hosting with Custom Domain

### Setup Steps

#### 1. Create New Firebase Project (for subdomain)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create new project or use existing
firebase init hosting
```

#### 2. Configure Custom Domain
1. In Firebase Console, go to **Hosting**
2. Click **Add custom domain**
3. Enter `thue.luanvv.com`
4. Follow verification steps
5. Add DNS records to CloudFlare:
   - Type: A, Name: thue, Value: (Firebase IP addresses)
   - Or Type: CNAME, Name: thue, Value: (Firebase hosting domain)

#### 3. GitHub Secrets for Firebase
Add to GitHub repository secrets:

**FIREBASE_TOKEN**:
```bash
# Generate token
firebase login:ci
# Copy the generated token
```

### Deployment Commands

#### Manual Deployment
```bash
# CloudFlare Pages (if using Wrangler CLI)
npx wrangler pages publish public --project-name=thue-luanvv

# Firebase Hosting
firebase deploy
```

#### Automated Deployment
- Push to `master` branch triggers automatic deployment
- Pull requests create preview deployments

## DNS Configuration Summary

For `thue.luanvv.com` subdomain, you'll need one of these DNS records in CloudFlare:

**Option 1 (CloudFlare Pages)**: Automatically handled by CloudFlare
**Option 2 (Firebase)**: 
- Type: CNAME
- Name: thue
- Target: (Firebase provided domain)

## Verification

After deployment, verify:
1. Visit `https://thue.luanvv.com`
2. Check SSL certificate
3. Test functionality
4. Verify automatic deployments work

## Troubleshooting

### Common Issues
1. **DNS propagation**: May take up to 24 hours
2. **SSL certificate**: Automatic provisioning may take a few minutes
3. **Build failures**: Check workflow logs in GitHub Actions

### Support
- CloudFlare Pages: [Documentation](https://developers.cloudflare.com/pages/)
- Firebase Hosting: [Documentation](https://firebase.google.com/docs/hosting)
