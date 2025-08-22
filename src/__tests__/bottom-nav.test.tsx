import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BottomNav from "@/components/navigation/BottomNav";
import { Home, CreditCard, Percent, Menu } from "lucide-react";

describe("BottomNav", () => {
  const items = [
    { id: "inicio", label: "Inicio", icon: <Home /> },
    { id: "cuentas", label: "Cuentas", icon: <CreditCard /> },
    { id: "beneficios", label: "Beneficios", icon: <Percent /> },
    { id: "mas", label: "Más", icon: <Menu /> },
  ];

  it("renders and marks the active item", () => {
    const onChange = jest.fn();
    render(
      <BottomNav
        items={items}
        activeId="inicio"
        onChange={onChange}
        hasFab
        fabId="tavi"
        fabIcon={<img src="/favicon.svg" alt="" />}
        fabLabel="TAVI®"
      />
    );
    const nav = screen.getByRole("navigation", { name: /navegación principal/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "TAVI®" })).toBeInTheDocument();
  });

  it("calls onChange when clicking items and fab", () => {
    const onChange = jest.fn();
    render(
      <BottomNav
        items={items}
        activeId="inicio"
        onChange={onChange}
        hasFab
        fabId="tavi"
        fabIcon={<img src="/favicon.svg" alt="" />}
        fabLabel="TAVI®"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Cuentas" }));
    fireEvent.click(screen.getByRole("button", { name: "TAVI®" }));
    expect(onChange).toHaveBeenCalledWith("cuentas");
    expect(onChange).toHaveBeenCalledWith("tavi");
  });
});

