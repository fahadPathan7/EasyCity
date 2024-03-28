import DarkButton from "../../components/darkButton/DarkButton";
import { useState } from "react";
import { Input, DatePicker, Space, Select } from "antd";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

import "./AddNewProgram.css";

export default function AddNewProgramForm() {
  const navigate = useNavigate();
  let { firmId } = useParams();

  const [newprogramInfo, setNewprogramInfo] = useState({
    programNo: "",
    programDate: "",
    programQuantity: "",
    commodity: "",
    sendingPoint: "",
    receivingPoint: "",
    firmID: firmId,
  });

  const handleChange = (e) => {
    if (
      e.target.name === "programQuantity" &&
      !(
        typeof Number(e.target.value) === "number" &&
        !Number.isNaN(Number(e.target.value))
      )
    ) return;   
    setNewprogramInfo({ ...newprogramInfo, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, dateString) => {
    setNewprogramInfo({ ...newprogramInfo, programDate: date.toISOString()});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newprogramInfo.programNo) message.error("প্রোগ্রাম নম্বর দিন");
    else if (!newprogramInfo.programDate) message.error("প্রোগ্রাম এর তারিখ দিন");
    else if (!newprogramInfo.programQuantity) message.error("প্রোগ্রামের পরিমান দিন");
    else if (!newprogramInfo.commodity) message.error("পন্য নির্বাচন করুন");
    else if (!newprogramInfo.sendingPoint) message.error("প্রেরক কেন্দ্র দিন");
    else if (!newprogramInfo.receivingPoint) message.error("প্রাপক কেন্দ্র দিন");
    else {
      //message.error(JSON.stringify(newprogramInfo));
      navigate("/firm/" + firmId + "/addInvoiceInfo", {
        state: newprogramInfo,
      });
    }
  };

  return (
    <div>
      <form className="add-new-program-form" onSubmit={handleSubmit}>
        <div className="addprogram-main-form">
          <div className="addprogram-form-left">
            <div className="addprogram-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addprogram-form-label">
                  প্রোগ্রাম নং &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="প্রোগ্রামের নম্বর দিন"
                  className="addprogram-form-input"
                  id="programNo"
                  name="programNo"
                  value={newprogramInfo.programNo}
                  onChange={handleChange}
                />
              </Space>
            </div>

            <div className="addprogram-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addprogram-form-label">
                  প্রোগ্রামের তারিখ &nbsp;
                </label>

                <DatePicker
                  size="large"
                  className="addprogram-datepicker"
                  name="programDate"
                  placeholder="প্রোগ্রামের তারিখ নির্বাচন করুন"
                  onChange={handleDateChange}
                />
              </Space>
            </div>

            <div className="addprogram-form-row">
              <Space direction="horizontal">
                <label htmlFor="password" className="addprogram-form-label">
                  প্রোগ্রামের পরিমান &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="প্রোগ্রামের এর পরিমান দিন"
                  className="addprogram-form-input"
                  id="programQuantity"
                  name="programQuantity"
                  value={newprogramInfo.programQuantity}
                  onChange={handleChange}
                  addonAfter="টন"
                />
              </Space>
            </div>
          </div>

          <div className="addprogram-form-right">
            <div className="addprogram-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addprogram-form-label">
                  পন্য &nbsp;
                </label>

                <Select
                  size="large"
                  placeholder="পন্য নির্বাচন করূন"
                  style={{ textAlign: "left" }}            
                  className="addprogram-form-input"
                  id="commodity"
                  name="commodity"
                  options={[{ value: "চাল", label: "চাল" },{ value: "গম", label: "গম" },{ value: "বস্তা", label: "বস্তা" }, {value: "অনান্য", label: "অনান্য"}]}
                  onChange={(value) => {
                    setNewprogramInfo({ ...newprogramInfo, commodity: value });
                  }}
                />

              </Space>
            </div>

            <div className="addprogram-form-row">
              <Space direction="horizontal">
                <label htmlFor="password" className="addprogram-form-label">
                  প্রেরক কেন্দ্র &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="প্রেরক কেন্দ্রের নাম দিন"
                  className="addprogram-form-input"
                  id="sendingPoint"
                  name="sendingPoint"
                  value={newprogramInfo.sendingPoint}
                  onChange={handleChange}
                />
              </Space>
            </div>
            <div className="addprogram-form-row">
              <Space direction="horizontal">
                <label htmlFor="password" className="addprogram-form-label">
                  প্রাপক কেন্দ্র &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="প্রাপক কেন্দ্রের নাম দিন"
                  className="addprogram-form-input"
                  id="receivingPoint"
                  name="receivingPoint"
                  value={newprogramInfo.receivingPoint}
                  onChange={handleChange}
                />
              </Space>
            </div>
          </div>
        </div>

        <div className="registerbtn">
          <DarkButton
            buttonText="সংরক্ষন করুন"
            onClick={() => {}}
            routePath="forbidden"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}