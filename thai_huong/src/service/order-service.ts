import { OrderDTO, CreateOrderInput } from "@/dto/OrderDTO";
import { MilestoneDTO, MILESTONE_DEFINITIONS } from "@/dto/MilestoneDTO";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { addDays, format, parseISO } from "date-fns";

const ORDERS_COLLECTION = "orders";
const LOCAL_STORAGE_KEY = "thai_huong_mock_orders";

// Helper: Tự động khởi tạo 7 mốc chuẩn theo quy trình
export function generateDefaultMilestones(startDateStr: string): MilestoneDTO[] {
  let currentDate = parseISO(startDateStr);

  return MILESTONE_DEFINITIONS.map((def) => {
    // Mốc 1: Hồ sơ công bố cố định 28 ngày (hoặc 25 ngày)
    const duration = def.defaultDurationDays || 3;
    const startStr = format(currentDate, "yyyy-MM-dd");
    const endDate = addDays(currentDate, duration);
    const endStr = format(endDate, "yyyy-MM-dd");

    // Ngày bắt đầu mốc tiếp theo nối tiếp mốc trước
    currentDate = endDate;

    return {
      id: `milestone-${def.stepNumber}-${Date.now()}`,
      stepNumber: def.stepNumber,
      type: def.type,
      title: def.title,
      durationDays: duration,
      startDate: startStr,
      endDate: endStr,
      status: def.stepNumber === 1 ? "IN_PROGRESS" : "PENDING",
      notifyConfig: {
        sendEmail: true,
        sendNotification: true,
        remindDaysBefore: 2,
      },
    };
  });
}

// Fallback: Mock storage dùng khi chưa có Firebase config thật
function getLocalOrders(): OrderDTO[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    // Tạo 1 đơn mẫu nếu chưa có
    const initialOrders: OrderDTO[] = [
      {
        id: "mock-order-01",
        orderCode: "TH-2026-001",
        productName: "Serum Trị Mụn BHA 2% (Gia công trọn gói)",
        batchNumber: "LOT-260301",
        quantity: 5000,
        unit: "chai 30ml",
        customer: {
          name: "Nguyễn Thị Mai (Giám đốc Mỹ Phẩm Hoa Sen)",
          email: "khachhang.hoasen@gmail.com",
          phone: "0987654321",
          company: "Công ty TNHH Mỹ Phẩm Hoa Sen",
        },
        thaiHuongPIC: {
          name: "Trần Văn Hưng (Trưởng phòng SX Thái Hương)",
          email: "hung.tv@thaihuong.vn",
          phone: "0912345678",
        },
        startDate: format(new Date(), "yyyy-MM-dd"),
        expectedDeliveryDate: format(addDays(new Date(), 46), "yyyy-MM-dd"),
        currentStep: 1,
        status: "IN_PROGRESS",
        milestones: generateDefaultMilestones(format(new Date(), "yyyy-MM-dd")),
        trackingToken: "TOKEN_HOASEN_BHA",
        notes: "Khách yêu cầu bao bì chai thủy tinh nâu, vòi hút vàng.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialOrders));
    return initialOrders;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: OrderDTO[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  }
}

// Kiểm tra Firebase có dùng key thật không
const isFirebaseReady = () => {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key"
  );
};

export const orderService = {
  // Lấy toàn bộ danh sách đơn hàng
  async getOrders(): Promise<OrderDTO[]> {
    if (!isFirebaseReady()) {
      return getLocalOrders();
    }
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as OrderDTO));
    } catch (err) {
      console.warn("Firestore error, falling back to local storage:", err);
      return getLocalOrders();
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  async getOrderById(id: string): Promise<OrderDTO | null> {
    if (!isFirebaseReady()) {
      const orders = getLocalOrders();
      return orders.find((o) => o.id === id) || null;
    }
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as OrderDTO;
      }
      return null;
    } catch (err) {
      console.warn("Firestore get error:", err);
      const orders = getLocalOrders();
      return orders.find((o) => o.id === id) || null;
    }
  },

  // Lấy chi tiết đơn hàng theo mã đơn hoặc tracking token (Dành cho khách hàng tra cứu)
  async getOrderByTrackingCode(codeOrToken: string): Promise<OrderDTO | null> {
    if (!isFirebaseReady()) {
      const orders = getLocalOrders();
      return (
        orders.find(
          (o) =>
            o.orderCode.toLowerCase() === codeOrToken.toLowerCase() ||
            o.trackingToken === codeOrToken
        ) || null
      );
    }
    try {
      // Tìm theo orderCode trước
      let q = query(collection(db, ORDERS_COLLECTION), where("orderCode", "==", codeOrToken));
      let snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const d = snapshot.docs[0];
        return { id: d.id, ...d.data() } as OrderDTO;
      }

      // Tìm theo trackingToken
      q = query(collection(db, ORDERS_COLLECTION), where("trackingToken", "==", codeOrToken));
      snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const d = snapshot.docs[0];
        return { id: d.id, ...d.data() } as OrderDTO;
      }
      return null;
    } catch (err) {
      console.warn("Firestore tracking query error:", err);
      const orders = getLocalOrders();
      return (
        orders.find(
          (o) =>
            o.orderCode.toLowerCase() === codeOrToken.toLowerCase() ||
            o.trackingToken === codeOrToken
        ) || null
      );
    }
  },

  // Tạo đơn hàng mới (Kèm sinh 7 mốc tự động)
  async createOrder(input: CreateOrderInput): Promise<OrderDTO> {
    const id = `order-${Date.now()}`;
    const trackingToken = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Nếu chưa truyền milestones, tự sinh 7 mốc
    const milestones =
      input.milestones && input.milestones.length === 7
        ? input.milestones
        : generateDefaultMilestones(input.startDate);

    // Tính ngày giao hàng dự kiến từ mốc cuối cùng (mốc 7)
    const expectedDeliveryDate =
      milestones[milestones.length - 1]?.endDate || input.expectedDeliveryDate;

    const newOrder: OrderDTO = {
      ...input,
      id,
      milestones,
      expectedDeliveryDate,
      currentStep: input.currentStep || 1,
      status: input.status || "IN_PROGRESS",
      trackingToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseReady()) {
      const orders = getLocalOrders();
      orders.unshift(newOrder);
      saveLocalOrders(orders);
      return newOrder;
    }

    try {
      await setDoc(doc(db, ORDERS_COLLECTION, id), newOrder);
      return newOrder;
    } catch (err) {
      console.warn("Firestore write error, saving locally:", err);
      const orders = getLocalOrders();
      orders.unshift(newOrder);
      saveLocalOrders(orders);
      return newOrder;
    }
  },

  // Cập nhật đơn hàng
  async updateOrder(id: string, updates: Partial<OrderDTO>): Promise<OrderDTO> {
    const updatedAt = new Date().toISOString();
    const dataToUpdate = { ...updates, updatedAt };

    if (!isFirebaseReady()) {
      const orders = getLocalOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...dataToUpdate };
        saveLocalOrders(orders);
        return orders[idx];
      }
      throw new Error("Không tìm thấy đơn hàng");
    }

    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      await updateDoc(docRef, dataToUpdate);
      const updated = await this.getOrderById(id);
      if (!updated) throw new Error("Cập nhật thất bại");
      return updated;
    } catch (err) {
      console.warn("Firestore update error, updating locally:", err);
      const orders = getLocalOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...dataToUpdate };
        saveLocalOrders(orders);
        return orders[idx];
      }
      throw err;
    }
  },

  // Xóa đơn hàng
  async deleteOrder(id: string): Promise<void> {
    if (!isFirebaseReady()) {
      const orders = getLocalOrders().filter((o) => o.id !== id);
      saveLocalOrders(orders);
      return;
    }
    try {
      await deleteDoc(doc(db, ORDERS_COLLECTION, id));
    } catch (err) {
      console.warn("Firestore delete error:", err);
      const orders = getLocalOrders().filter((o) => o.id !== id);
      saveLocalOrders(orders);
    }
  },
};
