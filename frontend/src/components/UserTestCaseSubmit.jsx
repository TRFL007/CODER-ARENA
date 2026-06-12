import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import "./UserTestCaseSubmit.css";

export default function UserTestCaseSubmit({ problemId, problemTitle, onSuccess }) {
  const [formData, setFormData] = useState({
    input: "",
    expectedOutput: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/testcases/user/submit-testcase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            problemId,
            input: formData.input,
            expectedOutput: formData.expectedOutput,
            description: formData.description
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setValidationResult({
          success: false,
          message: data.error || "Failed to submit test case"
        });
      } else {
        setValidationResult({
          success: data.success,
          message: data.message,
          details: data.validationDetails
        });

        if (data.success) {
          setSubmitted(true);
          setFormData({
            input: "",
            expectedOutput: "",
            description: ""
          });

          setTimeout(() => setSubmitted(false), 3000);
        }

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setValidationResult({
        success: false,
        message: "Error: " + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubmissions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testcases/user/my-submissions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      const data = await response.json();
      setMySubmissions(Array.isArray(data) ? data : []);
      setShowSubmissions(true);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  return (
    <div className="user-test-case-submit">
      <div className="submit-section">
        <div className="section-header">
          <h3>🤝 Contribute a Test Case</h3>
          <p>Help improve this problem by adding a test case!</p>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-group">
            <label htmlFor="input">
              📥 Test Input <span className="required">*</span>
            </label>
            <textarea
              id="input"
              name="input"
              value={formData.input}
              onChange={handleInputChange}
              placeholder="Enter the test input here (can be multi-line)"
              required
              rows="4"
              className="form-input"
            />
            <small>Paste your test input exactly as it should be provided to the solution</small>
          </div>

          <div className="form-group">
            <label htmlFor="expectedOutput">
              📤 Expected Output <span className="required">*</span>
            </label>
            <textarea
              id="expectedOutput"
              name="expectedOutput"
              value={formData.expectedOutput}
              onChange={handleInputChange}
              placeholder="Enter the expected output for your input"
              required
              rows="3"
              className="form-input"
            />
            <small>What output should the solution produce?</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              💬 Description <span className="optional">(Optional)</span>
            </label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Edge case: empty string, or Complex: maximum input size"
              className="form-input"
            />
            <small>
              Help admins understand what this test case validates
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? "⏳ Validating..." : "✅ Submit Test Case"}
          </button>
        </form>

        {validationResult && (
          <div
            className={`validation-feedback ${
              validationResult.success ? "success" : "error"
            }`}
          >
            <div className="feedback-header">
              {validationResult.success ? "✅" : "❌"} {validationResult.message}
            </div>

            {validationResult.details && (
              <div className="feedback-details">
                <p className="feedback-message">
                  {validationResult.details.message}
                </p>

                {validationResult.details.issues &&
                  validationResult.details.issues.length > 0 && (
                    <div className="issues-list">
                      <strong>Issues:</strong>
                      <ul>
                        {validationResult.details.issues.map((issue, idx) => (
                          <li key={idx}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {validationResult.details.suggestions && (
                  <div className="suggestions">
                    <strong>💡 Suggestion:</strong>
                    <p>{validationResult.details.suggestions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="divider"></div>

      <div className="submissions-section">
        <button
          type="button"
          onClick={fetchMySubmissions}
          className="btn-view-submissions"
        >
          {showSubmissions ? "🔽 Hide" : "📋 View"} My Submissions
        </button>

        {showSubmissions && (
          <div className="my-submissions">
            {mySubmissions.length === 0 ? (
              <p className="no-submissions">
                You haven't submitted any test cases yet. Be the first to
                contribute! 🚀
              </p>
            ) : (
              <div className="submissions-grid">
                {mySubmissions.map((sub) => (
                  <div key={sub._id} className={`submission-item ${sub.status}`}>
                    <div className="submission-status">
                      <span className="status-icon">
                        {sub.status === "pending_validation" && "⏳"}
                        {sub.status === "validated" && "✅"}
                        {sub.status === "rejected" && "❌"}
                      </span>
                      <span className="status-text">
                        {sub.status === "pending_validation" &&
                          "Pending Validation"}
                        {sub.status === "validated" && "Validated"}
                        {sub.status === "rejected" && "Rejected"}
                      </span>
                    </div>

                    <div className="submission-content">
                      <strong className="problem-name">
                        {sub.problemId?.title}
                      </strong>
                      {sub.description && (
                        <p className="description">{sub.description}</p>
                      )}

                      {sub.status === "rejected" && sub.rejectionReason && (
                        <div className="rejection-note">
                          <strong>Rejection Reason:</strong>
                          <p>{sub.rejectionReason}</p>
                        </div>
                      )}

                      {sub.validationResult && (
                        <div className="validation-note">
                          <small>{sub.validationResult.message}</small>
                        </div>
                      )}
                    </div>

                    <div className="submission-date">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="tips-section">
        <h4>💡 Tips for Good Test Cases</h4>
        <ul>
          <li>✓ Test edge cases (empty input, maximum values, etc.)</li>
          <li>✓ Verify your expected output is correct</li>
          <li>✓ Make test cases non-trivial and meaningful</li>
          <li>✓ Add a clear description of what you're testing</li>
          <li>✓ Keep input/output reasonably sized (not too large)</li>
        </ul>
      </div>
    </div>
  );
}
