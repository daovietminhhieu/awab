const fetch = global.fetch || require("node-fetch"); // Node <18 fallback
const BASE_URL = "http://0.0.0.0:3000/alowork/commissions"; // Update this if your endpoint is different

/**
 * 1️⃣ GET /transactions
 */
async function testGetTransactionsList() {
    console.log(`➡️ Testing GET ${BASE_URL}/transactions`);
    try {
        const res = await fetch(`${BASE_URL}/transactions`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch transactions");
        console.log("✅ Transactions fetched:", data.transactions?.length ?? 0);
        return data.transactions;
    } catch (err) {
        console.error("❌ GET /transactions failed:", err.message);
    }
}

/**
 * 2️⃣ POST /orders
 */
async function testCreateOrder() {
    console.log(`➡️ Testing POST ${BASE_URL}/orders`);
    const payload = {
        amount: 100,
        order_code: `ORD${Date.now()}`,
        duration: 300,
        with_qrcode: true
    };

    try {
        const res = await fetch(`${BASE_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create order");
        console.log("data:", data);
        console.log("✅ Order created:", data.data?.data?.order_id || data.data?.order_id);
        return data.data?.data || data.data; // Return the full order object
    } catch (err) {
        console.error("❌ POST /orders failed:", err.message);
    }
}

/**
 * 3️⃣ POST /orders/:id/va
 */
async function testCreateVA(orderId) {
    console.log(`➡️ Testing POST ${BASE_URL}/orders/${orderId}/va`);

    const payload = {
        amount: 100000,
        va_holder_name: "NGO QUOC DAT",
        duration: 300
    };

    try {
        const res = await fetch(`${BASE_URL}/orders/${orderId}/va`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create VA");
        console.log("✅ VA created:", data.data?.va_number || data.data);
        return data.data;
    } catch (err) {
        console.error("❌ POST /orders/:id/va failed:", err.message);
    }
}

/**
 * 4️⃣ DELETE /orders/:id
 */
async function testCancelOrder(orderId) {
    console.log(`➡️ Testing DELETE ${BASE_URL}/orders/${orderId}`);
    try {
        const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to cancel order");
        console.log("✅ Order canceled:", data.data?.status);
    } catch (err) {
        console.error("❌ DELETE /orders/:id failed:", err.message);
    }
}

/**
 * 5️⃣ DELETE /orders/:orderId/va/:vaNr
 */
async function testCancelVA(orderId, vaNumber) {
    console.log(`➡️ Testing DELETE ${BASE_URL}/orders/${orderId}/va/${vaNumber}`);
    try {
        const res = await fetch(`${BASE_URL}/orders/${orderId}/va/${vaNumber}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to cancel VA");
        console.log("✅ VA canceled:", data.data?.status);
    } catch (err) {
        console.error("❌ DELETE /orders/:orderId/va/:vaNr failed:", err.message);
    }
}

async function testOrdersList() {
  try {
    const res = await fetch(`${BASE_URL}/get-orders-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }

    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.message);
    console.log("Data", data)
  } catch(err) {
    console.error("Failed get orders list");
  }

}

// Optional:
// async function testTransferCommission(commissionData) {
//     console.log(`➡️ Testing POST ${BASE_URL}/commissions`);
//     try {
//         const res = await fetch(`${BASE_URL}/commissions`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ commissionData })
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to transfer commission");
//         console.log("✅ Commission transferred:", data.data);
//     } catch (err) {
//         console.error("❌ POST /commissions failed:", err.message);
//     }
// }

/**
 * 🚀 Run All Tests
 */
async function runTests() {
    console.log("🚦 Running Sepay API Integration Tests...\n");

    // await testGetTransactionsList();

    await testOrdersList();

    // const order = await testCreateOrder();
    // console.log("Order:", order);
    // if (!order?.order_id) return;

    // const va = await testCreateVA(order.order_id);

    // // Uncomment the following lines to cancel
    // if (va?.va_number) {
    //     await testCancelVA(order.order_id, va.va_number);
    // }

    // await testCancelOrder(order.order_id);

    // Optional: Transfer commission test
    // await testTransferCommission({ userId: "xyz", amount: 5000 });

    console.log("\n✅ All tests completed.");
}

runTests();
