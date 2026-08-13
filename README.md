# Independence Playlist (based on azaad-bharat)

This repo contains a Vite + React app. Instructions here show how to create a GitHub repository, push this code, and deploy to Azure Web Apps using GitHub Actions.

Quick commands (local):

1. Initialize git and commit

```bash
cd azaad-bharat
git init
git add .
git commit -m "Initial commit"
```

2. Create a GitHub repo and push (using `gh` CLI)

```bash
gh repo create independence-playlist --public --source=. --remote=origin --push
```

Or create a repo on GitHub web and run:

```bash
git remote add origin https://github.com/<your-user>/independence-playlist.git
git branch -M main
git push -u origin main
```

3. Configure GitHub secret for Azure deployment

- In the repo Settings → Secrets → Actions, add `AZURE_PUBLISH_PROFILE` with the publish profile XML from your Web App (download from Azure Portal). Also optionally set `AZURE_WEBAPP_NAME`.

4. Azure Web App creation (optional, using `az` CLI):

```bash
az group create -n myResourceGroup -l eastus
az appservice plan create -n myPlan -g myResourceGroup --sku B1 --is-linux
az webapp create -n <app-name> -g myResourceGroup -p myPlan --runtime "NODE|18-lts"
az webapp deployment list-publishing-profiles -n <app-name> -g myResourceGroup --query "[0].publishProfile" -o tsv
```

5. After pushing to `main`, GitHub Actions will build and deploy automatically.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1f59f3dc-47d2-41c2-84ba-f2c58db8e0ec

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
