import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SubscriptionPlan.css";

export default function SubscriptionPlan() {
  const [tiers, setTiers] = useState([]);
  const [isYearly, setIsYearly] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // ✅ 요금제 목록 불러오기
  useEffect(() => {
    axios.get("/api/subscription/tiers")
      .then((res) => {
        console.log("📦 [요금제 응답]", res.data);
        setTiers(res.data);
      })
      .catch((err) => {
        console.error("❌ 요금제 불러오기 실패:", err);
      });
  }, []);

  // ✅ 현재 구독 중인 요금제 불러오기
  useEffect(() => {
    if (!userId) return;

    axios.get("/api/subscription/me", {
      params: { userId }
    }).then((res) => {
      if (res.data?.tierName) {
        setCurrentPlan(res.data.tierName.toUpperCase());
      }
    }).catch(() => {
      setCurrentPlan("FREE");
    });
  }, [userId]);

  // ✅ 연간 할인 가격 계산
  const getPrice = (monthly, isYearly) => {
    if (!isYearly) return monthly;
    return Math.round(monthly * 12 * 0.8); // 20% 할인 적용
  };

  // ✅ 구독 선택 시 결제 페이지로 이동
  const handleSelect = (tierId, tierName) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (tierName === "FREE") {
      alert("FREE 요금제는 별도 구독이 필요하지 않습니다.");
      return;
    }

    const selectedTier = tiers.find((tier) => tier.id === tierId);
    if (!selectedTier) return;

    const finalPrice = getPrice(selectedTier.priceMonthly, isYearly);

    // ✅ Payment 페이지로 결제 정보 전달
    navigate("/payment", {
      state: {
        paymentType: "SUBSCRIPTION",
        finalPrice,
        tierId,
        isYearly,
      },
    });
  };

  return (
    <div className="subscription-wrapper">
      <h1 className="subscription-title">Artist Subscription</h1>

      <div className="toggle-container">
        <span className={!isYearly ? "active" : ""}>월간</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isYearly}
            onChange={() => setIsYearly((prev) => !prev)}
          />
          <span className="slider" />
        </label>
        <span className={isYearly ? "active" : ""}>연간</span>
      </div>

      <div className="plan-container">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`plan-card ${tier.name === "PREMIUM" ? "highlight" : ""}`}
          >
            <h3>{tier.name}</h3>
            <p className="price">
              ₩{getPrice(tier.priceMonthly, isYearly).toLocaleString()} / {isYearly ? "1 Year" : "1 Month"}
            </p>
            <ul>
              {tier.benefits.split(",").map((benefit, i) => (
                <li key={i}>{benefit.trim()}</li>
              ))}
            </ul>
            <button
              className="btn"
              disabled={tier.name === currentPlan}
              onClick={() => handleSelect(tier.id, tier.name)}
            >
              {tier.name === currentPlan ? "현재 이용 중" : "선택하기"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
