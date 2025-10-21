const User = require('../model/AloWorkUser');
const Transaction = require('../model/Transaction');
const { transferToSepay } = require('../services/Sepay');  // Import dịch vụ Sepay
require('dotenv').config();

async function transferCommission(userId, receivedAmount) {
    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ _id: userId }); // Cập nhật ở đây
        if (!user) {
            throw new Error('User not found');
        }

        // Tính số tiền cần chuyển đi (bao gồm phí hoa hồng)
        let feeRate = 0.1;  // Phí hoa hồng 10%
        let transferAmount = receivedAmount / (1 - feeRate);  // Tính tổng số tiền cần trừ từ tài khoản người dùng

        // Kiểm tra số dư của người dùng trong hệ thống
        if (user.balance < transferAmount) {
            throw new Error('Insufficient balance');
        }

        // Chuyển khoản qua API Sepay
        const sepayResponse = await transferToSepay(user.sepAddress, receivedAmount);

        // Nếu chuyển khoản không thành công
        if (sepayResponse.status !== 'success') {
            throw new Error('Sepay transfer failed');
        }

        // Cập nhật số dư người dùng trong hệ thống
        user.balance -= transferAmount;
        await user.save();

        // Lưu giao dịch vào cơ sở dữ liệu
        const transaction = new Transaction({
            userId: user._id,
            amount: transferAmount,
            status: 'COMPLETED',
        });
        await transaction.save();

        return { message: 'Commission transfer successful', transaction };

    } catch (error) {
        return { error: error.message };
    }
}


module.exports = { transferCommission };
