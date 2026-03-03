# 🔍 "Invalid Authentication Token" - Complete Debug Guide

## ✅ Enhanced Debugging Added

I've added comprehensive logging to help identify exactly where the token issue is occurring.

---

## 🧪 Step-by-Step Testing Process

### Step 1: Clear All Data First

Open browser console (F12) and run:
```javascript
localStorage.clear();
console.log('✅ Storage cleared');
location.reload();
```

### Step 2: Start Backend Server

Terminal/Command Prompt:
```bash
cd VeritasAI\backend
python main.py
```

Look for:
```
🚀 Starting VeritasAI Community Server...
📍 Server running at http://localhost:8000
📖 Docs available at http://localhost:8000/docs
INFO:     Application startup complete.
```

### Step 3: Register New Account

1. Open `auth/login.html`
2. Click "Register" tab
3. Fill form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123`
4. Click "Create Account"

**Expected Console Output:**
```javascript
// No console output expected during registration
```

**Expected Result:**
- ✅ Success alert appears
- ✅ Auto-switches to login tab after 2 seconds

### Step 4: Login with Credentials

1. On login tab, enter:
   - Username: `testuser`
   - Password: `test123`
2. Click "Login"

**Expected Console Output:**
```javascript
=== LOGIN SUCCESS ===
Access token: token_1_testuser_1709567890.123456
User data: {id: 1, username: "testuser", email: "test@example.com", ...}
Saved token: token_1_testuser_1709567890.123456
Saved user: {"id":1,"username":"testuser","email":"test@example.com",...}
=====================
```

**Check These:**
- ✅ Token starts with `token_`
- ✅ Token has format: `token_{userId}_{username}_{timestamp}`
- ✅ User data is saved as JSON string

**Expected UI Behavior:**
- ✅ Success alert: "Login successful! Redirecting..."
- ✅ Redirects to community page after 1.5 seconds

### Step 5: Check Community Page Load

After redirect to `community.html`, open console (F12):

**Expected Output:**
```javascript
// Should see authentication check results
```

In the page, you should see:
- ✅ User avatar in navbar (top-right) with first letter of username
- ✅ Username displayed next to avatar
- ✅ Feedback form visible
- ✅ Stats bar showing numbers

### Step 6: Submit Feedback

1. Fill feedback form:
   - Title: "Test submission"
   - Category: Select any (e.g., "General Feedback")
   - Content: "Testing the debug logging"
2. Click "Submit Feedback"

**Expected Console Output:**
```javascript
=== FEEDBACK SUBMISSION DEBUG ===
Token exists: YES
Token value: token_1_testuser_1709567890.123456
Token starts with "token_": true
Current user: {id: 1, username: "testuser", ...}
Title: Test submission
===============================
Response status: 200
Response data: {id: 1, title: "Test submission", content: "...", ...}
✅ Feedback submitted successfully!
```

**Expected UI Behavior:**
- ✅ Alert: "Feedback submitted successfully!"
- ✅ Form resets
- ✅ Feedback card appears in list below
- ✅ Stats update

---

## 🐛 Common Issues & Solutions

### Issue 1: Token Not Saved

**Console Shows:**
```javascript
Saved token: null
Saved user: null
```

**Cause:** localStorage not working or blocked

**Solutions:**
1. Check if browser allows localStorage:
   ```javascript
   try {
     localStorage.setItem('test', 'value');
     console.log('✅ localStorage works');
   } catch(e) {
     console.log('❌ localStorage blocked:', e);
   }
   ```

2. Try different browser (Chrome recommended)

3. Disable incognito/private mode

4. Check browser settings - may be blocking site data

---

### Issue 2: Token Format Wrong

**Console Shows:**
```javascript
Token value: undefined
Token starts with "token_": false
```

**Cause:** Backend not returning token correctly

**Check Backend Console:**
Look for errors like:
```
ERROR: Exception in ASGI application
...
```

**Solutions:**
1. Restart backend server
2. Check backend code is correct
3. Verify `/api/auth/login` endpoint works:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"test123"}'
   ```

---

### Issue 3: CORS Error

**Console Shows:**
```
Access to fetch at 'http://localhost:8000' from origin 'null' has been blocked by CORS policy
```

**Cause:** Browser blocking cross-origin requests

**Solutions:**
1. Make sure backend has CORS middleware:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. Restart backend after adding CORS

3. Try opening HTML file via local server instead of file://
   ```bash
   # Install simple HTTP server
   pip install httpserver
   
   # Or use Python built-in
   python -m http.server 8080
   ```

---

### Issue 4: Backend Not Running

**Console Shows:**
```
TypeError: Failed to fetch
```

**Solution:**
Start backend server:
```bash
cd VeritasAI\backend
python main.py
```

Verify it's running:
- Open browser to: `http://localhost:8000/api/health`
- Should show: `{"status":"healthy","version":"1.0.0"}`

---

### Issue 5: Token Exists But Still Getting 401

**Console Shows:**
```javascript
Token exists: YES
Token value: token_1_testuser_1709567890.123456
Token starts with "token_": true
Response status: 401
Response data: {detail: "Invalid authentication token"}
```

**Cause:** Backend authentication logic issue

**Check Backend Terminal:**
Look for:
```
Auth error: Invalid token format
```

**Solutions:**

1. **Verify Backend Code** - Check `get_current_user()` function:
   ```python
   async def get_current_user(authorization: str = None):
       # Handle both "Bearer token" and direct token
       token = authorization
       if authorization and authorization.startswith("Bearer "):
           token = authorization.replace("Bearer ", "")
       
       if not token or not token.startswith("token_"):
           raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Invalid authentication token",
               headers={"WWW-Authenticate": "Bearer"},
           )
   ```

2. **Add Print Statement** in backend to debug:
   ```python
   print(f"Authorization header: {authorization}")
   print(f"Extracted token: {token}")
   ```

3. **Restart Backend** after changes

---

### Issue 6: User Not Found

**Console Shows:**
```javascript
Response status: 404
Response data: {detail: "User not found"}
```

**Cause:** Token references user ID that doesn't exist

**Solution:**
1. Clear localStorage and re-login:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. Register fresh account

3. Login again

---

## 📊 Debug Flow Chart

```
Start
  ↓
Clear localStorage
  ↓
Start Backend
  ↓
Register Account → Check for errors
  ↓
Login → Check console logs
  ↓
Verify token saved correctly
  ↓
Navigate to Community
  ↓
Check navbar shows user
  ↓
Submit Feedback → Check debug logs
  ↓
Analyze response
  ↓
Success? → ✅ Done
  ↓
Error? → Follow specific error path above
```

---

## 🔧 Manual Token Verification

### Check Token in Browser:

1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Local Storage** → `file://` or `http://localhost...`
4. Look for keys:
   - `veritasai_token`
   - `veritasai_user`

**Token should look like:**
```
token_1_testuser_1709567890.123456
```

**User should be valid JSON:**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "full_name": null,
  "created_at": "2026-03-04T10:30:00Z",
  "last_login": "2026-03-04T10:35:00Z"
}
```

---

## 🎯 Expected Debug Output Summary

### Registration:
```
(No special console output)
```

### Login:
```javascript
=== LOGIN SUCCESS ===
Access token: token_1_testuser_1709567890.123456
User data: {id: 1, username: "testuser", ...}
Saved token: token_1_testuser_1709567890.123456
Saved user: {"id":1,"username":"testuser",...}
=====================
```

### Community Page Load:
```
(No special output unless error occurs)
```

### Feedback Submission:
```javascript
=== FEEDBACK SUBMISSION DEBUG ===
Token exists: YES
Token value: token_1_testuser_1709567890.123456
Token starts with "token_": true
Current user: {id: 1, username: "testuser", ...}
Title: Test submission
===============================
Response status: 200
Response data: {id: 1, title: "Test submission", ...}
✅ Feedback submitted successfully!
```

---

## ⚡ Quick Fix Commands

### Reset Everything:
```javascript
// Browser console
localStorage.clear();
sessionStorage.clear();
location.href = 'login.html';
```

### Test Backend Health:
```bash
curl http://localhost:8000/api/health
```

### Manually Create Test User:
```python
# In backend Python terminal
from main import users_db

users_db.append({
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "full_name": None,
    "created_at": datetime.now(),
    "last_login": None
})
print("User created:", users_db[0])
```

---

## 📞 When to Ask for Help

If you've tried everything and still seeing issues, provide:

1. **Complete console output** (copy/paste all logs)
2. **Backend terminal output** (any errors shown)
3. **Network tab screenshot** (showing request/response)
4. **localStorage contents** (from Application tab)
5. **Exact error message** you're seeing
6. **Steps you took** before error occurred

---

## ✅ Success Checklist

After following this guide, you should have:

- [ ] Backend running without errors
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Token saved in localStorage
- [ ] User avatar visible in navbar
- [ ] Can submit feedback
- [ ] Feedback appears in list
- [ ] Console shows clean debug logs
- [ ] NO `[object Object]` errors
- [ ] NO "Invalid token" errors

---

**Debug Status:** ✅ Enhanced Logging Added  
**Files Modified:** `auth/login.html`, `auth/community.html`  
**Version:** 1.3 (Debug Enhancement)  
**Date:** March 4, 2026
