"use client";

import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import NavbarPrivate from "./NavbarPrivate";

export default function NavSwitcher() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; 

  return isAuthenticated ? <NavbarPrivate /> : <Navbar />;
}
