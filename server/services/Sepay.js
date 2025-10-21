const axios = require('axios');
require('dotenv').config();

const SEPAY_API_URL = process.env.SEPAY_API_URL;  // Địa chỉ API của Sepay
const SEPAY_API_KEY = process.env.SEPAY_API_KEY;  // API key của bạn
const SEPAY_BANK_NAME = process.env.SEPAY_BANK_NAME;
const BANK_ID = process.env.SEPAY_BANK_ID;

// GET https://my.sepay.vn/userapi/transactions/details/{transaction_id}
// Lấy chi tiết một giao dịch
// GET https://my.sepay.vn/userapi/transactions/list
// Lấy danh sách giao dịch
// GET https://my.sepay.vn/userapi/transactions/count
// Đếm số lượng giao dịch


// Hàm gọi API Sepay để lấy danh sách giao dịch
async function getTransactions() {
    try {
        console.log(SEPAY_API_KEY);
        console.log(SEPAY_API_URL);
        const response = await axios.get(`${SEPAY_API_URL}/userapi/transactions/list`, {
            headers: {
                'Authorization': `Bearer ${SEPAY_API_KEY}`, // Thêm header Authorization nếu cần
                'Content-Type': 'application/json',
            }
        });

        // Kiểm tra nếu có lỗi trong phản hồi
        if (response.status !== 200) {
            throw new Error('Failed to fetch transactions');
        }

        console.log("Sepay Transactions:", response.data.transactions);

        // Trả về dữ liệu giao dịch
        return response.data.transactions;
    } catch (error) {
        console.error("Sepay API error:", error.response?.data || error.message);
        return { status: 'failed', error: error.message };
    }
}


async function getBankId() {
    try {
        const endpoint = `${SEPAY_API_URL}/userapi/${SEPAY_BANK_NAME}/${BANK_ID}`;
        const response = await axios.get(`${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${SEPAY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("SEPAY API getBankId response:", response.data);
        return response.data;
    } catch(err) {
        console.error("Sepay API error:", err.response?.data || err.message);
        return { status: 'failed', error: err.message };
    }
}

async function getOrdersList() {
    try {
        const endpoint = `${SEPAY_API_URL}/userapi/${SEPAY_BANK_NAME}/${BANK_ID}/orders`;
        console.log(endpoint);
        const response = await axios.get(`${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${SEPAY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("Sepay API getOrdersList response:", response);
        return response.data;
    } catch(error) {
        console.error("Sepay API error:", error.response?.data || error.message);
        return { status: 'failed', error: error.message };
    }
}

// const orders = {
//     amount: 100000,
//     order_code: "ORD123456789",
//     duration: 300,
//     with_qrcode: true
// };
// const response = await createNewOrders(orders);

async function createNewOrders(orders) {
    try {
        const endpoint = `${SEPAY_API_URL}/userapi/${SEPAY_BANK_NAME}/${BANK_ID}`;
        const response = await axios.post(`${endpoint}`, orders, {
            headers: {
                'Authorization': `Bearer ${SEPAY_API_KEY}`,
                'Content-Type': 'application/json'
            },
        })

        console.log("Sepay API createNewOrders response:", response.data);
        return response.data;
    } catch(error) {
        console.error("Sepay API error:", error.response?.data || error.message);
        return { status: 'failed', error: error.message };
    }
}

async function getOrderById(id) {
    try {
        const endpoint = `${SEPAY_API_URL}/userapi/${SEPAY_BANK_NAME}/${BANK_ID}/orders/${id}`;
        const response = await axios.get(`${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${SEPAY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        
        console.log("SEPAY API getOrderById response:", response.data);
        return response.data;
    } catch(error) {
        console.error("Sepay API error:", error.response?.data || error.message);
        return { status: 'failed', error: error.message };
    }
}

// const vaData = {
//     amount: 100000,
//     va_holder_name: "NGO QUOC DAT",
//     duration: 300
// };
// const response = await createNewVa(orderId, vaData);
async function createNewVa(id, vaData) {
    try {
        const endpoint = `${SEPAY_API_URL}/orders/${id}/va`
        const response = await axios.post(endpoint, vaData, {
            headers: {
                'Authorization': `Bearer ${SEPAY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("SEPAY API createNewVa response", response.data);
        return response.data;
    } catch(error) {
        console.error("Sepay API error:", error.response?.data || error.message);
        return { status: 'failed', error: error.message };
    }
}

async function cancelOrder(id) {
    try {
        const endpoint = `${SEPAY_API_URL}/userapi/${SEPAY_BANK_NAME}/${SEPAY_BANK_ID}/orders/${id}`;
        const response = await axios.delete(`${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${SEPAY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("SEPAY API cancelOrder response", response.data);
        return response.data;
    } catch(error) {
        console.error("Sepay API error:", error.response?.data || error.message);
        return { status: 'failed', error: error.message };
    }
}

async function cancelVa(orderId, vaNr) {
    try {
        const endpoint = `${SEPAY_API_URL}/userapi/${SEPAY_BANK_NAME}/${SEPAY_BANK_ID}/orders/${orderId}/va/${vaNr}`;
        const response = await axios.delete(`${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${SEPAY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("SEPAY API cancelVa response", response.data);
        return response.data;
    } catch(error) {
        console.error("Sepay API error:", error.response?.data || error.message);
        return { status: 'failed', error: error.message };
    }
}

// async function partiallyPayment() {
//     try {
//         const endpoint = `${SEPAY_API_URL}/userapi/`


//     } catch(error) {
//         console.error("Sepay API error:", error.response?.data || error.message);
//         return { status: 'failed', error: error.message };
//     }
// }

const AloWorkSepayTransaction = require('../model/AloWorkSepayTransaction');
async function createNewPayment(userId, amount, des) {
    try {
      const { userId, amount, description } = req.body;
      
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId là bắt buộc' });
      }
  
      if(!description) {
        return res.status(400).json({ success: false, message: 'description là bắt buộc' });
      }
  
      if(!amount) {
        return res.status(400).json({ success: false, message: 'amount là bắt buộc' });
      }
  
      // Thông tin tài khoản SePay của bạn
      const bank = process.env.SEPAY_BANK_NAME;
      const account = process.env.SEPAY_BANK_ID;
      
      // Kiểm tra environment variables
      if (!bank || !account) {
        console.error('❌ Missing environment variables: BANK or BANKNR');
        return res.status(500).json({ 
          success: false, 
          message: 'Server configuration error - missing payment credentials' 
        });
      }
  
      // Lưu đơn hàng vào DB
   
  
      const orderId = extractNAPTIEN(description);
      
      const order = await AloWorkSepayTransaction.create({
        user: userId, // Thêm userId 
        id: orderId, // Sử dụng orderId từ description
        amount_in: amount,
        description: description,
        payment_status: 'Pending',
        verified: false
      });
      
      // Tạo link QR
      const qrImageUrl = `https://qr.sepay.vn/img?acc=${account}&bank=${bank}&amount=${amount}&des=${description}&template=compact`;
      
      console.log('✅ Payment created successfully:', { orderId: order.id, amount, description });
      
      res.json({ success: true, qrImageUrl, orderId, bank, account});
    } catch (error) {
      console.error('❌ Error creating payment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
  

module.exports = { cancelOrder, cancelVa, createNewVa, getOrderById, createNewOrders, getOrdersList, getBankId, getTransactions };
