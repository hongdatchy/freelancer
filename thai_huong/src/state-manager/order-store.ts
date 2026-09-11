import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrderDTO } from "@/dto/OrderDTO";
import { orderService } from "@/service/order-service";

interface State {
  orders: OrderDTO[];
  selectedOrder: OrderDTO | null;
  isLoading: boolean;
  searchKeyword: string;
  statusFilter: string; // 'ALL' | OrderStatus
}

interface Actions {
  fetchOrders: () => Promise<void>;
  selectOrder: (order: OrderDTO | null) => void;
  selectOrderById: (id: string) => Promise<void>;
  setSearchKeyword: (keyword: string) => void;
  setStatusFilter: (filter: string) => void;
  updateOrderInStore: (updatedOrder: OrderDTO) => void;
  removeOrderFromStore: (orderId: string) => void;
}

export const useOrderStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      orders: [],
      selectedOrder: null,
      isLoading: false,
      searchKeyword: "",
      statusFilter: "ALL",

      fetchOrders: async () => {
        set({ isLoading: true });
        try {
          const list = await orderService.getOrders();
          set({ orders: list, isLoading: false });
        } catch (err) {
          console.error("Failed to fetch orders in store:", err);
          set({ isLoading: false });
        }
      },

      selectOrder: (order) => set({ selectedOrder: order }),

      selectOrderById: async (id: string) => {
        set({ isLoading: true });
        try {
          const order = await orderService.getOrderById(id);
          set({ selectedOrder: order, isLoading: false });
        } catch (err) {
          console.error("Failed to select order by id:", err);
          set({ isLoading: false });
        }
      },

      setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

      setStatusFilter: (statusFilter) => set({ statusFilter }),

      updateOrderInStore: (updatedOrder) => {
        const { orders, selectedOrder } = get();
        const nextOrders = orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
        const nextSelected =
          selectedOrder?.id === updatedOrder.id ? updatedOrder : selectedOrder;
        set({ orders: nextOrders, selectedOrder: nextSelected });
      },

      removeOrderFromStore: (orderId) => {
        const { orders, selectedOrder } = get();
        set({
          orders: orders.filter((o) => o.id !== orderId),
          selectedOrder: selectedOrder?.id === orderId ? null : selectedOrder,
        });
      },
    }),
    {
      name: "thai-huong-order-store",
      partialize: (state) => ({
        searchKeyword: state.searchKeyword,
        statusFilter: state.statusFilter,
      }),
    }
  )
);

export default useOrderStore;
