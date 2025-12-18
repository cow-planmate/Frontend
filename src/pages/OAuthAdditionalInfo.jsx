// pages/OAuthAdditionalInfo.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApiClient } from "../hooks/useApiClient";
import useNicknameStore from "../store/Nickname";

const OAuthAdditionalInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { oauthComplete } = useApiClient();
  const { setNickname } = useNicknameStore();

  const {
    provider,
    providerId,
    email: initialEmail,
    nickname: initialNickname,
  } = location.state || {};

  const [formData, setFormData] = useState({
    email: initialEmail || "",
    age: "",
    gender: "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // state가 없으면 로그인 페이지로 리다이렉트
  if (!provider || !providerId) {
    navigate("/logintest", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!formData.email || !formData.age || formData.gender === "") {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 0) {
      setError("올바른 나이를 입력해주세요.");
      return;
    }

    const gender = parseInt(formData.gender);
    if (gender !== 0 && gender !== 1) {
      setError("성별을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await oauthComplete({
        provider,
        providerId,
        email: formData.email,
        age,
        gender,
      });

      // 로그인 성공 처리
      localStorage.setItem("userId", response.userId.toString());
      localStorage.setItem("nickname", response.nickname);
      setNickname(response.nickname);

      // 메인 페이지로 이동
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "추가 정보 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <h2>추가 정보 입력</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        서비스 이용을 위해 추가 정보를 입력해주세요.
      </p>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>닉네임:</strong> {initialNickname}
        </p>
        <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
          닉네임은 마이페이지에서 변경할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            이메일 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            disabled={initialEmail !== ""}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="age"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            나이 *
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="나이를 입력하세요"
            min="0"
            max="150"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            성별 *
          </label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="gender"
                value="0"
                checked={formData.gender === "0"}
                onChange={handleChange}
                required
                style={{ marginRight: "8px" }}
              />
              남성
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="gender"
                value="1"
                checked={formData.gender === "1"}
                onChange={handleChange}
                required
                style={{ marginRight: "8px" }}
              />
              여성
            </label>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#fee",
              color: "red",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isSubmitting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {isSubmitting ? "처리 중..." : "완료"}
        </button>
      </form>
    </div>
  );
};

export default OAuthAdditionalInfo;
