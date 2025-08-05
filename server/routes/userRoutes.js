const {
  isValidEmail,
  isValidPassword,
  hashPassword,
  generateToken,
  handleError,
  checkPassword,
  verifyToken,
  checkAdminOrOwner,
  isValidPhone,
} = require("../helper/authHelpers");
const { UserModel } = require("../models/UserModel");
const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinaryConfig");
const upload = require("../middlewares/multer");
const fs = require("fs");
const { ppid } = require("process");
const bcrypt = require("bcrypt");
const { OrderModel } = require("../models/OrderModel");

require("dotenv").config();

router.get("/users", verifyToken, checkAdminOrOwner, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Lấy trang hiện tại từ query hoặc mặc định là 1
    const perPage = 12; // Số lượng người dùng mỗi trang

    // Kiểm tra nếu page không phải là số hợp lệ
    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page number",
      });
    }

    // Lấy tổng số người dùng
    const totalUsers = await UserModel.countDocuments();

    // Tính tổng số trang
    const totalPages = Math.ceil(totalUsers / perPage);

    // Kiểm tra nếu page lớn hơn tổng số trang
    if (page > totalPages) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // Truy vấn người dùng với phân trang
    const userList = await UserModel.find()
      .select("-password") // Loại bỏ trường mật khẩu khỏi kết quả
      .skip((page - 1) * perPage) // Bỏ qua người dùng theo số trang
      .limit(perPage) // Giới hạn số lượng người dùng mỗi trang
      .exec();

    // Kiểm tra nếu không có người dùng
    if (userList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users available",
      });
    }

    // Trả về thông tin người dùng và phân trang
    return res.status(200).json({
      success: true,
      users: userList,
      totalPages,
      currentPage: page,
      totalItems: totalUsers,
      perPage,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
});

// Lấy thông tin user theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ (Mongoose ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ.",
      });
    }

    // Tìm người dùng theo ID
    const user = await UserModel.findById(id).select("-password");

    // Kiểm tra nếu không tìm thấy user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    // Trả về thông tin người dùng
    res.status(200).json({
      success: true,
      message: "Lấy thông tin người dùng thành công.",
      user: user,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/:id", verifyToken, checkAdminOrOwner, async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại.",
      });
    }

    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0]; // Lấy public_id từ URL
      await cloudinary.uploader.destroy(publicId); // Xóa ảnh trên Cloudinary
    }

    // Xóa người dùng
    await UserModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Người dùng đã được xóa thành công.",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, phone, password, fullName } = req.body;

    // Kiểm tra các trường bắt buộc
    const checkRequiredFields = (fields) => {
      for (const [key, value] of Object.entries(fields)) {
        if (!value) {
          return `${key} là bắt buộc.`;
        }
      }
      return null;
    };
    const missingField = checkRequiredFields({
      username,
      phone,
      password,
      fullName,
    });
    if (missingField) {
      return res.status(400).json({
        success: false,
        message: missingField,
        type: "error",
      });
    }

    // Kiểm tra số điện thoại hợp lệ
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại không hợp lệ.",
        type: "error",
      });
    }

    // Kiểm tra mật khẩu
    const passwordErrors = isValidPassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không hợp lệ.",
        errors: passwordErrors, // Trả về danh sách lỗi
        type: "error",
      });
    }

    // Kiểm tra nếu người dùng đã tồn tại
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Tên người dùng đã tồn tại.",
        type: "error",
      });
    }

    // Kiểm tra nếu người dùng đã tồn tại
    const existingPhone = await UserModel.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại đã tồn tại.",
        type: "error",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await hashPassword(password);

    // Tạo người dùng mới
    const newUser = new UserModel({
      username,
      phone,
      password: hashedPassword,
      fullName,
      email: "example@example.com",
    });

    await newUser.save();
    // Xóa trường password trước khi trả về
    const sanitizedUser = newUser.toObject();
    delete sanitizedUser.password;

    // Tạo token cho người dùng
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Đăng ký thành công",
      user: sanitizedUser,
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { usernameOrPhone, password } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!usernameOrPhone) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc số điện thoại là bắt buộc.",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu là bắt buộc.",
      });
    }

    // Kiểm tra nếu `usernameOrPhone` là số điện thoại
    const isPhone = /^[0-9]{10,15}$/.test(usernameOrPhone);

    // Tìm người dùng bằng username hoặc phone
    const user = await UserModel.findOne(
      isPhone ? { phone: usernameOrPhone } : { username: usernameOrPhone }
    );

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, số điện thoại hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, số điện thoại hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị vô hiệu hóa.",
      });
    }

    // Xóa mật khẩu trước khi trả về
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    // Tạo token JWT
    const token = generateToken(user);

    // Trả về thông tin người dùng và token
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      user: sanitizedUser,
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/authencation/signin", async (req, res) => {
  try {
    const { usernameOrPhone, password, rememberMe } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!usernameOrPhone) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc số điện thoại là bắt buộc.",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu là bắt buộc.",
      });
    }

    // Kiểm tra nếu `usernameOrPhone` là số điện thoại
    const isPhone = /^[0-9]{10,15}$/.test(usernameOrPhone);

    // Tìm người dùng bằng username hoặc phone
    const user = await UserModel.findOne(
      isPhone ? { phone: usernameOrPhone } : { username: usernameOrPhone }
    );

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, số điện thoại hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, số điện thoại hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị vô hiệu hóa.",
      });
    }

    // Kiểm tra vai trò Admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập (admin only).",
      });
    }

    // Cập nhật trạng thái "rememberMe" trong cơ sở dữ liệu (nếu cần)
    user.rememberMe = rememberMe;
    // Lưu lại user với rememberMe
    await user.save();
    // Tạo token JWT
    const token = generateToken(user);

    // Xóa mật khẩu trước khi trả về
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    // Trả về thông tin người dùng và token
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      user: sanitizedUser,
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/authWithGoogle", async (req, res) => {
  const { fullName, email, images } = req.body;

  try {
    // Check if the user exists in the database
    const existingUser = await UserModel.findOne({ email: email });

    if (!existingUser) {
      // Handle the case where the user does not exist, and create a new user
      const username = fullName.split(" ").join("").toLowerCase(); // Create a simple username from fullName

      // Generate a random phone number
      const randomPhone = `034${Math.floor(1000000 + Math.random() * 9000000)}`; // Random 7-digit phone number

      const user = new UserModel({
        username, // Ensure a username is always generated
        fullName,
        email,
        phone: randomPhone, // Use the generated random phone
        password: "PasswordGoogle@12", // Set password to null as Google sign-in doesn’t provide one
        avatar: images,
        role: "user",
        isActive: true,
      });

      // Save user to the database
      await user.save();

      // Generate a token for the new user
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công.",
        user,
        token,
      });
    } else {
      // If user exists, generate a token for the existing user
      const token = generateToken(existingUser);
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công.",
        user: existingUser,
        token,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
});

// API cập nhật thông tin người dùng
router.put(
  "/:id",
  upload.single("avatar"),
  verifyToken,
  checkAdminOrOwner,
  async (req, res) => {
    try {
      console.log("Uploaded file:", req.file); // Kiểm tra xem có file không
      const { id } = req.params;
      const { username, email, phone, fullName, role, isActive, password } =
        req.body;

      // Kiểm tra ID hợp lệ
      const { ObjectId } = require("mongoose").Types;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID không hợp lệ.",
        });
      }

      // Tìm user
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng.",
        });
      }

      // Kiểm tra username trùng lặp
      if (username && username !== user.username) {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Username đã tồn tại. Vui lòng chọn tên khác.",
          });
        }
      }

      if (phone && phone !== user.phone) {
        const existingUser = await UserModel.findOne({ phone });
        if (existingUser && existingUser._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: "Số điện thoại đã tồn tại. Vui lòng chọn số khác.",
          });
        }
      }

      // Kiểm tra email
      if (email && !isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Email không hợp lệ.",
        });
      }

      // Kiểm tra số điện thoại
      if (phone && !isValidPhone(phone)) {
        return res.status(400).json({
          success: false,
          message: "Số điện thoại không hợp lệ.",
        });
      }

      // Kiểm tra mật khẩu nếu có
      let hashedPassword;
      if (password) {
        if (!isValidPassword(password)) {
          return res.status(400).json({
            success: false,
            message: "Mật khẩu không hợp lệ.",
          });
        }
        hashedPassword = await hashPassword(password);
      }

      // Xử lý avatar nếu có file upload
      let updatedAvatar = user.avatar;
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: `user_${id}`,
            overwrite: true,
          });
          updatedAvatar = result.secure_url;

          // Xóa file tạm
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          return res.status(500).json({
            success: false,
            message: "Không thể tải lên ảnh avatar.",
            error: uploadError.message,
          });
        }
      }

      // Cập nhật thông tin
      const updatedData = {
        username: username || user.username,
        email: email || user.email,
        phone: phone || user.phone,
        fullName: fullName || user.fullName,
        role: role || user.role,
        isActive: isActive === undefined ? user.isActive : isActive,
        avatar: updatedAvatar,
        ...(hashedPassword && { password: hashedPassword }), // Nếu có mật khẩu, thêm vào dữ liệu cần cập nhật
      };

      const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      }).select("-password");

      // Trả về kết quả
      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin người dùng thành công.",
        user: updatedUser,
      });
    } catch (error) {
      // Xóa file tạm nếu có lỗi
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Error updating user:", error);
      handleError(res, error);
    }
  }
);

// API thay đổi mật khẩu
router.put(
  "/change-password/:id",
  verifyToken,
  checkAdminOrOwner,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      console.log(currentPassword, newPassword);
      // Kiểm tra mật khẩu hiện tại và mật khẩu mới có tồn tại không
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu hiện tại là bắt buộc.",
        });
      }
      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu mới là bắt buộc.",
        });
      }

      // Tìm user trong DB
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng.",
        });
      }

      // Kiểm tra mật khẩu hiện tại có đúng không
      const isCurrentPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu hiện tại không đúng.",
        });
      }

      // Kiểm tra mật khẩu mới hợp lệ
      if (!isValidPassword(newPassword)) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu mới không hợp lệ.",
        });
      }

      // Mã hóa mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu mới cho người dùng
      user.password = hashedNewPassword;
      await user.save();

      // Trả về kết quả
      res.status(200).json({
        success: true,
        message: "Mật khẩu đã được thay đổi thành công.",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi thay đổi mật khẩu.",
      });
    }
  }
);

// API xóa user
router.delete(
  "/delete-user/:id",
  verifyToken,
  checkAdminOrOwner,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Tìm user trong database
      const user = await UserModel.findById(id);

      // Kiểm tra nếu user không tồn tại
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Người dùng không tồn tại.",
        });
      }

      // Kiểm tra đơn hàng liên quan tới user
      const userOrders = await OrderModel.find({ userId: id });

      // Nếu tồn tại đơn hàng, xóa tất cả các đơn hàng trước
      if (userOrders.length > 0) {
        try {
          await OrderModel.deleteMany({ userId: id });
        } catch (orderError) {
          console.error("Error deleting user's orders:", orderError);
          return res.status(500).json({
            success: false,
            message: "Không thể xóa các đơn hàng liên quan đến người dùng.",
          });
        }
      }

      // Xóa avatar trên Cloudinary nếu tồn tại
      if (user.avatar) {
        const publicId = user.avatar.split("/").pop().split(".")[0]; // Lấy public_id từ URL
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudError) {
          console.error("Error deleting avatar from Cloudinary:", cloudError);
          return res.status(500).json({
            success: false,
            message: "Không thể xóa ảnh avatar trên Cloudinary.",
          });
        }
      }

      // Xóa user khỏi database
      await UserModel.findByIdAndDelete(id);

      // Trả về kết quả thành công
      res.status(200).json({
        success: true,
        message: "Người dùng và các đơn hàng liên quan đã được xóa thành công.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa người dùng.",
      });
    }
  }
);

module.exports = router;
