"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/seller-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!data?.success) {
        throw new Error(data?.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error(
        "Full error details:",
        error.response?.data || error.message
      );
      toast.error("Error: " + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    user && fetchSellerOrders();
  }, [user]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders?.map((order) => (
              <div
                key={order._id}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
              >
                {/* العناصر */}
                <div className="flex-1 flex gap-5 max-w-80">
                  <Image
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="صندوق"
                    width={64}
                    height={64}
                  />
                  <p className="flex flex-col gap-3">
                    <span className="font-medium">
                      {order.items
                        ?.map((item) =>
                          item?.product?.name
                            ? `${item.product.name} x ${item.quantity}`
                            : "منتج محذوف"
                        )
                        ?.join(", ")}
                    </span>
                    <span>العدد: {order.items?.length}</span>
                  </p>
                </div>

                {/* العنوان */}
                {order.address ? (
                  <div>
                    <p>
                      <span className="font-medium">
                        {order.address.fullName}
                      </span>
                      <br />
                      <span>{order.address.area}</span>
                      <br />
                      <span>{`${order.address.city}, ${order.address.state}`}</span>
                      <br />
                      <span>{order.address.phoneNumber}</span>
                    </p>
                  </div>
                ) : (
                  <div>لا يوجد عنوان</div>
                )}

                {/* المبلغ */}
                <p className="font-medium my-auto">
                  {currency}
                  {order.amount?.toFixed(2)}
                </p>

                {/* التفاصيل */}
                <div>
                  <p className="flex flex-col">
                    <span>الدفع: عند الاستلام</span>
                    <span>
                      التاريخ: {new Date(order.date).toLocaleDateString()}
                    </span>
                    <span>الحالة: {order.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
