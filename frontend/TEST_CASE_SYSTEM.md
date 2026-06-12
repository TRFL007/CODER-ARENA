# Test Case Management System

A complete test case management solution for your coding platform that allows admins to add test cases easily and users to contribute test cases with AI validation.

## Features

✅ **Admin Test Case Management**
- Add official test cases in JSON format
- Edit and delete test cases
- View all pending user submissions
- Approve or reject user-submitted test cases

✅ **User Test Case Contributions**
- Simple, user-friendly interface for submitting test cases
- AI-powered validation using Groq API
- Track submission status (pending, validated, rejected)
- View personal submission history

✅ **AI Validation**
- Groq API integration for automatic test case validation
- Checks for:
  - Input format validity
  - Logical correctness of expected output
  - Test case meaningfulness (non-trivial)
  - Edge case coverage suggestions

✅ **Non-Developer Friendly**
- Simple form-based interface
- No coding knowledge required
- Clear feedback messages
- Helpful tips and suggestions

---

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file in the server directory:

```env
# Groq API Key (get from https://console.groq.com)
GROQ_API_KEY=your_groq_api_key_here
```

**How to get Groq API Key:**
1. Go to [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Create an API key
4. Copy and paste into `.env`

### 2. Install Dependencies

If not already installed, make sure axios is in your package.json:

```bash
npm install axios
```

### 3. Update Components in Your Pages

#### For Admin (Problem Solver or Admin Page)

```jsx
import TestCaseManager from "../components/TestCaseManager";

export default function AdminProblemPage() {
  const { problemId } = useParams();

  return (
    <div>
      {/* Your existing problem content */}
      <TestCaseManager problemId={problemId} />
    </div>
  );
}
```

#### For Users (Problem Solver Page)

```jsx
import UserTestCaseSubmit from "../components/UserTestCaseSubmit";

export default function ProblemSolverPage() {
  const { problemId } = useParams();
  const problem = /* fetch problem data */;

  return (
    <div>
      {/* Your existing code editor */}
      <UserTestCaseSubmit 
        problemId={problemId} 
        problemTitle={problem.title}
      />
    </div>
  );
}
```

---

## API Endpoints

### Admin Routes

#### Add Test Case
```
POST /api/testcases/admin/add-testcase
Headers: Authorization: Bearer <token>

Body:
{
  "problemId": "problem_id",
  "input": "test input",
  "expectedOutput": "expected output",
  "description": "optional description"
}
```

#### Edit Test Case
```
PUT /api/testcases/admin/edit-testcase/:problemId/:testCaseId
Headers: Authorization: Bearer <token>

Body:
{
  "input": "new input",
  "expectedOutput": "new output",
  "description": "new description"
}
```

#### Delete Test Case
```
DELETE /api/testcases/admin/delete-testcase/:problemId/:testCaseId
Headers: Authorization: Bearer <token>
```

#### Get User Submissions
```
GET /api/testcases/admin/submissions
Headers: Authorization: Bearer <token>
```

#### Approve Submission
```
POST /api/testcases/admin/approve/:submissionId
Headers: Authorization: Bearer <token>
```

#### Reject Submission
```
POST /api/testcases/admin/reject/:submissionId
Headers: Authorization: Bearer <token>

Body:
{
  "reason": "Reason for rejection"
}
```

### User Routes

#### Submit Test Case
```
POST /api/testcases/user/submit-testcase
Headers: Authorization: Bearer <token>

Body:
{
  "problemId": "problem_id",
  "input": "test input",
  "expectedOutput": "expected output",
  "description": "optional description"
}
```

#### Get My Submissions
```
GET /api/testcases/user/my-submissions
Headers: Authorization: Bearer <token>
```

### Public Routes

#### Get Problem Test Cases
```
GET /api/testcases/problem/:problemId
```

---

## JSON Format for Test Cases

### Simple Format (Non-Developer Friendly)

```json
{
  "input": "5\n1 2 3 4 5",
  "expectedOutput": "15",
  "description": "Sum of first 5 numbers"
}
```

### Multi-line Input Example

```json
{
  "input": "3\n1 2\n3 4\n5 6",
  "expectedOutput": "5\n7\n11",
  "description": "Sum of pairs on each line"
}
```

### Edge Case Example

```json
{
  "input": "",
  "expectedOutput": "0",
  "description": "Empty input edge case"
}
```

---

## How It Works

### Test Case Submission Flow

1. **User Submits** → User fills out simple form with input/output
2. **AI Validation** → Groq API analyzes the test case
3. **Status Update** → Test case marked as validated/rejected
4. **Admin Review** → Admin sees validated test cases in dashboard
5. **Approval** → Admin approves and test case becomes official
6. **Live** → Test case added to problem and used for evaluation

### Validation Checks (Groq AI)

The AI performs these checks:

```
✓ Input Format Validation
  - Does input match problem requirements?
  - Is format consistent with other test cases?

✓ Output Correctness
  - Is expected output logically correct?
  - Does it follow problem constraints?

✓ Meaningfulness
  - Is this a trivial test case?
  - Does it add value vs existing cases?

✓ Edge Cases
  - Suggestions for improvement
  - Coverage analysis
```

---

## Database Schema

### Problem Model (Updated)

```javascript
{
  title: String,
  difficulty: String,
  statement: String,
  sampleInput: String,
  sampleOutput: String,
  testCases: [
    {
      _id: ObjectId,
      input: String,
      expectedOutput: String,
      description: String,
      isOfficial: Boolean
    }
  ],
  points: Number
}
```

### TestCaseSubmission Model

```javascript
{
  problemId: ObjectId (ref: Problem),
  userId: ObjectId (ref: User),
  userName: String,
  input: String,
  expectedOutput: String,
  description: String,
  status: "pending_validation" | "validated" | "rejected",
  validationResult: {
    isValid: Boolean,
    message: String,
    groqAnalysis: String,
    validatedAt: Date
  },
  rejectionReason: String,
  approvedAt: Date,
  approvedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Usage Examples

### For Admins

1. Open problem page
2. Go to "Add Test Case" tab
3. Fill in:
   - Test Input (e.g., "5")
   - Expected Output (e.g., "120")
   - Description (e.g., "Factorial of 5")
4. Click "Add Test Case"

### For Users

1. Open problem page
2. Scroll to "Contribute a Test Case" section
3. Fill in:
   - Test Input
   - Expected Output
   - Description (optional)
4. Click "Submit Test Case"
5. See validation result immediately
6. If valid, admin reviews and approves
7. Once approved, becomes official test case

---

## Error Handling

### Validation Errors

- **Missing Fields**: Clear error message listing required fields
- **Invalid Format**: Helpful guidance on correct format
- **Size Limits**: Max 10,000 characters per input/output
- **Logic Errors**: Groq AI provides specific feedback

### API Errors

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Problem or submission not found
- **500 Server Error**: Check Groq API key and connection

---

## Tips for Users

✅ **Good Test Cases**
- Test edge cases (empty input, boundary values)
- Test multiple scenarios (small, medium, large inputs)
- Verify expected output is correct
- Add clear descriptions
- Non-trivial cases that would catch bugs

❌ **Avoid**
- Trivial cases that are obvious
- Very large inputs (over 10KB)
- Duplicate cases
- Incorrect expected outputs

---

## Troubleshooting

### Groq API Returns Error

1. Verify `GROQ_API_KEY` is set in `.env`
2. Check API key is valid at https://console.groq.com
3. Check internet connection
4. Verify you haven't exceeded API rate limits

### Test Cases Not Appearing

1. Verify problem ID is correct
2. Check database connection
3. Ensure test cases have `isOfficial: true`
4. Check browser console for errors

### User Submissions Not Showing

1. Verify user is authenticated
2. Check submission status is "validated"
3. Verify problem ID matches
4. Check MongoDB connection

---

## Integration with Code Execution

When a user runs code against a problem:

1. System fetches official test cases
2. Code executes against each test case
3. Output compared with `expectedOutput`
4. Pass/Fail verdict shown to user

```javascript
// In codeRoutes.js /submit endpoint
const testCases = problem.testCases.filter(tc => tc.isOfficial);
for (const testCase of testCases) {
  const output = await runCode(code, testCase.input);
  const passed = output.trim() === testCase.expectedOutput.trim();
  // Log result
}
```

---

## Future Enhancements

🚀 Potential features:
- Test case difficulty rating
- Community voting on test cases
- Automated test case generation
- Performance/time-complexity test cases
- Language-specific test cases
- Batch test case upload

---

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Verify all environment variables are set
4. Check MongoDB and Groq API connectivity

---

## License

Part of Coder Arena Platform
