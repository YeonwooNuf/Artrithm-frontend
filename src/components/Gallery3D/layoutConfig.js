export const getLayoutConfig = (theme) => {
  switch (theme) {
    case "modern":
      return {
        galleryModelPath: "/models/vr_art_gallery_01.glb",
        environment: "night",
        playerStart: [-17, 2, 0],
        getPosition: (index) => {
          const isRightWall = index % 2 === 0;
          const gap = 7;
          const baseX = Math.floor(index / 2) * gap;
          return {
            position: [baseX - 10, 2, isRightWall ? 12 : -12],
            rotation: [0, isRightWall ? Math.PI : 0, 0],
          };
        },
        getFocusTransform: () => ({
          position: [7.5, 3, 0],
          rotation: [0, -Math.PI / 2, 0],
        }),
        focusScale: 16,
      };

    case "circle":
      return {
        galleryModelPath: "/models/art_gallery.glb",
        environment: "sunset",
        playerStart: [0, 0.8, -12],

        getPosition: (index, total) => {
          const outerRadius = 16.3;
          const innerRadius = 9.3;

          if (total <= 6) {
            // 6개 이하: 12개로 복제
            const slotIndex = index % 12; // 그냥 0~11번 칸에 다 배치
            const angle = (slotIndex / 12) * 2 * Math.PI;
            const x = Math.sin(angle) * outerRadius;
            const z = Math.cos(angle) * outerRadius;
            const y = 3.5;
            return {
              position: [x, y, z],
              rotation: [0, angle + Math.PI, 0],
            };
          } else {
            if (index < 6) {
              // 바깥쪽 6개 먼저
              const slotIndex = (index * 2) % 12;
              const angle = (slotIndex / 12) * 2 * Math.PI;
              const x = Math.sin(angle) * outerRadius;
              const z = Math.cos(angle) * outerRadius;
              const y = 3.5;
              return {
                position: [x, y, z],
                rotation: [0, angle + Math.PI, 0],
              };
            } else {
              // 안쪽 중심
              const centerIndex = index - 6;
              const angle = (centerIndex / 4) * 2 * Math.PI;
              const x = Math.sin(angle) * innerRadius;
              const z = Math.cos(angle) * innerRadius;
              const y = 3.5;
              return {
                position: [x, y, z],
                rotation: [0, angle + Math.PI, 0],
              };
            }
          }
        },

        getFocusTransform: () => ({
          position: [0, 3, 0],
          rotation: [0, 0, 0],
        }),

        focusScale: 8,
      };

    default:
      throw new Error(`Unknown theme: ${theme}`);
  }
};
