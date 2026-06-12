import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import "./TestCaseManager.css";

export default function TestCaseManager({ problemId, onSuccess }) {
  const [activeTab, setActiveTab] = useState("add"); // add, view, submissions
  const [formData, setFormData] = useState({
    input: "",
    expectedOutput: "",
    description: ""
  });
  const [testCases, setTestCases] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Simple JSON format example
  const jsonTemplate = {
    input: "Enter test input here (or paste multi-line input)",
    expectedOutput: "Expected output for this input",
    description: "What does this test case verify? (optional)"
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Add test case
  const handleAddTestCase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/testcases/admin/add-testcase`,
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
        throw new Error(data.error || "Failed to add test case");
      }

      setMessage("✅ Test case added successfully!");
      setFormData({ input: "", expectedOutput: "", description: "" });

      // Refresh test cases
      fetchTestCases();

      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch test cases
  const fetchTestCases = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testcases/problem/${problemId}`
      );
      const data = await response.json();
      setTestCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testcases/admin/submissions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      const data = await response.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  // Approve submission
  const handleApprove = async (submissionId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testcases/admin/approve/${submissionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.ok) {
        setMessage("✅ Test case approved!");
        fetchSubmissions();
        fetchTestCases();
      } else {
        throw new Error("Failed to approve");
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  // Reject submission
  const handleReject = async (submissionId) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/testcases/admin/reject/${submissionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ reason })
        }
      );

      if (response.ok) {
        setMessage("✅ Test case rejected!");
        fetchSubmissions();
      } else {
        throw new Error("Failed to reject");
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  // Delete test case
  const handleDeleteTestCase = async (testCaseId) => {
    if (!window.confirm("Are you sure you want to delete this test case?"))
      return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/testcases/admin/delete-testcase/${problemId}/${testCaseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.ok) {
        setMessage("✅ Test case deleted!");
        fetchTestCases();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <div className="test-case-manager">
      <div className="manager-tabs">
        <button
          className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("add");
            setMessage("");
          }}
        >
          ➕ Add Test Case
        </button>
        <button
          className={`tab-btn ${activeTab === "view" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("view");
            fetchTestCases();
          }}
        >
          📋 View Test Cases ({testCases.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "submissions" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("submissions");
            fetchSubmissions();
          }}
        >
          📤 User Submissions ({submissions.length})
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {/* ADD TEST CASE TAB */}
      {activeTab === "add" && (
        <div className="tab-content">
          <h3>➕ Add Official Test Case</h3>
          <p className="help-text">
            📝 Add test cases in a simple format. Non-developers can fill this out easily!
          </p>

          <form onSubmit={handleAddTestCase}>
            <div className="form-group">
              <label>
                Test Input <span className="required">*</span>
              </label>
              <textarea
                name="input"
                value={formData.input}
                onChange={handleInputChange}
                placeholder={jsonTemplate.input}
                required
                rows="4"
                className="form-input"
              />
              <small>Enter the input for this test case (supports multi-line)</small>
            </div>

            <div className="form-group">
              <label>
                Expected Output <span className="required">*</span>
              </label>
              <textarea
                name="expectedOutput"
                value={formData.expectedOutput}
                onChange={handleInputChange}
                placeholder={jsonTemplate.expectedOutput}
                required
                rows="3"
                className="form-input"
              />
              <small>What output should the solution produce for this input?</small>
            </div>

            <div className="form-group">
              <label>
                Description <span className="optional">(Optional)</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Edge case: empty input"
                className="form-input"
              />
              <small>Brief description of what this test case validates</small>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? "Adding..." : "✅ Add Test Case"}
            </button>
          </form>
        </div>
      )}

      {/* VIEW TEST CASES TAB */}
      {activeTab === "view" && (
        <div className="tab-content">
          <h3>📋 Official Test Cases ({testCases.length})</h3>

          {testCases.length === 0 ? (
            <div className="empty-state">
              <p>No test cases yet. Add your first one! 👆</p>
            </div>
          ) : (
            <div className="test-cases-list">
              {testCases.map((tc, idx) => (
                <div key={tc._id} className="test-case-card">
                  <div className="test-case-header">
                    <span className="test-number">Test #{idx + 1}</span>
                    {tc.description && (
                      <span className="test-desc">{tc.description}</span>
                    )}
                    <button
                      onClick={() => handleDeleteTestCase(tc._id)}
                      className="btn-delete"
                      title="Delete test case"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="test-case-body">
                    <div className="test-section">
                      <strong>Input:</strong>
                      <pre>{tc.input}</pre>
                    </div>
                    <div className="test-section">
                      <strong>Expected Output:</strong>
                      <pre>{tc.expectedOutput}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* USER SUBMISSIONS TAB */}
      {activeTab === "submissions" && (
        <div className="tab-content">
          <h3>📤 User-Submitted Test Cases ({submissions.length})</h3>

          {submissions.length === 0 ? (
            <div className="empty-state">
              <p>No user submissions yet.</p>
            </div>
          ) : (
            <div className="submissions-list">
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  className={`submission-card ${sub.status}`}
                >
                  <div className="submission-header">
                    <div>
                      <strong>{sub.userName}</strong>
                      <span className="prob-title">
                        {sub.problemId?.title}
                      </span>
                    </div>
                    <span className={`status-badge ${sub.status}`}>
                      {sub.status === "pending_validation" && "⏳ Pending"}
                      {sub.status === "validated" && "✅ Validated"}
                      {sub.status === "rejected" && "❌ Rejected"}
                    </span>
                  </div>

                  <div className="submission-body">
                    <div className="submission-section">
                      <strong>Input:</strong>
                      <pre>{sub.input}</pre>
                    </div>
                    <div className="submission-section">
                      <strong>Expected Output:</strong>
                      <pre>{sub.expectedOutput}</pre>
                    </div>
                    {sub.description && (
                      <div className="submission-section">
                        <strong>Description:</strong>
                        <p>{sub.description}</p>
                      </div>
                    )}

                    {sub.validationResult && (
                      <div className="validation-result">
                        <strong>AI Validation:</strong>
                        <p>{sub.validationResult.message}</p>
                        {sub.validationResult.suggestions && (
                          <p className="suggestions">
                            💡 {sub.validationResult.suggestions}
                          </p>
                        )}
                      </div>
                    )}

                    {sub.rejectionReason && (
                      <div className="rejection-reason">
                        <strong>Rejection Reason:</strong>
                        <p>{sub.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {sub.status === "validated" && (
                    <div className="submission-actions">
                      <button
                        onClick={() => handleApprove(sub._id)}
                        className="btn-approve"
                      >
                        ✅ Approve & Add
                      </button>
                      <button
                        onClick={() => handleReject(sub._id)}
                        className="btn-reject"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
