import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ActiveErrorsSummary } from "./ActiveErrorsSummary";
import { FieldStatusBadge } from "./FieldStatusBadge";
import {
  getFieldStatusBadgeClasses,
  getFieldStatusBadgeLabel,
  getFieldStatusBorderClass,
} from "../utils";

function renderStatusBadge(status: "idle" | "valid" | "invalid" | "pending") {
  return renderToStaticMarkup(
    <div className={getFieldStatusBorderClass(status)}>
      <span className={getFieldStatusBadgeClasses(status)}>
        {getFieldStatusBadgeLabel(status)}
      </span>
    </div>
  );
}

describe("FormPreviewPage visual states", () => {
  it("renderiza el badge de pendiente con los estilos ámbar asociados", () => {
    const html = renderStatusBadge("pending");

    expect(html).toContain("Pendiente");
    expect(html).toContain("bg-amber-100");
    expect(html).toContain("text-amber-700");
    expect(html).toContain("border-amber-500");
  });

  it("renderiza el badge de invalid y el borde rojo para el estado de error", () => {
    const html = renderStatusBadge("invalid");

    expect(html).toContain("Inválido");
    expect(html).toContain("bg-red-100");
    expect(html).toContain("text-red-700");
    expect(html).toContain("border-red-500");
  });

  it("renderiza el badge de valid y mantiene el estado visual limpio", () => {
    const html = renderStatusBadge("valid");

    expect(html).toContain("Válido");
    expect(html).toContain("bg-green-100");
    expect(html).toContain("text-green-700");
    expect(html).toContain("border-green-500");
  });

  it("renderiza el componente FieldStatusBadge", () => {
    const html = renderToStaticMarkup(<FieldStatusBadge status="valid" />);

    expect(html).toContain("Válido");
    expect(html).toContain("bg-green-100");
  });

  it("renderiza el resumen de errores activos", () => {
    const html = renderToStaticMarkup(
      <ActiveErrorsSummary
        errors={[
          { fieldId: "name", label: "Nombre", error: "Requerido" },
        ]}
      />
    );

    expect(html).toContain("Errores activos");
    expect(html).toContain("Nombre");
    expect(html).toContain("Requerido");
  });
});
