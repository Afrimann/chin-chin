import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Address {
    id: string;
    label: string; // e.g., "Home", "Office"
    name: string; // Recipient name
    street: string;
    city: string;
    state: string;
    phone: string;
}

interface AddressStore {
    addresses: Address[];
    selectedAddressId: string | null;
    addAddress: (address: Address) => void;
    removeAddress: (id: string) => void;
    selectAddress: (id: string) => void;
    updateAddress: (id: string, updates: Partial<Address>) => void;
}

export const useAddressStore = create<AddressStore>()(
    persist(
        (set) => ({
            addresses: [],
            selectedAddressId: null,
            addAddress: (address) =>
                set((state) => {
                    // If this is the first address, automatically select it
                    const isFirst = state.addresses.length === 0;
                    return {
                        addresses: [...state.addresses, address],
                        selectedAddressId: isFirst ? address.id : state.selectedAddressId,
                    };
                }),
            removeAddress: (id) =>
                set((state) => ({
                    addresses: state.addresses.filter((a) => a.id !== id),
                    // If the selected address is removed, deselect it
                    selectedAddressId: state.selectedAddressId === id ? null : state.selectedAddressId,
                })),
            selectAddress: (id) => set({ selectedAddressId: id }),
            updateAddress: (id, updates) =>
                set((state) => ({
                    addresses: state.addresses.map((addr) =>
                        addr.id === id ? { ...addr, ...updates } : addr
                    ),
                })),
        }),
        {
            name: "chin-chin-address-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
