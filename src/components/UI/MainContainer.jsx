import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./Sidebar";
import { motion } from 'framer-motion';
import { useEffect } from "react";

export default function MainContainer() {
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigateTo("/");  // Redirect to home if chat is not available
    }
  }, [navigateTo]);


  return (
    <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }} className="rounded-lg md:flex">
      <SideBar />
      <Outlet />
    </motion.div>
  );
}
