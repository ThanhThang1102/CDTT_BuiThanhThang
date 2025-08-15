import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const Contact = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = context.userData.userId;
    try {
      const newContactFields = {
        userId,
        emailOrPhone,
        message,
      };
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await postData("/api/contact/create", newContactFields, {
        headers: {
          Authorization: `Bearer ${token}`, // Thay bằng token thật
        },
      });

      if (response.success) {
        context.setAlertBox({
          open: true,
          type: "success",
          message: response.message,
        });
        setEmailOrPhone("");
        setMessage("");
      } else {
        context.setAlertBox({
          open: true,
          type: "error",
          message: response.message,
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi thông tin:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          type: "",
          message: "",
        });
      }, 2000);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="hd">Liên hệ với chúng tôi</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Email hoặc số điện thoại của bạn"
                  variant="outlined"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  fullWidth
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  placeholder="Nội dung liên hệ của bạn"
                  variant="outlined"
                  label="Email hoặc số điện thoại của bạn"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  fullWidth
                />
              </div>
              <div className="form-group">
                <Button type="submit" className="btn-big btn-blue w-100">
                  Gửi lời nhắn
                </Button>
              </div>
            </div>
            <div className="col-md-6">
              <iframe
                title="Liên hệ với chúng tôi"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57475.673705389454!2d106.76571544999999!3d10.826922999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752701a34a5d5f%3A0x30056b2fdf668565!2sHo%20Chi%20Minh%20City%20College%20of%20Industry%20and%20Trade!5e1!3m2!1sen!2s!4v1733249166659!5m2!1sen!2s"
                width="600"
                height="450"
                style={{ border: "0" }}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
