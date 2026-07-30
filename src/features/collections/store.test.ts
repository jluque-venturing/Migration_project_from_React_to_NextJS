import { describe, it, expect, beforeEach } from "vitest";
import { useCollectionStore } from "./store";

describe("useCollectionStore", () => {
  beforeEach(() => {
    useCollectionStore.setState({ collections: [] });
  });

  it("debe agregar una nueva colección", () => {
    const name = " Colección de Test ";
    const id = useCollectionStore.getState().addCollection(name, "violet");

    const state = useCollectionStore.getState();
    expect(state.collections).toHaveLength(1);
    expect(state.collections[0].id).toBe(id);
    expect(state.collections[0].name).toBe("Colección de Test");
    expect(state.collections[0].color).toBe("violet");
    expect(state.collections[0].formIds).toEqual([]);
  });

  it("debe eliminar una colección", () => {
    const id = useCollectionStore.getState().addCollection("Carpeta");
    expect(useCollectionStore.getState().collections).toHaveLength(1);

    useCollectionStore.getState().removeCollection(id);
    expect(useCollectionStore.getState().collections).toHaveLength(0);
  });

  it("debe renombrar una colección", () => {
    const id = useCollectionStore.getState().addCollection("Viejo Nombre");
    useCollectionStore.getState().renameCollection(id, " Nuevo Nombre ");

    const state = useCollectionStore.getState();
    expect(state.collections[0].name).toBe("Nuevo Nombre");
  });

  it("debe actualizar el color de una colección", () => {
    const id = useCollectionStore.getState().addCollection("Carpeta", "slate");
    useCollectionStore.getState().updateCollectionColor(id, "pink");

    const state = useCollectionStore.getState();
    expect(state.collections[0].color).toBe("pink");
  });

  it("debe agregar y remover formularios de una colección", () => {
    const id = useCollectionStore.getState().addCollection("Ventas");
    const formId = "form-123";

    useCollectionStore.getState().addFormToCollection(id, formId);
    expect(useCollectionStore.getState().collections[0].formIds).toContain(formId);

    // No debe duplicar si se agrega de nuevo
    useCollectionStore.getState().addFormToCollection(id, formId);
    expect(useCollectionStore.getState().collections[0].formIds).toHaveLength(1);

    useCollectionStore.getState().removeFormFromCollection(id, formId);
    expect(useCollectionStore.getState().collections[0].formIds).not.toContain(formId);
  });

  it("debe alternar la presencia de un formulario en una colección", () => {
    const id = useCollectionStore.getState().addCollection("Ventas");
    const formId = "form-456";

    // Agregar con toggle
    useCollectionStore.getState().toggleFormInCollection(id, formId);
    expect(useCollectionStore.getState().collections[0].formIds).toContain(formId);

    // Quitar con toggle
    useCollectionStore.getState().toggleFormInCollection(id, formId);
    expect(useCollectionStore.getState().collections[0].formIds).not.toContain(formId);
  });

  it("debe eliminar un formulario de todas las colecciones al borrarlo", () => {
    const col1 = useCollectionStore.getState().addCollection("Ventas");
    const col2 = useCollectionStore.getState().addCollection("Soporte");
    const formId = "form-999";

    useCollectionStore.getState().addFormToCollection(col1, formId);
    useCollectionStore.getState().addFormToCollection(col2, formId);

    expect(useCollectionStore.getState().collections[0].formIds).toContain(formId);
    expect(useCollectionStore.getState().collections[1].formIds).toContain(formId);

    useCollectionStore.getState().removeFormFromAllCollections(formId);

    const state = useCollectionStore.getState();
    expect(state.collections[0].formIds).not.toContain(formId);
    expect(state.collections[1].formIds).not.toContain(formId);
  });
});
