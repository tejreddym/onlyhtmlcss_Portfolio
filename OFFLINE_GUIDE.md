# Service Worker & Offline Mode Setup

## ✅ What's Now Fixed

### Service Worker Improvements:

1. **Better error handling** - Won't crash if some files fail to cache
2. **Cache version bumped** - Now `tejreddym-v2` (clears old cache)
3. **Removed scroll-to-top.js** - No longer trying to cache deleted file
4. **Improved fetch strategy** - Cache-first for assets, network-first for pages
5. **Better offline detection** - Shows offline page when network unavailable

### Offline Page Improvements:

1. **Faster auto-refresh** - Checks every 3 seconds (was 5)
2. **Connection stability delay** - Waits 1 second before reloading
3. **Better retry logic** - More reliable connection detection

## 🧪 How to Test Offline Mode

### Method 1: Using Chrome DevTools (Easiest)

1. Open your site: `https://tejreddym.cv/`
2. Press **F12** to open DevTools
3. Go to **Application** tab
4. Click **Service Workers** (left sidebar)
5. Check "Offline" checkbox
6. Now refresh the page or navigate around
7. You should see the offline page if it tries to fetch new content

### Method 2: Disable WiFi

1. Turn off your internet connection completely
2. Try to load a page
3. It should show the offline page
4. Turn WiFi back on - it should auto-reload

### Method 3: Network Throttling in DevTools

1. Open DevTools (**F12**)
2. Go to **Network** tab
3. Find "No throttling" dropdown (top-left)
4. Select "Offline"
5. Try to reload - offline page appears
6. Set back to "No throttling" - auto-reloads

## 📋 What Gets Cached

**Cached for Offline Access:**

- ✅ All 5 HTML pages (/, about, projects, interests, contact)
- ✅ CSS files (style.css, proj-style.css)
- ✅ JavaScript files (scripts.js, contact-form.js, fab-menu.js)
- ✅ Project images (project-1.webp, project-2.webp, project-3.webp)
- ✅ Offline fallback page (offline.html)

**NOT Cached (External/Dynamic):**

- ❌ GitHub API stats (requires network)
- ❌ Bootstrap CDN (requires network)
- ❌ Google Fonts (requires network)
- ❌ External images/videos

## 🔧 Troubleshooting

### Issue: Still seeing "Can't load page" message

**Solution:**

1. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
2. Clear cache: DevTools → Application → Clear storage
3. Wait 5 seconds for offline page to appear
4. Check browser console (F12) for any errors

### Issue: Service Worker not registering

**Check:**

1. Open DevTools → Console
2. Should see: `✅ Service Worker registered: https://tejreddym.cv/`
3. If you see error, hard refresh browser

### Issue: Offline page not showing

**Check:**

1. DevTools → Application → Cache storage
2. Look for "tejreddym-v2" cache
3. Should have offline.html cached inside

## 📊 First-time Caching

When you first visit your site:

1. Service Worker installs (registers in background)
2. All files get cached (takes ~5-10 seconds)
3. First visit might show loading indicators
4. Subsequent visits use cache (much faster!)

## 🚀 Deployment Notes

After pushing these changes:

1. Hard refresh your site
2. Service Worker updates automatically
3. Old "tejreddym-v1" cache auto-deletes
4. New "tejreddym-v2" cache gets created

The offline functionality is now **fully functional** and production-ready! 🎉
