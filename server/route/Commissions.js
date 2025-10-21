const express = require('express');
const { 
    getTransactions,
    createNewOrders,
    createNewVa,
    cancelOrder,
    cancelVa,
    getOrdersList
} = require('../services/Sepay');

const router = express.Router();

// 1. Lấy danh sách giao dịch
router.get('/transactions', async (req, res) => {
    try {
        console.log("Fetching transaction list...");
        const transactions = await getTransactions();
        res.json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: error.message });
    }
});

router.get('/get-orders-list', async(req, res) => {
    try {
        console.log("Get Orders List");
        const orders = await getOrdersList();
        res.json({ success: true, orders});
     } catch(error) {
        res.status(500).json({ success: false, message: 'Failed to get orders', error: error.message });
     }
})

// 2. Tạo đơn hàng mới
router.post('/orders', async (req, res) => {
    const { amount, order_code, duration, with_qrcode } = req.body;
    try {
        console.log("Creating new order...");
        const orderData = { amount, order_code, duration, with_qrcode };
        const response = await createNewOrders(orderData);
        res.json({ success: true, message: 'Order created successfully', data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
    }
});

// 3. Tạo Virtual Account (VA) mới cho một đơn hàng
router.post('/orders/:id/va', async (req, res) => {
    const { id } = req.params;
    const { amount, va_holder_name, duration } = req.body;
    try {
        console.log(`Creating VA for order ID: ${id}`);
        const vaData = { amount, va_holder_name, duration };
        const response = await createNewVa(id, vaData);
        res.json({ success: true, message: 'VA created successfully', data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create VA', error: error.message });
    }
});

// 4. Hủy đơn hàng
router.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Canceling order ID: ${id}`);
        const response = await cancelOrder(id);
        res.json({ success: true, message: 'Order canceled successfully', data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message });
    }
});

// 5. Hủy Virtual Account (VA)
router.delete('/orders/:orderId/va/:vaNr', async (req, res) => {
    const { orderId, vaNr } = req.params;
    try {
        console.log(`Canceling VA ${vaNr} for order ${orderId}`);
        const response = await cancelVa(orderId, vaNr);
        res.json({ success: true, message: 'VA canceled successfully', data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel VA', error: error.message });
    }
});

// // 6. Chuyển hoa hồng
// router.post('/commissions', async (req, res) => {
//     const { commissionData } = req.body;
//     try {
//         console.log("Processing commission transfer...");
//         const response = await transferCommission(commissionData);
//         res.json({ success: true, message: 'Commission transferred successfully', data: response });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to transfer commission', error: error.message });
//     }
// });

module.exports = router;
