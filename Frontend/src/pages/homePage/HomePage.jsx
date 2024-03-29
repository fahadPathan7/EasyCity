import NavBar from "../../components/navBar/NavBar";
import LightIconButton from "../../components/light_button/LightIconButton";
import LightIconButtonStyled from "../../components/light_button/LightIconButtonStyled";
import backendURL from "../../lib/backendURL";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  PlusSquareOutlined,
  FileDoneOutlined,
  ProfileOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ReadOutlined,
  EditOutlined,
  FileTextOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import "./HomePage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/backButton/BackButton";



export default function HomePage() {
  let { firmId } = useParams();
  const [spinning, setSpinning] = useState(true);

  return (
    <>
      <NavBar />
      <BackButton />
      <div className="fp-main-wrapper">
        <div className="fp-left-section-wrapper">
          <div className="fp-left-btn-wrapper">
            <LightIconButtonStyled
              buttonText="STS List"
              onClick={() => {}}
              IconComponent={EditOutlined}
              routePath={"/STSList"}
              type="submit"
            />
            <LightIconButtonStyled
              buttonText="Landfill List"
              onClick={() => {}}
              IconComponent={SolutionOutlined}
              routePath={"/landfillList"}
              type="submit"
            />
            <LightIconButtonStyled
              buttonText="Vehicle List"
              onClick={() => {}}
              IconComponent={EditOutlined}
              routePath={"/vehicleList"}
              type="submit"
            />
          </div>
        </div>
        <div className="fp-btn-wrapper">
          <LightIconButton
            buttonText="ট্রাক নিয়োজিত করুন"
            onClick={() => {}}
            IconComponent={PlusSquareOutlined}
            routePath={"/addNewProgram"}
            type="submit"
          />
          <LightIconButton
            buttonText="প্রাপ্তির তথ্য যুক্ত করুন (STS)"
            onClick={() => {}}
            IconComponent={FileDoneOutlined}
            routePath={"/invoiceInfoListOfSTSManager"}
            type="submit"
          />
          <LightIconButton
            buttonText="প্রাপ্তির তথ্য যুক্ত করুন (Landfill)"
            onClick={() => {}}
            IconComponent={FileDoneOutlined}
            routePath={"/invoiceInfoListOfLandfillManager"}
            type="submit"
          />
         <LightIconButton
            buttonText="আমার বর্তমান দায়িত্ব (Landfill)"
            onClick={() => {}}
            IconComponent={FileDoneOutlined}
            routePath={"/currentDutyLandfill"}
            type="submit"
          />
          <LightIconButton
            buttonText="আমার বর্তমান দায়িত্ব (STS)"
            onClick={() => { }}
            routePath={"/currentDutySTS"}
            IconComponent={DollarOutlined}
            type="submit"
          />
          
          <LightIconButton
            buttonText="আমার বিলসমূহ"
            onClick={() => {}}
            IconComponent={DollarOutlined}
            routePath={"/billList"}
            type="submit"
          />
          <LightIconButton
            buttonText="মুভমেন্ট রেজিস্টার"
            onClick={() => {}}
            IconComponent={ReadOutlined}
            routePath={"/firm/" + firmId + "/movement-register"}
            type="submit"
          />
        </div>
      </div>
    </>
  );
}
