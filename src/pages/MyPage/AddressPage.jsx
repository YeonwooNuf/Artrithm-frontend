import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddressPage.css";

export default function AddressPage() {
    const userId = localStorage.getItem("userId");
    const [addresses, setAddresses] = useState([]);
    const [defaultAddressId, setDefaultAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        zonecode: "",
        roadAddress: "",
        jibunAddress: "",
        detailAddress: "",
        reference: "",
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`/api/users/${userId}/addresses`);
            setAddresses(res.data);
            const defaultAddr = res.data.find((addr) => addr.isDefault);
            setDefaultAddressId(defaultAddr?.id || null);
        } catch (err) {
            console.error("❌ 주소 목록 로딩 실패:", err);
        }
    };

    const handleSearchAddress = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                let extra = "";
                if (data.bname && /[동|로|가]$/g.test(data.bname)) extra += data.bname;
                if (data.buildingName && data.apartment === "Y") extra += (extra ? ", " : "") + data.buildingName;
                if (extra) extra = `(${extra})`;
                setNewAddress({
                    ...newAddress,
                    zonecode: data.zonecode,
                    roadAddress: data.roadAddress,
                    jibunAddress: data.jibunAddress || "",
                    reference: extra,
                });
            },
        }).open();
    };

    const handleAddAddress = async () => {
        if (!newAddress.zonecode || !newAddress.roadAddress || !newAddress.detailAddress) {
            alert("주소를 모두 입력해주세요.");
            return;
        }
        try {
            await axios.post(`/api/users/${userId}/addresses`, newAddress);
            fetchAddresses();
            setNewAddress({ zonecode: "", roadAddress: "", jibunAddress: "", detailAddress: "", reference: "" });
        } catch (err) {
            console.error("❌ 주소 추가 실패:", err);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`/api/users/addresses/${id}/set-default`);
            fetchAddresses();
        } catch (err) {
            console.error("❌ 기본 배송지 설정 실패:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/api/users/addresses/${id}`);
            fetchAddresses();
        } catch (err) {
            console.error("❌ 주소 삭제 실패:", err);
        }
    };

    return (
        <div className="address-page">
            <h2>주소 관리</h2>

            <div className="address-form">
                <button onClick={handleSearchAddress}>주소 검색</button>
                <input type="text" placeholder="우편번호" value={newAddress.zonecode} readOnly />
                <input type="text" placeholder="도로명 주소" value={newAddress.roadAddress} readOnly />
                <input type="text" placeholder="지번 주소" value={newAddress.jibunAddress} readOnly />
                <input type="text" placeholder="상세 주소" value={newAddress.detailAddress} onChange={(e) => setNewAddress({ ...newAddress, detailAddress: e.target.value })} />
                <input type="text" placeholder="참고 항목" value={newAddress.reference} readOnly />
                <button onClick={handleAddAddress}>추가</button>
            </div>

            <table className="address-table">
                <thead>
                    <tr>
                        <th>기본</th>
                        <th>우편번호</th>
                        <th>주소</th>
                        <th>상세주소</th>
                        <th>참고</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.map((addr) => (
                        <tr key={addr.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={addr.id === defaultAddressId}
                                    onChange={() => handleSetDefault(addr.id)}
                                />
                            </td>
                            <td>{addr.zonecode}</td>
                            <td>{addr.roadAddress || addr.jibunAddress}</td>
                            <td>{addr.detailAddress}</td>
                            <td>{addr.reference}</td>
                            <td>
                                <button onClick={() => handleDelete(addr.id)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}