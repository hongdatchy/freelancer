import { MilestoneDTO, MilestoneStatus } from "@/dto/MilestoneDTO";
import { OrderDTO } from "@/dto/OrderDTO";
import { orderService } from "./order-service";

export const milestoneService = {
  // Cập nhật một mốc cụ thể trong đơn hàng
  async updateMilestone(
    orderId: string,
    milestoneId: string,
    updates: Partial<MilestoneDTO>
  ): Promise<OrderDTO> {
    const order = await orderService.getOrderById(orderId);
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    const updatedMilestones = order.milestones.map((m) => {
      if (m.id === milestoneId) {
        const updatedItem: MilestoneDTO = {
          ...m,
          ...updates,
        };

        if (updates.status === "COMPLETED") {
          updatedItem.completedAt = m.completedAt || new Date().toISOString();
        } else if (updates.status && updates.status !== "COMPLETED") {
          delete updatedItem.completedAt;
        }

        return updatedItem;
      }
      return m;
    });

    // Xác định lại currentStep (mốc đang thực hiện)
    let currentStep = order.currentStep;
    const inProgressIndex = updatedMilestones.findIndex(
      (m) => m.status === "IN_PROGRESS" || m.status === "PENDING"
    );
    if (inProgressIndex !== -1) {
      currentStep = updatedMilestones[inProgressIndex].stepNumber;
    } else if (updatedMilestones.every((m) => m.status === "COMPLETED")) {
      currentStep = 7;
    }

    // Nếu tất cả mốc đã hoàn thành, đổi trạng thái đơn sang COMPLETED
    const orderStatus = updatedMilestones.every((m) => m.status === "COMPLETED")
      ? "COMPLETED"
      : updatedMilestones.some((m) => m.status === "DELAYED")
      ? "DELAYED"
      : "IN_PROGRESS";

    return orderService.updateOrder(orderId, {
      milestones: updatedMilestones,
      currentStep,
      status: orderStatus,
    });
  },

  // Đổi nhanh trạng thái mốc
  async setMilestoneStatus(
    orderId: string,
    milestoneId: string,
    status: MilestoneStatus
  ): Promise<OrderDTO> {
    return this.updateMilestone(orderId, milestoneId, { status });
  },
};
