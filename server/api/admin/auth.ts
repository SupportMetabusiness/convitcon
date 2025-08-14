import bcrypt from 'bcryptjs';
import db from '~/server/database/db';

export default defineEventHandler(async (event) => {
    const method = getMethod(event);

    if (method === 'POST') {
        try {
            const body = await readBody(event);
            const { action, username, password, currentPassword, newPassword } = body;

            if (action === 'login') {
                // Đăng nhập admin
                if (!username || !password) {
                    return {
                        success: false,
                        error: 'Vui lòng nhập tên đăng nhập và mật khẩu'
                    };
                }

                const stmt = db.prepare('SELECT * FROM admin_account WHERE username = ?');
                const admin = stmt.get(username) as any;

                if (!admin) {
                    return {
                        success: false,
                        error: 'Tên đăng nhập hoặc mật khẩu không đúng'
                    };
                }

                const isValidPassword = await bcrypt.compare(password, admin.password);
                if (!isValidPassword) {
                    return {
                        success: false,
                        error: 'Tên đăng nhập hoặc mật khẩu không đúng'
                    };
                }

                // Tạo session token (đơn giản)
                const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

                // Set cookie
                setCookie(event, 'admin-token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7 // 7 days
                });

                return {
                    success: true,
                    message: 'Đăng nhập thành công',
                    token
                };
            }

            if (action === 'change-password') {
                // Đổi mật khẩu
                if (!currentPassword || !newPassword) {
                    return {
                        success: false,
                        error: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới'
                    };
                }

                // Verify admin token
                const token = getCookie(event, 'admin-token');
                if (!token) {
                    return {
                        success: false,
                        error: 'Bạn cần đăng nhập để thực hiện thao tác này'
                    };
                }

                // Get current admin
                const adminUsername = Buffer.from(token, 'base64').toString().split(':')[0];
                const stmt = db.prepare('SELECT * FROM admin_account WHERE username = ?');
                const admin = stmt.get(adminUsername) as any;

                if (!admin) {
                    return {
                        success: false,
                        error: 'Không tìm thấy tài khoản admin'
                    };
                }

                // Verify current password
                const isValidCurrentPassword = await bcrypt.compare(currentPassword, admin.password);
                if (!isValidCurrentPassword) {
                    return {
                        success: false,
                        error: 'Mật khẩu hiện tại không đúng'
                    };
                }

                // Hash new password
                const saltRounds = 12;
                const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

                // Update password
                const updateStmt = db.prepare('UPDATE admin_account SET password = ? WHERE username = ?');
                updateStmt.run(hashedNewPassword, adminUsername);

                return {
                    success: true,
                    message: 'Đổi mật khẩu thành công'
                };
            }

            if (action === 'create-default') {
                // Tạo tài khoản admin mặc định
                const checkStmt = db.prepare('SELECT COUNT(*) as count FROM admin_account');
                const result = checkStmt.get() as { count: number };

                if (result.count > 0) {
                    return {
                        success: false,
                        error: 'Tài khoản admin đã tồn tại'
                    };
                }

                const defaultUsername = 'admin';
                const defaultPassword = 'admin123';
                const saltRounds = 12;
                const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

                const insertStmt = db.prepare('INSERT INTO admin_account (username, password) VALUES (?, ?)');
                insertStmt.run(defaultUsername, hashedPassword);

                return {
                    success: true,
                    message: 'Tài khoản admin mặc định đã được tạo',
                    credentials: {
                        username: defaultUsername,
                        password: defaultPassword
                    }
                };
            }

            return {
                success: false,
                error: 'Hành động không hợp lệ'
            };
        } catch (error) {
            console.error('Error in admin auth:', error);
            return {
                success: false,
                error: 'Có lỗi xảy ra trong quá trình xử lý'
            };
        }
    }

    if (method === 'GET') {
        // Kiểm tra trạng thái đăng nhập
        try {
            const token = getCookie(event, 'admin-token');
            if (!token) {
                return {
                    success: false,
                    authenticated: false
                };
            }

            const adminUsername = Buffer.from(token, 'base64').toString().split(':')[0];
            const stmt = db.prepare('SELECT username FROM admin_account WHERE username = ?');
            const admin = stmt.get(adminUsername) as any;

            if (!admin) {
                return {
                    success: false,
                    authenticated: false
                };
            }

            return {
                success: true,
                authenticated: true,
                username: admin.username
            };
        } catch (error) {
            return {
                success: false,
                authenticated: false
            };
        }
    }

    if (method === 'DELETE') {
        // Đăng xuất
        deleteCookie(event, 'admin-token');
        return {
            success: true,
            message: 'Đăng xuất thành công'
        };
    }

    return {
        success: false,
        error: 'Phương thức không được hỗ trợ'
    };
});
