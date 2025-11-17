import { useMemo } from "react";
import { showToast } from "./toast";

export function useScaleTools() {
  const options = useMemo(() => {
    const result = [];
    for (let i = 0.25; i <= 3; i += 0.25) {
      result.push({
        label: i * 100 + "%",
        value: i,
      });
    }
    return result;
  }, []);

  // 在 options 固定范围内改变缩放比
  const getScaleInOption = (scale = 1): number => {
    let target: number = 1;
    let gap: number;

    options.forEach((option) => {
      const currentGap = Math.abs(option.value - scale);
      if (!gap || currentGap < gap) {
        gap = currentGap;
        target = option.value;
      }
    });

    return target;
  };

  return {
    options,
    getScaleInOption,
  };
}

export const useCopy = () => {
  const copyToClipboard = async (text: string) => {
    // 优先使用 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        showToast("复制成功！");
        return;
      } catch (err) {
        console.error("现代API复制失败", err);
      }
    }

    // 如果 Clipboard API 不可用，尝试使用 Permissions API
    try {
      const permission = await navigator.permissions.query({
        name: "clipboard-write" as PermissionName,
      });
      if (permission.state === "granted" || permission.state === "prompt") {
        await navigator.clipboard.writeText(text);
        showToast("复制成功！");
        return;
      }
    } catch (err) {
      console.error("权限检查失败", err);
    }

    // 最后的后备方案
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        showToast("复制成功！");
      } else {
        showToast("复制失败，请重试");
      }
    } catch (err) {
      showToast("复制失败，请重试");
      console.error("复制失败:", err);
    }
  };

  return { copyToClipboard };
};
