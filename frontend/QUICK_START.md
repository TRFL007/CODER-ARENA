# Quick Start Guide - Test Case System

**Complete setup in 5 minutes!**

## Step 1: Get Groq API Key (2 min)

1. Go to https://console.groq.com
2. Sign up or log in
3. Click "Create API Key"
4. Copy the key

## Step 2: Add to .env (1 min)

Edit `project/server/.env`:

```env
GROQ_API_KEY=paste_your_key_here
```

## Step 3: Verify Routes (Auto-done)

Routes already added to `server.js`:
```javascript
app.use("/api/testcases", testCaseRoutes);
```

## Step 4: Add Components to Your Pages

### For Admin - Add to Admin Panel or Problem Editor

```jsx
import TestCaseManager from "../components/TestCaseManager";

// In your admin problem page:
<TestCaseManager problemId={problemId} />
```

### For Users - Add to Problem Solver

```jsx
import UserTestCaseSubmit from "../components/UserTestCaseSubmit";

// In your problem solver page:
<UserTestCaseSubmit 
  problemId={problemId}
  problemTitle={problem.title}
/>
```

## Step 5: Test It

1. Start server: `npm run dev` (in server folder)
2. Start frontend: `npm run dev` (in project folder)
3. Navigate to problem
4. Try adding a test case (admin)
5. Try submitting a test case (user)

---

## Instant Testing

### Test Admin Features

```bash
curl -X POST http://localhost:5000/api/testcases/admin/add-testcase \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "PROBLEM_ID",
    "input": "5",
    "expectedOutput": "120",
    "description": "Factorial test"
  }'
```

### Test User Submission

```bash
curl -X POST http://localhost:5000/api/testcases/user/submit-testcase \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "PROBLEM_ID",
    "input": "test input",
    "expectedOutput": "expected output",
    "description": "My test case"
  }'
```

---

## Files Created/Modified

### New Files
✅ `/server/models/TestCaseSubmission.js` - Submission tracking
✅ `/server/routes/testCaseRoutes.js` - All endpoints
✅ `/server/utils/groqValidator.js` - AI validation
✅ `/src/components/TestCaseManager.jsx` - Admin UI
✅ `/src/components/TestCaseManager.css` - Admin styles
✅ `/src/components/UserTestCaseSubmit.jsx` - User UI
✅ `/src/components/UserTestCaseSubmit.css` - User styles

### Modified Files
✅ `/server/models/Problem.js` - Enhanced test case schema
✅ `/server/server.js` - Added route mounting

---

## JSON Format Examples

### Simple Addition Test
```json
{
  "input": "3 4",
  "expectedOutput": "7",
  "description": "Add two numbers"
}
```

### Multi-line Input
```json
{
  "input": "2\n5\n10",
  "expectedOutput": "15",
  "description": "Sum three numbers"
}
```

### String Problem
```json
{
  "input": "hello",
  "expectedOutput": "olleh",
  "description": "Reverse string"
}
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Groq API not configured" | Add `GROQ_API_KEY` to `.env` and restart server |
| Test cases not showing | Ensure `isOfficial: true` in test case object |
| Validation always passes | Check Groq API key is valid |
| 401 Unauthorized | Verify user token in localStorage |
| Routes not working | Restart server after code changes |

---

## Next Steps

1. ✅ Admins start adding test cases
2. ✅ Users see contribution option
3. ✅ Test cases get validated automatically
4. ✅ Admins review and approve
5. ✅ Official test cases used for scoring

---

## Admin Workflow

1. Click "Add Test Case" tab
2. Enter input (what user enters)
3. Enter expected output (what should be output)
4. Optional: Add description
5. Click "Add Test Case"
6. Repeat for more test cases

---

## User Workflow

1. Scroll to "Contribute Test Case"
2. Enter your test input
3. Enter what output should be
4. Optional: Explain what it tests
5. Click "Submit Test Case"
6. Get AI validation instantly
7. Wait for admin approval
8. See it go live!

---

## Admin Review Dashboard

Go to "User Submissions" tab:
- See all pending validations
- Check AI analysis
- Approve ✅ or Reject ❌
- Leave feedback for users

---

## Full Documentation

See `TEST_CASE_SYSTEM.md` for complete documentation.

---

Done! Your test case system is live! 🚀
